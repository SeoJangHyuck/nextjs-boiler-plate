/**
 * 브라우저에 노출되는 환경 변수. 서버와 클라이언트 어디서나 사용할 수 있다.
 * - NEXT_PUBLIC_* 값은 빌드 시 인라인되므로 process.env.이름 형태로 직접 읽는다.
 * - 형식은 next.config.ts가 schema.ts로 검증한다. (클라이언트 번들에 zod를 넣지 않는다)
 * - 비밀 값은 server.ts에서 가져온다.
 */

/** 배포 환경 */
export const AppEnv = {
  DEV: 'dev',
  QA: 'qa',
  STAGING: 'staging',
  LIVE: 'live',
} as const;

/** 배포 환경 타입 */
export type AppEnvType = (typeof AppEnv)[keyof typeof AppEnv];

const isAppEnv = (value: string | undefined): value is AppEnvType =>
  Object.values<string | undefined>(AppEnv).includes(value);

const { DEV, QA, STAGING, LIVE } = AppEnv;

export const clientEnv = {
  NEXT_PUBLIC_ENV: isAppEnv(process.env.NEXT_PUBLIC_ENV)
    ? process.env.NEXT_PUBLIC_ENV
    : DEV,
  // 빈 문자열은 설정하지 않은 것으로 본다. (예: CI가 빈 값으로 주입)
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
};

/**
 * 환경별 유틸리티 함수
 */
export const isDev = () => clientEnv.NEXT_PUBLIC_ENV === DEV;
export const isQa = () => clientEnv.NEXT_PUBLIC_ENV === QA;
export const isStaging = () => clientEnv.NEXT_PUBLIC_ENV === STAGING;
export const isLive = () => clientEnv.NEXT_PUBLIC_ENV === LIVE;

/** 프로덕션 환경 여부 (staging, live) */
export const isProduction = () => isStaging() || isLive();
