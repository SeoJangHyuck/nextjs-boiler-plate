---
paths: '**/*.{scss,css}'
---

# SCSS 컨벤션

## 목적

BEM 방법론과 Stylelint를 사용하여 일관되고 유지보수 가능한 CSS를 위한 스타일링 패턴을 표준화합니다. 명확한 네이밍 규칙을 가진 컴포넌트 기반 스타일링.

---

## 파일 구조

```
src/styles/
├── globals.scss          # 전역 스타일 엔트리 (reset, colors, variables 로드)
├── tailwind.css          # Tailwind 진입점
├── _utils.scss           # 컴포넌트용 유틸리티 forward
├── _reset.scss           # CSS 리셋
├── _colors.scss          # 색상 변수 및 CSS Custom Properties
├── _variables.scss       # z-index, spacing, radius, shadows, transitions
├── _breakpoints.scss     # 반응형 브레이크포인트 및 믹스인
├── _typography.scss      # 타이포그래피 믹스인
├── _mixins.scss          # 레이아웃 유틸리티 믹스인
├── _scroll.scss          # 스크롤바 커스텀 믹스인
└── _function.scss        # SCSS 유틸리티 함수

src/components/
└── Card/
    ├── Card.tsx
    └── Card.module.scss   # 컴포넌트별 스타일
```

### 엔트리 파일

- **`globals.scss`**: 전역 스타일 (body, 언어별 설정 등)
- **`_utils.scss`**: 컴포넌트에서 `@use '@/styles/utils'`로 사용

---

## 변수

### 색상 (`_colors.scss`)

```scss
// Primary Colors
$green-light: #28e1bd;
$green: #00ad9f;
$blue-light: #18beff;
$blue: #0060bd;

// Navy Scale
$navy-20: #4e6682;
$navy-70: #001726;

// Opacity Colors (모던 CSS 문법)
$white-op-70: rgb(255 255 255 / 70%);
$navy-op-50: rgb(0 23 38 / 50%);

// Semantic Colors
$stroke-default: $navy-50;
$stroke-green: $green-light;

// CSS Custom Properties
:root {
  --color-background: #{$navy-70};
  --color-text-primary: #{$white};
  --color-primary: #{$green};
}
```

### Z-Index (`_variables.scss`)

NHN 컨벤션 기반: 최소 10, 최대 1000, 10단위 증가

```scss
$z-index-base: 10;
$z-index-dropdown: 100;
$z-index-sticky: 200;
$z-index-fixed: 300;
$z-index-modal-backdrop: 400;
$z-index-modal: 500;
$z-index-popover: 600;
$z-index-tooltip: 700;
$z-index-toast: 800;
$z-index-max: 1000;
```

### 간격 & 테두리 반경

```scss
// 간격
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;

// 테두리 반경
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;
$radius-full: 100%;
```

### 브레이크포인트 (`_breakpoints.scss`)

Mobile-first 반응형 디자인

```scss
// 브레이크포인트 값
$breakpoint-mobile-min: 320px; // 최소 지원 너비
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1280px;

// 디바이스 타입 믹스인
@mixin mobile-only {
  @media (max-width: #{$breakpoint-tablet - 1px}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: $breakpoint-tablet) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: $breakpoint-desktop) {
    @content;
  }
}
```

---

## 믹스인

### 타이포그래피 (`_typography.scss`)

```scss
@use 'sass:map';

$heading-sizes: (
  '3xl': (
    'size': 64px,
    'line-height': 72px,
  ),
  '2xl': (
    'size': 52px,
    'line-height': 58px,
  ),
  'xl': (
    'size': 40px,
    'line-height': 48px,
  ), // ...
);

@mixin heading($level, $weight: 700) {
  $config: map.get($heading-sizes, $level);
  font-size: map.get($config, 'size');
  font-weight: $weight;
  letter-spacing: 0;
  line-height: map.get($config, 'line-height');
}

@mixin body($size: 'md', $weight: null) {
  // ...
}

@mixin truncate {
  /* 한 줄 말줄임 */
}
@mixin line-clamp($lines: 2) {
  /* 여러 줄 말줄임 */
}
@mixin sr-only {
  /* 스크린 리더 전용 */
}
```

### 레이아웃 (`_mixins.scss`)

```scss
@mixin absolute-center {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

@mixin fixed-full {
  inset: 0;
  position: fixed;
}

@mixin absolute-full {
  inset: 0;
  position: absolute;
}

@mixin aspect-ratio($width, $height) {
  aspect-ratio: $width / $height;
}
```

### 스크롤 (`_scroll.scss`)

```scss
@mixin custom-scrollbar($color: rgb(255 255 255 / 20%), $size: 5px) {
  &::-webkit-scrollbar {
    height: $size;
    width: $size;
  }
  // ...
}

@mixin horizontal-scroll($type: default, $disableScroll: false) {
  // ...
}

@mixin no-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 함수 (`_function.scss`)

```scss
@use 'sass:math';
@use './breakpoints' as bp;

// 단위 변환
@function px-to-rem($pixel, $base-size: 16px) {
  /* ... */
}
@function px-to-vw($pixel, $viewport-size: bp.$breakpoint-2xl) {
  /* ... */
}

// 디바이스별 VW 변환
@function tablet-vw($pixel) {
  /* ... */
}
@function mobile-vw($pixel) {
  /* ... */
}
```

---

## BEM 방법론

[BEM (Block Element Modifier)](http://getbem.com/) 기반.

### 네이밍 규칙

| 개념         | 설명              | 네이밍                                 |
| ------------ | ----------------- | -------------------------------------- |
| **Block**    | 독립적인 컴포넌트 | `.card`, `.button`, `.header`          |
| **Element**  | 블록의 일부       | `.card__title`, `.button__icon`        |
| **Modifier** | 변형 또는 상태    | `.card--featured`, `.button--disabled` |

### 예시

```scss
// ✅ DO: 올바른 BEM 구조
.button {
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;

  &__icon {
    margin-right: $spacing-xs;
  }

  &--primary {
    background-color: var(--color-primary);
    color: var(--white);
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

// ❌ DON'T: BEM 아닌 중첩
.button {
  .icon {
  } // .button__icon 사용
  &.primary {
  } // .button--primary 사용
}
```

---

## BEM을 사용한 CSS 모듈

### 컴포넌트 스타일

```scss
// Button.module.scss
@use '@/styles/utils' as *;

.button {
  @include body('md');

  border-radius: $radius-md;
  padding: $spacing-sm $spacing-md;
  transition: var(--transition-fast);

  &__icon {
    margin-right: $spacing-xs;
  }

  &--primary {
    background-color: var(--color-primary);
    color: var(--white);

    &:hover {
      background-color: var(--color-primary-light);
    }
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
}
```

### 컴포넌트에서 사용

```typescript
import styles from './Button.module.scss';
import { cn } from '@/lib/utils';

export const Button = ({ variant = 'primary', disabled }: ButtonProps) => {
  return (
    <button
      className={cn(
        styles.button,
        styles[`button--${variant}`],
        disabled && styles['button--disabled']
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

---

## Stylelint 설정

```javascript
// stylelint.config.js
export default {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  rules: {
    // BEM 패턴
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*(__[a-z][a-zA-Z0-9]*)?(--[a-z][a-zA-Z0-9]*)?$',
      { message: 'Class names should follow BEM pattern' },
    ],

    // 알파벳 순서 프로퍼티
    'order/properties-alphabetical-order': true,

    // 최대 중첩 깊이
    'max-nesting-depth': 3,

    // !important 금지
    'declaration-no-important': true,

    // ID 선택자 금지
    'selector-max-id': 0,

    // SCSS 패턴
    'scss/dollar-variable-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
    'scss/at-mixin-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
  },
};
```

---

## 규칙

### 프로퍼티 순서

Stylelint가 알파벳 순서를 강제합니다.

```scss
// ✅ DO: 알파벳 순서
.card {
  background-color: var(--color-surface);
  border-radius: $radius-md;
  display: flex;
  padding: $spacing-md;
}
```

### 최대 3단계 중첩

```scss
// ✅ DO: BEM을 사용한 얕은 중첩
.card {
  &__header {
  }
  &__body {
  }
  &--featured {
  }
}

// ❌ DON'T: 깊은 중첩
.page {
  .container {
    .card {
      .cardHeader {
      } // 너무 깊음!
    }
  }
}
```

### 피해야 할 패턴

```scss
// ❌ DON'T: !important
.button {
  color: red !important;
}

// ❌ DON'T: ID 선택자
#header {
}

// ❌ DON'T: 매직 넘버
.modal {
  top: 47px;
}

// ❌ DON'T: BEM 아닌 네이밍
.button-primary {
} // .button--primary 사용
.cardHeader {
} // .card__header 사용
```

---

## AI 에이전트 작업

- **BEM 네이밍 적용** (block\_\_element--modifier)
- Stylelint 설정 존재 확인
- 중첩 깊이 확인 (최대 3단계)
- `!important` 사용 식별 및 대안 제안
- 컴포넌트 스타일에서 ID 선택자 없는지 확인
- `@use '@/styles/utils'`로 변수/믹스인 임포트
- CSS 모듈이 BEM 패턴을 따르는지 검증
- 변형/상태에 modifier 클래스 사용 확인
- 알파벳 순서 프로퍼티 확인

**참조**:

- [BEM Methodology](http://getbem.com/)
- [Stylelint](https://stylelint.io/)
- [CSS Modules](https://github.com/css-modules/css-modules)
