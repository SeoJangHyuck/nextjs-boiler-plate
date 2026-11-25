import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import localFont from 'next/font/local';
import { Providers } from '@/components/providers';
import { getLocaleDir } from '@/lib/i18n/config';
import { routing } from '@/lib/i18n/routing';
// 전역 스타일이 Tailwind base보다 뒤에 오도록 이 순서를 유지한다.
import '@/styles/tailwind.css';
import '@/styles/globals.scss';

const pretendard = localFont({
  src: '../../fonts/pretendard/web/variable/woff2/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
});

/** 모든 locale을 빌드 시점에 정적으로 렌더링한다. */
export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }));

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('metadata');
  const title = t('title');

  return {
    title: { default: title, template: `%s | ${title}` },
    description: t('description'),
  };
};

export default async function LocaleLayout({
  children,
}: LayoutProps<'/[locale]'>) {
  // locale 검증은 src/lib/i18n/request.ts에서 처리한다.
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={getLocaleDir(locale)}
      className={pretendard.variable}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
