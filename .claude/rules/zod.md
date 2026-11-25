---
paths:
  - 'src/lib/validations/**/*.ts'
  - 'src/env/**/*.ts'
  - 'src/**/actions.ts'
  - 'src/**/actions/**/*.ts'
---

# Zod 컨벤션

## 기본

- 스키마 이름은 `userSchema`처럼 camelCase + `Schema`다. 타입은 `z.infer<typeof userSchema>`로만 만든다.
- 외부 입력은 `safeParse`로 검증한다. `parse`는 실패가 곧 프로그램 오류인 곳에서만 쓴다.
- 스키마에는 문구 대신 번역 키를 적는다: `.min(2, validationKey('nicknameTooShort'))`. 키는 `messages/<locale>.json`의 `validation`에 추가하고, 화면에 보일 때 `getFieldErrors(error, t)`로 번역한다.
- 여러 필드를 비교하는 `refine`에는 `path`를 지정한다.
- 반복되는 필드(`emailSchema`, `passwordSchema`, `imageUrlSchema`)는 `src/lib/validations/`의 것을 재사용한다.

## Zod 4 문법

| 이전                              | 현재                                            |
| --------------------------------- | ----------------------------------------------- |
| `z.string().email()` `.uuid()`    | `z.email()` `z.uuid()`                          |
| `z.string().url()`                | `z.url({ protocol: /^https?$/ })`               |
| 날짜 문자열 정규식                | `z.iso.date()` `z.iso.datetime()`               |
| `a.merge(b)`                      | `z.object({ ...a.shape, ...b.shape })`          |
| `error.flatten()` `.format()`     | `z.flattenError(error)` `z.treeifyError(error)` |
| `z.ZodIssueCode.custom`           | `'custom'`                                      |
| `z.nativeEnum(Obj)`               | `z.enum(Obj)`                                   |
| `.strict()` `.passthrough()`      | `z.strictObject()` `z.looseObject()`            |
| `schema.deepPartial()`            | `z.deepPartial(schema)`                         |
| `{ message, invalid_type_error }` | `{ error }` 또는 문자열                         |

## 틀리기 쉬운 것

- URL에는 반드시 프로토콜을 제한한다. 제한하지 않으면 `javascript:` 주소가 통과한다.
- `z.coerce.boolean()`은 문자열 `'false'`를 `true`로 바꾼다. 폼 값은 `z.stringbool()`을 쓴다.
- `z.coerce.number()`는 빈 문자열을 `0`으로 바꾼다. 먼저 빈 값을 걸러 낸다.
- 배열과 문자열에는 상한(`max`)을 둔다.
- `Object.fromEntries(formData)`에는 `$ACTION_`으로 시작하는 키가 섞인다. 폼에는 `z.strictObject`를 쓰지 않는다.

## 서버 액션 결과

```ts
export type ActionResult<TValues, TData = void> =
  | { success: true; data: TData }
  | {
      success: false;
      fieldErrors: z.core.$ZodFlattenedError<TValues>['fieldErrors'];
    };

const parsed = createPostSchema.safeParse(Object.fromEntries(formData));
if (!parsed.success) {
  const t = await getTranslations({ locale, namespace: 'validation' });
  return { success: false, fieldErrors: getFieldErrors(parsed.error, t) };
}
```

`TValues`는 `z.infer`로 얻은 타입이다.
