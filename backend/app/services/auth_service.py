"""
OneStop AI - Auth Service
Business logic for user registration, authentication, and password management.
"""

import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.database.models import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import hash_password, verify_password, create_access_token


def get_user_by_email(db: Session, email: str) -> User | None:
    """Fetch user by email address."""
    return db.query(User).filter(User.email == email.lower()).first()


def get_user_by_id(db: Session, user_id: str) -> User | None:
    """Fetch user by primary key ID."""
    return db.query(User).filter(User.id == user_id).first()


def register_user(db: Session, user_data: UserCreate) -> User:
    """Register a new user account."""
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    new_user = User(
        id=str(uuid.uuid4()),
        email=user_data.email.lower(),
        full_name=user_data.full_name,
        hashed_password=hash_password(user_data.password),
        is_active=True,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def authenticate_user(db: Session, login_data: UserLogin) -> tuple[User, str]:
    """Authenticate user credentials and return user model along with JWT token."""
    user = get_user_by_email(db, login_data.email)
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled.",
        )

    access_token = create_access_token(data={"sub": user.id, "email": user.email})
    return user, access_token


def request_password_reset(db: Session, email: str) -> str:
    """Generate a password reset token for user."""
    user = get_user_by_email(db, email)
    if not user:
        # Avoid user enumeration by returning a generic response message in endpoint
        return ""

    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(hours=1)
    db.commit()
    return reset_token


def reset_password(db: Session, token: str, new_password: str) -> bool:
    """Reset user password using token."""
    user = db.query(User).filter(User.reset_token == token).first()
    if not user or not user.reset_token_expiry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    if user.reset_token_expiry.tzinfo is None:
        expiry = user.reset_token_expiry.replace(tzinfo=timezone.utc)
    else:
        expiry = user.reset_token_expiry

    if datetime.now(timezone.utc) > expiry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired.",
        )

    user.hashed_password = hash_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()
    return True
