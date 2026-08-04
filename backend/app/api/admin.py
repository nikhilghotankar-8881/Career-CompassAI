"""
OneStop AI - Admin Routes
Endpoints: analytics, user management, assessment monitoring, course management.
All routes require admin privileges.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_admin
from app.schemas.admin import (
    PlatformAnalytics,
    AdminUserListResponse,
    AdminUserUpdate,
    AdminUserItem,
    AdminAssessmentListResponse,
    AdminCourseItem,
    AdminCourseCreate,
)
from app.schemas.user import MessageResponse
from app.services import admin_service

router = APIRouter(prefix="/api/admin", tags=["Admin"])


# ========================
# Platform Analytics
# ========================

@router.get("/analytics", response_model=PlatformAnalytics)
async def get_analytics(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Get platform-wide analytics dashboard data."""
    return admin_service.get_platform_analytics(db)


# ========================
# User Management
# ========================

@router.get("/users", response_model=AdminUserListResponse)
async def list_users(
    search: Optional[str] = Query(None, description="Search by email or name"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Get paginated list of all users with activity counts."""
    return admin_service.list_users(db, search=search, page=page, per_page=per_page)


@router.put("/users/{user_id}", response_model=AdminUserItem)
async def update_user(
    user_id: str,
    update_data: AdminUserUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Toggle active/admin status for a user."""
    return admin_service.update_user(db, user_id, update_data, current_admin.id)


@router.delete("/users/{user_id}", response_model=MessageResponse)
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Permanently delete a user and all their data."""
    admin_service.delete_user(db, user_id, current_admin.id)
    return MessageResponse(message="User deleted successfully", success=True)


# ========================
# Assessment Management
# ========================

@router.get("/assessments", response_model=AdminAssessmentListResponse)
async def list_assessments(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Get paginated list of all assessment results across users."""
    return admin_service.list_assessments(db, page=page, per_page=per_page)


# ========================
# Course Management
# ========================

@router.get("/courses", response_model=List[AdminCourseItem])
async def list_courses(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Get all course recommendations across the platform."""
    return admin_service.list_all_courses(db)


@router.post("/courses", response_model=AdminCourseItem, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_data: AdminCourseCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Create a platform-wide course recommendation."""
    return admin_service.create_global_course(db, course_data, current_admin.id)


@router.delete("/courses/{course_id}", response_model=MessageResponse)
async def delete_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Delete a course recommendation."""
    admin_service.delete_course(db, course_id)
    return MessageResponse(message="Course deleted successfully", success=True)
