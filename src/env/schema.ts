import { z } from 'zod';
import { AppEnv } from './index';

/**
 * 전체 환경 변수 스키마
 */
const envSchema = z.object({
  // 서버 전용
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // TODO: OIDC 연동 시 필수로 변경
  AUTH_SECRET: z.string().min(1).optional(),

  // 브라우저에 노출
  NEXT_PUBLIC_ENV: z.enum(AppEnv).default(AppEnv.DEV),
  NEXT_PUBLIC_API_URL: z.url({ protocol: /^https?$/ }).optional(),
});

/** 빈 문자열은 설정하지 않은 것으로 본다. (예: CI가 빈 값으로 주입) */
const emptyToUndefined = (value: string | undefined): string | undefined =>
  value === '' ? undefined : value;

/** 환경 변수를 검증해 반환한다. 잘못된 값이 있으면 오류를 던진다. */
export const parseEnv = () => {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: emptyToUndefined(process.env.AUTH_SECRET),
    NEXT_PUBLIC_ENV: emptyToUndefined(process.env.NEXT_PUBLIC_ENV),
    NEXT_PUBLIC_API_URL: emptyToUndefined(process.env.NEXT_PUBLIC_API_URL),
    // 스키마에 추가한 변수를 빠뜨리면 타입 오류가 난다.
  } satisfies Record<keyof z.input<typeof envSchema>, string | undefined>);

  if (!parsed.success) {
    // 값은 출력하지 않고 어떤 항목이 왜 잘못됐는지만 남긴다.
    console.error(
      '❌ Invalid environment variables:',
      z.flattenError(parsed.error).fieldErrors
    );
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};
