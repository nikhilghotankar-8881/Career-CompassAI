"""
OneStop AI - Admin API Tests
Phase 15: Tests for analytics, user management, assessment management, course management.
"""

from fastapi.testclient import TestClient
from app.database.models import User, CourseRecommendation


# ========================
# Analytics Tests
# ========================

def test_admin_analytics(client: TestClient, admin_user: User, admin_headers: dict):
    """Admin analytics should return platform-wide stats."""
    response = client.get("/api/admin/analytics", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data
    assert "active_users" in data
    assert "total_assessments" in data
    assert "total_roadmaps" in data


def test_admin_access_forbidden_for_standard_user(client: TestClient, test_user: User, auth_headers: dict):
    """Standard user should get 403 on admin routes."""
    response = client.get("/api/admin/analytics", headers=auth_headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_admin_unauthorized_without_token(client: TestClient):
    """Admin routes without auth should return 401."""
    response = client.get("/api/admin/analytics")
    assert response.status_code == 401


# ========================
# User Management Tests
# ========================

def test_admin_get_users_list(client: TestClient, admin_user: User, admin_headers: dict, test_user: User):
    """Admin should see paginated user list."""
    response = client.get("/api/admin/users", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "users" in data
    assert "total" in data
    assert len(data["users"]) >= 2
    emails = [u["email"] for u in data["users"]]
    assert test_user.email in emails
    assert admin_user.email in emails


def test_admin_search_users(client: TestClient, admin_user: User, admin_headers: dict, test_user: User):
    """Admin should be able to search users by email."""
    response = client.get("/api/admin/users?search=test", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert any(u["email"] == test_user.email for u in data["users"])


def test_admin_update_user_deactivate(client: TestClient, admin_user: User, admin_headers: dict, test_user: User):
    """Admin should be able to deactivate another user."""
    response = client.put(
        f"/api/admin/users/{test_user.id}",
        json={"is_active": False},
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert response.json()["is_active"] is False


def test_admin_update_user_promote_to_admin(client: TestClient, admin_user: User, admin_headers: dict, test_user: User):
    """Admin should be able to promote another user to admin."""
    response = client.put(
        f"/api/admin/users/{test_user.id}",
        json={"is_admin": True},
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert response.json()["is_admin"] is True


def test_admin_delete_user(client: TestClient, admin_user: User, admin_headers: dict, test_user: User):
    """Admin should be able to delete another user."""
    response = client.delete(f"/api/admin/users/{test_user.id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["success"] is True


# ========================
# Assessment Management Tests
# ========================

def test_admin_list_assessments(client: TestClient, admin_user: User, admin_headers: dict):
    """Admin should see assessment results list (possibly empty)."""
    response = client.get("/api/admin/assessments", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "assessments" in data
    assert "total" in data
    assert "page" in data


# ========================
# Course Management Tests
# ========================

def test_admin_list_courses(client: TestClient, admin_user: User, admin_headers: dict):
    """Admin should see all courses across the platform."""
    response = client.get("/api/admin/courses", headers=admin_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_admin_create_course(client: TestClient, admin_user: User, admin_headers: dict):
    """Admin should be able to create a global course recommendation."""
    course_data = {
        "title": "Intro to Machine Learning",
        "platform": "Coursera",
        "difficulty": "Beginner",
        "duration": "4 weeks",
        "url": "https://coursera.org/ml",
        "type": "Course",
    }
    response = client.post("/api/admin/courses", json=course_data, headers=admin_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Intro to Machine Learning"
    assert data["platform"] == "Coursera"


def test_admin_delete_course(client: TestClient, admin_user: User, admin_headers: dict, db_session):
    """Admin should be able to delete a course."""
    course = CourseRecommendation(
        user_id=admin_user.id, title="Delete Me", platform="edX",
        difficulty="Intermediate", duration="6 weeks", type="Course",
    )
    db_session.add(course)
    db_session.commit()
    db_session.refresh(course)

    response = client.delete(f"/api/admin/courses/{course.id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["success"] is True
