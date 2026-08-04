"""
OneStop AI - Health Check Tests
Phase 15: Tests for root and API health endpoints.
"""


def test_root_health_check(client):
    """Root endpoint should return app info and status ok."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "app" in data
    assert "version" in data


def test_api_health_check(client):
    """API health endpoint should return healthy status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "message" in data
