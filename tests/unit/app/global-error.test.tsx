import {
  QueryErrorResetBoundary,
  type useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import { render, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GlobalError from '@/app/global-error';

const secretError = new Error('db password: 1234');

describe('전역 오류 화면', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provider 없이 두 언어로 렌더링하고 오류의 원래 메시지를 숨긴다', () => {
    const html = renderToStaticMarkup(
      <GlobalError error={secretError} retry={() => undefined} />
    );

    expect(html).toContain('오류가 발생했습니다');
    expect(html).toContain('Try again');
    expect(html).not.toContain('password');
  });

  // React는 문서에 다른 루트가 먼저 생기면 document 루트에 이벤트를 연결하지 않는다.
  // 그래서 이 테스트는 다른 화면 테스트와 파일을 나눈다.
  it('로그를 남기고, 실패한 Suspense 쿼리를 초기화한 뒤 다시 시도한다', async () => {
    const retry = vi.fn();
    let boundary: ReturnType<typeof useQueryErrorResetBoundary> | undefined;
    render(
      <QueryErrorResetBoundary>
        {(value) => {
          boundary = value;
          return <GlobalError error={secretError} retry={retry} />;
        }}
      </QueryErrorResetBoundary>,
      { container: document }
    );
    expect(boundary?.isReset()).toBe(false);

    const user = userEvent.setup();
    await user.click(within(document.body).getByRole('button'));

    expect(boundary?.isReset()).toBe(true);
    expect(retry).toHaveBeenCalledOnce();
    expect(console.error).toHaveBeenCalledWith(secretError);
  });
});
