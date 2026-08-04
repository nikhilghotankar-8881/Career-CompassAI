"""
OneStop AI - Course Service
Integrates with Gemini to recommend learning resources based on skill gaps.
"""

import os
import json
import urllib.request
import urllib.parse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import models
from fastapi import HTTPException

def _generate_course_search_url(title: str, platform: str) -> str:
    """Generates a search URL for common platforms."""
    query = urllib.parse.quote(f"{title}")
    if platform.lower() == "coursera":
        return f"https://www.coursera.org/search?query={query}"
    elif platform.lower() == "udemy":
        return f"https://www.udemy.com/courses/search/?q={query}"
    elif platform.lower() == "edx":
        return f"https://www.edx.org/search?q={query}"
    else:
        return f"https://www.google.com/search?q={urllib.parse.quote(title + ' ' + platform)}"

def _fallback_courses() -> list:
    """Fallback list if Gemini fails."""
    return [
        {
            "title": "Introduction to Python Programming",
            "platform": "Coursera",
            "difficulty": "Beginner",
            "duration": "4 weeks",
            "type": "Course"
        },
        {
            "title": "AWS Certified Cloud Practitioner",
            "platform": "AWS",
            "difficulty": "Beginner",
            "duration": "2 weeks",
            "type": "Certification"
        },
        {
            "title": "Advanced React and Redux",
            "platform": "Udemy",
            "difficulty": "Advanced",
            "duration": "6 weeks",
            "type": "Course"
        }
    ]

def generate_courses(db: Session, user_id: str):
    """Generate and save new course recommendations using Gemini."""
    # 1. Gather Context
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    active_roadmap = db.query(models.Roadmap).filter(
        models.Roadmap.user_id == user_id,
        models.Roadmap.is_active == True
    ).first()

    if not active_roadmap:
        raise HTTPException(status_code=400, detail="You need an active roadmap to generate course recommendations.")

    target_role = active_roadmap.target_role
    current_skills = profile.skills if profile and profile.skills else []
    
    # Identify gaps from milestones (assuming incomplete milestones are gaps)
    milestones = db.query(models.Milestone).filter(models.Milestone.roadmap_id == active_roadmap.id).all()
    pending_topics = [m.title for m in milestones if m.status != 'completed']

    # 2. Build Prompt
    prompt = f"""
    You are an expert career and education advisor.
    The user is aiming for the role of '{target_role}'.
    They already have these skills: {', '.join(current_skills)}.
    They need to learn these topics: {', '.join(pending_topics[:10])}.

    Recommend exactly 5 real-world courses or certifications that will help them learn these pending topics.
    Mix platforms (e.g. Coursera, Udemy, edX, Google, AWS).
    Mix Types (Course vs Certification).

    Provide your answer strictly as a JSON array of objects. Do not use markdown backticks.
    Each object MUST have these keys:
    - "title": (string) The exact name of the course or certification.
    - "platform": (string) The platform hosting it (e.g. Coursera).
    - "difficulty": (string) Beginner, Intermediate, or Advanced.
    - "duration": (string) Estimated duration (e.g. 4 weeks).
    - "type": (string) Either "Course" or "Certification".
    """

    api_key = os.getenv("GEMINI_API_KEY")
    courses_data = []

    if api_key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        data = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.4}
        }
        try:
            req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=20) as response:
                result = json.loads(response.read().decode("utf-8"))
                text = result["candidates"][0]["content"]["parts"][0]["text"]
                text = text.strip()
                if text.startswith("```json"): text = text[7:]
                if text.startswith("```"): text = text[3:]
                if text.endswith("```"): text = text[:-3]
                text = text.strip()
                courses_data = json.loads(text)
        except Exception as e:
            print(f"Gemini API Error for Courses: {e}")
            courses_data = _fallback_courses()
    else:
        courses_data = _fallback_courses()

    # 3. Save to DB
    # Clear old recommendations for simplicity in this MVP
    db.query(models.CourseRecommendation).filter(models.CourseRecommendation.user_id == user_id).delete()
    
    saved_courses = []
    for item in courses_data:
        search_url = _generate_course_search_url(item.get("title", ""), item.get("platform", ""))
        course = models.CourseRecommendation(
            user_id=user_id,
            title=item.get("title", "Unknown Title"),
            platform=item.get("platform", "Unknown Platform"),
            difficulty=item.get("difficulty", "Intermediate"),
            duration=item.get("duration", "4 weeks"),
            type=item.get("type", "Course"),
            url=search_url
        )
        db.add(course)
        saved_courses.append(course)

    db.commit()
    for c in saved_courses:
        db.refresh(c)
        
    return saved_courses

def get_courses(db: Session, user_id: str):
    """Fetch user's generated course recommendations."""
    return db.query(models.CourseRecommendation).filter(
        models.CourseRecommendation.user_id == user_id
    ).order_by(desc(models.CourseRecommendation.created_at)).all()
