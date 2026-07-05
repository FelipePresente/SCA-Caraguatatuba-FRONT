import { api } from './api';
import type { Food } from '../interfaces/Food';

export const foodService = {
  async getFoods(): Promise<Food[]> {
    const response = await api.get<Food[]>('/food');
    return response.data;
  },

  async createFood(data: { name: string; price: number }): Promise<void> {
    await api.post('/food', {
      name: data.name,
      price: data.price
    });
  },

  async deleteFood(id: string): Promise<void> {
    await api.delete(`/food/${id}`);
  }
};
