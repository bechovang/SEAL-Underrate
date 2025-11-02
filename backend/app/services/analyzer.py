import asyncio
from datetime import datetime
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.job import Job, JobStatus
from app.services.data_collector import DataCollector
from app.services.ai_agents import AIAgentService


async def run_analysis_task(job_id: str, target_url: str) -> None:
    db: Session = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            return

        job.status = JobStatus.PROCESSING
        db.commit()

        collector = DataCollector(job_id)
        raw_data = await collector.collect_all_data(target_url)

        ai_service = AIAgentService()
        code_task = ai_service.run_code_analyst(raw_data["lighthouse"], raw_data["html"])
        vision_task = ai_service.run_vision_analyst(raw_data["screenshots"])
        code_analysis, vision_analysis = await asyncio.gather(code_task, vision_task)

        metadata = {"url": target_url, "analyzed_at": datetime.utcnow().isoformat()}
        synthesis = await ai_service.run_report_synthesizer(code_analysis, vision_analysis, metadata)

        final_result = {
            "job_id": job_id,
            "url": target_url,
            "analyzed_at": metadata["analyzed_at"],
            "summary": synthesis["executive_summary"],
            "overall_score": synthesis["overall_score"],
            "performance": {
                "score": code_analysis.get("performance_score"),
                "metrics": code_analysis.get("metrics"),
            },
            "accessibility": {"score": code_analysis.get("accessibility_score")},
            "design": {
                "score": vision_analysis.get("overall_design_score"),
                "responsive_quality": vision_analysis.get("responsive_quality"),
            },
            "issues": {"code": code_analysis.get("issues", []), "ui": vision_analysis.get("ui_issues", [])},
            "priority_actions": synthesis.get("priority_actions", []),
            "screenshots": {
                "desktop": raw_data["screenshots"].get("desktop"),
                "tablet": raw_data["screenshots"].get("tablet"),
                "mobile": raw_data["screenshots"].get("mobile"),
            },
        }

        job.result = final_result
        job.status = JobStatus.COMPLETED
        job.completed_at = datetime.utcnow()
        db.commit()
    except Exception as e:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
            db.commit()
    finally:
        db.close()


def run_analysis_task_bg(job_id: str, target_url: str) -> None:
    asyncio.run(run_analysis_task(job_id, target_url))