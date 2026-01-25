import { z } from 'zod';

/** 비밀번호 정책 상수 */
const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  MIN_CRITERIA: 3,
} as const;

const hasLowercase = (str: string) => /[a-z]/.test(str);
const hasUppercase = (str: string) => /[A-Z]/.test(str);
const hasNumber = (str: string) => /[0-9]/.test(str);
const hasSpecialChar = (str: string) => /[!@#$%^&*(),.?":{}|<>]/.test(str);

const countPasswordCriteria = (password: string) => {
  return [
    hasLowercase(password),
    hasUppercase(password),
    hasNumber(password),
    hasSpecialChar(password),
  ].filter(Boolean).length;
};

/** 비밀번호 스키마: 8자 이상 + 4가지 중 3가지 조합 */
export const passwordSchema = z
  .string()
  .min(PASSWORD_RULES.MIN_LENGTH, '비밀번호는 8자 이상이어야 합니다')
  .refine(
    (val) => countPasswordCriteria(val) >= PASSWORD_RULES.MIN_CRITERIA,
    '영문 소문자, 대문자, 숫자, 특수문자 중 3가지 이상 포함해야 합니다'
  );

/** 닉네임 스키마: 2~20자, 한글/영문/숫자만 */
export const nicknameSchema = z
  .string()
  .min(2, '닉네임은 2자 이상이어야 합니다')
  .max(20, '닉네임은 20자 이하여야 합니다')
  .regex(/^[가-힣a-zA-Z0-9]+$/, '한글, 영문, 숫자만 사용 가능합니다');

/** 성별 스키마 */
export const genderSchema = z.enum(['male', 'female', 'other']);

/** 생년월일 스키마 */
export const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)');

/** 이메일 회원가입 폼 스키마 */
export const emailSignUpSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    password: passwordSchema,
    passwordConfirm: z.string(),
    nickname: nicknameSchema,
    birthDate: birthDateSchema,
    gender: genderSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
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
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

/** 비밀번호 재설정 요청 스키마 */
export const passwordResetRequestSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
});

/** 비밀번호 재설정 스키마 */
export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

/** 프로필 수정 스키마 */
export const profileUpdateSchema = z.object({
  nickname: nicknameSchema.optional(),
  birthDate: birthDateSchema.optional(),
  gender: genderSchema.optional(),
  avatarUrl: z.string().url().nullable().optional(),
});
