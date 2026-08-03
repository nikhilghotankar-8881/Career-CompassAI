"""
OneStop AI - Roadmap Service
Logic for AI roadmap generation, fetching active roadmap, and updating milestone status.
"""

import os
import json
import urllib.request
import urllib.error
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import models
from fastapi import HTTPException

def _fallback_roadmap(target_role: str, learning_path: list) -> list[dict]:
    """Fallback if Gemini fails."""
    milestones = []
    # If learning path from recommendation has items, use them
    if learning_path and len(learning_path) > 0:
        for i, step in enumerate(learning_path):
            milestones.append({
                "title": step,
                "description": f"Master {step} to progress towards your goal.",
                "order_index": i
            })
    else:
        # Generic fallback
        steps = [
            {"title": "Foundational Basics", "description": f"Learn the core principles of {target_role}."},
            {"title": "Practical Application", "description": "Build small projects to apply your skills."},
            {"title": "Advanced Concepts", "description": "Dive deep into complex areas of the field."},
            {"title": "Portfolio Building", "description": "Showcase your work to potential employers."}
        ]
        for i, step in enumerate(steps):
            milestones.append({
                "title": step["title"],
                "description": step["description"],
                "order_index": i
            })
    return milestones


def _gemini_roadmap(target_role: str, learning_path: list, api_key: str) -> list[dict]:
    """Call Google Gemini API using urllib for detailed milestones."""
    prompt = f"""
    You are an expert Career Coach. Generate a highly detailed step-by-step learning roadmap (milestones) for becoming a {target_role}.
    The user's initial high-level learning path suggestions were: {', '.join(learning_path) if learning_path else 'None'}
    
    Return ONLY a valid JSON array of objects, with NO markdown formatting, NO backticks.
    Generate between 5 and 7 milestones.
    Each object must have exactly these keys:
    "title" (string, short milestone name)
    "description" (string, detailed action plan for this step)
    "order_index" (integer, 0-indexed order)
    """

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.3,
        }
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=15) as response:
            result = json.loads(response.read().decode("utf-8"))
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            text = text.strip()
            if text.startswith("```json"): text = text[7:]
            if text.startswith("```"): text = text[3:]
            if text.endswith("```"): text = text[:-3]
            text = text.strip()
                
            parsed = json.loads(text)
            if isinstance(parsed, list):
                # Ensure they have order_index and sort
                for i, m in enumerate(parsed):
                    if "order_index" not in m:
                        m["order_index"] = i
                return sorted(parsed, key=lambda x: x["order_index"])
            else:
                raise Exception("Response is not a list")
    except Exception as e:
        print(f"Gemini API Error for Roadmap: {e}")
        return _fallback_roadmap(target_role, learning_path)


def generate_roadmap(db: Session, user_id: str, recommendation_id: str):
    """Generates a roadmap based on a specific recommendation and sets it as active."""
    rec = db.query(models.CareerRecommendation).filter(
        models.CareerRecommendation.id == recommendation_id,
        models.CareerRecommendation.user_id == user_id
    ).first()
    
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    # Deactivate any existing roadmaps
    existing = db.query(models.Roadmap).filter(models.Roadmap.user_id == user_id).all()
    for rm in existing:
        rm.is_active = False
    
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        milestones_data = _gemini_roadmap(rec.career_title, rec.learning_path, api_key)
    else:
        milestones_data = _fallback_roadmap(rec.career_title, rec.learning_path)
        
    new_roadmap = models.Roadmap(
        user_id=user_id,
        recommendation_id=rec.id,
        target_role=rec.career_title,
        progress_percentage=0,
        is_active=True
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    
    for m_data in milestones_data:
        milestone = models.Milestone(
            roadmap_id=new_roadmap.id,
            title=m_data.get("title", "Milestone"),
            description=m_data.get("description", ""),
            status="pending",
            order_index=m_data.get("order_index", 0)
        )
        db.add(milestone)
        
    db.commit()
    db.refresh(new_roadmap)
    return new_roadmap


def get_active_roadmap(db: Session, user_id: str):
    roadmap = db.query(models.Roadmap).filter(
        models.Roadmap.user_id == user_id,
        models.Roadmap.is_active == True
    ).first()
    
    if roadmap:
        # Sort milestones by order_index
        roadmap.milestones.sort(key=lambda x: x.order_index)
        
    return roadmap


def update_milestone_status(db: Session, user_id: str, milestone_id: str, status: str):
    roadmap = get_active_roadmap(db, user_id)
    if not roadmap:
        raise HTTPException(status_code=404, detail="Active roadmap not found")
        
    milestone = db.query(models.Milestone).filter(
        models.Milestone.id == milestone_id,
        models.Milestone.roadmap_id == roadmap.id
    ).first()
    
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
        
    if status not in ["pending", "in_progress", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    milestone.status = status
    
    # Recalculate roadmap progress
    total = len(roadmap.milestones)
    completed = sum(1 for m in roadmap.milestones if (m.status == "completed" or (m.id == milestone.id and status == "completed")))
    
    if total > 0:
        roadmap.progress_percentage = int((completed / total) * 100)
    
    db.commit()
    db.refresh(roadmap)
    
    return roadmap
