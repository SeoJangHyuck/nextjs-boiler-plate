import { describe, expect, it } from 'vitest';
import {
  passwordSchema,
  nicknameSchema,
  emailSignUpSchema,
  loginSchema,
} from '@/lib/validations/auth';

describe('passwordSchema', () => {
  it('8자 미만이면 실패', () => {
    const result = passwordSchema.safeParse('Abc123!');
    expect(result.success).toBe(false);
  });

  it('3가지 조합 미만이면 실패', () => {
    const result = passwordSchema.safeParse('abcdefgh');
    expect(result.success).toBe(false);
  });

  it('8자 이상 + 3가지 조합이면 성공', () => {
    expect(passwordSchema.safeParse('Abcdefg1').success).toBe(true);
    expect(passwordSchema.safeParse('abcdefg1!').success).toBe(true);
    expect(passwordSchema.safeParse('ABCDEFG1!').success).toBe(true);
  });
});

describe('nicknameSchema', () => {
  it('2자 미만이면 실패', () => {
    const result = nicknameSchema.safeParse('a');
    expect(result.success).toBe(false);
  });

  it('20자 초과면 실패', () => {
    const result = nicknameSchema.safeParse('a'.repeat(21));
    expect(result.success).toBe(false);
  });

  it('특수문자가 있으면 실패', () => {
    const result = nicknameSchema.safeParse('nick@name');
    expect(result.success).toBe(false);
  });

  it('한글/영문/숫자 2~20자면 성공', () => {
    expect(nicknameSchema.safeParse('닉네임').success).toBe(true);
    expect(nicknameSchema.safeParse('nickname123').success).toBe(true);
    expect(nicknameSchema.safeParse('닉네임123abc').success).toBe(true);
  });
});

describe('loginSchema', () => {
  it('유효한 이메일과 비밀번호면 성공', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password',
    });
    expect(result.success).toBe(true);
  });

  it('잘못된 이메일이면 실패', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password',
    });
    expect(result.success).toBe(false);
  });
});

describe('emailSignUpSchema', () => {
  it('비밀번호가 일치하지 않으면 실패', () => {
    const result = emailSignUpSchema.safeParse({
      email: 'test@example.com',
      password: 'Abcdefg1',
      passwordConfirm: 'different',
      nickname: '닉네임',
      birthDate: '1990-01-01',
      gender: 'male',
    });
    expect(result.success).toBe(false);
  });

  it('모든 필드가 유효하면 성공', () => {
    const result = emailSignUpSchema.safeParse({
      email: 'test@example.com',
      password: 'Abcdefg1',
      passwordConfirm: 'Abcdefg1',
      nickname: '닉네임',
      birthDate: '1990-01-01',
      gender: 'male',
    });
    expect(result.success).toBe(true);
  });
});
