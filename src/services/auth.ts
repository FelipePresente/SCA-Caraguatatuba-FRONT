import { api } from './api';
import type { LoginCredentials, SignUpCredentials, UserResponse } from './types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<void> {
    await api.post('/auth', credentials);
  },

  async signUp(credentials: SignUpCredentials): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/users', credentials);
    return response.data;
  },

  async getMe(): Promise<UserResponse> {
    const response = await api.get<UserResponse>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
