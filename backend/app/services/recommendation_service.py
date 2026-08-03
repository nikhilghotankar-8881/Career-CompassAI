"""
OneStop AI - Recommendation Service
Core logic for AI recommendations and fallback rule-based matching.
"""

import os
import json
import urllib.request
import urllib.error
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import models
from app.schemas.recommendation import CareerRecommendationResponse
from fastapi import HTTPException, status

def _fallback_recommendations(user: models.User, profile: models.Profile, latest_result: models.AssessmentResult) -> list[dict]:
    """Rule-based fallback matching if AI API is unavailable."""
    recommendations = []
    
    # We define a few static archetypes and their required skills.
    archetypes = {
        "Software Engineer": {
            "req_skills": ["Python", "JavaScript", "Algorithms", "System Design"],
            "learning_path": ["Master Data Structures", "Learn a Backend Framework", "Build a Full-Stack Project"],
            "desc": "Design and build software applications.",
            "salary": "$80k - $150k",
            "outlook": "Excellent",
            "trigger": lambda scores: scores.get("Technical", 0) > 70
        },
        "Data Scientist": {
            "req_skills": ["Python", "SQL", "Machine Learning", "Statistics"],
            "learning_path": ["Learn Pandas & NumPy", "Master SQL", "Study Machine Learning Algorithms"],
            "desc": "Analyze data to find actionable insights.",
            "salary": "$90k - $160k",
            "outlook": "Very Good",
            "trigger": lambda scores: scores.get("Analytical", 0) > 75
        },
        "Product Manager": {
            "req_skills": ["Agile", "Communication", "Data Analysis", "User Empathy"],
            "learning_path": ["Learn Agile Methodologies", "Understand User Research", "Take a PM Course"],
            "desc": "Lead product development and strategy.",
            "salary": "$100k - $180k",
            "outlook": "Good",
            "trigger": lambda scores: scores.get("Leadership", 0) > 70 and scores.get("Collaborative", 0) > 60
        },
        "UX/UI Designer": {
            "req_skills": ["Figma", "User Research", "Prototyping", "Design Thinking"],
            "learning_path": ["Learn Figma", "Study Color Theory & Typography", "Build a Portfolio"],
            "desc": "Design intuitive and beautiful user interfaces.",
            "salary": "$70k - $130k",
            "outlook": "Good",
            "trigger": lambda scores: scores.get("Creative", 0) > 70
        }
    }

    scores = {}
    if latest_result:
        scores = latest_result.category_scores

    user_skills = set(profile.skills) if profile and profile.skills else set()

    for title, meta in archetypes.items():
        if not scores or meta["trigger"](scores):
            # Calculate skill gaps
            req_skills = set(meta["req_skills"])
            gaps = list(req_skills - user_skills)
            
            # Simple match percentage
            match_pct = 75
            if not gaps:
                match_pct = 95
            elif len(gaps) < len(req_skills):
                match_pct = 85
                
            # If no assessment, base match
            if not scores:
                match_pct = 70

            recommendations.append({
                "career_title": title,
                "match_percentage": match_pct,
                "description": meta["desc"],
                "required_skills": list(req_skills),
                "skill_gaps": gaps,
                "learning_path": meta["learning_path"],
                "salary_range": meta["salary"],
                "job_outlook": meta["outlook"]
            })
            
    # Default if none triggered
    if not recommendations:
        recommendations.append({
            "career_title": "General Technologist",
            "match_percentage": 60,
            "description": "A versatile role in tech.",
            "required_skills": ["Problem Solving", "Basic IT"],
            "skill_gaps": ["Problem Solving"],
            "learning_path": ["Explore different tech fields"],
            "salary_range": "$50k - $90k",
            "job_outlook": "Stable"
        })

    # Limit to top 3
    return sorted(recommendations, key=lambda x: x["match_percentage"], reverse=True)[:3]


def _gemini_recommendations(user: models.User, profile: models.Profile, latest_result: models.AssessmentResult, api_key: str) -> list[dict]:
    """Call Google Gemini API using urllib to avoid heavy dependencies."""
    scores = latest_result.category_scores if latest_result else {}
    traits = latest_result.top_traits if latest_result else []
    user_skills = profile.skills if profile and profile.skills else []
    
    prompt = f"""
    You are an expert AI Career Advisor. Generate exactly 3 personalized career recommendations.
    User Profile:
    - Current Skills: {', '.join(user_skills) if user_skills else 'None listed'}
    - Assessment Scores: {scores}
    - Top Traits: {', '.join(traits) if traits else 'Unknown'}

    Return ONLY a valid JSON array of objects, with NO markdown formatting, NO backticks.
    Each object must have exactly these keys:
    "career_title" (string)
    "match_percentage" (integer 0-100)
    "description" (string, short summary of the role)
    "required_skills" (array of strings)
    "skill_gaps" (array of strings, skills they don't have yet)
    "learning_path" (array of strings, 3-5 steps to get there)
    "salary_range" (string)
    "job_outlook" (string)
    """

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.4,
        }
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=15) as response:
            result = json.loads(response.read().decode("utf-8"))
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            # Clean up potential markdown formatting from response
            text = text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
                
            parsed = json.loads(text)
            if isinstance(parsed, list):
                return parsed
            else:
                raise Exception("Response is not a list")
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return _fallback_recommendations(user, profile, latest_result)


def generate_recommendations_for_user(db: Session, user_id: str):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    
    latest_result = db.query(models.AssessmentResult).filter(
        models.AssessmentResult.user_id == user_id
    ).order_by(desc(models.AssessmentResult.created_at)).first()
    
    # Delete old recommendations
    db.query(models.CareerRecommendation).filter(models.CareerRecommendation.user_id == user_id).delete()
    db.commit()

    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        raw_recs = _gemini_recommendations(user, profile, latest_result, api_key)
    else:
        raw_recs = _fallback_recommendations(user, profile, latest_result)
        
    created_recs = []
    for r in raw_recs:
        rec_model = models.CareerRecommendation(
            user_id=user_id,
            assessment_result_id=latest_result.id if latest_result else None,
            career_title=r.get("career_title", "Unknown Role"),
            match_percentage=r.get("match_percentage", 50),
            description=r.get("description", ""),
            required_skills=r.get("required_skills", []),
            skill_gaps=r.get("skill_gaps", []),
            learning_path=r.get("learning_path", []),
            salary_range=r.get("salary_range"),
            job_outlook=r.get("job_outlook")
        )
        db.add(rec_model)
        created_recs.append(rec_model)
        
    db.commit()
    for rec in created_recs:
        db.refresh(rec)
        
    return created_recs

def get_user_recommendations(db: Session, user_id: str):
    return db.query(models.CareerRecommendation).filter(
        models.CareerRecommendation.user_id == user_id
    ).order_by(desc(models.CareerRecommendation.match_percentage)).all()

def get_recommendation_by_id(db: Session, user_id: str, rec_id: str):
    rec = db.query(models.CareerRecommendation).filter(
        models.CareerRecommendation.id == rec_id,
        models.CareerRecommendation.user_id == user_id
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return rec
