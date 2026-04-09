from pydantic import BaseModel


class SubmissionCreate(BaseModel):
    rubric_id: int
    title: str
    essay_text: str
    student_id: int | None = None


class SubmissionOut(BaseModel):
    id: int
    rubric_id: int
    title: str
    essay_text: str
    word_count: int
    status: str

    class Config:
        from_attributes = True
