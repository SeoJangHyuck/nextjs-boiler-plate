---
paths: 'src/app/**/*.{ts,tsx}'
---

# Next.js 16+ Conventions

## Purpose

Standardize Next.js App Router patterns following official documentation and React 19 best practices. Ensure consistent file structure, component patterns, and data fetching strategies.

---

## Project Structure

### Top-Level Folders

| Folder           | Purpose                             |
| ---------------- | ----------------------------------- |
| `src/app`        | App Router (routes, layouts, pages) |
| `src/components` | Shared React components             |
| `src/lib`        | Utility functions, API clients      |
| `src/hooks`      | Custom React hooks                  |
| `src/stores`     | Zustand state stores                |
| `src/types`      | TypeScript type definitions         |
| `public`         | Static assets                       |

### App Router File Conventions

| File        | Extension | Purpose                                         |
| ----------- | --------- | ----------------------------------------------- |
| `layout`    | `.tsx`    | Shared UI wrapper (persists across navigations) |
| `page`      | `.tsx`    | Unique route UI (publicly accessible)           |
| `loading`   | `.tsx`    | Loading UI (Suspense fallback)                  |
| `error`     | `.tsx`    | Error UI (Error Boundary)                       |
| `not-found` | `.tsx`    | 404 UI                                          |
| `route`     | `.ts`     | API endpoint                                    |
| `template`  | `.tsx`    | Re-rendered layout on navigation                |
| `default`   | `.tsx`    | Parallel route fallback                         |

```typescript
// ✅ DO: Proper file structure
src/app/
├── layout.tsx              // Root layout (required)
├── page.tsx                // Home page (/)
├── loading.tsx             // Global loading state
├── error.tsx               // Global error boundary
├── not-found.tsx           // Global 404
├── [locale]/
│   ├── layout.tsx          // Locale layout
│   ├── page.tsx            // Localized home
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx    // /[locale]/login
│       └── register/
│           └── page.tsx    // /[locale]/register
└── api/
    └── auth/
        └── route.ts        // API: /api/auth

// ❌ DON'T: Wrong patterns
src/app/
├── pages/                  // Don't use pages/ in app router
├── LoginPage.tsx           // Must be inside folder with page.tsx
└── api.ts                  // Must be route.ts inside api/ folder
```

---

## Server vs Client Components

### Default: Server Components

All components in App Router are Server Components by default. Only add `'use client'` when absolutely necessary.

### When to Use Client Components

| Scenario                            | Directive      | Reason                  |
| ----------------------------------- | -------------- | ----------------------- |
| Event handlers (onClick, onChange)  | `'use client'` | Browser events          |
| React hooks (useState, useEffect)   | `'use client'` | Client-side state       |
| Browser APIs (localStorage, window) | `'use client'` | Not available on server |
| Third-party client libraries        | `'use client'` | Library requires DOM    |

```typescript
// ✅ DO: Server Component (default, no directive needed)
// src/app/users/page.tsx
import { getUsers } from '@/lib/api';

export default async function UsersPage() {
  const users = await getUsers(); // Direct data fetching

  return (
    <main>
      <h1>Users</h1>
      <UserList users={users} />
    </main>
  );
}

// ✅ DO: Client Component (only when needed)
// src/components/UserForm.tsx
'use client';

import { useState } from 'react';

export function UserForm() {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}

// ❌ DON'T: Unnecessary 'use client'
'use client'; // Remove - no client features used

export function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}
```

### Component Composition Pattern

Push `'use client'` boundary down to leaf components. Keep parent components as Server Components.

```typescript
// ✅ DO: Server Component with Client islands
// src/app/dashboard/page.tsx (Server Component)
import { getDashboardData } from '@/lib/api';
import { DashboardChart } from '@/components/DashboardChart'; // Client
import { DashboardStats } from '@/components/DashboardStats'; // Server

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main>
      <DashboardStats data={data.stats} />      {/* Server */}
      <DashboardChart chartData={data.chart} /> {/* Client */}
    </main>
  );
}

// ❌ DON'T: Entire page as client component
'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard').then(res => res.json()).then(setData);
  }, []);

  // This loses all Server Component benefits
}
```

---

## Routing Patterns

### Dynamic Routes

```typescript
// Single parameter: [slug]
src/app/blog/[slug]/page.tsx        // /blog/my-post

// Catch-all: [...slug]
src/app/docs/[...slug]/page.tsx     // /docs/a/b/c

// Optional catch-all: [[...slug]]
src/app/shop/[[...slug]]/page.tsx   // /shop, /shop/a, /shop/a/b

// ✅ DO: Access params correctly (Next.js 16+)
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPost({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  return <article>Post: {slug}</article>;
}

// ❌ DON'T: Synchronous params (removed in Next.js 16+)
export default function BlogPost({ params }: { params: { slug: string } }) {
  // This pattern no longer works in Next.js 16+
}
```

### Route Groups

Use parentheses `()` for organization without affecting URL.

```typescript
// ✅ DO: Logical grouping
src/app/
├── (marketing)/
│   ├── layout.tsx          // Marketing layout
│   ├── page.tsx            // / (home)
│   ├── about/
│   │   └── page.tsx        // /about
│   └── pricing/
│       └── page.tsx        // /pricing
├── (dashboard)/
│   ├── layout.tsx          // Dashboard layout (authenticated)
│   ├── overview/
│   │   └── page.tsx        // /overview
│   └── settings/
│       └── page.tsx        // /settings
└── (auth)/
    ├── layout.tsx          // Auth layout (minimal)
    ├── login/
    │   └── page.tsx        // /login
    └── register/
        └── page.tsx        // /register
```

### Private Folders

Use underscore `_` prefix to exclude from routing.

```typescript
// ✅ DO: Private components
src/app/dashboard/
├── _components/
│   ├── DashboardHeader.tsx   // Not a route
│   └── DashboardSidebar.tsx  // Not a route
├── _lib/
│   └── dashboard-utils.ts    // Not a route
├── layout.tsx
└── page.tsx

// These are NOT accessible via URL
```

---

## Data Fetching

### Server Components (Recommended)

```typescript
// ✅ DO: Direct fetch in Server Components
// src/app/users/page.tsx
async function getUsers() {
  const res = await fetch('https://api.example.com/users', {
    cache: 'force-cache',        // Default: cache indefinitely
    // cache: 'no-store',        // Never cache (dynamic)
    // next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  return <UserList users={users} />;
}

// ✅ DO: Parallel data fetching
export default async function DashboardPage() {
  const [users, posts, stats] = await Promise.all([
    getUsers(),
    getPosts(),
    getStats(),
  ]);

  return (
    <>
      <UserSection users={users} />
      <PostSection posts={posts} />
      <StatsSection stats={stats} />
    </>
  );
}
```

### Server Actions

```typescript
// ✅ DO: Server Action in separate file
// src/app/actions/user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // Validate
  if (!name || !email) {
    return { error: 'Name and email are required' };
  }

  // Create user
  await db.user.create({ data: { name, email } });

  // Revalidate and redirect
  revalidatePath('/users');
  redirect('/users');
}

// ✅ DO: Use in form
// src/app/users/new/page.tsx
import { createUser } from '@/app/actions/user';

export default function NewUserPage() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Create User</button>
    </form>
  );
}
```

---

## Layouts and Templates

### Root Layout (Required)

```typescript
// ✅ DO: Proper root layout
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | My App',
    default: 'My App',
  },
  description: 'My application description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

### Nested Layouts

```typescript
// ✅ DO: Dashboard layout with auth check
// src/app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { DashboardNav } from '@/components/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex">
      <DashboardNav user={session.user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

---

## Metadata and SEO

```typescript
// ✅ DO: Static metadata
export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our company',
  openGraph: {
    title: 'About Us',
    description: 'Learn about our company',
    images: ['/og-about.png'],
  },
};

// ✅ DO: Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
```

---

## Loading and Error States

```typescript
// ✅ DO: Loading UI with skeleton
// src/app/users/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export default function UsersLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}

// ✅ DO: Error boundary with recovery
// src/app/users/error.tsx
'use client';

import { useEffect } from 'react';

export default function UsersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## Component Naming Conventions

```typescript
// ✅ DO: Consistent naming
// Files: PascalCase for components
UserProfile.tsx
DashboardHeader.tsx
AuthProvider.tsx

// Components: Match filename
export function UserProfile() {}
export function DashboardHeader() {}
export function AuthProvider() {}

// Hooks: camelCase with use prefix
useAuth.ts       → export function useAuth() {}
useLocalStorage.ts → export function useLocalStorage() {}

// Utils: camelCase
formatDate.ts    → export function formatDate() {}
validateEmail.ts → export function validateEmail() {}

// Types: PascalCase
types/user.ts    → export type User = {}
types/api.ts     → export type ApiResponse<T> = {}

// ❌ DON'T: Inconsistent naming
user-profile.tsx          // Use PascalCase for components
dashboardHeader.tsx       // Capitalize first letter
UseAuth.ts                // Hooks should be camelCase
```

---

## Security: CVE-2025-55182 (Critical)

### Vulnerability Overview

| Item     | Details                              |
| -------- | ------------------------------------ |
| CVE      | CVE-2025-55182 (also CVE-2025-66478) |
| Severity | **CVSS 10.0 (Critical)**             |
| Type     | Remote Code Execution (RCE)          |
| Affected | React Server Components in Next.js   |

### Vulnerable Versions (DO NOT USE)

```typescript
// ❌ NEVER use these versions - Critical RCE vulnerability

// React (vulnerable)
"react": "19.0.0"    // Vulnerable
"react": "19.1.0"    // Vulnerable
"react": "19.1.1"    // Vulnerable
"react": "19.2.0"    // Vulnerable

// Next.js (vulnerable)
"next": "14.3.0-canary.77"  // and later canary releases
"next": "15.x"              // All 15.x versions before patch
"next": "16.x"              // All 16.x versions before patch
```

### Required Minimum Versions

```typescript
// ✅ DO: Use patched versions only

// package.json
{
  "dependencies": {
    "react": "^19.2.1",      // Minimum: 19.2.1
    "react-dom": "^19.2.1",  // Minimum: 19.2.1
    "next": "^16.0.1"        // Check latest patched version
  }
}
```

### Version Check Script

```bash
# Check current versions
pnpm list react react-dom next

# Update to safe versions
pnpm update react react-dom next
```

### AI Agent Security Tasks

When reviewing or creating Next.js projects:

1. **BLOCK** any `package.json` with vulnerable React versions (19.0.0, 19.1.0, 19.1.1, 19.2.0)
2. **BLOCK** any `package.json` with unpatched Next.js 15.x or 16.x
3. **WARN** if React version is below 19.2.1
4. **VERIFY** patched versions before any deployment recommendation

```typescript
// ✅ DO: Validate versions in package.json
const VULNERABLE_REACT = ['19.0.0', '19.1.0', '19.1.1', '19.2.0'];
const MIN_SAFE_REACT = '19.2.1';

// Check before proceeding with any React Server Component work
```

### References

- [Google Cloud Security Bulletin](https://cloud.google.com/blog/ko/products/identity-security/responding-to-cve-2025-55182)
- [Next.js Security Advisory](https://nextjs.org/blog/CVE-2025-66478)
- [React Fix Commit](https://github.com/facebook/react/commit/7dc903cd29dac55efb4424853fd0442fef3a8700)

---

## AI Agent Tasks for Next.js Development

- **[CRITICAL] Check React/Next.js versions for CVE-2025-55182 vulnerability**
- Verify file structure follows App Router conventions
- Check Server vs Client Component boundaries
- Validate `'use client'` usage (only when necessary)
- Ensure proper data fetching patterns (Server Components preferred)
- Check async params/searchParams usage (Next.js 16+ patterns)
- Validate layout and loading/error boundary placement
- Review metadata configuration for SEO
- Suggest component composition improvements
- Identify opportunities to move client components to server

**Reference**: [Next.js Documentation](https://nextjs.org/docs)
