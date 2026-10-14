# GA4 Playground — Claude Code 가이드

## 프로젝트 개요

GA4 실험 프로젝트. 광고주 사이트에 GA4를 직접 태깅하고, 크로스 디바이스·전환 기여 같은 측정 동작을 실험으로 검증하는 포트폴리오 프로젝트.

## 프로젝트 구조 (모노레포)

```
ga4-playground/
├── advertiser/          # 광고주 사이트 (Next.js) — GA4 테스트 대상, GA 태그 있음
│   └── src/
│       ├── app/[site]/  # 사이트별 라우트 (/fashion ...), 카페24식 URL
│       ├── components/  # analytics(GaProvider), debug(디버그 패널), shop(화면)
│       ├── lib/
│       │   ├── analytics/  # gtag 래퍼, 전자상거래 이벤트
│       │   ├── auth/       # AuthProvider (지금: 고정 테스트 계정 + 쿠키)
│       │   ├── site/       # SiteRepository (지금: 코드 + 환경변수)
│       │   └── catalog/    # 상품 데이터
│       └── proxy.ts     # 미등록 사이트 코드 404
├── console/             # (예정) 실험 콘솔 — 시나리오·UTM/QR·실행 기록, GA 태그 없음
├── api/                 # (예정) Java 25 + Spring Boot 4.1 — 사이트·계정·주문·test_runs
└── e2e/                 # (예정) Playwright 시나리오
```

- 앱마다 별도 Vercel 프로젝트로 배포해 origin 을 분리한다.
- 매체(publisher)는 필요해지면 추가한다.

## 기술 스택

- **advertiser**: Next.js 16.4 (App Router, Cache Components), React 19, TypeScript (strict), Tailwind CSS 4
- **Analytics**: Google Analytics 4 (gtag.js 직접 로드, `@next/third-parties` 미사용)
- **api (예정)**: Java 25, Spring Boot 4.1, Gradle Kotlin DSL, MySQL

> **Next.js 16 주의**: `advertiser/AGENTS.md` 대로 코드를 쓰기 전에 `advertiser/node_modules/next/dist/docs/` 의 해당 가이드를 확인한다. Cache Components 가 켜져 있어 `cookies()`·`searchParams`·동적 `params` 는 `<Suspense>` 안에서 읽어야 하고, `middleware` 는 `proxy.ts` 로 바뀌었다.

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
cd advertiser
cp .env.example .env.local   # GA_ID_FASHION 설정 (없으면 GA 비활성, 콘솔 출력)
npm run dev                  # http://localhost:3000/fashion
npm run lint
npm run build
```

디버그: `?ga_debug=1` → DebugView 전송, `?panel=1` → 디버그 패널 펼침

## 코드 품질 규칙

- **GA4 호출**: 컴포넌트에서 `gtag` 직접 호출 금지 — `lib/analytics/` 의 `trackEvent`·`setUserId`·전자상거래 함수 사용
- **user_id 타이밍**: 첫 `config` 에 user_id 를 넣는다. 로그인 시 `setUserId` → `login` 이벤트 순서, 로그아웃 시 `null`
- **사이트 분리**: GA `cookie_prefix` 와 로그인 쿠키 `Path=/{site}` 로 사이트 간 client_id·로그인을 분리
- **중복 전송**: `purchase` 는 transaction_id 기준 1회만 (Activity 내비게이션·새로고침 대비)
- **이벤트명**: GA4 권장 이벤트 우선, 커스텀 이벤트는 snake_case
- **SSR 안전성**: `window`/`gtag`는 Client Component의 effect·이벤트 핸들러 안에서만 접근
- **개인정보**: PII(이메일, 전화번호, 이름 등)를 이벤트 파라미터로 전송 금지
- **설정값**: 측정 ID 는 서버 전용 환경변수 `GA_ID_{SITE}` (`NEXT_PUBLIC_` 은 빌드 시 고정되므로 사용하지 않음). 레포에 하드코딩 금지
- **타입**: `any` 사용 금지, 이벤트 파라미터는 타입 정의
