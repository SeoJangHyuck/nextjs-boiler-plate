import path from 'node:path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { parseEnv } from './src/env/schema';

// 환경 변수가 잘못되면 dev, build, start, typegen이 모두 실패한다.
parseEnv();

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

/**
 * 페이지, API, 정적 파일 응답에 적용하는 기본 보안 헤더
 * - nonce 기반 스크립트 CSP는 정적 셸(Cache Components)과 함께 쓸 수 없어 제외했다.
 *   대안: node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md
 * - HSTS는 HTTPS를 처리하는 플랫폼(Vercel 등)에서 설정한다.
 */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'",
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  // Next.js 16.4 권장 기본값 (다음 메이저에서 기본 활성화 예정)
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // JS/TSX에서 가져온 SCSS에 변수·믹스인·함수를 주입해 파일마다 @use를 쓰지 않게 한다.
  // 별칭(@/)은 외부 패키지의 SCSS에서 해석되지 않으므로 loadPaths를 사용한다.
  sassOptions: {
    loadPaths: [path.join(process.cwd(), 'src')],
    additionalData: "@use 'styles/utils' as *;",
  },
  headers: async () => [{ source: '/:path*', headers: securityHeaders }],
};

export default withNextIntl(nextConfig);
