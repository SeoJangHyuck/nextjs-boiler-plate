'use client';

import { useEffect, type CSSProperties } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

type GlobalErrorProps = {
  error: unknown;
  retry: () => void;
};

// 루트 레이아웃이 실패한 상황이므로 전역 CSS에 의존하지 않고 인라인 스타일만 사용한다.
const styles = {
  body: {
    margin: 0,
    backgroundColor: '#001726',
    color: '#fff',
    fontFamily: 'system-ui, sans-serif',
  },
  main: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
    textAlign: 'center',
  },
  button: {
    border: 0,
    borderRadius: 8,
    padding: '12px 24px',
    backgroundColor: '#00ad9f',
    color: '#001726',
    font: 'inherit',
    cursor: 'pointer',
  },
} satisfies Record<string, CSSProperties>;

/**
 * 루트 레이아웃 자체가 실패했을 때의 마지막 화면
 * 번역 provider를 사용할 수 없으므로 두 언어를 함께 표시한다.
 */
export default function GlobalError({ error, retry }: GlobalErrorProps) {
  const { reset } = useQueryErrorResetBoundary();

  // 실패한 Suspense 쿼리는 초기화해야 다시 요청한다. (Provider 없이도 동작한다)
  const handleRetry = () => {
    reset();
    retry();
  };

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body style={styles.body}>
        <title>오류가 발생했습니다 | An error occurred</title>
        <main style={styles.main}>
          <h1>오류가 발생했습니다</h1>
          <p lang="en">An error occurred</p>
          <button type="button" style={styles.button} onClick={handleRetry}>
            다시 시도 · <span lang="en">Try again</span>
          </button>
        </main>
      </body>
    </html>
  );
}
