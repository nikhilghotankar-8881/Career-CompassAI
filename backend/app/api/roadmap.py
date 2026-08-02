"""
OneStop AI - Roadmap Routes
Endpoints: get roadmap, update progress
Full implementation in Phase 7.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api/roadmap", tags=["Roadmap"])


@router.get("/")
async def get_roadmap():
    """Get personalized learning roadmap. (Phase 7)"""
    return {"message": "Roadmap endpoint — coming in Phase 7", "success": True}


@router.put("/progress")
async def update_progress():
    """Update roadmap progress. (Phase 7)"""
    return {"message": "Update progress endpoint — coming in Phase 7", "success": True}
