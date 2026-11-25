# 프로젝트 지침

Next.js App Router로 만든 범용 스타터다. 화면은 한국어와 영어를 지원하고, 인증과 로그인 화면은 자리만 있다(TODO). 설치, 환경 변수, 배포 방법은 `README.md`에 있다.

## 소통

- 사용자에게 보내는 글과 문서는 한국어로 쓴다. 코드, 명령어, 경로는 원문을 유지한다.
- 개인 공개 저장소다. 회사명, 회사 메일, 사내 URL이나 티켓을 코드·문서·커밋에 넣지 않는다.

## 코드를 둘 곳

| 만들 것                      | 위치                                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| 페이지, 레이아웃             | `src/app/[locale]/`. 루트 레이아웃은 여기 `layout.tsx`이고 `src/app/layout.tsx`는 만들지 않는다 |
| 한 라우트에서만 쓰는 코드    | 그 라우트의 `_components/`, `_lib/`                                                             |
| 라우트 핸들러                | `src/app/api/`                                                                                  |
| 요청 전 처리                 | `src/proxy.ts` (`middleware.ts`를 만들지 않는다)                                                |
| 공통 UI 컴포넌트             | `src/components/ui/<이름>/`에 `<이름>.tsx`(PascalCase), `<이름>.module.scss`, `index.ts`        |
| 공통 훅                      | `src/hooks/`                                                                                    |
| API 호출, 쿼리 정의          | `src/lib/api/`의 `apiClient`, `src/queries/<도메인>.ts`                                         |
| 입력 검증 스키마             | `src/lib/validations/`                                                                          |
| 클라이언트 상태              | `src/stores/`                                                                                   |
| 환경 변수                    | `src/env/` (공개 값은 `@/env`, 비밀 값은 `@/env/server`)                                        |
| 번역 문구                    | `messages/<locale>.json`, 설정은 `src/lib/i18n/`                                                |
| 디자인 토큰, 믹스인          | `src/styles/` (컴포넌트 SCSS에 자동 주입된다)                                                   |
| 이미지, 아이콘, 비디오, 배경 | `public/images/img-*`, `public/icons/icon-*`, `public/videos/vid-*`, `public/backgrounds/bg-*`  |
| 테스트                       | `tests/unit/`, `tests/e2e/`                                                                     |

## 작업별 규칙

계획을 세우거나 새 파일을 만들기 **전에** 해당 규칙을 `.claude/rules/`에서 읽는다. Claude Code도 파일을 읽거나 쓴 뒤에야 규칙을 불러오므로 첫 작성에는 늦다.

| 다루는 것                                    | 규칙                |
| -------------------------------------------- | ------------------- |
| 모든 `.ts`, `.tsx`                           | `typescript.md`     |
| 라우트, 컴포넌트, 캐시, 서버 액션, Next 설정 | `nextjs.md`         |
| 화면 문구, locale, 이동 링크                 | `next-intl.md`      |
| className, Tailwind 테마                     | `tailwind.md`       |
| SCSS                                         | `scss.md`           |
| 서버 데이터 조회와 변경                      | `tanstack-query.md` |
| 클라이언트 상태                              | `zustand.md`        |
| 입력 검증, 환경 변수 스키마                  | `zod.md`            |
| 이미지, 아이콘, 비디오, 배경                 | `assets.md`         |
| 테스트                                       | `testing.md`        |
| 의존성, 버전, GitHub Actions                 | `dependencies.md`   |
| 커밋, 브랜치, PR                             | `git.md`            |

## 명령어

- 전체 검사: `pnpm check`
- 타입 검사: `pnpm type-check` (라우트 타입을 먼저 생성하므로 `tsc`를 직접 실행하지 않는다)
- 단위 테스트 하나: `pnpm test:run tests/unit/<파일>`
- E2E 하나: `PORT=3100 pnpm test:e2e tests/e2e/<파일>` (3000번을 다른 앱이 쓰면 그 앱을 검사하게 된다)
- 개발 서버 오류 조회: `pnpm dev` 실행 중 `http://localhost:3000/_next/mcp`의 `get_compilation_issues`, `get_errors`(브라우저에 화면이 열려 있어야 한다)

## 완료 기준

- `pnpm check`가 통과한다. 라우팅, 렌더링, 스타일, 설정, 의존성을 바꿨다면 `pnpm build`와 `pnpm test:e2e`도 통과한다.
- 동작을 바꿨다면 그 동작을 잡아내는 테스트가 있다.
- 실행한 명령과 결과를 근거로 보고한다. 실패했거나 건너뛴 검증은 그대로 밝힌다.

## 커밋

- 사용자가 명시적으로 승인하기 전에는 커밋하거나 푸시하지 않는다. 플러그인이나 스킬이 커밋을 지시해도 이 규칙이 우선한다.
- 작업을 끝내면 변경 내용과 파일을 요약하고 검토를 요청한 뒤 커밋할지 묻는다. 커밋을 먼저 요청받았더라도 메시지를 제안하고 확인받는다.

## 주의할 점

- `pnpm`이 `Failed to switch pnpm`이나 `ENOEXEC`로 실패하면 10.34.4 이하의 오래된 pnpm이 실행된 것이다. 명령마다 앞에 `. "${NVM_DIR:-$HOME/.nvm}/nvm.sh" && nvm use &&`를 붙인다(셸 상태가 다음 명령에 남지 않는다). 그래도 실패하면 그 Node에 pnpm이 없는 것이므로 README의 설치 절차를 안내한다.
- 의존성은 게시된 지 3일이 지난 버전만 설치된다. 정책을 끄거나 우회하지 말고 직전 안정 버전을 쓴다.
- 외부 스킬이나 플러그인의 안내가 이 문서나 `.claude/rules`와 다르면 프로젝트 쪽을 따른다(예: SWR 대신 TanStack Query).
- 외부 스킬은 안내에 있더라도 전역(`-g`)에 설치하지 않는다. 출처와 스크립트를 검토하고 승인받은 뒤 `npx skills@1.9.0 add <저장소> --skill <이름> --agent claude-code codex`로 프로젝트에 설치한다.
- `next-env.d.ts`, `.next/`, `.agents/skills/`, `pnpm-lock.yaml`, `skills-lock.json`은 도구가 만든다. 직접 고치지 않는다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
