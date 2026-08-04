"""
OneStop AI - Progress Tracking Service
Aggregates user progress across all platform features and awards achievement badges.
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.database import models
from app.schemas.progress import (
    SkillProgress,
    RoadmapHistoryItem,
    AssessmentHistoryItem,
    LearningStats,
    AchievementResponse,
    ProgressOverviewResponse,
)


# ========================
# Badge Definitions
# ========================

BADGE_DEFINITIONS = [
    {
        "key": "first_assessment",
        "name": "First Steps",
        "description": "Completed your first career assessment",
        "icon": "ClipboardCheck",
        "check": lambda stats: stats["assessments_taken"] >= 1,
    },
    {
        "key": "roadmap_started",
        "name": "Pathfinder",
        "description": "Created your first learning roadmap",
        "icon": "Map",
        "check": lambda stats: stats["roadmaps_created"] >= 1,
    },
    {
        "key": "milestone_5",
        "name": "Momentum Builder",
        "description": "Completed 5 learning milestones",
        "icon": "Flame",
        "check": lambda stats: stats["milestones_completed"] >= 5,
    },
    {
        "key": "milestone_15",
        "name": "Unstoppable",
        "description": "Completed 15 learning milestones",
        "icon": "Zap",
        "check": lambda stats: stats["milestones_completed"] >= 15,
    },
    {
        "key": "resume_reviewed",
        "name": "Resume Pro",
        "description": "Got your first AI resume review",
        "icon": "FileText",
        "check": lambda stats: stats["resume_reviews"] >= 1,
    },
    {
        "key": "chat_explorer",
        "name": "Curious Mind",
        "description": "Sent 10+ messages to the AI career advisor",
        "icon": "MessageCircle",
        "check": lambda stats: stats["chat_messages_sent"] >= 10,
    },
    {
        "key": "course_learner",
        "name": "Knowledge Seeker",
        "description": "Received 5+ course recommendations",
        "icon": "BookOpen",
        "check": lambda stats: stats["courses_recommended"] >= 5,
    },
    {
        "key": "roadmap_master",
        "name": "Roadmap Master",
        "description": "Completed a roadmap to 100%",
        "icon": "Trophy",
        "check": lambda stats: stats["roadmap_completed"] >= 1,
    },
    {
        "key": "skill_analyst",
        "name": "Self-Aware",
        "description": "Taken 3+ career assessments",
        "icon": "Brain",
        "check": lambda stats: stats["assessments_taken"] >= 3,
    },
]


# ========================
# Stats Gathering
# ========================

def _gather_raw_stats(db: Session, user_id: str) -> dict:
    """Gather raw numeric counts for badge evaluation and learning stats."""
    assessments_taken = db.query(func.count(models.AssessmentResult.id)).filter(
        models.AssessmentResult.user_id == user_id
    ).scalar() or 0

    roadmaps_created = db.query(func.count(models.Roadmap.id)).filter(
        models.Roadmap.user_id == user_id
    ).scalar() or 0

    milestones_total = db.query(func.count(models.Milestone.id)).join(
        models.Roadmap
    ).filter(
        models.Roadmap.user_id == user_id
    ).scalar() or 0

    milestones_completed = db.query(func.count(models.Milestone.id)).join(
        models.Roadmap
    ).filter(
        models.Roadmap.user_id == user_id,
        models.Milestone.status == "completed"
    ).scalar() or 0

    courses_recommended = db.query(func.count(models.CourseRecommendation.id)).filter(
        models.CourseRecommendation.user_id == user_id
    ).scalar() or 0

    resume_reviews = db.query(func.count(models.ResumeAnalysis.id)).filter(
        models.ResumeAnalysis.user_id == user_id
    ).scalar() or 0

    chat_messages_sent = db.query(func.count(models.ChatMessage.id)).filter(
        models.ChatMessage.user_id == user_id,
        models.ChatMessage.role == "user"
    ).scalar() or 0

    roadmap_completed = db.query(func.count(models.Roadmap.id)).filter(
        models.Roadmap.user_id == user_id,
        models.Roadmap.progress_percentage >= 100
    ).scalar() or 0

    return {
        "assessments_taken": assessments_taken,
        "roadmaps_created": roadmaps_created,
        "milestones_total": milestones_total,
        "milestones_completed": milestones_completed,
        "courses_recommended": courses_recommended,
        "resume_reviews": resume_reviews,
        "chat_messages_sent": chat_messages_sent,
        "roadmap_completed": roadmap_completed,
    }


# ========================
# Achievement Logic
# ========================

def check_and_award_achievements(db: Session, user_id: str) -> list[models.Achievement]:
    """Evaluate badge criteria and award new achievements if thresholds are met."""
    stats = _gather_raw_stats(db, user_id)

    # Get already earned badge keys
    existing_keys = set(
        row[0] for row in db.query(models.Achievement.badge_key).filter(
            models.Achievement.user_id == user_id
        ).all()
    )

    newly_awarded = []
    for badge_def in BADGE_DEFINITIONS:
        if badge_def["key"] in existing_keys:
            continue
        if badge_def["check"](stats):
            achievement = models.Achievement(
                user_id=user_id,
                badge_key=badge_def["key"],
                badge_name=badge_def["name"],
                badge_description=badge_def["description"],
                badge_icon=badge_def["icon"],
            )
            db.add(achievement)
            newly_awarded.append(achievement)

    if newly_awarded:
        db.commit()
        for a in newly_awarded:
            db.refresh(a)

    return newly_awarded


# ========================
# Progress Overview
# ========================

def get_progress_overview(db: Session, user_id: str) -> ProgressOverviewResponse:
    """Build the full progress overview for a user, also awarding any new badges."""

    # 1. Auto-award badges first
    check_and_award_achievements(db, user_id)

    # 2. Skill Progress — from latest assessment result
    skill_progress: list[SkillProgress] = []
    latest_result = db.query(models.AssessmentResult).filter(
        models.AssessmentResult.user_id == user_id
    ).order_by(desc(models.AssessmentResult.created_at)).first()

    if latest_result and latest_result.category_scores:
        for domain, score in latest_result.category_scores.items():
            skill_progress.append(SkillProgress(
                domain=domain,
                score=int(score),
                max_score=100,
            ))

    # 3. Roadmap History
    roadmap_history: list[RoadmapHistoryItem] = []
    roadmaps = db.query(models.Roadmap).filter(
        models.Roadmap.user_id == user_id
    ).order_by(desc(models.Roadmap.created_at)).all()

    for rm in roadmaps:
        total = len(rm.milestones)
        completed = sum(1 for m in rm.milestones if m.status == "completed")
        roadmap_history.append(RoadmapHistoryItem(
            id=rm.id,
            target_role=rm.target_role,
            progress_percentage=rm.progress_percentage,
            milestones_total=total,
            milestones_completed=completed,
            is_active=rm.is_active,
            created_at=rm.created_at,
        ))

    # 4. Assessment History
    assessment_history: list[AssessmentHistoryItem] = []
    all_results = db.query(models.AssessmentResult).filter(
        models.AssessmentResult.user_id == user_id
    ).order_by(models.AssessmentResult.created_at).all()

    for result in all_results:
        assessment_history.append(AssessmentHistoryItem(
            id=result.id,
            personality_type=result.personality_type,
            category_scores=result.category_scores or {},
            created_at=result.created_at,
        ))

    # 5. Learning Stats
    raw = _gather_raw_stats(db, user_id)
    learning_stats = LearningStats(
        assessments_taken=raw["assessments_taken"],
        roadmaps_created=raw["roadmaps_created"],
        milestones_completed=raw["milestones_completed"],
        milestones_total=raw["milestones_total"],
        courses_recommended=raw["courses_recommended"],
        resume_reviews=raw["resume_reviews"],
        chat_messages_sent=raw["chat_messages_sent"],
    )

    # 6. All Achievements
    achievements_db = db.query(models.Achievement).filter(
        models.Achievement.user_id == user_id
    ).order_by(models.Achievement.earned_at).all()

    achievements = [
        AchievementResponse(
            badge_key=a.badge_key,
            badge_name=a.badge_name,
            badge_description=a.badge_description,
            badge_icon=a.badge_icon,
            earned_at=a.earned_at,
        )
        for a in achievements_db
    ]

    return ProgressOverviewResponse(
        skill_progress=skill_progress,
        roadmap_history=roadmap_history,
        assessment_history=assessment_history,
        learning_stats=learning_stats,
        achievements=achievements,
    )
