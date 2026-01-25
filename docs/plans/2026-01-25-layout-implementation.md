# Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 범용 보일러플레이트를 위한 Header-Content-Footer 레이아웃 구현

**Architecture:** Tailwind CSS + SCSS 모듈 기반의 컴포넌트 구조. Desktop에서는 풀 헤더, Tablet/Mobile에서는 햄버거 메뉴로 전환. Zustand로 모바일 메뉴 상태 관리.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, SCSS Modules, next-intl, Zustand

---

## Task 1: Container 컴포넌트 생성

max-width 1280px, 반응형 패딩을 적용하는 레이아웃 래퍼 컴포넌트

**Files:**

- Create: `src/components/layout/Container.tsx`

**Step 1: Container 컴포넌트 작성**

```tsx
// src/components/layout/Container.tsx
import { cn } from '@/lib/utils';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1280px]',
        'px-4 md:px-6 lg:px-10',
        className
      )}
    >
      {children}
    </div>
  );
};
```

**Step 2: 빌드 검증**

Run: `pnpm type-check`
Expected: 에러 없이 통과

**Step 3: Commit**

```bash
git add src/components/layout/Container.tsx
git commit -m "feat(layout): add Container component with responsive padding"
```

---

## Task 2: Logo 컴포넌트 생성

헤더와 푸터에서 공용으로 사용하는 로고 컴포넌트

**Files:**

- Create: `src/components/layout/Logo.tsx`

**Step 1: Logo 컴포넌트 작성**

```tsx
// src/components/layout/Logo.tsx
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/" className={cn('text-xl font-bold', className)}>
      Logo
    </Link>
  );
};
```

**Step 2: 빌드 검증**

Run: `pnpm type-check`
Expected: 에러 없이 통과

**Step 3: Commit**

```bash
git add src/components/layout/Logo.tsx
git commit -m "feat(layout): add Logo component"
```

---

## Task 3: HeaderActions 컴포넌트 생성

로그인 버튼과 Locale 전환 버튼을 담는 컴포넌트

**Files:**

- Create: `src/components/layout/Header/HeaderActions.tsx`

**Step 1: HeaderActions 컴포넌트 작성**

```tsx
// src/components/layout/Header/HeaderActions.tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';

type HeaderActionsProps = {
  className?: string;
};

export const HeaderActions = ({ className }: HeaderActionsProps) => {
  const t = useTranslations('language');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Link
        href="/login"
        className="hover:text-primary text-sm font-medium transition-colors"
      >
        Login
      </Link>
      <button
        onClick={toggleLocale}
        className="hover:text-primary text-sm font-medium transition-colors"
        type="button"
      >
        {locale === 'ko' ? t('en') : t('ko')}
      </button>
    </div>
  );
};
```

**Step 2: 빌드 검증**

Run: `pnpm type-check`
Expected: 에러 없이 통과

**Step 3: Commit**

```bash
git add src/components/layout/Header/HeaderActions.tsx
git commit -m "feat(layout): add HeaderActions component with login and locale toggle"
```

---

## Task 4: GNB 컴포넌트 생성

데스크톱용 글로벌 네비게이션 바

**Files:**

- Create: `src/components/layout/Header/GNB.tsx`
- Modify: `messages/ko.json` (메뉴 항목 추가)
- Modify: `messages/en.json` (메뉴 항목 추가)

**Step 1: 번역 파일에 메뉴 항목 추가**

`messages/ko.json`에 gnb 섹션 추가:

```json
{
  "gnb": {
    "menu1": "메뉴 1",
    "menu2": "메뉴 2",
    "menu3": "메뉴 3"
  }
}
```

`messages/en.json`에 gnb 섹션 추가:

```json
{
  "gnb": {
    "menu1": "Menu 1",
    "menu2": "Menu 2",
    "menu3": "Menu 3"
  }
}
```

**Step 2: GNB 컴포넌트 작성**

```tsx
// src/components/layout/Header/GNB.tsx
'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';

type GNBProps = {
  className?: string;
};

const NAV_ITEMS = [
  { key: 'menu1', href: '/menu1' },
  { key: 'menu2', href: '/menu2' },
  { key: 'menu3', href: '/menu3' },
] as const;

export const GNB = ({ className }: GNBProps) => {
  const t = useTranslations('gnb');

  return (
    <nav className={cn('hidden items-center gap-8 lg:flex', className)}>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className="hover:text-primary text-sm font-medium transition-colors"
        >
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
};
```

**Step 3: 빌드 검증**

Run: `pnpm type-check`
Expected: 에러 없이 통과

**Step 4: Commit**

```bash
git add src/components/layout/Header/GNB.tsx messages/ko.json messages/en.json
git commit -m "feat(layout): add GNB component with navigation items"
```

---

## Task 5: UI Store 생성 (모바일 메뉴 상태)

모바일 메뉴 열림/닫힘 상태를 관리하는 Zustand store

**Files:**

- Create: `src/stores/uiStore.ts`
- Modify: `src/stores/index.ts` (export 추가)

**Step 1: UI Store 작성**

```typescript
// src/stores/uiStore.ts
import { create } from 'zustand';

type UIState = {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
```

**Step 2: stores/index.ts 수정**

```typescript
// src/stores/index.ts
export { useUIStore } from './uiStore';
```

**Step 3: 빌드 검증**

Run: `pnpm type-check`
Expected: 에러 없이 통과

**Step 4: Commit**

```bash
git add src/stores/uiStore.ts src/stores/index.ts
git commit -m "feat(stores): add UI store for mobile menu state"
```

---

## Task 6: MobileMenu 컴포넌트 생성

햄버거 버튼과 드로어/오버레이 메뉴

**Files:**

- Create: `src/components/layout/Header/MobileMenu.tsx`
- Create: `src/components/layout/Header/MobileMenu.module.scss`

**Step 1: MobileMenu SCSS 모듈 작성**

```scss
// src/components/layout/Header/MobileMenu.module.scss
@use '@/styles/utils' as *;

.overlay {
  background-color: rgb(0 0 0 / 50%);
  inset: 0;
  opacity: 0;
  position: fixed;
  transition: opacity var(--transition-normal);
  visibility: hidden;
  z-index: $z-index-modal-backdrop;

  &--open {
    opacity: 1;
    visibility: visible;
  }
}

.drawer {
  background-color: var(--color-background);
  height: 100%;
  max-width: 320px;
  position: fixed;
  right: 0;
  top: 0;
  transform: translateX(100%);
  transition: transform var(--transition-normal);
  width: 100%;
  z-index: $z-index-modal;

  @include mobile-only {
    max-width: 100%;
  }

  &--open {
    transform: translateX(0);
  }
}

.drawerHeader {
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  padding: $spacing-md;
}

.drawerNav {
  display: flex;
  flex-direction: column;
  padding: $spacing-md;
}

.navItem {
  padding: $spacing-sm 0;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-primary);
  }
}
```

**Step 2: MobileMenu 컴포넌트 작성**

```tsx
// src/components/layout/Header/MobileMenu.tsx
'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { useUIStore } from '@/stores';
import { HeaderActions } from './HeaderActions';
import { cn } from '@/lib/utils';
import styles from './MobileMenu.module.scss';

const NAV_ITEMS = [
  { key: 'menu1', href: '/menu1' },
  { key: 'menu2', href: '/menu2' },
  { key: 'menu3', href: '/menu3' },
] as const;

export const MobileMenu = () => {
  const t = useTranslations('gnb');
  const { isMobileMenuOpen, closeMobileMenu, toggleMobileMenu } = useUIStore();

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        type="button"
        onClick={toggleMobileMenu}
        className="p-2 lg:hidden"
        aria-label="메뉴 열기"
        aria-expanded={isMobileMenuOpen}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* 오버레이 */}
      <div
        className={cn(
          styles.overlay,
          isMobileMenuOpen && styles['overlay--open']
        )}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* 드로어 */}
      <aside
        className={cn(
          styles.drawer,
          isMobileMenuOpen && styles['drawer--open']
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles.drawerHeader}>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="p-2"
            aria-label="메뉴 닫기"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <HeaderActions />
        </div>

        <nav className={styles.drawerNav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={styles.navItem}
              onClick={closeMobileMenu}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};
```

**Step 3: 빌드 검증**

Run: `pnpm type-check && pnpm lint:css`
Expected: 에러 없이 통과

**Step 4: Commit**

```bash
git add src/components/layout/Header/MobileMenu.tsx src/components/layout/Header/MobileMenu.module.scss
git commit -m "feat(layout): add MobileMenu component with drawer and overlay"
```

---

## Task 7: Header 컴포넌트 생성

전체 헤더 컨테이너

**Files:**

- Create: `src/components/layout/Header/index.tsx`

**Step 1: Header 컴포넌트 작성**

```tsx
// src/components/layout/Header/index.tsx
import { Container } from '../Container';
import { Logo } from '../Logo';
import { GNB } from './GNB';
import { HeaderActions } from './HeaderActions';
import { MobileMenu } from './MobileMenu';

export const Header = () => {
  return (
    <header className="z-sticky bg-background border-border sticky top-0 border-b">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Logo />

          {/* Desktop: GNB */}
          <GNB />

          {/* Desktop: Actions */}
          <div className="hidden lg:flex">
            <HeaderActions />
          </div>

          {/* Mobile/Tablet: 햄버거 메뉴 */}
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
};
```

**Step 2: 빌드 검증**

Run: `pnpm type-check`
Expected: 에러 없이 통과

**Step 3: Commit**

```bash
git add src/components/layout/Header/index.tsx
git commit -m "feat(layout): add Header component combining all header parts"
```

---

## Task 8: Footer 컴포넌트 생성

로고와 Copyright를 중앙 정렬로 표시

**Files:**

- Create: `src/components/layout/Footer/index.tsx`

**Step 1: Footer 컴포넌트 작성**

```tsx
// src/components/layout/Footer/index.tsx
import { Container } from '../Container';
import { Logo } from '../Logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border border-t py-8">
      <Container>
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <p className="text-muted text-sm">
            © {currentYear} Company. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};
```

**Step 2: 빌드 검증**

Run: `pnpm type-check`
Expected: 에러 없이 통과

**Step 3: Commit**

```bash
git add src/components/layout/Footer/index.tsx
git commit -m "feat(layout): add Footer component with logo and copyright"
```

---

## Task 9: Layout 컴포넌트 barrel export 생성

레이아웃 컴포넌트들의 진입점

**Files:**

- Create: `src/components/layout/index.ts`

**Step 1: Barrel export 작성**

```typescript
// src/components/layout/index.ts
export { Container } from './Container';
export { Logo } from './Logo';
export { Header } from './Header';
export { Footer } from './Footer';
```

**Step 2: 빌드 검증**

Run: `pnpm type-check`
Expected: 에러 없이 통과

**Step 3: Commit**

```bash
git add src/components/layout/index.ts
git commit -m "feat(layout): add barrel export for layout components"
```

---

## Task 10: LocaleLayout에 레이아웃 적용

App Router의 locale layout에 Header, Footer, Container 적용

**Files:**

- Modify: `src/app/[locale]/layout.tsx`

**Step 1: Layout 수정**

```tsx
// src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/lib/i18n/routing';
import { Providers } from '@/components/providers';
import { Header, Footer, Container } from '@/components/layout';
import '@/styles/globals.scss';
import '@/styles/tailwind.css';

const pretendard = localFont({
  src: '../../fonts/pretendard/web/variable/woff2/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
});

export const metadata: Metadata = {
  title: 'Next.js Boilerplate',
  description: 'Next.js 16 보일러플레이트',
};

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ko' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={pretendard.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                <Container>{children}</Container>
              </main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Step 2: 개발 서버로 시각적 확인**

Run: `pnpm dev`
Expected: 브라우저에서 헤더-컨텐츠-푸터 레이아웃 확인

**Step 3: 빌드 검증**

Run: `pnpm build`
Expected: 에러 없이 빌드 성공

**Step 4: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat(layout): integrate Header, Footer, Container into LocaleLayout"
```

---

## Task 11: z-index CSS 변수 추가

Tailwind에서 z-sticky 클래스 사용을 위한 CSS 변수 추가

**Files:**

- Modify: `src/styles/tailwind.css`

**Step 1: Tailwind CSS에 z-index 테마 추가**

```css
/* src/styles/tailwind.css */
@import 'tailwindcss';

@theme {
  --z-sticky: 200;
  --z-modal-backdrop: 400;
  --z-modal: 500;
}
```

**Step 2: 빌드 검증**

Run: `pnpm type-check && pnpm build`
Expected: 에러 없이 통과

**Step 3: Commit**

```bash
git add src/styles/tailwind.css
git commit -m "feat(styles): add z-index CSS variables to Tailwind theme"
```

---

## Task 12: 색상 CSS 변수 추가

Tailwind에서 사용할 시맨틱 색상 변수 추가

**Files:**

- Modify: `src/styles/tailwind.css`

**Step 1: Tailwind CSS에 색상 테마 추가**

```css
/* src/styles/tailwind.css */
@import 'tailwindcss';

@theme {
  /* Z-Index */
  --z-sticky: 200;
  --z-modal-backdrop: 400;
  --z-modal: 500;

  /* Colors */
  --color-background: var(--color-background);
  --color-foreground: var(--color-text-primary);
  --color-primary: var(--color-primary);
  --color-muted: var(--color-text-secondary);
  --color-border: var(--color-border);
}
```

**Step 2: \_colors.scss에 border 색상 추가 (없는 경우)**

`src/styles/_colors.scss`의 :root에 추가:

```scss
:root {
  --color-border: rgb(255 255 255 / 10%);
  --color-text-secondary: rgb(255 255 255 / 60%);
}
```

**Step 3: 빌드 검증**

Run: `pnpm build`
Expected: 에러 없이 통과

**Step 4: Commit**

```bash
git add src/styles/tailwind.css src/styles/_colors.scss
git commit -m "feat(styles): add semantic color variables to Tailwind theme"
```

---

## Task 13: 최종 통합 테스트

전체 레이아웃 동작 확인

**Step 1: 개발 서버 실행**

Run: `pnpm dev`

**Step 2: 데스크톱 레이아웃 확인**

- [ ] 헤더 sticky 동작
- [ ] 로고 표시
- [ ] GNB 메뉴 표시 (1024px 이상)
- [ ] 로그인/Locale 버튼 표시
- [ ] 컨텐츠 중앙 정렬 (max-width 1280px)
- [ ] 푸터 로고 + Copyright 표시

**Step 3: 태블릿 레이아웃 확인 (768px ~ 1023px)**

- [ ] 햄버거 메뉴 표시
- [ ] 드로어 320px 너비로 열림
- [ ] 배경 딤처리
- [ ] ESC 키로 닫힘

**Step 4: 모바일 레이아웃 확인 (767px 이하)**

- [ ] 햄버거 메뉴 표시
- [ ] 풀스크린 오버레이로 열림
- [ ] 메뉴 클릭 시 닫힘

**Step 5: Locale 전환 확인**

- [ ] 한국어 ↔ English 전환 동작

**Step 6: 빌드 및 린트 최종 확인**

Run: `pnpm lint && pnpm lint:css && pnpm type-check && pnpm build`
Expected: 모든 검사 통과

**Step 7: 최종 Commit (필요시)**

```bash
git add -A
git commit -m "feat(layout): complete layout implementation"
```

---

## Summary

| Task | Component       | Description              |
| ---- | --------------- | ------------------------ |
| 1    | Container       | max-width 1280px 래퍼    |
| 2    | Logo            | 공용 로고 컴포넌트       |
| 3    | HeaderActions   | 로그인 + Locale 전환     |
| 4    | GNB             | 데스크톱 네비게이션      |
| 5    | uiStore         | 모바일 메뉴 상태 관리    |
| 6    | MobileMenu      | 햄버거 + 드로어/오버레이 |
| 7    | Header          | 전체 헤더 컨테이너       |
| 8    | Footer          | 로고 + Copyright         |
| 9    | layout/index.ts | Barrel export            |
| 10   | LocaleLayout    | 레이아웃 통합            |
| 11   | tailwind.css    | z-index 변수             |
| 12   | tailwind.css    | 색상 변수                |
| 13   | 통합 테스트     | 전체 동작 확인           |
