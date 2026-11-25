// @vitest-environment node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/postcss';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';

const entry = path.resolve('src/styles/tailwind.css');

const build = async () => {
  const { css } = await postcss([tailwindcss()]).process(
    readFileSync(entry, 'utf8'),
    { from: entry }
  );
  return css;
};

describe('Tailwind', () => {
  it('src에서 쓰는 클래스만 생성한다', async () => {
    const css = await build();
    // 이 테스트 파일에만 있는 클래스
    const outsideClass = 'bg-[#0a1b2c]';

    // src/app과 src/components에서 사용하는 클래스
    expect(css).toContain('.min-w-28');
    expect(css).not.toContain(outsideClass.slice(4, -1));
  });

  it('연결한 토큰을 다시 정의하지 않고 참조한다', async () => {
    const css = await build();

    expect(css).toContain('border-radius: var(--radius-xl)');
    expect(css).toContain('background-color: var(--color-primary)');
    // 값의 출처는 src/styles/_tokens.scss 하나다.
    expect(css).not.toMatch(/--(radius-xl|color-primary):/);
  });

  it('연결한 토큰이 모두 전역 스타일에 정의되어 있다', () => {
    const theme = /@theme inline reference \{([^}]*)\}/.exec(
      readFileSync(entry, 'utf8')
    )?.[1];
    const referenced = [...(theme ?? '').matchAll(/var\((--[\w-]+)\)/g)].map(
      ([, name]) => name
    );
    const tokens = readFileSync('src/styles/_tokens.scss', 'utf8');

    expect(referenced.length).toBeGreaterThan(0);
    expect(referenced.filter((name) => !tokens.includes(`${name}:`))).toEqual(
      []
    );
  });
});
