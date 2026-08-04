import api from './api';
import type { ResumeAnalysis } from '../types/resume';

export const resumeService = {
  uploadResume: async (file: File): Promise<ResumeAnalysis> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getAnalysis: async (): Promise<ResumeAnalysis> => {
    const response = await api.get('/api/resume/analysis');
    return response.data;
  }
};
