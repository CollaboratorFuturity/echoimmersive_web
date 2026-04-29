from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ContactCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    organisation: str = Field(default="", max_length=255)
    subject: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1, max_length=5000)
    consent_acknowledged: bool


class ContactResponse(BaseModel):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}
