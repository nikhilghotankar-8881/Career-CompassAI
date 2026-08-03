"""
OneStop AI - Recommendation Schemas
Pydantic models for career recommendations validation and response formatting.
"""

from pydantic import BaseModel, Field
from datetime import datetime


class CareerRecommendationResponse(BaseModel):
    id: str
    user_id: str
    assessment_result_id: str | None = None
    career_title: str
    match_percentage: int
    description: str
    required_skills: list[str] = Field(default_factory=list)
    skill_gaps: list[str] = Field(default_factory=list)
    learning_path: list[str] = Field(default_factory=list)
    salary_range: str | None = None
    job_outlook: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class RecommendationListResponse(BaseModel):
    recommendations: list[CareerRecommendationResponse]
    personality_type: str | None = None
    user_skills: list[str] = Field(default_factory=list)
    message: str
