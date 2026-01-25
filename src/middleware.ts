import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/routing';
import { defaultLocale, isValidLocale } from '@/lib/i18n/config';

const LOCALE_COOKIE_NAME = 'i18n_redirected';

const intlMiddleware = createIntlMiddleware(routing);

/**
 * URL 경로에서 첫 번째 세그먼트(locale 후보) 추출
 */
function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || null;
}

/**
 * 쿠키에서 저장된 locale 조회
 */
function getSavedLocale(request: NextRequest): string | null {
  const cookie = request.cookies.get(LOCALE_COOKIE_NAME);
  const savedLocale = cookie?.value;

  if (savedLocale && isValidLocale(savedLocale)) {
    return savedLocale;
  }
  return null;
}

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // 정적 파일, API, Next.js 내부 경로는 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const pathLocale = getLocaleFromPath(pathname);

  // 루트 경로('/') 또는 유효한 locale 경로인 경우
  if (pathname === '/' || (pathLocale && isValidLocale(pathLocale))) {
    const response = intlMiddleware(request);

    // 유효한 locale 경로인 경우 쿠키에 저장
    if (pathLocale && isValidLocale(pathLocale)) {
      response.cookies.set(LOCALE_COOKIE_NAME, pathLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1년
        sameSite: 'lax',
      });
    }

    return response;
  }

  // 유효하지 않은 locale 경로인 경우, 저장된 locale을 앞에 붙여서 리다이렉트
  const savedLocale = getSavedLocale(request);
  const targetLocale = savedLocale || defaultLocale;

  // 입력한 경로를 그대로 유지하면서 locale만 앞에 추가
  // /dsdsds → /ko/dsdsds (not-found.tsx가 처리)
  const newPath = `/${targetLocale}${pathname}`;

  const redirectUrl = new URL(newPath, request.url);
  return NextResponse.redirect(redirectUrl);
};

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/'],
};
