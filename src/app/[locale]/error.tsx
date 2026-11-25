'use client';

import { useEffect } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const t = useTranslations('common');
  const { reset } = useQueryErrorResetBoundary();

  // 실패한 Suspense 쿼리는 초기화해야 다시 요청한다.
  const handleRetry = () => {
    reset();
    retry();
  };

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-2xl font-bold">{t('error')}</h1>
      <button
        type="button"
        onClick={handleRetry}
        className="rounded-lg bg-primary px-4 py-2 text-background transition-colors hover:bg-primary-light"
      >
        {t('retry')}
      </button>
    </main>
  );
}
