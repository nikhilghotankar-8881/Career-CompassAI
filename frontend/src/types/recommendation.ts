export interface CareerRecommendation {
  id: string;
  user_id: string;
  assessment_result_id?: string | null;
  career_title: string;
  match_percentage: number;
  description: string;
  required_skills: string[];
  skill_gaps: string[];
  learning_path: string[];
  salary_range?: string | null;
  job_outlook?: string | null;
  created_at: string;
}

export interface RecommendationListResponse {
  recommendations: CareerRecommendation[];
  personality_type?: string | null;
  user_skills: string[];
  message: string;
}
