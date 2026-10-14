---
name: iterate
description: 현재 브랜치의 PR을 LGTM이 나올 때까지 pr-review → pr-apply → 커밋·push 를 반복합니다
---

현재 브랜치의 열린 PR에 대해 `pr-review` → `pr-apply` 를 LGTM이 나올 때까지 반복합니다.

추가 컨텍스트: $ARGUMENTS

## 0. 사전 확인

- `gh pr view --json number,url,headRefName` 으로 열린 PR을 확인합니다. 없으면 안내 후 중단합니다
- main 또는 develop 브랜치면 경고 후 중단합니다
- 브랜치명에서 이슈 번호를 추출합니다 (예: `chore/#1` → `1`) — 커밋 메시지에 사용

## 1. 라운드 반복 (최대 5회)

각 라운드는 아래 순서로 진행합니다. 라운드마다 `### Round {n}` 헤더로 진행 상황을 출력합니다.

### 1-1. 리뷰 (`pr-review` 스킬 절차)
- `.claude/skills/pr-review/SKILL.md` 의 절차대로 리뷰하고 라인별 코멘트를 등록합니다
- 리뷰 범위는 PR 전체 diff 이되, **이전 라운드에서 이미 등록·반영된 지적은 다시 등록하지 않습니다**
- 각 지적은 `[Critical]` / `[Warning]` / `[Suggestion]` 으로 등급을 붙입니다

### 1-2. 종료 판정
- 이번 라운드에 새 `[Critical]` / `[Warning]` 이 **없으면 LGTM** 으로 판정하고 2단계로 이동합니다
- `[Suggestion]` 만 남은 경우도 LGTM 입니다 (Suggestion 은 반영하지 않고 최종 요약에 남깁니다)

### 1-3. 반영 (`pr-apply` 스킬 절차)
- `.claude/skills/pr-apply/SKILL.md` 의 절차대로 이번 라운드의 `[Critical]` / `[Warning]` 을 반영합니다
- 타당성 검토에서 **타당하지 않다고 판단한 지적**은 반영하지 않고, 해당 코멘트에 이유를 답글로 남깁니다
- 레포 설정 변경, 정책 결정 등 **사용자 판단이 필요한 지적**은 반영하지 않고 최종 요약에 남깁니다

### 1-4. 커밋 · push · 답글
- 커밋 메시지: `[#{이슈번호}] {type}: 리뷰 반영 - {요약}` (type 은 변경 성격에 맞게 fix / refactor / chore / docs)
- `git push` (force push 금지)
- 반영한 각 코멘트에 답글을 남깁니다:
  ```
  gh api repos/{owner}/{repo}/pulls/{pr_number}/comments/{comment_id}/replies \
    --method POST --field body="🤖 반영했습니다 ({커밋 SHA 7자리})"
  ```
- 다음 라운드로 이동합니다

## 2. LGTM 등록

- 종합 의견을 남깁니다 (`\n` 은 줄바꿈되지 않으므로 heredoc 사용):
  ```
  gh pr review --comment --body "$(cat <<'MD'
  🤖 Claude Review

  LGTM ✅ (Round {n})
  MD
  )"
  ```
- 본인 PR 에는 `--approve` 가 불가하므로 `--comment` 를 사용합니다

## 3. 결과 요약

- 라운드별: 등록한 지적 수 / 반영한 지적 수 / 커밋 SHA
- 반영하지 않은 항목: 타당하지 않음(이유) / 사용자 판단 필요 / Suggestion
- PR URL

주의사항:
- 라운드마다 사용자에게 확인을 요청하지 않습니다 — LGTM 또는 최대 라운드까지 자동 진행합니다
- 5라운드 안에 LGTM 이 나오지 않으면 중단하고 남은 지적을 요약합니다
- 같은 지적이 2라운드 연속 반복되면 반영 방식이 잘못된 것이므로 중단하고 사용자에게 알립니다
- PR 범위(이슈) 밖의 변경은 하지 않습니다
