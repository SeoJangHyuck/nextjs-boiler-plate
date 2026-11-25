import type messages from '../../../messages/en.json';
import type { Locale } from './config';

/**
 * next-intl 타입 확장
 * - Locale: useLocale(), Link locale 등이 지원 locale만 받도록 제한
 * - Messages: 번역 키 자동완성과 오타 검사 (기준: 기본 locale인 en)
 */
declare module 'next-intl' {
  // 선언 병합은 interface만 가능하다.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
