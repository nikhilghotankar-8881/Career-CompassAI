"""
OneStop AI - User & Profile Routes
Endpoints: GET /api/users/profile, PUT /api/users/profile, POST /api/users/profile/avatar
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_user
from app.schemas.profile import ProfileUpdate, ProfileResponse, AvatarUpdate
from app.services.profile_service import (
    get_or_create_profile,
    update_profile as update_profile_service,
    update_avatar as update_avatar_service,
)

router = APIRouter(prefix="/api/users", tags=["Users & Profile"])


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch profile of currently logged-in user."""
    return get_or_create_profile(db, current_user)


@router.put("/profile", response_model=ProfileResponse)
async def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile information of currently logged-in user."""
    return update_profile_service(db, current_user, profile_in)


@router.post("/profile/avatar", response_model=ProfileResponse)
async def update_avatar(
    avatar_in: AvatarUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user avatar URL."""
    return update_avatar_service(db, current_user, avatar_in.avatar_url)
