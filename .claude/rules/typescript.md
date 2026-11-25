---
paths:
  - '**/*.ts'
  - '**/*.tsx'
---

# TypeScript 컨벤션

`(린트)` 표시는 ESLint가 강제한다. 아래에 예외로 적은 경우가 아니면 규칙을 끄지 말고 코드를 고친다.

## 타입

- 타입은 `type`으로 정의한다. (린트) 선언 병합(`declare module`, `declare global`)만 `interface`를 쓰고, 이유와 함께 그 줄의 규칙을 끈다(`src/lib/i18n/app-config.ts` 참고).
- `any`를 쓰지 않는다. 모르는 값은 `unknown`으로 받아 좁히거나 Zod로 검증한다. (린트)
- `!` 단언을 쓰지 않는다. (린트) 검증 없는 `as` 단언도 피하고, 불가피하면 이유를 주석으로 남긴다.
- `I` 접두사를 붙이지 않는다. 타입 파라미터는 `T` 또는 `TData`처럼 `T`로 시작한다.
- 스키마가 있으면 타입을 따로 쓰지 말고 `z.infer`로 도출한다.
- 상수 객체는 `as const satisfies 타입`으로 리터럴 타입을 보존하면서 형태를 검사한다.

유니온은 빠진 분기가 컴파일 오류가 되도록 처리한다.

```ts
switch (status) {
  case 'pending':
    return '검토 대기';
  case 'approved':
    return '승인됨';
  default:
    throw new Error(`처리하지 않은 상태: ${status satisfies never}`);
}
```

## 엄격 옵션에서 자주 걸리는 것

- `noUncheckedIndexedAccess`: `items[0]`과 `record[key]`는 `undefined`일 수 있다. `?.`, 기본값, 조기 반환으로 처리한다.
- `exactOptionalPropertyTypes`: 선택 속성에 `undefined`를 대입할 수 없다. 조건부 스프레드를 쓴다.

```ts
const options = { method: 'GET', ...(signal && { signal }) };
```

## 함수와 모듈

- 함수는 화살표 함수로 쓴다. (린트) 예외는 Next.js 특수 파일(`page`, `layout`, `error` 등)의 기본 내보내기와 제너레이터(`const run = function* () {}`)다.
- `memo`로 감쌀 컴포넌트는 먼저 이름을 붙여 선언한 뒤 감싼다.
- 컴포넌트·훅·유틸은 이름 있는 내보내기를 쓴다.
- 타입만 가져올 때는 `import type`을 쓴다. 와일드카드 import는 쓰지 않는다. (린트)
- `var`를 쓰지 않고, 재할당할 때만 `let`을 쓴다. (린트)
- 기본값은 `||` 대신 `??`를 쓴다. `0`, `''`, `false`가 유효한 값일 수 있다.

## 이름

| 대상               | 규칙                 | 예시                            |
| ------------------ | -------------------- | ------------------------------- |
| 컴포넌트와 그 파일 | PascalCase           | `UserProfile.tsx`               |
| 훅과 그 파일       | `use` + camelCase    | `useAuth.ts`                    |
| 유틸·타입 파일     | camelCase/kebab-case | `formatDate.ts`, `ui-store.ts`  |
| 매직 값 상수       | SCREAMING_SNAKE_CASE | `MAX_RETRIES`                   |
| enum 객체          | PascalCase           | `AppEnv`                        |
| 그 밖의 변수·함수  | camelCase            | `defaultLocale`, `handleSubmit` |
| Props 타입         | 컴포넌트명 + `Props` | `ButtonProps`                   |

예외: Next.js 특수 파일(`page.tsx` 등)과 `providers.tsx`는 소문자로 둔다.

## React 타입

- Props는 컴포넌트 바로 위에 `type`으로 선언한다. 인라인으로 쓰지 않는다.
- HTML 요소를 확장할 때는 `React.ComponentProps<'input'>`을 쓴다. `ref`도 일반 prop이므로 `forwardRef`를 쓰지 않는다.
- 서버에서 클라이언트로 넘기는 props는 화면에 필요한 필드만 담은 타입으로 좁힌다.
