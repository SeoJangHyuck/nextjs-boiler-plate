---
paths:
  - '**/hooks/**/*.ts'
  - '**/lib/api/**/*.ts'
  - '**/queries/**/*.ts'
---

# TanStack Query 5.0 컨벤션

## 목적

TanStack Query v5를 사용한 일관된 서버 상태 관리를 적용합니다. 데이터 페칭, 캐싱, 동기화, 낙관적 업데이트를 제공합니다. Next.js App Router와 React 19에 맞춤.

---

## Provider 설정

### QueryClientProvider

```typescript
// ✅ DO: 적절한 설정으로 provider 생성
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            gcTime: 5 * 60 * 1000, // 5분 (이전 cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

// ❌ DON'T: 컴포넌트 외부에서 QueryClient 생성 (SSR 문제)
const queryClient = new QueryClient(); // SSR에 나쁨
```

---

## Query Keys

### 구조화된 Query Keys

```typescript
// ✅ DO: query key 팩토리 패턴 사용
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: PostFilters) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  byUser: (userId: string) => [...postKeys.all, 'user', userId] as const,
};

// 사용
useQuery({ queryKey: userKeys.detail(userId), queryFn: ... });
queryClient.invalidateQueries({ queryKey: userKeys.lists() });

// ❌ DON'T: 문자열 키 사용
useQuery({ queryKey: ['user', userId], queryFn: ... }); // 유지보수 어려움
useQuery({ queryKey: `user-${userId}`, queryFn: ... }); // 유효하지 않은 형식
```

---

## useQuery

### 기본 사용

```typescript
// ✅ DO: 적절한 타이핑으로 useQuery 사용
import { useQuery } from '@tanstack/react-query';

type User = {
  id: string;
  name: string;
  email: string;
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: async (): Promise<User> => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('사용자 조회 실패');
      }
      return response.json();
    },
    enabled: !!userId, // userId가 있을 때만 fetch
  });
};

// 컴포넌트에서 사용
const UserProfile = ({ userId }: { userId: string }) => {
  const { data: user, isLoading, isError, error } = useUser(userId);

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorMessage error={error} />;

  return <div>{user.name}</div>;
};
```

### 파라미터가 있는 Query

```typescript
// ✅ DO: query 파라미터 처리
type UserFilters = {
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export const useUsers = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: async (): Promise<PaginatedResponse<User>> => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, String(value));
        }
      });

      const response = await fetch(`/api/users?${params}`);
      if (!response.ok) {
        throw new Error('사용자 목록 조회 실패');
      }
      return response.json();
    },
    placeholderData: (previousData) => previousData, // 페칭 중 이전 데이터 유지
  });
};
```

### 데이터 변환을 위한 Select

```typescript
// ✅ DO: 파생 데이터에 select 사용
export const useUserNames = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
    select: (data) => data.map((user) => user.name),
  });
};

export const useActiveUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
    select: (data) => data.filter((user) => user.isActive),
  });
};
```

---

## useMutation

### 기본 Mutation

```typescript
// ✅ DO: 콜백과 함께 useMutation 사용
import { useMutation, useQueryClient } from '@tanstack/react-query';

type CreateUserInput = {
  name: string;
  email: string;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserInput): Promise<User> => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error('사용자 생성 실패');
      }
      return response.json();
    },
    onSuccess: (newUser) => {
      // 무효화 및 리페치
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // 또는 캐시 직접 업데이트
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
    },
    onError: (error) => {
      console.error('사용자 생성 실패:', error);
    },
  });
};

// 사용
const CreateUserForm = () => {
  const { mutate, isPending, isError, error } = useCreateUser();

  const handleSubmit = (data: CreateUserInput) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('사용자가 생성되었습니다!');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드 */}
      <button type="submit" disabled={isPending}>
        {isPending ? '생성 중...' : '사용자 생성'}
      </button>
    </form>
  );
};
```

### 낙관적 업데이트

```typescript
// ✅ DO: 롤백이 있는 낙관적 업데이트
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateUserInput): Promise<User> => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('사용자 업데이트 실패');
      }
      return response.json();
    },
    onMutate: async (newUser) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({
        queryKey: userKeys.detail(newUser.id),
      });

      // 이전 값 스냅샷
      const previousUser = queryClient.getQueryData<User>(
        userKeys.detail(newUser.id)
      );

      // 낙관적 업데이트
      queryClient.setQueryData(userKeys.detail(newUser.id), (old: User) => ({
        ...old,
        ...newUser,
      }));

      // 롤백용 컨텍스트 반환
      return { previousUser };
    },
    onError: (error, newUser, context) => {
      // 에러 시 롤백
      if (context?.previousUser) {
        queryClient.setQueryData(
          userKeys.detail(newUser.id),
          context.previousUser
        );
      }
    },
    onSettled: (data, error, variables) => {
      // 에러 또는 성공 후 항상 리페치
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
    },
  });
};
```

---

## Prefetching

### 라우트 Prefetching

```typescript
// ✅ DO: hover/focus 시 prefetch
'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

export const UserLink = ({ userId, children }: UserLinkProps) => {
  const queryClient = useQueryClient();

  const prefetchUser = () => {
    queryClient.prefetchQuery({
      queryKey: userKeys.detail(userId),
      queryFn: () => fetchUser(userId),
      staleTime: 5 * 60 * 1000, // 5분
    });
  };

  return (
    <Link
      href={`/users/${userId}`}
      onMouseEnter={prefetchUser}
      onFocus={prefetchUser}
    >
      {children}
    </Link>
  );
};
```

### 서버 사이드 Prefetching (Next.js)

```typescript
// ✅ DO: 서버 컴포넌트에서 prefetch
// app/users/[id]/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { UserProfile } from '@/components/UserProfile';

export default async function UserPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.detail(params.id),
    queryFn: () => fetchUser(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfile userId={params.id} />
    </HydrationBoundary>
  );
}
```

---

## Infinite Queries

```typescript
// ✅ DO: 페이지네이션에 useInfiniteQuery 사용
import { useInfiniteQuery } from '@tanstack/react-query';

type PostsResponse = {
  posts: Post[];
  nextCursor: string | null;
};

export const useInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: async ({ pageParam }): Promise<PostsResponse> => {
      const params = new URLSearchParams();
      if (pageParam) {
        params.set('cursor', pageParam);
      }
      const response = await fetch(`/api/posts?${params}`);
      return response.json();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

// 사용
const PostList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? '로딩 중...' : '더 보기'}
        </button>
      )}
    </>
  );
};
```

---

## 에러 및 로딩 상태

```typescript
// ✅ DO: 모든 상태 적절히 처리
const UserProfile = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError, error, refetch } = useUser(userId);

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : '알 수 없는 에러'}
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return <EmptyState message="사용자를 찾을 수 없습니다" />;
  }

  return <UserCard user={data} />;
};

// ✅ DO: useSuspenseQuery로 Suspense 사용
import { useSuspenseQuery } from '@tanstack/react-query';

const UserProfile = ({ userId }: { userId: string }) => {
  // 로딩 중 promise throw (Suspense가 캐치)
  // 실패 시 error throw (ErrorBoundary가 캐치)
  const { data } = useSuspenseQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
  });

  return <UserCard user={data} />;
};

// 부모 컴포넌트
const UserPage = ({ userId }: { userId: string }) => {
  return (
    <ErrorBoundary fallback={<ErrorState />}>
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
};
```

---

## 파일 구조

```
src/
├── queries/                   # 또는 hooks/queries/
│   ├── index.ts               # 모든 query 재export
│   ├── keys.ts                # 모든 query key 팩토리
│   ├── users.ts               # 사용자 관련 query/mutation
│   ├── posts.ts               # 게시글 관련 query/mutation
│   └── comments.ts            # 댓글 관련 query/mutation
├── lib/
│   └── api/
│       ├── client.ts          # API 클라이언트 설정
│       └── fetcher.ts         # Fetch 유틸리티
```

---

## AI 에이전트 TanStack Query 개발 작업

- QueryClientProvider가 app/providers.tsx에 설정되었는지 확인
- query key 팩토리 사용 확인 (인라인 문자열 배열 아님)
- queryFn의 에러 처리 검증 (에러 throw, 반환 아님)
- mutation이 관련 query를 무효화하는지 확인
- 낙관적 업데이트에 적절한 롤백 있는지 확인
- 조건부 query에 enabled 옵션 사용 확인
- Suspense query가 useSuspenseQuery 사용하는지 검증
- 향상된 UX를 위한 prefetching 확인
- gcTime >= staleTime 확인 (이전 cacheTime)

**참조**:

- [TanStack Query v5 문서](https://tanstack.com/query/latest)
- [TanStack Query GitHub](https://github.com/TanStack/query)
