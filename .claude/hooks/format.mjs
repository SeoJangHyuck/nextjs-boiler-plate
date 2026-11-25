/**
 * PostToolUse 훅: Claude가 편집한 파일을 Prettier로 정리한다.
 * - 프로젝트 밖의 파일, .prettierignore 대상, Prettier가 모르는 형식은 건드리지 않는다.
 * - 문법 오류 등으로 정리하지 못하면 이유를 Claude에게 알린다(exit 2). 편집 자체는 막지 않는다.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

const readStdin = async () => {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
};

const isInsideProject = (filePath) => {
  const relative = path.relative(projectDir, filePath);
  return (
    relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)
  );
};

const main = async () => {
  const { tool_input: toolInput } = JSON.parse(await readStdin());
  if (typeof toolInput?.file_path !== 'string') return;

  const filePath = path.resolve(projectDir, toolInput.file_path);
  if (!isInsideProject(filePath)) return;

  // 의존성을 설치하기 전이라면 조용히 건너뛴다.
  const prettier = await import('prettier').catch(() => null);
  if (!prettier) return;

  const { ignored, inferredParser } = await prettier.getFileInfo(filePath, {
    ignorePath: path.join(projectDir, '.prettierignore'),
    resolveConfig: true,
  });
  if (ignored || !inferredParser) return;

  const source = await readFile(filePath, 'utf8').catch(() => null);
  if (source === null) return;

  const config = await prettier.resolveConfig(filePath);
  const formatted = await prettier.format(source, {
    ...config,
    filepath: filePath,
  });

  if (formatted !== source) {
    await writeFile(filePath, formatted);
  }
};

try {
  await main();
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`Prettier로 정리하지 못했습니다: ${reason}`);
  process.exitCode = 2;
}
