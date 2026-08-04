"""
OneStop AI - Authentication API Tests
Phase 15: Tests for register, login, me, forgot-password, reset-password.
"""

from fastapi.testclient import TestClient
from app.core.security import verify_password
from app.database.models import User


# ========================
# Registration Tests
# ========================

def test_register_user_success(client: TestClient, db_session):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "securepassword",
            "full_name": "New User"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["email"] == "newuser@example.com"
    assert data["user"]["full_name"] == "New User"
    assert "access_token" in data

    # Verify user was saved to DB
    user = db_session.query(User).filter(User.email == "newuser@example.com").first()
    assert user is not None
    assert verify_password("securepassword", user.hashed_password)


def test_register_duplicate_email(client: TestClient, test_user: User):
    response = client.post(
        "/api/auth/register",
        json={
            "email": test_user.email,
            "password": "anotherpassword",
            "full_name": "Duplicate User"
        }
    )
    assert response.status_code == 400
    assert "already" in response.json()["detail"].lower()


def test_register_short_password(client: TestClient):
    """Password shorter than 6 chars should be rejected by Pydantic validation."""
    response = client.post(
        "/api/auth/register",
        json={"email": "short@example.com", "password": "abc", "full_name": "Short Pass"}
    )
    assert response.status_code == 422  # Pydantic validation error


def test_register_invalid_email(client: TestClient):
    """Invalid email format should be rejected."""
    response = client.post(
        "/api/auth/register",
        json={"email": "not-an-email", "password": "password123", "full_name": "Bad Email"}
    )
    assert response.status_code == 422


# ========================
# Login Tests
# ========================

def test_login_success(client: TestClient, test_user: User):
    response = client.post(
        "/api/auth/login",
        json={"email": test_user.email, "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == test_user.email


def test_login_invalid_password(client: TestClient, test_user: User):
    response = client.post(
        "/api/auth/login",
        json={"email": test_user.email, "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "Invalid" in response.json()["detail"]


def test_login_nonexistent_user(client: TestClient):
    """Login with an unregistered email should fail."""
    response = client.post(
        "/api/auth/login",
        json={"email": "ghost@example.com", "password": "password123"}
    )
    assert response.status_code == 401


def test_login_inactive_user(client: TestClient, inactive_user: User):
    """Deactivated user should not be able to log in."""
    response = client.post(
        "/api/auth/login",
        json={"email": inactive_user.email, "password": "password123"}
    )
    assert response.status_code == 403
    assert "disabled" in response.json()["detail"].lower()


# ========================
# Get Current User Tests
# ========================

def test_get_current_user(client: TestClient, test_user: User, auth_headers: dict):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert data["is_admin"] is False


def test_get_me_without_token(client: TestClient):
    """Accessing /me without a token should return 401."""
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_get_me_with_invalid_token(client: TestClient):
    """An invalid bearer token should return 401."""
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer fake.invalid.token"})
    assert response.status_code == 401


# ========================
# Password Reset Tests
# ========================

def test_forgot_password_existing_email(client: TestClient, test_user: User):
    """Forgot password should return success message regardless of whether email exists."""
    response = client.post(
        "/api/auth/forgot-password",
        json={"email": test_user.email}
    )
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_forgot_password_nonexistent_email(client: TestClient):
    """Forgot password should NOT leak whether email exists."""
    response = client.post(
        "/api/auth/forgot-password",
        json={"email": "nonexistent@example.com"}
    )
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_reset_password_invalid_token(client: TestClient):
    """Reset with an invalid token should return 400."""
    response = client.post(
        "/api/auth/reset-password",
        json={"token": "invalid-token-12345", "new_password": "newpassword123"}
    )
    assert response.status_code == 400
