"""
OneStop AI - Chatbot Routes
Endpoints: send message, get chat history
Full implementation in Phase 10.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api/chat", tags=["Chatbot"])


@router.post("/message")
async def send_message():
    """Send a message to the AI career chatbot. (Phase 10)"""
    return {"message": "Chat endpoint — coming in Phase 10", "success": True}


@router.get("/history")
async def get_chat_history():
    """Get chat conversation history. (Phase 10)"""
    return {"message": "Chat history endpoint — coming in Phase 10", "success": True}
