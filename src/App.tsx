import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import GuestRoute from './components/GuestRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import PublicRecipePage from './pages/PublicRecipePage';

import RecipeDetailPage from './pages/recipe/RecipeDetailPage';
import RecipeFormPage from './pages/recipe/RecipeFormPage';
import CookModePage from './pages/recipe/CookModePage';

import AdminHomePage from './pages/admin/AdminHomePage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminIngredientsPage from './pages/admin/AdminIngredientsPage';
import AdminMeasuresPage from './pages/admin/AdminMeasuresPage';
import AdminAllergensPage from './pages/admin/AdminAllergensPage';

import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';

function useSyncThemeClass() {
  const mode = useThemeStore((s) => s.mode);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);
}

export default function App() {
  useSyncThemeClass();
  const isHydrated = useAuthStore((s) => s.isHydrated);

  // Espera a que zustand/persist termine de leer localStorage antes de
  // decidir a qué ruta redirigir (evita un parpadeo hacia /auth/login).
  if (!isHydrated) return null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Vista pública de receta compartida — no requiere sesión */}
        <Route path="/compartida/:token" element={<PublicRecipePage />} />

        {/* Auth */}
        <Route element={<GuestRoute />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/registro" element={<RegisterPage />} />
          <Route path="/auth/olvide-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/resetear-password" element={<ResetPasswordPage />} />
        </Route>

        {/* App autenticada */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/buscar" element={<SearchPage />} />
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          <Route path="/recetas/nueva" element={<RecipeFormPage />} />
          <Route path="/recetas/:recipeId" element={<RecipeDetailPage />} />
          <Route path="/recetas/:recipeId/editar" element={<RecipeFormPage />} />
          <Route path="/recetas/:recipeId/cocinar" element={<CookModePage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminHomePage />} />
            <Route path="/admin/categorias" element={<AdminCategoriesPage />} />
            <Route path="/admin/ingredientes" element={<AdminIngredientsPage />} />
            <Route path="/admin/medidas" element={<AdminMeasuresPage />} />
            <Route path="/admin/alergenos" element={<AdminAllergensPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
