"""
OneStop AI - Database Connection
SQLAlchemy engine, session factory, and dependency.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import get_settings

settings = get_settings()

# ========================
# Database Engine
# ========================

# SQLite needs connect_args for thread safety
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=settings.DEBUG,  # Log SQL queries in debug mode
)

# ========================
# Session Factory
# ========================

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ========================
# Base Model
# ========================

class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


# ========================
# Dependency
# ========================

def get_db():
    """Database session dependency for FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
