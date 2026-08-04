"""
OneStop AI - Course Schemas
"""

from pydantic import BaseModel
from datetime import datetime
from typing import List

class CourseRecommendationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    platform: str
    difficulty: str
    duration: str
    url: str | None
    type: str
    created_at: datetime

    class Config:
        from_attributes = True
