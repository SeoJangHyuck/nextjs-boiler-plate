// devtools 옵션의 타입을 제공한다.
import type {} from '@redux-devtools/extension';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type UIState = {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
};

type UIActions = {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: UIState['theme']) => void;
};

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        // State
        sidebarOpen: false,
        theme: 'system',

        // Actions
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({ theme: state.theme }), // 테마만 persist
      }
    ),
    { name: 'UIStore', enabled: process.env.NODE_ENV === 'development' }
  )
);
