"""Shared helpers for rendering newsletter issues per subscriber."""

from app.config import get_settings


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
