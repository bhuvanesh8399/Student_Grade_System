from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.evaluation import EvaluationResponse
from app.services.evaluation_service import get_evaluation, run_evaluation

router = APIRouter(prefix="/api/evaluations", tags=["evaluations"])


@router.post("/run/{submission_id}", response_model=EvaluationResponse)
def evaluate_submission(submission_id: int, db: Session = Depends(get_db)):
    return run_evaluation(db, submission_id)


@router.get("/{submission_id}", response_model=EvaluationResponse)
def fetch_evaluation(submission_id: int, db: Session = Depends(get_db)):
    return get_evaluation(db, submission_id)
