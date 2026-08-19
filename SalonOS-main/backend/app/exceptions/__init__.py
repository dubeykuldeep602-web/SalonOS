"""
app/exceptions/__init__.py

Centralized exception handling — custom exceptions and FastAPI handlers.
"""

import logging
from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


class AppException(Exception):
    status_code: int = status.HTTP_400_BAD_REQUEST
    error_code: str = "APP_ERROR"

    def __init__(self, message: str = "An application error occurred.", **extra: Any) -> None:
        self.message = message
        self.extra = extra
        super().__init__(message)


class NotFoundException(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "NOT_FOUND"

    def __init__(self, message: str = "Resource not found.", **extra: Any) -> None:
        super().__init__(message, **extra)


class ConflictException(AppException):
    status_code = status.HTTP_409_CONFLICT
    error_code = "CONFLICT"

    def __init__(self, message: str = "Resource conflict.", **extra: Any) -> None:
        super().__init__(message, **extra)


class ServiceUnavailableException(AppException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    error_code = "SERVICE_UNAVAILABLE"

    def __init__(self, message: str = "Service temporarily unavailable.", **extra: Any) -> None:
        super().__init__(message, **extra)


def _error_envelope(message: str, error_code: str, details: Any = None) -> dict[str, Any]:
    return {
        "success": False,
        "data": None,
        "message": message,
        "error": {"code": error_code, "details": details},
    }


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.warning("AppException on %s %s: %s", request.method, request.url.path, exc.message)
    return JSONResponse(
        status_code=exc.status_code,
        content=_error_envelope(exc.message, exc.error_code, exc.extra or None),
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    logger.warning("HTTPException on %s %s: %s", request.method, request.url.path, exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content=_error_envelope(str(exc.detail), "HTTP_ERROR"),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    logger.info("Validation error on %s %s: %s", request.method, request.url.path, exc.errors())
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=_error_envelope("Request validation failed.", "VALIDATION_ERROR", details=exc.errors()),
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=_error_envelope("An unexpected error occurred.", "INTERNAL_SERVER_ERROR"),
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)