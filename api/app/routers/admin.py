import csv
import io
import logging
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.newsletter import NewsletterCurrentIssue, NewsletterSubscriber
from app.schemas.newsletter import (
    NewsletterCurrentInfo,
    NewsletterSendRequest,
    NewsletterSendResult,
    NewsletterSetCurrentRequest,
)
from app.services.email_service import send_email
from app.services.newsletter_content import render_issue, unsubscribe_url

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Admin"])


async def require_api_key(x_api_key: str = Header(default="")) -> None:
    expected = get_settings().ADMIN_API_KEY
    if not expected:
        raise HTTPException(503, "Admin API key not configured on the server.")
    if not secrets.compare_digest(x_api_key, expected):
        raise HTTPException(401, "Invalid or missing X-API-Key header.")


@router.get("/admin/newsletter/export", dependencies=[Depends(require_api_key)])
async def export_newsletter(
    status: str | None = Query(default="active", description="Filter by status, or 'all'"),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(NewsletterSubscriber).order_by(NewsletterSubscriber.created_at)
    if status and status != "all":
        stmt = stmt.where(NewsletterSubscriber.status == status)

    result = await db.execute(stmt)
    subscribers = result.scalars().all()

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow([
        "email", "first_name", "last_name", "organisation",
        "status", "consent_acknowledged_at", "created_at",
    ])
    for s in subscribers:
        writer.writerow([
            s.email,
            s.first_name or "",
            s.last_name or "",
            s.organisation or "",
            s.status,
            s.consent_acknowledged_at.isoformat() if s.consent_acknowledged_at else "",
            s.created_at.isoformat() if s.created_at else "",
        ])

    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="newsletter-subscribers.csv"'},
    )


# Rendering lives in app.services.newsletter_content (shared with the subscribe flow).
_render_issue = render_issue
_unsubscribe_url = unsubscribe_url


async def _store_current_issue(db: AsyncSession, subject: str, html: str) -> NewsletterCurrentIssue:
    result = await db.execute(select(NewsletterCurrentIssue))
    issue = result.scalar_one_or_none()
    now = datetime.now(timezone.utc)
    if issue:
        issue.subject = subject
        issue.html = html
        issue.updated_at = now
    else:
        issue = NewsletterCurrentIssue(id=1, subject=subject, html=html, updated_at=now)
        db.add(issue)
    await db.commit()
    await db.refresh(issue)
    return issue


@router.post(
    "/admin/newsletter/current",
    response_model=NewsletterCurrentInfo,
    dependencies=[Depends(require_api_key)],
)
async def set_current_issue(payload: NewsletterSetCurrentRequest, db: AsyncSession = Depends(get_db)):
    """Store an issue as 'current' (sent to new subscribers) without sending anything."""
    issue = await _store_current_issue(db, payload.subject, payload.html)
    return NewsletterCurrentInfo(
        subject=issue.subject, updated_at=issue.updated_at, html_bytes=len(issue.html.encode())
    )


@router.get(
    "/admin/newsletter/current",
    response_model=NewsletterCurrentInfo,
    dependencies=[Depends(require_api_key)],
)
async def get_current_issue(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(NewsletterCurrentIssue))
    issue = result.scalar_one_or_none()
    if not issue:
        raise HTTPException(404, "No current issue stored yet.")
    return NewsletterCurrentInfo(
        subject=issue.subject, updated_at=issue.updated_at, html_bytes=len(issue.html.encode())
    )


@router.post(
    "/admin/newsletter/send",
    response_model=NewsletterSendResult,
    dependencies=[Depends(require_api_key)],
)
async def send_newsletter(payload: NewsletterSendRequest, db: AsyncSession = Depends(get_db)):
    settings = get_settings()
    if not settings.SMTP_HOST:
        raise HTTPException(503, "SMTP is not configured on the server — nothing can be sent.")

    if payload.test_email:
        html = _render_issue(
            payload.html,
            first_name="there",
            unsub_url=f"{settings.SITE_URL}/api/v1/public/newsletter/unsubscribe?token=test-preview",
        )
        try:
            await send_email(payload.test_email, payload.subject, html)
        except Exception as exc:
            logger.exception("Test newsletter send to %s failed", payload.test_email)
            raise HTTPException(502, f"Test send failed: {exc}") from exc
        return NewsletterSendResult(mode="test", sent=1, failed=0, failures=[])

    stmt = (
        select(NewsletterSubscriber)
        .where(NewsletterSubscriber.status == "active")
        .order_by(NewsletterSubscriber.created_at)
    )
    if payload.only_email:
        stmt = stmt.where(NewsletterSubscriber.email == payload.only_email)
    result = await db.execute(stmt)
    subscribers = result.scalars().all()
    if payload.only_email and not subscribers:
        raise HTTPException(404, f"{payload.only_email} is not an active subscriber.")

    sent = 0
    failures: list[str] = []
    for sub in subscribers:
        html = _render_issue(
            payload.html,
            first_name=sub.first_name or "there",
            unsub_url=_unsubscribe_url(sub.unsubscribe_token),
        )
        try:
            await send_email(sub.email, payload.subject, html)
            sent += 1
        except Exception:
            logger.exception("Newsletter send to %s failed", sub.email)
            failures.append(sub.email)

    # A full send (not filtered to one subscriber) defines the new "current issue"
    # that future subscribers receive on signup.
    if not payload.only_email:
        await _store_current_issue(db, payload.subject, payload.html)

    return NewsletterSendResult(mode="live", sent=sent, failed=len(failures), failures=failures)
