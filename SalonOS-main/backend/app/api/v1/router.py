"""
app/api/v1/router.py

Aggregates all v1 endpoint routers into a single `api_router`.

This is the ONE place that needs to change when a new endpoint module is
added under `app/api/v1/endpoints/` — `app/main.py` only ever imports this
single aggregated router, never individual endpoint modules directly.
"""

from fastapi import APIRouter

from app.api.v1 import dashboard, health

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(dashboard.router, tags=["Dashboard"])

# Future versioned endpoint groups get registered here, e.g.:
# api_router.include_router(salons.router, prefix="/salons", tags=["Salons"])
