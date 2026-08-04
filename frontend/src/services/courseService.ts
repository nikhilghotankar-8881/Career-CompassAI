import api from './api';
import type { CourseRecommendation } from '../types/course';

export const courseService = {
  getCourses: async (): Promise<CourseRecommendation[]> => {
    const response = await api.get('/api/courses');
    return response.data;
  },
  
  generateCourses: async (): Promise<CourseRecommendation[]> => {
    const response = await api.post('/api/courses/generate');
    return response.data;
  }
};
