import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);
const port = process.env.PORT ?? '3000';
const baseURL = `http://localhost:${port}`;

/**
 * macOS 27에서 Firefox가 'Could not find profile folder'로 실행되지 않아 임시 홈을 지정한다.
 * 상위 이슈는 닫혔지만 Playwright 1.65.1(Firefox 159)에서도 재현된다. (2026-11-26 확인)
 * https://github.com/microsoft/playwright/issues/42768
 */
const getFirefoxLaunchOptions = () => {
  if (process.platform !== 'darwin') {
    return {};
  }

  const home = path.join(tmpdir(), 'playwright-firefox-home');
  mkdirSync(home, { recursive: true });
  return { env: { ...process.env, CFFIXED_USER_HOME: home } };
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // CI에서는 안정성을 위해 하나씩 실행하고, 작업 제한 시간 전에 끝내 리포트를 남긴다.
  ...(isCI && { workers: 1, globalTimeout: 20 * 60 * 1000 }),
  // 로컬에서 실패해도 리포트 서버가 터미널을 붙잡지 않도록 자동 열기를 끈다.
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: getFirefoxLaunchOptions(),
      },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    // CI는 앞 단계에서 빌드를 끝내므로 서버만 띄운다.
    command: isCI ? 'pnpm start' : 'pnpm build && pnpm start',
    url: baseURL,
    env: { PORT: port },
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
