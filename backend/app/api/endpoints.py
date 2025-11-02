from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas
from app.models.job import Job
from app.services.analyzer import run_analysis_task_bg
import os
from pathlib import Path

router = APIRouter()

@router.post("/analyze", response_model=schemas.AnalyzeResponse, status_code=202)
def analyze_url(
    request: schemas.AnalyzeRequest, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    # Tạo job mới trong database
    new_job = Job(target_url=request.url)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    # Thêm tác vụ phân tích vào nền (DB session sẽ được quản lý bên trong task)
    background_tasks.add_task(run_analysis_task_bg, str(new_job.id), new_job.target_url)

    return {"job_id": new_job.id}


@router.get("/status/{job_id}", response_model=schemas.StatusResponse)
def get_status(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        # Xử lý trường hợp không tìm thấy job
        return {"job_id": job_id, "status": "NOT_FOUND", "result": None, "error_message": None}

    return {
        "job_id": job.id,
        "status": job.status.value,
        "result": job.result,
        "error_message": job.error_message
    }


@router.get("/screenshot/{job_id}/{device}")
async def get_screenshot(job_id: str, device: str, db: Session = Depends(get_db)):
    """
    Serve screenshot images for completed analysis jobs
    """
    # Validate device parameter
    if device not in ["desktop", "tablet", "mobile"]:
        raise HTTPException(status_code=400, detail="Invalid device type")

    # Check if job exists and is completed
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status.value != "COMPLETED":
        raise HTTPException(status_code=400, detail="Job not completed yet")

    if not job.result or not job.result.get("screenshots"):
        raise HTTPException(status_code=404, detail="No screenshots found")

    # Get screenshot path
    screenshot_path = job.result["screenshots"].get(device)
    if not screenshot_path:
        raise HTTPException(status_code=404, detail=f"No {device} screenshot found")

    # Check if file exists
    if not os.path.exists(screenshot_path):
        raise HTTPException(status_code=404, detail="Screenshot file not found")

    # Return file
    from fastapi.responses import FileResponse
    return FileResponse(
        path=screenshot_path,
        media_type="image/png",
        filename=f"{device}.png"
    )