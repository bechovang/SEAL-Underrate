from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas
from app.models.job import Job
from app.services.analyzer import run_fake_analysis_task

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

    # Thêm tác vụ phân tích vào nền
    background_tasks.add_task(run_fake_analysis_task, str(new_job.id), db)

    return {"job_id": new_job.id}


@router.get("/status/{job_id}", response_model=schemas.StatusResponse)
def get_status(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        # Xử lý trường hợp không tìm thấy job
        return {"job_id": job_id, "status": "NOT_FOUND", "result": None}
    
    return {"job_id": job.id, "status": job.status.value, "result": job.result}