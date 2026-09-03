import { api } from './client';
import { AuthTokens } from '../types';

export const authApi = {
  register: (email: string, password: string) =>
    api.post<AuthTokens>('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post<AuthTokens>('/auth/login', { email, password }),

  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),

  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),

  resetPassword: (payload: {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }) => api.post('/auth/reset-password', payload),
};
