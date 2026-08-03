"""
OneStop AI - Roadmap Schemas
Pydantic models for roadmap and milestones.
"""

from pydantic import BaseModel
from datetime import datetime
from typing import List


class MilestoneBase(BaseModel):
    title: str
    description: str
    status: str
    order_index: int


class MilestoneResponse(MilestoneBase):
    id: str
    roadmap_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class MilestoneUpdate(BaseModel):
    status: str  # pending, in_progress, completed


class RoadmapBase(BaseModel):
    target_role: str
    progress_percentage: int
    is_active: bool


class RoadmapResponse(RoadmapBase):
    id: str
    user_id: str
    recommendation_id: str | None = None
    created_at: datetime
    milestones: List[MilestoneResponse] = []

    class Config:
        from_attributes = True
