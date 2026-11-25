import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // tsconfig.json의 paths(@/*)를 그대로 사용한다.
    tsconfigPaths: true,
    // Next.js가 번들할 때처럼 서버 전용 표시를 빈 모듈로 바꾼다.
    alias: { 'server-only': 'next/dist/compiled/server-only/empty.js' },
  },
  test: {
    environment: 'jsdom',
    // Testing Library가 자동 정리와 act 경고를 켜는 데 사용한다.
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // E2E(tests/e2e)는 Playwright가 실행한다.
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
    server: {
      deps: {
        // next-intl의 navigation API가 next 모듈을 올바르게 해석하도록 번들한다.
        inline: ['next-intl'],
      },
    },
  },
});
