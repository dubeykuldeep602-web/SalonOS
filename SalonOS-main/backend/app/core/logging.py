"""
app/core/logging.py

Centralized logging configuration for the whole application.

Design goals:
  - Single place to control log format/level for every module (`logging.getLogger(__name__)`
    anywhere in the codebase automatically inherits this configuration).
  - Human-readable text logs for local development, structured JSON logs for
    staging/production (so they can be ingested by log aggregators such as
    ELK, Datadog, CloudWatch, etc.) — toggled via `LOG_JSON`.
  - Uvicorn's own loggers (`uvicorn`, `uvicorn.access`, `uvicorn.error`) are
    folded into the same configuration so log output is consistent.
"""

import json
import logging
import logging.config
import sys
from datetime import datetime, timezone
from typing import Any

from app.core.config import settings


class JSONFormatter(logging.Formatter):
    """Minimal, dependency-free JSON log formatter."""

    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload)


def configure_logging() -> None:
    """Apply the logging configuration for the entire process."""

    formatter_name = "json" if settings.LOG_JSON else "text"

    logging_config: dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "text": {
                "format": "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "json": {
                "()": JSONFormatter,
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": formatter_name,
                "stream": sys.stdout,
            },
        },
        "root": {
            "handlers": ["console"],
            "level": settings.LOG_LEVEL,
        },
        "loggers": {
            # Keep uvicorn's own loggers, but route them through our handler
            # and format so output stays consistent across the app.
            "uvicorn": {"handlers": ["console"], "level": settings.LOG_LEVEL, "propagate": False},
            "uvicorn.error": {"handlers": ["console"], "level": settings.LOG_LEVEL, "propagate": False},
            "uvicorn.access": {"handlers": ["console"], "level": settings.LOG_LEVEL, "propagate": False},
            "sqlalchemy.engine": {
                "handlers": ["console"],
                "level": "INFO" if settings.DB_ECHO else "WARNING",
                "propagate": False,
            },
        },
    }

    logging.config.dictConfig(logging_config)
