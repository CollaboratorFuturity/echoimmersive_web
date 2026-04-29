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
