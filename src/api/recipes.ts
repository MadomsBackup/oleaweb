import { api } from './client';
import { Recipe } from '../types';

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  ingredient?: string;
  maxPrepTimeMinutes?: number;
  favoritesOnly?: boolean;
}

export const recipesApi = {
  listMine: () => api.get<Recipe[]>('/recipes'),
  search: (filters: SearchFilters) => api.get<Recipe[]>('/recipes/search', { params: filters }),
  getOne: (id: string) => api.get<Recipe>(`/recipes/${id}`),
  create: (dto: Partial<Recipe>) => api.post<Recipe>('/recipes', dto),
  update: (id: string, dto: Partial<Recipe>) => api.patch<Recipe>(`/recipes/${id}`, dto),
  reorderSteps: (id: string, orderedStepIds: string[]) =>
    api.patch(`/recipes/${id}/steps/reorder`, { orderedStepIds }),
  toggleFavorite: (id: string) => api.patch<Recipe>(`/recipes/${id}/favorite`),
  disable: (id: string) => api.patch<Recipe>(`/recipes/${id}/disable`),
  scaleServings: (id: string, servings: number) =>
    api.get<Recipe>(`/recipes/${id}/scale`, { params: { servings } }),
  createShareLink: (id: string) => api.post<{ shareToken: string }>(`/recipes/${id}/share`),
  revokeShareLink: (id: string) => api.delete(`/recipes/${id}/share`),
  exportPdf: (id: string) => api.get(`/recipes/${id}/pdf`, { responseType: 'blob' }),
  getPublic: (token: string) => api.get<Recipe>(`/public/recipes/${token}`),
};
