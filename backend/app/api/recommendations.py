"""
OneStop AI - Recommendation Routes
Endpoints: generate and get career recommendations
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.auth import get_current_user
from app.database.models import User, Profile
from app.schemas.recommendation import CareerRecommendationResponse, RecommendationListResponse
from app.services import recommendation_service

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.post("/generate", response_model=RecommendationListResponse)
def generate_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate new AI career recommendations based on profile and assessments."""
    recs = recommendation_service.generate_recommendations_for_user(db, current_user.id)
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    user_skills = profile.skills if profile and profile.skills else []
    
    return RecommendationListResponse(
        recommendations=recs,
        user_skills=user_skills,
        message="Recommendations generated successfully"
    )


@router.get("/", response_model=RecommendationListResponse)
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the user's current career recommendations."""
    recs = recommendation_service.get_user_recommendations(db, current_user.id)
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    user_skills = profile.skills if profile and profile.skills else []
    
    return RecommendationListResponse(
        recommendations=recs,
        user_skills=user_skills,
        message="Recommendations retrieved successfully"
    )


@router.get("/{rec_id}", response_model=CareerRecommendationResponse)
def get_recommendation_details(
    rec_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detailed view of a specific recommendation."""
    return recommendation_service.get_recommendation_by_id(db, current_user.id, rec_id)
