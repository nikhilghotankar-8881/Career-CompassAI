"""
OneStop AI - Roadmap API Tests
Phase 15: Tests for GET /api/roadmap/, POST /api/roadmap/generate, PUT /api/roadmap/milestones.
"""

from fastapi.testclient import TestClient
from app.database.models import User, Roadmap, Milestone, CareerRecommendation


def test_get_roadmap_not_found(client: TestClient, test_user: User, auth_headers: dict):
    """No active roadmap should return 404."""
    response = client.get("/api/roadmap/", headers=auth_headers)
    assert response.status_code == 404
    assert "No active roadmap" in response.json()["detail"]


def test_get_active_roadmap(client: TestClient, test_user: User, auth_headers: dict, seeded_roadmap: Roadmap):
    """Should return the user's active roadmap with milestones."""
    response = client.get("/api/roadmap/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["target_role"] == "Software Engineer"
    assert data["is_active"] is True
    assert len(data["milestones"]) == 3
    assert data["milestones"][0]["title"] == "Learn Python"


def test_generate_roadmap(client: TestClient, test_user: User, auth_headers: dict, seeded_recommendation: CareerRecommendation):
    """Generating a roadmap from a recommendation should create milestones and set it as active."""
    response = client.post(
        f"/api/roadmap/generate/{seeded_recommendation.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["target_role"] == "Software Engineer"
    assert data["is_active"] is True
    assert data["progress_percentage"] == 0
    assert len(data["milestones"]) > 0


def test_generate_roadmap_not_found(client: TestClient, test_user: User, auth_headers: dict):
    """Generate with a non-existent recommendation ID should return 404."""
    response = client.post("/api/roadmap/generate/fake-rec-id", headers=auth_headers)
    assert response.status_code == 404


def test_update_milestone_to_completed(client: TestClient, test_user: User, auth_headers: dict, seeded_roadmap: Roadmap):
    """Marking a milestone as completed should update progress percentage."""
    milestone = seeded_roadmap.milestones[0]
    response = client.put(
        f"/api/roadmap/milestones/{milestone.id}",
        json={"status": "completed"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    # 1 of 3 milestones completed = 33%
    assert data["progress_percentage"] == 33
    completed_milestone = next(m for m in data["milestones"] if m["id"] == milestone.id)
    assert completed_milestone["status"] == "completed"


def test_update_milestone_to_in_progress(client: TestClient, test_user: User, auth_headers: dict, seeded_roadmap: Roadmap):
    """Marking a milestone as in_progress should be accepted."""
    milestone = seeded_roadmap.milestones[1]
    response = client.put(
        f"/api/roadmap/milestones/{milestone.id}",
        json={"status": "in_progress"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    updated = next(m for m in response.json()["milestones"] if m["id"] == milestone.id)
    assert updated["status"] == "in_progress"


def test_update_milestone_invalid_status(client: TestClient, test_user: User, auth_headers: dict, seeded_roadmap: Roadmap):
    """An invalid status value should return 400."""
    milestone = seeded_roadmap.milestones[0]
    response = client.put(
        f"/api/roadmap/milestones/{milestone.id}",
        json={"status": "invalid_status"},
        headers=auth_headers,
    )
    assert response.status_code == 400


def test_update_milestone_not_found(client: TestClient, test_user: User, auth_headers: dict, seeded_roadmap: Roadmap):
    """Non-existent milestone ID should return 404."""
    response = client.put(
        "/api/roadmap/milestones/fake-milestone-id",
        json={"status": "completed"},
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_roadmap_unauthorized(client: TestClient):
    """Roadmap endpoints should require authentication."""
    assert client.get("/api/roadmap/").status_code == 401
