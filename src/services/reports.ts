import { api } from './api';
import type { Summary } from '../interfaces/Summary';
import type { SchoolFoodSummary } from '../interfaces/SchoolFoodSummary';

export interface CreateReportData {
  foodId: string;
  receivedKg: number;
  wastedKg: number;
}

export const reportsService = {
  async getSummary(): Promise<Summary[]> {
    const response = await api.get<Summary[]>('/reports/summary');
    return response.data;
  },

  async getSummaryByFood(foodId: string): Promise<SchoolFoodSummary[]> {
    const response = await api.get<SchoolFoodSummary[]>(`/reports/summary/${foodId}`);
    return response.data;
  },

  async createReport(data: CreateReportData): Promise<unknown> {
    const response = await api.post('/reports', {
      foodId: data.foodId,
      receivedKg: data.receivedKg,
      wastedKg: data.wastedKg,
    });
    return response.data;
  }
};
