import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('거짓 값은 제외하고 합친다', () => {
    const isActive = false;
    expect(cn('p-4', isActive && 'hidden', undefined, null)).toBe('p-4');
  });

  it('충돌하는 Tailwind 유틸리티는 뒤의 값이 이긴다', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});
