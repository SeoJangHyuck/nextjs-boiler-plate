/**
 * 지원하는 언어 리스트
 * next-intl 설정에서 해당 배열을 사용
 */

/** Locale 객체 타입 */
export type LocaleObject = {
  code: string;
  iso: string;
  dir: 'ltr' | 'rtl';
  name: string;
  isCatchallLocale?: boolean;
};

/**
 * 서비스에서 노출될 locale 리스트
 * 지역 + 언어의 조합으로 개별 언어가 달라도 동일 컨텐츠를 제공할 언어셋 묶음
 *
 * locale을 추가하면 messages/<code>.json도 함께 추가한다.
 */
export const serviceLocales = [
  // default & fallback
  {
    code: 'en',
    iso: 'en',
    dir: 'ltr',
    name: 'English',
    isCatchallLocale: true,
  },

  // 개별 국가 언어
  // { code: 'es', iso: 'es', dir: 'ltr', name: 'Español' },
  // { code: 'es-mx', iso: 'es-MX', dir: 'ltr', name: 'Español (México)' },
  // { code: 'de', iso: 'de', dir: 'ltr', name: 'Deutsch' },
  // { code: 'pt-br', iso: 'pt-BR', dir: 'ltr', name: 'Português (Brasil)' },
  { code: 'ko', iso: 'ko-KR', dir: 'ltr', name: '한국어' },
  // { code: 'ja', iso: 'ja', dir: 'ltr', name: '日本語' },
  // { code: 'th', iso: 'th', dir: 'ltr', name: 'ไทย' },
  // { code: 'zh-tw', iso: 'zh-TW', dir: 'ltr', name: '繁體中文' },
  // { code: 'zh-cn', iso: 'zh-CN', dir: 'ltr', name: '简体中文' },
  // { code: 'id', iso: 'id-ID', dir: 'ltr', name: 'Bahasa Indonesia' },
] as const satisfies readonly LocaleObject[];

/** Locale 타입 (serviceLocales의 code 유니온) */
export type Locale = (typeof serviceLocales)[number]['code'];

/**
 * 실제 i18n에 설정될 locale 리스트
 * 확장이 필요한 경우 serviceLocales에 추가
 */
export const localeObjects: readonly LocaleObject[] = serviceLocales;

/** next-intl에서 사용할 locale 코드 배열 */
export const locales: Locale[] = serviceLocales.map(({ code }) => code);

/** 기본 locale */
export const defaultLocale = 'en' satisfies Locale;

/** 날짜·시간 표시에 쓰는 서비스 기준 시간대. 실행 환경에 따라 달라지지 않게 고정한다. */
export const defaultTimeZone = 'Asia/Seoul';

/** locale 코드로 LocaleObject 조회 */
export const getLocaleObject = (locale: string): LocaleObject | undefined =>
  localeObjects.find(({ code }) => code === locale);

/** locale의 방향(dir) 조회 */
export const getLocaleDir = (locale: string): LocaleObject['dir'] =>
  getLocaleObject(locale)?.dir ?? 'ltr';

/**
 * 개별 locale을 입력받아 서비스에 노출될 locale 정보값을 리턴
 * 지역별 그룹화가 필요한 경우 이 함수에서 매핑
 */
export const getServiceLocale = (locale: string): string => {
  // 현재는 1:1 매핑, 필요시 확장
  // 예시:
  // switch (locale) {
  //   case 'en-gb':
  //   case 'en-ie':
  //     return 'en-eu';
  //   default:
  //     return locale;
  // }
  return locale;
};
