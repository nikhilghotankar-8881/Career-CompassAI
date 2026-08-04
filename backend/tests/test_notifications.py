"""
OneStop AI - Notification API Tests
Phase 15: Tests for GET /api/notifications, PUT /read, PUT /read-all.
"""

from fastapi.testclient import TestClient
from app.database.models import User, Notification


def test_get_notifications_empty(client: TestClient, test_user: User, auth_headers: dict):
    """New user should have zero notifications."""
    response = client.get("/api/notifications", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["notifications"] == []
    assert data["unread_count"] == 0


def test_get_notifications_with_data(client: TestClient, test_user: User, auth_headers: dict, seeded_notification: Notification):
    """User with notifications should see them returned."""
    response = client.get("/api/notifications", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["notifications"]) == 1
    assert data["unread_count"] == 1
    assert data["notifications"][0]["title"] == "Test Notification"
    assert data["notifications"][0]["is_read"] is False


def test_mark_notification_as_read(client: TestClient, test_user: User, auth_headers: dict, seeded_notification: Notification):
    """Marking a notification as read should update is_read and reduce unread count."""
    # Mark as read
    response = client.put(
        f"/api/notifications/{seeded_notification.id}/read",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_read"] is True

    # Verify unread count is now 0
    list_response = client.get("/api/notifications", headers=auth_headers)
    assert list_response.json()["unread_count"] == 0


def test_mark_notification_not_found(client: TestClient, test_user: User, auth_headers: dict):
    """Non-existent notification ID should return 404."""
    response = client.put("/api/notifications/fake-id-999/read", headers=auth_headers)
    assert response.status_code == 404


def test_mark_all_as_read(client: TestClient, test_user: User, auth_headers: dict, db_session):
    """Mark-all-read endpoint should clear all unread notifications."""
    # Seed multiple notifications
    for i in range(3):
        db_session.add(Notification(
            user_id=test_user.id,
            title=f"Notification {i}",
            message=f"Message {i}",
            type="system",
            is_read=False,
        ))
    db_session.commit()

    response = client.put("/api/notifications/read-all", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["success"] is True

    # Verify all are read
    list_response = client.get("/api/notifications", headers=auth_headers)
    assert list_response.json()["unread_count"] == 0


def test_notifications_unauthorized(client: TestClient):
    """Notifications should require authentication."""
    response = client.get("/api/notifications")
    assert response.status_code == 401
