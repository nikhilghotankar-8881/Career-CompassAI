"""
OneStop AI - Recommendation Routes
Endpoints: get career recommendations
Full implementation in Phase 6.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.get("/")
async def get_recommendations():
    """Get AI-powered career recommendations. (Phase 6)"""
    return {"message": "Recommendations endpoint — coming in Phase 6", "success": True}
