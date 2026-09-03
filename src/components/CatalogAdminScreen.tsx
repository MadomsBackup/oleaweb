import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from './ScreenHeader';
import TextField from './TextField';
import PrimaryButton from './PrimaryButton';
import Chip from './Chip';
import EmptyState from './EmptyState';
import { CatalogItem } from '../types';

export interface CatalogFieldConfig {
  key: string;
  label: string;
  keyboardType?: 'default' | 'numeric';
  choices?: { value: string; label: string }[];
}

interface CatalogApi<T> {
  listAll: () => Promise<{ data: T[] }>;
  create: (dto: Partial<T>) => Promise<{ data: T }>;
  update: (id: string, dto: Partial<T>) => Promise<{ data: T }>;
  enable: (id: string) => Promise<unknown>;
  disable: (id: string) => Promise<unknown>;
}

interface Props<T extends CatalogItem> {
  title: string;
  api: CatalogApi<T>;
  fields: CatalogFieldConfig[];
  renderSubtitle?: (item: T) => string;
}

/**
 * Pantalla de administración reutilizable para los 4 catálogos
 * (medidas, categorías, ingredientes, alérgenos): mismo patrón de
 * listar, crear y habilitar/deshabilitar, configurado por `fields`.
 */
export default function CatalogAdminScreen<T extends CatalogItem>({
  title,
  api,
  fields,
  renderSubtitle,
}: Props<T>) {
  const navigate = useNavigate();
  const [items, setItems] = useState<T[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    api.listAll().then(({ data }) => setItems(data)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (item: T) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isEnabled: !i.isEnabled } : i)));
    try {
      if (item.isEnabled) await api.disable(item.id);
      else await api.enable(item.id);
    } catch {
      load();
    }
  };

  const handleCreate = async () => {
    if (!form[fields[0].key]) return;
    setSaving(true);
    setFormError(null);
    try {
      const payload: Record<string, unknown> = { ...form };
      for (const field of fields) {
        if (field.keyboardType === 'numeric' && payload[field.key] !== undefined) {
          payload[field.key] = Number(payload[field.key]);
        }
      }
      await api.create(payload as Partial<T>);
      setForm({});
      load();
    } catch {
      setFormError('No se pudo guardar. Revisa los datos e intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-cream dark:bg-oliva-dark pb-10">
      <ScreenHeader title={title} onBack={() => navigate(-1)} />

      <div className="px-5 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-oliva-900 rounded-2xl border border-subtle dark:border-subtle-dark p-4 mb-4">
          <p className="font-sans-bold text-[12px] text-oliva dark:text-cream mb-2">Agregar nuevo</p>
          {fields.map((field) =>
            field.choices ? (
              <div key={field.key} className="mb-3">
                <p className="font-sans-medium text-[11px] text-oliva dark:text-cream mb-1.5">
                  {field.label}
                </p>
                <div className="flex flex-wrap">
                  {field.choices.map((choice) => (
                    <Chip
                      key={choice.value}
                      label={choice.label}
                      active={form[field.key] === choice.value}
                      onPress={() => setForm((f) => ({ ...f, [field.key]: choice.value }))}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <TextField
                key={field.key}
                placeholder={field.label}
                type={field.keyboardType === 'numeric' ? 'number' : 'text'}
                value={form[field.key] ?? ''}
                onChangeText={(text) => setForm((f) => ({ ...f, [field.key]: text }))}
              />
            ),
          )}
          {formError ? <p className="text-red-600 text-[11px] font-sans-medium mb-2">{formError}</p> : null}
          <PrimaryButton label="Guardar" loading={saving} onClick={handleCreate} />
        </div>

        {items.length === 0 ? (
          <EmptyState icon="folder_open" title="Sin elementos todavía" subtitle="Agrega el primero desde el formulario de arriba" />
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white dark:bg-oliva-900 rounded-2xl border border-subtle dark:border-subtle-dark px-4 py-3 mb-2.5"
            >
              <div className="flex-1 pr-3 min-w-0">
                <p className="font-sans-medium text-[13px] text-oliva dark:text-cream truncate">{item.name}</p>
                {renderSubtitle ? (
                  <p className="font-sans text-[11px] text-muted mt-0.5 truncate">{renderSubtitle(item)}</p>
                ) : null}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={item.isEnabled}
                onClick={() => handleToggle(item)}
                className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
                  item.isEnabled ? 'bg-terracota' : 'bg-oliva/20 dark:bg-white/20'
                }`}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: item.isEnabled ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
