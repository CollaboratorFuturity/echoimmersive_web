from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_USE_TLS: bool = True
    SMTP_FROM_NAME: str = "Immersive ECHO"
    SMTP_FROM_EMAIL: str = "noreply@echoimmersive.eu"
    CONTACT_RECIPIENT_EMAIL: str = ""
    SITE_URL: str = "https://echoimmersive.futurity.science"
    ALLOWED_ORIGINS: str = "*"
    ADMIN_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings() -> Settings:
    return Settings()
