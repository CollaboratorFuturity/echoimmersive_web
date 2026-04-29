import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, engine
import app.models.contact  # noqa: F401  (register table)
import app.models.newsletter  # noqa: F401  (register table)
from app.routers import admin, contact, newsletter

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Auto-create tables on startup. Idempotent — safe to run every boot.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables ensured.")
    yield


app = FastAPI(title="Immersive ECHO API", docs_url=None, redoc_url=None, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-API-Key"],
)

app.include_router(contact.router, prefix="/api/v1")
app.include_router(newsletter.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
