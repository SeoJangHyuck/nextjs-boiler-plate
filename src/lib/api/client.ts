import { clientEnv } from '@/env';
import type { ApiErrorBody, ApiResponse } from '@/types';
import { ApiError } from './error';

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

const UNKNOWN_ERROR: ApiErrorBody = {
  code: 'UNKNOWN_ERROR',
  message: 'An unknown error occurred',
};

const INVALID_RESPONSE: ApiErrorBody = {
  code: 'INVALID_RESPONSE',
  message: 'Unexpected response format',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isErrorBody = (body: unknown): body is ApiErrorBody =>
  isRecord(body) &&
  typeof body.code === 'string' &&
  typeof body.message === 'string';

/** { data, success } 형식인지 확인한다. 내용이 없으면 data는 생략될 수 있다. */
const isApiResponse = <T>(body: unknown): body is Partial<ApiResponse<T>> =>
  isRecord(body) && typeof body.success === 'boolean';

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

/** undefined는 본문 없음, 그 외 값(0, false, '' 포함)은 JSON으로 직렬화 */
const toBody = (data: unknown): BodyInit | null =>
  data === undefined ? null : JSON.stringify(data);

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: toBody(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: toBody(data),
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: toBody(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...init } = options;
    const query = params ? `?${new URLSearchParams(params)}` : '';

    const headers = new Headers(init.headers);
    // 본문이 없는 요청에 붙이면 교차 출처에서 불필요한 preflight가 생긴다.
    if (init.body != null && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}${query}`, {
      ...init,
      headers,
    });

    const text = await response.text();

    if (!response.ok) {
      const body = parseJson(text);
      throw new ApiError(
        response.status,
        isErrorBody(body) ? body : UNKNOWN_ERROR
      );
    }

    // 204처럼 내용이 없는 성공 응답. TanStack Query는 undefined를 실패로 처리하므로 null을 쓴다.
    const body = text === '' ? null : parseJson(text);
    if (body === null) {
      return null as T;
    }

    if (!isApiResponse<T>(body)) {
      throw new ApiError(response.status, INVALID_RESPONSE);
    }

    if (body.success === false) {
      throw new ApiError(
        response.status,
        isErrorBody(body) ? body : UNKNOWN_ERROR
      );
    }

    return body.data ?? (null as T);
  }
}

export const apiClient = new ApiClient(clientEnv.NEXT_PUBLIC_API_URL ?? '');
