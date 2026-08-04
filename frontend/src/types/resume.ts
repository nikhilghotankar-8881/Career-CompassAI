export interface ResumeAnalysis {
  id: string;
  user_id: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  created_at: string;
}
