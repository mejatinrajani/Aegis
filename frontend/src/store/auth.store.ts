import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { authService } from "@/api/auth.service";
import { mockUser } from "@/lib/mock-data";

interface AuthState {
  user: User | null;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Default to a signed-in mock user so the app feels alive on first load.
      user: mockUser,
      isHydrating: true,
      login: async (email, password) => {
        const user = await authService.login(email, password);
        set({ user });
      },
      register: async (email, password, name) => {
        const user = await authService.register(email, password, name);
        set({ user });
      },
      logout: () => set({ user: null }),
      setHydrated: () => set({ isHydrating: false }),
    }),
    {
      name: "aegis.auth",
      partialize: (s) => ({ user: s.user }),
    },
  ),
);
