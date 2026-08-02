"""
OneStop AI - Resume Routes
Endpoints: upload resume, get analysis
Full implementation in Phase 9.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@router.post("/upload")
async def upload_resume():
    """Upload resume for AI analysis. (Phase 9)"""
    return {"message": "Resume upload endpoint — coming in Phase 9", "success": True}


@router.get("/analysis")
async def get_resume_analysis():
    """Get resume analysis results. (Phase 9)"""
    return {"message": "Resume analysis endpoint — coming in Phase 9", "success": True}
