import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useApiMutation, useApiQuery } from '@/lib/api';

const jsonResponse = (data: unknown) =>
  new Response(JSON.stringify({ data, success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });

type WrapperProps = { children: ReactNode };

const setup = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
};

describe('API 훅', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockImplementation(async () => jsonResponse('ok'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  describe('useApiQuery', () => {
    it('지정한 주소를 조회해 지정한 키로 저장한다', async () => {
      fetchMock.mockResolvedValue(jsonResponse([1, 2]));
      const { queryClient, wrapper } = setup();

      const { result } = renderHook(
        () => useApiQuery<number[]>(['numbers', 'list'], '/numbers'),
        { wrapper }
      );

      await waitFor(() => expect(result.current.data).toEqual([1, 2]));
      expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(/\/numbers$/);
      expect(queryClient.getQueryData(['numbers', 'list'])).toEqual([1, 2]);
    });

    it('본문이 없는 성공 응답도 성공으로 처리한다', async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
      const { result } = renderHook(
        () => useApiQuery(['empty'], '/empty'),
        setup()
      );

      await waitFor(() => expect(result.current.status).toBe('success'));
      expect(result.current.data).toBeNull();
    });

    it('화면을 떠나면 진행 중인 요청을 취소한다', async () => {
      fetchMock.mockReturnValue(new Promise(() => undefined));
      const { unmount } = renderHook(
        () => useApiQuery(['slow'], '/slow'),
        setup()
      );
      await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
      const signal = fetchMock.mock.calls[0]?.[1]?.signal;
      expect(signal?.aborted).toBe(false);

      unmount();
      expect(signal?.aborted).toBe(true);
    });

    it('옵션을 전달하되 queryFn은 바꾸지 못한다', async () => {
      // 변수로 넘기면 초과 속성 검사를 통과하므로 실행 시점에도 막아야 한다.
      const options = {
        select: (data: string) => data.toUpperCase(),
        queryFn: async () => 'override',
      };
      const { result, rerender } = renderHook(
        ({ enabled }) =>
          useApiQuery<string>(['origin'], '/origin', { ...options, enabled }),
        { ...setup(), initialProps: { enabled: false } }
      );
      expect(fetchMock).not.toHaveBeenCalled();

      rerender({ enabled: true });
      await waitFor(() => expect(result.current.data).toBe('OK'));
    });
  });

  describe('useApiMutation', () => {
    it.each([
      [undefined, 'POST', '{"name":"a"}'],
      ['post', 'POST', '{"name":"a"}'],
      ['put', 'PUT', '{"name":"a"}'],
      ['patch', 'PATCH', '{"name":"a"}'],
      ['delete', 'DELETE', null],
    ] as const)(
      '%s는 %s 요청을 보낸다',
      async (method, httpMethod, expectedBody) => {
        const { result } = renderHook(
          () => useApiMutation<string, { name: string }>('/users', method),
          setup()
        );

        await result.current.mutateAsync({ name: 'a' });

        const [url, init] = fetchMock.mock.calls[0] ?? [];
        expect(String(url)).toMatch(/\/users$/);
        expect(init?.method).toBe(httpMethod);
        expect(init?.body ?? null).toBe(expectedBody);
      }
    );

    it('성공하면 결과를 옵션의 onSuccess에 전달한다', async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(
        () => useApiMutation<string, void>('/users', 'post', { onSuccess }),
        setup()
      );

      await result.current.mutateAsync();

      expect(onSuccess.mock.calls[0]?.[0]).toBe('ok');
    });
  });
});
