"""
OneStop AI - User Schemas
Pydantic models for request/response validation.
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime


# ---------- Request Schemas ----------

class UserCreate(BaseModel):
    """Schema for user registration."""
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


# ---------- Response Schemas ----------

class UserResponse(BaseModel):
    """Schema for user data in responses."""
    id: str
    email: str
    full_name: str
    avatar_url: str | None = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
    success: bool = True
