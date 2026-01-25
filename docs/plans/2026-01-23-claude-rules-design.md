# Claude Rules & Skills Restructure Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure `.claude/` folder with comprehensive rules and skills based on Toss/Airbnb conventions and official documentation.

**Architecture:** Remove all existing rules, create 4 detailed rule files (nextjs, typescript, scss, git) in English with Korean versions, add 2 skills (review, docs), create CLAUDE.md for behavior guidelines, and provide a comparison document.

**Tech Stack:** Next.js 16+, TypeScript 5+, Tailwind CSS 4 + SCSS, pnpm

**References:**

- [Toss Frontend Clean Code](https://toss.im/slash-21/sessions/3-3)
- [Toss Tech Blog](https://toss.tech/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Next.js Official Docs](https://nextjs.org/docs/app/getting-started/project-structure)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [TypeScript Best Practices 2025](https://dev.to/mitu_mariam/typescript-best-practices-in-2025-57hb)
- [Sass Guidelines](https://sass-guidelin.es/)
- [Tailwind CSS v4 Best Practices](https://medium.com/@sureshdotariya/tailwind-css-4-best-practices-for-enterprise-scale-projects-2025-playbook-bf2910402581)
- [React 19 Best Practices](https://dev.to/jay_sarvaiya_reactjs/react-19-best-practices-write-clean-modern-and-efficient-react-code-1beb)
- [ESLint 9 Flat Config](https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/)

---

## File Structure

```
프로젝트 루트/
├── CLAUDE.md                           # Claude behavior guidelines
├── docs/
│   └── conventions/
│       └── comparison-ko.md            # 이전 vs 신규 비교 문서 (한국어)
└── .claude/
    ├── rules/
    │   ├── nextjs.md                   # Next.js v16+ conventions (~300 lines)
    │   ├── nextjs-ko.md                # Next.js 컨벤션 (한국어)
    │   ├── typescript.md               # TypeScript v5+ conventions (~400 lines)
    │   ├── typescript-ko.md            # TypeScript 컨벤션 (한국어)
    │   ├── scss.md                     # SCSS + Tailwind conventions (~250 lines)
    │   ├── scss-ko.md                  # SCSS 컨벤션 (한국어)
    │   ├── git.md                      # Git workflow conventions (~200 lines)
    │   └── git-ko.md                   # Git 컨벤션 (한국어)
    ├── skills/
    │   ├── review.md                   # Code review skill
    │   └── docs.md                     # Documentation generation skill
    └── settings.local.json             # Keep existing
```

---

## CLAUDE.md Content

```markdown
# Claude Code Guidelines

## Language

Always respond in **Korean (한국어)** when communicating with the user.

## Project Reference

Before working on any task, review:

- `README.md` - Project overview, tech stack, structure, scripts

## Before Writing Code

1. Check which rule files apply to the task:
   - `.claude/rules/nextjs.md` - Next.js components, routing, layouts
   - `.claude/rules/typescript.md` - Type definitions, naming, patterns
   - `.claude/rules/scss.md` - Styling, variables, mixins
   - `.claude/rules/git.md` - Commits, branches, pull requests

2. Review the relevant rules before writing or modifying code.

3. Follow the conventions strictly. When in doubt, ask the user.

## Project Context

- **Framework**: Next.js 16+ (App Router, Turbopack)
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 4 + SCSS
- **Package Manager**: pnpm
- **i18n**: next-intl (ko, en)
- **Auth**: Next Auth
- **State**: Zustand (client), TanStack Query (server)

## Superpowers Integration

When using superpowers skills (brainstorming, writing-plans, executing-plans):

1. **Design Documents**: Save to `docs/plans/YYYY-MM-DD-<topic>-design.md`
2. **Follow project rules**: Apply `.claude/rules/*` conventions when generating code
3. **Commit messages**: Follow `.claude/rules/git.md` conventions
4. **Code style**: Follow `.claude/rules/typescript.md` and `.claude/rules/nextjs.md`

### Plan Document Format

All plan documents must include:

- Goal (1 sentence)
- Architecture (2-3 sentences)
- Tech stack alignment with project
- Step-by-step tasks with exact file paths

## Superpowers Workflow Sequence

When using superpowers commands, you MUST follow this exact order:
```

┌─────────────────────────────────────────────────────────────────┐
│ Step 1: /superpowers:brainstorming │
│ → Explore requirements, discuss design options │
│ → Output: Clear requirements │
├─────────────────────────────────────────────────────────────────┤
│ Step 2: /superpowers:writing-plans │
│ → Create implementation plan │
│ → Output: docs/plans/YYYY-MM-DD-<topic>-design.md │
├─────────────────────────────────────────────────────────────────┤
│ Step 3: /superpowers:executing-plans │
│ → Execute plan task-by-task │
│ → Output: Implemented code │
└─────────────────────────────────────────────────────────────────┘

```

### Rules

1. **Sequential Execution**: Follow steps in order (1 → 2 → 3)
2. **Skip with Existing Output**: If previous step's output file exists, can skip to next step
3. **Check Before Run**: Always verify if required output exists before proceeding

### Skip Conditions

| Command | Required Output | Can Skip If |
|---------|-----------------|-------------|
| `writing-plans` | brainstorming 산출물 | 이전 대화에서 요구사항이 정리된 경우 |
| `executing-plans` | `docs/plans/*-design.md` | 설계 문서가 이미 존재하는 경우 |

```

✅ OK: Skip brainstorming if requirements exist
User: "/superpowers:writing-plans"
Claude: _checks if requirements are clear from context_
→ If yes: proceed with planning
→ If no: "먼저 brainstorming을 통해 요구사항을 정리해주세요."

✅ OK: Skip to execution if plan exists
User: "/superpowers:executing-plans"
Claude: _checks for docs/plans/_-design.md\*
→ If exists: "기존 설계 문서를 기반으로 실행합니다."
→ If not: "먼저 writing-plans로 설계 문서를 작성해주세요."

````

---

## Rule Files Detailed Specifications

### nextjs.md (~300 lines)

**Reference**: [Next.js 16 Docs](https://nextjs.org/docs), [React 19 Best Practices](https://react.dev/reference/rules)

```markdown
---
paths: 'src/app/**/*.{ts,tsx}'
---

# Next.js 16+ Conventions

## Purpose

Standardize Next.js App Router patterns following official documentation and React 19 best practices. Ensure consistent file structure, component patterns, and data fetching strategies.

---

## Project Structure

### Top-Level Folders

| Folder | Purpose |
|--------|---------|
| `src/app` | App Router (routes, layouts, pages) |
| `src/components` | Shared React components |
| `src/lib` | Utility functions, API clients |
| `src/hooks` | Custom React hooks |
| `src/stores` | Zustand state stores |
| `src/types` | TypeScript type definitions |
| `public` | Static assets |

### App Router File Conventions

| File | Extension | Purpose |
|------|-----------|---------|
| `layout` | `.tsx` | Shared UI wrapper (persists across navigations) |
| `page` | `.tsx` | Unique route UI (publicly accessible) |
| `loading` | `.tsx` | Loading UI (Suspense fallback) |
| `error` | `.tsx` | Error UI (Error Boundary) |
| `not-found` | `.tsx` | 404 UI |
| `route` | `.ts` | API endpoint |
| `template` | `.tsx` | Re-rendered layout on navigation |
| `default` | `.tsx` | Parallel route fallback |

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
````

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

// ✅ DO: Access params correctly (Next.js 15+)
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPost({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  return <article>Post: {slug}</article>;
}

// ❌ DON'T: Synchronous params (deprecated in Next.js 15+)
export default function BlogPost({ params }: { params: { slug: string } }) {
  // This pattern is deprecated
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
    <html lang="ko">
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

## AI Agent Tasks for Next.js Development

- Verify file structure follows App Router conventions
- Check Server vs Client Component boundaries
- Validate `'use client'` usage (only when necessary)
- Ensure proper data fetching patterns (Server Components preferred)
- Check async params/searchParams usage (Next.js 15+ patterns)
- Validate layout and loading/error boundary placement
- Review metadata configuration for SEO
- Suggest component composition improvements
- Identify opportunities to move client components to server

**Reference**: [Next.js Documentation](https://nextjs.org/docs)

````

---

### typescript.md (~400 lines)

**Reference**: [Google TS Style Guide](https://google.github.io/styleguide/tsguide.html), [TypeScript 5.x Handbook](https://www.typescriptlang.org/docs/handbook/), [Airbnb JavaScript](https://github.com/airbnb/javascript)

```markdown
---
paths: '**/*.{ts,tsx}'
---

# TypeScript 5+ Conventions

## Purpose

Standardize TypeScript code following Google TypeScript Style Guide, Airbnb JavaScript conventions, and TypeScript 5.x best practices. Ensure type safety, maintainability, and consistent code patterns.

---

## Strict Mode Configuration

Always enable strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
````

---

## Naming Conventions

| Category                   | Convention                           | Example                           |
| -------------------------- | ------------------------------------ | --------------------------------- |
| Variables, Functions       | camelCase                            | `userName`, `calculateTotal()`    |
| Classes, Types, Interfaces | PascalCase                           | `UserProfile`, `ApiResponse`      |
| Constants                  | SCREAMING_SNAKE_CASE                 | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Enum Members               | SCREAMING_SNAKE_CASE                 | `UserRole.ADMIN`                  |
| Type Parameters            | Single uppercase letter              | `T`, `K`, `V`                     |
| Boolean Variables          | `is`, `has`, `should`, `can` prefix  | `isActive`, `hasPermission`       |
| Private Properties         | No prefix (use TypeScript `private`) | `private value` (not `_value`)    |

```typescript
// ✅ DO: Proper naming conventions
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

const isLoggedIn = true;
const hasAdminAccess = false;
const shouldRefetch = true;
const canEdit = user.role === 'admin';

function calculateTotalPrice(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

class UserService {
  private readonly apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
}

interface UserProfile {
  id: string;
  displayName: string;
  emailVerified: boolean;
}

enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

// ❌ DON'T: Wrong naming patterns
const maxRetryCount = 3; // Constants should be UPPER_CASE
const logged_in = true; // Use camelCase
const _privateValue = 'secret'; // No underscore prefix
const valid = true; // Boolean should be isValid
const loading = false; // Boolean should be isLoading

interface user_profile {} // Use PascalCase
enum userRole {
  Admin,
} // PascalCase enum, UPPER_CASE members
```

---

## Type Safety Best Practices

### Avoid `any`, Use `unknown`

```typescript
// ✅ DO: Use unknown with type narrowing
function processValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (value instanceof Error) {
    return value.message;
  }
  return String(value);
}

// ✅ DO: Type guards for complex types
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

function processData(data: unknown) {
  if (isUser(data)) {
    console.log(data.name); // TypeScript knows this is User
  }
}

// ❌ DON'T: Use any
function processAny(value: any) {
  return value.toUpperCase(); // No type safety
}
```

### Nullish Coalescing and Optional Chaining

```typescript
// ✅ DO: Nullish coalescing for null/undefined
const config = userConfig ?? defaultConfig;
const name = user.name ?? 'Anonymous';
const count = data.count ?? 0;

// ✅ DO: Optional chaining for nested access
const city = user?.address?.city;
const firstItem = items?.[0];
const result = callback?.();

// ✅ DO: Combine for safe access with defaults
const displayName = user?.profile?.displayName ?? 'Unknown User';

// ❌ DON'T: Logical OR for null checks (catches falsy values)
const config = userConfig || defaultConfig; // Catches 0, '', false
const name = user.name || 'Anonymous'; // '' becomes 'Anonymous'

// ❌ DON'T: Non-null assertion without validation
const city = user!.address!.city; // Runtime error if null
```

### Type Assertions

```typescript
// ✅ DO: Use 'as' syntax with caution
const element = document.getElementById('app') as HTMLDivElement;

// ✅ DO: Prefer type guards over assertions
function processElement(el: Element | null) {
  if (el instanceof HTMLDivElement) {
    el.style.display = 'none'; // TypeScript knows it's HTMLDivElement
  }
}

// ✅ DO: 'as const' for literal types
const DIRECTIONS = ['north', 'south', 'east', 'west'] as const;
type Direction = (typeof DIRECTIONS)[number]; // 'north' | 'south' | 'east' | 'west'

const CONFIG = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;

// ❌ DON'T: Angle bracket syntax (conflicts with JSX)
const element = <HTMLDivElement>document.getElementById('app');

// ❌ DON'T: Double assertion (usually a code smell)
const value = input as unknown as SpecificType;
```

---

## Type Definitions

### Type vs Interface

**Default to `type`** for consistency. Use `interface` only when needed.

```typescript
// ✅ DO: Use type for object shapes (default choice)
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type UserWithPosts = User & {
  posts: Post[];
};

// ✅ DO: Use type for unions and intersections
type Status = 'pending' | 'active' | 'inactive';
type Result<T> = { success: true; data: T } | { success: false; error: Error };

// ✅ DO: Use interface for declaration merging (rare)
interface Window {
  analytics: AnalyticsClient;
}

// ✅ DO: Use interface for class implementation
interface Repository<T> {
  find(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  async find(id: string): Promise<User | null> { /* ... */ }
  async save(entity: User): Promise<User> { /* ... */ }
  async delete(id: string): Promise<void> { /* ... */ }
}

// ❌ DON'T: Inconsistent type/interface usage
interface User { }      // Use type unless merging needed
type Repository<T> { }  // Use interface for implementation contracts
```

### Utility Types

```typescript
// ✅ DO: Use built-in utility types
type PartialUser = Partial<User>; // All optional
type RequiredUser = Required<User>; // All required
type ReadonlyUser = Readonly<User>; // All readonly
type UserName = Pick<User, 'name' | 'email'>; // Pick specific
type UserWithoutId = Omit<User, 'id'>; // Omit specific
type UserRecord = Record<string, User>; // Key-value map
type NonNullUser = NonNullable<User | null>; // Remove null/undefined

// ✅ DO: Combine utility types
type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
type UpdateUserInput = Partial<Omit<User, 'id'>>;
type UserResponse = Readonly<Pick<User, 'id' | 'name'>>;

// ✅ DO: Create custom utility types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type Nullable<T> = T | null;
type Optional<T> = T | undefined;
```

---

## Function Patterns

### Arrow Functions vs Function Declarations

```typescript
// ✅ DO: Arrow functions for callbacks and short functions
const numbers = [1, 2, 3].map((n) => n * 2);
const isEven = (n: number): boolean => n % 2 === 0;

// ✅ DO: Function declarations for top-level named functions
function calculateDiscount(price: number, percentage: number): number {
  return price * (1 - percentage / 100);
}

// ✅ DO: Explicit return types for public APIs
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount);
}

// ✅ DO: Generic functions
function first<T>(array: T[]): T | undefined {
  return array[0];
}

function groupBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>();
  for (const item of items) {
    const groupKey = item[key];
    const group = map.get(groupKey) ?? [];
    group.push(item);
    map.set(groupKey, group);
  }
  return map;
}
```

### Async Functions

```typescript
// ✅ DO: Always await in async functions (or don't use async)
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return response.json();
}

// ✅ DO: Parallel async operations
async function fetchDashboardData(): Promise<DashboardData> {
  const [users, posts, stats] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchStats(),
  ]);
  return { users, posts, stats };
}

// ✅ DO: Error handling with try-catch
async function safelyFetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await fetchUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// ❌ DON'T: Async without await
async function getMessage(): Promise<string> {
  return 'Hello'; // Remove async keyword
}

// ❌ DON'T: Unhandled promise rejection
function dangerousFetch() {
  fetch('/api/data'); // Missing await or .catch()
}
```

---

## Class Patterns

### Parameter Properties

```typescript
// ✅ DO: Use parameter properties
class UserService {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly logger: Logger,
    private readonly cache: Cache
  ) {}

  async getUser(id: string): Promise<User> {
    const cached = this.cache.get<User>(`user:${id}`);
    if (cached) return cached;

    const user = await this.apiClient.get<User>(`/users/${id}`);
    this.cache.set(`user:${id}`, user);
    return user;
  }
}

// ❌ DON'T: Manual property assignment
class UserService {
  private readonly apiClient: ApiClient;
  private readonly logger: Logger;

  constructor(apiClient: ApiClient, logger: Logger) {
    this.apiClient = apiClient; // Use parameter properties instead
    this.logger = logger;
  }
}
```

### Method Overriding

```typescript
// ✅ DO: Use override keyword (TypeScript 4.3+)
class Animal {
  speak(): void {
    console.log('Some sound');
  }
}

class Dog extends Animal {
  override speak(): void {
    console.log('Woof!');
  }
}

// ❌ DON'T: Override without keyword
class Cat extends Animal {
  speak(): void {
    // Missing override keyword
    console.log('Meow!');
  }
}
```

---

## Import Organization

```typescript
// ✅ DO: Organized imports with type-only imports separated
// 1. Node.js built-ins (if any)
import { readFile } from 'fs/promises';

// 2. External packages
import { z } from 'zod';
import { clsx } from 'clsx';

// 3. Internal aliases
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

// 4. Relative imports
import { Header } from './Header';
import { Footer } from './Footer';

// 5. Type-only imports (separate block)
import type { User, Post } from '@/types';
import type { ComponentProps } from 'react';

// ✅ DO: Consistent import style
import { UserService } from '@/services/UserService'; // Named export
import * as api from '@/lib/api'; // Namespace import
import type { User } from '@/types'; // Type-only import

// ❌ DON'T: Default exports (hard to refactor, inconsistent naming)
export default function UserProfile() {} // Use named export
import UserProfile from './UserProfile'; // Import name can differ

// ❌ DON'T: Mixed type/value imports
import { User, getUserById } from '@/types'; // Separate type imports
```

---

## Error Handling

```typescript
// ✅ DO: Custom error classes
class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ✅ DO: Type-safe error handling
function handleError(error: unknown): void {
  if (error instanceof ValidationError) {
    console.error(`Validation failed on ${error.field}: ${error.message}`);
  } else if (error instanceof ApiError) {
    console.error(`API error ${error.statusCode}: ${error.message}`);
  } else if (error instanceof Error) {
    console.error(`Unexpected error: ${error.message}`);
  } else {
    console.error('Unknown error occurred');
  }
}

// ✅ DO: Result type pattern
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User, ApiError>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return {
        success: false,
        error: new ApiError('Failed to fetch', response.status),
      };
    }
    return { success: true, data: await response.json() };
  } catch (error) {
    return {
      success: false,
      error: new ApiError('Network error', 0),
    };
  }
}

// ❌ DON'T: Throw strings or plain objects
throw 'Something went wrong'; // Use Error objects
throw { message: 'Error' }; // Use Error objects
throw Error('Missing new keyword'); // Use new Error()
```

---

## Constants and Enums

```typescript
// ✅ DO: Object literal with as const for simple constants
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

// ✅ DO: Enum for related constants with behavior
enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

function hasAdminAccess(role: UserRole): boolean {
  return role === UserRole.ADMIN;
}

// ✅ DO: Union types for simple sets
type Status = 'pending' | 'active' | 'inactive' | 'deleted';
type Direction = 'up' | 'down' | 'left' | 'right';

// ❌ DON'T: const enum (tree-shaking issues)
const enum Direction {
  UP,
  DOWN,
}

// ❌ DON'T: Number enums without values (implicit ordering issues)
enum Status {
  PENDING, // 0 - fragile if order changes
  ACTIVE, // 1
}
```

---

## Comments and Documentation

````typescript
// ✅ DO: JSDoc for public APIs
/**
 * Formats a date for display in the user's locale.
 *
 * @param date - The date to format
 * @param locale - The locale code (defaults to 'ko-KR')
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDate(new Date('2024-01-15')); // '2024년 1월 15일'
 * formatDate(new Date('2024-01-15'), 'en-US'); // 'January 15, 2024'
 * ```
 */
export function formatDate(date: Date, locale = 'ko-KR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// ✅ DO: Business logic comments (why, not what)
// 결제 취소는 24시간 이내만 가능 (배송 준비 시작 전)
if (hoursSinceOrder > 24) {
  throw new Error('Cancellation period expired');
}

// 캐시 TTL은 5분으로 설정 (실시간성 vs 서버 부하 균형)
const CACHE_TTL = 5 * 60 * 1000;

// ❌ DON'T: Obvious comments
// Get user by ID
const user = await getUserById(id);

// Increment counter
counter++;

// Initialize empty array
const items: Item[] = [];

// ❌ DON'T: Section comments (use code organization instead)
// ========== Composables ==========
// ---------- Methods ----------
// /* State */
````

---

## AI Agent Tasks for TypeScript Development

- Enforce strict mode compliance (no `any`, proper null checks)
- Validate naming conventions (camelCase, PascalCase, UPPER_CASE)
- Check type-only imports are separated
- Identify magic numbers and suggest constants
- Review error handling patterns (custom errors, Result types)
- Suggest utility types for repeated patterns
- Check async functions have await statements
- Validate parameter properties usage in classes
- Review comment quality (business logic vs obvious)
- Identify opportunities for generics

**Reference**: [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

````

---

### scss.md (~250 lines)

**Reference**: [Sass Guidelines](https://sass-guidelin.es/), [Tailwind CSS v4](https://tailwindcss.com/docs)

```markdown
---
paths: '**/*.{scss,css}'
---

# SCSS & Tailwind CSS 4 Conventions

## Purpose

Standardize styling patterns combining SCSS for custom styles and Tailwind CSS 4 for utility-first styling. Follow Sass Guidelines and Tailwind v4 best practices for maintainable, scalable CSS architecture.

---

## File Structure

````

src/
├── app/
│ └── globals.scss # Global styles, Tailwind imports
├── styles/
│ ├── \_variables.scss # SCSS variables (design tokens)
│ ├── \_mixins.scss # Reusable mixins
│ ├── \_functions.scss # SCSS functions
│ └── \_utils.scss # Forward file for components
└── components/
└── Button/
├── Button.tsx
└── Button.module.scss # Component-specific styles

````

---

## Tailwind CSS 4 Configuration

### CSS-First Tokens with @theme

```css
/* src/app/globals.scss */
@import 'tailwindcss';

@theme {
  /* Colors - Semantic naming */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-secondary: #6b7280;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Background */
  --color-background: #ffffff;
  --color-background-secondary: #f3f4f6;
  --color-surface: #ffffff;

  /* Text */
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;

  /* Spacing scale */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */

  /* Typography */
  --font-sans: 'Pretendard', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Font sizes */
  --text-xs: 0.75rem;       /* 12px */
  --text-sm: 0.875rem;      /* 14px */
  --text-base: 1rem;        /* 16px */
  --text-lg: 1.125rem;      /* 18px */
  --text-xl: 1.25rem;       /* 20px */
  --text-2xl: 1.5rem;       /* 24px */
  --text-3xl: 1.875rem;     /* 30px */

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-full: 9999px;

  /* Z-index scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-tooltip: 600;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: #0f172a;
    --color-background-secondary: #1e293b;
    --color-surface: #1e293b;
    --color-text-primary: #f8fafc;
    --color-text-secondary: #94a3b8;
  }
}
````

---

## Naming Conventions

### SCSS Variables

```scss
// ✅ DO: Kebab-case, semantic naming
$color-primary: #3b82f6;
$color-text-primary: #111827;
$spacing-md: 1rem;
$font-size-base: 1rem;
$border-radius-md: 0.375rem;
$z-index-modal: 500;

// ✅ DO: Group related variables
// Colors
$color-primary: #3b82f6;
$color-primary-light: #60a5fa;
$color-primary-dark: #2563eb;

// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;

// ❌ DON'T: Descriptive naming, camelCase
$blue: #3b82f6; // Use semantic name
$primaryColor: #3b82f6; // Use kebab-case
$medium_spacing: 1rem; // Use kebab-case
```

### CSS Classes

```scss
// ✅ DO: BEM methodology for component styles
.card {
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);

  &__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  &__title {
    font-size: var(--text-lg);
    font-weight: 600;
  }

  &__body {
    margin-top: var(--spacing-md);
  }

  &--featured {
    border: 2px solid var(--color-primary);
  }

  &--compact {
    padding: var(--spacing-sm);
  }
}

// ❌ DON'T: Non-descriptive or inconsistent naming
.card1 {
}
.cardHeader {
} // Use BEM: card__header
.card-header-title {
} // Use BEM: card__title
```

---

## Nesting Guidelines

**Maximum 3 levels of nesting** to maintain readability.

```scss
// ✅ DO: Limited nesting (max 3 levels)
.navigation {
  display: flex;

  &__item {
    padding: var(--spacing-sm) var(--spacing-md);

    &:hover {
      background-color: var(--color-background-secondary);
    }

    &--active {
      color: var(--color-primary);
    }
  }
}

// ✅ DO: Pseudo-classes and pseudo-elements in nesting
.button {
  &:hover {
  }
  &:focus {
  }
  &:active {
  }
  &:disabled {
  }
  &::before {
  }
  &::after {
  }
}

// ❌ DON'T: Deep nesting (4+ levels)
.page {
  .section {
    .container {
      .card {
        .title {
          // Too deep!
          .icon {
          } // Way too deep!
        }
      }
    }
  }
}
```

---

## Mixins

```scss
// ✅ DO: Focused, reusable mixins
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin truncate($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@mixin responsive($breakpoint) {
  @if $breakpoint == sm {
    @media (min-width: 640px) {
      @content;
    }
  } @else if $breakpoint == md {
    @media (min-width: 768px) {
      @content;
    }
  } @else if $breakpoint == lg {
    @media (min-width: 1024px) {
      @content;
    }
  } @else if $breakpoint == xl {
    @media (min-width: 1280px) {
      @content;
    }
  }
}

// Usage
.card {
  @include flex-center;

  &__title {
    @include truncate(2);
  }

  @include responsive(md) {
    flex-direction: row;
  }
}

// ❌ DON'T: Overly complex or single-use mixins
@mixin card-with-shadow-and-border-and-hover {
  // Too specific, not reusable
}
```

---

## Tailwind Integration

### When to Use Tailwind vs SCSS

| Use Tailwind                           | Use SCSS                   |
| -------------------------------------- | -------------------------- |
| Layout utilities (flex, grid, spacing) | Complex animations         |
| Common styling (colors, typography)    | Component-specific styles  |
| Responsive design                      | Styles with calculations   |
| State variants (hover, focus)          | BEM component architecture |

### @apply Usage (Sparingly)

```scss
// ✅ DO: @apply for repeated utility patterns
.btn {
  @apply rounded-md px-4 py-2 font-medium transition-colors;

  &--primary {
    @apply bg-primary hover:bg-primary-hover text-white;
  }

  &--secondary {
    @apply bg-secondary hover:bg-secondary/80 text-white;
  }
}

// ✅ DO: Prefer inline Tailwind for simple cases
// In TSX:
<button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">
  Click me
</button>

// ❌ DON'T: Overuse @apply (defeats the purpose of utility-first)
.wrapper {
  @apply flex min-h-screen flex-col items-center justify-center;
  @apply bg-gray-100 dark:bg-gray-900;
  @apply p-4 md:p-8 lg:p-12;
}
// Just use inline classes instead
```

### Dynamic Classes with clsx/cn

```typescript
// ✅ DO: Use clsx or cn for conditional classes
import { clsx } from 'clsx';

function Button({ variant, size, className }: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-md font-medium transition-colors',
        {
          'bg-primary text-white hover:bg-primary-hover': variant === 'primary',
          'bg-secondary text-white': variant === 'secondary',
          'border border-gray-300 bg-white': variant === 'outline',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
    >
      {children}
    </button>
  );
}

// ❌ DON'T: String concatenation for classes
className={`px-4 py-2 ${variant === 'primary' ? 'bg-primary' : 'bg-secondary'}`}

// ❌ DON'T: Dynamic class construction (breaks tree-shaking)
className={`bg-${color}-500`}  // Tailwind can't detect this
```

---

## Responsive Design

### Mobile-First Approach

```scss
// ✅ DO: Mobile-first with min-width
.container {
  padding: var(--spacing-sm); // Mobile default

  @include responsive(md) {
    padding: var(--spacing-md); // Tablet+
  }

  @include responsive(lg) {
    padding: var(--spacing-lg); // Desktop+
  }
}

// ✅ DO: Tailwind responsive prefixes (mobile-first)
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl">Title</h1>
</div>

// ❌ DON'T: Desktop-first with max-width
.container {
  padding: 2rem;

  @media (max-width: 768px) {
    // Avoid this pattern
    padding: 1rem;
  }
}
```

---

## Z-Index Management

```scss
// ✅ DO: Use z-index scale from design tokens
.dropdown {
  z-index: var(--z-dropdown); // 100
}

.header {
  z-index: var(--z-sticky); // 200
}

.modal-backdrop {
  z-index: var(--z-modal-backdrop); // 400
}

.modal {
  z-index: var(--z-modal); // 500
}

.tooltip {
  z-index: var(--z-tooltip); // 600
}

// ❌ DON'T: Arbitrary z-index values
.dropdown {
  z-index: 9999;
} // Use scale
.modal {
  z-index: 10000;
} // Use scale
```

---

## Module SCSS

```scss
// ✅ DO: Component module styles
// src/components/Card/Card.module.scss
.card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);

  &__header {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
  }

  &__body {
    padding: var(--spacing-md);
  }
}

// Usage in TSX
import styles from './Card.module.scss';

function Card({ title, children }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.card__header}>{title}</div>
      <div className={styles.card__body}>{children}</div>
    </div>
  );
}
```

---

## Performance Best Practices

```scss
// ✅ DO: Use modern CSS features
.card {
  // CSS variables for dynamic values
  --card-padding: var(--spacing-md);
  padding: var(--card-padding);

  // Container queries (when supported)
  @container (min-width: 400px) {
    flex-direction: row;
  }
}

// ✅ DO: Avoid expensive selectors
.button {
} // Good: class selector
[data-active] {
} // OK: attribute selector

// ❌ DON'T: Expensive selectors
* {
} // Universal selector
div > span > a {
} // Deep descendant
[class*='btn'] {
} // Partial attribute match

// ✅ DO: Use @use instead of @import
@use '../styles/variables' as vars;
@use '../styles/mixins' as mix;

.component {
  color: vars.$color-primary;
  @include mix.flex-center;
}

// ❌ DON'T: @import (deprecated)
@import '../styles/variables';
```

---

## AI Agent Tasks for SCSS Development

- Validate naming conventions (kebab-case, BEM)
- Check nesting depth (max 3 levels)
- Ensure semantic color naming
- Verify z-index uses scale tokens
- Review @apply usage (should be minimal)
- Check responsive patterns (mobile-first)
- Suggest mixin extraction for repeated patterns
- Validate @use over @import
- Review dynamic class patterns (clsx usage)

**Reference**: [Sass Guidelines](https://sass-guidelin.es/), [Tailwind CSS v4](https://tailwindcss.com/docs)

````

---

### git.md (~200 lines)

**Reference**: [Conventional Commits](https://www.conventionalcommits.org/), [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

(Existing git.md content is already comprehensive - keep as is with minor enhancements)

---

## Skills

### review.md

```markdown
---
name: review
description: Code review with P1/P2/P3 priority system following project conventions
user-invocable: true
---

# Code Review Skill

## Usage

````

/review # Review all staged changes
/review src/app # Review specific directory
/review src/components/Button.tsx # Review specific file

````

## Process

1. **Identify Scope**
   - Determine which files are being reviewed
   - Match files to relevant rule files

2. **Load Rules**
   - `.claude/rules/nextjs.md` for App Router patterns
   - `.claude/rules/typescript.md` for type safety
   - `.claude/rules/scss.md` for styling conventions
   - `.claude/rules/git.md` for commit conventions

3. **Review Categories**

   **P1 (Must Fix - Request Changes)**
   - Security vulnerabilities (XSS, injection, etc.)
   - Type safety violations (`any` usage, missing null checks)
   - Runtime errors or crashes
   - Convention violations that affect code quality

   **P2 (Should Address - Request Changes)**
   - Performance issues
   - Code duplication
   - Missing error handling
   - Refactoring opportunities

   **P3 (Suggestion - Approve)**
   - Code style improvements
   - Documentation additions
   - Alternative approaches
   - Knowledge sharing

4. **Output Format**

```markdown
## Code Review Results

### P1 Issues (Must Fix)

#### [File: src/app/users/page.tsx:15]
**Issue**: Using `any` type
**Rule**: typescript.md - Type Safety
**Fix**:
\`\`\`typescript
// Before
function processData(data: any) { ... }

// After
function processData(data: unknown) {
  if (isUserData(data)) { ... }
}
\`\`\`

### P2 Issues (Should Address)

#### [File: src/components/UserList.tsx:42]
**Issue**: Missing error boundary for async data
**Rule**: nextjs.md - Error States
**Suggestion**: Add error.tsx in the route segment

### P3 Suggestions

#### [File: src/lib/utils.ts:23]
**Suggestion**: Consider using `as const` for the options array
````

## Checklist

- [ ] Type safety (no `any`, proper null handling)
- [ ] Server/Client component boundaries
- [ ] Naming conventions (camelCase, PascalCase)
- [ ] Import organization (type-only separated)
- [ ] Error handling patterns
- [ ] Responsive design (mobile-first)
- [ ] Accessibility basics

````

---

### docs.md

```markdown
---
name: docs
description: Generate documentation for components, hooks, and utilities
user-invocable: true
---

# Documentation Generation Skill

## Usage

````

/docs component Button # Document Button component
/docs hook useAuth # Document useAuth hook
/docs util formatDate # Document utility function
/docs api users # Document API route

````

## Process

1. **Read Target File**
   - Parse TypeScript types and interfaces
   - Extract function signatures
   - Identify props, parameters, return types

2. **Generate Documentation**

### Component Template

```markdown
# ComponentName

Brief description of the component's purpose.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variant | `'primary' \| 'secondary'` | No | `'primary'` | Button style variant |
| size | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Button size |
| disabled | `boolean` | No | `false` | Disable button |
| onClick | `() => void` | No | - | Click handler |

## Usage

\`\`\`tsx
import { Button } from '@/components/ui/Button';

// Basic usage
<Button>Click me</Button>

// With props
<Button variant="secondary" size="lg" onClick={handleClick}>
  Submit
</Button>

// Disabled state
<Button disabled>Disabled</Button>
\`\`\`

## Accessibility

- Uses `button` element with proper role
- Supports keyboard navigation
- Includes focus states

## Related

- [ButtonGroup](./ButtonGroup.md)
- [IconButton](./IconButton.md)
````

### Hook Template

```markdown
# useHookName

Brief description of the hook's purpose.

## Signature

\`\`\`typescript
function useHookName(options?: Options): ReturnType
\`\`\`

## Parameters

| Parameter | Type      | Required | Description           |
| --------- | --------- | -------- | --------------------- |
| options   | `Options` | No       | Configuration options |

## Returns

| Property  | Type             | Description      |
| --------- | ---------------- | ---------------- |
| data      | `T \| undefined` | Fetched data     |
| isLoading | `boolean`        | Loading state    |
| error     | `Error \| null`  | Error if any     |
| refetch   | `() => void`     | Refetch function |

## Usage

\`\`\`tsx
import { useAuth } from '@/hooks/useAuth';

function ProfilePage() {
const { user, isLoading, signOut } = useAuth();

if (isLoading) return <Loading />;
if (!user) return <Redirect to="/login" />;

return (

<div>
<h1>Welcome, {user.name}</h1>
<button onClick={signOut}>Sign Out</button>
</div>
);
}
\`\`\`
```

## Output Location

- Components: `docs/components/{ComponentName}.md`
- Hooks: `docs/hooks/{hookName}.md`
- Utilities: `docs/utils/{utilName}.md`
- API: `docs/api/{endpoint}.md`

````

---

## Comparison Document (docs/conventions/comparison-ko.md)

```markdown
# 이전 vs 신규 컨벤션 비교

## 개요

이 문서는 기존 `.claude/rules/` 구조와 새로운 구조의 차이점을 설명합니다.

---

## 구조 변경

### 이전 구조
````

.claude/rules/
├── language/
│ └── typescript.md # 486줄
├── styling/
│ └── scss.md # 74줄
├── testing/
│ └── vitest.md # 15줄
└── workflow/
└── git.md # 290줄

```

### 신규 구조
```

.claude/
├── rules/
│ ├── nextjs.md # ~300줄 (신규)
│ ├── nextjs-ko.md # 한국어 버전
│ ├── typescript.md # ~400줄 (확장)
│ ├── typescript-ko.md # 한국어 버전
│ ├── scss.md # ~250줄 (확장)
│ ├── scss-ko.md # 한국어 버전
│ ├── git.md # ~200줄 (유지)
│ └── git-ko.md # 한국어 버전
└── skills/
├── review.md # 신규 스킬
└── docs.md # 신규 스킬

```

---

## TypeScript 컨벤션 변경

### 추가된 내용

| 항목 | 이전 | 신규 |
|------|------|------|
| Strict Mode 설정 | 간략 | tsconfig.json 전체 옵션 상세 설명 |
| Type vs Interface | 언급만 | 명확한 사용 기준과 예제 |
| Utility Types | 기본 언급 | 조합 패턴, 커스텀 유틸리티 타입 |
| Result 패턴 | 없음 | 에러 처리를 위한 Result 타입 패턴 |
| Generic 함수 | 없음 | 제네릭 함수 작성 가이드 |
| Class 패턴 | 기본 | Parameter properties, override 키워드 |

### 개선된 내용

| 항목 | 이전 | 신규 |
|------|------|------|
| 네이밍 컨벤션 | 텍스트 설명 | 표 형식 + 예제 |
| 타입 안전성 | 기본 규칙 | Type guard, Type narrowing 예제 |
| 에러 처리 | 기본 패턴 | 커스텀 에러 클래스, Result 패턴 |
| Import 조직화 | 규칙만 | 순서별 그룹핑 예제 |

---

## SCSS 컨벤션 변경

### 추가된 내용

| 항목 | 이전 | 신규 |
|------|------|------|
| Tailwind v4 @theme | 없음 | CSS-first 토큰 설정 |
| Design Tokens | 변수만 언급 | 전체 토큰 시스템 (색상, 간격, 타이포그래피, z-index) |
| Mixin 예제 | 없음 | flex-center, truncate, responsive 믹스인 |
| clsx/cn 패턴 | 없음 | 동적 클래스 조합 패턴 |
| Module SCSS | 없음 | 컴포넌트 모듈 스타일 가이드 |

### 개선된 내용

| 항목 | 이전 | 신규 |
|------|------|------|
| 네이밍 | 간략 | BEM 방법론 상세 예제 |
| 네스팅 | "3레벨 제한" 언급 | 구체적인 좋은/나쁜 예제 |
| @apply 사용 | 없음 | 사용 기준과 예제 |
| 반응형 디자인 | 언급만 | 모바일 퍼스트 상세 가이드 |

---

## Next.js 컨벤션 (신규)

### 추가된 내용

- **프로젝트 구조**: App Router 파일 컨벤션 전체
- **Server vs Client Components**: 사용 기준 표, 컴포지션 패턴
- **라우팅 패턴**: 동적 라우트, 라우트 그룹, 프라이빗 폴더
- **데이터 페칭**: Server Components fetch, Server Actions
- **레이아웃/템플릿**: 중첩 레이아웃, 인증 체크 패턴
- **메타데이터**: Static/Dynamic metadata 설정
- **로딩/에러 상태**: Skeleton, Error boundary 패턴

---

## Git 컨벤션 변경

| 항목 | 이전 | 신규 |
|------|------|------|
| 커밋 메시지 | 상세 | 동일 (유지) |
| PR 가이드라인 | 상세 | 동일 (유지) |
| 코드 리뷰 | P1/P2/P3 시스템 | 동일 (유지) |
| AI Agent 태스크 | 상세 | 동일 (유지) |

---

## Skills (신규)

### /review

**목적**: 코드 리뷰 자동화

**기능**:
- 스테이징된 변경사항 또는 특정 파일/디렉토리 리뷰
- 관련 규칙 파일 자동 로드
- P1/P2/P3 우선순위 시스템으로 피드백 분류
- 수정 코드 제안 포함

### /docs

**목적**: 문서 자동 생성

**기능**:
- 컴포넌트 Props 문서화
- Hook 시그니처 및 반환값 문서화
- 유틸리티 함수 문서화
- API 라우트 문서화

---

## 참고 자료 추가

### 이전
- 일부 ESLint 규칙 참조

### 신규
- [Toss Frontend Clean Code](https://toss.im/slash-21/sessions/3-3)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Next.js Official Docs](https://nextjs.org/docs)
- [Sass Guidelines](https://sass-guidelin.es/)
- [Tailwind CSS v4 Best Practices](https://tailwindcss.com/docs)
- [React 19 Best Practices](https://react.dev/reference/rules)
- [Conventional Commits](https://www.conventionalcommits.org/)
```

---

## Implementation Tasks

### Task 1: Clean existing rules

**Files:**

- Delete: `.claude/rules/language/` (directory)
- Delete: `.claude/rules/styling/` (directory)
- Delete: `.claude/rules/testing/` (directory)
- Delete: `.claude/rules/workflow/` (directory)

**Step 1: Remove old directories**

```bash
rm -rf .claude/rules/language .claude/rules/styling .claude/rules/testing .claude/rules/workflow
```

**Step 2: Verify removal**

```bash
ls .claude/rules/
```

Expected: Empty or only `settings.local.json`

---

### Task 2: Create CLAUDE.md

**Files:**

- Create: `CLAUDE.md` (project root)

**Step 1: Create CLAUDE.md with behavior guidelines**

Content: See "CLAUDE.md Content" section above (lines 51-149)

**Step 2: Verify file creation**

```bash
head -20 CLAUDE.md
```

---

### Task 3: Create English rule files

**Files:**

- Create: `.claude/rules/nextjs.md`
- Create: `.claude/rules/typescript.md`
- Create: `.claude/rules/scss.md`
- Create: `.claude/rules/git.md`

**Step 1: Create nextjs.md**

Content: See "nextjs.md" section above (lines 155-700)

**Step 2: Create typescript.md**

Content: See "typescript.md" section above (lines 704-1342)

**Step 3: Create scss.md**

Content: See "scss.md" section above (lines 1346-1866)

**Step 4: Create git.md**

Copy from existing `.claude/rules/workflow/git.md` (already comprehensive)

**Step 5: Verify all rule files**

```bash
ls -la .claude/rules/*.md
wc -l .claude/rules/*.md
```

---

### Task 4: Create Korean rule files

**Files:**

- Create: `.claude/rules/nextjs-ko.md`
- Create: `.claude/rules/typescript-ko.md`
- Create: `.claude/rules/scss-ko.md`
- Create: `.claude/rules/git-ko.md`

**Step 1: Create nextjs-ko.md**

Translate nextjs.md to Korean (same structure, Korean descriptions)

**Step 2: Create typescript-ko.md**

Translate typescript.md to Korean

**Step 3: Create scss-ko.md**

Translate scss.md to Korean

**Step 4: Create git-ko.md**

Translate git.md to Korean

**Step 5: Verify Korean rule files**

```bash
ls -la .claude/rules/*-ko.md
```

---

### Task 5: Create comparison document

**Files:**

- Create: `docs/conventions/` (directory)
- Create: `docs/conventions/comparison-ko.md`

**Step 1: Create conventions directory**

```bash
mkdir -p docs/conventions
```

**Step 2: Create comparison-ko.md**

Content: See "Comparison Document" section above (lines 2111-2266)

**Step 3: Verify file creation**

```bash
head -30 docs/conventions/comparison-ko.md
```

---

### Task 6: Create skills

**Files:**

- Create: `.claude/skills/` (directory)
- Create: `.claude/skills/review.md`
- Create: `.claude/skills/docs.md`

**Step 1: Create skills directory**

```bash
mkdir -p .claude/skills
```

**Step 2: Create review.md**

Content: See "review.md" section above (lines 1882-1974)

**Step 3: Create docs.md**

Content: See "docs.md" section above (lines 1980-2107)

**Step 4: Verify skill files**

```bash
ls -la .claude/skills/
```

---

### Task 7: Commit changes

**Step 1: Stage all changes**

```bash
git add -A
```

**Step 2: Review staged changes**

```bash
git status
```

**Step 3: Create commit**

```bash
git commit -m "$(cat <<'EOF'
refactor(claude): restructure rules with detailed conventions

- Remove old nested rule structure
- Add CLAUDE.md with behavior guidelines
- Add 4 detailed rule files (nextjs, typescript, scss, git)
- Add Korean versions of all rules

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

**Step 4: Verify commit**

```bash
git log -1 --oneline
```
