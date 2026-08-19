"""
app/shared/exceptions.py

Re-exports custom exceptions from `app.exceptions` for convenience.
"""

from app.exceptions import (
    AppException,
    ConflictException,
    NotFoundException,
    ServiceUnavailableException,
)

__all__ = [
    "AppException",
    "ConflictException",
    "NotFoundException",
    "ServiceUnavailableException",
]
