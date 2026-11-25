// 공통 타입 정의

export type { Locale } from '@/lib/i18n/config';

// API 응답 타입
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

// 페이지네이션 타입
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// 실패 응답 본문 타입
export type ApiErrorBody = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

// 유저 타입 - OIDC 연동 시 user.ts에서 export 추가 예정
// export * from './user';
