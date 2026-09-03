import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import RecipeCard from '../components/RecipeCard';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import { recipesApi } from '../api/recipes';
import { Recipe } from '../types';

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [maxPrepTimeMinutes, setMaxPrepTimeMinutes] = useState('');
  const [results, setResults] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await recipesApi.search({
        query: query || undefined,
        ingredient: ingredient || undefined,
        maxPrepTimeMinutes: maxPrepTimeMinutes ? Number(maxPrepTimeMinutes) : undefined,
      });
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, ingredient, maxPrepTimeMinutes]);

  return (
    <div className="min-h-screen">
      <div className="px-5 pt-6 max-w-3xl mx-auto">
        <h1 className="font-serif-bold text-[22px] text-oliva dark:text-cream mb-4">Buscar</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          <TextField placeholder="Nombre de la receta" value={query} onChangeText={setQuery} />
          <TextField placeholder="Ingrediente" value={ingredient} onChangeText={setIngredient} />
          <TextField
            placeholder="Tiempo máx. de preparación (min)"
            type="text"
            inputMode="numeric"
            value={maxPrepTimeMinutes}
            onChangeText={setMaxPrepTimeMinutes}
          />
          <PrimaryButton label="Buscar" loading={loading} type="submit" />
        </form>
      </div>

      <div className="px-5 pt-4 pb-24 md:pb-10 max-w-3xl mx-auto">
        {results === null ? null : results.length === 0 ? (
          <EmptyState icon="search_off" title="Sin resultados" subtitle="Prueba con otros filtros" />
        ) : (
          results.map((item) => (
            <RecipeCard key={item.id} recipe={item} onPress={() => navigate(`/recetas/${item.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}
