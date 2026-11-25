---
paths:
  - 'src/lib/api/**/*.ts'
  - 'src/hooks/**/*.ts'
  - 'src/queries/**/*.ts'
  - 'src/app/**/*.tsx'
  - 'src/components/**/*.tsx'
---

# TanStack Query 컨벤션

## 구성

- `QueryClient`는 모듈 최상위에서 만들지 않는다(요청 간 캐시 공유). Provider와 서버 컴포넌트는 `getQueryClient()`, 클라이언트 컴포넌트는 `useQueryClient()`로 얻는다.
- 서버 환경 판별은 `environmentManager.isServer()`를 쓴다. `isServer`는 폐기 예정이다.
- `gcTime`을 전역으로 지정하지 않는다. 서버에서 요청이 끝난 캐시가 메모리에 남는다.
- `apiClient`는 `{ data, success }` 형식의 응답을 전제로 `data`만 반환한다. 내용이 없으면 `null`이고, 형식이 다르거나 실패한 응답은 `ApiError`(`@/lib/api`)로 던진다. 네트워크 오류와 구분하려면 `error instanceof ApiError`로 확인한다.

## 쿼리 정의

키와 함수를 `queryOptions`로 묶어 훅, 프리페치, 무효화에서 함께 쓴다. 한 곳에서만 쓰는 단순 조회는 `useApiQuery`를 써도 된다.

```ts
// src/queries/user.ts
export const userQueries = {
  all: () => ['users'] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...userQueries.all(), 'detail', id] as const,
      queryFn: ({ signal }) => apiClient.get<User>(`/users/${id}`, { signal }),
    }),
};
```

- `queryFn`은 실패하면 `Error`를 throw한다. 오류를 값으로 반환하지 않는다.
- `signal`을 넘겨 화면을 떠나면 요청이 취소되게 한다. Suspense 훅에서는 취소되지 않는다.
- 값이 있어야 실행되는 `useQuery`는 `enabled` 대신 `skipToken`을 쓰면 타입이 좁혀진다. Suspense 훅은 둘 다 지원하지 않으므로 컴포넌트를 나눈다.
- 파생 값은 `select`로 만든다.

## 서버에서 미리 가져오기

```tsx
const UserSection = async ({ id }: UserSectionProps) => {
  // TanStack Query는 현재 시각을 읽으므로 정적 셸에서 실행하면 빌드가 실패한다.
  await io();
  const queryClient = getQueryClient();
  // 결과를 await하지 않으면 준비되는 대로 스트리밍된다.
  void queryClient
    .query({ ...userQueries.detail(id), queryFn: () => getUser(id) })
    .catch(noop);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfile id={id} />
    </HydrationBoundary>
  );
};

<Suspense fallback={<UserSkeleton />}>
  <UserSection id={id} />
</Suspense>;
```

- 서버에서 `QueryClient`를 쓰는 컴포넌트는 `await io()`(`next/cache`)로 시작하고 `<Suspense>`로 감싼다.
- 서버에서는 자기 라우트 핸들러를 호출하지 말고 `queryFn`을 데이터 함수로 바꾼다. 상대 주소는 서버에서 해석되지 않는다.
- 클라이언트에서는 `useSuspenseQuery`로 읽는다. 첫 렌더에 필요한 쿼리(`useSuspenseQuery`, `initialData`가 있는 `useQuery`)는 `<Suspense>` 안에 둔다.
- 오류 화면의 다시 시도는 `useQueryErrorResetBoundary().reset()`을 함께 부른다(`src/app/[locale]/error.tsx`). 부르지 않으면 실패한 Suspense 쿼리를 다시 요청하지 않는다.
- `fetchQuery`, `prefetchQuery`, `ensureQueryData`는 폐기 예정이다. `queryClient.query()`를 쓴다.
- 서버 컴포넌트에서만 쓰는 데이터는 TanStack Query 없이 직접 조회하고 `'use cache'`를 검토한다.
- `queryFn`에서 Server Action을 부르지 않는다. 변경에만 쓴다.

## 변경

- 성공하면 관련 쿼리를 무효화하고, 무효화가 끝날 때까지 `pending`을 유지하려면 Promise를 반환한다.
- 낙관적 갱신은 `onMutate`에서 진행 중인 요청을 취소하고 이전 값을 저장한 뒤, `onError`에서 되돌리고 `onSettled`에서 무효화한다.
- 서버 캐시(`cacheTag`)도 바뀌면 액션 안에서 `updateTag`를 함께 호출한다.
