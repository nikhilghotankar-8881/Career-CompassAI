"""
OneStop AI - Recommendation API Tests
Phase 15: Tests for GET /api/recommendations/, GET /api/recommendations/{rec_id}.
"""

from fastapi.testclient import TestClient
from app.database.models import User, CareerRecommendation


def test_get_recommendations_empty(client: TestClient, test_user: User, auth_headers: dict):
    """New user should get an empty recommendations list."""
    response = client.get("/api/recommendations/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["recommendations"] == []
    assert data["message"] == "Recommendations retrieved successfully"


def test_get_recommendations_with_data(client: TestClient, test_user: User, auth_headers: dict, seeded_recommendation: CareerRecommendation):
    """User with recommendations should see them returned."""
    response = client.get("/api/recommendations/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["recommendations"]) == 1
    rec = data["recommendations"][0]
    assert rec["career_title"] == "Software Engineer"
    assert rec["match_percentage"] == 92


def test_get_recommendation_by_id(client: TestClient, test_user: User, auth_headers: dict, seeded_recommendation: CareerRecommendation):
    """Should return details of a specific recommendation."""
    response = client.get(
        f"/api/recommendations/{seeded_recommendation.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["career_title"] == "Software Engineer"
    assert data["salary_range"] == "$100k - $150k"
    assert "Python" in data["required_skills"]


def test_get_recommendation_not_found(client: TestClient, test_user: User, auth_headers: dict):
    """Non-existent recommendation should return 404."""
    response = client.get("/api/recommendations/fake-id-999", headers=auth_headers)
    assert response.status_code == 404


def test_recommendations_unauthorized(client: TestClient):
    """Recommendation endpoints should require authentication."""
    assert client.get("/api/recommendations/").status_code == 401
