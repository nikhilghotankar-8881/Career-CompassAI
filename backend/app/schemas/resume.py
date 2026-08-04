"""
OneStop AI - Resume Schemas
"""

from pydantic import BaseModel
from datetime import datetime
from typing import List

class ResumeAnalysisResponse(BaseModel):
    id: str
    user_id: str
    score: int
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    created_at: datetime

    class Config:
        from_attributes = True
