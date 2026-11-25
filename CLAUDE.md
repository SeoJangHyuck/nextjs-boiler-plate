@AGENTS.md

## Claude Code

### 스킬과 서브에이전트

사용자가 이름을 말하지 않아도 작업에 맞으면 알아서 쓴다. 설치된 스킬이 많으면 목록에서 설명이 잘리므로 이 표를 기준으로 고른다.

| 작업                                       | 쓸 것                                                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 화면을 만들거나 고치기                     | `frontend-design:frontend-design`, `taste-skill:design-taste-frontend`                               |
| 색, 타이포그래피, UX 기준 찾기             | `ui-ux-pro-max:ui-ux-pro-max`                                                                        |
| 화면과 접근성 점검                         | `web-design-guidelines`                                                                              |
| React, Next.js 구현과 성능                 | `vercel-react-best-practices`, `vercel-composition-patterns`                                         |
| React Native, Expo                         | `vercel-react-native-skills`                                                                         |
| 설계, 계획, 디버깅, 테스트 작성, 완료 확인 | `superpowers:*`                                                                                      |
| 여러 파일에 걸친 기능 개발                 | `feature-dev:feature-dev`                                                                            |
| 타입 정의와 참조 찾기                      | LSP 도구(`typescript-lsp`)                                                                           |
| 변경 리뷰                                  | `reviewing-code`, 독립 검토는 서브에이전트 `project-reviewer`, GitHub PR은 `code-review:code-review` |
| 완료 전 전수 검증                          | 서브에이전트 `verifier`                                                                              |
| PR 작성                                    | `create-pr`                                                                                          |
| 브랜치, 릴리스, 태그                       | 사용자가 직접 `/git-flow`를 실행한다. 필요하면 실행을 안내한다                                       |
| MCP 서버 개발                              | `mcp-builder`                                                                                        |
| 필요한 스킬 찾기                           | `find-skills`                                                                                        |
| Claude Code 설정 추천                      | `claude-code-setup:claude-automation-recommender`                                                    |

### 화면 디자인

- `frontend-design`과 `taste-skill`은 어느 하나로 정해 두지 않는다. 화면을 구성할 때 둘 다 염두에 두고, 화면의 성격과 요소에 맞는 지침을 스스로 골라 적용한다.
- 지침이 서로 다르면 사용자 요청, 프로젝트의 토큰과 규칙, 그 화면에 더 맞는 스킬 순서로 따른다.

### 문서

- 플러그인이나 스킬이 만드는 문서는 기본 경로 대신 `docs/plans/`에 둔다. 설계는 `YYYY-MM-DD-<주제>-design.md`, 계획은 `YYYY-MM-DD-<주제>-plan.md`로 이름 짓는다.
- 새 규칙과 스킬은 한국어로 쓴다. 린터나 훅으로 강제할 수 있으면 문서 대신 그쪽을 쓴다.
- 규칙을 추가하면 `AGENTS.md`의 표에, 스킬·서브에이전트·플러그인을 추가하면 위 표에 넣는다(`tests/unit/agents`가 검사).
