// ========================
// OneStop AI - Core TypeScript Interfaces
// ========================

// ---------- User & Auth ----------

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

// ---------- Profile ----------

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  education_level?: string;
  institution?: string;
  field_of_study?: string;
  graduation_year?: number;
  skills: string[];
  interests: string[];
  career_goals?: string;
  target_role?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  phone?: string;
  bio?: string;
  education_level?: string;
  institution?: string;
  field_of_study?: string;
  graduation_year?: number;
  skills?: string[];
  interests?: string[];
  career_goals?: string;
  target_role?: string;
}

// ---------- Assessment ----------

export interface Assessment {
  id: string;
  user_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  score?: number;
  created_at: string;
  completed_at?: string;
}

export interface Question {
  id: string;
  text: string;
  category: 'personality' | 'aptitude' | 'interest' | 'skill';
  options: string[];
}

export interface Answer {
  question_id: string;
  selected_option: string;
}

// ---------- Recommendation ----------

export interface CareerRecommendation {
  id: string;
  career_title: string;
  match_percentage: number;
  description: string;
  required_skills: string[];
  skill_gaps: string[];
  learning_path: string[];
}

// ---------- Roadmap ----------

export interface Roadmap {
  id: string;
  title: string;
  career_path: string;
  milestones: Milestone[];
  progress: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  order: number;
}

// ---------- Resume ----------

export interface ResumeAnalysis {
  id: string;
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  analyzed_at: string;
}

// ---------- Chat ----------

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ---------- API Response ----------

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

export * from './assessment';

