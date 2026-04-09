from sqlalchemy.orm import Session

from app.models.rubric import Rubric, RubricCriterion
from app.schemas.rubric import RubricCreate


def create_rubric(db: Session, payload: RubricCreate, created_by: int | None = None) -> Rubric:
    rubric = Rubric(
        title=payload.title,
        subject=payload.subject,
        description=payload.description,
        created_by=created_by,
    )
    db.add(rubric)
    db.flush()

    for item in payload.criteria:
        db.add(
            RubricCriterion(
                rubric_id=rubric.id,
                name=item.name,
                description=item.description,
                max_score=item.max_score,
                weight=item.weight,
                order_index=item.order_index,
            )
        )

    db.commit()
    db.refresh(rubric)
    return rubric


def list_rubrics(db: Session) -> list[Rubric]:
    return db.query(Rubric).order_by(Rubric.id.desc()).all()


def get_rubric(db: Session, rubric_id: int) -> Rubric | None:
    return db.query(Rubric).filter(Rubric.id == rubric_id).first()
