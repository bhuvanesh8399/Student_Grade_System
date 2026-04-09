from sqlalchemy.orm import Session

from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate


def create_submission(db: Session, payload: SubmissionCreate) -> Submission:
    word_count = len(payload.essay_text.split())

    submission = Submission(
        student_id=payload.student_id,
        rubric_id=payload.rubric_id,
        title=payload.title,
        essay_text=payload.essay_text,
        word_count=word_count,
        status="submitted",
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


def list_submissions(db: Session) -> list[Submission]:
    return db.query(Submission).order_by(Submission.id.desc()).all()


def get_submission(db: Session, submission_id: int) -> Submission | None:
    return db.query(Submission).filter(Submission.id == submission_id).first()
