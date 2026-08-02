"""
OneStop AI - User Schemas
Pydantic models for request/response validation in Authentication module.
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


# ---------- Request Schemas ----------

class UserCreate(BaseModel):
    """Schema for user registration."""
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    """Schema for requesting a password reset token."""
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Schema for resetting password with token."""
    token: str
    new_password: str = Field(..., min_length=6, max_length=100)


# ---------- Response Schemas ----------

class UserResponse(BaseModel):
    """Schema for user data in responses."""
    id: str
    email: str
    full_name: str
    avatar_url: str | None = None
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
    success: bool = True
