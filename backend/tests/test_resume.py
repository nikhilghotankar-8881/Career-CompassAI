"""
OneStop AI - Resume API Tests
Phase 15: Tests for POST /api/resume/upload, GET /api/resume/analysis.
"""

from fastapi.testclient import TestClient
from app.database.models import User, ResumeAnalysis


def test_get_resume_analysis_not_found(client: TestClient, test_user: User, auth_headers: dict):
    """Getting resume analysis before any upload should return 404."""
    response = client.get("/api/resume/analysis", headers=auth_headers)
    assert response.status_code == 404
    assert "No resume analysis found" in response.json()["detail"]


def test_get_resume_analysis_with_data(client: TestClient, test_user: User, auth_headers: dict, db_session):
    """After seeding a resume analysis, the endpoint should return it."""
    analysis = ResumeAnalysis(
        user_id=test_user.id,
        score=82,
        strengths=["Clear structure", "Quantified achievements"],
        weaknesses=["Missing keywords", "No summary section"],
        suggestions=["Add a professional summary", "Include more industry keywords"],
    )
    db_session.add(analysis)
    db_session.commit()

    response = client.get("/api/resume/analysis", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 82
    assert "Clear structure" in data["strengths"]
    assert "Missing keywords" in data["weaknesses"]
    assert len(data["suggestions"]) == 2


def test_upload_non_pdf_rejected(client: TestClient, test_user: User, auth_headers: dict):
    """Uploading a non-PDF file should return 400."""
    response = client.post(
        "/api/resume/upload",
        files={"file": ("resume.txt", b"This is a text file", "text/plain")},
        headers=auth_headers,
    )
    assert response.status_code == 400
    assert "PDF" in response.json()["detail"]


def test_resume_unauthorized(client: TestClient):
    """Resume endpoints should require authentication."""
    assert client.get("/api/resume/analysis").status_code == 401
