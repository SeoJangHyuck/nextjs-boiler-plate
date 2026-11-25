---
paths:
  - 'package.json'
  - 'pnpm-workspace.yaml'
  - 'pnpm-lock.yaml'
  - '.nvmrc'
  - '.github/workflows/**/*'
---

# 의존성과 버전 관리

## 버전을 고르는 기준

1. 안정판만 쓴다. `beta`, `rc`, `canary`는 안정판이 없을 때만 사용자 승인을 받아 쓴다.
2. 게시된 지 3일이 지난 버전을 쓴다(`minimumReleaseAge`). 그보다 새 버전이 필요하면 직전 안정 버전으로 대신한다.
3. 알려진 취약점이 없어야 한다. `pnpm audit`이 0건이어야 한다.
4. `pnpm peers check`에 충돌이 없어야 한다.
5. 코드에서 쓰지 않는 패키지는 넣지 않는다.

## 공급망 보안

- `trustPolicy`, `blockExoticSubdeps`, `strictDepBuilds`를 끄지 않는다.
- 예외(`trustPolicyExclude`, `allowBuilds`, `peerDependencyRules`)는 대상을 좁게 지정하고 확인한 근거와 날짜를 주석으로 남긴다. 출처 증명 예외는 버전까지 적는다.
- 설치가 정책에 막히면 먼저 게시자, 게시 시각, 설치 스크립트, 취약점을 확인한다. 이유를 모르면 설치하지 않는다.
- `pnpm-lock.yaml`은 직접 고치지 않는다. 충돌이 나면 `pnpm install`로 다시 만든다.

## 업데이트 절차

1. `pnpm outdated`로 대상을 확인하고 메이저 변경의 마이그레이션 문서를 읽는다.
2. `pnpm update <패키지>`로 나눠 올린다. 메이저는 `pnpm update --latest <패키지>`로 하나씩 올린다.
3. `pnpm install --frozen-lockfile`, `pnpm audit`, `pnpm peers check`, `pnpm check`, `pnpm build`, `pnpm test:e2e`를 실행한다.
4. 버전 표기가 있는 `README.md`를 함께 고친다.

## 현재 고정한 이유

| 대상            | 고정            | 이유와 다시 볼 조건                                                                                |
| --------------- | --------------- | -------------------------------------------------------------------------------------------------- |
| Node            | 24.x (`.nvmrc`) | Next 16.4는 Node 26에서 스트리밍 응답이 크게 늘어난다(vercel/next.js#101343). Next 16.5에서 재검토 |
| `@types/node`   | 24.x            | Node 메이저와 맞춘다                                                                               |
| TypeScript      | 6.0.x           | typescript-eslint가 TypeScript 7을 지원하지 않는다. 지원 범위가 넓어지면 재검토                    |
| 인증 라이브러리 | 없음            | next-auth 5는 안정판이 없고 출처 증명이 약화됐다. OIDC 연동 시 Better Auth 등을 비교               |

## GitHub Actions

- 액션은 커밋 SHA 40자로 고정하고 버전을 주석으로 적는다. 새 버전은 `pnpm outdated --include-github-actions`로 확인한다.
- 최상위에 `permissions: {}`를 두고 작업마다 필요한 권한만 준다. `actions/checkout`에는 `persist-credentials: false`를 쓴다.
- 입력값과 비밀 값은 `run` 문자열에 직접 넣지 않고 `env`로 넘긴다.
