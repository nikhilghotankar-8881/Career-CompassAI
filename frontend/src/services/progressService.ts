import api from './api';
import type { ProgressOverview } from '../types/progress';

export const progressService = {
  getOverview: async (): Promise<ProgressOverview> => {
    const response = await api.get('/api/progress/overview');
    return response.data;
  },
};
