import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 다국어 미들웨어가 적용될 경로
  matcher: [
    // 모든 locale 경로
    '/(ko|en)/:path*',
    // 루트 경로
    '/',
    // 제외: api, _next, 정적 파일
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
