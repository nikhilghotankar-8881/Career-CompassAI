"""
OneStop AI - Assessment API Tests
Phase 15: Tests for assessment questions, start, submit, and results endpoints.
"""

from fastapi.testclient import TestClient
from app.database.models import User


def test_list_questions_auto_seeded(client: TestClient, db_session):
    """Questions endpoint auto-seeds 15 standardized questions when the DB is empty."""
    response = client.get("/api/assessments/questions")
    assert response.status_code == 200
    data = response.json()
    # The assessment service auto-seeds 15 questions across 3 categories
    assert len(data) == 15
    for q in data:
        assert "id" in q
        assert "question_text" in q
        assert "options" in q
        assert q["category"] in ["personality", "skill", "interest"]


def test_start_assessment(client: TestClient, test_user: User, auth_headers: dict, seeded_questions):
    """Start endpoint should create a new assessment and return questions."""
    response = client.post("/api/assessments/start", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "assessment_id" in data
    assert data["status"] == "in_progress"
    assert len(data["questions"]) == 3
    assert data["message"] == "Assessment session started successfully."


def test_start_assessment_resume_existing(client: TestClient, test_user: User, auth_headers: dict, seeded_questions):
    """Calling start twice should resume the same assessment."""
    r1 = client.post("/api/assessments/start", headers=auth_headers)
    r2 = client.post("/api/assessments/start", headers=auth_headers)
    assert r1.json()["assessment_id"] == r2.json()["assessment_id"]


def test_submit_assessment(client: TestClient, test_user: User, auth_headers: dict, seeded_questions):
    """Submitting answers should complete the assessment and return results."""
    # Start assessment
    start_response = client.post("/api/assessments/start", headers=auth_headers)
    assessment_id = start_response.json()["assessment_id"]
    questions = start_response.json()["questions"]

    # Build answers — select option 0 for all questions
    answers = [
        {"question_id": q["id"], "selected_option_index": 0}
        for q in questions
    ]

    response = client.post(
        "/api/assessments/submit",
        json={"assessment_id": assessment_id, "answers": answers},
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert "category_scores" in data
    assert "top_traits" in data
    assert "personality_type" in data
    assert "recommended_domains" in data
    assert "summary" in data
    assert data["user_id"] == test_user.id


def test_get_results_not_found(client: TestClient, test_user: User, auth_headers: dict):
    """Getting results before any assessment should return 404."""
    response = client.get("/api/assessments/results", headers=auth_headers)
    assert response.status_code == 404


def test_get_results_after_submission(client: TestClient, test_user: User, auth_headers: dict, seeded_questions):
    """After submitting, results endpoint should return the latest result."""
    # Start + submit
    start_response = client.post("/api/assessments/start", headers=auth_headers)
    assessment_id = start_response.json()["assessment_id"]
    questions = start_response.json()["questions"]
    answers = [{"question_id": q["id"], "selected_option_index": 1} for q in questions]
    client.post(
        "/api/assessments/submit",
        json={"assessment_id": assessment_id, "answers": answers},
        headers=auth_headers,
    )

    # Fetch results
    response = client.get("/api/assessments/results", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == test_user.id
    assert isinstance(data["category_scores"], dict)
    assert len(data["category_scores"]) > 0


def test_assessment_unauthorized(client: TestClient):
    """Protected assessment endpoints should reject unauthenticated requests."""
    assert client.post("/api/assessments/start").status_code == 401
    assert client.get("/api/assessments/results").status_code == 401
