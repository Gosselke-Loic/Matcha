import type { User } from "./schemas/user-schema"; 

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  setUnauth: () => void;
  logout: () => void;
};
