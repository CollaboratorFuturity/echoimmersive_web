import asyncio
import logging
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import HTMLResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.newsletter import NewsletterSubscriber
from app.schemas.newsletter import NewsletterCreate, NewsletterResponse
from app.services.email_service import send_email

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Newsletter"])


def _unsubscribe_url(token: str) -> str:
    return f"{get_settings().SITE_URL}/api/v1/public/newsletter/unsubscribe?token={token}"


@router.post("/public/newsletter", response_model=NewsletterResponse, status_code=201)
async def subscribe(payload: NewsletterCreate, db: AsyncSession = Depends(get_db)):
    if not payload.consent_acknowledged:
        raise HTTPException(422, "You must agree to the privacy policy to subscribe.")

    result = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == payload.email)
    )
    existing = result.scalar_one_or_none()

    if existing:
        if existing.status == "active":
            raise HTTPException(409, "This email is already subscribed.")
        # Re-subscribe: reactivate, refresh token + name fields
        existing.status = "active"
        existing.first_name = payload.first_name or existing.first_name
        existing.last_name = payload.last_name or existing.last_name
        existing.organisation = payload.organisation or existing.organisation
        existing.consent_acknowledged_at = datetime.now(timezone.utc)
        existing.unsubscribe_token = secrets.token_urlsafe(32)
        await db.commit()
        await db.refresh(existing)
        asyncio.ensure_future(_email_welcome(existing))
        return existing

    subscriber = NewsletterSubscriber(
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        organisation=payload.organisation,
        consent_acknowledged_at=datetime.now(timezone.utc),
    )
    db.add(subscriber)
    await db.commit()
    await db.refresh(subscriber)

    asyncio.ensure_future(_email_welcome(subscriber))
    return subscriber


@router.get("/public/newsletter/unsubscribe", response_class=HTMLResponse)
async def unsubscribe(token: str = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.unsubscribe_token == token)
    )
    sub = result.scalar_one_or_none()
    if not sub:
        return HTMLResponse(_landing_page(
            heading="Unsubscribe link is invalid",
            body="This link is no longer valid. If you're still receiving emails, please contact us.",
        ), status_code=404)

    if sub.status == "unsubscribed":
        return HTMLResponse(_landing_page(
            heading="You've already unsubscribed",
            body=f"{sub.email} is no longer on our newsletter list.",
        ))

    sub.status = "unsubscribed"
    await db.commit()

    return HTMLResponse(_landing_page(
        heading="You've been unsubscribed",
        body=f"We've removed {sub.email} from the Immersive ECHO newsletter. Sorry to see you go.",
    ))


# ── email helpers ──────────────────────────────────────────────────────────

async def _email_welcome(sub: NewsletterSubscriber) -> None:
    name = sub.first_name or "there"
    unsub_link = _unsubscribe_url(sub.unsubscribe_token)
    html = f"""
    <h2>You're subscribed to Immersive ECHO</h2>
    <p>Hi {name}, thanks for subscribing!</p>
    <p>You'll receive updates on new outputs, events, and findings from across the consortium.</p>
    <hr>
    <p style="color:#888;font-size:12px;">Don't want these emails? <a href="{unsub_link}">Unsubscribe</a>.</p>
    """
    try:
        await send_email(sub.email, "Welcome to the Immersive ECHO newsletter", html)
    except Exception:
        logger.exception("Failed to send welcome email to %s", sub.email)


def _landing_page(heading: str, body: str) -> str:
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{heading} — Immersive ECHO</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body {{ margin:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background:#202124; color:#F7F3E0; min-height:100vh; display:flex; align-items:center;
          justify-content:center; padding:24px; }}
  .card {{ max-width: 520px; text-align:center; padding: 48px 32px;
           border:1px solid rgba(218,128,255,0.3); border-radius:12px;
           background: rgba(90,66,99,0.15); }}
  h1 {{ color:#DA80FF; font-size: 1.6rem; margin: 0 0 16px; }}
  p {{ color: rgba(247,243,224,0.75); line-height:1.6; }}
  a.btn {{ display:inline-block; margin-top:24px; padding:12px 28px; background:#DA80FF;
           color:#202124; text-decoration:none; border-radius:6px; font-weight:bold;
           text-transform:uppercase; letter-spacing:0.05em; font-size:0.85rem; }}
</style>
</head>
<body>
  <div class="card">
    <h1>{heading}</h1>
    <p>{body}</p>
    <a class="btn" href="{get_settings().SITE_URL}">Back to Immersive ECHO</a>
  </div>
</body>
</html>"""
