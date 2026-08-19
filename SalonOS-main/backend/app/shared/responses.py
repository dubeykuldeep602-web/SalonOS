"""
app/shared/responses.py

Reusable generic API response envelope, used across all endpoints.
"""

from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class ErrorDetail(BaseModel):
    code: str
    details: Optional[Any] = None


class APIResponse(BaseModel, Generic[DataT]):
    success: bool = Field(..., description="Whether the request succeeded.")
    data: Optional[DataT] = Field(default=None, description="Response payload, if any.")
    message: str = Field(default="OK", description="Human-readable summary of the result.")
    error: Optional[ErrorDetail | dict[str, Any]] = Field(
        default=None, description="Error information when success is False."
    )

    @classmethod
    def ok(cls, data: DataT | None = None, message: str = "OK") -> "APIResponse[DataT]":
        return cls(success=True, data=data, message=message, error=None)

    @classmethod
    def fail(
        cls,
        message: str = "An error occurred.",
        code: str = "APP_ERROR",
        details: Any = None,
    ) -> "APIResponse[None]":
        return cls(
            success=False,
            data=None,
            message=message,
            error={"code": code, "details": details},
        )