import type { Messages, useTranslations } from 'next-intl';
import { z } from 'zod';

/** messages/<locale>.json의 validation 키 */
export type ValidationKey = keyof Messages['validation'];

/** 스키마에는 문구 대신 번역 키를 적는다. 없는 키를 쓰면 타입 오류가 난다. */
export const validationKey = (key: ValidationKey): ValidationKey => key;

/**
 * 검증 실패를 필드별 번역 문구로 바꾼다.
 * @param t useTranslations('validation') 또는 getTranslations의 결과
 */
export const getFieldErrors = <TValues>(
  error: z.ZodError<TValues>,
  t: ReturnType<typeof useTranslations<'validation'>>
) =>
  z.flattenError(error, ({ message }) => {
    // 스키마가 문구를 정하지 않은 오류(타입 불일치 등)는 키가 아니므로 has로 확인한다.
    const key = message as ValidationKey;
    return t.has(key) ? t(key) : t('invalid');
  }).fieldErrors;
