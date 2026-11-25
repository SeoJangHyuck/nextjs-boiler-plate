import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import NotFound from '@/app/[locale]/not-found';
import ko from '../../../messages/ko.json';

describe('404 화면', () => {
  it('안내 문구와 locale이 유지되는 홈 링크를 보여 준다', () => {
    render(
      <NextIntlClientProvider locale="ko" messages={ko}>
        <NotFound />
      </NextIntlClientProvider>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: ko.common.notFound })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: ko.common.backToHome })
    ).toHaveAttribute('href', '/ko');
  });
});
