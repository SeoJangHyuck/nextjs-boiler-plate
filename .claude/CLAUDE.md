# Claude Code Guidelines

## Language

Always respond in **Korean (한국어)** when communicating with the user.

## Project Reference

Before working on any task, review:

- `README.md` - Project overview, tech stack, structure, scripts

## Before Writing Code

1. Check which rule files apply to the task:
   - `.claude/rules/nextjs.md` - Next.js components, routing, layouts
   - `.claude/rules/typescript.md` - Type definitions, naming, patterns
   - `.claude/rules/scss.md` - Styling, variables, mixins
   - `.claude/rules/tailwind.md` - Tailwind CSS v4, utility classes, theming
   - `.claude/rules/git.md` - Commits, branches, pull requests
   - `.claude/rules/zustand.md` - Client state management, stores, slices
   - `.claude/rules/zod.md` - Schema validation, form integration
   - `.claude/rules/tanstack-query.md` - Server state, data fetching, caching
   - `.claude/rules/next-intl.md` - Internationalization, translations

2. Review the relevant rules before writing or modifying code.

3. Follow the conventions strictly. When in doubt, ask the user.

## Project Context

- **Framework**: Next.js 16+ (App Router, Turbopack)
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 4 + SCSS
- **Package Manager**: pnpm
- **i18n**: next-intl (ko, en)
- **Auth**: next-auth (OIDC 연동 예정)
- **State**: Zustand (client), TanStack Query (server)

## Superpowers Integration

When using superpowers skills (brainstorming, writing-plans, executing-plans):

1. **Design Documents**: Save to `docs/plans/YYYY-MM-DD-<topic>-design.md`
2. **Follow project rules**: Apply `.claude/rules/*` conventions when generating code
3. **Commit messages**: Follow `.claude/rules/git.md` conventions
4. **Code style**: Follow `.claude/rules/typescript.md` and `.claude/rules/nextjs.md`

### Plan Document Format

All plan documents must include:

- Goal (1 sentence)
- Architecture (2-3 sentences)
- Tech stack alignment with project
- Step-by-step tasks with exact file paths

## Superpowers Workflow Sequence

When using superpowers commands, you MUST follow this exact order:

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: /superpowers:brainstorm                                │
│          → Explore requirements, discuss design options         │
│          → Output: Clear requirements                           │
├─────────────────────────────────────────────────────────────────┤
│  Step 2: /superpowers:writing-plans                             │
│          → Create implementation plan                           │
│          → Output: docs/plans/YYYY-MM-DD-<topic>-design.md      │
├─────────────────────────────────────────────────────────────────┤
│  Step 3: /superpowers:executing-plans                           │
│          → Execute plan task-by-task                            │
│          → Output: Implemented code                             │
└─────────────────────────────────────────────────────────────────┘
```

### Rules

1. **Sequential Execution**: Follow steps in order (1 → 2 → 3)
2. **Skip with Existing Output**: If previous step's output file exists, can skip to next step
3. **Check Before Run**: Always verify if required output exists before proceeding

### Skip Conditions

| Command           | Required Output          | Can Skip If                          |
| ----------------- | ------------------------ | ------------------------------------ |
| `writing-plans`   | brainstorming 산출물     | 이전 대화에서 요구사항이 정리된 경우 |
| `executing-plans` | `docs/plans/*-design.md` | 설계 문서가 이미 존재하는 경우       |

```
✅ OK: Skip brainstorming if requirements exist
User: "/superpowers:writing-plans"
Claude: *checks if requirements are clear from context*
        → If yes: proceed with planning
        → If no: "먼저 brainstorming을 통해 요구사항을 정리해주세요."

✅ OK: Skip to execution if plan exists
User: "/superpowers:executing-plans"
Claude: *checks for docs/plans/*-design.md*
        → If exists: "기존 설계 문서를 기반으로 실행합니다."
        → If not: "먼저 writing-plans로 설계 문서를 작성해주세요."
```
