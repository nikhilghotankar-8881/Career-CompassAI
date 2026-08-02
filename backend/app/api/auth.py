"""
OneStop AI - Auth Routes
Endpoints: register, login, logout
Full implementation in Phase 3.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register")
async def register():
    """Register a new user. (Phase 3)"""
    return {"message": "Registration endpoint — coming in Phase 3", "success": True}


@router.post("/login")
async def login():
    """Authenticate user and return JWT token. (Phase 3)"""
    return {"message": "Login endpoint — coming in Phase 3", "success": True}


@router.post("/logout")
async def logout():
    """Logout user. (Phase 3)"""
    return {"message": "Logout endpoint — coming in Phase 3", "success": True}
