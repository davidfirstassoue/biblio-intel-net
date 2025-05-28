import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeColor = 'primary' | 'secondary' | 'accent' | 'teal' | 'purple' | 'pink';

type ThemeState = {
  mode: 'light' | 'dark';
  color: ThemeColor;
  toggleMode: () => void;
  setMode: (mode: 'light' | 'dark') => void;
  setColor: (color: ThemeColor) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      color: 'primary',
      
      toggleMode: () => 
        set((state) => ({ 
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
      
      setMode: (mode) => set({ mode }),
      
      setColor: (color) => set({ color }),
    }),
    {
      name: 'bibiothek-theme-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);