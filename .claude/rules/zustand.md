---
paths: '**/stores/**/*.ts'
---

# Zustand 5.0 Conventions

## Purpose

Enforce consistent Zustand state management patterns with TypeScript strict mode. Based on Zustand v5.0.10 best practices with slices pattern for scalable architecture.

---

## Store Creation

### Basic Store with TypeScript

```typescript
// ✅ DO: Create store with strict typing
import { create } from 'zustand';

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// ❌ DON'T: Create store without type annotation
export const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Store with Async Actions

```typescript
// ✅ DO: Async actions with proper error handling
type UserState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  fetchUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const user = await api.getUser(id);
      set({ user, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        isLoading: false,
      });
    }
  },
  clearError: () => set({ error: null }),
}));
```

---

## Slices Pattern

### Creating Slices for Large Stores

```typescript
// ✅ DO: Split store into slices
// stores/slices/authSlice.ts
import type { StateCreator } from 'zustand';

export type AuthSlice = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
};

export const createAuthSlice: StateCreator<
  AuthSlice & CartSlice, // Combined state type
  [],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    const user = await api.login(credentials);
    set({ user, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
});

// stores/slices/cartSlice.ts
export type CartSlice = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const createCartSlice: StateCreator<
  AuthSlice & CartSlice,
  [],
  [],
  CartSlice
> = (set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ items: [] }),
});

// stores/useAppStore.ts
import { create } from 'zustand';
import { createAuthSlice, type AuthSlice } from './slices/authSlice';
import { createCartSlice, type CartSlice } from './slices/cartSlice';

type AppStore = AuthSlice & CartSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createAuthSlice(...args),
  ...createCartSlice(...args),
}));
```

---

## Middleware

### DevTools (Development Only)

```typescript
// ✅ DO: Enable devtools in development
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () =>
        set(
          (state) => ({ count: state.count + 1 }),
          undefined,
          'counter/increment' // Action name for devtools
        ),
    }),
    { name: 'CounterStore', enabled: process.env.NODE_ENV === 'development' }
  )
);
```

### Persist (LocalStorage/SessionStorage)

```typescript
// ✅ DO: Persist state with proper typing
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ThemeState = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
);

// ✅ DO: Combine middleware
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // state and actions
      }),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' }
  )
);
```

### Immer for Complex Updates

```typescript
// ✅ DO: Use immer for nested state updates
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type TodoState = {
  todos: {
    id: string;
    text: string;
    completed: boolean;
    subtasks: { id: string; text: string; done: boolean }[];
  }[];
  toggleSubtask: (todoId: string, subtaskId: string) => void;
};

export const useTodoStore = create<TodoState>()(
  immer((set) => ({
    todos: [],
    toggleSubtask: (todoId, subtaskId) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === todoId);
        if (todo) {
          const subtask = todo.subtasks.find((s) => s.id === subtaskId);
          if (subtask) {
            subtask.done = !subtask.done; // Direct mutation with immer
          }
        }
      }),
  }))
);

// ❌ DON'T: Complex nested updates without immer
set((state) => ({
  todos: state.todos.map((todo) =>
    todo.id === todoId
      ? {
          ...todo,
          subtasks: todo.subtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, done: !subtask.done }
              : subtask
          ),
        }
      : todo
  ),
}));
```

---

## React Integration

### Selectors for Performance

```typescript
// ✅ DO: Use selectors to prevent unnecessary re-renders
const count = useCounterStore((state) => state.count);
const increment = useCounterStore((state) => state.increment);

// ✅ DO: Multiple selectors for fine-grained subscriptions
const user = useAppStore((state) => state.user);
const isAuthenticated = useAppStore((state) => state.isAuthenticated);

// ✅ DO: Memoized computed selectors
import { useShallow } from 'zustand/react/shallow';

const { user, isAuthenticated } = useAppStore(
  useShallow((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }))
);

// ❌ DON'T: Select entire store (causes re-render on any change)
const store = useCounterStore(); // Bad - subscribes to everything
const { count, increment } = useCounterStore(); // Still bad
```

### Custom Hooks for Complex Logic

```typescript
// ✅ DO: Create custom hooks for derived state
export const useCartTotal = () => {
  return useAppStore((state) =>
    state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  );
};

export const useIsCartEmpty = () => {
  return useAppStore((state) => state.items.length === 0);
};

// ✅ DO: Combine with other hooks
export const useAuthenticatedUser = () => {
  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated || !user) {
    return null;
  }

  return user;
};
```

---

## Store Outside React

```typescript
// ✅ DO: Access store outside React components
// Useful for utilities, server actions, etc.
const currentCount = useCounterStore.getState().count;
useCounterStore.getState().increment();

// ✅ DO: Subscribe to changes outside React
const unsubscribe = useCounterStore.subscribe((state) =>
  console.log('Count changed:', state.count)
);

// ✅ DO: Subscribe to specific slice
const unsubscribe = useCounterStore.subscribe(
  (state) => state.count,
  (count, prevCount) => console.log('Count:', prevCount, '->', count)
);
```

---

## Testing

```typescript
// ✅ DO: Reset store between tests
import { useCounterStore } from './counterStore';

const initialState = useCounterStore.getState();

beforeEach(() => {
  useCounterStore.setState(initialState, true);
});

// ✅ DO: Test store actions
describe('useCounterStore', () => {
  it('increments count', () => {
    const { increment } = useCounterStore.getState();
    increment();
    expect(useCounterStore.getState().count).toBe(1);
  });

  it('resets count', () => {
    useCounterStore.setState({ count: 10 });
    useCounterStore.getState().reset();
    expect(useCounterStore.getState().count).toBe(0);
  });
});
```

---

## File Organization

```
src/
├── stores/
│   ├── index.ts              # Re-export all stores
│   ├── useAuthStore.ts       # Single-purpose store
│   ├── useCartStore.ts       # Single-purpose store
│   ├── useAppStore.ts        # Combined store with slices
│   └── slices/
│       ├── authSlice.ts
│       ├── cartSlice.ts
│       └── index.ts
```

---

## AI Agent Tasks for Zustand Development

- Verify stores use TypeScript strict typing
- Check selector usage (avoid subscribing to entire store)
- Validate middleware configuration (devtools, persist, immer)
- Ensure slices pattern for stores with 5+ state properties
- Check async actions have proper error handling
- Verify `useShallow` for multiple property selections
- Validate persist storage configuration
- Ensure stores are testable (getState, setState access)

**References**:

- [Zustand v5 Documentation](https://zustand.docs.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
