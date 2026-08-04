"""
OneStop AI - Chat API Tests
Phase 15: Tests for GET /api/chat/history, POST /api/chat/message.
"""

from fastapi.testclient import TestClient
from app.database.models import User, ChatMessage


def test_chat_history_empty(client: TestClient, test_user: User, auth_headers: dict):
    """New user should have empty chat history."""
    response = client.get("/api/chat/history", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_chat_history_with_messages(client: TestClient, test_user: User, auth_headers: dict, db_session):
    """Chat history should return previously stored messages."""
    msg1 = ChatMessage(user_id=test_user.id, role="user", content="What career should I choose?")
    msg2 = ChatMessage(user_id=test_user.id, role="assistant", content="Based on your profile, I recommend...")
    db_session.add_all([msg1, msg2])
    db_session.commit()

    response = client.get("/api/chat/history", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["role"] == "user"
    assert data[1]["role"] == "assistant"


def test_chat_unauthorized(client: TestClient):
    """Chat endpoints should require authentication."""
    assert client.get("/api/chat/history").status_code == 401
