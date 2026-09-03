/**
 * URL base de la API del backend OLEA.
 * Por defecto apunta al backend corriendo en local (npm run start:dev
 * en olea-backend, expuesto en /api). Se puede sobreescribir con la
 * variable de entorno VITE_API_BASE_URL (ej. en un .env para producción).
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';
