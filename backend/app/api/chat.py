"""
OneStop AI - Chatbot Routes
Endpoints: send message, get chat history
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.auth import get_current_user
from app.database.models import User
from app.schemas.chat import ChatMessageRequest, ChatMessageResponse
from app.services import chat_service

router = APIRouter(prefix="/api/chat", tags=["Chatbot"])

@router.get("/history", response_model=List[ChatMessageResponse])
async def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get chat conversation history."""
    return chat_service.get_history(db, current_user.id)

@router.post("/message", response_model=ChatMessageResponse)
async def send_message(
    payload: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a message to the AI career chatbot and get a response."""
    return chat_service.send_message(db, current_user.id, payload.content)
