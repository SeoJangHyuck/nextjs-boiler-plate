import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient, ApiError } from '@/lib/api';

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

describe('apiClient', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockImplementation(async () =>
      jsonResponse({ data: 'ok', success: true })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    fetchMock.mockReset();
  });

  it('설정한 API 주소 뒤에 경로를 붙인다', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    vi.resetModules();
    const { apiClient: client } = await import('@/lib/api');

    await client.get('/users');

    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/users');
  });

  it('쿼리 파라미터를 붙이고 data만 반환한다', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [1], success: true }));

    await expect(
      apiClient.get<number[]>('/users', { params: { page: '1', q: 'a b' } })
    ).resolves.toEqual([1]);

    expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(
      /\/users\?page=1&q=a\+b$/
    );
  });

  it('취소 신호(AbortSignal)를 fetch에 전달한다', async () => {
    const { signal } = new AbortController();

    await apiClient.get('/users', { signal });

    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBe(signal);
  });

  it('메서드마다 알맞은 요청을 보낸다', async () => {
    const data = { name: 'a' };

    await apiClient.get('/r');
    await apiClient.post('/r', data);
    await apiClient.put('/r', data);
    await apiClient.patch('/r', data);
    await apiClient.delete('/r');

    const requests = fetchMock.mock.calls.map(([, init]) => [
      init?.method,
      init?.body ?? null,
    ]);
    expect(requests).toEqual([
      ['GET', null],
      ['POST', '{"name":"a"}'],
      ['PUT', '{"name":"a"}'],
      ['PATCH', '{"name":"a"}'],
      ['DELETE', null],
    ]);
  });

  it('0·false·빈 문자열 같은 값도 본문으로 보낸다', async () => {
    await apiClient.post('/flag', false);
    await apiClient.post('/count', 0);
    await apiClient.post('/text', '');
    await apiClient.post('/none');

    const bodies = fetchMock.mock.calls.map(([, init]) => init?.body ?? null);
    expect(bodies).toEqual(['false', '0', '""', null]);
  });

  it('본문이 있을 때만 JSON Content-Type을 붙이고, 호출자가 지정하면 그 값만 사용한다', async () => {
    await apiClient.get('/a');
    await apiClient.post('/b', {});
    await apiClient.post('/c', 'x', {
      headers: { 'Content-Type': 'text/plain' },
    });
    await apiClient.post('/d', 'x', {
      headers: new Headers({ 'content-type': 'text/csv', 'X-Trace': '1' }),
    });

    const sentHeaders = fetchMock.mock.calls.map(
      ([, init]) => new Headers(init?.headers)
    );
    expect(sentHeaders.map((headers) => headers.get('content-type'))).toEqual([
      null,
      'application/json',
      'text/plain',
      'text/csv',
    ]);
    expect(sentHeaders[3]?.get('x-trace')).toBe('1');
  });

  it.each([200, 201, 202, 204, 205])(
    '%i 응답에 본문이 없어도 실패하지 않는다',
    async (status) => {
      fetchMock.mockResolvedValue(new Response(null, { status }));

      await expect(apiClient.delete('/users/1')).resolves.toBeNull();
    }
  );

  it.each([null, { success: true }, { success: true, data: null }])(
    '성공 응답에 data가 없으면 null을 반환한다: %j',
    async (body) => {
      fetchMock.mockResolvedValue(jsonResponse(body));

      await expect(apiClient.get('/users/1')).resolves.toBeNull();
    }
  );

  it.each([
    ['배열', JSON.stringify([{ id: 1 }])],
    ['success가 없는 객체', JSON.stringify({ data: [], total: 0 })],
    ['success가 문자열인 객체', JSON.stringify({ success: 'true', data: 1 })],
    ['JSON이 아닌 본문', '<html></html>'],
  ])('성공 응답이 약속한 형식이 아니면 오류를 던진다: %s', async (_, text) => {
    fetchMock.mockResolvedValue(new Response(text));

    await expect(apiClient.get('/users')).rejects.toMatchObject({
      status: 200,
      code: 'INVALID_RESPONSE',
    });
  });

  it('상태 코드가 성공이어도 success가 false면 오류를 던진다', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ success: false, code: 'DENIED', message: '거부됨' })
    );

    await expect(apiClient.get('/users')).rejects.toMatchObject({
      code: 'DENIED',
      message: '거부됨',
    });
  });

  it.each([0, false, ''])('data가 %j이면 그대로 반환한다', async (data) => {
    fetchMock.mockResolvedValue(jsonResponse({ data, success: true }));

    await expect(apiClient.get('/value')).resolves.toBe(data);
  });

  it('실패 응답이면 서버의 오류 내용을 담은 ApiError를 던진다', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { code: 'NOT_FOUND', message: '없음', details: { id: 0 } },
        { status: 404 }
      )
    );

    const error = await apiClient.get('/users/0').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
      message: '없음',
      details: { id: 0 },
    });
  });

  it.each([
    ['JSON이 아닌 본문', () => new Response('oops', { status: 500 })],
    ['약속과 다른 본문', () => jsonResponse({ error: 'x' }, { status: 500 })],
    ['null 본문', () => jsonResponse(null, { status: 500 })],
  ])('%s이면 UNKNOWN_ERROR를 던진다', async (_, createResponse) => {
    fetchMock.mockResolvedValue(createResponse());

    await expect(apiClient.get('/users')).rejects.toMatchObject({
      status: 500,
      code: 'UNKNOWN_ERROR',
    });
  });
});
