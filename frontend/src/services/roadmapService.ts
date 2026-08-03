import api from './api';
import { Roadmap, MilestoneUpdate } from '../types/roadmap';

export const roadmapService = {
  getActiveRoadmap: async (): Promise<Roadmap> => {
    const response = await api.get('/api/roadmap/');
    return response.data;
  },
  
  generateRoadmap: async (recommendationId: string): Promise<Roadmap> => {
    const response = await api.post(`/api/roadmap/generate/${recommendationId}`);
    return response.data;
  },
  
  updateMilestoneStatus: async (milestoneId: string, payload: MilestoneUpdate): Promise<Roadmap> => {
    const response = await api.put(`/api/roadmap/milestones/${milestoneId}`, payload);
    return response.data;
  }
};
