from typing import List

from pydantic import BaseModel, Field


class RubricCriterionCreate(BaseModel):
    name: str
    description: str = ""
    max_score: int = 20
    weight: float = 0.2
    order_index: int = 0


class RubricCreate(BaseModel):
    title: str
    subject: str
    description: str = ""
    criteria: List[RubricCriterionCreate] = Field(default_factory=list)


class RubricCriterionOut(BaseModel):
    id: int
    name: str
    description: str
    max_score: int
    weight: float
    order_index: int

    class Config:
        from_attributes = True


class RubricOut(BaseModel):
    id: int
    title: str
    subject: str
    description: str
    is_active: bool
    criteria: List[RubricCriterionOut]

    class Config:
        from_attributes = True
