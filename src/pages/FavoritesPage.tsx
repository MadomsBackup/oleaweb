import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import EmptyState from '../components/EmptyState';
import { useRecipesStore } from '../store/recipesStore';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { recipes, fetchMine } = useRecipesStore();

  useEffect(() => {
    fetchMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const favorites = useMemo(() => recipes.filter((r) => r.isFavorite && r.isEnabled), [recipes]);

  return (
    <div className="min-h-screen">
      <div className="px-5 pt-6 pb-24 md:pb-10 max-w-3xl mx-auto">
        <h1 className="font-serif-bold text-[22px] text-oliva dark:text-cream mb-4">Favoritos</h1>
        {favorites.length === 0 ? (
          <EmptyState
            icon="favorite"
            title="Aún no tienes favoritos"
            subtitle="Toca el corazón en una receta para guardarla aquí"
          />
        ) : (
          favorites.map((item) => (
            <RecipeCard key={item.id} recipe={item} onPress={() => navigate(`/recetas/${item.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}
