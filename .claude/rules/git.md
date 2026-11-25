# Git 컨벤션

## 커밋 메시지

`<type>(<scope>): <Subject>`

- Subject는 영어 명령형으로 쓴다. 첫 글자는 대문자, 마침표 없이 50자 이내.
- 본문은 선택이다. 무엇을 왜 바꿨는지 적는다.
- 파괴적 변경은 콜론 앞에 `!`를 붙이고(`feat(api)!: ...`) `BREAKING CHANGE:` 푸터를 쓴다.
- 이슈 참조는 푸터에 `Closes #123`, `Refs #456` 형식으로 적는다.

| type       | 용도                         |
| ---------- | ---------------------------- |
| `feat`     | 새 기능                      |
| `fix`      | 버그 수정                    |
| `docs`     | 문서                         |
| `style`    | 로직 변경 없는 코드 스타일   |
| `refactor` | 동작을 바꾸지 않는 구조 개선 |
| `perf`     | 성능 개선                    |
| `test`     | 테스트 추가·수정             |
| `chore`    | 빌드·도구·의존성             |
| `ci`       | CI/CD                        |
| `revert`   | 이전 커밋 되돌리기           |

scope는 선택이다. 예: `auth` `api` `ui` `i18n` `styles` `deps` `config` `claude` `readme` `release`

```text
✅ feat(auth): Add session refresh
❌ feat(auth): added session refresh.   (소문자, 과거형, 마침표)
```

## 원칙

- 커밋 하나에 논리적 변경 하나만 담는다.
- 커밋 전에 `git diff --staged`로 비밀 값(`.env`, 키, 토큰)이 없는지 확인한다.
- `main`과 `develop`에 직접 푸시하거나 강제 푸시하지 않는다. `--force-with-lease`는 개인 브랜치에서만 쓴다.
- `--no-verify`로 훅을 건너뛰지 않는다. 훅이 실패하면 원인을 고친다.

## 브랜치 (Git Flow)

| 브랜치      | 생성 소스 | 머지 대상     | 이름                             |
| ----------- | --------- | ------------- | -------------------------------- |
| `feature/*` | develop   | develop       | `feature/<ticket>-<description>` |
| `release/*` | develop   | develop, main | `release/<version>`              |
| `hotfix/*`  | main      | develop, main | `hotfix/<ticket>-<description>`  |

- 기능이 아닌 작업은 `feature/` 대신 `fix/`, `refactor/`, `docs/`, `chore/`를 쓰고 나머지는 `feature/*`와 같다.
- 티켓이 없으면 `<ticket>-`을 생략하고, 개인 이름이나 모호한 이름(`fix/bug`)은 쓰지 않는다.
- `develop`과 `main`에는 PR로 머지한다. 머지 커밋으로 브랜치 이력을 남기고, `main`의 머지 커밋에는 버전 태그를 단다.
- `main`에 머지하기 전에 `ci.yml`을 실행해(수동) 통과했는지 확인한다.
- 브랜치 시작·릴리스·태그 절차는 사용자가 `/git-flow`로 실행하고, PR은 `create-pr` 스킬로 작성한다.
