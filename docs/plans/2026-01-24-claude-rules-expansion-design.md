# Claude Rules & Skills Expansion Design

## Goal

Expand `.claude/` folder with 5 new library rules, convert create-pr skill to English, and create Korean translations for all rules and skills.

## Architecture

Create comprehensive, reusable rule files following existing patterns (typescript.md, scss.md). Each rule is independent and applies to specific file paths via frontmatter globs. Korean translations mirror the English structure in `.claude/ko/`.

## Tech Stack Alignment

- Zustand 5.0.10, Zod 4.3.5, TanStack Query 5.90.19, Tailwind CSS 4.1.18, next-intl 4.7.0
- All rules follow TypeScript 5+ strict mode conventions
- DO/DON'T examples for AI agent clarity

---

## Final Structure

```
.claude/
├── CLAUDE.md                    # Updated with new rule references
├── rules/
│   ├── git.md                   # Existing
│   ├── nextjs.md                # Existing
│   ├── scss.md                  # Existing
│   ├── typescript.md            # Updated (Zod section → reference link)
│   ├── zustand.md               # NEW
│   ├── zod.md                   # NEW
│   ├── tanstack-query.md        # NEW
│   ├── tailwind.md              # NEW
│   └── next-intl.md             # NEW
├── skills/
│   └── create-pr/
│       └── SKILL.md             # English (template section in Korean)
└── ko/                          # NEW folder
    ├── rules/
    │   ├── git.md
    │   ├── nextjs.md
    │   ├── scss.md
    │   ├── typescript.md
    │   ├── zustand.md
    │   ├── zod.md
    │   ├── tanstack-query.md
    │   ├── tailwind.md
    │   └── next-intl.md
    └── skills/
        └── create-pr/
            └── SKILL.md
```

---

## Tasks

### Task 1: Create New Rule Files

#### 1.1 zustand.md (v5.0.10)

- **paths**: `**/stores/**/*.ts`
- **Sections**: Store creation, TypeScript typing, Slice pattern, Middleware (devtools, persist, immer), React integration, Testing
- **Style**: Comprehensive with DO/DON'T examples

#### 1.2 zod.md (v4.3.5)

- **paths**: `**/validations/**/*.ts`, `**/schemas/**/*.ts`
- **Sections**: Schema definition, Type inference (`z.infer`), Error handling, Form integration, Server Action integration
- **Style**: Comprehensive with DO/DON'T examples

#### 1.3 tanstack-query.md (v5.90.19)

- **paths**: `**/hooks/**/*.ts`, `**/lib/api/**/*.ts`
- **Sections**: useQuery/useMutation, Query keys, Prefetching, Error/Loading states, SSR with Next.js
- **Style**: Comprehensive with DO/DON'T examples

#### 1.4 tailwind.md (v4.1.18)

- **paths**: `**/*.{tsx,jsx}`
- **Sections**: v4 CSS-first config (@theme), Class patterns, Responsive design, Dark mode, Custom theme, Arbitrary values
- **Style**: Comprehensive with DO/DON'T examples

#### 1.5 next-intl.md (v4.7.0)

- **paths**: `**/app/[locale]/**/*`, `messages/*.json`
- **Sections**: Configuration, useTranslations, Formatting (dates, numbers, plurals), Navigation, Middleware
- **Style**: Comprehensive with DO/DON'T examples

### Task 2: Update Existing Files

#### 2.1 typescript.md

- Replace Zod Integration section (lines 537-571) with reference link to zod.md

#### 2.2 CLAUDE.md

- Add new rules to the rule file list
- Update Project Context if needed

### Task 3: Convert create-pr Skill to English

- Translate all content to English
- Keep PR template section in Korean (as per user request)

### Task 4: Create Korean Translations

- Create `.claude/ko/rules/` folder
- Create `.claude/ko/skills/` folder
- Translate all 9 rule files to Korean
- Translate create-pr skill to full Korean

---

## Design Decisions

| Decision             | Choice                 | Rationale                                          |
| -------------------- | ---------------------- | -------------------------------------------------- |
| Detail level         | Comprehensive (B)      | Consistency with existing rules, clear AI guidance |
| Zod in typescript.md | Reference link (B)     | Each rule file is independent and complete         |
| Tailwind vs SCSS     | Separate (A)           | Reusability across different projects              |
| Korean structure     | .claude/ko/ folder (A) | Clear structure, easy multi-language expansion     |

---

## References

- [Zustand v5 Docs](https://zustand.docs.pmnd.rs/)
- [Zod v4 Docs](https://zod.dev/)
- [TanStack Query v5 Docs](https://tanstack.com/query/latest)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [next-intl Docs](https://next-intl.dev/)
