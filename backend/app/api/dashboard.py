"""
OneStop AI - Dashboard Routes
Endpoints: get dashboard summary
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.auth import get_current_user
from app.database.models import User
from app.schemas.dashboard import DashboardSummaryResponse
from app.services import dashboard_service

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get aggregated data for the Unified Student Dashboard."""
    return dashboard_service.get_dashboard_summary(db, current_user.id)
