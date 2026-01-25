---
paths:
  - '**/hooks/**/*.ts'
  - '**/lib/api/**/*.ts'
  - '**/queries/**/*.ts'
---

# TanStack Query 5.0 Conventions

## Purpose

Enforce consistent server state management with TanStack Query v5. Provides data fetching, caching, synchronization, and optimistic updates. Aligned with Next.js App Router and React 19.

---

## Provider Setup

### QueryClientProvider

```typescript
// ✅ DO: Create provider with proper configuration
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
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
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

// ❌ DON'T: Create QueryClient outside component (SSR issues)
const queryClient = new QueryClient(); // Bad for SSR
```

---

## Query Keys

### Structured Query Keys

```typescript
// ✅ DO: Use query key factory pattern
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

// Usage
useQuery({ queryKey: userKeys.detail(userId), queryFn: ... });
queryClient.invalidateQueries({ queryKey: userKeys.lists() });

// ❌ DON'T: Use string keys
useQuery({ queryKey: ['user', userId], queryFn: ... }); // Hard to maintain
useQuery({ queryKey: `user-${userId}`, queryFn: ... }); // Invalid format
```

---

## useQuery

### Basic Usage

```typescript
// ✅ DO: Use useQuery with proper typing
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
        throw new Error('Failed to fetch user');
      }
      return response.json();
    },
    enabled: !!userId, // Only fetch when userId exists
  });
};

// Usage in component
const UserProfile = ({ userId }: { userId: string }) => {
  const { data: user, isLoading, isError, error } = useUser(userId);

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorMessage error={error} />;

  return <div>{user.name}</div>;
};
```

### Query with Parameters

```typescript
// ✅ DO: Handle query parameters
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
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
    placeholderData: (previousData) => previousData, // Keep old data while fetching
  });
};
```

### Select for Data Transformation

```typescript
// ✅ DO: Use select for derived data
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

### Basic Mutation

```typescript
// ✅ DO: Use useMutation with callbacks
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
        throw new Error('Failed to create user');
      }
      return response.json();
    },
    onSuccess: (newUser) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Or update cache directly
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
    },
    onError: (error) => {
      console.error('Create user failed:', error);
    },
  });
};

// Usage
const CreateUserForm = () => {
  const { mutate, isPending, isError, error } = useCreateUser();

  const handleSubmit = (data: CreateUserInput) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('User created!');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};
```

### Optimistic Updates

```typescript
// ✅ DO: Optimistic updates with rollback
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
        throw new Error('Failed to update user');
      }
      return response.json();
    },
    onMutate: async (newUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: userKeys.detail(newUser.id),
      });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(
        userKeys.detail(newUser.id)
      );

      // Optimistically update
      queryClient.setQueryData(userKeys.detail(newUser.id), (old: User) => ({
        ...old,
        ...newUser,
      }));

      // Return context for rollback
      return { previousUser };
    },
    onError: (error, newUser, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          userKeys.detail(newUser.id),
          context.previousUser
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
    },
  });
};
```

---

## Prefetching

### Route Prefetching

```typescript
// ✅ DO: Prefetch on hover/focus
'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

export const UserLink = ({ userId, children }: UserLinkProps) => {
  const queryClient = useQueryClient();

  const prefetchUser = () => {
    queryClient.prefetchQuery({
      queryKey: userKeys.detail(userId),
      queryFn: () => fetchUser(userId),
      staleTime: 5 * 60 * 1000, // 5 minutes
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

### Server-Side Prefetching (Next.js)

```typescript
// ✅ DO: Prefetch in Server Components
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
// ✅ DO: Use useInfiniteQuery for pagination
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

// Usage
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
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </>
  );
};
```

---

## Error and Loading States

```typescript
// ✅ DO: Handle all states properly
const UserProfile = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError, error, refetch } = useUser(userId);

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Unknown error'}
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return <EmptyState message="User not found" />;
  }

  return <UserCard user={data} />;
};

// ✅ DO: Use Suspense with useSuspenseQuery
import { useSuspenseQuery } from '@tanstack/react-query';

const UserProfile = ({ userId }: { userId: string }) => {
  // Throws promise during loading (caught by Suspense)
  // Throws error on failure (caught by ErrorBoundary)
  const { data } = useSuspenseQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
  });

  return <UserCard user={data} />;
};

// Parent component
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

## File Organization

```
src/
├── queries/                   # or hooks/queries/
│   ├── index.ts               # Re-export all queries
│   ├── keys.ts                # All query key factories
│   ├── users.ts               # User-related queries/mutations
│   ├── posts.ts               # Post-related queries/mutations
│   └── comments.ts            # Comment-related queries/mutations
├── lib/
│   └── api/
│       ├── client.ts          # API client setup
│       └── fetcher.ts         # Fetch utilities
```

---

## AI Agent Tasks for TanStack Query Development

- Verify QueryClientProvider is set up in app/providers.tsx
- Check query key factories are used (not inline string arrays)
- Validate error handling in queryFn (throw errors, don't return them)
- Ensure mutations invalidate related queries
- Check optimistic updates have proper rollback
- Verify enabled option is used for conditional queries
- Validate Suspense queries use useSuspenseQuery
- Check prefetching for improved UX
- Ensure gcTime >= staleTime (formerly cacheTime)

**References**:

- [TanStack Query v5 Documentation](https://tanstack.com/query/latest)
- [TanStack Query GitHub](https://github.com/TanStack/query)
