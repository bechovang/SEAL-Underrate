from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str | None = None
    OPENROUTER_API_KEY: str
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"

    # Model choices
    CODE_ANALYST_MODEL: str = "anthropic/claude-sonnet-4"
    VISION_ANALYST_MODEL: str = "anthropic/claude-sonnet-4"
    SYNTHESIZER_MODEL: str = "anthropic/claude-sonnet-4"

    class Config:
        env_file = ".env"


settings = Settings()

