"""
app/shared/pagination.py

Pagination helpers and standard response schema.
"""

from typing import Generic, Sequence, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams:
    """Dependency for extracting page & page_size query parameters."""

    def __init__(
        self,
        page: int = 1,
        page_size: int = 20,
    ) -> None:
        self.page = max(1, page)
        self.page_size = min(max(1, page_size), 100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size


class PaginatedData(BaseModel, Generic[T]):
    items: Sequence[T] = Field(default_factory=list, description="List of items in the current page.")
    total: int = Field(..., description="Total count of items matching the query.")
    page: int = Field(..., description="Current page number.")
    page_size: int = Field(..., description="Number of items per page.")
    pages: int = Field(..., description="Total number of pages.")
