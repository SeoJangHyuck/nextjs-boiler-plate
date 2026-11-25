---
paths:
  - '**/*.tsx'
  - 'src/styles/tailwind.css'
---

# Tailwind CSS 컨벤션

## 토큰

값의 출처는 SCSS 하나다. 새 색상은 아래 순서로 추가한다.

1. `src/styles/_colors.scss`에 변수를 추가한다.
2. `src/styles/_tokens.scss`에서 CSS 변수로 노출한다.
3. `src/styles/tailwind.css`의 `@theme inline reference`에 연결한다.

| 용도   | 유틸리티                                                          |
| ------ | ----------------------------------------------------------------- |
| 배경   | `bg-background` `bg-surface` `bg-surface-hover`                   |
| 글자   | `text-foreground` `text-secondary` `text-muted` `text-disabled`   |
| 강조   | `bg-primary` `text-primary-light` `border-primary`                |
| 테두리 | `border-border`                                                   |
| 모서리 | `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` (4·8·12·16px) |

- 팔레트 색(`bg-blue-500`)이나 임의 값(`bg-[#1a1a1a]`)보다 토큰을 먼저 쓴다.
- 유틸리티로 연결하지 않은 토큰은 `border-(--white-op-30)`, `shadow-(--shadow-md)`처럼 괄호 문법으로 참조한다.
- `@theme`에 `--spacing-xs`~`--spacing-2xl`을 정의하지 않는다. `max-w-md`, `w-lg` 같은 크기 유틸리티가 함께 바뀐다. 간격은 숫자 스케일(`p-4`)을 쓴다.

## 레이어

전역 요소 스타일은 `@layer base` 안에만 쓴다. 레이어 밖 스타일은 모든 유틸리티를 덮어쓴다(`tests/e2e/home.spec.ts`가 검사).

## 클래스 작성

- 조건부 클래스와 외부 `className` 병합은 `cn()`을 쓴다. 템플릿 문자열로 이어 붙이지 않는다.
- 클래스 이름은 완성된 문자열로 쓴다. `bg-${color}`처럼 조립하면 생성되지 않는다.
- 순서는 Prettier가 정리한다.
- 모바일 우선으로 쓰고 `md:`, `lg:`로 확장한다. 컴포넌트 단위 반응형은 `@container`를 쓴다.
- 같은 조합이 세 번 이상 반복되면 클래스를 모으지 말고 컴포넌트로 만든다.

## v4 표기

| 이전                 | 현재             |
| -------------------- | ---------------- |
| `bg-gradient-to-b`   | `bg-linear-to-b` |
| `h-8 w-8`            | `size-8`         |
| `bg-[var(--token)]`  | `bg-(--token)`   |
| `flex-shrink-0`      | `shrink-0`       |
| `outline-none`(숨김) | `outline-hidden` |

## 접근성과 상태

- 상호작용 요소는 `hover:`와 필요한 `disabled:` 상태를 갖춘다.
- 브라우저의 포커스 표시를 없애지 않는다. 바꿀 때는 `focus-visible:ring-2` 등으로 대체한다.
- 글자 대비는 4.5:1 이상이어야 한다(`tests/e2e/accessibility.spec.ts`가 검사). `bg-primary` 위에는 `text-background`를 쓴다.
- 움직임이 있으면 `motion-reduce:`를 고려한다.

## SCSS와의 구분

레이아웃·간격·색상 등 단순 스타일은 Tailwind, 복잡한 선택자·키프레임·컴포넌트 전용 스타일은 CSS 모듈(SCSS)을 쓴다. 한 요소에 같은 속성을 양쪽에서 지정하지 않는다.
