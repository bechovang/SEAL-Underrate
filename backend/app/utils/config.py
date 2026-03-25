import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Get the backend directory
BACKEND_DIR = Path(__file__).parent.parent.parent
ENV_FILE = BACKEND_DIR / ".env"

# Load .env with override to ensure our values are used
load_dotenv(ENV_FILE, override=True)

class Settings(BaseSettings):
    DATABASE_URL: str | None = None
    OPENROUTER_API_KEY: str
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"

    # Model choices
    CODE_ANALYST_MODEL: str = "anthropic/claude-3.5-sonnet"
    VISION_ANALYST_MODEL: str = "anthropic/claude-3.5-sonnet"
    SYNTHESIZER_MODEL: str = "anthropic/claude-3.5-sonnet"

    class Config:
        env_file = str(ENV_FILE)
        env_file_encoding = "utf-8"


def get_fresh_settings():
    """Get fresh settings from environment each time"""
    # Reload .env to ensure latest values
    load_dotenv(ENV_FILE, override=True)
    return Settings()


settings = get_fresh_settings()

