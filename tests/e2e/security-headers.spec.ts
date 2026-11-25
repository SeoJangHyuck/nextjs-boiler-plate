import { expect, test } from '@playwright/test';

test.describe('보안 헤더', () => {
  for (const path of ['/ko', '/api/auth/session', '/icon.svg']) {
    test(`${path}: 기본 보안 헤더를 응답한다`, async ({ request }) => {
      const headers = (await request.get(path)).headers();

      expect(headers).toMatchObject({
        'content-security-policy':
          "base-uri 'self'; object-src 'none'; frame-ancestors 'self'",
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'SAMEORIGIN',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'permissions-policy': 'camera=(), microphone=(), geolocation=()',
      });
      expect(headers['x-powered-by']).toBeUndefined();
    });
  }
});
