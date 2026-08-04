"""
OneStop AI - Security Unit Tests
Phase 15: Tests for JWT token creation/verification and password hashing.
"""

import pytest
from datetime import timedelta
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    verify_access_token,
)


# ========================
# Password Hashing Tests
# ========================

class TestPasswordHashing:

    def test_hash_password_returns_bcrypt_hash(self):
        """Hashed password should not equal plain text."""
        plain = "securepassword"
        hashed = hash_password(plain)
        assert hashed != plain
        assert hashed.startswith("$2b$") or hashed.startswith("$2a$")

    def test_verify_password_correct(self):
        """verify_password should return True for correct password."""
        plain = "mysecret123"
        hashed = hash_password(plain)
        assert verify_password(plain, hashed) is True

    def test_verify_password_incorrect(self):
        """verify_password should return False for wrong password."""
        hashed = hash_password("correctpassword")
        assert verify_password("wrongpassword", hashed) is False

    def test_hash_is_unique_per_call(self):
        """Each hash call should produce a different salt/hash."""
        h1 = hash_password("samepassword")
        h2 = hash_password("samepassword")
        assert h1 != h2  # bcrypt uses unique salt


# ========================
# JWT Token Tests
# ========================

class TestJWTTokens:

    def test_create_and_verify_token(self):
        """A created token should be verifiable and contain the correct payload."""
        payload = {"sub": "user-123", "email": "user@example.com"}
        token = create_access_token(data=payload)
        decoded = verify_access_token(token)
        assert decoded is not None
        assert decoded["sub"] == "user-123"
        assert decoded["email"] == "user@example.com"

    def test_token_contains_expiry(self):
        """Token payload should contain an 'exp' claim."""
        token = create_access_token(data={"sub": "test"})
        decoded = verify_access_token(token)
        assert "exp" in decoded

    def test_custom_expiry(self):
        """Token with a custom expiry delta should still be valid."""
        token = create_access_token(
            data={"sub": "test"},
            expires_delta=timedelta(hours=2)
        )
        decoded = verify_access_token(token)
        assert decoded is not None
        assert decoded["sub"] == "test"

    def test_expired_token_returns_none(self):
        """An expired token should return None on verification."""
        token = create_access_token(
            data={"sub": "test"},
            expires_delta=timedelta(seconds=-1)  # Already expired
        )
        decoded = verify_access_token(token)
        assert decoded is None

    def test_invalid_token_returns_none(self):
        """A garbage token string should return None."""
        decoded = verify_access_token("this.is.not.a.valid.token")
        assert decoded is None

    def test_tampered_token_returns_none(self):
        """A tampered token should fail verification."""
        token = create_access_token(data={"sub": "user"})
        # Tamper with the token by appending characters
        tampered = token + "TAMPERED"
        decoded = verify_access_token(tampered)
        assert decoded is None
