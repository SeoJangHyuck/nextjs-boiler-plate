import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import type { z } from 'zod';
import {
  emailSignUpSchema,
  getFieldErrors,
  loginSchema,
  profileUpdateSchema,
} from '@/lib/validations';
import en from '../../../messages/en.json';
import ko from '../../../messages/ko.json';

const translators = {
  ko: createTranslator({ locale: 'ko', messages: ko, namespace: 'validation' }),
  en: createTranslator({ locale: 'en', messages: en, namespace: 'validation' }),
};

const getErrors = (
  schema: z.ZodType,
  value: unknown,
  locale: keyof typeof translators
) => {
  const { error } = schema.safeParse(value);
  expect(error).toBeDefined();
  return error && getFieldErrors(error, translators[locale]);
};

describe('검증 오류 번역', () => {
  const invalidSignUp = {
    email: 'invalid',
    password: 'abcdefgh',
    passwordConfirm: 'different',
    nickname: '!',
    birthDate: '2023-02-30',
    gender: 'male',
  };

  it('같은 오류를 locale에 맞는 문구로 바꾼다', () => {
    expect(getErrors(emailSignUpSchema, invalidSignUp, 'ko')).toMatchObject({
      email: [ko.validation.emailInvalid],
      password: [ko.validation.passwordCriteria],
      nickname: [
        ko.validation.nicknameTooShort,
        ko.validation.nicknameCharacters,
      ],
      birthDate: [ko.validation.birthDateInvalid],
    });
    expect(getErrors(emailSignUpSchema, invalidSignUp, 'en')).toMatchObject({
      email: [en.validation.emailInvalid],
      password: [en.validation.passwordCriteria],
    });
  });

  it('비밀번호가 다르면 확인 필드에 알린다', () => {
    const value = {
      ...invalidSignUp,
      email: 'test@example.com',
      password: 'Abcdefg1',
      nickname: '닉네임',
      birthDate: '1990-01-01',
    };

    expect(getErrors(emailSignUpSchema, value, 'ko')).toEqual({
      passwordConfirm: [ko.validation.passwordMismatch],
    });
  });

  it('스키마가 문구를 정하지 않은 오류는 기본 문구로 알린다', () => {
    expect(getErrors(loginSchema, { password: 1 }, 'ko')).toEqual({
      email: [ko.validation.emailInvalid],
      password: [ko.validation.invalid],
    });
    expect(getErrors(profileUpdateSchema, { gender: 'x' }, 'en')).toEqual({
      gender: [en.validation.invalid],
    });
  });
});
