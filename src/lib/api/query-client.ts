import {
  QueryClient,
  defaultShouldDehydrateQuery,
  environmentManager,
} from '@tanstack/react-query';

const ONE_MINUTE = 60 * 1000;

// gcTime은 지정하지 않는다. 브라우저 기본값은 5분이고, 서버 기본값(Infinity)은
// 요청이 끝날 때 캐시가 함께 정리되도록 한다. (서버에서 값을 지정하면 메모리에 남는다)
const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ONE_MINUTE,
        // 서버에서는 화면을 늦추지 않도록 재시도하지 않는다.
        retry: environmentManager.isServer() ? 0 : 1,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // 서버에서 시작만 하고 await하지 않은 쿼리도 스트리밍으로 전달한다.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        // Next.js가 오류로 동적 렌더링을 감지하므로 가리지 않는다.
        // 사용자에게 보이는 오류는 Next.js가 digest로 대체한다.
        shouldRedactErrors: () => false,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

/** 서버는 요청마다 새로 만들고, 브라우저는 하나를 재사용한다. */
export const getQueryClient = (): QueryClient => {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  }

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};
