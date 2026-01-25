---
paths:
  - '**/validations/**/*.ts'
  - '**/schemas/**/*.ts'
  - '**/lib/validations.ts'
---

# Zod 4.0 Conventions

## Purpose

Enforce consistent schema validation patterns with Zod v4. Provides runtime type safety, form validation, and Server Action integration. Single source of truth for types via `z.infer`.

---

## Schema Definition

### Basic Schemas

```typescript
// ✅ DO: Define schemas with descriptive names
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.coerce.date(),
});

// Infer TypeScript type from schema
export type User = z.infer<typeof userSchema>;

// ❌ DON'T: Define type separately from schema
type User = {
  id: string;
  name: string;
  // ... duplicates schema definition
};
```

### Nested Objects

```typescript
// ✅ DO: Compose schemas for nested structures
const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().length(2), // ISO country code
});

const companySchema = z.object({
  name: z.string().min(1),
  address: addressSchema,
  employees: z.array(userSchema),
});

export type Address = z.infer<typeof addressSchema>;
export type Company = z.infer<typeof companySchema>;
```

### Arrays and Records

```typescript
// ✅ DO: Array schemas with constraints
const tagsSchema = z.array(z.string()).min(1).max(10);
const scoresSchema = z.array(z.number().min(0).max(100));

// ✅ DO: Record for dynamic keys
const settingsSchema = z.record(z.string(), z.boolean());
const userMapSchema = z.record(z.string().uuid(), userSchema);

// ✅ DO: Tuple for fixed-length arrays
const coordinatesSchema = z.tuple([z.number(), z.number()]);
const rgbSchema = z.tuple([
  z.number().min(0).max(255),
  z.number().min(0).max(255),
  z.number().min(0).max(255),
]);
```

---

## Validation Patterns

### Safe Parse (Recommended)

```typescript
// ✅ DO: Use safeParse for validation
const result = userSchema.safeParse(data);

if (!result.success) {
  console.error(result.error.flatten());
  return { error: result.error.flatten() };
}

// result.data is fully typed as User
const user = result.data;

// ❌ DON'T: Use parse without try-catch (throws on error)
const user = userSchema.parse(data); // Throws ZodError
```

### Error Handling

```typescript
// ✅ DO: Format errors for UI
const result = userSchema.safeParse(formData);

if (!result.success) {
  const errors = result.error.flatten();

  // errors.formErrors - array of form-level errors
  // errors.fieldErrors - object of field-specific errors
  return {
    success: false,
    errors: {
      form: errors.formErrors,
      fields: errors.fieldErrors,
    },
  };
}

// ✅ DO: Custom error messages
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number');
```

---

## Transformations

### Coercion and Transform

```typescript
// ✅ DO: Coerce form data types
const formSchema = z.object({
  age: z.coerce.number().int().positive(),
  birthDate: z.coerce.date(),
  isActive: z.coerce.boolean(),
  price: z.coerce.number().multipleOf(0.01),
});

// ✅ DO: Transform values
const slugSchema = z
  .string()
  .transform((val) => val.toLowerCase().replace(/\s+/g, '-'));

const trimmedSchema = z.string().trim();

// ✅ DO: Chain transformations
const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores');
```

### Default Values

```typescript
// ✅ DO: Provide defaults for optional fields
const configSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  itemsPerPage: z.number().int().min(10).max(100).default(20),
  notifications: z.boolean().default(true),
  language: z.string().default('ko'),
});

// ✅ DO: Use nullish for null | undefined handling
const optionalName = z.string().nullish(); // string | null | undefined
const withDefault = z.string().nullish().default('Anonymous');
```

---

## Refinements and Custom Validation

### Refine

```typescript
// ✅ DO: Custom validation with refine
const passwordConfirmSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ✅ DO: Async validation
const uniqueEmailSchema = z
  .string()
  .email()
  .refine(
    async (email) => {
      const exists = await checkEmailExists(email);
      return !exists;
    },
    { message: 'Email already registered' }
  );
```

### Superrefine for Complex Validation

```typescript
// ✅ DO: Multiple validation errors with superRefine
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
        message: 'Username already taken',
        path: ['username'],
      });
    }

    const emailExists = await checkEmailExists(data.email);
    if (emailExists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Email already registered',
        path: ['email'],
      });
    }
  });
```

---

## Schema Composition

### Extend and Merge

```typescript
// ✅ DO: Extend schemas
const baseUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

const adminUserSchema = baseUserSchema.extend({
  role: z.literal('admin'),
  permissions: z.array(z.string()),
});

// ✅ DO: Merge schemas
const timestampSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const userWithTimestamps = baseUserSchema.merge(timestampSchema);
```

### Pick, Omit, Partial

```typescript
// ✅ DO: Create schema variants
const createUserSchema = userSchema.omit({ id: true, createdAt: true });
const updateUserSchema = userSchema.partial().required({ id: true });
const userCredentialsSchema = userSchema.pick({ email: true, password: true });

// ✅ DO: Deep partial for nested objects
const partialCompanySchema = companySchema.deepPartial();
```

### Union and Discriminated Union

```typescript
// ✅ DO: Discriminated unions for type safety
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
// TypeScript knows the exact shape based on 'type'
```

---

## Form Integration

### With React Hook Form

```typescript
// ✅ DO: Use zodResolver
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
    // data is fully typed
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      <button type="submit">Login</button>
    </form>
  );
};
```

---

## Server Action Integration

### With Next.js Server Actions

```typescript
// ✅ DO: Validate in Server Actions
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

## File Organization

```
src/
├── schemas/                  # or validations/
│   ├── index.ts              # Re-export all schemas
│   ├── user.ts               # User-related schemas
│   ├── post.ts               # Post-related schemas
│   ├── auth.ts               # Auth schemas (login, register)
│   └── common.ts             # Shared schemas (pagination, etc.)
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

## AI Agent Tasks for Zod Development

- Verify schemas use `z.infer` for type derivation (single source of truth)
- Check `safeParse` is used instead of `parse` (proper error handling)
- Validate error messages are user-friendly and localized
- Ensure coercion for form data (`z.coerce.number()`, etc.)
- Check discriminated unions for complex type variants
- Verify Server Actions return structured error responses
- Validate schema composition (extend, merge, pick, omit)
- Ensure refinements have proper error paths

**References**:

- [Zod v4 Documentation](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)
