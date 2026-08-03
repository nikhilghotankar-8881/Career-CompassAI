import api from '@/services/api';
import type {
  Question,
  AssessmentStartResponse,
  AssessmentSubmitRequest,
  AssessmentResult,
} from '@/types/assessment';

/**
 * Fetch all assessment questions.
 */
export async function getQuestions(): Promise<Question[]> {
  const res = await api.get<Question[]>('/api/assessments/questions');
  return res.data;
}

/**
 * Start or resume an assessment session.
 */
export async function startAssessment(): Promise<AssessmentStartResponse> {
  const res = await api.post<AssessmentStartResponse>('/api/assessments/start');
  return res.data;
}

/**
 * Submit completed assessment responses.
 */
export async function submitAssessment(payload: AssessmentSubmitRequest): Promise<AssessmentResult> {
  const res = await api.post<AssessmentResult>('/api/assessments/submit', payload);
  return res.data;
}

/**
 * Fetch latest completed assessment results.
 */
export async function getAssessmentResults(): Promise<AssessmentResult> {
  const res = await api.get<AssessmentResult>('/api/assessments/results');
  return res.data;
}
