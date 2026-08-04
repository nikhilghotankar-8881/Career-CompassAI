"""
OneStop AI - Shared Test Fixtures
Phase 15 Comprehensive Testing
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, StaticPool
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database.connection import Base, get_db
from app.database.models import (
    User, Profile, Question, Assessment, AssessmentAnswer, AssessmentResult,
    CareerRecommendation, Roadmap, Milestone, ResumeAnalysis, ChatMessage,
    CourseRecommendation, Achievement, Notification,
)

# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Override the get_db dependency and provide a TestClient."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(db_session):
    """Create a standard test user."""
    from app.core.security import hash_password
    user = User(
        email="test@example.com",
        full_name="Test User",
        hashed_password=hash_password("password123"),
        is_active=True,
        is_admin=False
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def admin_user(db_session):
    """Create an admin test user."""
    from app.core.security import hash_password
    user = User(
        email="admin@example.com",
        full_name="Admin User",
        hashed_password=hash_password("admin123"),
        is_active=True,
        is_admin=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def inactive_user(db_session):
    """Create a deactivated test user."""
    from app.core.security import hash_password
    user = User(
        email="inactive@example.com",
        full_name="Inactive User",
        hashed_password=hash_password("password123"),
        is_active=False,
        is_admin=False
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def get_auth_headers(client: TestClient, user: User, password: str) -> dict:
    """Helper to get JWT auth headers for a user."""
    response = client.post(
        "/api/auth/login",
        json={"email": user.email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def auth_headers(client, test_user):
    """Get auth headers for the standard test user."""
    return get_auth_headers(client, test_user, "password123")


@pytest.fixture(scope="function")
def admin_headers(client, admin_user):
    """Get auth headers for the admin user."""
    return get_auth_headers(client, admin_user, "admin123")


@pytest.fixture(scope="function")
def seeded_questions(db_session):
    """Seed minimal assessment questions for testing the full flow."""
    questions = []
    categories = ["personality", "skill", "interest"]
    for i, cat in enumerate(categories):
        q = Question(
            category=cat,
            sub_domain="Analytical",
            question_text=f"Test {cat} question {i + 1}?",
            options=[
                {"label": "Option A", "score_vector": {"Analytical": 5, "Technical": 3, "Creative": 1, "Leadership": 2, "Collaborative": 4}},
                {"label": "Option B", "score_vector": {"Analytical": 2, "Technical": 5, "Creative": 3, "Leadership": 4, "Collaborative": 1}},
                {"label": "Option C", "score_vector": {"Analytical": 3, "Technical": 1, "Creative": 5, "Leadership": 3, "Collaborative": 2}},
                {"label": "Option D", "score_vector": {"Analytical": 4, "Technical": 2, "Creative": 2, "Leadership": 5, "Collaborative": 3}},
            ],
            order_index=i,
        )
        db_session.add(q)
        questions.append(q)
    db_session.commit()
    for q in questions:
        db_session.refresh(q)
    return questions


@pytest.fixture(scope="function")
def seeded_recommendation(db_session, test_user):
    """Create a career recommendation for roadmap generation tests."""
    rec = CareerRecommendation(
        user_id=test_user.id,
        career_title="Software Engineer",
        match_percentage=92,
        description="Build scalable systems.",
        required_skills=["Python", "SQL", "Algorithms"],
        skill_gaps=["System Design"],
        learning_path=["Learn Python", "Master SQL", "Study Algorithms"],
        salary_range="$100k - $150k",
        job_outlook="Strong",
    )
    db_session.add(rec)
    db_session.commit()
    db_session.refresh(rec)
    return rec


@pytest.fixture(scope="function")
def seeded_roadmap(db_session, test_user, seeded_recommendation):
    """Create an active roadmap with milestones for testing."""
    roadmap = Roadmap(
        user_id=test_user.id,
        recommendation_id=seeded_recommendation.id,
        target_role="Software Engineer",
        progress_percentage=0,
        is_active=True,
    )
    db_session.add(roadmap)
    db_session.commit()
    db_session.refresh(roadmap)

    milestones = []
    for i, title in enumerate(["Learn Python", "Master SQL", "Study Algorithms"]):
        m = Milestone(
            roadmap_id=roadmap.id,
            title=title,
            description=f"Step {i + 1}: {title}",
            status="pending",
            order_index=i,
        )
        db_session.add(m)
        milestones.append(m)
    db_session.commit()
    for m in milestones:
        db_session.refresh(m)

    roadmap.milestones = milestones
    return roadmap


@pytest.fixture(scope="function")
def seeded_notification(db_session, test_user):
    """Create a notification for the test user."""
    notification = Notification(
        user_id=test_user.id,
        title="Test Notification",
        message="This is a test notification.",
        type="system",
        is_read=False,
    )
    db_session.add(notification)
    db_session.commit()
    db_session.refresh(notification)
    return notification
