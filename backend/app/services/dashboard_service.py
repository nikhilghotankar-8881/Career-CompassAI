"""
OneStop AI - Dashboard Service
Aggregates data for the Unified Student Dashboard.
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import models
from app.schemas.dashboard import DashboardSummaryResponse

def get_dashboard_summary(db: Session, user_id: str) -> DashboardSummaryResponse:
    # 1. Assessment Result
    latest_result = db.query(models.AssessmentResult).filter(
        models.AssessmentResult.user_id == user_id
    ).order_by(desc(models.AssessmentResult.created_at)).first()
    
    assessment_completed = latest_result is not None
    top_trait = None
    if latest_result and latest_result.top_traits:
        top_trait = latest_result.top_traits[0]

    # 2. Roadmap
    active_roadmap = db.query(models.Roadmap).filter(
        models.Roadmap.user_id == user_id,
        models.Roadmap.is_active == True
    ).first()
    
    roadmap_active = active_roadmap is not None
    target_role = active_roadmap.target_role if active_roadmap else None
    roadmap_progress = active_roadmap.progress_percentage if active_roadmap else 0
    
    milestones_completed = 0
    if active_roadmap:
        milestones_completed = sum(1 for m in active_roadmap.milestones if m.status == 'completed')

    # 3. Recommendation Match
    recommendation_match = None
    if active_roadmap and active_roadmap.recommendation_id:
        rec = db.query(models.CareerRecommendation).filter(
            models.CareerRecommendation.id == active_roadmap.recommendation_id
        ).first()
        if rec:
            recommendation_match = rec.match_percentage

    return DashboardSummaryResponse(
        assessment_completed=assessment_completed,
        top_trait=top_trait,
        roadmap_active=roadmap_active,
        target_role=target_role,
        roadmap_progress=roadmap_progress,
        milestones_completed=milestones_completed,
        recommendation_match=recommendation_match
    )
