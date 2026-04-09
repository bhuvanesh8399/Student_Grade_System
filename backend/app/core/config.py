from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Student Assignment Grader Agent"
    app_env: str = "development"
    database_url: str = "sqlite:///./grader.db"
    secret_key: str = "change-this-in-production"
    access_token_expire_minutes: int = 1440
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
