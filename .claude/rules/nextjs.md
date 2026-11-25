---
paths:
  - 'src/app/**/*'
  - 'src/components/**/*.tsx'
  - 'src/env/**/*.ts'
  - 'src/proxy.ts'
  - 'next.config.ts'
---

# Next.js 컨벤션

## 라우트 구조

```text
src/app/
├── global-error.tsx          # 루트 레이아웃이 실패했을 때
├── api/                      # 라우트 핸들러
└── [locale]/                 # 루트 레이아웃 (html, body)
    ├── layout.tsx
    ├── loading.tsx
    ├── error.tsx
    ├── not-found.tsx
    ├── page.tsx
    └── [...rest]/page.tsx    # 모르는 경로 → notFound()
```

- `src/app/layout.tsx`를 만들지 않는다. `[locale]/layout.tsx`가 루트 레이아웃이어야 `next/root-params`가 동작한다.
- 라우트에 속하지 않는 파일은 `_components`, `_lib`처럼 `_` 폴더에 둔다.

## 서버와 클라이언트

- 기본은 서버 컴포넌트다. 이벤트 핸들러, 상태 훅, 브라우저 API가 필요할 때만 `'use client'`를 붙이고 경계를 말단까지 내린다.
- 서버 전용 모듈(비밀 값, DB)은 파일 첫 줄에 `import 'server-only'`를 둔다.
- 클라이언트로 넘기는 데이터는 필요한 필드만 고른다. 레코드를 통째로 넘기지 않는다.

## 요청 정보와 타입

- `params`와 `searchParams`는 Promise다. 전역 타입 `PageProps<'/경로'>`, `LayoutProps<'/경로'>`, `RouteContext<'/경로'>`를 쓴다(`pnpm type-check`가 `next typegen`으로 생성).
- 현재 locale은 `params` 대신 `getLocale()`이나 `useLocale()`로 읽는다.

## 데이터와 캐시 (Cache Components 사용 중)

- 데이터 조회는 기본이 동적이다. 캐시할 대상에만 `'use cache'`를 붙이고 `cacheLife`, `cacheTag`로 수명과 무효화 단위를 정한다.
- 요청 시점에 정해지는 값은 `<Suspense>` 안에서 읽는다. 밖에서 읽으면 빌드가 실패하거나 정적 셸이 사라진다.
  - 서버: `cookies()`, `headers()`, `searchParams`, 캐시하지 않은 조회, `generateStaticParams`에 없는 `params`
  - 클라이언트: `useSearchParams`, 동적 경로의 `usePathname`·`useParams`
- 렌더링 중에 `new Date()`, `Date.now()`, `Math.random()`을 부르지 않는다. 필요하면 `await io()`(`next/cache`) 뒤에 값을 읽는 async 함수를 컴포넌트 밖에 두고 `<Suspense>` 안에서 부른다. 클라이언트에서는 이벤트 핸들러나 구독·타이머 콜백에서 읽는다. `connection()`보다 `io()`를 쓴다.
- `dynamic`, `dynamicParams`, `revalidate`, `fetchCache`, `runtime`을 내보내지 않는다. Cache Components와 함께 쓰면 빌드가 실패한다.
- 서로 의존하지 않는 조회는 `Promise.all`로 병렬 실행한다.

```tsx
export default function PostPage({
  params,
}: PageProps<'/[locale]/posts/[slug]'>) {
  return (
    <Suspense fallback={<PostSkeleton />}>
      {params.then(({ slug }) => (
        <Post slug={slug} />
      ))}
    </Suspense>
  );
}
```

## 변경 (Server Action)

- 액션마다 입력을 Zod로 검증하고 권한을 다시 확인한다. 화면이나 proxy에서 막았다는 사실에 기대지 않는다.
- 예상한 실패는 throw하지 말고 값으로 반환해 `useActionState`로 표시한다.
- 변경 후 자기 화면에 바로 보여야 하면 `updateTag`, 나중에 갱신돼도 되면 `revalidateTag(tag, 'max')`를 쓴다.

## 오류와 404

- `error.tsx`의 props는 `error: unknown`, `retry: () => void`다. 다시 시도는 `reset`이 아니라 `retry`를 쓴다.
- 오류 문구에 `error.message`를 그대로 보여 주지 않는다. 화면 문구는 번역 메시지를 쓴다.
- 페이지의 `notFound()`는 프리렌더 중에 부르면 404, 요청 시점에 부르면 200과 `noindex`로 응답한다. 요청 시점에도 404가 필요하면 `src/proxy.ts`에서 먼저 확인한다. 라우트 핸들러에서는 항상 404다.
- 개발 서버는 요청 시점에 렌더링하므로 상태 코드는 프로덕션 빌드로 확인한다.

## proxy

- `src/proxy.ts`는 locale 처리와 낙관적 검사만 한다. 느린 조회나 최종 인가를 넣지 않는다.

## 설정과 보안

- 환경 변수를 추가할 때는 `src/env/schema.ts`의 스키마와 `parseEnv`에 함께 넣는다. 브라우저로 나가는 값(`NEXT_PUBLIC_`)은 `src/env/index.ts`에도 넣고 `@/env`에서, 비밀 값은 `@/env/server`에서 가져온다.
- 공통 보안 헤더는 `next.config.ts`의 `securityHeaders`에서 관리한다. 외부 리소스를 추가하면 CSP를 함께 확인한다.
- 이미지는 `next/image`, 글꼴은 `next/font`를 쓴다. 외부 이미지는 `images.remotePatterns`에 정확한 호스트만 허용한다.
- 메타데이터는 `generateMetadata`에서 번역 메시지로 만든다.
