---
paths: '**/*.{scss,css}'
---

# SCSS Conventions

## Purpose

Standardize styling patterns using BEM methodology and Stylelint for consistent, maintainable CSS. Component-based styling with clear naming conventions.

---

## File Structure

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

### Entry Files

- **`globals.scss`**: 전역 스타일 (body, 언어별 설정 등)
- **`_utils.scss`**: 컴포넌트에서 `@use '@/styles/utils'`로 사용

---

## Variables

### Colors (`_colors.scss`)

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

### Spacing & Radius

```scss
// Spacing
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;

// Border Radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;
$radius-full: 100%;
```

### Breakpoints (`_breakpoints.scss`)

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

## Mixins

### Typography (`_typography.scss`)

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

### Layout (`_mixins.scss`)

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

### Scroll (`_scroll.scss`)

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

## Functions (`_function.scss`)

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

## BEM Methodology

Based on [BEM (Block Element Modifier)](http://getbem.com/).

### Naming Convention

| Concept      | Description          | Naming                                 |
| ------------ | -------------------- | -------------------------------------- |
| **Block**    | Standalone component | `.card`, `.button`, `.header`          |
| **Element**  | Part of a block      | `.card__title`, `.button__icon`        |
| **Modifier** | Variation or state   | `.card--featured`, `.button--disabled` |

### Examples

```scss
// ✅ DO: Proper BEM structure
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

// ❌ DON'T: Non-BEM nesting
.button {
  .icon {
  } // Use .button__icon
  &.primary {
  } // Use .button--primary
}
```

---

## CSS Modules with BEM

### Component Style

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

### Usage in Components

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

## Stylelint Configuration

```javascript
// stylelint.config.js
export default {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  rules: {
    // BEM pattern
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*(__[a-z][a-zA-Z0-9]*)?(--[a-z][a-zA-Z0-9]*)?$',
      { message: 'Class names should follow BEM pattern' },
    ],

    // Alphabetical property order
    'order/properties-alphabetical-order': true,

    // Max nesting depth
    'max-nesting-depth': 3,

    // No !important
    'declaration-no-important': true,

    // No ID selectors
    'selector-max-id': 0,

    // SCSS patterns
    'scss/dollar-variable-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
    'scss/at-mixin-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
  },
};
```

---

## Rules

### Property Order

Stylelint이 알파벳 순서를 강제합니다.

```scss
// ✅ DO: Alphabetical order
.card {
  background-color: var(--color-surface);
  border-radius: $radius-md;
  display: flex;
  padding: $spacing-md;
}
```

### Maximum 3 Levels Nesting

```scss
// ✅ DO: Shallow nesting with BEM
.card {
  &__header {
  }
  &__body {
  }
  &--featured {
  }
}

// ❌ DON'T: Deep nesting
.page {
  .container {
    .card {
      .cardHeader {
      } // Too deep!
    }
  }
}
```

### Patterns to Avoid

```scss
// ❌ DON'T: !important
.button {
  color: red !important;
}

// ❌ DON'T: ID selectors
#header {
}

// ❌ DON'T: Magic numbers
.modal {
  top: 47px;
}

// ❌ DON'T: Non-BEM naming
.button-primary {
} // Use .button--primary
.cardHeader {
} // Use .card__header
```

---

## AI Agent Tasks

- **Enforce BEM naming** (block\_\_element--modifier)
- Validate Stylelint configuration exists
- Check nesting depth (max 3 levels)
- Identify `!important` usage and suggest alternatives
- Verify no ID selectors in component styles
- Use `@use '@/styles/utils'` for importing variables/mixins
- Validate CSS Modules follow BEM pattern
- Ensure modifier classes are used for variants/states
- Check alphabetical property order

**References**:

- [BEM Methodology](http://getbem.com/)
- [Stylelint](https://stylelint.io/)
- [CSS Modules](https://github.com/css-modules/css-modules)
