import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from './config';

/** 선택한 언어를 기억하는 기간 (1년, 초 단위) */
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeCookie: {
    name: 'i18n_redirected',
    maxAge: LOCALE_COOKIE_MAX_AGE,
  },
});
