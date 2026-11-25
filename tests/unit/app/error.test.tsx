import {
  QueryErrorResetBoundary,
  type useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorPage from '@/app/[locale]/error';
import en from '../../../messages/en.json';
import ko from '../../../messages/ko.json';

const secretError = new Error('db password: 1234');

describe('오류 화면', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['ko', ko],
    ['en', en],
  ] as const)(
    '%s: 번역된 문구를 보여 주고 다시 시도할 수 있다',
    async (locale, messages) => {
      const user = userEvent.setup();
      const retry = vi.fn();
      render(
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorPage error={secretError} retry={retry} />
        </NextIntlClientProvider>
      );

      expect(
        screen.getByRole('heading', { name: messages.common.error })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', { name: messages.common.retry })
      );
      expect(retry).toHaveBeenCalledOnce();
    }
  );

  it('다시 시도하면 실패한 Suspense 쿼리도 초기화한다', async () => {
    const user = userEvent.setup();
    let boundary: ReturnType<typeof useQueryErrorResetBoundary> | undefined;
    render(
      <QueryErrorResetBoundary>
        {(value) => {
          boundary = value;
          return (
            <NextIntlClientProvider locale="ko" messages={ko}>
              <ErrorPage error={secretError} retry={() => undefined} />
            </NextIntlClientProvider>
          );
        }}
      </QueryErrorResetBoundary>
    );

    expect(boundary?.isReset()).toBe(false);

    await user.click(screen.getByRole('button'));
    expect(boundary?.isReset()).toBe(true);
  });

  it('오류의 원래 메시지를 화면에 노출하지 않고 로그로만 남긴다', () => {
    render(
      <NextIntlClientProvider locale="ko" messages={ko}>
        <ErrorPage error={secretError} retry={() => undefined} />
      </NextIntlClientProvider>
    );

    expect(document.body).not.toHaveTextContent('password');
    expect(console.error).toHaveBeenCalledWith(secretError);
  });
});
