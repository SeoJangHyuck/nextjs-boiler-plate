import { describe, expect, it } from 'vitest';
import {
  defaultLocale,
  getLocaleDir,
  getLocaleObject,
  getServiceLocale,
  localeObjects,
  locales,
} from '@/lib/i18n/config';

describe('i18n config', () => {
  it('locale 코드는 중복되지 않고 기본 locale을 포함한다', () => {
    expect(new Set(locales).size).toBe(locales.length);
    expect(locales).toContain(defaultLocale);
  });

  it('catch-all locale은 하나이며 기본 locale이다', () => {
    const catchall = localeObjects.filter(
      ({ isCatchallLocale }) => isCatchallLocale
    );

    expect(catchall.map(({ code }) => code)).toEqual([defaultLocale]);
  });

  it('locale 정보를 조회하고, 모르는 locale은 기본값으로 처리한다', () => {
    expect(getLocaleObject('ko')).toMatchObject({ iso: 'ko-KR' });
    expect(getLocaleObject('xx')).toBeUndefined();
    expect(getLocaleDir('ko')).toBe('ltr');
    expect(getLocaleDir('xx')).toBe('ltr');
    expect(getServiceLocale('ko')).toBe('ko');
  });
});
