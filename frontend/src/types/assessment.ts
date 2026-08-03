export interface QuestionOption {
  label: string;
  sub_domain?: string;
  score_vector?: Record<string, number>;
}

export interface Question {
  id: string;
  category: 'personality' | 'skill' | 'interest';
  sub_domain?: string;
  question_text: string;
  options: QuestionOption[];
  order_index: number;
}

export interface AssessmentStartResponse {
  assessment_id: string;
  status: string;
  questions: Question[];
  message: string;
}

export interface SingleAnswerSubmission {
  question_id: string;
  selected_option_index: number;
}

export interface AssessmentSubmitRequest {
  assessment_id: string;
  answers: SingleAnswerSubmission[];
}

export interface CategoryScores {
  Analytical: number;
  Technical: number;
  Creative: number;
  Leadership: number;
  Collaborative: number;
  [key: string]: number;
}

export interface AssessmentResult {
  id: string;
  assessment_id: string;
  user_id: string;
  category_scores: CategoryScores;
  top_traits: string[];
  personality_type: string;
  recommended_domains: string[];
  summary: string;
  created_at: string;
}
