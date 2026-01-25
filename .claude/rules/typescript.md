---
paths: '**/*.{ts,tsx}'
---

# TypeScript 5+ Conventions

## Purpose

Enforce strict TypeScript patterns for type safety, maintainability, and consistency. Aligned with Next.js 16+ and React 19 best practices. Based on Toss/Airbnb conventions with modern 2025 practices.

---

## Strict Mode Configuration

```json
// tsconfig.json - Required settings
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## Type vs Interface

### Prefer `type` over `interface`

Use `type` as the default choice. Use `interface` only for:

- Extending third-party library types
- Declaration merging (plugin systems, library APIs)

```typescript
// ✅ DO: Use type for all definitions
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

type UserWithPosts = User & {
  posts: Post[];
};

type UserRole = 'admin' | 'user' | 'guest';

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// ✅ DO: Interface only for extending external types
interface CustomNextRequest extends NextRequest {
  user?: User;
}

// ✅ DO: Interface for declaration merging (rare)
declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

// ❌ DON'T: Interface for regular types
interface User {
  // Use type instead
  id: string;
}

// ❌ DON'T: I prefix (outdated convention)
interface IUser {
  // Never use I prefix
  id: string;
}
type IUserRole = 'admin'; // Never use I prefix on types either
```

---

## Naming Conventions

| Category             | Convention                     | Example                              |
| -------------------- | ------------------------------ | ------------------------------------ |
| Types                | PascalCase (no prefix)         | `User`, `ApiResponse`, `ButtonProps` |
| Type parameters      | Single uppercase or `T` prefix | `T`, `TData`, `TError`               |
| Variables            | camelCase                      | `userName`, `isLoading`              |
| Constants (exported) | SCREAMING_SNAKE_CASE           | `MAX_RETRIES`, `API_BASE_URL`        |
| Constants (local)    | camelCase                      | `defaultValue`, `initialState`       |
| Functions            | camelCase                      | `getUserById`, `formatDate`          |
| React components     | PascalCase                     | `UserProfile`, `DashboardHeader`     |
| Hooks                | camelCase with `use` prefix    | `useAuth`, `useLocalStorage`         |
| Files (components)   | PascalCase                     | `UserProfile.tsx`                    |
| Files (utilities)    | camelCase                      | `formatDate.ts`                      |
| Files (types)        | camelCase                      | `user.ts`, `api.ts`                  |

```typescript
// ✅ DO: Consistent naming
// src/types/user.ts
export type User = {
  id: string;
  userName: string;  // camelCase property
};

export type UserRole = 'admin' | 'user';

// src/constants/api.ts
export const API_BASE_URL = 'https://api.example.com';
export const MAX_RETRIES = 3;

// Local constants use camelCase
const defaultTimeout = 5000;

// src/lib/formatDate.ts
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

// src/hooks/useAuth.ts
export const useAuth = () => {
  // Hook implementation
};

// src/components/UserProfile.tsx
export const UserProfile = ({ user }: { user: User }) => {
  return <div>{user.userName}</div>;
};

// ❌ DON'T: Wrong naming
type user = {};           // Types must be PascalCase
type IUser = {};          // No I prefix
const UserName = '';      // Variables must be camelCase
function GetUser() {}     // Functions must be camelCase
const API_KEY = 'xxx';    // Local constants should be camelCase
```

---

## Variable Declarations

### Always `const`, `let` only when necessary, never `var`

```typescript
// ✅ DO: const by default
const user = getUser();
const items = [1, 2, 3];
const config = { timeout: 5000 };

// ✅ DO: let only for reassignment
let count = 0;
for (let i = 0; i < 10; i++) {
  count += i;
}

// ✅ DO: const with mutation (arrays/objects)
const users: User[] = [];
users.push(newUser); // OK - mutating, not reassigning

// ❌ DON'T: var (function-scoped, hoisted)
var name = 'John'; // Never use var

// ❌ DON'T: let when const works
let user = getUser(); // Use const if not reassigned
```

---

## Function Patterns

### Always Use Arrow Functions

```typescript
// ✅ DO: Arrow function for everything
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2);
const filtered = numbers.filter((n) => n > 1);

// ✅ DO: Arrow function for utilities
export const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// ✅ DO: Arrow function for React components
export const UserCard = ({ user }: UserCardProps) => {
  return <div>{user.name}</div>;
};

// ✅ DO: Arrow function for hooks
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  return { user, setUser };
};

// ✅ DO: Arrow function for event handlers
const handleClick = () => {
  console.log('clicked');
};

// ❌ DON'T: function declaration
function getUserName(user: User) {  // Use arrow function
  return user.name;
}

// ❌ DON'T: Anonymous function expressions
numbers.map(function(n) { return n * 2; });

// ❌ DON'T: Complex ternary without block
const process = (x: number) => x > 0 ? x * 2 : x < 0 ? x * -1 : 0;  // Hard to read
```

---

## Import/Export Patterns

### Type-only Imports

```typescript
// ✅ DO: Type-only imports
import type { User, UserRole } from '@/types/user';
import type { ComponentProps, ReactNode } from 'react';

// ✅ DO: Mixed imports with inline type
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

// ❌ DON'T: Import types without type keyword
import { User } from '@/types/user'; // Should use 'import type'
```

### No Wildcard Imports

```typescript
// ✅ DO: Named imports
import { formatDate, formatCurrency } from '@/lib/format';

// ❌ DON'T: Wildcard imports
import * as formatters from '@/lib/format';
```

### Single Path Import

```typescript
// ✅ DO: Single import from path
import { User, UserRole, UserStatus } from '@/types/user';

// ❌ DON'T: Multiple imports from same path
import { User } from '@/types/user';
import { UserRole } from '@/types/user'; // Combine with above
```

### Barrel Exports

```typescript
// ✅ DO: Barrel exports for types
// src/types/index.ts
export type { User, UserRole } from './user';
export type { Post, PostStatus } from './post';
export type { ApiResponse, PaginatedResponse } from './api';

// Usage
import type { User, Post, ApiResponse } from '@/types';
```

---

## Type Safety Patterns

### Never Use `any`

```typescript
// ✅ DO: Use unknown for truly unknown types
function parseJSON<T>(json: string): T {
  return JSON.parse(json) as T;
}

function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Unknown error', error);
  }
}

// ✅ DO: Type guards for runtime validation
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    typeof (data as User).id === 'string'
  );
}

// ❌ DON'T: any type
const handleData = (data: any) => {
  // Never use any
  return data.something;
};

// ❌ DON'T: Type assertion without validation
const user = data as User; // Dangerous without validation
```

### Exhaustive Checks

```typescript
// ✅ DO: Exhaustive switch with never
type Status = 'pending' | 'approved' | 'rejected';

const getStatusLabel = (status: Status): string => {
  switch (status) {
    case 'pending':
      return 'Pending Review';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    default:
      const _exhaustive: never = status;
      throw new Error(`Unknown status: ${_exhaustive}`);
  }
};

// ✅ DO: Exhaustive object map
const statusLabels: Record<Status, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};
```

### Nullish Handling

```typescript
// ✅ DO: Nullish coalescing and optional chaining
const userName = user?.name ?? 'Anonymous';
const count = data?.items?.length ?? 0;

// ✅ DO: Early return for null checks
const processUser = (user: User | null): string => {
  if (!user) {
    return 'No user';
  }
  // user is now narrowed to User
  return user.name;
};

// ❌ DON'T: Unsafe non-null assertion
const getName = (user: User | null) => {
  return user!.name; // Dangerous - could crash
};

// ❌ DON'T: Logical OR for defaults (falsy issues)
const count = data.count || 10; // 0 becomes 10!
const count = data.count ?? 10; // Use nullish coalescing
```

---

## Object and Array Patterns

### Literal Syntax

```typescript
// ✅ DO: Literal syntax
const user = {};
const items: string[] = [];

// ❌ DON'T: Constructor syntax
const user = new Object();
const items = new Array();
```

### Destructuring

```typescript
// ✅ DO: Object destructuring
function processUser({ name, email, role }: User) {
  console.log(name, email, role);
}

// ✅ DO: Array destructuring
const [first, second, ...rest] = items;
const [, , third] = items; // Skip elements

// ✅ DO: Rename during destructuring
const { name: userName, email: userEmail } = user;

// ✅ DO: Default values
const { role = 'user' } = user;
```

### Spread Operator

```typescript
// ✅ DO: Shallow copy with spread
const updatedUser = { ...user, name: 'New Name' };
const allItems = [...items1, ...items2];

// ✅ DO: Object property shorthand
const name = 'John';
const age = 30;
const user = { name, age }; // { name: name, age: age }

// ❌ DON'T: Object.assign for shallow copy
const updated = Object.assign({}, user, { name: 'New' });
```

---

## Component Props Types

```typescript
// ✅ DO: Props type with component
type ButtonProps = {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

export const Button = ({
  variant,
  size = 'md',
  isLoading = false,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={cn(variants[variant], sizes[size])}
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

// ✅ DO: Extend HTML element props
type InputProps = React.ComponentProps<'input'> & {
  label: string;
  error?: string;
};

// ✅ DO: Children type
type LayoutProps = {
  children: React.ReactNode;
};

// ❌ DON'T: Inline props definition
export const Button = ({
  variant,
}: {
  variant: string;  // Extract to type
}) {}
```

---

## Generic Patterns

```typescript
// ✅ DO: Constrained generics
type ApiResponse<TData> = {
  data: TData;
  status: number;
  message: string;
};

type PaginatedResponse<TItem> = {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
};

// ✅ DO: Generic with keyof constraint
const getProperty = <T, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key];
};

// ✅ DO: Generic React component
type ListProps<TItem> = {
  items: TItem[];
  renderItem: (item: TItem, index: number) => React.ReactNode;
  keyExtractor: (item: TItem) => string;
};

const List = <TItem,>({ items, renderItem, keyExtractor }: ListProps<TItem>) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
};
```

---

## Utility Types

```typescript
// ✅ DO: Use built-in utility types
type PartialUser = Partial<User>; // All optional
type RequiredUser = Required<User>; // All required
type ReadonlyUser = Readonly<User>; // All readonly
type UserKeys = keyof User; // Union of keys
type NameOnly = Pick<User, 'name'>; // Subset
type WithoutId = Omit<User, 'id'>; // Exclude keys
type UserRecord = Record<string, User>; // Object map

// ✅ DO: Create reusable utility types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> =
  T extends (...args: unknown[]) => Promise<infer R> ? R : never;
```

---

## Zod Schema Integration

> **See [zod.md](./zod.md) for comprehensive Zod v4 conventions.**

Key principle: Use `z.infer<typeof schema>` as the single source of truth for types.

```typescript
// Quick example
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>; // Derive type from schema
```

---

## AI Agent Tasks for TypeScript Development

- Verify strict mode is enabled in tsconfig.json
- **Check for `any` usage and reject it** (use `unknown` instead)
- Validate type naming (PascalCase, no `I` prefix)
- Ensure `type` is used instead of `interface` (except for extending)
- Check `const`/`let` usage (`const` default, `let` only for reassignment)
- Verify no `var` usage
- Check for proper null/undefined handling (nullish coalescing)
- Validate exhaustive switch statements
- Ensure type-only imports use `import type`
- Check no wildcard imports
- Review generic constraints for proper typing
- Verify Zod schemas align with TypeScript types

**References**:

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Airbnb JavaScript Style Guide](https://javascript.airbnb.tech/)
- [Interface vs Type 2025](https://dev.to/aleksei_aleinikov/interface-vs-type-in-2025-which-to-use-and-when-55dc)
