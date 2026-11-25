---
name: git-flow
description: Git Flow 브랜치 작업 절차. 기능 브랜치 시작·마무리, 릴리스 준비, 핫픽스, 버전 태그를 진행한다.
argument-hint: '[feature|release|hotfix] [이름 또는 버전]'
disable-model-invocation: true
---

# Git Flow 절차

이름 규칙과 커밋 형식은 `.claude/rules/git.md`를 따른다. 커밋·푸시·PR·태그는 사용자가 승인한 범위에서만 실행한다. `develop`과 `main`에는 직접 푸시하지 않고 PR로 머지한다(merge commit).

## 시작 전 확인

1. `git status --short`가 비어 있는지 확인한다. 남은 변경이 있으면 사용자에게 처리 방법을 묻는다.
2. `git fetch --prune`으로 원격 상태를 맞춘다.
3. `develop`이 없는 저장소라면 `main`을 통합 브랜치로 쓸지 사용자에게 확인한다.

## 기능 개발

```bash
git switch -c feature/123-user-auth origin/develop

# 작업 중 최신 상태 반영
git fetch origin && git rebase origin/develop

# 마무리: 푸시한 뒤 develop으로 PR
git push -u origin feature/123-user-auth

# 머지된 뒤 정리
git switch develop && git pull --ff-only
git branch -d feature/123-user-auth
```

## 릴리스

버전 올리기와 버그 수정만 한다. 새 기능은 넣지 않는다.

```bash
git switch -c release/1.0.0 origin/develop
pnpm version 1.0.0
git commit -am "chore(release): Bump version to 1.0.0"
git push -u origin release/1.0.0
```

`package.json`이 이미 그 버전이면 `pnpm version`과 커밋을 건너뛴다.

1. `ci.yml`을 실행해 통과를 확인하고 `main`으로 PR을 만들어 머지한다.
2. 머지한 커밋에 태그를 달고 푸시한다.
3. `develop`으로 PR을 만들어 머지한 뒤 브랜치를 지운다.

```bash
git fetch origin
git tag -a v1.0.0 -m "Release version 1.0.0" origin/main
git push origin v1.0.0
```

## 핫픽스

```bash
git switch -c hotfix/789-payment-failure origin/main
git add <고친 파일과 테스트>
git commit -m "fix(payment): Fix payment failure"
pnpm version 1.0.1
git commit -am "chore(release): Bump version to 1.0.1"
git push -u origin hotfix/789-payment-failure
```

릴리스와 같은 순서로 `main` 머지, `v1.0.1` 태그, `develop` 머지를 진행한다. 진행 중인 `release/*` 브랜치가 있으면 `develop` 대신 그 브랜치로 머지한다.

## 완료 보고

만든 브랜치·커밋·태그·PR 목록과 아직 푸시하지 않은 항목을 알려 준다.
