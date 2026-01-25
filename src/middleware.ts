import { type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export const middleware = async (request: NextRequest) => {
  // TODO: OIDC 연동 시 인증 미들웨어 추가 예정

  // i18n 처리
  const intlResponse = intlMiddleware(request);

  return intlResponse;
};

export const config = {
  matcher: ['/(ko|en)/:path*', '/', '/((?!api|_next|_vercel|.*\\..*).*))'],
};
