from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

# The 10 EU languages ECHO commits to — keep in sync with SUPPORTED_LANGUAGES in src/i18n.ts.
LANGUAGES = ("en", "fr", "de", "es", "it", "nl", "sv", "da", "sl", "ro")
Language = Literal["en", "fr", "de", "es", "it", "nl", "sv", "da", "sl", "ro"]


class NewsletterCreate(BaseModel):
    email: EmailStr
    first_name: str = Field(default="", max_length=255)
    last_name: str = Field(default="", max_length=255)
    organisation: str = Field(default="", max_length=255)
    language: Language = "en"
    consent_acknowledged: bool


class NewsletterResponse(BaseModel):
    id: str
    created_at: datetime
    # True when an existing active subscriber re-submitted and we updated their
    # preferences (language/name) instead of creating a new subscription.
    updated: bool = False

    model_config = {"from_attributes": True}


class NewsletterSendRequest(BaseModel):
    # subject/html are only required for a test preview. A live send pulls each
    # subscriber's language's stored issue instead (English fallback).
    subject: str | None = Field(default=None, max_length=255)
    html: str | None = None
    # When set, sends ONLY to this address (with a dummy unsubscribe link) — no subscribers are emailed.
    test_email: EmailStr | None = None
    # When set, does a REAL send (personal unsubscribe link) but only to this one active subscriber.
    only_email: EmailStr | None = None


class NewsletterSendResult(BaseModel):
    mode: str  # "test" | "live"
    sent: int
    failed: int
    failures: list[str]


class NewsletterSetCurrentRequest(BaseModel):
    subject: str = Field(min_length=1, max_length=255)
    html: str = Field(min_length=1)
    language: Language = "en"


class NewsletterCurrentInfo(BaseModel):
    language: str
    subject: str
    updated_at: datetime
    html_bytes: int
