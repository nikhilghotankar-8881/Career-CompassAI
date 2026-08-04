"""
OneStop AI - Resume Routes
Endpoints: upload resume, get analysis
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.auth import get_current_user
from app.database.models import User
from app.schemas.resume import ResumeAnalysisResponse
from app.services import resume_service

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@router.post("/upload", response_model=ResumeAnalysisResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload resume (PDF) for AI analysis."""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported at this time.")
        
    contents = await file.read()
    analysis = resume_service.analyze_resume(db, current_user.id, contents)
    return analysis


@router.get("/analysis", response_model=ResumeAnalysisResponse)
async def get_resume_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the user's latest resume analysis results."""
    analysis = resume_service.get_latest_analysis(db, current_user.id)
    if not analysis:
        raise HTTPException(status_code=404, detail="No resume analysis found")
    return analysis
