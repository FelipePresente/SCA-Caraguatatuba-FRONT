import { api } from './api';
import type { UserResponse } from './types';

export const userService = {
  async getUsers(): Promise<UserResponse[]> {
    const response = await api.get<UserResponse[]>('/users');
    return response.data;
  },

  async createUser(data: { username: string; role: string; password?: string }): Promise<void> {
    await api.post('/users', {
      username: data.username,
      role: data.role,
      password: data.password
    });
  },

  async updateUser(data: { id: string; newUsername?: string; newPassword?: string }): Promise<void> {
    const payload: Record<string, any> = { id: data.id };
    if (data.newUsername && data.newUsername.trim() !== '') {
      payload.newUsername = data.newUsername.trim();
    }
    if (data.newPassword && data.newPassword.trim() !== '') {
      payload.newPassword = data.newPassword;
    }
    await api.put('/users', payload);
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
