"""
OneStop AI - Database Models
SQLAlchemy ORM models.
Only the User model is defined in Phase 2.
Additional models will be added as features are built.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Integer, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.connection import Base
import uuid


class User(Base):
    """User account model."""

    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    reset_token = Column(String, nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.email}>"


class Profile(Base):
    """User detailed career and educational profile model."""

    __tablename__ = "profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    phone = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    
    # Education
    education_level = Column(String, nullable=True)  # High School, Undergraduate, Postgraduate, etc.
    institution = Column(String, nullable=True)
    field_of_study = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    
    # Skills & Interests (JSON array format)
    skills = Column(JSON, default=list)
    interests = Column(JSON, default=list)
    
    # Career Goals
    career_goals = Column(Text, nullable=True)
    target_role = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="profile")

    def __repr__(self):
        return f"<Profile user_id={self.user_id}>"


# Future models (will be added in later phases):
# - Profile (Phase 4)
# - Assessment (Phase 5)
# - Question (Phase 5)
# - Answer (Phase 5)
# - Recommendation (Phase 6)
# - Roadmap (Phase 7)
# - Milestone (Phase 7)
# - Resume (Phase 9)
# - ChatHistory (Phase 10)
