import api from '@/services/api';
import type { Profile, ProfileUpdate } from '@/types';

/**
 * Fetch current user profile.
 */
export async function getProfile(): Promise<Profile> {
  const res = await api.get<Profile>('/api/users/profile');
  return res.data;
}

/**
 * Update user profile details.
 */
export async function updateProfile(data: ProfileUpdate): Promise<Profile> {
  const res = await api.put<Profile>('/api/users/profile', data);
  return res.data;
}

/**
 * Update user avatar URL.
 */
export async function updateAvatar(avatarUrl: string): Promise<Profile> {
  const res = await api.post<Profile>('/api/users/profile/avatar', { avatar_url: avatarUrl });
  return res.data;
}
