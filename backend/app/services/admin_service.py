"""
OneStop AI - Admin Service
Business logic for admin panel operations: analytics, user management, assessments, courses.
"""

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from fastapi import HTTPException

from app.database import models
from app.schemas.admin import (
    PlatformAnalytics,
    AdminUserItem,
    AdminUserListResponse,
    AdminUserUpdate,
    AdminAssessmentItem,
    AdminAssessmentListResponse,
    AdminCourseItem,
    AdminCourseCreate,
)


# ========================
# Platform Analytics
# ========================

def get_platform_analytics(db: Session) -> PlatformAnalytics:
    """Aggregate platform-wide statistics for the admin dashboard."""
    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)

    total_users = db.query(func.count(models.User.id)).scalar() or 0
    active_users = db.query(func.count(models.User.id)).filter(
        models.User.is_active == True
    ).scalar() or 0

    total_assessments = db.query(func.count(models.AssessmentResult.id)).scalar() or 0

    total_roadmaps = db.query(func.count(models.Roadmap.id)).scalar() or 0

    total_milestones_completed = db.query(func.count(models.Milestone.id)).filter(
        models.Milestone.status == "completed"
    ).scalar() or 0

    total_resume_reviews = db.query(func.count(models.ResumeAnalysis.id)).scalar() or 0

    total_chat_messages = db.query(func.count(models.ChatMessage.id)).scalar() or 0

    total_courses = db.query(func.count(models.CourseRecommendation.id)).scalar() or 0

    total_achievements_earned = db.query(func.count(models.Achievement.id)).scalar() or 0

    new_users_last_7_days = db.query(func.count(models.User.id)).filter(
        models.User.created_at >= seven_days_ago
    ).scalar() or 0

    new_users_last_30_days = db.query(func.count(models.User.id)).filter(
        models.User.created_at >= thirty_days_ago
    ).scalar() or 0

    return PlatformAnalytics(
        total_users=total_users,
        active_users=active_users,
        total_assessments=total_assessments,
        total_roadmaps=total_roadmaps,
        total_milestones_completed=total_milestones_completed,
        total_resume_reviews=total_resume_reviews,
        total_chat_messages=total_chat_messages,
        total_courses=total_courses,
        total_achievements_earned=total_achievements_earned,
        new_users_last_7_days=new_users_last_7_days,
        new_users_last_30_days=new_users_last_30_days,
    )


# ========================
# User Management
# ========================

def list_users(
    db: Session,
    search: str | None = None,
    page: int = 1,
    per_page: int = 20,
) -> AdminUserListResponse:
    """Paginated user list with optional search and per-user activity counts."""
    query = db.query(models.User)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.User.email.ilike(search_filter)) |
            (models.User.full_name.ilike(search_filter))
        )

    total = query.count()
    users_db = query.order_by(desc(models.User.created_at)).offset(
        (page - 1) * per_page
    ).limit(per_page).all()

    user_items = []
    for u in users_db:
        assessment_count = db.query(func.count(models.AssessmentResult.id)).filter(
            models.AssessmentResult.user_id == u.id
        ).scalar() or 0
        roadmap_count = db.query(func.count(models.Roadmap.id)).filter(
            models.Roadmap.user_id == u.id
        ).scalar() or 0

        user_items.append(AdminUserItem(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            is_active=u.is_active,
            is_admin=u.is_admin,
            created_at=u.created_at,
            assessment_count=assessment_count,
            roadmap_count=roadmap_count,
        ))

    return AdminUserListResponse(
        users=user_items,
        total=total,
        page=page,
        per_page=per_page,
    )


def update_user(
    db: Session,
    target_user_id: str,
    update_data: AdminUserUpdate,
    admin_user_id: str,
) -> AdminUserItem:
    """Toggle is_active or is_admin flags on a user. Prevents self-demotion."""
    target = db.query(models.User).filter(models.User.id == target_user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent admin from deactivating or demoting themselves
    if target_user_id == admin_user_id:
        if update_data.is_active is False:
            raise HTTPException(status_code=400, detail="Cannot deactivate your own account")
        if update_data.is_admin is False:
            raise HTTPException(status_code=400, detail="Cannot remove your own admin privileges")

    if update_data.is_active is not None:
        target.is_active = update_data.is_active
    if update_data.is_admin is not None:
        target.is_admin = update_data.is_admin

    db.commit()
    db.refresh(target)

    assessment_count = db.query(func.count(models.AssessmentResult.id)).filter(
        models.AssessmentResult.user_id == target.id
    ).scalar() or 0
    roadmap_count = db.query(func.count(models.Roadmap.id)).filter(
        models.Roadmap.user_id == target.id
    ).scalar() or 0

    return AdminUserItem(
        id=target.id,
        email=target.email,
        full_name=target.full_name,
        is_active=target.is_active,
        is_admin=target.is_admin,
        created_at=target.created_at,
        assessment_count=assessment_count,
        roadmap_count=roadmap_count,
    )


def delete_user(db: Session, target_user_id: str, admin_user_id: str) -> None:
    """Hard-delete a user and all cascaded data. Prevents self-deletion."""
    if target_user_id == admin_user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    target = db.query(models.User).filter(models.User.id == target_user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(target)
    db.commit()


# ========================
# Assessment Management
# ========================

def list_assessments(
    db: Session,
    page: int = 1,
    per_page: int = 20,
) -> AdminAssessmentListResponse:
    """Paginated list of all assessment results with user info."""
    query = db.query(models.AssessmentResult)
    total = query.count()

    results = query.order_by(
        desc(models.AssessmentResult.created_at)
    ).offset((page - 1) * per_page).limit(per_page).all()

    items = []
    for r in results:
        user = db.query(models.User).filter(models.User.id == r.user_id).first()
        items.append(AdminAssessmentItem(
            id=r.id,
            user_email=user.email if user else "unknown",
            user_name=user.full_name if user else "Unknown",
            personality_type=r.personality_type,
            category_scores=r.category_scores or {},
            top_traits=r.top_traits or [],
            created_at=r.created_at,
        ))

    return AdminAssessmentListResponse(
        assessments=items,
        total=total,
        page=page,
        per_page=per_page,
    )


# ========================
# Course Management
# ========================

def list_all_courses(db: Session) -> list[AdminCourseItem]:
    """List all course recommendations across all users."""
    courses = db.query(models.CourseRecommendation).order_by(
        desc(models.CourseRecommendation.created_at)
    ).all()

    return [
        AdminCourseItem(
            id=c.id,
            title=c.title,
            platform=c.platform,
            difficulty=c.difficulty,
            duration=c.duration,
            url=c.url,
            type=c.type,
            user_id=c.user_id,
            created_at=c.created_at,
        )
        for c in courses
    ]


def create_global_course(db: Session, course_data: AdminCourseCreate, admin_user_id: str) -> AdminCourseItem:
    """Admin creates a platform-wide course recommendation (assigned to admin user)."""
    new_course = models.CourseRecommendation(
        user_id=admin_user_id,
        title=course_data.title,
        platform=course_data.platform,
        difficulty=course_data.difficulty,
        duration=course_data.duration,
        url=course_data.url,
        type=course_data.type,
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return AdminCourseItem(
        id=new_course.id,
        title=new_course.title,
        platform=new_course.platform,
        difficulty=new_course.difficulty,
        duration=new_course.duration,
        url=new_course.url,
        type=new_course.type,
        user_id=new_course.user_id,
        created_at=new_course.created_at,
    )


def delete_course(db: Session, course_id: str) -> None:
    """Delete a course recommendation by ID."""
    course = db.query(models.CourseRecommendation).filter(
        models.CourseRecommendation.id == course_id
    ).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    db.delete(course)
    db.commit()
