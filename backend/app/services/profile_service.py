"""
OneStop AI - Profile Service
Database operations for fetching and updating user profiles.
"""

import uuid
from sqlalchemy.orm import Session
from app.database.models import Profile, User
from app.schemas.profile import ProfileUpdate, ProfileResponse


def get_or_create_profile(db: Session, user: User) -> ProfileResponse:
    """Fetch existing profile or auto-create an empty profile if first access."""
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(
            id=str(uuid.uuid4()),
            user_id=user.id,
            skills=[],
            interests=[],
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return build_profile_response(user, profile)


def update_profile(db: Session, user: User, data: ProfileUpdate) -> ProfileResponse:
    """Update profile attributes."""
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(id=str(uuid.uuid4()), user_id=user.id)
        db.add(profile)

    # Update non-null fields or passed values
    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return build_profile_response(user, profile)


def update_avatar(db: Session, user: User, avatar_url: str) -> ProfileResponse:
    """Update avatar_url on user table."""
    user.avatar_url = avatar_url
    db.commit()
    db.refresh(user)

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(id=str(uuid.uuid4()), user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return build_profile_response(user, profile)


def build_profile_response(user: User, profile: Profile) -> ProfileResponse:
    """Helper to merge User metadata with Profile model into ProfileResponse."""
    return ProfileResponse(
        id=profile.id,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
        avatar_url=user.avatar_url,
        phone=profile.phone,
        bio=profile.bio,
        education_level=profile.education_level,
        institution=profile.institution,
        field_of_study=profile.field_of_study,
        graduation_year=profile.graduation_year,
        skills=profile.skills or [],
        interests=profile.interests or [],
        career_goals=profile.career_goals,
        target_role=profile.target_role,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )
