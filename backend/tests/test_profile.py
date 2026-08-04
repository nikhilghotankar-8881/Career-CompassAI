"""
OneStop AI - Profile API Tests
Phase 15: Tests for GET /api/users/profile, PUT /api/users/profile, POST /api/users/profile/avatar.
"""

from fastapi.testclient import TestClient
from app.database.models import User


def test_get_profile_creates_default(client: TestClient, test_user: User, auth_headers: dict):
    """First profile fetch should auto-create an empty profile."""
    response = client.get("/api/users/profile", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == test_user.id
    assert data["email"] == test_user.email
    assert data["full_name"] == test_user.full_name
    assert data["skills"] == []
    assert data["interests"] == []
    assert data["bio"] is None


def test_update_profile(client: TestClient, test_user: User, auth_headers: dict):
    """Update profile fields and verify persistence."""
    update_data = {
        "bio": "Aspiring ML Engineer",
        "education_level": "Undergraduate",
        "institution": "MIT",
        "field_of_study": "Computer Science",
        "graduation_year": 2025,
        "skills": ["Python", "Machine Learning", "SQL"],
        "interests": ["AI", "Data Science"],
        "career_goals": "Lead ML at a top tech company",
        "target_role": "Machine Learning Engineer",
    }
    response = client.put("/api/users/profile", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["bio"] == "Aspiring ML Engineer"
    assert data["education_level"] == "Undergraduate"
    assert data["institution"] == "MIT"
    assert data["field_of_study"] == "Computer Science"
    assert data["graduation_year"] == 2025
    assert set(data["skills"]) == {"Python", "Machine Learning", "SQL"}
    assert set(data["interests"]) == {"AI", "Data Science"}
    assert data["target_role"] == "Machine Learning Engineer"


def test_update_profile_partial(client: TestClient, test_user: User, auth_headers: dict):
    """Partial update should only change provided fields."""
    # First set the full profile
    client.put("/api/users/profile", json={"bio": "Original bio", "institution": "Stanford"}, headers=auth_headers)

    # Partial update — only bio
    response = client.put("/api/users/profile", json={"bio": "Updated bio"}, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["bio"] == "Updated bio"


def test_update_avatar(client: TestClient, test_user: User, auth_headers: dict):
    """Update avatar URL and verify in profile response."""
    avatar_url = "https://example.com/avatars/myavatar.png"
    response = client.post(
        "/api/users/profile/avatar",
        json={"avatar_url": avatar_url},
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["avatar_url"] == avatar_url


def test_profile_unauthorized(client: TestClient):
    """Profile endpoints should return 401 without auth."""
    response = client.get("/api/users/profile")
    assert response.status_code == 401
