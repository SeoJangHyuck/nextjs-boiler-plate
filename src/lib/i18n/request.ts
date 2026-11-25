import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { defaultTimeZone } from './config';
import { routing } from './routing';

/**
 * 요청 locale과 메시지를 결정한다.
 * - 서버 액션·라우트 핸들러처럼 root params를 읽을 수 없는 곳은
 *   getTranslations({ locale })로 locale을 명시한다.
 */
export default getRequestConfig(async ({ locale: localeOverride }) => {
  const locale = localeOverride ?? (await rootLocale());

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    locale,
    timeZone: defaultTimeZone,
    messages: (await import(`../../../messages/${locale}.json`)).default,
  };
});
