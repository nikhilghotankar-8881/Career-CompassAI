"""
OneStop AI - Dashboard API Tests
Phase 15: Tests for GET /api/dashboard/summary.
"""

from fastapi.testclient import TestClient
from app.database.models import (
    User, AssessmentResult, Roadmap, Milestone,
    CareerRecommendation, ResumeAnalysis,
)


def test_dashboard_summary_new_user(client: TestClient, test_user: User, auth_headers: dict):
    """A new user should get a dashboard with all-empty/zero defaults."""
    response = client.get("/api/dashboard/summary", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["assessment_completed"] is False
    assert data["top_trait"] is None
    assert data["roadmap_active"] is False
    assert data["target_role"] is None
    assert data["roadmap_progress"] == 0
    assert data["milestones_completed"] == 0
    assert data["recommendation_match"] is None
    assert data["resume_score"] is None


def test_dashboard_with_assessment_result(client: TestClient, test_user: User, auth_headers: dict, db_session):
    """Dashboard should reflect a completed assessment."""
    result = AssessmentResult(
        assessment_id="dummy-assessment-id",
        user_id=test_user.id,
        category_scores={"Analytical": 85, "Technical": 70},
        top_traits=["Problem Solver", "Logical Thinker"],
        personality_type="Analytical Thinker",
        recommended_domains=["Data Science"],
        summary="Strong analytical profile.",
    )
    db_session.add(result)
    db_session.commit()

    response = client.get("/api/dashboard/summary", headers=auth_headers)
    data = response.json()
    assert data["assessment_completed"] is True
    assert data["top_trait"] == "Problem Solver"


def test_dashboard_with_active_roadmap(client: TestClient, test_user: User, auth_headers: dict, db_session):
    """Dashboard should show active roadmap info and milestone count."""
    rec = CareerRecommendation(
        user_id=test_user.id,
        career_title="Data Scientist",
        match_percentage=88,
        description="Analyze data.",
    )
    db_session.add(rec)
    db_session.commit()
    db_session.refresh(rec)

    roadmap = Roadmap(
        user_id=test_user.id,
        recommendation_id=rec.id,
        target_role="Data Scientist",
        progress_percentage=33,
        is_active=True,
    )
    db_session.add(roadmap)
    db_session.commit()
    db_session.refresh(roadmap)

    m1 = Milestone(roadmap_id=roadmap.id, title="Step 1", description="Do step 1", status="completed", order_index=0)
    m2 = Milestone(roadmap_id=roadmap.id, title="Step 2", description="Do step 2", status="pending", order_index=1)
    m3 = Milestone(roadmap_id=roadmap.id, title="Step 3", description="Do step 3", status="pending", order_index=2)
    db_session.add_all([m1, m2, m3])
    db_session.commit()

    response = client.get("/api/dashboard/summary", headers=auth_headers)
    data = response.json()
    assert data["roadmap_active"] is True
    assert data["target_role"] == "Data Scientist"
    assert data["roadmap_progress"] == 33
    assert data["milestones_completed"] == 1
    assert data["recommendation_match"] == 88


def test_dashboard_with_resume_score(client: TestClient, test_user: User, auth_headers: dict, db_session):
    """Dashboard should display the latest resume score."""
    analysis = ResumeAnalysis(
        user_id=test_user.id,
        score=75,
        strengths=["Good structure"],
        weaknesses=["Missing keywords"],
        suggestions=["Add more metrics"],
    )
    db_session.add(analysis)
    db_session.commit()

    response = client.get("/api/dashboard/summary", headers=auth_headers)
    data = response.json()
    assert data["resume_score"] == 75


def test_dashboard_unauthorized(client: TestClient):
    """Dashboard should require authentication."""
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 401
