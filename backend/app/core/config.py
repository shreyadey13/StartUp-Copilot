from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "AI Startup Copilot API"
    environment: str = "local"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/startup_copilot"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret_key: str = Field(default="change-me-in-production", min_length=16)
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    log_level: str = "INFO"
    cors_origins: list[AnyHttpUrl | str] = ["http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:
    return Settings()

