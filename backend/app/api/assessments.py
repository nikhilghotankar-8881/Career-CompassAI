"""
OneStop AI - Assessment Routes
Endpoints: start assessment, submit answers, get results, get questions.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_user
from app.schemas.assessment import (
    QuestionResponseSchema,
    AssessmentStartResponse,
    AssessmentSubmitRequest,
    AssessmentResultResponse,
)
from app.services.assessment_service import (
    get_all_questions,
    get_or_create_active_assessment,
    process_assessment_submission,
    get_user_latest_result,
)

router = APIRouter(prefix="/api/assessments", tags=["Assessments"])


@router.get("/questions", response_model=list[QuestionResponseSchema])
async def list_questions(db: Session = Depends(get_db)):
    """Fetch all standardized assessment questions."""
    return get_all_questions(db)


@router.post("/start", response_model=AssessmentStartResponse)
async def start_assessment(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Start or resume an assessment session for the logged-in user."""
    assessment, questions = get_or_create_active_assessment(db, current_user)
    return AssessmentStartResponse(
        assessment_id=assessment.id,
        status=assessment.status,
        questions=[QuestionResponseSchema.model_validate(q) for q in questions],
        message="Assessment session started successfully.",
    )


@router.post("/submit", response_model=AssessmentResultResponse)
async def submit_assessment(
    req: AssessmentSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit responses to assessment questions and compute score analysis."""
    result = process_assessment_submission(db, current_user, req)
    return AssessmentResultResponse.model_validate(result)


@router.get("/results", response_model=AssessmentResultResponse)
async def get_assessment_results(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch the latest completed assessment result for logged-in user."""
    result = get_user_latest_result(db, current_user)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No completed assessment result found for this user."
        )
    return AssessmentResultResponse.model_validate(result)
