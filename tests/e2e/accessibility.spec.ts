import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`접근성 (${colorScheme})`, () => {
    test.use({ colorScheme });

    for (const path of ['/ko', '/en', '/ko/unknown']) {
      test(`${path}: 자동 검사 위반이 없다`, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();

        expect(
          violations.map(({ id, nodes }) => `${id}: ${nodes[0]?.html}`)
        ).toEqual([]);
      });
    }
  });
}
