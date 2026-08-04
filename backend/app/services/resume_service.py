"""
OneStop AI - Resume Service
Handles PDF extraction and AI resume analysis using Gemini.
"""

import os
import json
import urllib.request
import urllib.error
import io
import PyPDF2
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import models
from fastapi import HTTPException

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from PDF bytes."""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        raise HTTPException(status_code=400, detail="Could not parse the PDF file.")

def _fallback_resume_analysis() -> dict:
    """Deterministic fallback if Gemini fails."""
    return {
        "score": 65,
        "strengths": [
            "Clear section formatting.",
            "Good baseline of technical skills."
        ],
        "weaknesses": [
            "Lacks quantifiable achievements (e.g. 'improved efficiency by X%').",
            "Missing keywords related to the target role.",
            "Summary section is too generic."
        ],
        "suggestions": [
            "Use the STAR method (Situation, Task, Action, Result) for bullet points.",
            "Tailor your skills section to highlight the specific technologies used in your target role.",
            "Add a link to a portfolio or GitHub profile."
        ]
    }

def _gemini_resume_analysis(resume_text: str, target_role: str, api_key: str) -> dict:
    """Analyze resume using Gemini against a target role."""
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) and Career Coach. 
    Analyze the following resume text for a candidate aiming to become a '{target_role}'.
    
    RESUME TEXT:
    {resume_text}
    
    Provide your analysis as a strictly valid JSON object (NO markdown, NO backticks).
    The JSON object MUST contain exactly these keys:
    - "score": an integer between 0 and 100 representing how well the resume matches the target role.
    - "strengths": a list of 3-4 strings highlighting what the resume does well.
    - "weaknesses": a list of 3-4 strings highlighting what the resume is missing.
    - "suggestions": a list of 3-4 strings with actionable advice to improve the resume.
    """

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.2,
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
            return parsed
    except Exception as e:
        print(f"Gemini API Error for Resume Analysis: {e}")
        return _fallback_resume_analysis()

def analyze_resume(db: Session, user_id: str, file_bytes: bytes):
    """Parses PDF, runs AI analysis, and saves to DB."""
    # 1. Extract Text
    resume_text = extract_text_from_pdf(file_bytes)
    if len(resume_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Not enough readable text found in the PDF.")
        
    # 2. Get Target Role from active roadmap
    active_roadmap = db.query(models.Roadmap).filter(
        models.Roadmap.user_id == user_id,
        models.Roadmap.is_active == True
    ).first()
    
    target_role = active_roadmap.target_role if active_roadmap else "General Professional"

    # 3. AI Analysis
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        analysis_data = _gemini_resume_analysis(resume_text, target_role, api_key)
    else:
        analysis_data = _fallback_resume_analysis()

    # 4. Save to DB
    new_analysis = models.ResumeAnalysis(
        user_id=user_id,
        score=analysis_data.get("score", 0),
        strengths=analysis_data.get("strengths", []),
        weaknesses=analysis_data.get("weaknesses", []),
        suggestions=analysis_data.get("suggestions", [])
    )
    
    # Keep only the latest analysis to save space for MVP
    existing = db.query(models.ResumeAnalysis).filter(models.ResumeAnalysis.user_id == user_id).all()
    for ex in existing:
        db.delete(ex)
        
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)
    
    return new_analysis

def get_latest_analysis(db: Session, user_id: str):
    """Fetch the user's latest resume analysis."""
    return db.query(models.ResumeAnalysis).filter(
        models.ResumeAnalysis.user_id == user_id
    ).order_by(desc(models.ResumeAnalysis.created_at)).first()
