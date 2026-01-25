---
paths: '**/*'
---

# Git Conventions

## Purpose

Standardize Git workflow using Git Flow branching model, commit messages, and branch management for consistent collaboration and clear project history.

---

## Git Flow Branching Model

Based on [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/).

### Main Branches

| Branch    | Purpose                                                | Merge From               |
| --------- | ------------------------------------------------------ | ------------------------ |
| `main`    | Production-ready state. Every commit is a new release. | release, hotfix          |
| `develop` | Integration branch for next release.                   | feature, release, hotfix |

### Supporting Branches

| Branch      | Created From | Merges Into   | Naming                           |
| ----------- | ------------ | ------------- | -------------------------------- |
| `feature/*` | develop      | develop       | `feature/<ticket>-<description>` |
| `release/*` | develop      | develop, main | `release/<version>`              |
| `hotfix/*`  | main         | develop, main | `hotfix/<ticket>-<description>`  |

```
        main ─────●─────────────●─────────────●───────
                  │             ↑             ↑
                  │      release/1.0    hotfix/fix-bug
                  │             │             │
                  ↓             │             │
      develop ────●────●────●───●────●────●───●───────
                       ↑    ↑        ↑
                  feature/a  feature/b
```

---

## Branch Workflow

### Feature Development

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/SJH-123-user-auth

# 2. Work and commit
git add .
git commit -m "feat(auth): Add login form component"

# 3. Keep branch updated (rebase on develop)
git checkout develop
git pull origin develop
git checkout feature/SJH-123-user-auth
git rebase develop

# 4. Merge back to develop (use --no-ff to preserve history)
git checkout develop
git merge --no-ff feature/SJH-123-user-auth
git branch -d feature/SJH-123-user-auth
git push origin develop
```

### Release Preparation

```bash
# 1. Create release branch from develop
git checkout develop
git checkout -b release/1.0.0

# 2. Bump version, fix bugs (no new features!)
git commit -m "chore(release): Bump version to 1.0.0"

# 3. Merge to main and tag
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"

# 4. Merge back to develop
git checkout develop
git merge --no-ff release/1.0.0

# 5. Delete release branch
git branch -d release/1.0.0
```

### Hotfix (Production Bug)

```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/SJH-789-critical-bug

# 2. Fix the bug
git commit -m "fix(payment): Fix critical payment failure"

# 3. Merge to main and tag
git checkout main
git merge --no-ff hotfix/SJH-789-critical-bug
git tag -a v1.0.1 -m "Hotfix version 1.0.1"

# 4. Merge to develop (or release branch if exists)
git checkout develop
git merge --no-ff hotfix/SJH-789-critical-bug

# 5. Delete hotfix branch
git branch -d hotfix/SJH-789-critical-bug
```

---

## Commit Message Format

### Structure

```
<type>(<scope>): <Subject>

[body]

[footer]
```

### Subject Rules

- **First letter capitalized** (e.g., `Add`, `Fix`, `Update`)
- Imperative mood
- No period at end
- Max 50 characters

### Types

| Type       | Description                  | Example                                    |
| ---------- | ---------------------------- | ------------------------------------------ |
| `feat`     | New feature                  | `feat(auth): Add OAuth login`              |
| `fix`      | Bug fix                      | `fix(cart): Resolve quantity update issue` |
| `docs`     | Documentation                | `docs(readme): Update installation guide`  |
| `style`    | Code style (no logic change) | `style(button): Fix indentation`           |
| `refactor` | Code refactoring             | `refactor(api): Simplify error handling`   |
| `perf`     | Performance improvement      | `perf(images): Add lazy loading`           |
| `test`     | Add/update tests             | `test(auth): Add login unit tests`         |
| `chore`    | Build/tooling changes        | `chore(deps): Update dependencies`         |
| `ci`       | CI/CD changes                | `ci(github): Add deploy workflow`          |
| `revert`   | Revert previous commit       | `revert: feat(auth): Add OAuth login`      |

### Scope (Optional)

| Scope     | Description          |
| --------- | -------------------- |
| `auth`    | Authentication       |
| `api`     | API routes           |
| `ui`      | UI components        |
| `i18n`    | Internationalization |
| `deps`    | Dependencies         |
| `config`  | Configuration        |
| `release` | Release related      |

### Examples

```bash
# ✅ DO: Capitalized first letter, imperative mood, no period
feat(auth): Add Google OAuth provider
fix(cart): Handle empty cart state
docs(api): Update endpoint documentation
chore(release): Bump version to 1.0.0

# ❌ DON'T: Lowercase, past tense, with period
feat(auth): added Google OAuth provider.
fix(cart): fixed the cart bug
```

### Body (Optional)

```bash
feat(auth): Add session refresh mechanism

Implement automatic token refresh to prevent
unexpected logouts. The refresh happens 5 minutes
before token expiration.

- Add refresh token storage
- Create background refresh timer
- Handle refresh failures gracefully
```

### Footer (Optional)

```bash
# Breaking changes
feat(api)!: Change response format

BREAKING CHANGE: API responses now use camelCase
instead of snake_case for all field names.

# Issue references
fix(cart): Resolve duplicate item bug

Closes #123
Refs #456, #789
```

---

## Branch Naming

### Format

```
<type>/<ticket>-<short-description>
```

### Examples

```bash
# ✅ DO: Clear, descriptive branch names
feature/SJH-123-user-authentication
feature/SJH-124-shopping-cart
fix/SJH-456-cart-total-calculation
hotfix/SJH-789-payment-failure
release/1.0.0
release/2.1.0

# ❌ DON'T: Vague or personal names
feature/new-stuff
fix/bug
john/working-on-it
```

---

## Commit Best Practices

### Atomic Commits

One logical change per commit.

```bash
# ✅ DO: Separate concerns
git commit -m "feat(auth): Add login API endpoint"
git commit -m "feat(auth): Add login form component"
git commit -m "test(auth): Add login integration tests"

# ❌ DON'T: Mixed changes
git commit -m "Add login feature and fix header bug and update deps"
```

### Merge Strategy

```bash
# ✅ DO: Use --no-ff to preserve branch history
git merge --no-ff feature/SJH-123-user-auth

# This creates a merge commit that shows:
# - When the feature was merged
# - All commits that were part of the feature
# - Easy to revert entire feature if needed
```

---

## Protected Branches

### main

- No direct pushes
- Only merge from release/_ or hotfix/_
- Requires passing CI checks
- Every commit tagged with version

### develop

- No direct pushes (except small fixes)
- Merge from feature/_, release/_, hotfix/\*
- Integration testing branch

---

## Git Commands Reference

### Useful Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Amend last commit message
git commit --amend -m "New message"

# Interactive rebase (clean up commits)
git rebase -i HEAD~3

# Stash changes
git stash
git stash pop

# View commit history
git log --oneline -10
git log --oneline --graph --all

# View file history
git log --follow -p -- path/to/file

# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"
```

### Dangerous Commands (Avoid)

```bash
# ❌ DANGEROUS: Force push to main/develop
git push --force origin main
git push --force origin develop

# ❌ DANGEROUS: Hard reset with untracked files
git reset --hard

# Use with caution (only on personal branches)
git push --force-with-lease
```

---

## AI Agent Tasks for Git

- Validate commit message format (`<type>(<scope>): <Subject>` with capitalized first letter)
- Check branch naming convention based on Git Flow
- Verify branch is created from correct source (feature from develop, hotfix from main)
- Ensure atomic commits (one logical change per commit)
- Suggest `--no-ff` merge to preserve branch history
- Warn against force push to protected branches (main, develop)
- Check for sensitive data in commits (env files, secrets)
- Validate .gitignore includes necessary patterns

**References**:

- [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
