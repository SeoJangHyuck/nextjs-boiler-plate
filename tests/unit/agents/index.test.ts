// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFileSync(file, 'utf8');

const namesIn = (directory: string) =>
  readdirSync(directory)
    .filter((name) => !name.startsWith('.'))
    .map((name) => path.parse(name).name);

const agentsMd = read('AGENTS.md');
const claudeMd = read('CLAUDE.md');

describe('에이전트 지침의 목록', () => {
  it('AGENTS.md는 모든 규칙 파일을 한 번씩 안내한다', () => {
    const listed = [...agentsMd.matchAll(/`([a-z-]+)\.md`/g)].map(
      ([, name]) => name
    );

    expect(listed.sort()).toEqual(namesIn('.claude/rules').sort());
  });

  it.each(namesIn('.claude/skills'))(
    'CLAUDE.md는 %s 스킬의 쓰임을 안내한다',
    (name) => {
      expect(claudeMd).toMatch(new RegExp(`\`/?${name}\``));
    }
  );

  it.each(namesIn('.claude/agents'))(
    'CLAUDE.md는 %s 서브에이전트의 쓰임을 안내한다',
    (name) => {
      expect(claudeMd).toContain(`\`${name}\``);
    }
  );

  it('CLAUDE.md는 프로젝트 플러그인을 모두 안내한다', () => {
    const { enabledPlugins } = JSON.parse(read('.claude/settings.json'));
    const plugins = Object.keys(enabledPlugins).map((id) => id.split('@')[0]);

    expect(plugins.length).toBeGreaterThan(0);
    expect(plugins.filter((name) => !claudeMd.includes(`\`${name}`))).toEqual(
      []
    );
  });
});
