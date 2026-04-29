import csv
import io
import secrets

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.newsletter import NewsletterSubscriber

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
