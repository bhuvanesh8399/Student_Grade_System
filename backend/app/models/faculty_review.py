from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class FacultyReview(Base):
    __tablename__ = "faculty_reviews"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    evaluation_id: Mapped[int] = mapped_column(ForeignKey("evaluations.id"))
    faculty_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    manual_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    manual_comment: Mapped[str] = mapped_column(Text, default="")
    final_status: Mapped[str] = mapped_column(String(30), default="pending")
    reviewed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
