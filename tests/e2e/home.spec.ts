import { expect, test } from '@playwright/test';

// Firefox는 Pretendard 글꼴 파일의 메타데이터 순서를 경고한다. 표시에는 영향이 없다.
const IGNORED_MESSAGE = /downloadable font: name: name records are not sorted/;

test.describe('홈', () => {
  test('콘솔 오류 없이 렌더링되고 동작한다', async ({ page }) => {
    const problems: string[] = [];
    page.on('console', (message) => {
      const isProblem = ['error', 'warning'].includes(message.type());
      if (isProblem && !IGNORED_MESSAGE.test(message.text())) {
        problems.push(`${message.type()}: ${message.text()}`);
      }
    });
    page.on('pageerror', (error) => {
      problems.push(`pageerror: ${error.message}`);
    });

    // 문서를 다시 불러오지 않고 이동해야 hydration이 끝난 것이다.
    await expect(async () => {
      await page.goto('/ko');
      await page.evaluate(() => Object.assign(window, { kept: true }));
      await page.getByRole('link', { name: 'English' }).click();
      await expect(page).toHaveURL(/\/en$/);
      expect(await page.evaluate(() => 'kept' in window)).toBe(true);
    }).toPass();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    expect(problems).toEqual([]);
  });

  test('언어 전환 링크를 한국어, 영어 순서로 보여 준다', async ({ page }) => {
    await page.goto('/en');

    await expect(page.getByRole('navigation').getByRole('link')).toHaveText([
      '한국어',
      'English',
    ]);
  });

  test('전역 스타일이 Tailwind 여백을 지우지 않는다', async ({ page }) => {
    await page.goto('/ko');

    await expect(page.getByRole('main')).not.toHaveCSS('padding-left', '0px');
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveCSS(
      'margin-bottom',
      '0px'
    );
  });

  test('디자인 토큰이 적용된다', async ({ page }) => {
    await page.goto('/ko');
    const currentLink = page.getByRole('link', { name: '한국어' });

    // src/styles/_colors.scss와 _variables.scss의 값
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(0, 23, 38)'
    );
    await expect(currentLink).toHaveCSS('background-color', 'rgb(0, 173, 159)');
    await expect(currentLink).toHaveCSS('border-top-left-radius', '16px');
  });

  test('Pretendard 글꼴을 내려받아 사용한다', async ({ page }) => {
    await page.goto('/ko');
    await expect(page.locator('body')).toHaveCSS('font-family', /pretendard/i);

    // 대체 글꼴('pretendard Fallback')이 아니라 실제 글꼴이 로드됐는지 확인한다.
    await expect
      .poll(() =>
        page.evaluate(() =>
          [...document.fonts]
            .filter(({ status }) => status === 'loaded')
            .map(({ family }) => family.replaceAll('"', ''))
        )
      )
      .toContain('pretendard');
  });
});
