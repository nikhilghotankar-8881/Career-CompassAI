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

    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
    assessment_results = relationship("AssessmentResult", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("CareerRecommendation", back_populates="user", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="user", cascade="all, delete-orphan")
    resume_analyses = relationship("ResumeAnalysis", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    course_recommendations = relationship("CourseRecommendation", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("Achievement", back_populates="user", cascade="all, delete-orphan")

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


class Question(Base):
    """Standardized assessment question model."""

    __tablename__ = "questions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    category = Column(String, nullable=False, index=True)  # personality, skill, interest
    sub_domain = Column(String, nullable=True)  # Analytical, Technical, Creative, Leadership, Collaborative
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # list of dicts: [{"label": "...", "score_vector": {...}}]
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<Question id={self.id} category={self.category}>"


class Assessment(Base):
    """User career assessment session model."""

    __tablename__ = "assessments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="in_progress")  # in_progress, completed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="assessments")
    answers = relationship("AssessmentAnswer", back_populates="assessment", cascade="all, delete-orphan")
    results = relationship("AssessmentResult", back_populates="assessment", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Assessment id={self.id} status={self.status}>"


class AssessmentAnswer(Base):
    """User response to a specific assessment question."""

    __tablename__ = "assessment_answers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(String, ForeignKey("assessments.id"), nullable=False)
    question_id = Column(String, ForeignKey("questions.id"), nullable=False)
    selected_option_index = Column(Integer, nullable=False)
    score_vector = Column(JSON, default=dict)  # domain scores snapshot

    assessment = relationship("Assessment", back_populates="answers")
    question = relationship("Question")


class AssessmentResult(Base):
    """Generated analysis and score breakdown for a completed assessment."""

    __tablename__ = "assessment_results"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(String, ForeignKey("assessments.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    category_scores = Column(JSON, nullable=False)  # {"Analytical": 85, "Technical": 90, ...}
    top_traits = Column(JSON, default=list)  # ["Problem Solver", "Data Driven", ...]
    personality_type = Column(String, nullable=True)  # e.g., "Analytical Thinker", "Creative Strategist"
    recommended_domains = Column(JSON, default=list)  # ["Software Engineering", "Data Science"]
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="assessment_results")
    assessment = relationship("Assessment", back_populates="results")


class CareerRecommendation(Base):
    """Generated AI career recommendation entry for a user."""

    __tablename__ = "career_recommendations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    assessment_result_id = Column(String, ForeignKey("assessment_results.id"), nullable=True)
    career_title = Column(String, nullable=False)
    match_percentage = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, default=list)
    skill_gaps = Column(JSON, default=list)
    learning_path = Column(JSON, default=list)
    salary_range = Column(String, nullable=True)
    job_outlook = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="recommendations")
    assessment_result = relationship("AssessmentResult")

    def __repr__(self):
        return f"<CareerRecommendation id={self.id} title={self.career_title} match={self.match_percentage}%>"


class Roadmap(Base):
    """Personalized learning roadmap for a user based on a career recommendation."""

    __tablename__ = "roadmaps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    recommendation_id = Column(String, ForeignKey("career_recommendations.id"), nullable=True)
    target_role = Column(String, nullable=False)
    progress_percentage = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="roadmaps")
    recommendation = relationship("CareerRecommendation")
    milestones = relationship("Milestone", back_populates="roadmap", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Roadmap id={self.id} target={self.target_role}>"


class Milestone(Base):
    """Individual learning steps or skills within a roadmap."""

    __tablename__ = "milestones"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    roadmap_id = Column(String, ForeignKey("roadmaps.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, in_progress, completed
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    roadmap = relationship("Roadmap", back_populates="milestones")

    def __repr__(self):
        return f"<Milestone id={self.id} status={self.status}>"


class ResumeAnalysis(Base):
    """AI feedback and scoring for a user's uploaded resume."""

    __tablename__ = "resume_analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="resume_analyses")

    def __repr__(self):
        return f"<ResumeAnalysis id={self.id} score={self.score}>"


class ChatMessage(Base):
    """Conversation history for the AI Career Chatbot."""

    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False) # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="chat_messages")

    def __repr__(self):
        return f"<ChatMessage role={self.role} length={len(self.content)}>"


class CourseRecommendation(Base):
    """AI suggested courses and certifications based on skill gaps."""

    __tablename__ = "course_recommendations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    platform = Column(String, nullable=False) # Coursera, Udemy, edX, etc.
    difficulty = Column(String, default="Intermediate") # Beginner, Intermediate, Advanced
    duration = Column(String, default="4 weeks")
    url = Column(String, nullable=True) # Search URL or direct link
    type = Column(String, default="Course") # Course or Certification
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="course_recommendations")

    def __repr__(self):
        return f"<CourseRecommendation title={self.title} platform={self.platform}>"


class Achievement(Base):
    """Gamified achievement badge earned by a user based on progress milestones."""

    __tablename__ = "achievements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    badge_key = Column(String, nullable=False)  # Unique key per badge type
    badge_name = Column(String, nullable=False)
    badge_description = Column(Text, nullable=False)
    badge_icon = Column(String, nullable=False)  # Lucide icon name
    earned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="achievements")

    def __repr__(self):
        return f"<Achievement badge={self.badge_key} user_id={self.user_id}>"

