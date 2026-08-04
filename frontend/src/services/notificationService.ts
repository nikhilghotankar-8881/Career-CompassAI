import api from './api';
import type { NotificationListResponse, Notification } from '../types/notification';

export const notificationService = {
  getNotifications: async (): Promise<NotificationListResponse> => {
    const res = await api.get('/api/notifications');
    return res.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const res = await api.put(`/api/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/api/notifications/read-all');
  },
};
