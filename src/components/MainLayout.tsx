import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Icon from './Icon';

const TABS = [
  { to: '/', label: 'Inicio', icon: 'home', end: true },
  { to: '/buscar', label: 'Buscar', icon: 'search', end: false },
  { to: '/favoritos', label: 'Favoritos', icon: 'favorite', end: false },
  { to: '/perfil', label: 'Perfil', icon: 'person', end: false },
];

export default function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream dark:bg-oliva-dark flex">
      {/* Sidebar — visible desde md hacia arriba */}
      <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-subtle dark:border-subtle-dark px-4 py-6">
        <div className="px-2 mb-8">
          <p className="font-serif-bold text-[26px] text-oliva dark:text-cream">OLEA</p>
          <p className="font-serif-italic text-terracota text-[12px]">recetas que sazonan recuerdos</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans-medium text-[13px] transition-colors ${
                  isActive
                    ? 'bg-terracota text-white'
                    : 'text-oliva dark:text-cream hover:bg-white dark:hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={tab.icon} size={18} filled={isActive} />
                  {tab.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => navigate('/recetas/nueva')}
          className="mt-4 bg-terracota text-white rounded-full py-3 font-sans-bold text-[13px] shadow-md border border-black/5 hover:brightness-105 flex items-center justify-center gap-1.5"
        >
          <Icon name="add" size={18} />
          Nueva receta
        </button>
      </aside>

      {/* Contenido */}
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <Outlet />
      </div>

      {/* Tab bar inferior — solo mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-oliva-dark border-t border-subtle dark:border-subtle-dark flex items-stretch z-30">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 ${
                isActive ? 'text-terracota' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={tab.icon} size={22} filled={isActive} />
                <span className="font-sans-medium text-[10px]">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
