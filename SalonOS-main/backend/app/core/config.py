"""
app/core/config.py

Centralized application configuration.

All runtime configuration is sourced from environment variables (or a local
`.env` file). Nothing here should ever hold real secrets — this module only
defines *how* configuration is loaded and validated.
"""

from functools import lru_cache
from typing import Annotated, List, Literal

from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    """Strongly-typed application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ------------------------------------------------------------------ #
    # App metadata
    # ------------------------------------------------------------------ #
    APP_NAME: str = "SalonOS"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # ------------------------------------------------------------------ #
    # Logging
    # ------------------------------------------------------------------ #
    LOG_LEVEL: str = "INFO"
    LOG_JSON: bool = False

    # ------------------------------------------------------------------ #
    # CORS
    # ------------------------------------------------------------------ #
    BACKEND_CORS_ORIGINS: Annotated[List[str], NoDecode] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str):
            if not v.startswith("["):
                return [origin.strip() for origin in v.split(",") if origin.strip()]
            import json

            try:
                decoded = json.loads(v)
                if isinstance(decoded, list):
                    return [str(origin).strip() for origin in decoded if str(origin).strip()]
            except (json.JSONDecodeError, TypeError):
                pass
        return v

    # ------------------------------------------------------------------ #
    # Database (PostgreSQL)
    # ------------------------------------------------------------------ #
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "salonos"
    POSTGRES_PASSWORD: str = "change-me"
    POSTGRES_DB: str = "salonos_db"

    DATABASE_URL: str | None = None

    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800
    DB_ECHO: bool = False

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        """Return the DB connection string, preferring an explicit override."""
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+psycopg://", 1)
            elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
                url = url.replace("postgresql://", "postgresql+psycopg://", 1)
            return url

        dsn = PostgresDsn.build(
            scheme="postgresql+psycopg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )
        return str(dsn)

    # ------------------------------------------------------------------ #
    # JWT — configuration only. No auth endpoints/logic are implemented.
    # ------------------------------------------------------------------ #
    JWT_SECRET_KEY: str = "replace-with-a-long-random-secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()


settings = get_settings()