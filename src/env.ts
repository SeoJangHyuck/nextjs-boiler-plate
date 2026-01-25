import { z } from 'zod';

/**
 * 배포 환경 타입
 */
export const AppEnv = {
  DEV: 'dev',
  QA: 'qa',
  STAGING: 'staging',
  LIVE: 'live',
} as const;

export type AppEnvType = (typeof AppEnv)[keyof typeof AppEnv];

/**
 * 서버 전용 환경 변수 스키마
 */
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // TODO: OIDC 연동 시 필수로 변경
  AUTH_SECRET: z.string().min(1).optional(),
});

/**
 * 클라이언트 노출 가능 환경 변수 스키마
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_ENV: z.enum(['dev', 'qa', 'staging', 'live']).default('dev'),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

/**
 * 전체 환경 변수 스키마
 */
const envSchema = serverEnvSchema.merge(clientEnvSchema);

/**
 * 환경 변수 검증 및 export
 */
const validateEnv = () => {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

export const env = validateEnv();

/**
 * 클라이언트에서 안전하게 사용할 수 있는 환경 변수
 */
export const clientEnv = {
  NEXT_PUBLIC_ENV: env.NEXT_PUBLIC_ENV,
  NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
};

/**
 * 환경별 유틸리티 함수
 */
export const isDev = () => env.NEXT_PUBLIC_ENV === AppEnv.DEV;
export const isQa = () => env.NEXT_PUBLIC_ENV === AppEnv.QA;
export const isStaging = () => env.NEXT_PUBLIC_ENV === AppEnv.STAGING;
export const isLive = () => env.NEXT_PUBLIC_ENV === AppEnv.LIVE;

/** 프로덕션 환경 여부 (staging, live) */
export const isProduction = () => isStaging() || isLive();
