"""
OneStop AI - Chat Schemas
"""

from pydantic import BaseModel
from datetime import datetime
from typing import List

class ChatMessageRequest(BaseModel):
    content: str

class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
