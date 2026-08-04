export interface CourseRecommendation {
  id: string;
  user_id: string;
  title: string;
  platform: string;
  difficulty: string;
  duration: string;
  url: string | null;
  type: string;
  created_at: string;
}
