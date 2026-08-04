"""
OneStop AI - Course Recommendation API Tests
Phase 15: Tests for GET /api/courses, POST /api/courses/generate.
"""

from fastapi.testclient import TestClient
from app.database.models import User, CourseRecommendation


def test_get_courses_empty(client: TestClient, test_user: User, auth_headers: dict):
    """New user should have no course recommendations."""
    response = client.get("/api/courses", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_get_courses_with_data(client: TestClient, test_user: User, auth_headers: dict, db_session):
    """User with seeded course recommendations should see them returned."""
    c1 = CourseRecommendation(
        user_id=test_user.id, title="Python Masterclass", platform="Udemy",
        difficulty="Beginner", duration="6 weeks", url="https://udemy.com/python",
        type="Course",
    )
    c2 = CourseRecommendation(
        user_id=test_user.id, title="AWS Solutions Architect", platform="Coursera",
        difficulty="Advanced", duration="8 weeks", url="https://coursera.org/aws",
        type="Certification",
    )
    db_session.add_all([c1, c2])
    db_session.commit()

    response = client.get("/api/courses", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    titles = {c["title"] for c in data}
    assert "Python Masterclass" in titles
    assert "AWS Solutions Architect" in titles


def test_courses_unauthorized(client: TestClient):
    """Course endpoints should require authentication."""
    assert client.get("/api/courses").status_code == 401
