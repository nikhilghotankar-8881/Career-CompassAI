// ========================
// OneStop AI - Progress Tracking Types
// ========================

export interface SkillProgress {
  domain: string;
  score: number;
  max_score: number;
}

export interface RoadmapHistoryItem {
  id: string;
  target_role: string;
  progress_percentage: number;
  milestones_total: number;
  milestones_completed: number;
  is_active: boolean;
  created_at: string;
}

export interface AssessmentHistoryItem {
  id: string;
  personality_type: string | null;
  category_scores: Record<string, number>;
  created_at: string;
}

export interface LearningStats {
  assessments_taken: number;
  roadmaps_created: number;
  milestones_completed: number;
  milestones_total: number;
  courses_recommended: number;
  resume_reviews: number;
  chat_messages_sent: number;
}

export interface Achievement {
  badge_key: string;
  badge_name: string;
  badge_description: string;
  badge_icon: string;
  earned_at: string;
}

export interface ProgressOverview {
  skill_progress: SkillProgress[];
  roadmap_history: RoadmapHistoryItem[];
  assessment_history: AssessmentHistoryItem[];
  learning_stats: LearningStats;
  achievements: Achievement[];
}
