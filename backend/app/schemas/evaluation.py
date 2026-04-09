from typing import List

from pydantic import BaseModel


class CriterionResult(BaseModel):
    criterion_id: int
    name: str
    score: int
    max_score: int
    weight: float
    justification: str


class EvaluationResponse(BaseModel):
    submission_id: int
    title: str
    overall_score: int
    score_label: str
    confidence_score: float
    criteria: List[CriterionResult]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    improved_version_text: str
    summary_feedback: str
    status: str = "completed"
