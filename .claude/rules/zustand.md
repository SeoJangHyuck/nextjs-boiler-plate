---
paths:
  - 'src/stores/**/*.ts'
  - 'src/app/**/*.tsx'
  - 'src/components/**/*.tsx'
  - 'tests/unit/stores/**/*'
---

# Zustand 컨벤션

## 무엇을 담는가

- 클라이언트 UI 상태(사이드바, 테마, 다단계 폼)만 담는다.
- 서버에서 온 데이터는 TanStack Query에 두고 복사하지 않는다. URL로 표현할 수 있는 상태(필터, 페이지)는 URL에 둔다.

## 스토어 정의

- 상태 타입과 액션 타입을 나눠 선언하고 `create<Store>()(...)`로 만든다. `src/stores/index.ts`에서 다시 내보낸다.
- 미들웨어 순서는 `devtools(persist(...))`다. 중첩 객체를 갱신하면 가장 안쪽에 `immer`를 쓸 수 있다(`immer` 패키지 설치 필요).
- `devtools`는 `enabled: process.env.NODE_ENV === 'development'`로 제한한다. 옵션 타입을 위해 `import type {} from '@redux-devtools/extension'`을 둔다.
- `persist`는 `partialize`로 필요한 값만 저장한다. 저장 형태를 바꾸면 `version`과 `migrate`를 함께 올린다. 토큰이나 개인정보를 저장하지 않는다.
- 상태 속성이 5개를 넘거나 영역이 갈리면 슬라이스(`StateCreator`)로 나눈다.

## 사용

```ts
// 필요한 값만 구독한다
const theme = useUIStore((state) => state.theme);

// 여러 값을 고를 때
const { theme, setTheme } = useUIStore(
  useShallow(({ theme, setTheme }) => ({ theme, setTheme }))
);

// ❌ 전체 구독: 어떤 값이 바뀌어도 다시 렌더링된다
const { theme } = useUIStore();
```

## Next.js에서 주의할 점

- 서버 컴포넌트에서 스토어를 읽거나 쓰지 않는다.
- 모듈 스토어는 서버에서 모든 요청이 공유한다. 사용자별 초기값이 필요하면 `createStore`와 Context로 요청마다 만든다.
- `persist` 값은 hydration 이후에 적용된다. 첫 렌더 결과가 달라지는 UI는 hydration 완료를 확인한 뒤 표시한다. 서버에는 `persist` API가 없어 렌더링 중에 직접 부르면 빌드가 실패한다.

```ts
const hydrated = useSyncExternalStore(
  (onChange) => useUIStore.persist.onFinishHydration(onChange),
  () => useUIStore.persist.hasHydrated(),
  () => false
);
```

## 테스트

```ts
const initialState = useUIStore.getInitialState();

beforeEach(() => {
  useUIStore.setState(initialState, true);
});
```
