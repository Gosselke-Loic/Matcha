import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { UserData } from "../schemas/user-schema";

export interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: UserData) => void;
  setUnauth: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      setUnauth: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      setAuth: (user) => set({ user: user, isAuthenticated: true, isLoading: true }),
      logout: () => set({ user: null, isAuthenticated: false, isLoading: true })
    }),
    { name: 'auth-storage' }
  )
);
