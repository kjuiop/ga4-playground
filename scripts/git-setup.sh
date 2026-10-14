#!/bin/sh
# repo-local git template + hooks 적용 (Git Bash 에서 실행: sh scripts/git-setup.sh)
set -eu

echo "Setting git commit template..."
git config commit.template .gitmessage.txt

echo "Enabling repo hooks (.githooks)..."
git config core.hooksPath .githooks
chmod +x .githooks/commit-msg .githooks/pre-commit

echo "Done. (repo-local git template + hooks applied)"
