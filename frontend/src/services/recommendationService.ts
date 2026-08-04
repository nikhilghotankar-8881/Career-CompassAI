import api from './api';
import type { CareerRecommendation, RecommendationListResponse } from '../types/recommendation';

export const recommendationService = {
  generateRecommendations: async (): Promise<RecommendationListResponse> => {
    const response = await api.post('/api/recommendations/generate');
    return response.data;
  },
  
  getRecommendations: async (): Promise<RecommendationListResponse> => {
    const response = await api.get('/api/recommendations/');
    return response.data;
  },
  
  getRecommendationById: async (id: string): Promise<CareerRecommendation> => {
    const response = await api.get(`/api/recommendations/${id}`);
    return response.data;
  }
};
