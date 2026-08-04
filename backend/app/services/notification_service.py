"""
OneStop AI - Notification Service
Business logic for generating and managing user notifications.
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import models
from app.schemas.notification import NotificationResponse, NotificationListResponse


def get_user_notifications(db: Session, user_id: str, limit: int = 50) -> NotificationListResponse:
    """Fetch the latest notifications for a user and calculate the unread count."""
    notifications_db = db.query(models.Notification).filter(
        models.Notification.user_id == user_id
    ).order_by(desc(models.Notification.created_at)).limit(limit).all()

    unread_count = sum(1 for n in notifications_db if not n.is_read)

    notifications = [
        NotificationResponse.model_validate(n) for n in notifications_db
    ]

    return NotificationListResponse(
        notifications=notifications,
        unread_count=unread_count
    )


def mark_as_read(db: Session, user_id: str, notification_id: str) -> NotificationResponse | None:
    """Mark a specific notification as read."""
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == user_id
    ).first()

    if notification and not notification.is_read:
        notification.is_read = True
        db.commit()
        db.refresh(notification)

    return NotificationResponse.model_validate(notification) if notification else None


def mark_all_as_read(db: Session, user_id: str) -> None:
    """Mark all unread notifications for a user as read."""
    db.query(models.Notification).filter(
        models.Notification.user_id == user_id,
        models.Notification.is_read == False
    ).update({"is_read": True})
    
    db.commit()


def create_notification(db: Session, user_id: str, title: str, message: str, type: str) -> models.Notification:
    """Internal helper to create a new notification for a user."""
    notification = models.Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        is_read=False,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
