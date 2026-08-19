# SalonOS — Backend Foundation

Production-ready backend **foundation** for SalonOS. This scaffold intentionally
contains **no business logic, no auth implementation, and no database tables** —
it is the clean base every future domain module (users, salons, bookings, staff,
payments, …) will be built on top of.

---

## Stack

| Concern            | Choice                          |
|---------------------|----------------------------------|
| Language            | Python 3.13+                    |
| Framework           | FastAPI                         |
| ORM                 | SQLAlchemy 2.0 (declarative)     |
| Database            | PostgreSQL                      |
| Migrations          | Alembic                         |
| Validation/Settings | Pydantic v2 / pydantic-settings |
| Auth (config only)  | JWT (python-jose)                |
| Server              | Uvicorn                         |

---

## Folder Structure

```
salonos-backend/
├── app/
│   ├── main.py                     # FastAPI app factory & entrypoint
│   ├── api/
│   │   └── v1/
│   │       ├── router.py           # Aggregates all v1 routers
│   │       └── endpoints/
│   │           └── health.py       # GET /api/v1/health (verifies DB connectivity)
│   ├── core/
│   │   ├── config.py               # Settings (env vars) — single source of truth
│   │   ├── logging.py              # Centralized logging configuration
│   │   └── exceptions.py           # Custom exceptions + global handlers
│   ├── db/
│   │   ├── base.py                 # SQLAlchemy declarative Base
│   │   └── session.py              # Engine, SessionLocal, get_db dependency
│   ├── models/
│   │   ├── mixins.py                # AuditMixin: id/created_at/updated_at/created_by/updated_by/deleted_at/is_active
│   │   └── organization.py          # `organizations` table — first business model
│   ├── schemas/
│   │   └── response.py             # Generic APIResponse[T] envelope
│   └── middleware/                 # Reserved for future custom middleware
├── alembic/
│   ├── env.py                      # Wired to app settings + Base.metadata (imports app.models)
│   ├── script.py.mako              # Migration file template
│   └── versions/
│       └── 799b891c8f5e_create_organizations_table.py   # First migration
├── alembic.ini                     # Alembic config (URL injected at runtime)
├── .env.example                    # Documented environment variable template
├── .gitignore
├── requirements.txt
└── README.md
```

### Folder-by-folder explanation

- **`app/`** — All application source code lives here. Nothing outside `app/`
  is importable Python, keeping a clean boundary between "the app" and
  tooling/config (Alembic, Docker, etc.).

- **`app/main.py`** — The single entrypoint. Uses an **application-factory**
  pattern (`create_app()`) so the FastAPI instance can be constructed
  side-effect-free for testing, while `uvicorn app.main:app` still works
  normally in production. Wires together CORS, exception handlers, and the
  versioned API router.

- **`app/api/`** — Everything HTTP/routing related, namespaced by version.
  - **`app/api/v1/router.py`** — The *only* file that aggregates endpoint
    routers for v1. Adding a new endpoint module never requires touching
    `main.py` — only this file.
  - **`app/api/v1/endpoints/`** — One module per resource/concern. Currently
    only `health.py`. Future modules (e.g. `salons.py`, `appointments.py`)
    go here and get registered in `router.py`.
  - This structure is what gives us **API versioning**: a future `app/api/v2/`
    can be added and mounted at a different prefix without touching v1.

- **`app/core/`** — Cross-cutting application concerns that aren't tied to
  any single resource:
  - **`config.py`** — All environment variables are parsed and validated
    exactly once here via `pydantic-settings`. Every other module imports
    `settings` from here rather than calling `os.environ` directly.
  - **`logging.py`** — One `dictConfig` call configures the root logger,
    Uvicorn's loggers, and SQLAlchemy's engine logger consistently, with a
    JSON-formatter option for production log aggregation.
  - **`exceptions.py`** — Defines the `AppException` hierarchy (base class
    for future domain errors) and registers global FastAPI exception
    handlers so *every* error (validation, HTTP, domain, or unhandled bug)
    is normalized into the same JSON error shape.

- **`app/db/`** — Persistence plumbing only:
  - **`base.py`** — The shared `DeclarativeBase` subclass every ORM model
    inherits from.
  - **`session.py`** — The SQLAlchemy `engine`, `SessionLocal` factory, and
    the `get_db()` FastAPI dependency for per-request sessions.

- **`app/models/`** — ORM models (the actual database schema):
  - **`mixins.py`** — `AuditMixin`, mixed into every model, providing
    `id` (BIGSERIAL PK), `created_at`, `updated_at` (DB-managed timestamps),
    `created_by` / `updated_by` (plain nullable IDs — no FK yet, since no
    `users` table exists in this phase), `deleted_at` (soft delete), and
    `is_active`.
  - **`organization.py`** — `Organization`, mapped to the `organizations`
    table. The first and only business table in this phase. Standalone —
    no foreign keys to other tables yet.
  - **`__init__.py`** — Imports every model so it registers on
    `Base.metadata`. This is the one file to update when a new model is
    added; `alembic/env.py` imports this package so autogenerate always
    sees the full schema.

- **`app/schemas/`** — Pydantic v2 models shared across the API surface.
  - **`response.py`** — `APIResponse[T]`, the generic success/error envelope
    every endpoint should use, plus `.ok()` / `.fail()` convenience
    constructors. Error responses raised via `app/core/exceptions.py` match
    this exact shape.

- **`app/middleware/`** — Currently empty (CORS uses FastAPI's built-in
  `CORSMiddleware`, configured in `main.py`). Reserved for future custom
  middleware (request ID injection, request timing, tenant resolution, etc.)
  so it has an obvious home when needed.

- **`alembic/`** — Migration tooling, wired to the app rather than duplicating
  config:
  - **`env.py`** — Reads the DB URL from `app.core.config.settings` (not a
    hardcoded string), and points `target_metadata` at `app.db.base.Base`
    so `alembic revision --autogenerate` will pick up future models
    automatically once they're imported here.
  - **`script.py.mako`** — Template used to generate new migration files.
  - **`versions/`** — Intentionally empty. No tables exist yet — this
    scaffold does not create any migrations.

- **`alembic.ini`** — Alembic's own config file. `sqlalchemy.url` is left
  blank on purpose; `env.py` injects it at runtime so there's a single
  source of truth for the connection string (`.env` → `Settings` → Alembic).

- **`.env.example`** — Every environment variable the app reads, documented
  with sane local defaults. Copy to `.env` (git-ignored) for local dev.

- **`requirements.txt`** — Pinned dependencies for the stack above.

---

## Getting Started

```bash
# 1. Create and activate a virtual environment
python3.13 -m venv .venv
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# edit .env with real Postgres credentials, JWT secret, etc.

# 4. Run the API
uvicorn app.main:app --reload
```

Visit:
- `GET http://localhost:8000/api/v1/health` — runs `SELECT 1` against
  PostgreSQL and returns:
  ```json
  {"status": "healthy", "version": "0.1.0", "database": "connected"}
  ```
  If the database is unreachable, this returns a `503` with the standard
  `APIResponse` error envelope instead of a raw exception.
- `GET http://localhost:8000/docs` (Swagger UI, only when `DEBUG=true`)

## Database & Migrations

The schema currently contains exactly one table: **`organizations`**
(migration `799b891c8f5e_create_organizations_table.py`). It carries the
full `AuditMixin` column set (`id`, `created_at`, `updated_at`,
`created_by`, `updated_by`, `deleted_at`, `is_active`) plus the business
columns (`name`, `owner_name`, `email`, `phone`, `gst_number`, `address`,
`city`, `state`, `country`, `timezone`, `currency`, `logo_url`).

### Applying the migration

```bash
# Point .env at a running PostgreSQL instance first, then:
alembic upgrade head
```

### Migration command reference

| Command | What it does |
|---|---|
| `alembic upgrade head` | Applies all pending migrations up to the latest one. Run this after pulling new migrations or on a fresh database. |
| `alembic upgrade +1` | Applies just the next single migration. |
| `alembic downgrade -1` | Reverts the most recently applied migration (runs its `downgrade()`). |
| `alembic downgrade base` | Reverts every migration, returning to an empty schema. |
| `alembic current` | Shows which revision the connected database is currently stamped at. |
| `alembic history --verbose` | Lists every migration in order, oldest to newest, with details. |
| `alembic revision --autogenerate -m "message"` | Diffs `Base.metadata` (i.e. every model imported in `app/models/__init__.py`) against the live database and generates a new migration file capturing the difference. **Always inspect the generated file before applying it** — autogenerate is a diffing aid, not a guarantee. |
| `alembic revision -m "message"` | Creates a blank migration file (no autogenerate) for manual/data migrations. |
| `alembic stamp head` | Marks the database as being at `head` **without running any migrations** — used when a schema was created out-of-band and Alembic just needs to be told where it stands. |

### Adding the next table

1. Create the model in `app/models/<name>.py`, inheriting `AuditMixin` and
   `Base`.
2. Import and export it from `app/models/__init__.py`.
3. Run `alembic revision --autogenerate -m "create <table_name>"`.
4. Review the generated migration, then `alembic upgrade head`.

## What's intentionally NOT here

Per scope, this codebase does **not** include:
- Login / authentication endpoints or logic
- A `users` table (which is why `created_by` / `updated_by` are plain
  nullable `BigInteger` columns, not foreign keys, for now)
- Any table beyond `organizations`
- Business logic of any kind

JWT settings exist in `app/core/config.py` purely as configuration so a
future auth module can be dropped in without another settings pass.
