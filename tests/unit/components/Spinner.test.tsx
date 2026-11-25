import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from '@/components/ui/Spinner';

describe('Spinner', () => {
  it('보조 기술에 진행 중임을 알린다', () => {
    render(<Spinner label="로딩 중..." />);

    expect(screen.getByRole('status')).toHaveTextContent('로딩 중...');
  });

  it('바깥 요소에 className을 추가할 수 있다', () => {
    render(<Spinner label="로딩 중..." className="p-4" />);

    expect(screen.getByRole('status')).toHaveClass('p-4');
  });
});
