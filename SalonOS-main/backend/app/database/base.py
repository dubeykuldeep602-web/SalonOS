"""
app/db/base.py

SQLAlchemy 2.0 declarative base class.

This is intentionally the ONLY thing defined in this module — no ORM models
or tables. Every future domain model (e.g. `Salon`, `Appointment`, `Staff`)
will subclass `Base` and, when it exists, Alembic's `env.py` imports
`Base.metadata` from here to autogenerate migrations.

Keeping the Base isolated from `session.py` avoids circular imports once
models start living in their own modules (e.g. `app/models/salon.py`
importing `Base` from here, while `session.py` never needs to know about
individual models).
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Shared declarative base for all future ORM models."""

    pass
