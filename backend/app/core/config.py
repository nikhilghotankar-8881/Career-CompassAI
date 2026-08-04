"""
OneStop AI - Application Configuration
Reads settings from .env file using Pydantic BaseSettings.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    APP_NAME: str = "OneStop AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./dev.db"

    # Authentication
    SECRET_KEY: str = "dev-secret-key-not-for-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # AI
    OPENAI_API_KEY: str = ""

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def allowed_origins(self) -> list[str]:
        """Return list of allowed CORS origins, splitting comma-separated strings."""
        origins = [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        if self.FRONTEND_URL and self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
        return origins

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — loaded once."""
    return Settings()
