import { api } from './client';
import { CatalogItem, Measure, Category, Ingredient, Allergen } from '../types';

/** Cliente genérico para los 4 catálogos administrables (mismo shape que el backend). */
export function createCatalogApi<T extends CatalogItem>(resource: string) {
  return {
    listEnabled: () => api.get<T[]>(`/${resource}`),
    listAll: () => api.get<T[]>(`/${resource}/all`),
    create: (dto: Partial<T>) => api.post<T>(`/${resource}`, dto),
    update: (id: string, dto: Partial<T>) => api.patch<T>(`/${resource}/${id}`, dto),
    enable: (id: string) => api.patch<T>(`/${resource}/${id}/enable`),
    disable: (id: string) => api.patch<T>(`/${resource}/${id}/disable`),
  };
}

export const measuresApi = {
  ...createCatalogApi<Measure>('measures'),
  convert: (quantity: number, fromMeasureId: string, toMeasureId: string) =>
    api.get<{ quantity: number; measureId: string }>('/measures/convert', {
      params: { quantity, fromMeasureId, toMeasureId },
    }),
};

export const categoriesApi = createCatalogApi<Category>('categories');
export const ingredientsApi = createCatalogApi<Ingredient>('ingredients');
export const allergensApi = createCatalogApi<Allergen>('allergens');
