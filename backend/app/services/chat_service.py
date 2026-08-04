"""
OneStop AI - Chat Service
Integrates with Gemini, providing context from user profile, roadmap, and resume.
"""

import os
import json
import urllib.request
import urllib.error
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import models
from fastapi import HTTPException

def _build_context_prompt(db: Session, user_id: str) -> str:
    """Gathers user context to prepend to the AI instructions."""
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    
    # Active Roadmap
    active_roadmap = db.query(models.Roadmap).filter(
        models.Roadmap.user_id == user_id,
        models.Roadmap.is_active == True
    ).first()
    
    # Latest Resume Analysis
    latest_resume = db.query(models.ResumeAnalysis).filter(
        models.ResumeAnalysis.user_id == user_id
    ).order_by(desc(models.ResumeAnalysis.created_at)).first()

    context = "USER CONTEXT:\n"
    if profile:
        context += f"- Bio: {profile.bio or 'N/A'}\n"
        context += f"- Skills: {', '.join(profile.skills) if profile.skills else 'None listed'}\n"
        context += f"- Goals: {profile.career_goals or 'N/A'}\n"
    else:
        context += "- Profile: Not completed yet.\n"
        
    if active_roadmap:
        context += f"- Active Target Role: {active_roadmap.target_role} ({active_roadmap.progress_percentage}% complete)\n"
    else:
        context += "- Active Target Role: None active yet.\n"
        
    if latest_resume:
        context += f"- Latest Resume Score: {latest_resume.score}/100\n"

    return context

def _fallback_chat_response() -> str:
    """Fallback if Gemini fails."""
    return "I am currently experiencing high traffic and cannot connect to my intelligence engine. Please try again later. In the meantime, I recommend checking out your Learning Roadmap!"

def _gemini_chat(system_prompt: str, history: list, new_message: str, api_key: str) -> str:
    """Call Google Gemini API using urllib for a conversational response."""
    
    # Format history for Gemini
    # Gemini expects alternating user and model roles.
    contents = []
    
    # Insert system prompt as a user message at the very beginning
    # In Gemini API v1beta, system instructions are supported via `systemInstruction`
    
    for msg in history:
        gemini_role = "user" if msg.role == "user" else "model"
        contents.append({
            "role": gemini_role,
            "parts": [{"text": msg.content}]
        })
        
    # Append the new user message
    contents.append({
        "role": "user",
        "parts": [{"text": new_message}]
    })

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    data = {
        "systemInstruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
        }
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=20) as response:
            result = json.loads(response.read().decode("utf-8"))
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            return text.strip()
    except Exception as e:
        print(f"Gemini API Error for Chat: {e}")
        return _fallback_chat_response()

def get_history(db: Session, user_id: str):
    """Fetch chat history for the user."""
    return db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == user_id
    ).order_by(models.ChatMessage.created_at).all()

def send_message(db: Session, user_id: str, content: str):
    """Save user message, call AI, save AI message, return AI message."""
    # 1. Save User Message
    user_msg = models.ChatMessage(
        user_id=user_id,
        role="user",
        content=content
    )
    db.add(user_msg)
    db.commit()

    # 2. Get history (limit to last 10 messages for context window)
    history = db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == user_id,
        models.ChatMessage.id != user_msg.id  # Exclude the one we just added
    ).order_by(desc(models.ChatMessage.created_at)).limit(10).all()
    
    # Reverse to chronological order
    history.reverse()

    # 3. Build System Prompt
    base_instructions = "You are an expert, friendly AI Career Advisor for the 'OneStop AI' platform. Keep your responses concise, actionable, and encouraging."
    user_context = _build_context_prompt(db, user_id)
    system_prompt = f"{base_instructions}\n\n{user_context}"

    # 4. Call AI
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        ai_response_text = _gemini_chat(system_prompt, history, content, api_key)
    else:
        ai_response_text = _fallback_chat_response()

    # 5. Save AI Message
    ai_msg = models.ChatMessage(
        user_id=user_id,
        role="assistant",
        content=ai_response_text
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg
