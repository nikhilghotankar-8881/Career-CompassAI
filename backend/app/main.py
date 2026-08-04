"""
OneStop AI - FastAPI Application
Main entry point for the backend server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.database.connection import engine, Base

# Import all API routers
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.assessments import router as assessments_router
from app.api.recommendations import router as recommendations_router
from app.api.roadmap import router as roadmap_router
from app.api.resume import router as resume_router
from app.api.chat import router as chatbot_router
from app.api.dashboard import router as dashboard_router
from app.api.courses import router as courses_router
from app.api.progress import router as progress_router
from app.api.admin import router as admin_router

settings = get_settings()

# ========================
# Create FastAPI App
# ========================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered personalized career & education advisor",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ========================
# CORS Middleware
# ========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================
# Create Database Tables
# ========================

Base.metadata.create_all(bind=engine)

# ========================
# Register API Routers
# ========================

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(assessments_router)
app.include_router(recommendations_router)
app.include_router(roadmap_router)
app.include_router(resume_router)
app.include_router(chatbot_router)
app.include_router(dashboard_router)
app.include_router(courses_router)
app.include_router(progress_router)
app.include_router(admin_router)

# ========================
# Root / Health Check
# ========================

@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/api/health", tags=["Health"])
async def api_health():
    """API health check."""
    return {"status": "healthy", "message": "OneStop AI API is running"}
