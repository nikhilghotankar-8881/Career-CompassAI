"""
OneStop AI - Progress Tracking Routes
Endpoints: GET /api/progress/overview
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.auth import get_current_user
from app.database.models import User
from app.schemas.progress import ProgressOverviewResponse
from app.services import progress_service

router = APIRouter(prefix="/api/progress", tags=["Progress"])


@router.get("/overview", response_model=ProgressOverviewResponse)
async def get_progress_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive progress tracking data including skills, roadmaps, assessments, stats, and achievements."""
    return progress_service.get_progress_overview(db, current_user.id)
