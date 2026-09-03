import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function GuestRoute() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) return null;
  if (accessToken) return <Navigate to="/" replace />;
  return <Outlet />;
}
