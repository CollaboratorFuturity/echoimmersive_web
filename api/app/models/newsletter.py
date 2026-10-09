import secrets
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def _token() -> str:
    return secrets.token_urlsafe(32)


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    first_name: Mapped[str] = mapped_column(String(255), nullable=True)
    last_name: Mapped[str] = mapped_column(String(255), nullable=True)
    organisation: Mapped[str] = mapped_column(String(255), nullable=True)

    # Preferred newsletter language (ISO 639-1; one of app.schemas.newsletter.LANGUAGES).
    # server_default also backfills rows that existed before this column was added.
    language: Mapped[str] = mapped_column(String(5), nullable=False, default="en", server_default="en")

    # active → unsubscribed via email link
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")

    unsubscribe_token: Mapped[str] = mapped_column(String(64), nullable=False, default=_token, index=True)

    consent_acknowledged_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )


class NewsletterCurrentIssue(Base):
    """Legacy single-row table holding the most recent (English) issue.

    Superseded by NewsletterIssueByLang; kept as an English fallback for
    continuity so previously-stored issues still reach new subscribers during
    the transition to per-language issues.
    """

    __tablename__ = "newsletter_current_issue"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    html: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )


class NewsletterIssueByLang(Base):
    """The current newsletter issue stored per language — one row per language.

    The send picks a subscriber's language and falls back to English when that
    language hasn't been uploaded yet. Rows are written via
    /admin/newsletter/current (one call per language, from the build output).
    """

    __tablename__ = "newsletter_issue_by_lang"

    language: Mapped[str] = mapped_column(String(5), primary_key=True)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    html: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
