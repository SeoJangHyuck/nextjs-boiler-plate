# Next.js 16 Boilerplate

Next.js 16 기반의 범용 스타터 템플릿입니다.

## 기술 스택

| 분류            | 기술                                   | 버전        |
| --------------- | -------------------------------------- | ----------- |
| 런타임          | Node.js (LTS)                          | 24.22.3     |
| 패키지 매니저   | pnpm                                   | 12.23       |
| 프레임워크      | Next.js (App Router, Cache Components) | 16.4        |
| UI              | React                                  | 19.3        |
| 언어            | TypeScript (strict)                    | 6.0         |
| 클라이언트 상태 | Zustand                                | 5.1         |
| 서버 상태       | TanStack Query                         | 5.108       |
| 스타일링        | Tailwind CSS + SCSS                    | 4.3 + 1.108 |
| 검증            | Zod                                    | 4.6         |
| 다국어          | next-intl                              | 4.15        |
| 단위 테스트     | Vitest + React Testing Library         | 5.1         |
| E2E 테스트      | Playwright + axe (접근성)              | 1.65, 4.14  |
| 린트            | ESLint (flat config), Stylelint        | 10, 18      |
| 포맷            | Prettier                               | 3.10        |
| Git Hooks       | Husky + lint-staged                    | 9, 17       |

## 시작하기

### 요구사항

- [nvm](https://github.com/nvm-sh/nvm) 0.41 이상
- Node.js 24.x (`.nvmrc`)
- pnpm 12.23 이상, 13 미만
- macOS, Linux 또는 WSL

### 설치

```bash
# Node.js 설치 및 전환 (.nvmrc 사용)
nvm install
nvm use

# 처음 한 번: 전환한 Node.js에 pnpm 설치
npm install --global pnpm@12.23.0

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local

# 개발 서버 시작
pnpm dev
```

개발 서버가 시작되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

> 새 터미널을 열 때마다 프로젝트 폴더에서 `nvm use`를 먼저 실행하세요. pnpm 10.34.4 이하는 `packageManager`에 지정된 pnpm 12로 전환하지 못하고 실행에 실패합니다.

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
pnpm check            # 아래 검사와 단위 테스트를 한 번에 실행
pnpm format:check     # Prettier 검사
pnpm format           # Prettier 포맷팅
pnpm lint             # ESLint 검사
pnpm lint:fix         # ESLint 자동 수정
pnpm lint:css         # Stylelint 검사
pnpm lint:css:fix     # Stylelint 자동 수정
pnpm lint:assets      # 이미지·SVG·비디오 이름과 위치 검사
pnpm type-check       # 라우트 타입 생성 + TypeScript 타입 검사

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
│   ├── global-error.tsx       # 루트 레이아웃 오류 화면
│   ├── icon.svg
│   ├── [locale]/              # 다국어 라우팅 (루트 레이아웃)
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── login/             # 로그인 페이지
│   │   └── [...rest]/         # 없는 경로 → 404
│   └── api/
│       └── auth/
│           └── [...nextauth]/ # 인증 API 라우트 (미구현)
├── components/
│   ├── providers.tsx          # React Query Provider
│   └── ui/                    # 공통 UI 컴포넌트 (Spinner 등)
├── hooks/                     # 커스텀 훅
├── lib/
│   ├── api/                   # API 클라이언트 + TanStack Query
│   ├── auth/                  # 인증 설정 (미구현)
│   ├── i18n/                  # next-intl 설정
│   ├── validations/           # Zod 스키마
│   └── utils.ts               # cn() 등 유틸리티
├── stores/                    # Zustand 스토어
├── styles/
│   ├── globals.scss           # 전역 스타일 엔트리
│   ├── tailwind.css           # Tailwind 진입점과 테마 연결
│   └── _*.scss                # 레이어, 토큰, 변수, 믹스인, 함수
├── types/                     # 공통 타입 정의
├── env/                       # 환경 변수 (공개용, 서버 전용, 검증 스키마)
└── proxy.ts                   # 다국어 프록시

public/
├── images/                    # 이미지 (img-*)
├── icons/                     # SVG (icon-*)
├── videos/                    # 비디오 (vid-*)
└── backgrounds/               # 배경 (bg-*)

tests/
├── unit/                      # Vitest
└── e2e/                       # Playwright

scripts/
└── check-assets.mjs           # 이미지·SVG·비디오 이름과 위치 검사

AGENTS.md                      # AI 에이전트 공통 지침
CLAUDE.md                      # Claude Code 지침 (AGENTS.md를 가져옴)
skills-lock.json               # 외부 스킬의 커밋·해시 고정
.worktreeinclude               # Claude Code가 만드는 worktree에 복사할 파일

.agents/
└── skills/                    # 외부에서 가져온 스킬 (원문 유지)

.claude/
├── settings.json              # 권한, 훅, 플러그인
├── agents/                    # 서브에이전트
├── hooks/                     # 훅 스크립트
├── rules/                     # 파일 종류별 규칙
└── skills/                    # 프로젝트 스킬 (외부 스킬은 심볼릭 링크)
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
# .env.local

# 환경 설정 (dev | qa | staging | live)
NEXT_PUBLIC_ENV=dev

# 클라이언트 노출 가능
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 인증 (OIDC 연동 시 설정)
# AUTH_SECRET=your-auth-secret
```

`src/env/schema.ts`의 스키마로 검증하며, 값이 잘못되면 `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm type-check`가 모두 실패합니다. 검증은 `next.config.ts`를 불러올 때 한 번 하므로 값을 바꾸면 서버를 다시 시작하세요. 빌드 결과물만 옮겨 `next start`로 실행한다면 `src/env/`도 함께 옮겨야 합니다.

### 환경별 유틸리티

```typescript
import { isDev, isLive } from '@/env'; // 서버·클라이언트 어디서나
import { serverEnv } from '@/env/server'; // 서버 전용 (비밀 값)

if (isDev()) {
  // 개발 환경에서만 실행
}

if (isLive()) {
  // live 환경에서 실행
}
```

## 다국어 (i18n)

한국어(`ko`)와 영어(`en`)를 지원합니다. 선택한 언어는 `i18n_redirected` 쿠키에 1년간 저장됩니다.

### 번역 파일

```
messages/
├── ko.json    # 한국어
└── en.json    # 영어 (번역 키 타입의 기준)
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

const theme = useUIStore((state) => state.theme);
const setTheme = useUIStore((state) => state.setTheme);
```

### TanStack Query (서버 상태)

```typescript
import { useApiMutation, useApiQuery } from '@/lib/api';

// 조회 (NEXT_PUBLIC_API_URL 기준 경로)
const { data, isLoading } = useApiQuery<User[]>(['users'], '/users');

// 변경
const mutation = useApiMutation<User, CreateUserInput>('/users', 'post');
```

API 응답은 `{ data, success }` 형식(`src/types/index.ts`의 `ApiResponse`)을 전제로 합니다. 여러 곳에서 함께 쓰는 쿼리는 `queryOptions`로 정의합니다(`.claude/rules/tanstack-query.md`).

## 스타일링

- 색상 같은 토큰은 `src/styles/_colors.scss`가 출처이며 `bg-primary`, `text-foreground` 등의 Tailwind 유틸리티로 사용합니다.
- 조건부 클래스는 `cn()`(`@/lib/utils`)으로 합칩니다.
- 컴포넌트 전용 스타일은 SCSS 모듈로 작성합니다. `next.config.ts`의 `sassOptions`가 JS/TSX에서 가져온 SCSS에 변수·믹스인·함수를 주입하므로 `@use` 없이 바로 사용할 수 있습니다.

```scss
// Card.module.scss
.card {
  @include body('md');

  border-radius: $radius-md;
  padding: $spacing-md;

  @include tablet {
    padding: $spacing-lg;
  }
}
```

## 이미지·아이콘·비디오

| 종류   | 접두사  | 폴더                  | 예시                  |
| ------ | ------- | --------------------- | --------------------- |
| 이미지 | `img-`  | `public/images/`      | `img-home-hero.webp`  |
| SVG    | `icon-` | `public/icons/`       | `icon-arrow-left.svg` |
| 비디오 | `vid-`  | `public/videos/`      | `vid-home-intro.mp4`  |
| 배경   | `bg-`   | `public/backgrounds/` | `bg-login.webp`       |

`pnpm lint:assets`가 이름과 위치를 검사하며 커밋할 때와 CI 워크플로에서 실행됩니다. 자세한 규칙은 `.claude/rules/assets.md`에 있습니다.

## 인증

> **TODO:** 인증 기능은 구현되어 있지 않으며 인증 라이브러리도 설치하지 않았습니다. OIDC 연동 시 구현할 예정입니다.

next-auth 5는 아직 안정판이 없어 제외했습니다. 도입 시점에 안정판 여부와 보안 권고를 확인해 선택합니다.

## 테스트

### 단위 테스트 (Vitest)

```bash
pnpm test:run
```

테스트 파일: `tests/unit/**/*.test.{ts,tsx}`

### E2E 테스트 (Playwright)

```bash
# 설치 (최초 1회, Playwright 버전이 바뀔 때)
pnpm exec playwright install

# 실행 (빌드 후 3000번 포트에서 검사)
pnpm test:e2e

# 3000번 포트를 이미 사용 중일 때
PORT=3100 pnpm test:e2e
```

테스트 파일: `tests/e2e/**/*.spec.ts`. 상태 코드와 캐시는 개발 서버에서 다를 수 있으므로 프로덕션 빌드로 검사합니다.

## 보안

- **의존성**: 게시된 지 3일이 지난 버전만 설치하고, 출처 증명이 약해진 버전과 승인하지 않은 설치 스크립트를 차단합니다(`pnpm-workspace.yaml`). 버전 선정 기준은 `.claude/rules/dependencies.md`에 있습니다.
- **HTTP 헤더**: `next.config.ts`의 `securityHeaders`에서 관리합니다.
- **CI**: GitHub Actions를 커밋 SHA로 고정하고 최소 권한으로 실행합니다.

## CI/CD

### GitHub Actions

모든 워크플로우는 수동(workflow_dispatch)으로 실행합니다.

| 워크플로우   | 설명                                                           |
| ------------ | -------------------------------------------------------------- |
| `ci.yml`     | 보안 감사, 포맷, 린트, 에셋 이름, 타입 체크, 단위 테스트, 빌드 |
| `e2e.yml`    | E2E 테스트                                                     |
| `deploy.yml` | 환경별 배포 (dev, live)                                        |

### 배포

GitHub Actions > Deploy > Run workflow에서 환경을 선택하여 배포합니다. 다음 시크릿이 필요합니다.

| 시크릿              | 설명                 |
| ------------------- | -------------------- |
| `VERCEL_TOKEN`      | Vercel 액세스 토큰   |
| `VERCEL_ORG_ID`     | Vercel 팀(사용자) ID |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID   |

- `NEXT_PUBLIC_ENV`는 선택한 환경(`dev`, `live`)으로 지정되고, 나머지 환경 변수는 Vercel 프로젝트에서 가져옵니다.
- `live`는 `main` 브랜치에서만 배포됩니다. GitHub의 Environments에서 승인자와 환경별 시크릿을 설정하는 것을 권장합니다.

## 코드 품질

### 커밋 전 자동 검사 (Husky + lint-staged)

커밋 시 자동으로 다음 검사가 실행됩니다:

- JavaScript/TypeScript: ESLint 자동 수정과 검사 + Prettier 포맷팅
- JSON/Markdown/YAML: Prettier 포맷팅
- SCSS/CSS: Stylelint 자동 수정과 검사 + Prettier 포맷팅
- 이미지·SVG·비디오: 이름과 위치 검사

### 설정 파일

| 도구      | 파일                  | 비고                                                         |
| --------- | --------------------- | ------------------------------------------------------------ |
| ESLint    | `eslint.config.js`    | `eslint-config-next` 기반, 타입·함수·locale 이동 규칙을 강제 |
| Stylelint | `stylelint.config.js` | BEM, 속성 알파벳 순서, Tailwind at-rule 허용                 |
| Prettier  | `prettier.config.js`  | Tailwind 클래스 자동 정렬                                    |

## AI 에이전트

`AGENTS.md`는 모든 코딩 에이전트가 읽는 공통 지침이고, `CLAUDE.md`와 `.claude/`는 Claude Code 설정입니다. 문서는 한국어로 관리합니다.

### 플러그인

`.claude/settings.json`에 프로젝트 플러그인을 선언했습니다. Claude Code 2.1.324 이상에서 저장소를 신뢰한 뒤 처음 한 번 설치합니다. 외부 마켓플레이스는 확인한 커밋으로 고정했습니다.

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin marketplace add Leonxlnx/taste-skill@6c0b5c78f5d31776e2210305abaa210cdc0030bf
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill@f823ab5fb970de820e5a0626a0786aba9aee0543

for plugin in superpowers typescript-lsp feature-dev code-review claude-code-setup frontend-design; do
  claude plugin install "$plugin@claude-plugins-official" --scope project
done
claude plugin install taste-skill@taste-skill --scope project
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill --scope project
```

같은 마켓플레이스를 고정하지 않고 이미 등록했다면 `marketplace add`가 실패합니다. 고정하려면 먼저 지웁니다.

```bash
claude plugin marketplace remove taste-skill --scope user
claude plugin marketplace remove ui-ux-pro-max-skill --scope user
```

| 플러그인            | 확인한 버전 | 용도                                                          |
| ------------------- | ----------- | ------------------------------------------------------------- |
| `superpowers`       | 7.0.2       | 브레인스토밍, 계획, TDD, 검증 절차                            |
| `feature-dev`       | 1.0.1       | 기능 개발 워크플로우와 전용 에이전트                          |
| `code-review`       | 1.0.1       | PR 코드 리뷰                                                  |
| `claude-code-setup` | 1.0.0       | 저장소에 맞는 자동화 추천                                     |
| `typescript-lsp`    | 1.0.0       | TypeScript 언어 서버 (`typescript-language-server` 설치 필요) |
| `frontend-design`   | 1.1.1       | UI 시각 디자인                                                |
| `taste-skill`       | 2.5.1       | 랜딩·회사 소개 페이지                                         |
| `ui-ux-pro-max`     | 2.15.0      | UI/UX 기준 검색과 점검                                        |

### 스킬

| 스킬                          | 출처                     | 설명                                      |
| ----------------------------- | ------------------------ | ----------------------------------------- |
| `create-pr`                   | 프로젝트                 | PR 제목과 본문 작성                       |
| `git-flow`                    | 프로젝트                 | 기능·릴리스·핫픽스 브랜치 절차            |
| `reviewing-code`              | 프로젝트                 | 규칙 기반 코드 리뷰                       |
| `mcp-builder`                 | anthropics/skills        | MCP 서버 개발 가이드                      |
| `find-skills`                 | vercel-labs/skills       | 필요한 스킬 검색과 설치 안내              |
| `vercel-react-best-practices` | vercel-labs/agent-skills | React/Next.js 성능 최적화 패턴            |
| `vercel-composition-patterns` | vercel-labs/agent-skills | React 컴포지션 패턴                       |
| `vercel-react-native-skills`  | vercel-labs/agent-skills | React Native/Expo 모바일 앱 최적화        |
| `web-design-guidelines`       | vercel-labs/agent-skills | 웹 인터페이스 디자인 및 접근성 가이드라인 |

외부 스킬은 `.agents/skills/`에 원문 그대로 두고 `.claude/skills/`에서 심볼릭 링크로 연결합니다.

```bash
npx skills@1.9.0 experimental_install   # 잠금 파일 기준으로 복원
npx skills@1.9.0 update --project       # 최신 버전으로 갱신
```

### 서브에이전트

| 이름               | 설명                                 |
| ------------------ | ------------------------------------ |
| `project-reviewer` | 프로젝트 규칙 기준 리뷰 (수정 안 함) |
| `verifier`         | 설치부터 E2E까지 전수 검증하고 보고  |

## 라이선스

MIT
