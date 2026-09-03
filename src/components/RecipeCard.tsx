import React from 'react';
import Icon from './Icon';
import { Recipe } from '../types';
import { recipesApi } from '../api/recipes';
import { useRecipesStore } from '../store/recipesStore';

interface Props {
  recipe: Recipe;
  onPress: () => void;
}

export default function RecipeCard({ recipe, onPress }: Props) {
  const upsertLocal = useRecipesStore((s) => s.upsertLocal);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    upsertLocal({ ...recipe, isFavorite: !recipe.isFavorite });
    try {
      await recipesApi.toggleFavorite(recipe.id);
    } catch {
      upsertLocal(recipe);
    }
  };

  const cover = recipe.photos?.[0];

  return (
    <button
      type="button"
      onClick={onPress}
      className="w-full flex bg-white dark:bg-oliva-900 rounded-[20px] overflow-hidden mb-3.5 shadow-sm border border-subtle dark:border-subtle-dark text-left hover:shadow-md transition-shadow"
    >
      <div className="w-[92px] h-[92px] shrink-0 flex items-center justify-center bg-rose/40 overflow-hidden">
        {cover ? (
          <img
            src={`data:image/${cover.extension};base64,${cover.base64Data}`}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon name="restaurant" size={28} className="text-terracota" />
        )}
      </div>
      <div className="flex-1 px-3.5 py-3 min-w-0">
        <div className="flex justify-between items-start">
          <p className="flex-1 font-serif-bold text-[15px] text-oliva dark:text-cream line-clamp-2 pr-2">
            {recipe.name}
          </p>
          <button type="button" onClick={toggleFavorite} className="shrink-0 p-1 -m-1 hover:opacity-70">
            <Icon
              name="favorite"
              size={16}
              filled={recipe.isFavorite}
              className={recipe.isFavorite ? 'text-terracota' : 'text-text-muted'}
            />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          {recipe.prepTimeMinutes ? (
            <span className="flex items-center gap-0.5 text-[10.5px] text-muted font-sans">
              <Icon name="schedule" size={12} /> {recipe.prepTimeMinutes} min
            </span>
          ) : null}
          <span className="flex items-center gap-0.5 text-[10.5px] text-muted font-sans">
            <Icon name="restaurant" size={12} /> {recipe.servings} porciones
          </span>
        </div>
        {recipe.category ? (
          <p className="text-[9.5px] font-sans-bold text-oliva/70 dark:text-cream/70 uppercase mt-2 tracking-wide">
            {recipe.category.name}
          </p>
        ) : null}
      </div>
    </button>
  );
}
