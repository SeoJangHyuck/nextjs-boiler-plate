import { z } from 'zod';
import { validationKey } from './errors';

/** 비밀번호 정책 상수 */
const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  MIN_CRITERIA: 3,
} as const;

/** 이메일 주소의 최대 길이 (RFC 5321) */
const EMAIL_MAX_LENGTH = 254;

const URL_MAX_LENGTH = 2048;

const hasLowercase = (str: string) => /[a-z]/.test(str);
const hasUppercase = (str: string) => /[A-Z]/.test(str);
const hasNumber = (str: string) => /[0-9]/.test(str);
const hasSpecialChar = (str: string) => /[\p{P}\p{S}]/u.test(str);

const countPasswordCriteria = (password: string) => {
  return [
    hasLowercase(password),
    hasUppercase(password),
    hasNumber(password),
    hasSpecialChar(password),
  ].filter(Boolean).length;
};

/** 비밀번호 스키마: 8~128자 + 4가지 중 3가지 조합 */
export const passwordSchema = z
  .string()
  .min(PASSWORD_RULES.MIN_LENGTH, validationKey('passwordTooShort'))
  .max(PASSWORD_RULES.MAX_LENGTH, validationKey('passwordTooLong'))
  .refine(
    (val) => countPasswordCriteria(val) >= PASSWORD_RULES.MIN_CRITERIA,
    validationKey('passwordCriteria')
  );

/** 비밀번호 확인 스키마: 일치 여부는 폼 스키마의 refine에서 검사 */
const passwordConfirmSchema = z
  .string()
  .max(PASSWORD_RULES.MAX_LENGTH, validationKey('passwordTooLong'));

/** 닉네임 스키마: 2~20자, 한글/영문/숫자만 */
export const nicknameSchema = z
  .string()
  .min(2, validationKey('nicknameTooShort'))
  .max(20, validationKey('nicknameTooLong'))
  .regex(/^[가-힣a-zA-Z0-9]+$/, validationKey('nicknameCharacters'));

/** 성별 스키마 */
export const genderSchema = z.enum(['male', 'female', 'other']);

/** 생년월일 스키마: 달력에 존재하는 YYYY-MM-DD */
export const birthDateSchema = z.iso.date(validationKey('birthDateInvalid'));

/** 이메일 스키마 */
export const emailSchema = z
  .email(validationKey('emailInvalid'))
  .max(EMAIL_MAX_LENGTH, validationKey('emailInvalid'));

/** 외부 이미지 URL 스키마: javascript: 같은 위험한 프로토콜은 거부 */
export const imageUrlSchema = z
  .url({ protocol: /^https?$/, error: validationKey('urlInvalid') })
  .max(URL_MAX_LENGTH, validationKey('urlInvalid'));

/** 이메일 회원가입 폼 스키마 */
export const emailSignUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
    nickname: nicknameSchema,
    birthDate: birthDateSchema,
    gender: genderSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: validationKey('passwordMismatch'),
    path: ['passwordConfirm'],
  });

/** 소셜 로그인 추가 정보 폼 스키마 */
export const socialSignUpSchema = z.object({
  nickname: nicknameSchema,
  birthDate: birthDateSchema,
  gender: genderSchema,
});

/** 로그인 폼 스키마 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, validationKey('passwordRequired'))
    .max(PASSWORD_RULES.MAX_LENGTH, validationKey('passwordTooLong')),
});

/** 비밀번호 재설정 요청 스키마 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

/** 비밀번호 재설정 스키마 */
export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: validationKey('passwordMismatch'),
    path: ['passwordConfirm'],
  });

/** 프로필 수정 스키마 */
export const profileUpdateSchema = z.object({
  nickname: nicknameSchema.optional(),
  birthDate: birthDateSchema.optional(),
  gender: genderSchema.optional(),
  avatarUrl: imageUrlSchema.nullable().optional(),
});
