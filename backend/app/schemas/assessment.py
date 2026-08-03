"""
OneStop AI - Assessment Schemas
Pydantic models for assessment questions, answers, sessions, and results validation.
"""

from pydantic import BaseModel, Field
from datetime import datetime


class QuestionOptionSchema(BaseModel):
    label: str
    sub_domain: str | None = None
    score_vector: dict[str, int] = Field(default_factory=dict)


class QuestionResponseSchema(BaseModel):
    id: str
    category: str
    sub_domain: str | None = None
    question_text: str
    options: list[QuestionOptionSchema]
    order_index: int

    class Config:
        from_attributes = True


class AssessmentStartResponse(BaseModel):
    assessment_id: str
    status: str
    questions: list[QuestionResponseSchema]
    message: str


class SingleAnswerSubmission(BaseModel):
    question_id: str
    selected_option_index: int


class AssessmentSubmitRequest(BaseModel):
    assessment_id: str
    answers: list[SingleAnswerSubmission]


class AssessmentResultResponse(BaseModel):
    id: str
    assessment_id: str
    user_id: str
    category_scores: dict[str, int]
    top_traits: list[str]
    personality_type: str | None = None
    recommended_domains: list[str]
    summary: str
    created_at: datetime

    class Config:
        from_attributes = True
