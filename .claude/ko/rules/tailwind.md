---
paths: '**/*.{tsx,jsx}'
---

# Tailwind CSS 4.0 컨벤션

## 목적

CSS 우선 설정을 사용한 일관된 Tailwind CSS v4 패턴을 적용합니다. Next.js App Router와 현대적인 반응형 디자인 관행에 맞춤.

---

## CSS 우선 설정 (v4)

### 테마 설정

```css
/* ✅ DO: CSS에서 @theme으로 테마 설정 */
/* app/globals.css */
@import 'tailwindcss';

@theme {
  /* 색상 */
  --color-primary: oklch(0.7 0.15 200);
  --color-primary-hover: oklch(0.65 0.15 200);
  --color-secondary: oklch(0.6 0.1 280);
  --color-background: oklch(0.98 0 0);
  --color-foreground: oklch(0.2 0 0);
  --color-muted: oklch(0.6 0 0);
  --color-border: oklch(0.9 0 0);
  --color-error: oklch(0.6 0.2 25);
  --color-success: oklch(0.6 0.15 145);

  /* 간격 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* 타이포그래피 */
  --font-sans: 'Pretendard', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;

  /* 반경 */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* 그림자 */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px oklch(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px oklch(0 0 0 / 0.1);

  /* 트랜지션 */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;

  /* 브레이크포인트 */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### 다크 모드 테마

```css
/* ✅ DO: CSS 변수로 다크 모드 */
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

/* 또는 클래스 기반 다크 모드 */
.dark {
  --color-background: oklch(0.15 0 0);
  --color-foreground: oklch(0.95 0 0);
}
```

---

## 클래스 패턴

### 컴포넌트 구조

```tsx
// ✅ DO: 일관된 클래스 순서
// 레이아웃 → 간격 → 크기 → 타이포그래피 → 색상 → 효과 → 상태
export const Button = ({ variant, children }: ButtonProps) => {
  return (
    <button
      className={cn(
        // 레이아웃
        'inline-flex items-center justify-center',
        // 간격
        'px-4 py-2 gap-2',
        // 크기
        'min-w-[120px]',
        // 타이포그래피
        'text-sm font-medium',
        // 색상 & 배경
        'bg-primary text-white',
        // 테두리 & 반경
        'rounded-md border border-transparent',
        // 효과
        'shadow-sm',
        // 트랜지션
        'transition-colors duration-fast',
        // 상태
        'hover:bg-primary-hover',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
};

// ❌ DON'T: 무작위 클래스 순서
<button className="hover:bg-blue-600 text-white px-4 flex bg-blue-500 py-2">
```

### cn() 유틸리티 사용

```typescript
// ✅ DO: 조건부 클래스에 cn 사용
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// 사용
const Card = ({ isActive, className }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        isActive && 'border-primary bg-primary/5',
        className // 부모로부터 오버라이드 허용
      )}
    />
  );
};

// ❌ DON'T: 문자열 연결
<div className={`rounded-lg ${isActive ? 'bg-blue-500' : ''}`}>
```

---

## 반응형 디자인

### 모바일 우선 접근

```tsx
// ✅ DO: 모바일 우선 반응형 디자인
<div
  className={cn(
    // 모바일 (기본)
    'flex flex-col gap-4 p-4',
    // 태블릿 (md: 768px+)
    'md:flex-row md:gap-6 md:p-6',
    // 데스크탑 (lg: 1024px+)
    'lg:gap-8 lg:p-8'
  )}
>
  <aside className="w-full md:w-64 lg:w-80">
    {/* 사이드바 */}
  </aside>
  <main className="flex-1">
    {/* 메인 콘텐츠 */}
  </main>
</div>

// ❌ DON'T: 데스크탑 우선 (유지보수 어려움)
<div className="flex-row gap-8 p-8 max-md:flex-col max-md:gap-4 max-md:p-4">
```

### 컨테이너 쿼리 (v4)

```tsx
// ✅ DO: 컴포넌트 레벨 반응형에 컨테이너 쿼리 사용
<div className="@container">
  <div
    className={cn(
      'flex flex-col gap-2',
      '@md:flex-row @md:gap-4', // 컨테이너 >= 28rem
      '@lg:gap-6' // 컨테이너 >= 32rem
    )}
  >
    {/* 콘텐츠 */}
  </div>
</div>
```

---

## 레이아웃 패턴

### Flexbox

```tsx
// ✅ DO: 일반적인 flex 패턴
// 중앙 정렬
<div className="flex items-center justify-center min-h-screen">

// 양 끝 정렬
<div className="flex items-center justify-between">

// 간격이 있는 스택
<div className="flex flex-col gap-4">

// 반응형 행/열
<div className="flex flex-col gap-4 md:flex-row md:gap-6">
```

### Grid

```tsx
// ✅ DO: 반응형 그리드 패턴
// 자동 맞춤 카드
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <Card key={item.id} item={item} />
  ))}
</div>

// 사이드바 레이아웃
<div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
  <aside>사이드바</aside>
  <main>콘텐츠</main>
</div>

// minmax로 자동 채우기
<div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
```

---

## 타이포그래피

```tsx
// ✅ DO: 일관된 타이포그래피 스케일
<article className="prose prose-lg dark:prose-invert max-w-none">
  <h1 className="text-3xl font-bold tracking-tight">제목</h1>
  <p className="text-muted text-lg leading-relaxed">설명</p>
</article>

// 제목 계층
<h1 className="text-3xl font-bold md:text-4xl">페이지 제목</h1>
<h2 className="text-2xl font-semibold">섹션 제목</h2>
<h3 className="text-xl font-medium">서브섹션</h3>

// 텍스트 유틸리티
<p className="text-sm text-muted">도움말 텍스트</p>
<p className="text-base leading-relaxed">본문 텍스트</p>
<span className="text-xs uppercase tracking-wide">라벨</span>
```

---

## 색상

### 시맨틱 색상

```tsx
// ✅ DO: 시맨틱 색상 이름 사용
<div className="bg-background text-foreground">
  <p className="text-muted">보조 텍스트</p>
  <div className="border-border rounded-md border">카드</div>
  <button className="bg-primary text-white hover:bg-primary-hover">
    액션
  </button>
  <span className="text-error">에러 메시지</span>
  <span className="text-success">성공 메시지</span>
</div>

// ❌ DON'T: 임의의 색상 값 사용
<div className="bg-[#1a1a1a] text-[#fafafa]">
<button className="bg-blue-500 hover:bg-blue-600">
```

### 투명도 수정자

```tsx
// ✅ DO: 투명도 수정자 사용
<div className="bg-primary/10">연한 primary 배경</div>
<div className="bg-foreground/50">50% 투명도 텍스트</div>
<div className="border-border/50">은은한 테두리</div>
```

---

## 인터랙티브 상태

### Hover, Focus, Active

```tsx
// ✅ DO: 완전한 인터랙티브 상태
<button
  className={cn(
    'bg-primary text-white',
    // Hover
    'hover:bg-primary-hover',
    // Focus (키보드 네비게이션)
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    // Active (눌림)
    'active:scale-[0.98]',
    // Disabled
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary'
  )}
>
  버튼
</button>

// ✅ DO: 키보드만을 위한 focus-visible
<a
  className={cn(
    'text-primary underline-offset-4',
    'hover:underline',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
  )}
>
  링크
</a>
```

### Group과 Peer

```tsx
// ✅ DO: 부모-자식 상호작용에 group 사용
<div className="group cursor-pointer rounded-lg border p-4 hover:border-primary">
  <h3 className="font-medium group-hover:text-primary">제목</h3>
  <p className="text-muted group-hover:text-foreground">설명</p>
  <ArrowIcon className="opacity-0 transition-opacity group-hover:opacity-100" />
</div>

// ✅ DO: 형제 상호작용에 peer 사용
<div>
  <input type="checkbox" className="peer sr-only" id="toggle" />
  <label
    htmlFor="toggle"
    className="block cursor-pointer rounded bg-muted peer-checked:bg-primary"
  >
    토글
  </label>
</div>
```

---

## 애니메이션

### 트랜지션

```tsx
// ✅ DO: 부드러운 트랜지션
<div
  className={cn(
    'duration-normal transition-all ease-out',
    // 또는 특정 속성
    'duration-fast transition-colors',
    'duration-slow transition-transform'
  )}
>
  콘텐츠
</div>
```

### 키프레임 애니메이션

```css
/* ✅ DO: CSS에서 애니메이션 정의 */
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
// 사용
<div className="animate-fade-in">페이드 인</div>
<div className="animate-slide-up">슬라이드 업</div>
<Spinner className="animate-spin" />
```

---

## 간격 시스템

```tsx
// ✅ DO: 일관된 간격 스케일
// 테마 정의 간격 값 사용
<div className="p-md">패딩 중간 (1rem)</div>
<div className="m-lg">마진 큰 (1.5rem)</div>
<div className="gap-sm">갭 작은 (0.5rem)</div>

// 표준 Tailwind 간격도 작동
<div className="p-4 m-6 gap-2">표준 간격</div>

// ✅ DO: 일관된 컴포넌트 간격
<section className="py-xl md:py-2xl">
  <div className="mx-auto max-w-7xl px-md">
    <div className="space-y-lg">
      {/* 콘텐츠 */}
    </div>
  </div>
</section>
```

---

## 임의의 값

```tsx
// ✅ DO: 임의의 값은 드물게 사용
// 테마 값이 맞지 않을 때
<div className="w-[calc(100%-2rem)]">
<div className="grid-cols-[1fr_2fr_1fr]">
<div className="top-[var(--header-height)]">

// ❌ DON'T: 임의의 값 남용
<div className="p-[13px] m-[7px] text-[15px]"> // 대신 테마 값 사용
```

---

## 컴포넌트 예시

### Card 컴포넌트

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

### Input 컴포넌트

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

## AI 에이전트 Tailwind 개발 작업

- globals.css에서 @theme 설정 확인 (v4 CSS 우선)
- 클래스 순서 일관성 확인 (레이아웃 → 간격 → 크기 → 타이포그래피 → 색상 → 효과 → 상태)
- 조건부 클래스에 cn() 사용 검증
- 모바일 우선 반응형 디자인 보장
- 시맨틱 색상 사용 확인 (임의의 hex 값 아님)
- 완전한 인터랙티브 상태 확인 (hover, focus, active, disabled)
- 트랜지션/애니메이션 사용 검증
- 임의의 값 남용 확인
- 다크 모드 지원 보장

**참조**:

- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [Tailwind CSS GitHub](https://github.com/tailwindlabs/tailwindcss)
