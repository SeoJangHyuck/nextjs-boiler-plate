import type { ApiErrorBody } from '@/types';

/** 서버가 실패로 응답했을 때 던지는 오류 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorBody['details'];

  constructor(status: number, { code, message, details }: ApiErrorBody) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
