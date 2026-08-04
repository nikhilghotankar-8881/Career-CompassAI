"""
OneStop AI - Notifications Routes
Endpoints: GET /api/notifications, PUT /api/notifications/{id}/read, PUT /api/notifications/read-all
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_user
from app.schemas.notification import NotificationListResponse, NotificationResponse
from app.schemas.user import MessageResponse
from app.services import notification_service

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get("", response_model=NotificationListResponse)
async def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the latest notifications for the current user and their unread count."""
    return notification_service.get_user_notifications(db, current_user.id)


@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a specific notification as read."""
    notification = notification_service.mark_as_read(db, current_user.id, notification_id)
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notification


@router.put("/read-all", response_model=MessageResponse)
async def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all unread notifications as read for the current user."""
    notification_service.mark_all_as_read(db, current_user.id)
    return MessageResponse(message="All notifications marked as read", success=True)
