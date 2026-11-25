---
paths:
  - '**/*.scss'
  - 'stylelint.config.js'
---

# SCSS 컨벤션

## 파일 역할

| 파일                                                                                | 역할                                       |
| ----------------------------------------------------------------------------------- | ------------------------------------------ |
| `globals.scss`                                                                      | 전역 엔트리. 레이아웃에서 한 번만 불러온다 |
| `_layers.scss`                                                                      | 레이어 순서 선언. 가장 먼저 로드           |
| `_tokens.scss`                                                                      | `:root` CSS 변수 출력. `globals.scss` 전용 |
| `_reset.scss`                                                                       | 리셋(`@layer base`)                        |
| `_colors` `_variables` `_breakpoints` `_typography` `_mixins` `_scroll` `_function` | 변수·믹스인·함수                           |
| `_utils.scss`                                                                       | 컴포넌트용 묶음. **CSS를 출력하지 않는다** |

- `_utils.scss`가 forward하는 파일에 `:root`나 선택자를 쓰지 않는다. 모듈마다 중복 출력된다.
- 전역 요소 스타일은 `@layer base` 안에만 쓴다.

## 자동 주입

`next.config.ts`의 `sassOptions`가 JS/TSX에서 가져온 SCSS 앞에 `@use 'styles/utils' as *;`를 붙인다. **`@use '@/styles/utils'`를 쓰지 않아도** 변수, 믹스인, 함수를 바로 쓸 수 있다.

- `sass:map` 같은 내장 모듈과 다른 파일은 필요한 곳에서 직접 `@use`한다.
- 모든 파일에서 쓸 변수나 믹스인을 새 파일로 추가했다면 `_utils.scss`에 `@forward`한다.
- `@use`로 불러온 부분 파일(`_*.scss`)에는 위치와 관계없이 주입되지 않는다. 필요한 파일을 직접 `@use`한다.
- 파일 최상위에서 주입된 변수(`$spacing-md` 등)를 다시 선언하면 **오류 없이 값이 덮어써지고** 믹스인에도 영향을 준다. 컴포넌트 전용 변수는 `$card-`처럼 블록 이름을 앞에 붙인다.
- JS에서 직접 가져온 외부 패키지의 SCSS에도 주입돼 `$blue` 같은 `!default` 변수가 바뀐다. 외부 스타일은 컴파일된 CSS를 가져온다.

## 컴포넌트 스타일

CSS 모듈을 컴포넌트 폴더에 두고 BEM으로 이름 짓는다. 예시: `src/components/ui/Spinner/`

```scss
// Card.module.scss
.card {
  @include body('md');

  border-radius: $radius-md;
  padding: $spacing-md;

  &__title {
    margin-bottom: $spacing-sm;
  }

  &--featured {
    border: 1px solid var(--color-primary);
  }
}
```

- Block `.card`, Element `.card__title`, Modifier `.card--featured`. 이름은 camelCase를 쓴다. (린트)
- 상태와 변형은 중첩 클래스가 아니라 Modifier로 표현한다.
- 외부 라이브러리의 클래스를 `:global(...)`로 다룰 때는 이유를 적고 그 줄에만 `stylelint-disable-next-line scss/selector-class-pattern`을 둔다.

## 규칙

- 속성은 알파벳 순서, 중첩은 3단계 이하, `!important`와 ID 선택자는 금지다. (린트)
- 런타임에 바뀌는 값은 CSS 변수(`var(--color-primary)`), 컴파일 시 정해지는 값은 SCSS 변수를 쓴다.
- z-index는 `$z-index-*` 토큰만 쓴다(10~1000, 10단위, 예외 시 1단위).
- 반응형은 모바일 우선이며 `@include tablet`, `@include desktop`을 쓴다.
- 매직 넘버 대신 토큰이나 함수(`px-to-rem`, `px-to-vw`)를 쓴다.

## 최신 Sass 문법

- `@import` 대신 `@use`/`@forward`, 전역 함수 대신 `map.get`, `math.div`, `color.adjust`를 쓴다.
- `if($a, $b, $c)` 함수는 폐기됐다. `@if`, `$a or $b`, `if(sass($a): $b; else: $c)`를 쓴다.
- 변수 사이의 `/`는 나눗셈으로 해석된다. 나눗셈은 `math.div`, 비율 표기는 `#{$w} / #{$h}`를 쓴다.
- 색상은 `rgb(0 0 0 / 50%)` 표기를 쓴다.
