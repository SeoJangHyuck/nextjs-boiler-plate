import {
  dehydrate,
  environmentManager,
  type QueryKey,
} from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getQueryClient } from '@/lib/api/query-client';

describe('getQueryClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('브라우저에서는 같은 클라이언트를 재사용한다', () => {
    vi.spyOn(environmentManager, 'isServer').mockReturnValue(false);

    expect(getQueryClient()).toBe(getQueryClient());
  });

  it('서버에서는 요청 간에 캐시가 섞이지 않도록 매번 새로 만든다', () => {
    vi.spyOn(environmentManager, 'isServer').mockReturnValue(true);

    expect(getQueryClient()).not.toBe(getQueryClient());
  });

  it('서버에서는 실패한 요청을 다시 시도하지 않는다', () => {
    const isServer = vi.spyOn(environmentManager, 'isServer');

    isServer.mockReturnValue(true);
    expect(getQueryClient().getDefaultOptions().queries?.retry).toBe(0);

    isServer.mockReturnValue(false);
    expect(getQueryClient().getDefaultOptions().queries?.retry).toBe(1);
  });

  it('진행 중인 쿼리도 dehydrate 대상에 포함한다', () => {
    const queryClient = getQueryClient();
    const shouldDehydrate =
      queryClient.getDefaultOptions().dehydrate?.shouldDehydrateQuery;
    const query = queryClient
      .getQueryCache()
      .build<unknown, Error, unknown, QueryKey>(queryClient, {
        queryKey: ['pending'],
      });

    expect(query.state.status).toBe('pending');
    expect(shouldDehydrate?.(query)).toBe(true);
  });

  it('완료된 쿼리를 dehydrate해 전달한다', () => {
    vi.spyOn(environmentManager, 'isServer').mockReturnValue(true);
    const queryClient = getQueryClient();
    queryClient.setQueryData(['done'], 'data');

    expect(dehydrate(queryClient).queries).toMatchObject([
      { queryKey: ['done'], state: { data: 'data', status: 'success' } },
    ]);
  });
});
