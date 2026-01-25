---
paths:
  - '**/app/[locale]/**/*'
  - 'messages/*.json'
  - '**/i18n/**/*.ts'
---

# next-intl 4.0 Conventions

## Purpose

Enforce consistent internationalization patterns with next-intl v4. Provides type-safe translations, formatting, and navigation for Next.js App Router.

---

## Configuration

### Middleware Setup

```typescript
// ✅ DO: Configure middleware for locale detection
// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ko|en)/:path*'],
};
```

### Locale Configuration

```typescript
// ✅ DO: Define locale configuration with metadata
// i18n/config.ts
export type LocaleObject = {
  code: string;
  iso: string;
  dir: 'ltr' | 'rtl';
  name: string;
  isCatchallLocale?: boolean;
};

export const serviceLocales: LocaleObject[] = [
  {
    code: 'en',
    iso: 'en',
    dir: 'ltr',
    name: 'English',
    isCatchallLocale: true,
  },
  { code: 'ko', iso: 'ko-KR', dir: 'ltr', name: '한국어' },
  // Add more locales as needed (commented by default)
];

export const localeObjects: LocaleObject[] = [...serviceLocales];
export const locales = localeObjects.map((l) => l.code) as [
  string,
  ...string[],
];
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

// Utility functions
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale);
}

export function getLocaleObject(locale: string): LocaleObject | undefined {
  return localeObjects.find((l) => l.code === locale);
}

export function getLocaleDir(locale: string): 'ltr' | 'rtl' {
  return getLocaleObject(locale)?.dir ?? 'ltr';
}
```

### Routing Configuration

```typescript
// ✅ DO: Define routing configuration
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always', // or 'as-needed', 'never'
});
```

### Navigation Utilities

```typescript
// ✅ DO: Create typed navigation utilities
// i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

### Request Configuration

```typescript
// ✅ DO: Configure request handling
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate locale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

---

## Layout Setup

### Root Layout with Provider

```tsx
// ✅ DO: Set up locale provider in layout
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## Message Files

### Structure

```
messages/
├── en.json    # English (default)
└── ko.json    # Korean
```

### Message Format

```json
// ✅ DO: Structured message keys
// messages/ko.json
{
  "common": {
    "loading": "로딩 중...",
    "error": "오류가 발생했습니다",
    "retry": "다시 시도",
    "cancel": "취소",
    "confirm": "확인",
    "save": "저장",
    "delete": "삭제",
    "edit": "수정"
  },
  "auth": {
    "login": "로그인",
    "logout": "로그아웃",
    "signUp": "회원가입",
    "email": "이메일",
    "password": "비밀번호",
    "forgotPassword": "비밀번호 찾기"
  },
  "validation": {
    "required": "{field} 필수 입력입니다",
    "email": "올바른 이메일 형식이 아닙니다",
    "minLength": "{field}은(는) 최소 {min}자 이상이어야 합니다"
  },
  "user": {
    "greeting": "안녕하세요, {name}님!",
    "itemCount": "{count, plural, =0 {항목 없음} one {# 항목} other {# 항목}}"
  }
}
```

```json
// messages/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit"
  },
  "auth": {
    "login": "Log in",
    "logout": "Log out",
    "signUp": "Sign up",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot password"
  },
  "validation": {
    "required": "{field} is required",
    "email": "Invalid email format",
    "minLength": "{field} must be at least {min} characters"
  },
  "user": {
    "greeting": "Hello, {name}!",
    "itemCount": "{count, plural, =0 {No items} one {# item} other {# items}}"
  }
}
```

---

## Using Translations

### Server Components

```tsx
// ✅ DO: Use getTranslations in Server Components
// app/[locale]/page.tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('common');

  return (
    <div>
      <h1>{t('loading')}</h1>
      <button>{t('confirm')}</button>
    </div>
  );
}

// ✅ DO: Use namespace for specific sections
export default async function AuthPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('auth');

  return (
    <form>
      <label>{t('email')}</label>
      <label>{t('password')}</label>
      <button>{t('login')}</button>
    </form>
  );
}
```

### Client Components

```tsx
// ✅ DO: Use useTranslations in Client Components
'use client';

import { useTranslations } from 'next-intl';

export const LoginButton = () => {
  const t = useTranslations('auth');

  return <button>{t('login')}</button>;
};

// ✅ DO: Use multiple namespaces
export const UserProfile = () => {
  const tCommon = useTranslations('common');
  const tUser = useTranslations('user');

  return (
    <div>
      <h1>{tUser('greeting', { name: 'John' })}</h1>
      <button>{tCommon('edit')}</button>
    </div>
  );
};
```

---

## Interpolation and Formatting

### Variables

```tsx
// ✅ DO: Pass variables to translations
const t = useTranslations('user');

// Simple variable
t('greeting', { name: userName }); // "안녕하세요, John님!"

// Multiple variables
t('validation.minLength', { field: '비밀번호', min: 8 });
```

### Pluralization

```tsx
// ✅ DO: Use ICU plural syntax
// messages/ko.json
{
  "cart": {
    "items": "{count, plural, =0 {장바구니가 비어있습니다} one {# 상품} other {# 상품}}"
  }
}

// Usage
t('cart.items', { count: 0 });  // "장바구니가 비어있습니다"
t('cart.items', { count: 1 });  // "1 상품"
t('cart.items', { count: 5 });  // "5 상품"
```

### Rich Text

```tsx
// ✅ DO: Use rich text for formatted content
// messages/ko.json
{
  "terms": {
    "agreement": "<link>이용약관</link>에 동의합니다"
  }
}

// Usage
t.rich('terms.agreement', {
  link: (chunks) => <a href="/terms">{chunks}</a>,
});
```

---

## Date and Number Formatting

### Dates

```tsx
// ✅ DO: Use useFormatter for dates
'use client';

import { useFormatter } from 'next-intl';

export const DateDisplay = ({ date }: { date: Date }) => {
  const format = useFormatter();

  return (
    <div>
      {/* Relative time */}
      <span>{format.relativeTime(date)}</span>
      {/* "3일 전" or "3 days ago" */}

      {/* Formatted date */}
      <span>
        {format.dateTime(date, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
      {/* "2024년 1월 15일" or "January 15, 2024" */}
    </div>
  );
};
```

### Numbers and Currency

```tsx
// ✅ DO: Format numbers and currency
export const PriceDisplay = ({ price }: { price: number }) => {
  const format = useFormatter();

  return (
    <div>
      {/* Number */}
      <span>{format.number(1234567)}</span>
      {/* "1,234,567" or "1.234.567" */}

      {/* Currency */}
      <span>
        {format.number(price, {
          style: 'currency',
          currency: 'KRW',
        })}
      </span>
      {/* "₩50,000" */}

      {/* Percentage */}
      <span>
        {format.number(0.15, {
          style: 'percent',
        })}
      </span>
      {/* "15%" */}
    </div>
  );
};
```

---

## Navigation

### Locale-Aware Links

```tsx
// ✅ DO: Use next-intl Link for navigation
import { Link } from '@/i18n/navigation';

export const Navigation = () => {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/products/123">Product</Link>
    </nav>
  );
};

// ❌ DON'T: Use next/link directly (loses locale)
import Link from 'next/link';
<Link href="/about">About</Link>; // Missing locale prefix
```

### Programmatic Navigation

```tsx
// ✅ DO: Use useRouter from next-intl
'use client';

import { useRouter } from '@/i18n/navigation';

export const LoginForm = () => {
  const router = useRouter();

  const handleLogin = async () => {
    await login();
    router.push('/dashboard');
  };

  return <button onClick={handleLogin}>Login</button>;
};
```

### Locale Switcher

```tsx
// ✅ DO: Create locale switcher
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <select
      value={locale}
      onChange={(e) => switchLocale(e.target.value as Locale)}
    >
      <option value="ko">한국어</option>
      <option value="en">English</option>
    </select>
  );
};
```

---

## Type Safety

### Generate Types

```typescript
// ✅ DO: Create type definitions
// i18n/types.ts
import ko from '../../messages/ko.json';

export type Messages = typeof ko;

declare global {
  interface IntlMessages extends Messages {}
}
```

### Typed useTranslations

```tsx
// With proper types, you get autocomplete for:
const t = useTranslations('auth');

t('login'); // ✅ Autocomplete
t('invalidKey'); // ❌ TypeScript error
```

---

## Metadata

### Localized Metadata

```tsx
// ✅ DO: Generate localized metadata
// app/[locale]/page.tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('home.title'),
    description: t('home.description'),
  };
}
```

---

## File Organization

```
src/
├── i18n/
│   ├── config.ts       # Locale configuration
│   ├── routing.ts      # Routing configuration
│   ├── request.ts      # Request configuration
│   ├── navigation.ts   # Navigation utilities
│   └── types.ts        # Type definitions
├── messages/
│   ├── en.json         # English messages (default)
│   └── ko.json         # Korean messages
├── app/
│   └── [locale]/
│       ├── layout.tsx  # Locale provider
│       └── page.tsx    # Localized pages
└── middleware.ts       # Locale middleware
```

---

## AI Agent Tasks for next-intl Development

- Verify middleware.ts is configured with correct matcher
- Check routing.ts defines all supported locales
- Validate message files exist for all locales
- Ensure Server Components use getTranslations with setRequestLocale
- Check Client Components use useTranslations
- Verify navigation uses next-intl utilities (not next/link directly)
- Validate pluralization syntax in message files
- Check type definitions for IntlMessages
- Ensure metadata is localized

**References**:

- [next-intl Documentation](https://next-intl.dev/)
- [next-intl GitHub](https://github.com/amannn/next-intl)
