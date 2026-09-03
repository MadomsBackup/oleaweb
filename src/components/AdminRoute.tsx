import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AdminRoute() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  if (user.role !== 'admin') return <Navigate to="/perfil" replace />;
  return <Outlet />;
}
