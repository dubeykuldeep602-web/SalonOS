"""
app/shared/dependencies.py

Shared FastAPI dependencies.

`get_organization_id` is a TEMPORARY stand-in for tenant resolution until
authentication is wired up. Once login/JWT exists, this should be replaced
by extracting `organization_id` from the authenticated user's session
instead of a query parameter.
"""

from fastapi import Query


def get_organization_id(
    organization_id: int = Query(..., description="Organization (tenant) ID to scope this request to.")
) -> int:
    return organization_id