import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env explicitly at import time for all modules
ENV_FILE = Path(__file__).parent.parent / ".env"
load_dotenv(ENV_FILE, override=True)

from fastapi import FastAPI
from app.api import endpoints

app = FastAPI(title="AI UI/UX Analyzer")

app.include_router(endpoints.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI UI/UX Analyzer API"}