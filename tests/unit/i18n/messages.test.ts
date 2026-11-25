import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { locales } from '@/lib/i18n/config';
import en from '../../../messages/en.json';

type MessageTree = { [key: string]: string | MessageTree };

/** 중첩 메시지를 ['a.b.c', '문구'] 목록으로 펼친다. */
const flatten = (tree: MessageTree, prefix = ''): [string, string][] =>
  Object.entries(tree).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof child === 'string' ? [[path, child]] : flatten(child, path);
  });

const load = (locale: string): MessageTree =>
  JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));

const keysOf = (tree: MessageTree) =>
  flatten(tree)
    .map(([path]) => path)
    .sort();

describe('messages', () => {
  it('지원하는 모든 locale의 메시지 파일이 존재한다', () => {
    const files = readdirSync('messages')
      .filter((name) => name.endsWith('.json'))
      .map((name) => name.replace('.json', ''));

    expect(files.sort()).toEqual([...locales].sort());
  });

  describe.each(locales)('%s', (locale) => {
    it('키가 기준 파일(en)과 정확히 일치한다', () => {
      expect(keysOf(load(locale))).toEqual(keysOf(en));
    });

    it('비어 있는 번역이 없다', () => {
      const empty = flatten(load(locale)).filter(
        ([, text]) => text.trim() === ''
      );

      expect(empty).toEqual([]);
    });

    it('모든 locale의 언어 전환 라벨이 있다', () => {
      expect(keysOf(load(locale))).toEqual(
        expect.arrayContaining(locales.map((code) => `language.${code}`))
      );
    });
  });
});
