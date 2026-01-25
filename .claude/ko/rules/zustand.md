---
paths: '**/stores/**/*.ts'
---

# Zustand 5.0 컨벤션

## 목적

TypeScript strict mode와 함께 일관된 Zustand 상태 관리 패턴을 적용합니다. Zustand v5.0.10 모범 사례 기반, 확장 가능한 아키텍처를 위한 슬라이스 패턴.

---

## 스토어 생성

### TypeScript로 기본 스토어

```typescript
// ✅ DO: 엄격한 타이핑으로 스토어 생성
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

// ❌ DON'T: 타입 어노테이션 없이 스토어 생성
export const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### 비동기 액션이 있는 스토어

```typescript
// ✅ DO: 적절한 에러 처리가 있는 비동기 액션
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
        error: error instanceof Error ? error.message : '사용자 조회 실패',
        isLoading: false,
      });
    }
  },
  clearError: () => set({ error: null }),
}));
```

---

## 슬라이스 패턴

### 대규모 스토어를 위한 슬라이스 생성

```typescript
// ✅ DO: 스토어를 슬라이스로 분할
// stores/slices/authSlice.ts
import type { StateCreator } from 'zustand';

export type AuthSlice = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
};

export const createAuthSlice: StateCreator<
  AuthSlice & CartSlice, // 결합된 상태 타입
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

## 미들웨어

### DevTools (개발 환경 전용)

```typescript
// ✅ DO: 개발 환경에서 devtools 활성화
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
          'counter/increment' // devtools용 액션 이름
        ),
    }),
    { name: 'CounterStore', enabled: process.env.NODE_ENV === 'development' }
  )
);
```

### Persist (LocalStorage/SessionStorage)

```typescript
// ✅ DO: 적절한 타이핑으로 상태 영속화
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
      partialize: (state) => ({ theme: state.theme }), // theme만 영속화
    }
  )
);

// ✅ DO: 미들웨어 결합
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // 상태와 액션
      }),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' }
  )
);
```

### 복잡한 업데이트를 위한 Immer

```typescript
// ✅ DO: 중첩 상태 업데이트에 immer 사용
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
            subtask.done = !subtask.done; // immer로 직접 뮤테이션
          }
        }
      }),
  }))
);

// ❌ DON'T: immer 없이 복잡한 중첩 업데이트
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

## React 통합

### 성능을 위한 셀렉터

```typescript
// ✅ DO: 불필요한 리렌더 방지를 위해 셀렉터 사용
const count = useCounterStore((state) => state.count);
const increment = useCounterStore((state) => state.increment);

// ✅ DO: 세밀한 구독을 위한 여러 셀렉터
const user = useAppStore((state) => state.user);
const isAuthenticated = useAppStore((state) => state.isAuthenticated);

// ✅ DO: 메모이제이션된 계산 셀렉터
import { useShallow } from 'zustand/react/shallow';

const { user, isAuthenticated } = useAppStore(
  useShallow((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }))
);

// ❌ DON'T: 전체 스토어 선택 (모든 변경에 리렌더 발생)
const store = useCounterStore(); // 나쁨 - 모든 것을 구독
const { count, increment } = useCounterStore(); // 여전히 나쁨
```

### 복잡한 로직을 위한 커스텀 훅

```typescript
// ✅ DO: 파생 상태를 위한 커스텀 훅 생성
export const useCartTotal = () => {
  return useAppStore((state) =>
    state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  );
};

export const useIsCartEmpty = () => {
  return useAppStore((state) => state.items.length === 0);
};

// ✅ DO: 다른 훅과 결합
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

## React 외부에서 스토어

```typescript
// ✅ DO: React 컴포넌트 외부에서 스토어 접근
// 유틸리티, 서버 액션 등에서 유용
const currentCount = useCounterStore.getState().count;
useCounterStore.getState().increment();

// ✅ DO: React 외부에서 변경 구독
const unsubscribe = useCounterStore.subscribe((state) =>
  console.log('Count changed:', state.count)
);

// ✅ DO: 특정 슬라이스 구독
const unsubscribe = useCounterStore.subscribe(
  (state) => state.count,
  (count, prevCount) => console.log('Count:', prevCount, '->', count)
);
```

---

## 테스트

```typescript
// ✅ DO: 테스트 간 스토어 리셋
import { useCounterStore } from './counterStore';

const initialState = useCounterStore.getState();

beforeEach(() => {
  useCounterStore.setState(initialState, true);
});

// ✅ DO: 스토어 액션 테스트
describe('useCounterStore', () => {
  it('count를 증가시킨다', () => {
    const { increment } = useCounterStore.getState();
    increment();
    expect(useCounterStore.getState().count).toBe(1);
  });

  it('count를 리셋한다', () => {
    useCounterStore.setState({ count: 10 });
    useCounterStore.getState().reset();
    expect(useCounterStore.getState().count).toBe(0);
  });
});
```

---

## 파일 구조

```
src/
├── stores/
│   ├── index.ts              # 모든 스토어 재export
│   ├── useAuthStore.ts       # 단일 목적 스토어
│   ├── useCartStore.ts       # 단일 목적 스토어
│   ├── useAppStore.ts        # 슬라이스가 있는 결합 스토어
│   └── slices/
│       ├── authSlice.ts
│       ├── cartSlice.ts
│       └── index.ts
```

---

## AI 에이전트 Zustand 개발 작업

- 스토어가 TypeScript strict 타이핑을 사용하는지 확인
- 셀렉터 사용 확인 (전체 스토어 구독 피하기)
- 미들웨어 설정 검증 (devtools, persist, immer)
- 5개 이상 상태 속성을 가진 스토어에 슬라이스 패턴 보장
- 비동기 액션에 적절한 에러 처리 확인
- 여러 속성 선택에 `useShallow` 확인
- persist 스토리지 설정 검증
- 스토어가 테스트 가능한지 확인 (getState, setState 접근)

**참조**:

- [Zustand v5 문서](https://zustand.docs.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
