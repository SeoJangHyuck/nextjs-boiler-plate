# Next.js 16 Boilerplate

Next.js 16 기반의 범용 스타터 템플릿입니다.

## 기술 스택

| 분류            | 기술                            | 버전    |
| --------------- | ------------------------------- | ------- |
| 프레임워크      | Next.js (App Router, Turbopack) | 16.1.4+ |
| 패키지 매니저   | pnpm                            | 10.x    |
| 언어            | TypeScript (strict)             | 5.x     |
| 클라이언트 상태 | Zustand                         | 5.x     |
| 서버 상태       | TanStack Query                  | 5.x     |
| 스타일링        | Tailwind CSS + SCSS             | 4.x     |
| 검증            | Zod                             | 4.x     |
| 다국어          | next-intl                       | 4.x     |
| 인증            | next-auth (OIDC 연동 예정)      | 5.x     |
| 단위 테스트     | Vitest + React Testing Library  | 4.x     |
| E2E 테스트      | Playwright                      | 1.x     |
| 린트            | ESLint (flat config)            | 9.x     |
| 포맷            | Prettier                        | 3.x     |
| Git Hooks       | Husky + lint-staged             | 9.x     |

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
pnpm build:live       # live 환경 빌드

# 프로덕션
pnpm start            # 프로덕션 서버 시작

# 코드 품질
pnpm lint             # ESLint 검사
pnpm lint:fix         # ESLint 자동 수정
pnpm lint:css         # Stylelint 검사
pnpm lint:css:fix     # Stylelint 자동 수정
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
│   │   ├── not-found.tsx
│   │   └── login/             # 로그인 페이지
│   └── api/
│       └── auth/
│           └── [...nextauth]/ # next-auth API 라우트
├── components/
│   ├── providers.tsx          # React Query Provider
│   └── ui/                    # 공통 UI 컴포넌트
├── hooks/                     # 커스텀 훅
├── lib/
│   ├── api/                   # API 클라이언트 + TanStack Query
│   ├── i18n/                  # next-intl 설정
│   ├── auth/                  # next-auth 설정
│   └── validations/           # Zod 스키마
├── stores/                    # Zustand 스토어
├── styles/
│   ├── globals.scss           # 글로벌 스타일, 변수, 믹스인
│   └── tailwind.css           # Tailwind 진입점
├── types/                     # 공통 타입 정의
├── env.ts                     # 환경 변수 검증
└── middleware.ts              # 다국어 미들웨어

.agents/
└── skills/                    # AI 에이전트 스킬 정의
    ├── vercel-composition-patterns/   # React 컴포지션 패턴
    ├── vercel-react-best-practices/   # React/Next.js 성능 최적화
    ├── vercel-react-native-skills/    # React Native 모바일 최적화
    └── web-design-guidelines/         # 웹 디자인 가이드라인

.claude/
├── CLAUDE.md                  # Claude Code 프로젝트 가이드라인
├── rules/                     # 코드 컨벤션 규칙
└── skills/                    # 에이전트 스킬 (→ .agents/skills 심볼릭 링크)
```

## 환경 설정

### 배포 환경

| 환경      | 설명          |
| --------- | ------------- |
| `dev`     | 개발 환경     |
| `qa`      | QA 환경       |
| `staging` | 스테이징 환경 |
| `live`    | 프로덕션 환경 |

### 환경 변수

```bash
# .env

# 환경 설정 (dev | qa | staging | live)
NEXT_PUBLIC_ENV=dev

# 클라이언트 노출 가능
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# next-auth (OIDC 연동 시 설정)
# AUTH_SECRET=your-auth-secret
```

### 환경별 유틸리티

```typescript
import { isDev, isLive } from '@/env';

if (isDev()) {
  // 개발 환경에서만 실행
}

if (isLive()) {
  // live 환경에서 실행
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

## 인증 (next-auth)

next-auth를 사용하여 인증을 처리합니다. OIDC SDK 연동 예정입니다.

> **TODO:** 현재 인증 기능은 구현되어 있지 않습니다. OIDC 연동 시 구현 예정입니다.

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
- JSON/MD: Prettier 포맷팅
- SCSS/CSS: Stylelint 검사 + Prettier 포맷팅

### ESLint 설정

`eslint.config.js`에서 flat config 방식으로 설정되어 있습니다.

### Stylelint 설정

`stylelint.config.js`에서 SCSS/CSS 스타일 규칙이 설정되어 있습니다.

### Prettier 설정

`prettier.config.js`에서 설정되어 있으며, Tailwind CSS 클래스 자동 정렬을 지원합니다.

## AI 에이전트 스킬

Vercel 엔지니어링 기반의 AI 에이전트 스킬이 `.agents/skills/`에 정의되어 있으며, `.claude/skills/`에서 심볼릭 링크로 연결됩니다.

| 스킬                          | 설명                                            |
| ----------------------------- | ----------------------------------------------- |
| `vercel-react-best-practices` | React/Next.js 성능 최적화 패턴 (렌더링, 번들링) |
| `vercel-composition-patterns` | React 컴포지션 패턴 (Compound Components 등)    |
| `vercel-react-native-skills`  | React Native/Expo 모바일 앱 최적화              |
| `web-design-guidelines`       | 웹 인터페이스 디자인 및 접근성 가이드라인       |

## 라이선스

MIT
