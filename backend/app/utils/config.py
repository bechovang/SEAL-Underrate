from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str | None = None
    OPENROUTER_API_KEY: str
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"

    # Model choices
    CODE_ANALYST_MODEL: str = "anthropic/claude-3.5-sonnet"
    VISION_ANALYST_MODEL: str = "anthropic/claude-3.5-sonnet"
    SYNTHESIZER_MODEL: str = "anthropic/claude-3.5-sonnet"

    class Config:
        env_file = ".env"


settings = Settings()

