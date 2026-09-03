import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '../../components/ScreenHeader';
import Icon from '../../components/Icon';

const SECTIONS = [
  { to: '/admin/categorias', icon: 'category', title: 'Categorías', subtitle: 'Tipos de receta (postres, carnes…)' },
  { to: '/admin/ingredientes', icon: 'nutrition', title: 'Ingredientes', subtitle: 'Catálogo base de ingredientes' },
  { to: '/admin/medidas', icon: 'straighten', title: 'Medidas', subtitle: 'Unidades de peso, volumen y cantidad' },
  { to: '/admin/alergenos', icon: 'warning', title: 'Alérgenos', subtitle: 'Etiquetas de alérgenos con emoji' },
];

export default function AdminHomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-cream dark:bg-oliva-dark pb-10">
      <ScreenHeader title="Administración" onBack={() => navigate(-1)} />
      <div className="px-5 max-w-2xl mx-auto grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <button
            key={s.to}
            type="button"
            onClick={() => navigate(s.to)}
            className="bg-white dark:bg-oliva-900 border border-subtle dark:border-subtle-dark rounded-2xl p-4 text-left hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-cream dark:bg-oliva-dark flex items-center justify-center mb-2">
              <Icon name={s.icon} size={20} className="text-terracota" />
            </div>
            <p className="font-serif-bold text-[15px] text-oliva dark:text-cream">{s.title}</p>
            <p className="font-sans text-[11px] text-muted mt-0.5">{s.subtitle}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
