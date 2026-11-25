// @vitest-environment node
import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { findAssetProblem, listFiles } from '../../../scripts/check-assets.mjs';

describe('에셋 이름 검사', () => {
  it.each([
    'public/images/img-home-hero.webp',
    'public/images/home/img-home-hero-dark-mobile.png',
    'public/images/img-intro-poster.jpg',
    'public/images/img-2026-event.avif',
    'public/icons/icon-arrow-left.svg',
    'public/icons/brand/icon-logo.svg',
    'public/videos/vid-home-intro.mp4',
    'public/videos/vid-home-intro.webm',
    'public/backgrounds/bg-login.webp',
    'public/backgrounds/bg-pattern-dots.svg',
    'public\\images\\home\\img-windows-path.webp',
  ])('규칙을 지킨 파일은 통과한다: %s', (file) => {
    expect(findAssetProblem(file)).toBeNull();
  });

  it.each([
    ['접두사 없음', 'public/images/home-hero.webp'],
    ['다른 종류의 접두사', 'public/images/icon-home.png'],
    ['접두사만 있고 이름 없음', 'public/images/img-.png'],
    ['이미지 폴더의 SVG', 'public/images/img-logo.svg'],
    ['아이콘 폴더의 비트맵', 'public/icons/icon-home.png'],
    ['배경 폴더의 이미지 접두사', 'public/backgrounds/img-login.webp'],
    ['비디오 폴더의 이미지', 'public/videos/vid-poster.webp'],
    ['대문자', 'public/images/img-Home.webp'],
    ['대문자 확장자', 'public/images/img-home.PNG'],
    ['밑줄', 'public/images/img-home_hero.webp'],
    ['공백', 'public/images/img-home hero.webp'],
    ['한글', 'public/images/img-메인.webp'],
    ['배율 표기', 'public/images/img-home@2x.png'],
    ['연속 하이픈', 'public/images/img-home--hero.webp'],
    ['public 최상위의 이미지', 'public/img-home.webp'],
    ['정해지지 않은 폴더', 'public/assets/img-home.webp'],
    ['public의 favicon', 'public/favicon.ico'],
    ['public의 앱 아이콘', 'public/apple-touch-icon.png'],
    ['대문자 하위 폴더', 'public/images/Home/img-home.webp'],
    ['src 안의 이미지', 'src/components/Hero/img-hero.png'],
    ['src 안의 SVG', 'src/assets/icon-home.svg'],
    ['변환이 필요한 이미지', 'public/images/img-home.heic'],
    ['변환이 필요한 비디오', 'public/videos/vid-home.mov'],
    ['종류 폴더 밖의 변환 대상', 'src/assets/photo.jfif'],
    ['종류 폴더의 다른 파일', 'public/images/readme.md'],
    ['최상위가 아닌 favicon', 'src/app/[locale]/favicon.ico'],
    ['Next.js가 모르는 아이콘 형식', 'src/app/icon.webp'],
    ['Next.js가 모르는 공유 이미지 형식', 'src/app/opengraph-image.webp'],
  ])('규칙을 어기면 이유를 알려 준다: %s', (_, file) => {
    expect(findAssetProblem(file)).toEqual(expect.any(String));
  });

  it.each([
    'src/app/icon.svg',
    'src/app/favicon.ico',
    'src/app/apple-icon.png',
    'src/app/[locale]/opengraph-image.png',
    'src/app/[locale]/(group)/twitter-image.jpg',
    'src/app/icon1.png',
    'src/fonts/pretendard/specimen.svg',
    'public/.well-known/logo.png',
    'public/robots.txt',
    'public/images/.gitkeep',
    'src/components/ui/Spinner/Spinner.module.scss',
  ])(
    'Next.js가 이름을 정한 파일과 에셋이 아닌 파일은 검사하지 않는다: %s',
    (file) => {
      expect(findAssetProblem(file)).toBeNull();
    }
  );

  it('올바른 위치와 예시를 안내한다', () => {
    expect(findAssetProblem('public/images/hero.webp')).toContain('img-');
    expect(findAssetProblem('public/logo.svg')).toContain('public/icons');
    expect(findAssetProblem('public/favicon.ico')).toContain(
      'src/app/favicon.ico'
    );
    expect(findAssetProblem('public/clip.mov')).toContain('변환');
  });
});

describe('에셋 파일 수집', () => {
  let root = '';

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'check-assets-'));
    mkdirSync(path.join(root, 'public/images/home'), { recursive: true });
    mkdirSync(path.join(root, 'docs'));
    writeFileSync(path.join(root, 'public/images/home/img-a.webp'), '');
    writeFileSync(path.join(root, 'docs/b.webp'), '');
    symlinkSync(
      path.join(root, 'docs/b.webp'),
      path.join(root, 'public/images/b.webp')
    );
  });

  afterEach(() => {
    rmSync(root, { recursive: true });
  });

  it('public과 src의 파일을 심볼릭 링크까지 모두 찾는다', () => {
    expect(listFiles(root).sort()).toEqual([
      path.join('public', 'images', 'b.webp'),
      path.join('public', 'images', 'home', 'img-a.webp'),
    ]);
  });
});

describe('에셋 검사 명령', () => {
  const run = (...args: string[]) =>
    spawnSync(process.execPath, ['scripts/check-assets.mjs', ...args], {
      encoding: 'utf8',
    });

  it('저장소의 에셋이 모두 규칙을 지킨다', () => {
    const { status, stderr } = run();

    expect(stderr).toBe('');
    expect(status).toBe(0);
  });

  it('절대 경로로 받은 파일이 규칙을 어기면 이유를 알리고 실패한다', () => {
    const { status, stderr } = run(
      path.resolve('public/images/img-ok.webp'),
      path.resolve('public/images/hero.webp')
    );

    expect(status).toBe(1);
    expect(stderr).toContain('hero.webp');
    expect(stderr).not.toContain('img-ok.webp');
  });

  it.each([
    ['images/img-ok.webp', 0],
    ['images/hero.webp', 1],
  ])(
    '다른 폴더에서 실행해도 저장소 기준으로 검사한다: %s → %i',
    (file, expected) => {
      const { status } = spawnSync(
        process.execPath,
        [path.resolve('scripts/check-assets.mjs'), file],
        { cwd: 'public' }
      );

      expect(status).toBe(expected);
    }
  );
});
