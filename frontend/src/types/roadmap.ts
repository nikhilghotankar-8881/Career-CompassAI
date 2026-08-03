export interface Milestone {
  id: string;
  roadmap_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  order_index: number;
  created_at: string;
}

export interface Roadmap {
  id: string;
  user_id: string;
  recommendation_id?: string | null;
  target_role: string;
  progress_percentage: number;
  is_active: boolean;
  created_at: string;
  milestones: Milestone[];
}

export interface MilestoneUpdate {
  status: 'pending' | 'in_progress' | 'completed';
}
