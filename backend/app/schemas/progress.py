"""
OneStop AI - Progress Tracking Schemas
Pydantic models for the Progress & Analytics module.
"""

from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class SkillProgress(BaseModel):
    """A single domain skill score from the latest assessment."""
    domain: str
    score: int
    max_score: int = 100


class RoadmapHistoryItem(BaseModel):
    """Summary of a user's roadmap (active or past)."""
    id: str
    target_role: str
    progress_percentage: int
    milestones_total: int
    milestones_completed: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AssessmentHistoryItem(BaseModel):
    """A single entry in the user's assessment timeline."""
    id: str
    personality_type: Optional[str] = None
    category_scores: dict
    created_at: datetime

    class Config:
        from_attributes = True


class LearningStats(BaseModel):
    """Aggregate learning statistics across the platform."""
    assessments_taken: int = 0
    roadmaps_created: int = 0
    milestones_completed: int = 0
    milestones_total: int = 0
    courses_recommended: int = 0
    resume_reviews: int = 0
    chat_messages_sent: int = 0


class AchievementResponse(BaseModel):
    """An earned achievement badge."""
    badge_key: str
    badge_name: str
    badge_description: str
    badge_icon: str
    earned_at: datetime

    class Config:
        from_attributes = True


class ProgressOverviewResponse(BaseModel):
    """Complete progress overview combining all tracking dimensions."""
    skill_progress: List[SkillProgress] = []
    roadmap_history: List[RoadmapHistoryItem] = []
    assessment_history: List[AssessmentHistoryItem] = []
    learning_stats: LearningStats
    achievements: List[AchievementResponse] = []
