import { inspect } from 'node:util';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseEnv } from '@/env/schema';

/** 모듈을 불러올 때 값을 읽으므로 매번 새로 불러온다. */
const loadEnv = async () => {
  vi.resetModules();
  return import('@/env');
};

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_ENV', undefined);
  vi.stubEnv('NEXT_PUBLIC_API_URL', undefined);
  vi.stubEnv('AUTH_SECRET', undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('공개 환경 변수', () => {
  it.each([undefined, ''])(
    '설정하지 않으면(%j) dev 환경으로 동작한다',
    async (value) => {
      vi.stubEnv('NEXT_PUBLIC_ENV', value);
      vi.stubEnv('NEXT_PUBLIC_API_URL', value);
      const { clientEnv, isDev } = await loadEnv();

      expect(clientEnv.NEXT_PUBLIC_ENV).toBe('dev');
      expect(clientEnv.NEXT_PUBLIC_API_URL).toBeUndefined();
      expect(isDev()).toBe(true);
    }
  );

  it.each([
    ['dev', false],
    ['qa', false],
    ['staging', true],
    ['live', true],
  ])('%s의 프로덕션 여부는 %s다', async (value, expected) => {
    vi.stubEnv('NEXT_PUBLIC_ENV', value);
    const { clientEnv, isProduction } = await loadEnv();

    expect(clientEnv.NEXT_PUBLIC_ENV).toBe(value);
    expect(isProduction()).toBe(expected);
  });

  it('API URL을 그대로 전달한다', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    const { clientEnv } = await loadEnv();

    expect(clientEnv.NEXT_PUBLIC_API_URL).toBe('https://api.example.com');
  });
});

describe('서버 전용 환경 변수', () => {
  it('비밀 값을 검증해 제공한다', async () => {
    vi.stubEnv('AUTH_SECRET', 'secret');
    vi.resetModules();
    const { serverEnv } = await import('@/env/server');

    expect(serverEnv.AUTH_SECRET).toBe('secret');
  });
});

describe('환경 변수 검증', () => {
  const logSpy = () =>
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

  it('설정하지 않은 값과 빈 문자열은 기본값으로 처리한다', () => {
    vi.stubEnv('NEXT_PUBLIC_ENV', '');
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    vi.stubEnv('AUTH_SECRET', '');

    const env = parseEnv();
    expect(env.NEXT_PUBLIC_ENV).toBe('dev');
    expect(env.NEXT_PUBLIC_API_URL).toBeUndefined();
    expect(env.AUTH_SECRET).toBeUndefined();
  });

  it('허용되지 않은 환경 이름이면 항목을 알리고 오류를 던진다', () => {
    const log = logSpy();
    vi.stubEnv('NEXT_PUBLIC_ENV', 'prod');

    expect(parseEnv).toThrow('Invalid environment variables');
    expect(inspect(log.mock.calls)).toContain('NEXT_PUBLIC_ENV');
  });

  it.each(['localhost', 'ftp://example.com', 'javascript:alert(1)'])(
    'API URL이 http(s) 주소가 아니면 오류를 던진다: %s',
    (value) => {
      logSpy();
      vi.stubEnv('NEXT_PUBLIC_API_URL', value);

      expect(parseEnv).toThrow('Invalid environment variables');
    }
  );

  it('검증에 실패한 값과 비밀 값을 로그에 남기지 않는다', () => {
    const log = logSpy();
    vi.stubEnv('AUTH_SECRET', 'auth-secret-value');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'postgres://user:db-password@host');

    expect(parseEnv).toThrow();
    const output = inspect(log.mock.calls, { depth: null });
    expect(output).toContain('NEXT_PUBLIC_API_URL');
    expect(output).not.toContain('auth-secret-value');
    expect(output).not.toContain('db-password');
  });
});
