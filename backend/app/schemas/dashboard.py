from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_submissions: int
    total_evaluations: int
    average_score: float
    essays_needing_improvement: int
    latest_activity: list[dict]
