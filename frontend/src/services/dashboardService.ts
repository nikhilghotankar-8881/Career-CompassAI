import api from './api';
import type { DashboardSummary } from '../types/dashboard';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get('/api/dashboard/summary');
    return response.data;
  }
};
