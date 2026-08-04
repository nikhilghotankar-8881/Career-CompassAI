"""
OneStop AI - Progress Tracking API Tests
Phase 15: Tests for GET /api/progress/overview.
"""

from fastapi.testclient import TestClient
from app.database.models import User, Roadmap, Milestone, AssessmentResult


def test_progress_overview_new_user(client: TestClient, test_user: User, auth_headers: dict):
    """A fresh user should get zeroed-out stats and empty collections."""
    response = client.get("/api/progress/overview", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    # Learning stats should all be 0
    stats = data["learning_stats"]
    assert stats["assessments_taken"] == 0
    assert stats["roadmaps_created"] == 0
    assert stats["milestones_completed"] == 0
    assert stats["courses_recommended"] == 0
    assert stats["resume_reviews"] == 0
    assert stats["chat_messages_sent"] == 0

    # Collections should be empty
    assert data["skill_progress"] == []
    assert data["roadmap_history"] == []
    assert data["assessment_history"] == []
    assert data["achievements"] == []


def test_progress_with_roadmap_data(client: TestClient, test_user: User, auth_headers: dict, db_session):
    """Progress overview should reflect roadmap and milestone data."""
    roadmap = Roadmap(
        user_id=test_user.id,
        target_role="Data Scientist",
        progress_percentage=50,
        is_active=True,
    )
    db_session.add(roadmap)
    db_session.commit()
    db_session.refresh(roadmap)

    m1 = Milestone(roadmap_id=roadmap.id, title="Step 1", description="Do it", status="completed", order_index=0)
    m2 = Milestone(roadmap_id=roadmap.id, title="Step 2", description="Do it 2", status="pending", order_index=1)
    db_session.add_all([m1, m2])
    db_session.commit()

    response = client.get("/api/progress/overview", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert data["learning_stats"]["roadmaps_created"] == 1
    assert data["learning_stats"]["milestones_completed"] == 1
    assert data["learning_stats"]["milestones_total"] == 2
    assert len(data["roadmap_history"]) == 1
    assert data["roadmap_history"][0]["target_role"] == "Data Scientist"


def test_progress_with_assessment_history(client: TestClient, test_user: User, auth_headers: dict, db_session):
    """Progress overview should include assessment history and skill progress."""
    result = AssessmentResult(
        assessment_id="dummy-id",
        user_id=test_user.id,
        category_scores={"Analytical": 85, "Technical": 70, "Creative": 60},
        top_traits=["Thinker"],
        personality_type="Analytical",
        recommended_domains=["Data Science"],
        summary="Strong profile",
    )
    db_session.add(result)
    db_session.commit()

    response = client.get("/api/progress/overview", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert data["learning_stats"]["assessments_taken"] == 1
    assert len(data["assessment_history"]) == 1
    assert len(data["skill_progress"]) == 3  # 3 domain scores

    domains = {sp["domain"] for sp in data["skill_progress"]}
    assert "Analytical" in domains


def test_progress_auto_awards_badges(client: TestClient, test_user: User, auth_headers: dict, db_session):
    """Progress overview should auto-award badges when criteria are met."""
    # Create an assessment result to trigger 'first_assessment' badge
    result = AssessmentResult(
        assessment_id="award-test",
        user_id=test_user.id,
        category_scores={"Analytical": 80},
        top_traits=["Thinker"],
        personality_type="Analyst",
        recommended_domains=["Engineering"],
        summary="Good",
    )
    db_session.add(result)
    db_session.commit()

    response = client.get("/api/progress/overview", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    badge_keys = [a["badge_key"] for a in data["achievements"]]
    assert "first_assessment" in badge_keys


def test_progress_unauthorized(client: TestClient):
    """Progress endpoint should require authentication."""
    assert client.get("/api/progress/overview").status_code == 401
