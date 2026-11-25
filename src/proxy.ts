import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/routing';

/**
 * locale 감지·리다이렉트·쿠키 저장을 next-intl에 위임한다.
 * 감지 순서: URL prefix → 쿠키(i18n_redirected) → Accept-Language → 기본 locale
 *
 * TODO: OIDC 연동 시 낙관적 인증 검사를 추가한다.
 * (proxy는 최종 인가 수단이 아니므로 데이터 접근 시점에도 반드시 검사한다)
 */
export default createMiddleware(routing);

export const config = {
  // /api, /trpc, /_next, /_vercel과 확장자가 있는 파일 경로는 제외
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
