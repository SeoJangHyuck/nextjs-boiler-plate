import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const nextConfig: NextConfig = {
  // Turbopack은 pnpm dev --turbopack으로 활성화
};

export default withNextIntl(nextConfig);
