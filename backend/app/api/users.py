"""
OneStop AI - User Routes
Endpoints: get profile, update profile
Full implementation in Phase 4.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me")
async def get_current_user_profile():
    """Get current user's profile. (Phase 4)"""
    return {"message": "User profile endpoint — coming in Phase 4", "success": True}


@router.put("/me")
async def update_user_profile():
    """Update current user's profile. (Phase 4)"""
    return {"message": "Update profile endpoint — coming in Phase 4", "success": True}
