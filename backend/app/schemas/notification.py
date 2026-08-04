"""
OneStop AI - Notification Schemas
Pydantic models for the Notification Engine.
"""

from pydantic import BaseModel
from datetime import datetime
from typing import List


class NotificationResponse(BaseModel):
    """Schema for a single notification in API responses."""
    id: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationListResponse(BaseModel):
    """Schema for the full notification dropdown payload."""
    notifications: List[NotificationResponse]
    unread_count: int
