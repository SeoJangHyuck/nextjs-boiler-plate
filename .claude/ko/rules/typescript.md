---
paths: '**/*.{ts,tsx}'
---

# TypeScript 5+ 컨벤션

## 목적

타입 안전성, 유지보수성, 일관성을 위한 엄격한 TypeScript 패턴을 적용합니다. Next.js 16+와 React 19 모범 사례에 맞춤. Toss/Airbnb 컨벤션과 2025년 최신 관행 기반.

---

## Strict Mode 설정

```json
// tsconfig.json - 필수 설정
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

### `type`을 `interface`보다 선호

`type`을 기본 선택으로 사용. `interface`는 다음 경우에만:

- 서드파티 라이브러리 타입 확장
- 선언 병합 (플러그인 시스템, 라이브러리 API)

```typescript
// ✅ DO: 모든 정의에 type 사용
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

// ✅ DO: 외부 타입 확장에만 interface
interface CustomNextRequest extends NextRequest {
  user?: User;
}

// ✅ DO: 선언 병합에만 interface (드문 경우)
declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

// ❌ DON'T: 일반 타입에 interface
interface User {
  // 대신 type 사용
  id: string;
}

// ❌ DON'T: I 접두사 (구식 규칙)
interface IUser {
  // I 접두사 절대 사용 금지
  id: string;
}
type IUserRole = 'admin'; // type에도 I 접두사 금지
```

---

## 네이밍 규칙

| 카테고리        | 규칙                        | 예시                                 |
| --------------- | --------------------------- | ------------------------------------ |
| 타입            | PascalCase (접두사 없음)    | `User`, `ApiResponse`, `ButtonProps` |
| 타입 파라미터   | 단일 대문자 또는 `T` 접두사 | `T`, `TData`, `TError`               |
| 변수            | camelCase                   | `userName`, `isLoading`              |
| 상수 (export)   | SCREAMING_SNAKE_CASE        | `MAX_RETRIES`, `API_BASE_URL`        |
| 상수 (local)    | camelCase                   | `defaultValue`, `initialState`       |
| 함수            | camelCase                   | `getUserById`, `formatDate`          |
| React 컴포넌트  | PascalCase                  | `UserProfile`, `DashboardHeader`     |
| 훅              | `use` 접두사 camelCase      | `useAuth`, `useLocalStorage`         |
| 파일 (컴포넌트) | PascalCase                  | `UserProfile.tsx`                    |
| 파일 (유틸)     | camelCase                   | `formatDate.ts`                      |
| 파일 (타입)     | camelCase                   | `user.ts`, `api.ts`                  |

```typescript
// ✅ DO: 일관된 네이밍
// src/types/user.ts
export type User = {
  id: string;
  userName: string;  // camelCase 프로퍼티
};

export type UserRole = 'admin' | 'user';

// src/constants/api.ts
export const API_BASE_URL = 'https://api.example.com';
export const MAX_RETRIES = 3;

// 로컬 상수는 camelCase
const defaultTimeout = 5000;

// src/lib/formatDate.ts
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

// src/hooks/useAuth.ts
export const useAuth = () => {
  // 훅 구현
};

// src/components/UserProfile.tsx
export const UserProfile = ({ user }: { user: User }) => {
  return <div>{user.userName}</div>;
};

// ❌ DON'T: 잘못된 네이밍
type user = {};           // 타입은 PascalCase여야 함
type IUser = {};          // I 접두사 금지
const UserName = '';      // 변수는 camelCase여야 함
function GetUser() {}     // 함수는 camelCase여야 함
const API_KEY = 'xxx';    // 로컬 상수는 camelCase여야 함
```

---

## 변수 선언

### 항상 `const`, 필요시에만 `let`, `var` 절대 금지

```typescript
// ✅ DO: 기본적으로 const
const user = getUser();
const items = [1, 2, 3];
const config = { timeout: 5000 };

// ✅ DO: 재할당 시에만 let
let count = 0;
for (let i = 0; i < 10; i++) {
  count += i;
}

// ✅ DO: 뮤테이션과 함께 const (배열/객체)
const users: User[] = [];
users.push(newUser); // OK - 뮤테이션, 재할당 아님

// ❌ DON'T: var (함수 스코프, 호이스팅)
var name = 'John'; // var 절대 사용 금지

// ❌ DON'T: const가 가능할 때 let
let user = getUser(); // 재할당 안 하면 const 사용
```

---

## 함수 패턴

### 항상 화살표 함수 사용

```typescript
// ✅ DO: 모든 곳에 화살표 함수
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2);
const filtered = numbers.filter((n) => n > 1);

// ✅ DO: 유틸리티에 화살표 함수
export const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// ✅ DO: React 컴포넌트에 화살표 함수
export const UserCard = ({ user }: UserCardProps) => {
  return <div>{user.name}</div>;
};

// ✅ DO: 훅에 화살표 함수
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  return { user, setUser };
};

// ✅ DO: 이벤트 핸들러에 화살표 함수
const handleClick = () => {
  console.log('clicked');
};

// ❌ DON'T: function 선언
function getUserName(user: User) {  // 화살표 함수 사용
  return user.name;
}

// ❌ DON'T: 익명 함수 표현식
numbers.map(function(n) { return n * 2; });
```

---

## Import/Export 패턴

### 타입 전용 Import

```typescript
// ✅ DO: 타입 전용 import
import type { User, UserRole } from '@/types/user';
import type { ComponentProps, ReactNode } from 'react';

// ✅ DO: 인라인 타입과 혼합 import
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

// ❌ DON'T: type 키워드 없이 타입 import
import { User } from '@/types/user'; // 'import type' 사용해야 함
```

### 와일드카드 Import 금지

```typescript
// ✅ DO: 이름 있는 import
import { formatDate, formatCurrency } from '@/lib/format';

// ❌ DON'T: 와일드카드 import
import * as formatters from '@/lib/format';
```

### 단일 경로 Import

```typescript
// ✅ DO: 경로당 단일 import
import { User, UserRole, UserStatus } from '@/types/user';

// ❌ DON'T: 같은 경로에서 여러 import
import { User } from '@/types/user';
import { UserRole } from '@/types/user'; // 위와 합치기
```

### 배럴 Export

```typescript
// ✅ DO: 타입용 배럴 export
// src/types/index.ts
export type { User, UserRole } from './user';
export type { Post, PostStatus } from './post';
export type { ApiResponse, PaginatedResponse } from './api';

// 사용
import type { User, Post, ApiResponse } from '@/types';
```

---

## 타입 안전성 패턴

### `any` 절대 금지

```typescript
// ✅ DO: 정말 알 수 없는 타입에 unknown 사용
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

// ✅ DO: 런타임 검증용 타입 가드
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    typeof (data as User).id === 'string'
  );
}

// ❌ DON'T: any 타입
const handleData = (data: any) => {
  // any 절대 사용 금지
  return data.something;
};

// ❌ DON'T: 검증 없이 타입 단언
const user = data as User; // 검증 없이 위험
```

### 완전성 검사

```typescript
// ✅ DO: never로 완전한 switch
type Status = 'pending' | 'approved' | 'rejected';

const getStatusLabel = (status: Status): string => {
  switch (status) {
    case 'pending':
      return '검토 대기';
    case 'approved':
      return '승인됨';
    case 'rejected':
      return '거부됨';
    default:
      const _exhaustive: never = status;
      throw new Error(`Unknown status: ${_exhaustive}`);
  }
};

// ✅ DO: 완전한 객체 맵
const statusLabels: Record<Status, string> = {
  pending: '검토 대기',
  approved: '승인됨',
  rejected: '거부됨',
};
```

### Nullish 처리

```typescript
// ✅ DO: Nullish 병합 및 옵셔널 체이닝
const userName = user?.name ?? '익명';
const count = data?.items?.length ?? 0;

// ✅ DO: null 체크용 조기 반환
const processUser = (user: User | null): string => {
  if (!user) {
    return 'No user';
  }
  // user가 이제 User로 좁혀짐
  return user.name;
};

// ❌ DON'T: 안전하지 않은 non-null 단언
const getName = (user: User | null) => {
  return user!.name; // 위험 - 크래시 가능
};

// ❌ DON'T: 기본값에 논리 OR (falsy 문제)
const count = data.count || 10; // 0이 10이 됨!
const count = data.count ?? 10; // nullish 병합 사용
```

---

## 객체와 배열 패턴

### 리터럴 문법

```typescript
// ✅ DO: 리터럴 문법
const user = {};
const items: string[] = [];

// ❌ DON'T: 생성자 문법
const user = new Object();
const items = new Array();
```

### 구조 분해

```typescript
// ✅ DO: 객체 구조 분해
function processUser({ name, email, role }: User) {
  console.log(name, email, role);
}

// ✅ DO: 배열 구조 분해
const [first, second, ...rest] = items;
const [, , third] = items; // 요소 건너뛰기

// ✅ DO: 구조 분해 시 이름 변경
const { name: userName, email: userEmail } = user;

// ✅ DO: 기본값
const { role = 'user' } = user;
```

### 스프레드 연산자

```typescript
// ✅ DO: 스프레드로 얕은 복사
const updatedUser = { ...user, name: 'New Name' };
const allItems = [...items1, ...items2];

// ✅ DO: 객체 프로퍼티 축약
const name = 'John';
const age = 30;
const user = { name, age }; // { name: name, age: age }

// ❌ DON'T: 얕은 복사에 Object.assign
const updated = Object.assign({}, user, { name: 'New' });
```

---

## 컴포넌트 Props 타입

```typescript
// ✅ DO: 컴포넌트와 함께 Props 타입
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

// ✅ DO: HTML 요소 props 확장
type InputProps = React.ComponentProps<'input'> & {
  label: string;
  error?: string;
};

// ✅ DO: Children 타입
type LayoutProps = {
  children: React.ReactNode;
};

// ❌ DON'T: 인라인 props 정의
export const Button = ({
  variant,
}: {
  variant: string;  // 타입으로 추출
}) {}
```

---

## 제네릭 패턴

```typescript
// ✅ DO: 제약 있는 제네릭
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

// ✅ DO: keyof 제약이 있는 제네릭
const getProperty = <T, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key];
};

// ✅ DO: 제네릭 React 컴포넌트
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

## 유틸리티 타입

```typescript
// ✅ DO: 내장 유틸리티 타입 사용
type PartialUser = Partial<User>; // 모두 선택
type RequiredUser = Required<User>; // 모두 필수
type ReadonlyUser = Readonly<User>; // 모두 읽기 전용
type UserKeys = keyof User; // 키 유니온
type NameOnly = Pick<User, 'name'>; // 일부만
type WithoutId = Omit<User, 'id'>; // 키 제외
type UserRecord = Record<string, User>; // 객체 맵

// ✅ DO: 재사용 가능한 유틸리티 타입 생성
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> =
  T extends (...args: unknown[]) => Promise<infer R> ? R : never;
```

---

## Zod 스키마 통합

> **종합적인 Zod v4 규칙은 [zod.md](./zod.md)를 참조하세요.**

핵심 원칙: 타입의 단일 진실 공급원으로 `z.infer<typeof schema>`를 사용하세요.

```typescript
// 빠른 예시
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>; // 스키마에서 타입 도출
```

---

## AI 에이전트 TypeScript 개발 작업

- tsconfig.json에서 strict mode 활성화 확인
- **`any` 사용 확인 및 거부** (대신 `unknown` 사용)
- 타입 네이밍 검증 (PascalCase, `I` 접두사 없음)
- `interface` 대신 `type` 사용 확인 (확장 제외)
- `const`/`let` 사용 확인 (`const` 기본, 재할당시에만 `let`)
- `var` 사용 없는지 확인
- 적절한 null/undefined 처리 확인 (nullish 병합)
- 완전한 switch 문 검증
- 타입 전용 import가 `import type` 사용하는지 확인
- 와일드카드 import 없는지 확인
- 제네릭 제약이 적절히 타입되었는지 검토
- Zod 스키마가 TypeScript 타입과 일치하는지 확인

**참조**:

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Airbnb JavaScript Style Guide](https://javascript.airbnb.tech/)
- [Interface vs Type 2025](https://dev.to/aleksei_aleinikov/interface-vs-type-in-2025-which-to-use-and-when-55dc)
