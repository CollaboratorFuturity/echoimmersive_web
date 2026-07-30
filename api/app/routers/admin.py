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
from app.models.newsletter import NewsletterSubscriber
from app.routers.newsletter import _unsubscribe_url
from app.schemas.newsletter import NewsletterSendRequest, NewsletterSendResult
from app.services.email_service import send_email

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


def _render_issue(html: str, first_name: str, unsub_url: str) -> str:
    body = html.replace("{{first_name}}", first_name)
    footer = (
        '<hr><p style="color:#888;font-size:12px;">'
        "You're receiving this because you subscribed to the Immersive ECHO newsletter. "
        f'<a href="{unsub_url}">Unsubscribe</a>.</p>'
    )
    return body + footer


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

    result = await db.execute(
        select(NewsletterSubscriber)
        .where(NewsletterSubscriber.status == "active")
        .order_by(NewsletterSubscriber.created_at)
    )
    subscribers = result.scalars().all()

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

    return NewsletterSendResult(mode="live", sent=sent, failed=len(failures), failures=failures)
