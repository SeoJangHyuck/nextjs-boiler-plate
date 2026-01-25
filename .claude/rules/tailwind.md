---
paths: '**/*.{tsx,jsx}'
---

# Tailwind CSS 4.0 Conventions

## Purpose

Enforce consistent Tailwind CSS v4 patterns with CSS-first configuration. Aligned with Next.js App Router and modern responsive design practices.

---

## CSS-First Configuration (v4)

### Theme Configuration

```css
/* ✅ DO: Configure theme in CSS with @theme */
/* app/globals.css */
@import 'tailwindcss';

@theme {
  /* Colors */
  --color-primary: oklch(0.7 0.15 200);
  --color-primary-hover: oklch(0.65 0.15 200);
  --color-secondary: oklch(0.6 0.1 280);
  --color-background: oklch(0.98 0 0);
  --color-foreground: oklch(0.2 0 0);
  --color-muted: oklch(0.6 0 0);
  --color-border: oklch(0.9 0 0);
  --color-error: oklch(0.6 0.2 25);
  --color-success: oklch(0.6 0.15 145);

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Typography */
  --font-sans: 'Pretendard', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px oklch(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px oklch(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Dark Mode Theme

```css
/* ✅ DO: Dark mode with CSS variables */
@theme {
  --color-background: oklch(0.98 0 0);
  --color-foreground: oklch(0.2 0 0);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: oklch(0.15 0 0);
    --color-foreground: oklch(0.95 0 0);
  }
}

/* Or with class-based dark mode */
.dark {
  --color-background: oklch(0.15 0 0);
  --color-foreground: oklch(0.95 0 0);
}
```

---

## Class Patterns

### Component Structure

```tsx
// ✅ DO: Consistent class ordering
// Layout → Spacing → Sizing → Typography → Colors → Effects → States
export const Button = ({ variant, children }: ButtonProps) => {
  return (
    <button
      className={cn(
        // Layout
        'inline-flex items-center justify-center',
        // Spacing
        'px-4 py-2 gap-2',
        // Sizing
        'min-w-[120px]',
        // Typography
        'text-sm font-medium',
        // Colors & Background
        'bg-primary text-white',
        // Border & Radius
        'rounded-md border border-transparent',
        // Effects
        'shadow-sm',
        // Transitions
        'transition-colors duration-fast',
        // States
        'hover:bg-primary-hover',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
};

// ❌ DON'T: Random class ordering
<button className="hover:bg-blue-600 text-white px-4 flex bg-blue-500 py-2">
```

### Using cn() Utility

```typescript
// ✅ DO: Use cn for conditional classes
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Usage
const Card = ({ isActive, className }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        isActive && 'border-primary bg-primary/5',
        className // Allow overrides from parent
      )}
    />
  );
};

// ❌ DON'T: String concatenation
<div className={`rounded-lg ${isActive ? 'bg-blue-500' : ''}`}>
```

---

## Responsive Design

### Mobile-First Approach

```tsx
// ✅ DO: Mobile-first responsive design
<div
  className={cn(
    // Mobile (default)
    'flex flex-col gap-4 p-4',
    // Tablet (md: 768px+)
    'md:flex-row md:gap-6 md:p-6',
    // Desktop (lg: 1024px+)
    'lg:gap-8 lg:p-8'
  )}
>
  <aside className="w-full md:w-64 lg:w-80">
    {/* Sidebar */}
  </aside>
  <main className="flex-1">
    {/* Main content */}
  </main>
</div>

// ❌ DON'T: Desktop-first (harder to maintain)
<div className="flex-row gap-8 p-8 max-md:flex-col max-md:gap-4 max-md:p-4">
```

### Container Queries (v4)

```tsx
// ✅ DO: Use container queries for component-level responsiveness
<div className="@container">
  <div
    className={cn(
      'flex flex-col gap-2',
      '@md:flex-row @md:gap-4', // When container >= 28rem
      '@lg:gap-6' // When container >= 32rem
    )}
  >
    {/* Content */}
  </div>
</div>
```

---

## Layout Patterns

### Flexbox

```tsx
// ✅ DO: Common flex patterns
// Center content
<div className="flex items-center justify-center min-h-screen">

// Space between
<div className="flex items-center justify-between">

// Stack with gap
<div className="flex flex-col gap-4">

// Responsive row/column
<div className="flex flex-col gap-4 md:flex-row md:gap-6">
```

### Grid

```tsx
// ✅ DO: Responsive grid patterns
// Auto-fit cards
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <Card key={item.id} item={item} />
  ))}
</div>

// Sidebar layout
<div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
  <aside>Sidebar</aside>
  <main>Content</main>
</div>

// Auto-fill with minmax
<div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
```

---

## Typography

```tsx
// ✅ DO: Consistent typography scale
<article className="prose prose-lg dark:prose-invert max-w-none">
  <h1 className="text-3xl font-bold tracking-tight">Title</h1>
  <p className="text-muted text-lg leading-relaxed">Description</p>
</article>

// Heading hierarchy
<h1 className="text-3xl font-bold md:text-4xl">Page Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<h3 className="text-xl font-medium">Subsection</h3>

// Text utilities
<p className="text-sm text-muted">Helper text</p>
<p className="text-base leading-relaxed">Body text</p>
<span className="text-xs uppercase tracking-wide">Label</span>
```

---

## Colors

### Semantic Colors

```tsx
// ✅ DO: Use semantic color names
<div className="bg-background text-foreground">
  <p className="text-muted">Secondary text</p>
  <div className="border-border rounded-md border">Card</div>
  <button className="bg-primary text-white hover:bg-primary-hover">
    Action
  </button>
  <span className="text-error">Error message</span>
  <span className="text-success">Success message</span>
</div>

// ❌ DON'T: Use arbitrary color values
<div className="bg-[#1a1a1a] text-[#fafafa]">
<button className="bg-blue-500 hover:bg-blue-600">
```

### Opacity Modifiers

```tsx
// ✅ DO: Use opacity modifiers
<div className="bg-primary/10">Light primary background</div>
<div className="bg-foreground/50">50% opacity text</div>
<div className="border-border/50">Subtle border</div>
```

---

## Interactive States

### Hover, Focus, Active

```tsx
// ✅ DO: Complete interactive states
<button
  className={cn(
    'bg-primary text-white',
    // Hover
    'hover:bg-primary-hover',
    // Focus (keyboard navigation)
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    // Active (pressed)
    'active:scale-[0.98]',
    // Disabled
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary'
  )}
>
  Button
</button>

// ✅ DO: Focus-visible for keyboard only
<a
  className={cn(
    'text-primary underline-offset-4',
    'hover:underline',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
  )}
>
  Link
</a>
```

### Group and Peer

```tsx
// ✅ DO: Use group for parent-child interactions
<div className="group cursor-pointer rounded-lg border p-4 hover:border-primary">
  <h3 className="font-medium group-hover:text-primary">Title</h3>
  <p className="text-muted group-hover:text-foreground">Description</p>
  <ArrowIcon className="opacity-0 transition-opacity group-hover:opacity-100" />
</div>

// ✅ DO: Use peer for sibling interactions
<div>
  <input type="checkbox" className="peer sr-only" id="toggle" />
  <label
    htmlFor="toggle"
    className="block cursor-pointer rounded bg-muted peer-checked:bg-primary"
  >
    Toggle
  </label>
</div>
```

---

## Animations

### Transitions

```tsx
// ✅ DO: Smooth transitions
<div
  className={cn(
    'duration-normal transition-all ease-out',
    // Or specific properties
    'duration-fast transition-colors',
    'duration-slow transition-transform'
  )}
>
  Content
</div>
```

### Keyframe Animations

```css
/* ✅ DO: Define animations in CSS */
@theme {
  --animate-fade-in: fade-in 0.2s ease-out;
  --animate-slide-up: slide-up 0.3s ease-out;
  --animate-spin: spin 1s linear infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

```tsx
// Usage
<div className="animate-fade-in">Fades in</div>
<div className="animate-slide-up">Slides up</div>
<Spinner className="animate-spin" />
```

---

## Spacing System

```tsx
// ✅ DO: Consistent spacing scale
// Use theme-defined spacing values
<div className="p-md">Padding medium (1rem)</div>
<div className="m-lg">Margin large (1.5rem)</div>
<div className="gap-sm">Gap small (0.5rem)</div>

// Standard Tailwind spacing also works
<div className="p-4 m-6 gap-2">Standard spacing</div>

// ✅ DO: Consistent component spacing
<section className="py-xl md:py-2xl">
  <div className="mx-auto max-w-7xl px-md">
    <div className="space-y-lg">
      {/* Content */}
    </div>
  </div>
</section>
```

---

## Arbitrary Values

```tsx
// ✅ DO: Use arbitrary values sparingly
// When theme values don't fit
<div className="w-[calc(100%-2rem)]">
<div className="grid-cols-[1fr_2fr_1fr]">
<div className="top-[var(--header-height)]">

// ❌ DON'T: Overuse arbitrary values
<div className="p-[13px] m-[7px] text-[15px]"> // Use theme values instead
```

---

## Component Examples

### Card Component

```tsx
export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        'border-border bg-background p-md rounded-lg border shadow-sm',
        'duration-fast transition-shadow',
        'hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
};
```

### Input Component

```tsx
export const Input = ({ error, className, ...props }: InputProps) => {
  return (
    <input
      className={cn(
        'border-border bg-background w-full rounded-md border px-3 py-2',
        'text-foreground placeholder:text-muted text-sm',
        'duration-fast transition-colors',
        'focus:border-primary focus:ring-primary focus:ring-1 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-error focus:border-error focus:ring-error',
        className
      )}
      {...props}
    />
  );
};
```

---

## AI Agent Tasks for Tailwind Development

- Verify @theme configuration in globals.css (v4 CSS-first)
- Check class ordering consistency (layout → spacing → sizing → typography → colors → effects → states)
- Validate cn() usage for conditional classes
- Ensure mobile-first responsive design
- Check semantic color usage (not arbitrary hex values)
- Verify complete interactive states (hover, focus, active, disabled)
- Validate transition/animation usage
- Check for arbitrary value overuse
- Ensure dark mode support

**References**:

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS GitHub](https://github.com/tailwindlabs/tailwindcss)
