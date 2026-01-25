---
paths:
  - '**/app/[locale]/**/*'
  - 'messages/*.json'
  - '**/i18n/**/*.ts'
---

# next-intl 4.0 컨벤션

## 목적

next-intl v4를 사용한 일관된 국제화 패턴을 적용합니다. Next.js App Router를 위한 타입 안전 번역, 포맷팅, 네비게이션을 제공합니다.

---

## 설정

### 미들웨어 설정

```typescript
// ✅ DO: 로케일 감지를 위한 미들웨어 설정
// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ko|en)/:path*'],
};
```

### Locale 설정

```typescript
// ✅ DO: 메타데이터와 함께 locale 설정 정의
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
  // 필요시 추가 로케일 추가 (기본적으로 주석 처리)
];

export const localeObjects: LocaleObject[] = [...serviceLocales];
export const locales = localeObjects.map((l) => l.code) as [
  string,
  ...string[],
];
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

// 유틸리티 함수
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

### 라우팅 설정

```typescript
// ✅ DO: 라우팅 설정 정의
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always', // 또는 'as-needed', 'never'
});
```

### 네비게이션 유틸리티

```typescript
// ✅ DO: 타입된 네비게이션 유틸리티 생성
// i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

### 요청 설정

```typescript
// ✅ DO: 요청 처리 설정
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // 로케일 검증
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

## 레이아웃 설정

### Provider가 있는 루트 레이아웃

```tsx
// ✅ DO: 레이아웃에서 로케일 provider 설정
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

## 메시지 파일

### 구조

```
messages/
├── en.json    # 영어 (기본)
└── ko.json    # 한국어
```

### 메시지 형식

```json
// ✅ DO: 구조화된 메시지 키
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

## 번역 사용

### 서버 컴포넌트

```tsx
// ✅ DO: 서버 컴포넌트에서 getTranslations 사용
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

// ✅ DO: 특정 섹션에 namespace 사용
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

### 클라이언트 컴포넌트

```tsx
// ✅ DO: 클라이언트 컴포넌트에서 useTranslations 사용
'use client';

import { useTranslations } from 'next-intl';

export const LoginButton = () => {
  const t = useTranslations('auth');

  return <button>{t('login')}</button>;
};

// ✅ DO: 여러 namespace 사용
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

## 보간 및 포맷팅

### 변수

```tsx
// ✅ DO: 번역에 변수 전달
const t = useTranslations('user');

// 단순 변수
t('greeting', { name: userName }); // "안녕하세요, John님!"

// 여러 변수
t('validation.minLength', { field: '비밀번호', min: 8 });
```

### 복수형

```tsx
// ✅ DO: ICU 복수형 문법 사용
// messages/ko.json
{
  "cart": {
    "items": "{count, plural, =0 {장바구니가 비어있습니다} one {# 상품} other {# 상품}}"
  }
}

// 사용
t('cart.items', { count: 0 });  // "장바구니가 비어있습니다"
t('cart.items', { count: 1 });  // "1 상품"
t('cart.items', { count: 5 });  // "5 상품"
```

### 리치 텍스트

```tsx
// ✅ DO: 포맷된 콘텐츠에 리치 텍스트 사용
// messages/ko.json
{
  "terms": {
    "agreement": "<link>이용약관</link>에 동의합니다"
  }
}

// 사용
t.rich('terms.agreement', {
  link: (chunks) => <a href="/terms">{chunks}</a>,
});
```

---

## 날짜 및 숫자 포맷팅

### 날짜

```tsx
// ✅ DO: 날짜에 useFormatter 사용
'use client';

import { useFormatter } from 'next-intl';

export const DateDisplay = ({ date }: { date: Date }) => {
  const format = useFormatter();

  return (
    <div>
      {/* 상대 시간 */}
      <span>{format.relativeTime(date)}</span>
      {/* "3일 전" 또는 "3 days ago" */}

      {/* 포맷된 날짜 */}
      <span>
        {format.dateTime(date, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
      {/* "2024년 1월 15일" 또는 "January 15, 2024" */}
    </div>
  );
};
```

### 숫자 및 통화

```tsx
// ✅ DO: 숫자와 통화 포맷팅
export const PriceDisplay = ({ price }: { price: number }) => {
  const format = useFormatter();

  return (
    <div>
      {/* 숫자 */}
      <span>{format.number(1234567)}</span>
      {/* "1,234,567" 또는 "1.234.567" */}

      {/* 통화 */}
      <span>
        {format.number(price, {
          style: 'currency',
          currency: 'KRW',
        })}
      </span>
      {/* "₩50,000" */}

      {/* 퍼센트 */}
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

## 네비게이션

### 로케일 인식 링크

```tsx
// ✅ DO: 네비게이션에 next-intl Link 사용
import { Link } from '@/i18n/navigation';

export const Navigation = () => {
  return (
    <nav>
      <Link href="/">홈</Link>
      <Link href="/about">소개</Link>
      <Link href="/products/123">상품</Link>
    </nav>
  );
};

// ❌ DON'T: next/link 직접 사용 (로케일 손실)
import Link from 'next/link';
<Link href="/about">소개</Link>; // 로케일 접두사 누락
```

### 프로그래매틱 네비게이션

```tsx
// ✅ DO: next-intl의 useRouter 사용
'use client';

import { useRouter } from '@/i18n/navigation';

export const LoginForm = () => {
  const router = useRouter();

  const handleLogin = async () => {
    await login();
    router.push('/dashboard');
  };

  return <button onClick={handleLogin}>로그인</button>;
};
```

### 로케일 전환기

```tsx
// ✅ DO: 로케일 전환기 생성
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

## 타입 안전성

### 타입 생성

```typescript
// ✅ DO: 타입 정의 생성
// i18n/types.ts
import ko from '../../messages/ko.json';

export type Messages = typeof ko;

declare global {
  interface IntlMessages extends Messages {}
}
```

### 타입된 useTranslations

```tsx
// 적절한 타입으로 자동완성 제공:
const t = useTranslations('auth');

t('login'); // ✅ 자동완성
t('invalidKey'); // ❌ TypeScript 에러
```

---

## 메타데이터

### 지역화된 메타데이터

```tsx
// ✅ DO: 지역화된 메타데이터 생성
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

## 파일 구조

```
src/
├── i18n/
│   ├── config.ts       # 로케일 설정
│   ├── routing.ts      # 라우팅 설정
│   ├── request.ts      # 요청 설정
│   ├── navigation.ts   # 네비게이션 유틸리티
│   └── types.ts        # 타입 정의
├── messages/
│   ├── en.json         # 영어 메시지 (기본)
│   └── ko.json         # 한국어 메시지
├── app/
│   └── [locale]/
│       ├── layout.tsx  # 로케일 provider
│       └── page.tsx    # 지역화된 페이지
└── middleware.ts       # 로케일 미들웨어
```

---

## AI 에이전트 next-intl 개발 작업

- middleware.ts가 올바른 matcher로 설정되었는지 확인
- routing.ts가 모든 지원 로케일을 정의하는지 확인
- 모든 로케일에 대해 메시지 파일 존재 확인
- 서버 컴포넌트가 setRequestLocale과 함께 getTranslations 사용하는지 확인
- 클라이언트 컴포넌트가 useTranslations 사용하는지 확인
- 네비게이션이 next-intl 유틸리티 사용하는지 확인 (next/link 직접 사용 아님)
- 메시지 파일의 복수형 문법 검증
- IntlMessages 타입 정의 확인
- 메타데이터가 지역화되었는지 확인

**참조**:

- [next-intl 문서](https://next-intl.dev/)
- [next-intl GitHub](https://github.com/amannn/next-intl)
