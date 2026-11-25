import { expect, test } from '@playwright/test';

const pages = [
  {
    path: '/ko/unknown',
    title: '페이지를 찾을 수 없습니다 | Next.js 보일러플레이트',
    heading: '페이지를 찾을 수 없습니다',
    back: '홈으로 돌아가기',
    home: /\/ko$/,
  },
  {
    path: '/en/deep/unknown/path',
    title: 'Page not found | Next.js Boilerplate',
    heading: 'Page not found',
    back: 'Back to home',
    home: /\/en$/,
  },
];

for (const { path, title, heading, back, home } of pages) {
  test(`${path}: 현지화된 404 화면을 404 상태 코드로 응답한다`, async ({
    page,
  }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      'content',
      /noindex/
    );

    await page.getByRole('link', { name: back }).click();
    await expect(page).toHaveURL(home);
  });
}

test.describe('확장자가 있는 파일 경로는 proxy가 locale을 붙이지 않는다', () => {
  // 리다이렉트를 따라가면 잘못된 이동을 놓치므로 막는다.
  const options = { maxRedirects: 0 };

  test('있는 파일은 그대로 응답한다', async ({ request }) => {
    const response = await request.get('/icon.svg', options);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/svg+xml');
  });

  test('없는 파일은 404로 응답한다', async ({ request }) => {
    const response = await request.get('/unknown.txt', options);

    expect(response.status()).toBe(404);
  });
});
