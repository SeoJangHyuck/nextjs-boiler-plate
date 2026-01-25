---
paths: 'src/app/**/*.{ts,tsx}'
---

# Next.js 16+ 컨벤션

## 목적

Next.js App Router 패턴을 공식 문서와 React 19 모범 사례에 따라 표준화합니다. 일관된 파일 구조, 컴포넌트 패턴, 데이터 페칭 전략을 보장합니다.

---

## 프로젝트 구조

### 최상위 폴더

| 폴더             | 목적                                  |
| ---------------- | ------------------------------------- |
| `src/app`        | App Router (라우트, 레이아웃, 페이지) |
| `src/components` | 공유 React 컴포넌트                   |
| `src/lib`        | 유틸리티 함수, API 클라이언트         |
| `src/hooks`      | 커스텀 React 훅                       |
| `src/stores`     | Zustand 상태 스토어                   |
| `src/types`      | TypeScript 타입 정의                  |
| `public`         | 정적 자산                             |

### App Router 파일 규칙

| 파일        | 확장자 | 목적                                |
| ----------- | ------ | ----------------------------------- |
| `layout`    | `.tsx` | 공유 UI 래퍼 (네비게이션 간 유지)   |
| `page`      | `.tsx` | 고유 라우트 UI (공개 접근 가능)     |
| `loading`   | `.tsx` | 로딩 UI (Suspense 폴백)             |
| `error`     | `.tsx` | 에러 UI (Error Boundary)            |
| `not-found` | `.tsx` | 404 UI                              |
| `route`     | `.ts`  | API 엔드포인트                      |
| `template`  | `.tsx` | 네비게이션 시 재렌더링되는 레이아웃 |
| `default`   | `.tsx` | 병렬 라우트 폴백                    |

```typescript
// ✅ DO: 올바른 파일 구조
src/app/
├── layout.tsx              // 루트 레이아웃 (필수)
├── page.tsx                // 홈 페이지 (/)
├── loading.tsx             // 전역 로딩 상태
├── error.tsx               // 전역 에러 바운더리
├── not-found.tsx           // 전역 404
├── [locale]/
│   ├── layout.tsx          // 로케일 레이아웃
│   ├── page.tsx            // 지역화된 홈
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx    // /[locale]/login
│       └── register/
│           └── page.tsx    // /[locale]/register
└── api/
    └── auth/
        └── route.ts        // API: /api/auth

// ❌ DON'T: 잘못된 패턴
src/app/
├── pages/                  // app router에서 pages/ 사용 금지
├── LoginPage.tsx           // page.tsx가 있는 폴더 안에 있어야 함
└── api.ts                  // api/ 폴더 안에 route.ts여야 함
```

---

## 서버 vs 클라이언트 컴포넌트

### 기본: 서버 컴포넌트

App Router의 모든 컴포넌트는 기본적으로 서버 컴포넌트입니다. 꼭 필요할 때만 `'use client'`를 추가하세요.

### 클라이언트 컴포넌트를 사용해야 할 때

| 시나리오                            | 지시어         | 이유                  |
| ----------------------------------- | -------------- | --------------------- |
| 이벤트 핸들러 (onClick, onChange)   | `'use client'` | 브라우저 이벤트       |
| React 훅 (useState, useEffect)      | `'use client'` | 클라이언트 측 상태    |
| 브라우저 API (localStorage, window) | `'use client'` | 서버에서 사용 불가    |
| 서드파티 클라이언트 라이브러리      | `'use client'` | 라이브러리가 DOM 필요 |

```typescript
// ✅ DO: 서버 컴포넌트 (기본, 지시어 불필요)
// src/app/users/page.tsx
import { getUsers } from '@/lib/api';

export default async function UsersPage() {
  const users = await getUsers(); // 직접 데이터 페칭

  return (
    <main>
      <h1>Users</h1>
      <UserList users={users} />
    </main>
  );
}

// ✅ DO: 클라이언트 컴포넌트 (필요할 때만)
// src/components/UserForm.tsx
'use client';

import { useState } from 'react';

export function UserForm() {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출 처리
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">제출</button>
    </form>
  );
}

// ❌ DON'T: 불필요한 'use client'
'use client'; // 제거 - 클라이언트 기능 사용 안 함

export function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}
```

### 컴포넌트 합성 패턴

`'use client'` 경계를 리프 컴포넌트까지 내려보내세요. 부모 컴포넌트는 서버 컴포넌트로 유지하세요.

```typescript
// ✅ DO: 클라이언트 아일랜드가 있는 서버 컴포넌트
// src/app/dashboard/page.tsx (서버 컴포넌트)
import { getDashboardData } from '@/lib/api';
import { DashboardChart } from '@/components/DashboardChart'; // 클라이언트
import { DashboardStats } from '@/components/DashboardStats'; // 서버

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main>
      <DashboardStats data={data.stats} />      {/* 서버 */}
      <DashboardChart chartData={data.chart} /> {/* 클라이언트 */}
    </main>
  );
}

// ❌ DON'T: 전체 페이지를 클라이언트 컴포넌트로
'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard').then(res => res.json()).then(setData);
  }, []);

  // 모든 서버 컴포넌트 이점을 잃음
}
```

---

## 라우팅 패턴

### 동적 라우트

```typescript
// 단일 파라미터: [slug]
src/app/blog/[slug]/page.tsx        // /blog/my-post

// Catch-all: [...slug]
src/app/docs/[...slug]/page.tsx     // /docs/a/b/c

// 선택적 catch-all: [[...slug]]
src/app/shop/[[...slug]]/page.tsx   // /shop, /shop/a, /shop/a/b

// ✅ DO: 파라미터 올바르게 접근 (Next.js 16+)
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPost({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  return <article>Post: {slug}</article>;
}

// ❌ DON'T: 동기식 params (Next.js 16+에서 제거됨)
export default function BlogPost({ params }: { params: { slug: string } }) {
  // 이 패턴은 Next.js 16+에서 더 이상 작동하지 않음
}
```

### 라우트 그룹

URL에 영향을 주지 않고 조직화하려면 괄호 `()`를 사용하세요.

```typescript
// ✅ DO: 논리적 그룹화
src/app/
├── (marketing)/
│   ├── layout.tsx          // 마케팅 레이아웃
│   ├── page.tsx            // / (홈)
│   ├── about/
│   │   └── page.tsx        // /about
│   └── pricing/
│       └── page.tsx        // /pricing
├── (dashboard)/
│   ├── layout.tsx          // 대시보드 레이아웃 (인증됨)
│   ├── overview/
│   │   └── page.tsx        // /overview
│   └── settings/
│       └── page.tsx        // /settings
└── (auth)/
    ├── layout.tsx          // 인증 레이아웃 (최소화)
    ├── login/
    │   └── page.tsx        // /login
    └── register/
        └── page.tsx        // /register
```

### 프라이빗 폴더

라우팅에서 제외하려면 언더스코어 `_` 접두사를 사용하세요.

```typescript
// ✅ DO: 프라이빗 컴포넌트
src/app/dashboard/
├── _components/
│   ├── DashboardHeader.tsx   // 라우트 아님
│   └── DashboardSidebar.tsx  // 라우트 아님
├── _lib/
│   └── dashboard-utils.ts    // 라우트 아님
├── layout.tsx
└── page.tsx

// URL로 접근 불가
```

---

## 데이터 페칭

### 서버 컴포넌트 (권장)

```typescript
// ✅ DO: 서버 컴포넌트에서 직접 fetch
// src/app/users/page.tsx
async function getUsers() {
  const res = await fetch('https://api.example.com/users', {
    cache: 'force-cache',        // 기본: 무한 캐시
    // cache: 'no-store',        // 캐시 안 함 (동적)
    // next: { revalidate: 60 }, // 60초마다 재검증
  });

  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  return <UserList users={users} />;
}

// ✅ DO: 병렬 데이터 페칭
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

### 서버 액션

```typescript
// ✅ DO: 별도 파일에 서버 액션
// src/app/actions/user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // 검증
  if (!name || !email) {
    return { error: 'Name and email are required' };
  }

  // 사용자 생성
  await db.user.create({ data: { name, email } });

  // 재검증 및 리다이렉트
  revalidatePath('/users');
  redirect('/users');
}

// ✅ DO: 폼에서 사용
// src/app/users/new/page.tsx
import { createUser } from '@/app/actions/user';

export default function NewUserPage() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">사용자 생성</button>
    </form>
  );
}
```

---

## 레이아웃과 템플릿

### 루트 레이아웃 (필수)

```typescript
// ✅ DO: 올바른 루트 레이아웃
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

### 중첩 레이아웃

```typescript
// ✅ DO: 인증 체크가 있는 대시보드 레이아웃
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

## 메타데이터와 SEO

```typescript
// ✅ DO: 정적 메타데이터
export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our company',
  openGraph: {
    title: 'About Us',
    description: 'Learn about our company',
    images: ['/og-about.png'],
  },
};

// ✅ DO: 동적 메타데이터
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

## 로딩과 에러 상태

```typescript
// ✅ DO: 스켈레톤이 있는 로딩 UI
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

// ✅ DO: 복구 기능이 있는 에러 바운더리
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
      <h2 className="text-xl font-bold">문제가 발생했습니다!</h2>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        다시 시도
      </button>
    </div>
  );
}
```

---

## 컴포넌트 네이밍 규칙

```typescript
// ✅ DO: 일관된 네이밍
// 파일: 컴포넌트는 PascalCase
UserProfile.tsx
DashboardHeader.tsx
AuthProvider.tsx

// 컴포넌트: 파일명과 일치
export function UserProfile() {}
export function DashboardHeader() {}
export function AuthProvider() {}

// 훅: use 접두사가 붙은 camelCase
useAuth.ts       → export function useAuth() {}
useLocalStorage.ts → export function useLocalStorage() {}

// 유틸: camelCase
formatDate.ts    → export function formatDate() {}
validateEmail.ts → export function validateEmail() {}

// 타입: PascalCase
types/user.ts    → export type User = {}
types/api.ts     → export type ApiResponse<T> = {}

// ❌ DON'T: 일관성 없는 네이밍
user-profile.tsx          // 컴포넌트는 PascalCase 사용
dashboardHeader.tsx       // 첫 글자 대문자
UseAuth.ts                // 훅은 camelCase여야 함
```

---

## 보안: CVE-2025-55182 (치명적)

### 취약점 개요

| 항목   | 세부사항                        |
| ------ | ------------------------------- |
| CVE    | CVE-2025-55182 (CVE-2025-66478) |
| 심각도 | **CVSS 10.0 (치명적)**          |
| 유형   | 원격 코드 실행 (RCE)            |
| 영향   | Next.js의 React 서버 컴포넌트   |

### 취약한 버전 (사용 금지)

```typescript
// ❌ 이 버전들 절대 사용 금지 - 치명적 RCE 취약점

// React (취약)
"react": "19.0.0"    // 취약
"react": "19.1.0"    // 취약
"react": "19.1.1"    // 취약
"react": "19.2.0"    // 취약

// Next.js (취약)
"next": "14.3.0-canary.77"  // 이후 canary 릴리스
"next": "15.x"              // 패치 전 모든 15.x 버전
"next": "16.x"              // 패치 전 모든 16.x 버전
```

### 필수 최소 버전

```typescript
// ✅ DO: 패치된 버전만 사용

// package.json
{
  "dependencies": {
    "react": "^19.2.1",      // 최소: 19.2.1
    "react-dom": "^19.2.1",  // 최소: 19.2.1
    "next": "^16.0.1"        // 최신 패치 버전 확인
  }
}
```

### 버전 확인 스크립트

```bash
# 현재 버전 확인
pnpm list react react-dom next

# 안전한 버전으로 업데이트
pnpm update react react-dom next
```

### AI 에이전트 보안 작업

Next.js 프로젝트 검토 또는 생성 시:

1. 취약한 React 버전 (19.0.0, 19.1.0, 19.1.1, 19.2.0)이 있는 `package.json` **차단**
2. 패치되지 않은 Next.js 15.x 또는 16.x가 있는 `package.json` **차단**
3. React 버전이 19.2.1 미만이면 **경고**
4. 배포 권장 전 패치된 버전 **확인**

```typescript
// ✅ DO: package.json에서 버전 검증
const VULNERABLE_REACT = ['19.0.0', '19.1.0', '19.1.1', '19.2.0'];
const MIN_SAFE_REACT = '19.2.1';

// React 서버 컴포넌트 작업 전 확인
```

### 참조

- [Google Cloud 보안 공지](https://cloud.google.com/blog/ko/products/identity-security/responding-to-cve-2025-55182)
- [Next.js 보안 권고](https://nextjs.org/blog/CVE-2025-66478)
- [React 수정 커밋](https://github.com/facebook/react/commit/7dc903cd29dac55efb4424853fd0442fef3a8700)

---

## AI 에이전트 Next.js 개발 작업

- **[치명적] CVE-2025-55182 취약점에 대해 React/Next.js 버전 확인**
- 파일 구조가 App Router 규칙을 따르는지 확인
- 서버 vs 클라이언트 컴포넌트 경계 확인
- `'use client'` 사용 검증 (필요할 때만)
- 올바른 데이터 페칭 패턴 보장 (서버 컴포넌트 선호)
- async params/searchParams 사용 확인 (Next.js 16+ 패턴)
- 레이아웃과 loading/error 바운더리 배치 검증
- SEO를 위한 메타데이터 설정 검토
- 컴포넌트 합성 개선 제안
- 클라이언트 컴포넌트를 서버로 이동할 기회 식별

**참조**: [Next.js 문서](https://nextjs.org/docs)
