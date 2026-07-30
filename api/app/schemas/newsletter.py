from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class NewsletterCreate(BaseModel):
    email: EmailStr
    first_name: str = Field(default="", max_length=255)
    last_name: str = Field(default="", max_length=255)
    organisation: str = Field(default="", max_length=255)
    consent_acknowledged: bool


class NewsletterResponse(BaseModel):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}


class NewsletterSendRequest(BaseModel):
    subject: str = Field(min_length=1, max_length=255)
    html: str = Field(min_length=1)
    # When set, sends ONLY to this address (with a dummy unsubscribe link) — no subscribers are emailed.
    test_email: EmailStr | None = None
    # When set, does a REAL send (personal unsubscribe link) but only to this one active subscriber.
    only_email: EmailStr | None = None


class NewsletterSendResult(BaseModel):
    mode: str  # "test" | "live"
    sent: int
    failed: int
    failures: list[str]
