import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import Chip from '../components/Chip';
import RecipeCard from '../components/RecipeCard';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
import { useRecipesStore } from '../store/recipesStore';
import { categoriesApi } from '../api/catalog';
import { Category } from '../types';

export default function HomePage() {
  const navigate = useNavigate();
  const { recipes, fetchMine } = useRecipesStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchMine();
    categoriesApi.listEnabled().then(({ data }) => setCategories(data)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return recipes
      .filter((r) => r.isEnabled)
      .filter((r) => (activeCategory ? r.categoryId === activeCategory : true))
      .filter((r) => (query ? r.name.toLowerCase().includes(query.toLowerCase()) : true));
  }, [recipes, activeCategory, query]);

  return (
    <div className="min-h-screen relative">
      <div className="px-5 md:px-6 lg:px-8 pt-6 max-w-screen-2xl mx-auto">
        <div className="md:max-w-md">
          <TextField placeholder="Buscar receta o ingrediente…" value={query} onChangeText={setQuery} />
        </div>

        <div className="flex overflow-x-auto mb-3 -mt-1 pb-1">
          <Chip label="Todas" active={activeCategory === null} onPress={() => setActiveCategory(null)} />
          {categories.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              active={activeCategory === c.id}
              onPress={() => setActiveCategory(c.id)}
            />
          ))}
        </div>
      </div>

      <div className="px-5 md:px-6 lg:px-8 pb-24 md:pb-10 max-w-screen-2xl mx-auto">
        {filtered.length === 0 ? (
          <EmptyState
            icon="restaurant"
            title="Todavía no tienes recetas"
            subtitle="Tocá el botón de agregar para crear tu primera receta"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
            {filtered.map((item) => (
              <RecipeCard key={item.id} recipe={item} onPress={() => navigate(`/recetas/${item.id}`)} />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate('/recetas/nueva')}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 rounded-full bg-terracota border border-black/5 flex items-center justify-center shadow-lg z-20 hover:brightness-105"
      >
        <Icon name="add" size={26} className="text-white" />
      </button>
    </div>
  );
}