from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.rubric import RubricCreate, RubricOut
from app.services.rubric_service import create_rubric, get_rubric, list_rubrics

router = APIRouter(prefix="/api/rubrics", tags=["rubrics"])


@router.get("", response_model=list[RubricOut])
def get_all_rubrics(db: Session = Depends(get_db)):
    return list_rubrics(db)


@router.get("/{rubric_id}", response_model=RubricOut)
def get_single_rubric(rubric_id: int, db: Session = Depends(get_db)):
    rubric = get_rubric(db, rubric_id)
    if not rubric:
        raise HTTPException(status_code=404, detail="Rubric not found")
    return rubric


@router.post("", response_model=RubricOut)
def create_new_rubric(payload: RubricCreate, db: Session = Depends(get_db)):
    return create_rubric(db, payload)
