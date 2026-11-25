// @vitest-environment node
import { compileString } from 'sass';
import { describe, expect, it } from 'vitest';

/** next.config.ts의 sassOptions와 같은 방식으로 유틸리티를 주입해 컴파일한다. */
const compile = (source: string) => {
  const warnings: string[] = [];
  const { css } = compileString(`@use 'styles/utils' as *;\n${source}`, {
    loadPaths: ['src'],
    logger: { warn: (message) => warnings.push(message) },
  });

  return { css, warnings };
};

describe('SCSS 유틸리티', () => {
  it('불러오기만 하면 CSS를 출력하지 않는다', () => {
    // 출력이 생기면 모든 SCSS 파일에 중복된다.
    expect(compile('').css).toBe('');
  });

  it('변수, 믹스인, 함수를 @use 없이 사용할 수 있다', () => {
    const { css } = compile(`
      .card {
        @include body('md');
        border-radius: $radius-md;
        padding: px-to-rem(16px);
        @include tablet { padding: $spacing-lg; }
      }
    `);

    expect(css).toContain('font-size: 14px');
    expect(css).toContain('border-radius: 8px');
    expect(css).toContain('padding: 1rem');
    expect(css).toMatch(/min-width: 768px[^}]*\{[^}]*padding: 24px/);
  });

  it('body 믹스인은 굵기를 지정하면 그 값을, 아니면 기본값을 쓴다', () => {
    expect(compile(`.a { @include body('md'); }`).css).toContain(
      'font-weight: 400'
    );
    expect(compile(`.a { @include body('md', 700); }`).css).toContain(
      'font-weight: 700'
    );
  });

  it('aspect-ratio 믹스인은 비율을 나눗셈하지 않고 그대로 출력한다', () => {
    expect(compile('.a { @include aspect-ratio(16, 9); }').css).toMatch(
      /aspect-ratio: 16 ?\/ ?9/
    );
  });

  it.each([
    ['px-to-rem(24px)', '1.5rem'],
    ['px-to-em(8px)', '0.5em'],
    ['px-to-mm(3.7795px)', '1mm'],
    ['px-to-vw(153.6px)', '10vw'],
    ['px-to-vh(144px)', '10vh'],
    ['tablet-vw(76.8px)', 'max(76.8px, 10vw)'],
    ['mobile-vw(-32px)', 'min(-32px, -10vw)'],
    ['rem-to-pixel(2rem)', '32px'],
    ['em-to-pixel(2em)', '32px'],
  ])('%s는 %s로 변환한다', (input, expected) => {
    expect(compile(`.a { width: ${input}; }`).css).toContain(
      `width: ${expected};`
    );
  });

  it.each([
    ['mobile-only', '(max-width: 767px)'],
    ['tablet', '(min-width: 768px)'],
    ['tablet-only', '(min-width: 768px) and (max-width: 1279px)'],
    ['desktop', '(min-width: 1280px)'],
    ['between(100px, 200px)', '(min-width: 100px) and (max-width: 200px)'],
  ])('%s 믹스인은 %s 조건을 만든다', (mixin, expected) => {
    const { css } = compile(`.a { @include ${mixin} { color: red; } }`);

    expect(css).toContain(`@media ${expected} {`);
  });

  it('모든 믹스인과 함수가 폐기 경고 없이 컴파일된다', () => {
    const { warnings } = compile(`
      .text { @include heading('xl'); @include body('md', 700); @include truncate; }
      .clamp { @include line-clamp(3); }
      .hidden { @include sr-only; }
      .center { @include absolute-center; }
      .fixed { @include fixed-full; }
      .full { @include absolute-full; }
      .ratio { @include aspect-ratio(16, 9); }
      .scroll { @include custom-scrollbar; }
      .flex { @include horizontal-scroll(flex); }
      .inline { @include horizontal-scroll(default, auto, true); }
      .none { @include no-scroll; }
      .media {
        @include mobile-only { color: red; }
        @include tablet { color: red; }
        @include tablet-only { color: red; }
        @include desktop { color: red; }
        @include sm { color: red; }
        @include md { color: red; }
        @include lg { color: red; }
        @include xl { color: red; }
        @include xxl { color: red; }
        @include between(100px, 200px) { color: red; }
      }
      .unit {
        a: px-to-rem(24px); b: px-to-em(24px); c: px-to-mm(24px);
        d: px-to-vw(24px); e: px-to-vh(24px); f: tablet-vw(24px);
        g: mobile-vw(-24px); h: rem-to-pixel(2rem); i: em-to-pixel(2em);
        j: $z-index-modal; k: $spacing-md; l: $navy-70;
      }
    `);

    expect(warnings).toEqual([]);
  });
});
