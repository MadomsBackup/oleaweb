import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import SelectField from '../components/SelectField';
import RecipeCard from '../components/RecipeCard';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import { recipesApi } from '../api/recipes';
import { categoriesApi } from '../api/catalog';
import { Category, Recipe } from '../types';

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [maxPrepTimeMinutes, setMaxPrepTimeMinutes] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoriesApi.listEnabled().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await recipesApi.search({
        query: query || undefined,
        ingredient: ingredient || undefined,
        categoryId: categoryId || undefined,
        maxPrepTimeMinutes: maxPrepTimeMinutes ? Number(maxPrepTimeMinutes) : undefined,
      });
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, ingredient, categoryId, maxPrepTimeMinutes]);

  return (
    <div className="min-h-screen">
      <div className="px-5 md:px-6 lg:px-8 pt-6 max-w-screen-2xl mx-auto">
        <h1 className="font-serif-bold text-[22px] text-oliva dark:text-cream mb-4">Buscar</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4">
            <TextField placeholder="Nombre de la receta" value={query} onChangeText={setQuery} />
            <TextField placeholder="Ingrediente" value={ingredient} onChangeText={setIngredient} />
            <SelectField
              placeholder="Todas las categorías"
              value={categoryId}
              onChangeValue={setCategoryId}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
            <TextField
              placeholder="Tiempo máx. de preparación (min)"
              type="text"
              inputMode="numeric"
              value={maxPrepTimeMinutes}
              onChangeText={setMaxPrepTimeMinutes}
            />
          </div>
          <div className="md:max-w-[220px]">
            <PrimaryButton label="Buscar" icon="search" loading={loading} type="submit" />
          </div>
        </form>
      </div>

      <div className="px-5 md:px-6 lg:px-8 pt-4 pb-24 md:pb-10 max-w-screen-2xl mx-auto">
        {results === null ? null : results.length === 0 ? (
          <EmptyState icon="search_off" title="Sin resultados" subtitle="Prueba con otros filtros" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
            {results.map((item) => (
              <RecipeCard key={item.id} recipe={item} onPress={() => navigate(`/recetas/${item.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}