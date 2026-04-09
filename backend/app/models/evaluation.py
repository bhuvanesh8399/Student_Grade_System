from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    submission_id: Mapped[int] = mapped_column(ForeignKey("submissions.id"), unique=True)
    overall_score: Mapped[int] = mapped_column(Integer)
    score_label: Mapped[str] = mapped_column(String(50))
    summary_feedback: Mapped[str] = mapped_column(Text)
    strengths_json: Mapped[str] = mapped_column(Text, default="[]")
    weaknesses_json: Mapped[str] = mapped_column(Text, default="[]")
    suggestions_json: Mapped[str] = mapped_column(Text, default="[]")
    improved_version_text: Mapped[str] = mapped_column(Text, default="")
    confidence_score: Mapped[float] = mapped_column(Float, default=0.8)
    evaluated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class CriterionScore(Base):
    __tablename__ = "criterion_scores"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    evaluation_id: Mapped[int] = mapped_column(ForeignKey("evaluations.id"))
    rubric_criterion_id: Mapped[int] = mapped_column(ForeignKey("rubric_criteria.id"))
    criterion_name: Mapped[str] = mapped_column(String(100))
    score: Mapped[int] = mapped_column(Integer)
    max_score: Mapped[int] = mapped_column(Integer)
    weight: Mapped[float] = mapped_column(Float)
    justification: Mapped[str] = mapped_column(Text)
