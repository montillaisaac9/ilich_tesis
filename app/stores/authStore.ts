// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react'; // Añadir import

type AuthState = {
  isAuthenticated: boolean;
  area: string | null;
  setSession: (session: Session | null) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      area: null,
      
      setSession: (session) => {
        if (session?.user?.area) {
          set({
            isAuthenticated: true,
            area: session.user.area
          });
        } else {
          set({ isAuthenticated: false, area: null });
        }
      },

      logout: async () => {
        await signOut();
        set({ isAuthenticated: false, area: null });
      }
    }),
    { name: 'auth-storage' }
  )
);