from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.evaluation import Evaluation
from app.models.submission import Submission


def get_dashboard_summary(db: Session) -> dict:
    total_submissions = db.query(func.count(Submission.id)).scalar() or 0
    total_evaluations = db.query(func.count(Evaluation.id)).scalar() or 0
    average_score = db.query(func.avg(Evaluation.overall_score)).scalar() or 0
    essays_needing_improvement = (
        db.query(func.count(Evaluation.id)).filter(Evaluation.overall_score < 70).scalar() or 0
    )

    latest = (
        db.query(Submission.id, Submission.title, Submission.status, Submission.created_at)
        .order_by(Submission.id.desc())
        .limit(5)
        .all()
    )

    return {
        "total_submissions": total_submissions,
        "total_evaluations": total_evaluations,
        "average_score": round(float(average_score), 2),
        "essays_needing_improvement": essays_needing_improvement,
        "latest_activity": [
            {
                "submission_id": item.id,
                "title": item.title,
                "status": item.status,
                "created_at": item.created_at.isoformat(),
            }
            for item in latest
        ],
    }
