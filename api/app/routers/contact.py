import asyncio
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreate, ContactResponse
from app.services.email_service import send_email

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Contact"])


@router.post("/public/contact", response_model=ContactResponse, status_code=201)
async def submit_contact(payload: ContactCreate, db: AsyncSession = Depends(get_db)):
    if not payload.consent_acknowledged:
        raise HTTPException(422, "You must acknowledge the privacy notice.")

    msg = ContactMessage(
        full_name=payload.full_name,
        email=payload.email,
        organisation=payload.organisation,
        subject=payload.subject,
        message=payload.message,
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)

    asyncio.ensure_future(asyncio.gather(
        _email_recipient(msg),
        _email_confirmation(msg),
        return_exceptions=True,
    ))
    return msg


async def _email_recipient(msg: ContactMessage) -> None:
    s = get_settings()
    if not s.CONTACT_RECIPIENT_EMAIL:
        return
    org = f"<p><b>Organisation:</b> {msg.organisation}</p>" if msg.organisation else ""
    html = f"""
    <h2>New contact form submission</h2>
    <p><b>From:</b> {msg.full_name} &lt;{msg.email}&gt;</p>
    {org}
    <p><b>Subject:</b> {msg.subject}</p>
    <p><b>Reference:</b> <code>{msg.id}</code></p>
    <hr>
    <p>{msg.message.replace(chr(10), '<br>')}</p>
    """
    try:
        await send_email(s.CONTACT_RECIPIENT_EMAIL, f"[Contact] {msg.subject}", html)
    except Exception:
        logger.exception("Failed to send recipient email for contact %s", msg.id)


async def _email_confirmation(msg: ContactMessage) -> None:
    html = f"""
    <h2>We received your message</h2>
    <p>Hi {msg.full_name}, thanks for reaching out to Immersive ECHO.</p>
    <p>We will respond to <b>{msg.email}</b> within 5 business days.</p>
    <p>Your reference number: <code>{msg.id}</code></p>
    """
    try:
        await send_email(msg.email, "Thanks for contacting Immersive ECHO", html)
    except Exception:
        logger.exception("Failed to send confirmation email for contact %s", msg.id)
