---
paths:
  - 'tests/**/*'
  - 'vitest.config.ts'
  - 'playwright.config.ts'
---

# 테스트 컨벤션

## 구분

| 종류 | 위치         | 도구       | 대상                                                     |
| ---- | ------------ | ---------- | -------------------------------------------------------- |
| 단위 | `tests/unit` | Vitest     | 순수 함수, 스키마, 스토어, 훅, 동기 컴포넌트             |
| E2E  | `tests/e2e`  | Playwright | 라우팅, 렌더링, 쿠키·헤더·상태 코드, async 서버 컴포넌트 |

Vitest는 async 서버 컴포넌트를 렌더링하지 못한다. E2E로 확인한다.

## 작성 원칙

- 동작을 바꿀 때는 실패하는 테스트를 먼저 쓰고, 실패를 확인한 뒤 구현한다. 버그 수정에는 그 버그를 재현하는 테스트를 남긴다.
- 테스트 이름은 한국어로 "조건이면 결과" 형태로 쓴다.
- 구현이 아니라 결과를 확인한다. 내부 함수 호출 여부만 확인하는 테스트는 피한다.
- `if`로 검증을 건너뛰지 않는다. 조건이 맞지 않으면 실패해야 한다.

## 단위 테스트

- `describe`, `it`, `expect`, `vi`를 `vitest`에서 명시적으로 가져온다.
- 요소는 `getByRole`로 찾고 사용자에게 보이는 이름을 쓴다. 조작은 `@testing-library/user-event`로 한다.
- 환경 변수는 `vi.stubEnv`, 전역 객체는 `vi.stubGlobal`로 바꾸고 `afterEach`에서 되돌린다.
- 모듈 최상위에서 평가되는 값은 `vi.resetModules()` 후 동적으로 import한다.

## E2E

- 먼저 브라우저를 설치한다: `pnpm exec playwright install`
- 3000번 포트를 다른 앱이 쓰고 있으면 엉뚱한 서버를 검사한다. `PORT=3100 pnpm test:e2e`로 실행한다.
- 언어에 따라 결과가 달라지는 테스트는 `test.use({ locale: 'ko-KR' })`로 고정한다.
- 고정 시간 대기(`waitForTimeout`)와 `networkidle` 대신 자동 재시도 단언(`toBeVisible`, `toHaveURL`)을 쓴다.
- 상태 코드와 캐시는 프로덕션 빌드에서 확인한다. 개발 서버는 다르게 응답할 수 있다.
