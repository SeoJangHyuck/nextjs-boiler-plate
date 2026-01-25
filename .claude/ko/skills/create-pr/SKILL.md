---
name: create-pr
description: PR 작성 - 변경사항을 분석하여 PR 제목과 템플릿 기반 내용을 자동 생성
---

# PR 작성 스킬

현재 브랜치의 변경사항을 분석하여 `.github/pull_request_template.md` 형식에 맞는 PR 제목과 내용을 자동으로 생성합니다.

---

## 실행 프로세스

### 1단계: 변경사항 수집

```bash
# 현재 브랜치 확인
git branch --show-current

# 베이스 브랜치와의 차이 확인 (develop 또는 main)
git log develop..HEAD --oneline
# 또는
git log main..HEAD --oneline

# 변경된 파일 목록
git diff develop --name-only

# 상세 변경 내용
git diff develop --stat
```

### 2단계: PR 제목 생성

브랜치 이름과 커밋 내용을 기반으로 제목 생성:

```
<type>(<scope>): <Description>
```

**규칙**:

- 커밋 메시지와 동일한 형식
- **첫 글자 대문자**
- 50자 이내

**예시**:

```
feat(auth): Add Google OAuth integration
fix(cart): Resolve quantity sync issue
refactor(api): Simplify error handling
```

### 3단계: PR 내용 생성

`.github/pull_request_template.md` 형식에 맞춰 작성:

```markdown
## 작업 내용

- [변경사항 1]
- [변경사항 2]
- [변경사항 3]

## Reference

- 관련 이슈: #[이슈번호]
- 관련 문서: [링크]

## 작업 결과

- [기능 동작 설명 또는 스크린샷 설명]

## 기타

- [리뷰어가 알아야 할 정보]

## 체크리스트

- [ ] 불필요한 코드는 제거되었나요?
- [ ] PR을 올리는 코드의 길이가 적정한가요?
```

---

## 분석 기준

### 변경 유형 판별

| 브랜치 접두사 | 커밋 타입  | PR 타입   |
| ------------- | ---------- | --------- |
| `feature/`    | `feat`     | 새 기능   |
| `fix/`        | `fix`      | 버그 수정 |
| `hotfix/`     | `fix`      | 긴급 수정 |
| `refactor/`   | `refactor` | 리팩토링  |
| `docs/`       | `docs`     | 문서      |
| `chore/`      | `chore`    | 유지보수  |

### 스코프 추론

변경된 파일 경로를 기반으로 스코프 추론:

| 경로 패턴          | 스코프  |
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

## 출력 형식

분석 후 복사 가능한 형태로 제공:

### PR 제목

```
feat(auth): Add Google OAuth integration
```

### PR 내용

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

## 참고

- PR 템플릿: `.github/pull_request_template.md`
- Git 컨벤션: `.claude/rules/git.md`
