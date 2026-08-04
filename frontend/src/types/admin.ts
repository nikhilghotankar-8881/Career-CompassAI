// ========================
// OneStop AI - Admin Panel Types
// ========================

export interface PlatformAnalytics {
  total_users: number;
  active_users: number;
  total_assessments: number;
  total_roadmaps: number;
  total_milestones_completed: number;
  total_resume_reviews: number;
  total_chat_messages: number;
  total_courses: number;
  total_achievements_earned: number;
  new_users_last_7_days: number;
  new_users_last_30_days: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  assessment_count: number;
  roadmap_count: number;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  per_page: number;
}

export interface AdminUserUpdate {
  is_active?: boolean;
  is_admin?: boolean;
}

export interface AdminAssessmentItem {
  id: string;
  user_email: string;
  user_name: string;
  personality_type: string | null;
  category_scores: Record<string, number>;
  top_traits: string[];
  created_at: string;
}

export interface AdminAssessmentListResponse {
  assessments: AdminAssessmentItem[];
  total: number;
  page: number;
  per_page: number;
}

export interface AdminCourseItem {
  id: string;
  title: string;
  platform: string;
  difficulty: string;
  duration: string;
  url: string | null;
  type: string;
  user_id: string;
  created_at: string;
}

export interface AdminCourseCreate {
  title: string;
  platform: string;
  difficulty: string;
  duration: string;
  url?: string;
  type: string;
}
