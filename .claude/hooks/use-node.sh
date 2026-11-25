#!/bin/sh
# SessionStart 훅: Claude가 실행하는 셸 명령이 .nvmrc의 Node와 그 안의 pnpm을 쓰게 한다.
# nvm을 쓰지 않는 환경에서는 아무것도 바꾸지 않는다.

project_dir="${CLAUDE_PROJECT_DIR:-$PWD}"
nvm_dir="${NVM_DIR:-$HOME/.nvm}"

[ -n "${CLAUDE_ENV_FILE:-}" ] || exit 0
[ -d "$nvm_dir" ] || exit 0
[ -r "$project_dir/.nvmrc" ] || exit 0

version="$(tr -d '[:space:]v' < "$project_dir/.nvmrc")"
bin="$nvm_dir/versions/node/v$version/bin"

# 표준 출력은 Claude의 컨텍스트에 추가된다.
if [ ! -x "$bin/node" ]; then
  echo "Node ${version}이(가) 설치되어 있지 않다. 사용자에게 'nvm install'을 안내하고, 설치 전에는 pnpm 명령이 실패할 수 있음을 알린다."
  exit 0
fi

printf 'export PATH="%s:$PATH"\n' "$bin" >> "$CLAUDE_ENV_FILE"

if [ ! -x "$bin/pnpm" ]; then
  echo "Node ${version}에 pnpm이 없다. 사용자에게 README의 설치 절차(npm install --global pnpm)를 안내한다."
fi
