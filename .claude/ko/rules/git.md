---
paths: '**/*'
---

# Git 컨벤션

## 목적

Git Flow 브랜치 모델, 커밋 메시지, 브랜치 관리를 표준화하여 일관된 협업과 명확한 프로젝트 히스토리를 유지합니다.

---

## Git Flow 브랜치 모델

[A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/) 기반.

### 메인 브랜치

| 브랜치    | 목적                                    | 머지 소스                |
| --------- | --------------------------------------- | ------------------------ |
| `main`    | 프로덕션 준비 상태. 모든 커밋이 릴리스. | release, hotfix          |
| `develop` | 다음 릴리스를 위한 통합 브랜치.         | feature, release, hotfix |

### 지원 브랜치

| 브랜치      | 생성 소스 | 머지 대상     | 네이밍                  |
| ----------- | --------- | ------------- | ----------------------- |
| `feature/*` | develop   | develop       | `feature/<티켓>-<설명>` |
| `release/*` | develop   | develop, main | `release/<버전>`        |
| `hotfix/*`  | main      | develop, main | `hotfix/<티켓>-<설명>`  |

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

## 브랜치 워크플로우

### 기능 개발

```bash
# 1. develop에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/SJH-123-user-auth

# 2. 작업 및 커밋
git add .
git commit -m "feat(auth): Add login form component"

# 3. 브랜치 최신 상태 유지 (develop에 rebase)
git checkout develop
git pull origin develop
git checkout feature/SJH-123-user-auth
git rebase develop

# 4. develop에 머지 (--no-ff로 히스토리 보존)
git checkout develop
git merge --no-ff feature/SJH-123-user-auth
git branch -d feature/SJH-123-user-auth
git push origin develop
```

### 릴리스 준비

```bash
# 1. develop에서 release 브랜치 생성
git checkout develop
git checkout -b release/1.0.0

# 2. 버전 업데이트, 버그 수정 (새 기능 금지!)
git commit -m "chore(release): Bump version to 1.0.0"

# 3. main에 머지 및 태그
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"

# 4. develop에 머지
git checkout develop
git merge --no-ff release/1.0.0

# 5. release 브랜치 삭제
git branch -d release/1.0.0
```

### 핫픽스 (프로덕션 버그)

```bash
# 1. main에서 hotfix 브랜치 생성
git checkout main
git checkout -b hotfix/SJH-789-critical-bug

# 2. 버그 수정
git commit -m "fix(payment): Fix critical payment failure"

# 3. main에 머지 및 태그
git checkout main
git merge --no-ff hotfix/SJH-789-critical-bug
git tag -a v1.0.1 -m "Hotfix version 1.0.1"

# 4. develop에 머지 (release 브랜치 있으면 거기에)
git checkout develop
git merge --no-ff hotfix/SJH-789-critical-bug

# 5. hotfix 브랜치 삭제
git branch -d hotfix/SJH-789-critical-bug
```

---

## 커밋 메시지 형식

### 구조

```
<type>(<scope>): <Subject>

[body]

[footer]
```

### Subject 규칙

- **첫 글자 대문자** (예: `Add`, `Fix`, `Update`)
- 명령형 어조
- 끝에 마침표 없음
- 최대 50자

### Types

| Type       | 설명                         | 예시                                       |
| ---------- | ---------------------------- | ------------------------------------------ |
| `feat`     | 새 기능                      | `feat(auth): Add OAuth login`              |
| `fix`      | 버그 수정                    | `fix(cart): Resolve quantity update issue` |
| `docs`     | 문서                         | `docs(readme): Update installation guide`  |
| `style`    | 코드 스타일 (로직 변경 없음) | `style(button): Fix indentation`           |
| `refactor` | 코드 리팩토링                | `refactor(api): Simplify error handling`   |
| `perf`     | 성능 개선                    | `perf(images): Add lazy loading`           |
| `test`     | 테스트 추가/수정             | `test(auth): Add login unit tests`         |
| `chore`    | 빌드/도구 변경               | `chore(deps): Update dependencies`         |
| `ci`       | CI/CD 변경                   | `ci(github): Add deploy workflow`          |
| `revert`   | 이전 커밋 되돌리기           | `revert: feat(auth): Add OAuth login`      |

### Scope (선택사항)

| Scope     | 설명        |
| --------- | ----------- |
| `auth`    | 인증        |
| `api`     | API 라우트  |
| `ui`      | UI 컴포넌트 |
| `i18n`    | 국제화      |
| `deps`    | 의존성      |
| `config`  | 설정        |
| `release` | 릴리스 관련 |

### 예시

```bash
# ✅ DO: 첫 글자 대문자, 명령형, 마침표 없음
feat(auth): Add Google OAuth provider
fix(cart): Handle empty cart state
docs(api): Update endpoint documentation
chore(release): Bump version to 1.0.0

# ❌ DON'T: 소문자, 과거형, 마침표
feat(auth): added Google OAuth provider.
fix(cart): fixed the cart bug
```

### Body (선택사항)

```bash
feat(auth): Add session refresh mechanism

Implement automatic token refresh to prevent
unexpected logouts. The refresh happens 5 minutes
before token expiration.

- Add refresh token storage
- Create background refresh timer
- Handle refresh failures gracefully
```

### Footer (선택사항)

```bash
# Breaking changes
feat(api)!: Change response format

BREAKING CHANGE: API responses now use camelCase
instead of snake_case for all field names.

# Issue 참조
fix(cart): Resolve duplicate item bug

Closes #123
Refs #456, #789
```

---

## 브랜치 네이밍

### 형식

```
<type>/<ticket>-<short-description>
```

### 예시

```bash
# ✅ DO: 명확하고 설명적인 브랜치 이름
feature/SJH-123-user-authentication
feature/SJH-124-shopping-cart
fix/SJH-456-cart-total-calculation
hotfix/SJH-789-payment-failure
release/1.0.0
release/2.1.0

# ❌ DON'T: 모호하거나 개인적인 이름
feature/new-stuff
fix/bug
john/working-on-it
```

---

## 커밋 모범 사례

### 원자적 커밋

하나의 논리적 변경 = 하나의 커밋.

```bash
# ✅ DO: 관심사 분리
git commit -m "feat(auth): Add login API endpoint"
git commit -m "feat(auth): Add login form component"
git commit -m "test(auth): Add login integration tests"

# ❌ DON'T: 혼합된 변경
git commit -m "Add login feature and fix header bug and update deps"
```

### 머지 전략

```bash
# ✅ DO: --no-ff로 브랜치 히스토리 보존
git merge --no-ff feature/SJH-123-user-auth

# 머지 커밋이 생성되어 다음을 보여줌:
# - 기능이 머지된 시점
# - 기능에 포함된 모든 커밋
# - 필요시 전체 기능 되돌리기 용이
```

---

## 보호 브랜치

### main

- 직접 푸시 금지
- release/_ 또는 hotfix/_ 에서만 머지
- CI 체크 통과 필수
- 모든 커밋에 버전 태그

### develop

- 직접 푸시 금지 (작은 수정 제외)
- feature/_, release/_, hotfix/\* 에서 머지
- 통합 테스트 브랜치

---

## Git 명령어 참조

### 유용한 명령어

```bash
# 마지막 커밋 취소 (변경 유지)
git reset --soft HEAD~1

# 마지막 커밋 메시지 수정
git commit --amend -m "New message"

# 인터랙티브 리베이스 (커밋 정리)
git rebase -i HEAD~3

# 변경사항 임시 저장
git stash
git stash pop

# 커밋 히스토리 보기
git log --oneline -10
git log --oneline --graph --all

# 파일 히스토리 보기
git log --follow -p -- path/to/file

# 어노테이션 태그 생성
git tag -a v1.0.0 -m "Release version 1.0.0"
```

### 위험한 명령어 (피해야 함)

```bash
# ❌ 위험: main/develop에 강제 푸시
git push --force origin main
git push --force origin develop

# ❌ 위험: 추적되지 않는 파일과 함께 하드 리셋
git reset --hard

# 주의해서 사용 (개인 브랜치에서만)
git push --force-with-lease
```

---

## AI 에이전트 Git 작업

- 커밋 메시지 형식 검증 (`<type>(<scope>): <Subject>` 첫 글자 대문자)
- Git Flow 기반 브랜치 네이밍 규칙 확인
- 브랜치가 올바른 소스에서 생성되었는지 확인 (feature는 develop, hotfix는 main에서)
- 원자적 커밋 보장 (하나의 논리적 변경 = 하나의 커밋)
- 브랜치 히스토리 보존을 위해 `--no-ff` 머지 제안
- 보호 브랜치(main, develop)에 강제 푸시 경고
- 커밋에서 민감한 데이터 확인 (env 파일, 시크릿)
- .gitignore에 필요한 패턴 포함 확인

**참조**:

- [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
