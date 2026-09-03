import React, { useMemo, useState } from 'react';
import Icon from './Icon';
import { Allergen, Ingredient, Measure } from '../types';

export interface IngredientRowValue {
  ingredientId?: string;
  freeTextName?: string;
  quantity: string;
  measureId?: string;
  allergenIds: string[];
}

interface Props {
  value: IngredientRowValue;
  onChange: (value: IngredientRowValue) => void;
  onRemove: () => void;
  ingredientsCatalog: Ingredient[];
  measures: Measure[];
  allergens: Allergen[];
  error?: string;
}

export default function IngredientFormRow({
  value,
  onChange,
  onRemove,
  ingredientsCatalog,
  measures,
  allergens,
  error,
}: Props) {
  const [text, setText] = useState(value.ingredientId ? '' : value.freeTextName ?? '');

  const suggestions = useMemo(() => {
    if (!text || value.ingredientId) return [];
    return ingredientsCatalog.filter((i) => i.name.toLowerCase().includes(text.toLowerCase())).slice(0, 5);
  }, [text, ingredientsCatalog, value.ingredientId]);

  const selectedIngredientName = ingredientsCatalog.find((i) => i.id === value.ingredientId)?.name;

  return (
    <div className="bg-white dark:bg-oliva-900 rounded-2xl border border-subtle dark:border-subtle-dark p-3.5 mb-3">
      <div className="flex items-center mb-2">
        <input
          placeholder="Ingrediente (ej. Cebolla)"
          value={selectedIngredientName ?? text}
          onChange={(e) => {
            const t = e.target.value;
            setText(t);
            onChange({ ...value, ingredientId: undefined, freeTextName: t });
          }}
          className="flex-1 bg-transparent outline-none text-[13px] text-oliva dark:text-cream font-sans placeholder:text-muted"
        />
        <button type="button" onClick={onRemove} className="shrink-0 p-1 -m-1 hover:opacity-70">
          <Icon name="close" size={16} className="text-terracota" />
        </button>
      </div>

      {suggestions.length > 0 ? (
        <div className="flex overflow-x-auto mb-2 -mx-0.5 px-0.5">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setText('');
                onChange({ ...value, ingredientId: s.id, freeTextName: undefined });
              }}
              className="shrink-0 bg-cream dark:bg-oliva-dark px-3 py-1.5 rounded-full mr-2 border border-subtle dark:border-subtle-dark hover:opacity-70"
            >
              <span className="text-[11px] text-oliva dark:text-cream font-sans whitespace-nowrap">
                {s.name}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-center mb-2">
        <input
          placeholder="Cantidad"
          type="text"
          inputMode="decimal"
          value={value.quantity}
          onChange={(e) => onChange({ ...value, quantity: e.target.value })}
          className={`w-20 shrink-0 bg-cream dark:bg-oliva-dark rounded-xl px-3 py-2 text-[12.5px] text-oliva dark:text-cream font-sans mr-2 border-2 outline-none placeholder:text-muted ${
            error ? 'border-red-500' : 'border-subtle dark:border-subtle-dark focus:border-terracota/50'
          }`}
        />
        <div className="flex-1 flex overflow-x-auto">
          {measures.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange({ ...value, measureId: m.id })}
              className={
                value.measureId === m.id
                  ? 'shrink-0 bg-terracota px-3 py-1.5 rounded-full mr-2 border border-black/5'
                  : 'shrink-0 bg-cream dark:bg-oliva-dark px-3 py-1.5 rounded-full mr-2 border border-subtle dark:border-subtle-dark'
              }
            >
              <span
                className={
                  value.measureId === m.id
                    ? 'text-white text-[11px] font-sans-bold whitespace-nowrap'
                    : 'text-oliva dark:text-cream text-[11px] font-sans-bold whitespace-nowrap'
                }
              >
                {m.abbreviation}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="text-red-600 text-[10.5px] font-sans-medium mb-2">{error}</p> : null}

      <div className="flex overflow-x-auto">
        {allergens.map((a) => {
          const active = value.allergenIds.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  allergenIds: active
                    ? value.allergenIds.filter((id) => id !== a.id)
                    : [...value.allergenIds, a.id],
                })
              }
              className={
                active
                  ? 'shrink-0 bg-salvia/25 border border-salvia/40 rounded-full px-2.5 py-1 mr-1.5'
                  : 'shrink-0 border border-subtle dark:border-subtle-dark rounded-full px-2.5 py-1 mr-1.5'
              }
            >
              <span style={{ fontSize: 14, opacity: active ? 1 : 0.35 }}>{a.emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
