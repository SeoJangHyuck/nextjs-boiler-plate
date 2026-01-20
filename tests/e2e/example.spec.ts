import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');

    // 페이지가 로드되었는지 확인
    await expect(page).toHaveURL(/\/(ko|en)$/);
  });

  test('should have correct title', async ({ page }) => {
    await page.goto('/');

    // 페이지 타이틀 확인
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Language Switch', () => {
  test('should switch language from Korean to English', async ({ page }) => {
    await page.goto('/ko');

    // 언어 변경 버튼 클릭
    const langButton = page.getByRole('link', { name: /English/i });
    if (await langButton.isVisible()) {
      await langButton.click();
      await expect(page).toHaveURL(/\/en/);
    }
  });
});
