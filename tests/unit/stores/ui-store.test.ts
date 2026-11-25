import { beforeEach, describe, expect, it } from 'vitest';
import { useUIStore } from '@/stores';

const initialState = useUIStore.getInitialState();

describe('useUIStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.setState(initialState, true);
  });

  it('사이드바를 토글하고 직접 지정할 수 있다', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);

    useUIStore.getState().setSidebarOpen(false);
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });

  it('테마만 저장소에 남긴다', () => {
    useUIStore.getState().setTheme('dark');
    useUIStore.getState().setSidebarOpen(true);

    const saved = JSON.parse(localStorage.getItem('ui-store') ?? '{}');
    expect(saved.state).toEqual({ theme: 'dark' });
  });
});
