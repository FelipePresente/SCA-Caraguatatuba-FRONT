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

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
