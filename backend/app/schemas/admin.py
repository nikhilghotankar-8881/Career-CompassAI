"""
OneStop AI - Admin Schemas
Pydantic models for admin panel API endpoints.
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


# ========================
# Platform Analytics
# ========================

class PlatformAnalytics(BaseModel):
    """Platform-wide statistics for the admin dashboard."""
    total_users: int = 0
    active_users: int = 0
    total_assessments: int = 0
    total_roadmaps: int = 0
    total_milestones_completed: int = 0
    total_resume_reviews: int = 0
    total_chat_messages: int = 0
    total_courses: int = 0
    total_achievements_earned: int = 0
    new_users_last_7_days: int = 0
    new_users_last_30_days: int = 0


# ========================
# User Management
# ========================

class AdminUserItem(BaseModel):
    """Single user entry in the admin user list."""
    id: str
    email: str
    full_name: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    assessment_count: int = 0
    roadmap_count: int = 0

    class Config:
        from_attributes = True


class AdminUserListResponse(BaseModel):
    """Paginated user list response."""
    users: List[AdminUserItem]
    total: int
    page: int
    per_page: int


class AdminUserUpdate(BaseModel):
    """Schema for toggling user flags."""
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None


# ========================
# Assessment Management
# ========================

class AdminAssessmentItem(BaseModel):
    """Assessment result entry for admin monitoring."""
    id: str
    user_email: str
    user_name: str
    personality_type: Optional[str] = None
    category_scores: dict = {}
    top_traits: list = []
    created_at: datetime

    class Config:
        from_attributes = True


class AdminAssessmentListResponse(BaseModel):
    """Paginated assessment list response."""
    assessments: List[AdminAssessmentItem]
    total: int
    page: int
    per_page: int


# ========================
# Course Management
# ========================

class AdminCourseItem(BaseModel):
    """Course recommendation entry for admin view."""
    id: str
    title: str
    platform: str
    difficulty: str
    duration: str
    url: Optional[str] = None
    type: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class AdminCourseCreate(BaseModel):
    """Schema for creating a platform-wide course from admin panel."""
    title: str
    platform: str
    difficulty: str = "Intermediate"
    duration: str = "4 weeks"
    url: Optional[str] = None
    type: str = "Course"
