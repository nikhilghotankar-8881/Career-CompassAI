export interface DashboardSummary {
  assessment_completed: boolean;
  top_trait?: string | null;
  roadmap_active: boolean;
  target_role?: string | null;
  roadmap_progress: number;
  milestones_completed: number;
  recommendation_match?: number | null;
}
