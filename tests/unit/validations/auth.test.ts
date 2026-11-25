import { describe, expect, it } from 'vitest';
import {
  passwordSchema,
  nicknameSchema,
  birthDateSchema,
  emailSignUpSchema,
  loginSchema,
  passwordResetSchema,
  profileUpdateSchema,
} from '@/lib/validations/auth';

describe('passwordSchema', () => {
  it('8자 미만이면 실패', () => {
    const result = passwordSchema.safeParse('Abc123!');
    expect(result.success).toBe(false);
  });

  it('128자를 넘으면 실패', () => {
    expect(passwordSchema.safeParse(`Aa1${'a'.repeat(125)}`).success).toBe(
      true
    );
    expect(passwordSchema.safeParse(`Aa1${'a'.repeat(126)}`).success).toBe(
      false
    );
  });

  it.each([
    'abcdefgh',
    'abcdefg1',
    'ABCDEFG1',
    'Abcdefgh',
    'abcdefg!',
    'ABCDEFG!',
    '1234567!',
  ])('3가지 조합 미만이면 실패: %s', (password) => {
    expect(passwordSchema.safeParse(password).success).toBe(false);
  });

  it.each([
    'Abcdefg1',
    'Abcdefg!',
    'abcdefg1!',
    'ABCDEFG1!',
    'abcdefg1-',
    'abcdefg1_',
    'abcdefg1+',
    'abcdefg1₩',
  ])('8자 이상 + 3가지 조합이면 성공: %s', (password) => {
    expect(passwordSchema.safeParse(password).success).toBe(true);
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

  it('지나치게 긴 값이면 실패', () => {
    const email = `${'a'.repeat(250)}@example.com`;
    expect(loginSchema.safeParse({ email, password: 'password' }).success).toBe(
      false
    );
    expect(
      loginSchema.safeParse({
        email: 'test@example.com',
        password: 'a'.repeat(129),
      }).success
    ).toBe(false);
  });

  it('비밀번호가 비어 있으면 실패', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.error?.issues[0]?.message).toBe('passwordRequired');
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

describe('passwordResetSchema', () => {
  it('새 비밀번호와 확인이 다르면 확인 필드에 알린다', () => {
    const result = passwordResetSchema.safeParse({
      password: 'Abcdefg1',
      passwordConfirm: 'Abcdefg2',
    });
    expect(result.error?.issues).toMatchObject([
      { path: ['passwordConfirm'], message: 'passwordMismatch' },
    ]);
  });
});

describe('birthDateSchema', () => {
  it('YYYY-MM-DD 형식의 실제 날짜면 성공', () => {
    expect(birthDateSchema.safeParse('1990-01-31').success).toBe(true);
    expect(birthDateSchema.safeParse('2024-02-29').success).toBe(true);
  });

  it('형식이 다르면 실패', () => {
    expect(birthDateSchema.safeParse('1990/01/01').success).toBe(false);
    expect(birthDateSchema.safeParse('90-1-1').success).toBe(false);
  });

  it('달력에 없는 날짜면 실패', () => {
    expect(birthDateSchema.safeParse('2023-02-30').success).toBe(false);
    expect(birthDateSchema.safeParse('2023-02-29').success).toBe(false);
    expect(birthDateSchema.safeParse('1990-13-01').success).toBe(false);
  });

  it('실패하면 문구 대신 번역 키를 담는다', () => {
    const result = birthDateSchema.safeParse('1990-13-01');
    expect(result.error?.issues[0]?.message).toBe('birthDateInvalid');
  });
});

describe('profileUpdateSchema', () => {
  it('avatarUrl은 http(s) URL 또는 null만 허용', () => {
    expect(
      profileUpdateSchema.safeParse({ avatarUrl: 'https://example.com/a.png' })
        .success
    ).toBe(true);
    expect(profileUpdateSchema.safeParse({ avatarUrl: null }).success).toBe(
      true
    );
    expect(
      profileUpdateSchema.safeParse({ avatarUrl: 'not-a-url' }).success
    ).toBe(false);
    expect(
      profileUpdateSchema.safeParse({
        avatarUrl: `https://example.com/${'a'.repeat(2048)}`,
      }).success
    ).toBe(false);
    expect(
      profileUpdateSchema.safeParse({ avatarUrl: 'javascript:alert(1)' })
        .success
    ).toBe(false);
  });
});
