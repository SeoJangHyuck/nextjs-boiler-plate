# Next.js 16 Boilerplate

Next.js 16 기반의 범용 스타터 템플릿입니다.

## 기술 스택

| 분류            | 기술                            | 버전       |
| --------------- | ------------------------------- | ---------- |
| 프레임워크      | Next.js (App Router, Turbopack) | 16.1.4+    |
| 패키지 매니저   | pnpm                            | 10.x       |
| 언어            | TypeScript (strict)             | 5.x        |
| 클라이언트 상태 | Zustand                         | 5.x        |
| 서버 상태       | TanStack Query                  | 5.x        |
| 스타일링        | Tailwind CSS + SCSS             | 4.x        |
| 검증            | Zod                             | 4.x        |
| 다국어          | next-intl                       | 4.x        |
| 인증            | NextAuth.js                     | 5.x (beta) |
| 단위 테스트     | Vitest + React Testing Library  | 4.x        |
| E2E 테스트      | Playwright                      | 1.x        |
| 린트            | ESLint (flat config)            | 9.x        |
| 포맷            | Prettier                        | 3.x        |
| Git Hooks       | Husky + lint-staged             | 9.x        |

## 시작하기

### 요구사항

- Node.js 22+
- pnpm 10+
- nvm (권장)

### 설치

```bash
# nvm으로 Node.js 버전 설정 (권장)
nvm use

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local

# 개발 서버 시작
pnpm dev
```

개발 서버가 시작되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 스크립트

```bash
# 개발
pnpm dev              # 개발 서버 시작 (Turbopack)

# 빌드
pnpm build            # 기본 빌드
pnpm build:dev        # dev 환경 빌드
pnpm build:qa         # qa 환경 빌드
pnpm build:staging    # staging 환경 빌드
pnpm build:live       # live 환경 빌드

# 프로덕션
pnpm start            # 프로덕션 서버 시작

# 코드 품질
pnpm lint             # ESLint 검사
pnpm lint:fix         # ESLint 자동 수정
pnpm format           # Prettier 포맷팅
pnpm format:check     # Prettier 검사
pnpm type-check       # TypeScript 타입 검사

# 테스트
pnpm test             # Vitest 워치 모드
pnpm test:run         # Vitest 단일 실행
pnpm test:e2e         # Playwright E2E 테스트
pnpm test:e2e:ui      # Playwright UI 모드
```

## 프로젝트 구조

```
src/
├── app/
│   ├── [locale]/              # 다국어 라우팅
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   └── api/
│       └── auth/[...nextauth]/ # NextAuth API 라우트
├── components/
│   ├── providers.tsx          # React Query Provider
│   └── ui/                    # 공통 UI 컴포넌트
├── hooks/                     # 커스텀 훅
├── lib/
│   ├── api/                   # API 클라이언트 + TanStack Query
│   ├── auth/                  # NextAuth 설정
│   ├── i18n/                  # next-intl 설정
│   └── validations/           # Zod 스키마
├── stores/                    # Zustand 스토어
├── styles/
│   ├── globals.scss           # 글로벌 스타일, 변수, 믹스인
│   └── tailwind.css           # Tailwind 진입점
├── types/                     # 공통 타입 정의
├── env.ts                     # 환경 변수 검증
└── middleware.ts              # 다국어 미들웨어
```

## 환경 설정

### 배포 환경

| 환경      | 설명           |
| --------- | -------------- |
| `dev`     | 로컬 개발 환경 |
| `qa`      | QA 테스트 환경 |
| `staging` | 스테이징 환경  |
| `live`    | 프로덕션 환경  |

### 환경 변수

```bash
# .env.local 또는 .env.[환경]

# 환경 설정 (dev | qa | staging | live)
NEXT_PUBLIC_ENV=dev

# 클라이언트 노출 가능
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 서버 전용 (시크릿)
AUTH_SECRET=your-auth-secret-key-min-32-chars
```

### 환경별 유틸리티

```typescript
import { isDev, isQA, isStaging, isLive, isProduction } from '@/env';

if (isDev()) {
  // 개발 환경에서만 실행
}

if (isProduction()) {
  // staging 또는 live 환경에서 실행
}
```

## 다국어 (i18n)

한국어(`ko`)와 영어(`en`)를 지원합니다.

### 번역 파일

```
messages/
├── ko.json    # 한국어
└── en.json    # 영어
```

### 사용법

```tsx
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('home');
  return <h1>{t('welcome')}</h1>;
}
```

### 네비게이션

```tsx
import { Link, useRouter } from '@/lib/i18n/navigation';

// 링크
<Link href="/about" locale="en">
  English
</Link>;

// 프로그래밍 방식
const router = useRouter();
router.push('/about', { locale: 'ko' });
```

## 상태 관리

### Zustand (클라이언트 상태)

```typescript
import { useUIStore } from '@/stores';

const { theme, setTheme } = useUIStore();
```

### TanStack Query (서버 상태)

```typescript
import { useApiQuery, useApiMutation } from '@/lib/api';

// 조회
const { data, isLoading } = useApiQuery(['users'], '/api/users');

// 변경
const mutation = useApiMutation('/api/users', 'post');
```

## 인증 (NextAuth)

인증 구조만 준비되어 있습니다. 실제 구현 시:

1. `src/lib/auth/auth.config.ts`에서 provider 설정
2. 로그인/회원가입 페이지 구현
3. `src/lib/validations/auth.ts`의 스키마 활용

## 테스트

### 단위 테스트 (Vitest)

```bash
pnpm test:run
```

테스트 파일: `tests/unit/**/*.test.ts`

### E2E 테스트 (Playwright)

```bash
# 설치 (최초 1회)
pnpm exec playwright install

# 실행
pnpm test:e2e
```

테스트 파일: `tests/e2e/**/*.spec.ts`

## CI/CD

### GitHub Actions

| 워크플로우   | 트리거                   | 설명                               |
| ------------ | ------------------------ | ---------------------------------- |
| `ci.yml`     | push, PR                 | 린트, 타입 체크, 단위 테스트, 빌드 |
| `e2e.yml`    | push (main), PR (main)   | E2E 테스트                         |
| `deploy.yml` | 수동 (workflow_dispatch) | 환경별 배포                        |

### 수동 배포

GitHub Actions > Deploy > Run workflow에서 환경을 선택하여 배포할 수 있습니다.

## 코드 품질

### 커밋 전 자동 검사 (Husky + lint-staged)

커밋 시 자동으로 다음 검사가 실행됩니다:

- TypeScript/TSX: Prettier 포맷팅 + ESLint 검사
- JSON/MD/SCSS/CSS: Prettier 포맷팅

### ESLint 설정

`eslint.config.js`에서 flat config 방식으로 설정되어 있습니다.

### Prettier 설정

`prettier.config.js`에서 설정되어 있으며, Tailwind CSS 클래스 자동 정렬을 지원합니다.

## 라이선스

MIT
