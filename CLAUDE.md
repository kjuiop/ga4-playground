# GA4 Playground — Claude Code 가이드

## 프로젝트 개요

GA4 실험 프로젝트. Next.js 웹에서 GA4 이벤트 수집·전환 측정·전자상거래 추적을 직접 구현하며 학습하는 포트폴리오 프로젝트.

## 프로젝트 구조 (예정)

```
ga4-playground/
└── src/
    ├── app/              # 페이지 및 API 라우트 (App Router)
    ├── components/       # 재사용 UI 컴포넌트
    ├── lib/analytics/    # GA4 이벤트 전송 유틸 (gtag 래퍼)
    └── types/            # TypeScript 타입 정의
```

## 기술 스택

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict)
- **Analytics**: Google Analytics 4 (gtag.js)
- **Style**: Tailwind CSS

## 개발 워크플로우

### 브랜치 전략

```
main                 ← 프로덕션
develop              ← 통합 브랜치
feature/#{이슈번호}  ← 기능 개발
fix/#{이슈번호}      ← 버그 수정
refactor/#{이슈번호} ← 리팩토링
chore/#{이슈번호}    ← 설정·문서·도구
```

### 커밋 컨벤션

```
[#{이슈번호}] type: 설명

type: feat | fix | docs | style | refactor | perf | test | chore
```

`.githooks/commit-msg`가 형식을 검사합니다. 클론 후 한 번 실행하세요:

```bash
sh scripts/git-setup.sh
```

### PR 흐름

1. `issue-create` 스킬로 이슈 생성
2. `feature/#{N}` 브랜치 생성
3. 개발 후 `pr-create` 스킬로 PR 생성 (base: develop)
4. `pr-review` 스킬로 리뷰 → `pr-apply` 스킬로 반영 (또는 `iterate` 로 LGTM 까지 자동 반복)

## Available Skills

스킬은 `.claude/skills/` 디렉터리에 정의되어 있으며, Claude Code 대화에서 `/스킬명`으로 호출합니다.

| 스킬 | 용도 |
|------|------|
| `plan` | 이슈 분석 → 구현 계획 문서 생성 |
| `issue-create` | 변경사항 분석 → GitHub 이슈 생성 |
| `pr-create` | 현재 브랜치 커밋 분석 → PR 생성 |
| `pr-review` | PR 코드 리뷰 → 코멘트 등록 |
| `pr-apply` | PR 리뷰 코멘트 → 코드 반영 |
| `iterate` | LGTM 이 나올 때까지 pr-review → pr-apply 반복 |
| `question` | 질문 답변 → docs/claude/question/ 저장 |

## Agents

| 에이전트 | 용도 |
|---------|------|
| `product-manager` | 측정 요구사항 분석, GA4 이벤트 설계, 이슈 작성 |
| `frontend-developer` | Next.js 구현, GA4 이벤트 태깅 |
| `reviewer` | 코드 리뷰, 태깅 정합성 검토 |

## 빌드 & 실행

```bash
npm run dev     # 개발 서버
npm run lint    # 린트
npm run build   # 프로덕션 빌드
```

## 코드 품질 규칙

- **GA4 호출**: 컴포넌트에서 `gtag` 직접 호출 금지 — `lib/analytics/` 유틸 사용
- **이벤트명**: GA4 권장 이벤트 우선, 커스텀 이벤트는 snake_case
- **SSR 안전성**: `window`/`gtag`는 Client Component의 effect·이벤트 핸들러 안에서만 접근
- **개인정보**: PII(이메일, 전화번호, 이름 등)를 이벤트 파라미터로 전송 금지
- **설정값**: 측정 ID 등은 `NEXT_PUBLIC_GA_MEASUREMENT_ID` 같은 환경변수로 관리
- **타입**: `any` 사용 금지, 이벤트 파라미터는 타입 정의
