import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from '../utils/jwt';
import { AuthenticatedUser, AuthTokens } from '../types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthenticatedUser | null;
  isHydrated: boolean;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isHydrated: false,
      setTokens: (tokens) => {
        const payload = jwtDecode<{ sub: string; email: string; role: 'admin' | 'user' }>(
          tokens.accessToken,
        );
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: payload
            ? { userId: payload.sub, email: payload.email, role: payload.role }
            : null,
        });
      },
      logout: () => set({ accessToken: null, refreshToken: null, user: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'olea-auth',
      // En web no existe Keychain/Keystore: se persiste en localStorage.
      // Igual que en mobile, sólo el navegador de este dispositivo puede
      // leerlo (no es accesible desde otros orígenes).
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
