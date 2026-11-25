// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const loadConfig = async () => {
  vi.resetModules();
  return import('../../next.config');
};

describe('next.config', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubEnv('NEXT_PUBLIC_ENV', undefined);
    vi.stubEnv('NEXT_PUBLIC_API_URL', undefined);
    vi.stubEnv('AUTH_SECRET', undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('환경 변수가 올바르면 설정을 불러온다', async () => {
    await expect(loadConfig()).resolves.toHaveProperty('default');
  });

  it('환경 변수가 잘못되면 설정을 불러오지 못한다', async () => {
    vi.stubEnv('NEXT_PUBLIC_ENV', 'prod');

    await expect(loadConfig()).rejects.toThrow('Invalid environment variables');
  });
});
