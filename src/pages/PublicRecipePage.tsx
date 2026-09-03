import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import RichText from '../components/RichText';
import Icon from '../components/Icon';
import { recipesApi } from '../api/recipes';
import { Recipe } from '../types';

export default function PublicRecipePage() {
  const { token = '' } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    recipesApi
      .getPublic(token)
      .then(({ data }) => setRecipe(data))
      .catch(() => setError(true));
  }, [token]);

  const sortedIngredients = useMemo(
    () => [...(recipe?.ingredients ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [recipe],
  );
  const sortedSteps = useMemo(
    () => [...(recipe?.steps ?? [])].sort((a, b) => a.order - b.order),
    [recipe],
  );

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-8 text-center">
        <p className="font-serif-bold text-[18px] text-oliva mb-2">Enlace no disponible</p>
        <p className="font-sans text-[13px] text-muted mb-6">
          Esta receta ya no está compartida o el enlace es inválido.
        </p>
        <Link to="/" className="font-sans-bold text-[13px] text-terracota">
          Ir a OLEA
        </Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-oliva font-sans">Cargando receta…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-16">
      <div className="px-5 md:px-8 pt-6 max-w-3xl mx-auto">
        <div className="aspect-video w-full max-w-xl mx-auto rounded-3xl overflow-hidden bg-rose/40 border border-subtle flex items-center justify-center shadow-sm">
          {recipe.photos?.[0] ? (
            <img
              src={`data:image/${recipe.photos[0].extension};base64,${recipe.photos[0].base64Data}`}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="restaurant" size={48} className="text-terracota" />
          )}
        </div>

        <p className="font-serif-italic text-terracota text-[12px] mt-5 mb-1">Receta compartida desde OLEA</p>
        {recipe.category ? (
          <span className="inline-flex items-center bg-oliva px-2.5 py-1 rounded-lg mb-2">
            <span className="text-white font-sans-bold text-[9.5px] uppercase leading-none">
              {recipe.category.name}
            </span>
          </span>
        ) : null}
        <h1 className="font-serif-bold text-[24px] text-oliva">{recipe.name}</h1>
        {recipe.description ? (
          <p className="font-sans text-[13px] text-muted mt-2">{recipe.description}</p>
        ) : null}

        <div className="flex mt-3 gap-4 flex-wrap">
          {recipe.prepTimeMinutes ? (
            <span className="flex items-center gap-1 text-[11px] text-muted font-sans-medium">
              <Icon name="schedule" size={14} /> Prep {recipe.prepTimeMinutes} min
            </span>
          ) : null}
          {recipe.cookTimeMinutes ? (
            <span className="flex items-center gap-1 text-[11px] text-muted font-sans-medium">
              <Icon name="local_fire_department" size={14} /> Cocción {recipe.cookTimeMinutes} min
            </span>
          ) : null}
          <span className="flex items-center gap-1 text-[11px] text-muted font-sans-medium">
            <Icon name="restaurant" size={14} /> {recipe.servings} porciones
          </span>
        </div>

        <h2 className="font-serif-bold text-[15px] text-oliva mt-6 mb-2">Ingredientes</h2>
        {sortedIngredients.map((ing, idx) => (
          <div key={ing.id ?? idx} className="flex justify-between py-2 border-b border-dashed border-oliva/15">
            <p className="text-[12.5px] text-oliva font-sans flex-1">
              <span className="font-sans-bold">
                {ing.quantity} {ing.measure?.abbreviation}{' '}
              </span>
              {ing.ingredient?.name ?? ing.freeTextName}
              {ing.allergens?.length ? '  ' + ing.allergens.map((a) => a.emoji).join(' ') : ''}
            </p>
          </div>
        ))}

        <h2 className="font-serif-bold text-[15px] text-oliva mt-6 mb-2">Preparación</h2>
        {sortedSteps.map((step, idx) => (
          <div key={step.id ?? idx} className="flex mb-3.5">
            <div className="w-5 h-5 rounded-full bg-terracota flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
              <span className="text-white text-[10px] font-sans-bold">{idx + 1}</span>
            </div>
            <div className="flex-1">
              <RichText content={step.content} className="text-[12.5px] text-oliva font-sans" />
              {step.timerSeconds ? (
                <p className="flex items-center gap-1 text-[10.5px] text-terracota font-sans-bold mt-1">
                  <Icon name="timer" size={12} /> {Math.round(step.timerSeconds / 60)} min
                </p>
              ) : null}
            </div>
          </div>
        ))}

        <p className="text-center text-[11px] text-muted font-sans mt-10">
          Compartido desde{' '}
          <Link to="/" className="font-sans-bold text-terracota">
            OLEA
          </Link>{' '}
          — recetas que sazonan recuerdos
        </p>
      </div>
    </div>
  );
}
