---
paths:
  - 'src/lib/i18n/**/*'
  - 'messages/**/*.json'
  - 'src/app/**/*.tsx'
  - 'src/components/**/*.tsx'
  - 'src/proxy.ts'
---

# next-intl 컨벤션

## 구성

| 파일                         | 역할                                                 |
| ---------------------------- | ---------------------------------------------------- |
| `src/lib/i18n/config.ts`     | locale 목록, `Locale` 타입, 기준 시간대의 단일 출처  |
| `src/lib/i18n/routing.ts`    | 라우팅, 쿠키(`i18n_redirected`, 1년)                 |
| `src/lib/i18n/request.ts`    | `next/root-params`로 locale을 읽어 검증, 메시지 로드 |
| `src/lib/i18n/navigation.ts` | locale을 유지하는 `Link`, `useRouter`, `redirect` 등 |
| `src/lib/i18n/app-config.ts` | `AppConfig` 타입 확장(번역 키·locale 검사)           |
| `src/proxy.ts`               | locale 감지와 리다이렉트                             |
| `messages/<locale>.json`     | 번역 메시지                                          |

## 사용

- 화면에 보이는 문구를 하드코딩하지 않는다. `aria-label`, `alt`, 메타데이터, 검증 오류도 번역한다.
- 동기 컴포넌트(서버·클라이언트 공통)는 `useTranslations`, async 서버 컴포넌트와 `generateMetadata`는 `await getTranslations`를 쓴다.
- 링크와 이동은 `@/lib/i18n/navigation`에서 가져온다. `next/link`, `next/navigation`의 이동 API를 직접 쓰면 locale이 사라진다. (린트)
- `notFound`처럼 locale과 무관한 API는 `next/navigation`에서 가져온다.
- 날짜·숫자·통화는 `useFormatter`(또는 `getFormatter`)로 표시한다. 시간대는 `config.ts`의 `defaultTimeZone`을 따른다.
- 상대 시간(`relativeTime`)에는 기준 시각 `now`를 넘긴다. 현재 시각을 읽는 방법은 `nextjs.md`의 `io()` 규칙을 따른다.
- 메시지는 `NextIntlClientProvider`에 자동으로 상속된다. 클라이언트로 보내는 양을 줄일 때만 `messages`에 필요한 부분을 골라 넘긴다.

## 폐기된 방식

- `setRequestLocale`, `requestLocale`을 쓰지 않는다. `next/root-params`로 대체됐다.
- 전역 `IntlMessages` 대신 `AppConfig`를 확장한다.

## 서버 액션과 라우트 핸들러

`next/root-params`를 읽을 수 없으므로 locale을 명시한다. 액션은 첫 인자로 받고, **서버 컴포넌트에서 `bind`해** 화면에 넘긴다.

```ts
// actions.ts
'use server';

export const submitContact = async (
  locale: Locale,
  _previousState: ContactState,
  formData: FormData
): Promise<ContactState> => {
  const t = await getTranslations({ locale, namespace: 'contact' });
  // ...
};
```

```tsx
// page.tsx (서버 컴포넌트)
<ContactForm submit={submitContact.bind(null, useLocale())} />;

// ContactForm.tsx ('use client')
const [state, action] = useActionState(submit, initialState);
```

클라이언트 컴포넌트에서 `useActionState(action.bind(...))`를 쓰지 않는다. hydration 전에 제출하면 서버가 무한 루프에 빠진다(vercel/next.js#98045).

## 메시지

- `messages/en.json`이 타입의 기준이다. 다른 locale 파일도 키가 정확히 같아야 한다(`tests/unit/i18n/messages.test.ts`가 검사).
- 키는 `영역.이름` 두 단계 camelCase를 기본으로 한다.
- 문장을 이어 붙이지 말고 ICU 문법을 쓴다: `{count, plural, =0 {항목 없음} other {#개}}`
- 링크나 강조가 들어간 문장은 `t.rich`를 쓴다.

## locale 추가

1. `config.ts`의 `serviceLocales`에 항목을 추가한다.
2. `messages/<code>.json`을 추가하고, 모든 메시지 파일의 `language`에 라벨을 넣는다.
3. 언어 전환 순서(`src/app/[locale]/page.tsx`의 `displayOrder`)와 `tests/e2e/home.spec.ts`의 기대값에 추가한다.
4. 줄바꿈 규칙이 다르면 `src/styles/globals.scss`의 `:lang()`을 확인한다.
5. `pnpm check`와 `pnpm test:e2e`를 실행한다.
