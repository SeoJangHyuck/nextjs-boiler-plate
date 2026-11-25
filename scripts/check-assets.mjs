/**
 * 이미지, SVG, 비디오, 배경 파일의 이름과 위치를 검사한다.
 * 규칙: .claude/rules/assets.md
 *
 * node scripts/check-assets.mjs           public과 src 전체
 * node scripts/check-assets.mjs <파일...>  지정한 파일만 (lint-staged)
 */
import { existsSync, readdirSync, realpathSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const BITMAPS = ['avif', 'gif', 'jpeg', 'jpg', 'png', 'webp'];
const VIDEOS = ['mp4', 'webm'];

/** public 아래 폴더별 규칙 */
const KINDS = new Map([
  ['images', { prefix: 'img-', extensions: BITMAPS }],
  ['icons', { prefix: 'icon-', extensions: ['svg'] }],
  ['videos', { prefix: 'vid-', extensions: VIDEOS }],
  ['backgrounds', { prefix: 'bg-', extensions: [...BITMAPS, 'svg'] }],
]);

/** 웹에 바로 쓰지 않고 변환해야 하는 형식 */
const UNSUPPORTED = [
  'apng',
  'avi',
  'bmp',
  'heic',
  'heif',
  'jfif',
  'jxl',
  'm4v',
  'mkv',
  'mov',
  'ogv',
  'svgz',
  'tif',
  'tiff',
  'wmv',
];

/** 종류 폴더 밖에 있으면 안 되는 확장자 */
const MEDIA = new Set([...BITMAPS, ...VIDEOS, ...UNSUPPORTED, 'ico', 'svg']);

const KEBAB_CASE = '[a-z0-9]+(?:-[a-z0-9]+)*';
const FOLDER_NAME = new RegExp(`^${KEBAB_CASE}$`);

/** 이름과 위치가 이미 정해져 있어 규칙을 적용하지 않는 파일 */
const EXCEPTIONS = [
  // Next.js 메타데이터 파일. Next.js가 인식하는 이름과 확장자만 허용한다.
  /^src\/app\/favicon\.ico$/,
  /^src\/app\/(?:.+\/)?icon\d?\.(?:ico|jpe?g|png|svg)$/,
  /^src\/app\/(?:.+\/)?apple-icon\d?\.(?:jpe?g|png)$/,
  /^src\/app\/(?:.+\/)?(?:opengraph|twitter)-image\d?\.(?:jpe?g|png|gif)$/,
  // 표준이 경로를 정한 파일
  /^public\/\.well-known\//,
  /^src\/fonts\//,
];

/** 확장자로 알맞은 위치를 제안한다. */
const suggest = (extension) => {
  if (extension === 'svg') {
    return 'public/icons/icon-<이름>.svg (배경이면 public/backgrounds/bg-<이름>.svg)';
  }
  if (VIDEOS.includes(extension)) {
    return `public/videos/vid-<이름>.${extension}`;
  }
  if (BITMAPS.includes(extension)) {
    return `public/images/img-<이름>.${extension} (배경이면 public/backgrounds/bg-<이름>.${extension})`;
  }
  if (extension === 'ico') {
    return 'src/app/favicon.ico';
  }
  return 'webp, avif, svg, mp4, webm 등으로 변환한 파일';
};

/**
 * 규칙을 어긴 이유를 반환한다. 문제가 없으면 null을 반환한다.
 * @param {string} file 저장소 루트 기준 경로
 * @returns {string | null}
 */
export const findAssetProblem = (file) => {
  const normalized = file.replaceAll('\\', '/').normalize('NFC');
  const name = path.posix.basename(normalized);
  const extension = path.posix.extname(name).slice(1).toLowerCase();

  // .gitkeep 같은 숨김 파일은 에셋이 아니다.
  if (
    name.startsWith('.') ||
    EXCEPTIONS.some((pattern) => pattern.test(normalized))
  ) {
    return null;
  }

  const [root, folder = '', ...rest] = normalized.split('/');
  const kind =
    root === 'public' && rest.length > 0 ? KINDS.get(folder) : undefined;

  if (!kind) {
    return MEDIA.has(extension)
      ? `위치가 맞지 않습니다. 사용: ${suggest(extension)}`
      : null;
  }

  if (!kind.extensions.includes(extension)) {
    return `public/${folder}에는 ${kind.extensions.join(', ')}만 둡니다. 사용: ${suggest(extension)}`;
  }

  const namePattern = new RegExp(
    `^${kind.prefix}${KEBAB_CASE}\\.(?:${kind.extensions.join('|')})$`
  );

  if (!namePattern.test(name)) {
    return `이름은 '${kind.prefix}'로 시작하는 소문자 kebab-case여야 합니다. 예: ${kind.prefix}home-main.${extension}`;
  }

  if (!rest.slice(0, -1).every((part) => FOLDER_NAME.test(part))) {
    return '하위 폴더 이름은 소문자 kebab-case여야 합니다.';
  }

  return null;
};

/**
 * public과 src의 모든 파일을 저장소 루트 기준 경로로 반환한다.
 * 심볼릭 링크도 배포되므로 포함한다.
 * @param {string} root
 * @returns {string[]}
 */
export const listFiles = (root) =>
  ['public', 'src']
    .map((directory) => path.join(root, directory))
    .filter((directory) => existsSync(directory))
    .flatMap((directory) =>
      readdirSync(directory, { recursive: true, withFileTypes: true })
    )
    .filter((entry) => !entry.isDirectory())
    .map((entry) =>
      path.relative(root, path.join(entry.parentPath, entry.name))
    );

const run = (args) => {
  const files =
    args.length > 0
      ? args.map((file) => path.relative(ROOT, path.resolve(file)))
      : listFiles(ROOT);
  const problems = files
    .map((file) => ({ file, reason: findAssetProblem(file) }))
    .filter(({ reason }) => reason !== null);

  for (const { file, reason } of problems) {
    console.error(`✖ ${file}\n  ${reason}`);
  }

  return problems.length > 0 ? 1 : 0;
};

const entry = process.argv[1];
if (entry && import.meta.filename === realpathSync(entry)) {
  process.exitCode = run(process.argv.slice(2));
}
