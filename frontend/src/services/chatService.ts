import api from './api';
import type { ChatMessage, ChatMessageRequest } from '../types/chat';

export const chatService = {
  getHistory: async (): Promise<ChatMessage[]> => {
    const response = await api.get('/api/chat/history');
    return response.data;
  },
  
  sendMessage: async (payload: ChatMessageRequest): Promise<ChatMessage> => {
    const response = await api.post('/api/chat/message', payload);
    return response.data;
  }
};
