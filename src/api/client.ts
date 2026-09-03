import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

/**
 * Si el access token expiró (401), renueva la sesión con el refresh
 * token de forma transparente (sin mandar al usuario al login) y
 * reintenta la petición original una sola vez.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setTokens, logout } = useAuthStore.getState();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    setTokens(data);
    return data.accessToken as string;
  } catch {
    logout();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Traduce un error de axios a un mensaje entendible, distinguiendo entre
 * "no hay respuesta del servidor" (backend caído, URL mal configurada o
 * CORS) y "el servidor respondió con un error" (credenciales inválidas,
 * validación, etc.), en vez de mostrar siempre el mismo mensaje genérico.
 */
export function describeApiError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return `No se pudo conectar con el servidor en ${API_BASE_URL}. Verifica que el backend esté corriendo y sea accesible (revisa la pestaña Network del navegador para más detalle).`;
    }
    const status = error.response.status;
    const serverMessage = (error.response.data as { message?: string | string[] } | undefined)?.message;
    const detail = Array.isArray(serverMessage) ? serverMessage.join(' ') : serverMessage;
    if (status === 401) return detail ?? fallback;
    if (status >= 500) return 'El servidor tuvo un error interno. Revisa la consola del backend.';
    return detail ?? fallback;
  }
  return fallback;
}
