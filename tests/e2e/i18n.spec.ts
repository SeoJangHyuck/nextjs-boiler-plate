import { expect, test } from '@playwright/test';

const ONE_YEAR_IN_DAYS = 365;
const LOCALE_COOKIE = 'i18n_redirected';

test.describe('locale 감지', () => {
  const cases = [
    { browserLocale: 'ko-KR', expected: '/ko' },
    { browserLocale: 'en-US', expected: '/en' },
    { browserLocale: 'fr-FR', expected: '/en' },
  ];

  for (const { browserLocale, expected } of cases) {
    test.describe(browserLocale, () => {
      test.use({ locale: browserLocale });

      test(`루트는 ${expected}로 이동한다`, async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(new RegExp(`${expected}$`));
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      });

      test('locale 없는 경로는 감지한 locale을 붙여 이동한다', async ({
        page,
      }) => {
        await page.goto('/unknown?ref=1');
        await expect(page).toHaveURL(
          new RegExp(`${expected}/unknown\\?ref=1$`)
        );
      });
    });
  }
});

test.describe('locale 기억', () => {
  test.use({ locale: 'en-US' });

  test('선택한 언어를 쿠키 하나에 1년간 저장하고 다음 방문에 사용한다', async ({
    page,
    context,
  }) => {
    await page.goto('/ko');

    const cookies = await context.cookies();
    const localeCookie = cookies.find(({ name }) => name === LOCALE_COOKIE);
    const daysLeft =
      ((localeCookie?.expires ?? 0) - Date.now() / 1000) / (60 * 60 * 24);

    expect(localeCookie?.value).toBe('ko');
    expect(Math.round(daysLeft)).toBe(ONE_YEAR_IN_DAYS);
    expect(cookies.map(({ name }) => name)).not.toContain('NEXT_LOCALE');

    await page.goto('/');
    await expect(page).toHaveURL(/\/ko$/);
  });
});

test.describe('언어 전환', () => {
  test.use({ locale: 'ko-KR' });

  test('한국어에서 영어로 전환하고 다시 돌아온다', async ({ page }) => {
    await page.goto('/ko');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    await expect(page).toHaveTitle('Next.js 보일러플레이트');
    await expect(page.getByRole('link', { name: '한국어' })).toHaveAttribute(
      'aria-current',
      'true'
    );

    await page.getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle('Next.js Boilerplate');
    await expect(page.getByRole('link', { name: 'English' })).toHaveAttribute(
      'aria-current',
      'true'
    );

    await page.getByRole('link', { name: '한국어' }).click();
    await expect(page).toHaveURL(/\/ko$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  });
});
