import time
from sqlalchemy.orm import Session
from app.models.job import Job, JobStatus
from datetime import datetime

def run_fake_analysis_task(job_id: str, db: Session):
    print(f"Bắt đầu xử lý job: {job_id}")
    
    # Lấy job từ DB
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        print(f"Lỗi: Không tìm thấy job với ID: {job_id}")
        return

    try:
        # 1. Cập nhật trạng thái thành PROCESSING
        job.status = JobStatus.PROCESSING
        db.commit()
        print(f"Job {job_id} đang được xử lý...")

        # 2. Giả lập công việc tốn thời gian
        time.sleep(15)

        # 3. Tạo kết quả giả
        dummy_result = {
            "message": "Phân tích giả lập hoàn thành!",
            "target_url": job.target_url,
            "timestamp": datetime.utcnow().isoformat()
        }

        # 4. Cập nhật job với kết quả
        job.status = JobStatus.COMPLETED
        job.result = dummy_result
        job.completed_at = datetime.utcnow()
        db.commit()
        print(f"Job {job_id} đã hoàn thành.")

    except Exception as e:
        # Xử lý lỗi nếu có
        print(f"Job {job_id} đã thất bại. Lỗi: {e}")
        job.status = JobStatus.FAILED
        job.error_message = str(e)
        job.completed_at = datetime.utcnow()
        db.commit()