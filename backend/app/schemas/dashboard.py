"""
OneStop AI - Dashboard Schemas
"""

from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    assessment_completed: bool
    top_trait: str | None = None
    roadmap_active: bool
    target_role: str | None = None
    roadmap_progress: int = 0
    milestones_completed: int = 0
    recommendation_match: int | None = None
    resume_score: int | None = None
