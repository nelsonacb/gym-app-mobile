import { create } from 'zustand';
import type { User } from '../api/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setSession: (user: User) => void;
  clearSession: () => void;
  setHydrating: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrating: true,
  setSession: (user) =>
    set({ user, isAuthenticated: true, isHydrating: false }),
  clearSession: () =>
    set({ user: null, isAuthenticated: false, isHydrating: false }),
  setHydrating: (value) => set({ isHydrating: value }),
}));
