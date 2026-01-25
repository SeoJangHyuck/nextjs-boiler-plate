---
name: create-pr
description: Create PR - Analyze changes and auto-generate PR title and template-based content
---

# Create PR Skill

Analyzes changes in the current branch and automatically generates PR title and content matching the `.github/pull_request_template.md` format.

---

## Execution Process

### Step 1: Collect Changes

```bash
# Check current branch
git branch --show-current

# Check diff from base branch (develop or main)
git log develop..HEAD --oneline
# or
git log main..HEAD --oneline

# List changed files
git diff develop --name-only

# Detailed change stats
git diff develop --stat
```

### Step 2: Generate PR Title

Generate title based on branch name and commit content:

```
<type>(<scope>): <Description>
```

**Rules**:

- Same format as commit messages
- **First letter capitalized**
- Within 50 characters

**Examples**:

```
feat(auth): Add Google OAuth integration
fix(cart): Resolve quantity sync issue
refactor(api): Simplify error handling
```

### Step 3: Generate PR Content

Write according to `.github/pull_request_template.md` format:

```markdown
## 작업 내용

- [Change 1]
- [Change 2]
- [Change 3]

## Reference

- 관련 이슈: #[issue number]
- 관련 문서: [link]

## 작업 결과

- [Feature behavior description or screenshot description]

## 기타

- [Information reviewers should know]

## 체크리스트

- [ ] 불필요한 코드는 제거되었나요?
- [ ] PR을 올리는 코드의 길이가 적정한가요?
```

---

## Analysis Criteria

### Change Type Detection

| Branch Prefix | Commit Type | PR Type     |
| ------------- | ----------- | ----------- |
| `feature/`    | `feat`      | New feature |
| `fix/`        | `fix`       | Bug fix     |
| `hotfix/`     | `fix`       | Hotfix      |
| `refactor/`   | `refactor`  | Refactoring |
| `docs/`       | `docs`      | Docs        |
| `chore/`      | `chore`     | Maintenance |

### Scope Inference

Infer scope from changed file paths:

| Path Pattern       | Scope   |
| ------------------ | ------- |
| `src/app/api/*`    | `api`   |
| `src/app/(auth)/*` | `auth`  |
| `src/components/*` | `ui`    |
| `src/hooks/*`      | `hooks` |
| `src/lib/*`        | `lib`   |
| `src/stores/*`     | `store` |
| `src/types/*`      | `types` |
| `messages/*`       | `i18n`  |

---

## Output Format

Provide in copy-ready format after analysis:

### PR Title

```
feat(auth): Add Google OAuth integration
```

### PR Content

```markdown
## 작업 내용

- Google OAuth 로그인 기능 추가
- 사용자 세션 관리 로직 구현
- 로그인 상태 유지를 위한 토큰 저장

## Reference

- 관련 이슈: #123

## 작업 결과

- 로그인 버튼 클릭 시 Google OAuth 플로우 시작
- 성공 시 대시보드로 리다이렉트

## 기타

- 환경변수 `GOOGLE_CLIENT_ID` 설정 필요

## 체크리스트

- [x] 불필요한 코드는 제거되었나요?
- [x] PR을 올리는 코드의 길이가 적정한가요?
```

---

## References

- PR template: `.github/pull_request_template.md`
- Git conventions: `.claude/rules/git.md`
