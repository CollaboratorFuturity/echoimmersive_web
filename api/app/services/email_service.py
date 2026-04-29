import logging

import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import get_settings

logger = logging.getLogger(__name__)


async def send_email(to: str, subject: str, html: str) -> None:
    s = get_settings()
    if not s.SMTP_HOST:
        logger.warning("SMTP_HOST not configured — skipping email to %s", to)
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{s.SMTP_FROM_NAME} <{s.SMTP_FROM_EMAIL}>"
    msg["To"] = to
    msg.attach(MIMEText(html, "html"))

    # Port 465 → implicit TLS. Port 587 (and others) → STARTTLS upgrade.
    use_tls = s.SMTP_USE_TLS and s.SMTP_PORT == 465
    start_tls = s.SMTP_USE_TLS and s.SMTP_PORT != 465

    await aiosmtplib.send(
        msg,
        hostname=s.SMTP_HOST,
        port=s.SMTP_PORT,
        username=s.SMTP_USERNAME or None,
        password=s.SMTP_PASSWORD or None,
        use_tls=use_tls,
        start_tls=start_tls,
    )
