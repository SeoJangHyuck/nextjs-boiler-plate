import {
  useMutation,
  useQuery,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { apiClient } from './client';

// 예시: 범용 데이터 조회 훅
// 키는 query key 팩토리(readonly 튜플)를 그대로 넘길 수 있다.
export const useApiQuery = <T>(
  queryKey: QueryKey,
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) =>
  useQuery<T>({
    ...options,
    queryKey,
    // 컴포넌트가 사라지거나 키가 바뀌면 진행 중인 요청을 취소한다.
    queryFn: ({ signal }) => apiClient.get<T>(endpoint, { signal }),
  });

// 예시: 범용 데이터 변경 훅
export const useApiMutation = <TData, TVariables>(
  endpoint: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post',
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
) =>
  useMutation<TData, Error, TVariables>({
    ...options,
    mutationFn: (variables) => {
      switch (method) {
        case 'post':
          return apiClient.post<TData>(endpoint, variables);
        case 'put':
          return apiClient.put<TData>(endpoint, variables);
        case 'patch':
          return apiClient.patch<TData>(endpoint, variables);
        case 'delete':
          return apiClient.delete<TData>(endpoint);
      }
    },
  });
