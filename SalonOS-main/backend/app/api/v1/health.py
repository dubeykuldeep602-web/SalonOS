"""
app/api/v1/health.py

Health-check endpoint.

Verifies both application liveness and database connectivity by executing
a trivial `SELECT 1` against PostgreSQL through the shared `get_db`
dependency. If the database is unreachable, a `ServiceUnavailableException`
is raised and rendered by the centralized exception handlers as a
normalized 503 error response — the caller never gets a raw stack trace.
"""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.exceptions import ServiceUnavailableException

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/health",
    summary="Health check",
    description="Returns service health, version, and database connectivity status.",
)
def health_check(db: Session = Depends(get_db)) -> dict:
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError:
        logger.exception("Health check failed: database connection error.")
        raise ServiceUnavailableException(
            message="Database connection failed.",
            database="disconnected",
        )

    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "database": "connected",
    }