import api from './api';
import type {
  PlatformAnalytics,
  AdminUserListResponse,
  AdminUserUpdate,
  AdminUser,
  AdminAssessmentListResponse,
  AdminCourseItem,
  AdminCourseCreate,
} from '../types/admin';

export const adminService = {
  // Analytics
  getAnalytics: async (): Promise<PlatformAnalytics> => {
    const res = await api.get('/api/admin/analytics');
    return res.data;
  },

  // Users
  getUsers: async (search?: string, page = 1, perPage = 20): Promise<AdminUserListResponse> => {
    const params: Record<string, string | number> = { page, per_page: perPage };
    if (search) params.search = search;
    const res = await api.get('/api/admin/users', { params });
    return res.data;
  },

  updateUser: async (userId: string, data: AdminUserUpdate): Promise<AdminUser> => {
    const res = await api.put(`/api/admin/users/${userId}`, data);
    return res.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/api/admin/users/${userId}`);
  },

  // Assessments
  getAssessments: async (page = 1, perPage = 20): Promise<AdminAssessmentListResponse> => {
    const res = await api.get('/api/admin/assessments', { params: { page, per_page: perPage } });
    return res.data;
  },

  // Courses
  getCourses: async (): Promise<AdminCourseItem[]> => {
    const res = await api.get('/api/admin/courses');
    return res.data;
  },

  createCourse: async (data: AdminCourseCreate): Promise<AdminCourseItem> => {
    const res = await api.post('/api/admin/courses', data);
    return res.data;
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    await api.delete(`/api/admin/courses/${courseId}`);
  },
};
