# Next.js 16 Boilerplate 설계 문서

## 개요

다양한 프로젝트에서 재사용 가능한 범용 Next.js 스타터 템플릿입니다.

### 기술 스택

| 분류            | 기술                            | 버전    |
| --------------- | ------------------------------- | ------- |
| 프레임워크      | Next.js (App Router, Turbopack) | 16.1.4+ |
| 패키지 매니저   | pnpm                            | latest  |
| 언어            | TypeScript (strict)             | 5.x     |
| 클라이언트 상태 | Zustand                         | latest  |
| 서버 상태       | TanStack Query                  | v5      |
| 스타일링        | Tailwind CSS + SCSS             | v4      |
| 검증            | Zod                             | latest  |
| 다국어          | next-intl                       | latest  |
| 인증            | NextAuth.js                     | v5      |
| 단위 테스트     | Vitest + React Testing Library  | latest  |
| E2E 테스트      | Playwright                      | latest  |
| 린트            | ESLint (flat config)            | v9+     |
| 포맷            | Prettier                        | latest  |
| Git Hooks       | Husky + lint-staged             | latest  |

---

## 폴더 구조

```
nextjs-boiler-plate/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # 린트, 타입체크, 단위 테스트
│       └── e2e.yml                   # Playwright E2E 테스트
├── .husky/
│   └── pre-commit                    # lint-staged 실행
├── public/                           # 정적 에셋
├── src/
│   ├── app/
│   │   ├── [locale]/                 # 다국어 라우팅
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── error.tsx             # 에러 핸들링
│   │   │   ├── loading.tsx
│   │   │   └── not-found.tsx
│   │   └── api/
│   │       └── auth/[...nextauth]/   # NextAuth API 라우트 (구조만)
│   │           └── route.ts
│   ├── components/
│   │   └── ui/                       # 공통 UI 컴포넌트
│   ├── hooks/                        # 공통 커스텀 훅
│   ├── lib/
│   │   ├── api/                      # API 클라이언트 설정
│   │   │   ├── client.ts             # fetch 래퍼
│   │   │   └── hooks.ts              # TanStack Query 훅 패턴
│   │   ├── auth/                     # NextAuth 설정 (구조만)
│   │   │   └── auth.config.ts
│   │   ├── i18n/                     # next-intl 설정
│   │   │   ├── config.ts
│   │   │   └── request.ts
│   │   └── validations/              # Zod 스키마
│   │       ├── auth.ts               # 인증 관련 스키마 예시
│   │       └── index.ts
│   ├── stores/                       # Zustand 스토어
│   │   └── index.ts
│   ├── styles/
│   │   ├── globals.scss              # 글로벌 스타일, 변수, 믹스인
│   │   └── tailwind.css              # Tailwind 진입점
│   ├── types/                        # 공통 타입 정의
│   │   └── index.ts
│   ├── env.ts                        # Zod 환경 변수 검증
│   └── middleware.ts                 # 인증 + 다국어 미들웨어
├── messages/
│   ├── ko.json                       # 한국어 번역
│   └── en.json                       # 영어 번역
├── tests/
│   ├── unit/                         # Vitest 단위 테스트
│   └── e2e/                          # Playwright E2E 테스트
├── .env.example                      # 환경 변수 예시
├── .gitignore
├── .prettierignore
├── eslint.config.js                  # ESLint flat config
├── next.config.ts
├── package.json
├── playwright.config.ts
├── postcss.config.js
├── prettier.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## 주요 설정 및 패턴

### 1. 환경 변수 관리

**`src/env.ts`**: Zod로 환경 변수 타입 검증

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // 클라이언트 노출 가능
  NEXT_PUBLIC_API_URL: z.string().url(),

  // 서버 전용 (시크릿)
  AUTH_SECRET: z.string().min(32),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
});
```

**`.env.local`**: 시크릿 키 관리 (git 제외)

### 2. API 클라이언트 패턴

**`src/lib/api/client.ts`**: fetch 래퍼

```typescript
export const apiClient = {
  get: <T>(url: string) => fetch(url).then((res) => res.json() as T),
  post: <T>(url: string, data: unknown) =>
    fetch(url, { method: 'POST', body: JSON.stringify(data) }).then(
      (res) => res.json() as T
    ),
};
```

**`src/lib/api/hooks.ts`**: TanStack Query 훅 패턴

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// 예시: 데이터 조회 훅
export const useData = (id: string) => {
  return useQuery({
    queryKey: ['data', id],
    queryFn: () => apiClient.get(`/api/data/${id}`),
  });
};
```

### 3. Zustand 스토어 패턴

**`src/stores/index.ts`**: 슬라이스 패턴

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: false,
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      }),
      { name: 'ui-store' }
    )
  )
);
```

### 4. 다국어 패턴 (next-intl)

**`src/lib/i18n/config.ts`**:

```typescript
export const locales = ['ko', 'en'] as const;
export const defaultLocale = 'ko' as const;
export type Locale = (typeof locales)[number];
```

**`src/middleware.ts`**: locale 감지 + 리다이렉트

### 5. 인증 구조 (NextAuth)

> 폴더 구조와 기본 설정만 포함. 실제 기능 구현은 필요 시 추가.

**`src/lib/auth/auth.config.ts`**:

```typescript
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  providers: [
    // TODO: Credentials provider 추가
  ],
  session: { strategy: 'jwt' },
  pages: {
    // TODO: 커스텀 페이지 경로 설정
  },
};
```

**`src/lib/validations/auth.ts`**: 인증 스키마 예시

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });
```

---

## 코드 품질 도구

### ESLint (Flat Config)

**`eslint.config.js`**:

- Next.js, TypeScript, React 권장 규칙
- import 정렬 규칙

### Prettier

**`prettier.config.js`**:

- `prettier-plugin-tailwindcss`: Tailwind 클래스 자동 정렬
- ESLint와 충돌 방지

### Husky + lint-staged

**커밋 전 자동 검사**:

```json
{
  "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{json,md,scss,css}": ["prettier --write"]
}
```

### TypeScript

**`tsconfig.json`**:

- `strict: true`
- 경로 별칭: `@/*` → `src/*`

---

## 테스트

### Vitest (단위 테스트)

**`vitest.config.ts`**:

- React Testing Library 포함
- `tests/unit/` 폴더

### Playwright (E2E 테스트)

**`playwright.config.ts`**:

- `tests/e2e/` 폴더
- CI에서 headless 모드

---

## GitHub Actions CI/CD

### ci.yml

PR/Push 시 실행:

1. pnpm install
2. lint (ESLint)
3. format check (Prettier)
4. type-check (TypeScript)
5. test:run (Vitest)

### e2e.yml

E2E 테스트 워크플로우:

1. pnpm install
2. build
3. Playwright 테스트 (headless)

---

## 스크립트

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "type-check": "tsc --noEmit",
  "test": "vitest",
  "test:run": "vitest run",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "prepare": "husky"
}
```

---

## 초기 설정 가이드

1. **의존성 설치**

   ```bash
   pnpm install
   ```

2. **환경 변수 설정**

   ```bash
   cp .env.example .env.local
   # .env.local 파일 편집
   ```

3. **개발 서버 시작**
   ```bash
   pnpm dev
   ```

---

## 제공되는 예시

- 홈페이지 (다국어 전환 예시)
- 에러 페이지 (error.tsx, not-found.tsx)
- 로딩 상태 (loading.tsx)
- API 클라이언트 훅 패턴 예시
- Zustand 스토어 예시
