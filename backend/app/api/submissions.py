from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.submission import SubmissionCreate, SubmissionOut
from app.services.submission_service import create_submission, get_submission, list_submissions

router = APIRouter(prefix="/api/submissions", tags=["submissions"])


@router.post("", response_model=SubmissionOut)
def create_new_submission(payload: SubmissionCreate, db: Session = Depends(get_db)):
    return create_submission(db, payload)


@router.get("", response_model=list[SubmissionOut])
def get_all_submissions(db: Session = Depends(get_db)):
    return list_submissions(db)


@router.get("/{submission_id}", response_model=SubmissionOut)
def get_single_submission(submission_id: int, db: Session = Depends(get_db)):
    item = get_submission(db, submission_id)
    if not item:
        raise HTTPException(status_code=404, detail="Submission not found")
    return item
