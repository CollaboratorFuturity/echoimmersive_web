"""Shared helpers for rendering + storing newsletter issues per subscriber."""

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.newsletter import NewsletterCurrentIssue, NewsletterIssueByLang

DEFAULT_LANG = "en"


def unsubscribe_url(token: str) -> str:
    return f"{get_settings().SITE_URL}/api/v1/public/newsletter/unsubscribe?token={token}"


def render_issue(html: str, first_name: str, unsub_url: str) -> str:
    body = html.replace("{{first_name}}", first_name)
    # Issues with their own footer place the link via {{unsubscribe_url}};
    # otherwise a plain footer is appended.
    if "{{unsubscribe_url}}" in body:
        return body.replace("{{unsubscribe_url}}", unsub_url)
    footer = (
        '<hr><p style="color:#888;font-size:12px;">'
        "You're receiving this because you subscribed to the Immersive ECHO newsletter. "
        f'<a href="{unsub_url}">Unsubscribe</a>.</p>'
    )
    return body + footer


# ── Per-language current-issue storage ──────────────────────────────────────

async def store_issue_for_language(
    db: AsyncSession, language: str, subject: str, html: str
) -> NewsletterIssueByLang:
    """Upsert the current issue for one language."""
    row = await db.get(NewsletterIssueByLang, language)
    now = datetime.now(timezone.utc)
    if row:
        row.subject = subject
        row.html = html
        row.updated_at = now
    else:
        row = NewsletterIssueByLang(language=language, subject=subject, html=html, updated_at=now)
        db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


async def get_issue_for_language(db: AsyncSession, language: str) -> tuple[str, str] | None:
    """Return (subject, html) for a language: exact match → English → legacy
    single-row issue. None if nothing is stored at all."""
    row = await db.get(NewsletterIssueByLang, language)
    if row is None and language != DEFAULT_LANG:
        row = await db.get(NewsletterIssueByLang, DEFAULT_LANG)
    if row is not None:
        return (row.subject, row.html)
    # Legacy fallback: the old single-row (English) issue.
    result = await db.execute(select(NewsletterCurrentIssue))
    legacy = result.scalar_one_or_none()
    return (legacy.subject, legacy.html) if legacy else None


# ── Localized welcome email (rendered in the backend, so strings live here) ──
# Only English + Spanish are populated; other languages fall back to English.
# Keep in sync conceptually with public/locales/*/translation.json.

WELCOME_EMAILS: dict[str, dict[str, str]] = {
    "en": {
        "subject": "Welcome to the Immersive ECHO newsletter",
        "heading": "You're subscribed to Immersive ECHO",
        "greeting": "Hi {name}, thanks for subscribing!",
        "body": "You'll receive updates on new outputs, events, and findings from across the consortium.",
        "unsub_prefix": "Don't want these emails?",
        "unsub": "Unsubscribe",
    },
    "es": {
        "subject": "Te damos la bienvenida al boletín de Immersive ECHO",
        "heading": "Te has suscrito a Immersive ECHO",
        "greeting": "Hola {name}, ¡gracias por suscribirte!",
        "body": "Recibirás novedades sobre nuevos resultados, eventos y hallazgos de todo el consorcio.",
        "unsub_prefix": "¿No quieres estos correos?",
        "unsub": "Darse de baja",
    },
}


def render_welcome(language: str, name: str, unsub_url: str) -> tuple[str, str]:
    """Return (subject, html) for the welcome email in the subscriber's
    language, falling back to English."""
    c = WELCOME_EMAILS.get(language) or WELCOME_EMAILS[DEFAULT_LANG]
    html = (
        f"<h2>{c['heading']}</h2>"
        f"<p>{c['greeting'].format(name=name)}</p>"
        f"<p>{c['body']}</p>"
        '<hr>'
        f'<p style="color:#888;font-size:12px;">{c["unsub_prefix"]} '
        f'<a href="{unsub_url}">{c["unsub"]}</a>.</p>'
    )
    return (c["subject"], html)
