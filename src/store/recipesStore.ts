import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { recipesApi } from '../api/recipes';
import { Recipe } from '../types';

interface RecipesState {
  recipes: Recipe[];
  lastSyncedAt: number | null;
  isLoading: boolean;
  fetchMine: () => Promise<void>;
  upsertLocal: (recipe: Recipe) => void;
  removeLocal: (id: string) => void;
}

/**
 * Guarda las recetas del usuario en localStorage para que queden
 * disponibles al instante entre navegaciones. `fetchMine` intenta traer
 * datos frescos del backend; si falla (sin conexión), la pantalla sigue
 * mostrando lo que ya está persistido en `recipes`.
 */
export const useRecipesStore = create<RecipesState>()(
  persist(
    (set, get) => ({
      recipes: [],
      lastSyncedAt: null,
      isLoading: false,
      fetchMine: async () => {
        set({ isLoading: true });
        try {
          const { data } = await recipesApi.listMine();
          set({ recipes: data, lastSyncedAt: Date.now() });
        } catch {
          // Sin conexión: se mantienen las recetas ya cacheadas.
        } finally {
          set({ isLoading: false });
        }
      },
      upsertLocal: (recipe) => {
        const existing = get().recipes.filter((r) => r.id !== recipe.id);
        set({ recipes: [recipe, ...existing] });
      },
      removeLocal: (id) => set({ recipes: get().recipes.filter((r) => r.id !== id) }),
    }),
    {
      name: 'olea-recipes-cache',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
