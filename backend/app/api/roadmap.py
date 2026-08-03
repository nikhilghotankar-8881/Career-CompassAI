"""
OneStop AI - Roadmap Routes
Endpoints: get active roadmap, generate roadmap, update milestone progress
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.auth import get_current_user
from app.database.models import User
from app.schemas.roadmap import RoadmapResponse, MilestoneUpdate
from app.services import roadmap_service

router = APIRouter(prefix="/api/roadmap", tags=["Roadmap"])


@router.get("/", response_model=RoadmapResponse)
async def get_roadmap(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the user's active learning roadmap."""
    roadmap = roadmap_service.get_active_roadmap(db, current_user.id)
    if not roadmap:
        raise HTTPException(status_code=404, detail="No active roadmap found")
    return roadmap


@router.post("/generate/{recommendation_id}", response_model=RoadmapResponse)
async def generate_roadmap(
    recommendation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate a new roadmap based on a career recommendation."""
    roadmap = roadmap_service.generate_roadmap(db, current_user.id, recommendation_id)
    return roadmap


@router.put("/milestones/{milestone_id}", response_model=RoadmapResponse)
async def update_milestone(
    milestone_id: str,
    payload: MilestoneUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update roadmap milestone status."""
    roadmap = roadmap_service.update_milestone_status(db, current_user.id, milestone_id, payload.status)
    return roadmap
