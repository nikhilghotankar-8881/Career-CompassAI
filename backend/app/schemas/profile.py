"""
OneStop AI - Profile Schemas
Pydantic models for user profile request/response validation.
"""

from pydantic import BaseModel, Field
from datetime import datetime


class ProfileUpdate(BaseModel):
    """Schema for updating user profile fields."""
    phone: str | None = None
    bio: str | None = None
    education_level: str | None = None
    institution: str | None = None
    field_of_study: str | None = None
    graduation_year: int | None = None
    skills: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    career_goals: str | None = None
    target_role: str | None = None


class AvatarUpdate(BaseModel):
    """Schema for updating avatar URL."""
    avatar_url: str


class ProfileResponse(BaseModel):
    """Schema for returning full user profile data."""
    id: str
    user_id: str
    full_name: str
    email: str
    avatar_url: str | None = None
    phone: str | None = None
    bio: str | None = None
    education_level: str | None = None
    institution: str | None = None
    field_of_study: str | None = None
    graduation_year: int | None = None
    skills: list[str] = []
    interests: list[str] = []
    career_goals: str | None = None
    target_role: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
