import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { authApi } from '../api/auth';
import PrimaryButton from '../components/PrimaryButton';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, refreshToken, logout } = useAuthStore();
  const { mode, toggle } = useThemeStore();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const handleLogout = async () => {
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } finally {
      logout();
      navigate('/auth/login');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="px-5 pt-6 pb-24 max-w-lg mx-auto flex flex-col min-h-[calc(100vh-3rem)]">
        <h1 className="font-serif-bold text-[22px] text-oliva dark:text-cream mb-6">Perfil</h1>

        <div className="bg-white dark:bg-oliva-900 rounded-2xl border border-subtle dark:border-subtle-dark p-4 mb-4">
          <p className="font-sans-medium text-[11px] text-muted">Correo</p>
          <p className="font-sans text-[14px] text-oliva dark:text-cream mt-1">{user?.email}</p>
        </div>

        <button
          type="button"
          onClick={toggle}
          className="bg-white dark:bg-oliva-900 rounded-2xl border border-subtle dark:border-subtle-dark p-4 mb-4 flex justify-between items-center"
        >
          <span className="font-sans-medium text-[13px] text-oliva dark:text-cream">Modo oscuro</span>
          <span className="font-sans-bold text-[13px] text-terracota">
            {mode === 'dark' ? 'Activado' : 'Desactivado'}
          </span>
        </button>

        {user?.role === 'admin' ? (
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-white dark:bg-oliva-900 rounded-2xl border border-subtle dark:border-subtle-dark p-4 mb-4 text-left"
          >
            <span className="font-sans-medium text-[13px] text-oliva dark:text-cream">
              Panel de administración
            </span>
          </button>
        ) : null}

        <div className="mt-auto mb-8 pt-6">
          {confirmingLogout ? (
            <div className="bg-white dark:bg-oliva-900 rounded-2xl border border-subtle dark:border-subtle-dark p-4 mb-3">
              <p className="font-sans-medium text-[13px] text-oliva dark:text-cream mb-3 text-center">
                ¿Seguro que quieres salir?
              </p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <PrimaryButton label="Cancelar" variant="outline" onClick={() => setConfirmingLogout(false)} />
                </div>
                <div className="flex-1">
                  <PrimaryButton label="Cerrar sesión" onClick={handleLogout} />
                </div>
              </div>
            </div>
          ) : (
            <PrimaryButton label="Cerrar sesión" variant="outline" onClick={() => setConfirmingLogout(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
