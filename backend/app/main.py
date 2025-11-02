from fastapi import FastAPI
from app.api import endpoints

app = FastAPI(title="AI UI/UX Analyzer")

app.include_router(endpoints.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI UI/UX Analyzer API"}