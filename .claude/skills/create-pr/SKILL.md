---
name: create-pr
description: 현재 브랜치의 변경사항을 분석해 PR 제목과 본문을 작성. "PR 써줘", "PR 만들어줘", "풀 리퀘스트 올려줘" 같은 요청에 사용.
argument-hint: '[베이스 브랜치]'
---

# PR 작성

`.github/pull_request_template.md` 형식에 맞춰 PR 제목과 본문을 만든다. 실제 PR 생성과 푸시는 사용자가 승인한 뒤에만 한다.

## 1. 변경사항 수집

현재 브랜치가 `main`이나 `develop`이거나 이름이 없으면(detached HEAD) 멈추고, 새 브랜치로 옮길지 묻는다.

`git fetch` 뒤 베이스 브랜치를 이 순서로 정한다.

1. 인자로 받은 값
2. `release/*`, `hotfix/*` 브랜치면 `main`
3. `origin/develop`이 있으면 `develop`
4. 그 밖에는 `main`

비교는 원격 브랜치(`origin/<base>`)로 한다. 로컬 브랜치는 없거나 오래됐을 수 있다.

```bash
git branch --show-current
git log origin/<base>..HEAD --oneline
git diff origin/<base>...HEAD --stat
git diff origin/<base>...HEAD
```

- 커밋하지 않은 변경이 있으면 먼저 알린다.
- diff가 비어 있으면 멈추고 베이스 브랜치를 확인한다.

## 2. 제목

커밋 메시지와 같은 형식을 쓴다(`.claude/rules/git.md`): `<type>(<scope>): <Subject>`, 50자 이내.

type은 브랜치 접두사와 커밋 내용으로 정한다.

| 브랜치 접두사        | type       |
| -------------------- | ---------- |
| `feature/`           | `feat`     |
| `fix/`, `hotfix/`    | `fix`      |
| `refactor/`          | `refactor` |
| `docs/`              | `docs`     |
| `chore/`, `release/` | `chore`    |

scope는 변경이 가장 많은 경로로 정한다. 맞는 것이 없으면 생략한다.

| 경로                                  | scope    |
| ------------------------------------- | -------- |
| `src/app/api/`, `src/lib/api/`        | `api`    |
| `src/lib/auth/`, 로그인 화면          | `auth`   |
| `src/components/`                     | `ui`     |
| `src/stores/`                         | `store`  |
| `src/hooks/`                          | `hooks`  |
| `src/types/`                          | `types`  |
| `src/lib/`의 나머지                   | `lib`    |
| `src/styles/`                         | `styles` |
| `messages/`, `src/lib/i18n/`          | `i18n`   |
| `package.json`, `pnpm-workspace.yaml` | `deps`   |
| `.claude/`, `.agents/`, `AGENTS.md`   | `claude` |
| `.github/`                            | `ci`     |

## 3. 본문

템플릿의 제목과 순서를 그대로 유지하고 한국어로 채운다.

- **작업 내용**: 바뀐 동작을 기준으로 적는다. 파일 나열로 대신하지 않는다.
- **Reference**: 이슈나 문서 링크. 없으면 `-`만 남긴다.
- **작업 결과**: 실제로 실행한 검증 명령과 결과. 건너뛴 검증은 이유와 함께 적고, 통과한 것처럼 쓰지 않는다.
- **기타**: 리뷰어가 알아야 할 위험, 환경 변수, 마이그레이션.
- **체크리스트**: 직접 확인한 항목만 체크한다.

## 4. 출력

제목과 본문을 복사 가능한 코드 블록으로 보여 주고, PR을 생성할지 묻는다. 승인받으면 다음을 실행한다.

```bash
git push -u origin <branch>
gh pr create --base <base> --title "<제목>" --body-file <본문 파일>
```
