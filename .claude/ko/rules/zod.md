---
paths:
  - '**/validations/**/*.ts'
  - '**/schemas/**/*.ts'
  - '**/lib/validations.ts'
---

# Zod 4.0 컨벤션

## 목적

Zod v4를 사용한 일관된 스키마 검증 패턴을 적용합니다. 런타임 타입 안전성, 폼 검증, 서버 액션 통합을 제공합니다. `z.infer`를 통해 타입의 단일 진실 공급원.

---

## 스키마 정의

### 기본 스키마

```typescript
// ✅ DO: 설명적인 이름으로 스키마 정의
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, '이름은 필수입니다').max(100),
  email: z.string().email('유효하지 않은 이메일 주소입니다'),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.coerce.date(),
});

// 스키마에서 TypeScript 타입 추론
export type User = z.infer<typeof userSchema>;

// ❌ DON'T: 스키마와 별도로 타입 정의
type User = {
  id: string;
  name: string;
  // ... 스키마 정의 중복
};
```

### 중첩 객체

```typescript
// ✅ DO: 중첩 구조를 위한 스키마 합성
const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, '유효하지 않은 우편번호'),
  country: z.string().length(2), // ISO 국가 코드
});

const companySchema = z.object({
  name: z.string().min(1),
  address: addressSchema,
  employees: z.array(userSchema),
});

export type Address = z.infer<typeof addressSchema>;
export type Company = z.infer<typeof companySchema>;
```

### 배열과 레코드

```typescript
// ✅ DO: 제약이 있는 배열 스키마
const tagsSchema = z.array(z.string()).min(1).max(10);
const scoresSchema = z.array(z.number().min(0).max(100));

// ✅ DO: 동적 키를 위한 레코드
const settingsSchema = z.record(z.string(), z.boolean());
const userMapSchema = z.record(z.string().uuid(), userSchema);

// ✅ DO: 고정 길이 배열을 위한 튜플
const coordinatesSchema = z.tuple([z.number(), z.number()]);
const rgbSchema = z.tuple([
  z.number().min(0).max(255),
  z.number().min(0).max(255),
  z.number().min(0).max(255),
]);
```

---

## 검증 패턴

### Safe Parse (권장)

```typescript
// ✅ DO: 검증에 safeParse 사용
const result = userSchema.safeParse(data);

if (!result.success) {
  console.error(result.error.flatten());
  return { error: result.error.flatten() };
}

// result.data는 User로 완전히 타입됨
const user = result.data;

// ❌ DON'T: try-catch 없이 parse 사용 (에러 시 throw)
const user = userSchema.parse(data); // ZodError throw
```

### 에러 처리

```typescript
// ✅ DO: UI용 에러 포맷팅
const result = userSchema.safeParse(formData);

if (!result.success) {
  const errors = result.error.flatten();

  // errors.formErrors - 폼 레벨 에러 배열
  // errors.fieldErrors - 필드별 에러 객체
  return {
    success: false,
    errors: {
      form: errors.formErrors,
      fields: errors.fieldErrors,
    },
  };
}

// ✅ DO: 커스텀 에러 메시지
const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .regex(/[A-Z]/, '비밀번호에 대문자가 포함되어야 합니다')
  .regex(/[0-9]/, '비밀번호에 숫자가 포함되어야 합니다');
```

---

## 변환

### 강제 변환과 Transform

```typescript
// ✅ DO: 폼 데이터 타입 강제 변환
const formSchema = z.object({
  age: z.coerce.number().int().positive(),
  birthDate: z.coerce.date(),
  isActive: z.coerce.boolean(),
  price: z.coerce.number().multipleOf(0.01),
});

// ✅ DO: 값 변환
const slugSchema = z
  .string()
  .transform((val) => val.toLowerCase().replace(/\s+/g, '-'));

const trimmedSchema = z.string().trim();

// ✅ DO: 변환 체이닝
const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]+$/, '소문자, 숫자, 밑줄만 허용됩니다');
```

### 기본값

```typescript
// ✅ DO: 선택적 필드에 기본값 제공
const configSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  itemsPerPage: z.number().int().min(10).max(100).default(20),
  notifications: z.boolean().default(true),
  language: z.string().default('ko'),
});

// ✅ DO: null | undefined 처리에 nullish 사용
const optionalName = z.string().nullish(); // string | null | undefined
const withDefault = z.string().nullish().default('익명');
```

---

## 정제 및 커스텀 검증

### Refine

```typescript
// ✅ DO: refine으로 커스텀 검증
const passwordConfirmSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

// ✅ DO: 비동기 검증
const uniqueEmailSchema = z
  .string()
  .email()
  .refine(
    async (email) => {
      const exists = await checkEmailExists(email);
      return !exists;
    },
    { message: '이미 등록된 이메일입니다' }
  );
```

### 복잡한 검증을 위한 Superrefine

```typescript
// ✅ DO: superRefine으로 여러 검증 에러
const registrationSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
  })
  .superRefine(async (data, ctx) => {
    const usernameExists = await checkUsernameExists(data.username);
    if (usernameExists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '이미 사용 중인 사용자명입니다',
        path: ['username'],
      });
    }

    const emailExists = await checkEmailExists(data.email);
    if (emailExists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '이미 등록된 이메일입니다',
        path: ['email'],
      });
    }
  });
```

---

## 스키마 합성

### Extend와 Merge

```typescript
// ✅ DO: 스키마 확장
const baseUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

const adminUserSchema = baseUserSchema.extend({
  role: z.literal('admin'),
  permissions: z.array(z.string()),
});

// ✅ DO: 스키마 병합
const timestampSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const userWithTimestamps = baseUserSchema.merge(timestampSchema);
```

### Pick, Omit, Partial

```typescript
// ✅ DO: 스키마 변형 생성
const createUserSchema = userSchema.omit({ id: true, createdAt: true });
const updateUserSchema = userSchema.partial().required({ id: true });
const userCredentialsSchema = userSchema.pick({ email: true, password: true });

// ✅ DO: 중첩 객체에 deep partial
const partialCompanySchema = companySchema.deepPartial();
```

### Union과 Discriminated Union

```typescript
// ✅ DO: 타입 안전성을 위한 discriminated union
const notificationSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email'),
    email: z.string().email(),
    subject: z.string(),
  }),
  z.object({
    type: z.literal('sms'),
    phoneNumber: z.string(),
    message: z.string().max(160),
  }),
  z.object({
    type: z.literal('push'),
    deviceToken: z.string(),
    title: z.string(),
  }),
]);

type Notification = z.infer<typeof notificationSchema>;
// TypeScript가 'type' 기반으로 정확한 shape를 앎
```

---

## 폼 통합

### React Hook Form과 함께

```typescript
// ✅ DO: zodResolver 사용
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    // data는 완전히 타입됨
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      <button type="submit">로그인</button>
    </form>
  );
};
```

---

## 서버 액션 통합

### Next.js 서버 액션과 함께

```typescript
// ✅ DO: 서버 액션에서 검증
'use server';

import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tags: z.array(z.string()).max(5).default([]),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export type ActionResult<T = void> =
  | { success: true; data: T }
  | {
      success: false;
      errors: z.typeToFlattenedError<typeof createPostSchema>['fieldErrors'];
    };

export const createPost = async (
  formData: FormData
): Promise<ActionResult<{ id: string }>> => {
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    tags: formData.getAll('tags'),
  };

  const result = createPostSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const post = await db.post.create({ data: result.data });

  return { success: true, data: { id: post.id } };
};
```

---

## 파일 구조

```
src/
├── schemas/                  # 또는 validations/
│   ├── index.ts              # 모든 스키마 재export
│   ├── user.ts               # 사용자 관련 스키마
│   ├── post.ts               # 게시글 관련 스키마
│   ├── auth.ts               # 인증 스키마 (로그인, 회원가입)
│   └── common.ts             # 공유 스키마 (페이지네이션 등)
```

```typescript
// schemas/index.ts
export * from './user';
export * from './post';
export * from './auth';
export * from './common';

// schemas/common.ts
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
```

---

## AI 에이전트 Zod 개발 작업

- 스키마가 타입 도출에 `z.infer` 사용하는지 확인 (단일 진실 공급원)
- `parse` 대신 `safeParse` 사용 확인 (적절한 에러 처리)
- 에러 메시지가 사용자 친화적이고 지역화되었는지 검증
- 폼 데이터에 강제 변환 확인 (`z.coerce.number()` 등)
- 복잡한 타입 변형에 discriminated union 확인
- 서버 액션이 구조화된 에러 응답 반환하는지 확인
- 스키마 합성 검증 (extend, merge, pick, omit)
- 정제에 적절한 에러 경로가 있는지 확인

**참조**:

- [Zod v4 문서](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)
