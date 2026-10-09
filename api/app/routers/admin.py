import csv
import io
import logging
import secrets

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.newsletter import NewsletterIssueByLang, NewsletterSubscriber
from app.schemas.newsletter import (
    NewsletterCurrentInfo,
    NewsletterSendRequest,
    NewsletterSendResult,
    NewsletterSetCurrentRequest,
)
from app.services.email_service import send_email
from app.services.newsletter_content import (
    get_issue_for_language,
    render_issue,
    store_issue_for_language,
    unsubscribe_url,
)

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
        "email", "first_name", "last_name", "organisation", "language",
        "status", "consent_acknowledged_at", "created_at",
    ])
    for s in subscribers:
        writer.writerow([
            s.email,
            s.first_name or "",
            s.last_name or "",
            s.organisation or "",
            s.language,
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


@router.post(
    "/admin/newsletter/current",
    response_model=NewsletterCurrentInfo,
    dependencies=[Depends(require_api_key)],
)
async def set_current_issue(payload: NewsletterSetCurrentRequest, db: AsyncSession = Depends(get_db)):
    """Store an issue as 'current' for one language (sent to new subscribers of
    that language) without sending anything. Call once per language."""
    issue = await store_issue_for_language(db, payload.language, payload.subject, payload.html)
    return NewsletterCurrentInfo(
        language=issue.language,
        subject=issue.subject,
        updated_at=issue.updated_at,
        html_bytes=len(issue.html.encode()),
    )


@router.get(
    "/admin/newsletter/current",
    response_model=NewsletterCurrentInfo,
    dependencies=[Depends(require_api_key)],
)
async def get_current_issue(
    language: str = Query(default="en", description="Language code"),
    db: AsyncSession = Depends(get_db),
):
    issue = await db.get(NewsletterIssueByLang, language)
    if not issue:
        raise HTTPException(404, f"No current issue stored for language '{language}'.")
    return NewsletterCurrentInfo(
        language=issue.language,
        subject=issue.subject,
        updated_at=issue.updated_at,
        html_bytes=len(issue.html.encode()),
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
        if not payload.subject or not payload.html:
            raise HTTPException(422, "A test send requires both 'subject' and 'html'.")
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

    # Live send: each subscriber gets the stored issue for THEIR language,
    # falling back to English. Issues are uploaded per language beforehand via
    # POST /admin/newsletter/current, so no subject/html is needed here.
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

    # Cache issue lookups per language (fallback resolved once per language).
    issue_cache: dict[str, tuple[str, str] | None] = {}

    sent = 0
    failures: list[str] = []
    for sub in subscribers:
        if sub.language not in issue_cache:
            issue_cache[sub.language] = await get_issue_for_language(db, sub.language)
        issue = issue_cache[sub.language]
        if issue is None:
            logger.warning("No newsletter issue available for %s (language %s)", sub.email, sub.language)
            failures.append(sub.email)
            continue
        subject, raw_html = issue
        html = _render_issue(
            raw_html,
            first_name=sub.first_name or "there",
            unsub_url=_unsubscribe_url(sub.unsubscribe_token),
        )
        try:
            await send_email(sub.email, subject, html)
            sent += 1
        except Exception:
            logger.exception("Newsletter send to %s failed", sub.email)
            failures.append(sub.email)

    return NewsletterSendResult(mode="live", sent=sent, failed=len(failures), failures=failures)
