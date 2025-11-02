from pydantic import BaseModel, UUID4
from typing import Optional, Any

class AnalyzeRequest(BaseModel):
    url: str

class AnalyzeResponse(BaseModel):
    job_id: UUID4

class StatusResponse(BaseModel):
    job_id: UUID4
    status: str
    result: Optional[Any] = None