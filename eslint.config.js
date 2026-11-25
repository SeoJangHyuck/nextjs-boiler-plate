import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
    // 외부에서 가져온 스킬은 업스트림 원문을 유지한다.
    '.agents/**',
    // 다른 브랜치의 작업 공간
    '.claude/worktrees/**',
  ]),
  js.configs.recommended,
  ...nextVitals,
  ...nextTypescript,
  {
    name: 'project/rules',
    files: ['**/*.{js,mjs,ts,tsx}'],
    rules: {
      // 일반 규칙
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'prefer-template': 'warn',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'object-shorthand': ['warn', 'always'],
      'no-case-declarations': 'error',
      'no-fallthrough': 'error',
      'no-var': 'error',
      // 화살표 함수를 사용한다. export default function(Next.js 특수 파일)은 허용된다.
      'func-style': ['error', 'expression'],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportNamespaceSpecifier',
          message: '와일드카드 import 대신 이름 있는 import를 사용하세요.',
        },
        {
          // 메서드, getter·setter, 제너레이터는 화살표 함수로 쓸 수 없으므로 제외한다.
          selector:
            ':not(MethodDefinition, Property[method=true], Property[kind=/^(get|set)$/]) > FunctionExpression[generator=false]',
          message: 'function 대신 화살표 함수를 사용하세요.',
        },
      ],
    },
  },
  {
    name: 'project/typescript',
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
    },
  },
  {
    name: 'project/i18n-navigation',
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/lib/i18n/navigation.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/link',
              message:
                "locale이 유지되도록 '@/lib/i18n/navigation'의 Link를 사용하세요.",
            },
            {
              name: 'next/navigation',
              importNames: [
                'redirect',
                'permanentRedirect',
                'usePathname',
                'useRouter',
              ],
              message:
                "locale이 유지되도록 '@/lib/i18n/navigation'에서 가져오세요.",
            },
          ],
        },
      ],
    },
  },
  prettier,
]);
