import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichText from '../../components/RichText';
import IconButton from '../../components/IconButton';
import Icon from '../../components/Icon';
import Timer from '../../components/Timer';
import { useRecipesStore } from '../../store/recipesStore';
import { recipesApi } from '../../api/recipes';

export default function CookModePage() {
  const navigate = useNavigate();
  const { recipeId = '' } = useParams();

  const cached = useRecipesStore((s) => s.recipes.find((r) => r.id === recipeId));
  const upsertLocal = useRecipesStore((s) => s.upsertLocal);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    recipesApi.getOne(recipeId).then(({ data }) => upsertLocal(data)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  const steps = useMemo(() => [...(cached?.steps ?? [])].sort((a, b) => a.order - b.order), [cached]);

  if (!cached || steps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-oliva dark:text-cream font-sans">Cargando…</p>
      </div>
    );
  }

  const step = steps[current];
  const referencedIngredients = step.referencedIngredients ?? [];

  const goNext = () => {
    if (current === steps.length - 1) {
      navigate(-1);
      return;
    }
    setCurrent((c) => c + 1);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 md:px-0 pt-4 pb-6">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col w-full">
        <div className="flex items-center">
          <IconButton icon="close" tone="muted" size="sm" label="Salir del modo cocina" onClick={() => navigate(-1)} />
          <div className="flex-1 flex ml-3 gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className="flex-1 h-1 rounded-full"
                style={{ backgroundColor: idx <= current ? '#C17C53' : 'rgba(93,90,53,0.15)' }}
              />
            ))}
          </div>
        </div>

        <p className="text-center text-[10.5px] text-muted font-sans-bold uppercase tracking-wide mt-4">
          Paso {current + 1} de {steps.length}
        </p>

        <div className="flex-1 flex flex-col items-center justify-center px-2 py-10">
          <RichText
            content={step.content}
            className="font-serif-bold text-[19px] md:text-[24px] text-oliva dark:text-cream text-center leading-7"
          />

          {referencedIngredients.length > 0 ? (
            <div className="flex flex-wrap justify-center mt-4 gap-2">
              {referencedIngredients.map((ing, idx) => (
                <div key={idx} className="bg-white dark:bg-oliva-900 rounded-2xl border border-subtle dark:border-subtle-dark px-4 py-2">
                  <span className="font-sans-bold text-[11px] text-oliva dark:text-cream">
                    {ing.ingredient?.name ?? ing.freeTextName} · {ing.quantity} {ing.measure?.abbreviation}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {step.timerSeconds ? <Timer seconds={step.timerSeconds} /> : null}
        </div>

        <div className="flex mb-4 gap-2.5">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="flex-1 border-2 border-oliva/25 dark:border-white/20 rounded-2xl py-3.5 flex items-center justify-center gap-1 hover:opacity-70"
            style={{ opacity: current === 0 ? 0.4 : 1 }}
          >
            <Icon name="arrow_back" size={16} className="text-oliva dark:text-cream" />
            <span className="text-oliva dark:text-cream font-sans-bold text-[12px]">Atrás</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex-[2] bg-terracota border border-black/5 rounded-2xl py-3.5 flex items-center justify-center gap-1.5 shadow-md hover:brightness-105"
          >
            <Icon name="check" size={17} className="text-white" />
            <span className="text-white font-sans-bold text-[12.5px]">
              {current === steps.length - 1 ? 'Terminar' : 'Listo'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
