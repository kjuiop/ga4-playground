# GA4 Playground

GA4(Google Analytics 4)의 측정·기여 동작을 직접 구현하고 테스트해 보는 실험용 레포입니다.
공식 문서만으로 확신하기 어려운 부분을 실제 태깅과 GA4 보고서로 검증하고, 그 결과를 기록합니다.

## 기술 스택

- Next.js (App Router) · TypeScript
- Google Analytics 4 (gtag.js)
- Tailwind CSS

## 실험 목록

| # | 실험 | 상태 |
|---|---|---|
| 1 | [User-ID 크로스 디바이스 구매 전환 기여](#실험-1-user-id-크로스-디바이스-구매-전환-기여) | 🧪 준비 중 |

상태: 🧪 준비 중 · 🔄 진행 중 · ✅ 완료

---

## 실험 1. User-ID 크로스 디바이스 구매 전환 기여

### 질문

> 모바일에서 광고를 클릭해 들어온 사람이 나중에 **PC에서 로그인해 구매**하면,
> GA4가 두 기기를 **한 사용자로 묶고**, 그 구매 전환을 **모바일 광고 클릭에 기여**하는가?

### 가설

아래 세 조건이 모두 맞으면 PC 구매가 모바일 광고 클릭에 기여된다.

1. 모바일에서 **UTM이 붙은 클릭**으로 유입됐다
2. 모바일·PC **양쪽에서 로그인**해 같은 `user_id`로 묶였다
3. PC 구매 직전에 **다른 광고 클릭이 없다** (마지막 클릭 기준)

### 동작 흐름

```
모바일 (client_id A) ─[광고 클릭, utm_source=dsp_test]─[로그인]─────────────
                                                     │
                                                user_id U1   ← 두 기기를 한 사람으로
                                                     │
PC     (client_id B) ──────────────────────────────────────[로그인 → 구매]──
```

- 결과는 **사용자 1명, 세션 2개**. 세션은 합쳐지지 않고 각 세션의 유입 출처도 그대로 남는다
- 보고 ID가 **혼합됨/관찰됨**이어야 User-ID가 사용된다 (기기 기반이면 2명으로 집계)
- 기여 모델은 direct 유입에 몫을 주지 않으므로, PC 직접 입력 구매의 몫은 앞선 광고 클릭으로 간다

### 시나리오별 예상 결과

| | 상황 | 마지막 클릭 | 확인 수준 |
|---|---|---|---|
| A | 모바일 광고 클릭 + 로그인 → PC 로그인 후 직접 입력해 구매 | 광고 100% | 🔶 추론 |
| B | A와 같은데 PC에서 **다른 광고 클릭** 후 구매 | 다른 광고 100% | 🔶 추론 |
| C | 모바일 클릭만, **로그인 안 함** → PC 로그인 구매 | 광고 0 (direct) | ✅ 문서 |
| D | 모바일 클릭 후 이탈, **며칠 뒤 같은 모바일로 재방문해 로그인** → PC 구매 | 연결될 수도 | ❓ 미확인 |
| E | PC에서 **로그인 없이** 구매 (비회원) | 광고 0 | ✅ 문서 |
| F | 모바일 배너 **노출만** (클릭 없음) | 0 | 🔶 추론 |
| G | 클릭 후 **90일 지나** 구매 | 0 | ✅ 문서 |

✅ 공식 문서로 확인 · 🔶 여러 문서를 이어서 추론 · ❓ 문서에 없음, 테스트로 확인 필요

**이 실험의 핵심 검증 대상은 A·B(추론)와 D(미확인)입니다.**
기여 분석 문서에는 User-ID·크로스 디바이스에 대한 언급이 없어, "User-ID로 묶인 여정이 기여 계산에 쓰인다"는 점을 직접 확인해야 합니다.

### 테스트 절차

사전 준비: 테스트용 GA4 속성, User-ID(`user_id`) 전송 구현, 보고 ID 혼합됨/관찰됨 설정

- 시나리오마다 **별도 테스트 계정**과 **새 브라우저 프로필**(쿠키 초기화)로 진행합니다.
  같은 계정·브라우저를 재사용하면 이전 시나리오에서 이미 기기가 연결돼 결과가 섞입니다.
- 시크릿 창은 닫으면 client_id가 사라지므로, 다음 날 재방문이 필요한 시나리오 D에는 쓰지 않습니다.

> ⚠️ 테스트 사용자가 적으면 **데이터 임계값**이 적용돼 보고서에서 행이 숨겨질 수 있습니다.
> 보고서에 경로가 안 보인다고 "기여 안 됨"으로 판단하지 말고, **DebugView로 이벤트 수신**을 확인한 뒤 **BigQuery 원본(5단계)** 을 1차 근거로 사용합니다.

1. **관리 > 데이터 표시 > 보고 ID**가 혼합됨/관찰됨인지 확인
2. 모바일에서 UTM 테스트 URL로 접속 후 로그인
   `?utm_source=dsp_test&utm_medium=display&utm_campaign=xdevice_test`
3. PC에서 직접 주소 입력 → 같은 계정으로 로그인 → 테스트 구매(`purchase`, 주요 이벤트)
4. 1~2일 뒤 **광고 > 기여 분석 > 기여 경로**에서 `dsp_test → (direct)` 경로 확인
5. BigQuery Export가 있으면 같은 `user_id`에 `user_pseudo_id` 2개가 묶였는지 원본 확인
6. 시나리오 D: 2단계에서 로그인 없이 이탈 → 다음 날 같은 모바일로 재방문해 로그인 → 3~5단계 반복
7. 시나리오 B: 3단계의 PC 접속을 다른 UTM으로 바꿔 반복 → 기여 경로에서 마지막 클릭이 `dsp_test_b`인지 확인
   `?utm_source=dsp_test_b&utm_medium=display&utm_campaign=xdevice_test`

### 결과

| 시나리오 | 테스트일 | 결과 | 비고 |
|---|---|---|---|
| A | | | |
| B | | | |
| D | | | |

### 참고 문서

- [User-ID를 활용한 플랫폼 간 활동 측정](https://support.google.com/analytics/answer/9213390?hl=ko)
- [보고 ID](https://support.google.com/analytics/answer/10976610?hl=ko)
- [Campaigns and traffic sources](https://support.google.com/analytics/answer/11242841?hl=en)
- [기여 분석 시작하기](https://support.google.com/analytics/answer/10596866?hl=ko)
- [기여 분석 설정 선택](https://support.google.com/analytics/answer/10597962?hl=ko)
- [Send user IDs (Google for Developers)](https://developers.google.com/analytics/devguides/collection/ga4/user-id)
- [BigQuery Export 스키마](https://support.google.com/analytics/answer/7029846?hl=ko)
- [데이터 기준점에 대한 정보](https://support.google.com/analytics/answer/9383630?hl=ko)

---

## 개발 워크플로우

```bash
# 클론 후 1회: 커밋 템플릿 + 훅 적용
sh scripts/git-setup.sh
```

- 브랜치: `feature|fix|refactor|chore/#{이슈번호}` → base `develop`
- 커밋: `[#{이슈번호}] type: 설명`
- Claude Code 스킬: `/issue-create` → `/plan` → `/pr-create` → `/iterate`

자세한 내용은 [CLAUDE.md](./CLAUDE.md)를 참고하세요.
