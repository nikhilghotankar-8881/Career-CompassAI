"""
OneStop AI - Auth Routes
Endpoints: register, login, me, forgot-password, reset-password
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_user
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MessageResponse,
)
from app.services.auth_service import (
    register_user,
    authenticate_user,
    request_password_reset,
    reset_password,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account and return JWT token."""
    user = register_user(db, user_in)
    _, access_token = authenticate_user(db, UserLogin(email=user_in.email, password=user_in.password))
    return TokenResponse(access_token=access_token, token_type="bearer", user=UserResponse.model_validate(user))


@router.post("/login", response_model=TokenResponse)
async def login(login_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    user, access_token = authenticate_user(db, login_in)
    return TokenResponse(access_token=access_token, token_type="bearer", user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Fetch profile of currently authenticated user."""
    return UserResponse.model_validate(current_user)


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request a password reset link/token."""
    reset_token = request_password_reset(db, req.email)
    # In production, send reset_token via email service.
    # Returning generic message to prevent user enumeration.
    return MessageResponse(
        message="If your email is registered, you will receive a password reset link.",
        success=True,
    )


@router.post("/reset-password", response_model=MessageResponse)
async def reset_pass(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using valid token."""
    reset_password(db, req.token, req.new_password)
    return MessageResponse(message="Password reset successfully. You can now log in.", success=True)
