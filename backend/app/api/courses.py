"""
OneStop AI - Course Routes
Endpoints: GET /courses, POST /courses/generate
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.auth import get_current_user
from app.database.models import User
from app.schemas.course import CourseRecommendationResponse
from app.services import course_service

router = APIRouter(prefix="/api/courses", tags=["Courses"])

@router.get("", response_model=List[CourseRecommendationResponse])
async def get_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the user's current course recommendations."""
    return course_service.get_courses(db, current_user.id)

@router.post("/generate", response_model=List[CourseRecommendationResponse])
async def generate_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate new course recommendations based on active roadmap and skill gaps."""
    return course_service.generate_courses(db, current_user.id)
