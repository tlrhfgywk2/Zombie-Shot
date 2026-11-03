# 재현 가능한 플레이 시나리오

Node22 이상에서 npm ci, npm run dev -- --host 127.0.0.1 후 아래 페이지를 연다. 생산 게임은 루트, 후보는 /Zombie-Shot/experiments/level-v7/ 이다. 정상 후보에는 validation=1을 붙이지 않아도 플레이할 수 있다.

## 자연 획득 런

results/browser/results.json의 commonSeed를 사용한다. 1440×900과390×844에서 여섯 빌드를 각각 고른다. 첫 전투는 실제 시작3발과 무제한 기본탄으로 해결한다. 2노드에서 상자를 선택하고3노드 승리 뒤 연결 재료를 받는다. 4·7노드에서 보유 핵심 탄약을 한 번씩 강화하고,7노드에서 한 종류를1발 추가 배분한다. 8노드의3연속 적 사이에서 재보급되지 않는지 확인한다.

| 빌드 | 대표 순서 |
|---|---|
| 상처·취약 | 절개탄 → 절개탄 → 열상탄 |
| 열 저장·소비 | 소이탄 → 점화탄 → 연소촉진탄 |
| 설치·기폭 | 접착폭약탄 → 폭발탄 → 평두탄 |
| 고압·반동 회수 | 고압탄 → 고압탄 → 반동탄 |
| 상처·열 소작 | 절개탄 → 소이탄 → 소작탄 |
| 충격·폭약 공명 | 평두탄 → 접착폭약탄 → 공명기폭탄 |

상처는 절개 두 발 뒤 열상, 열은 촉진→소이→점화, 폭발은 접착/폭발 설치 뒤 평두, 반동은 고압 여러 발 뒤 반동탄, 소작은 절개→소이→소작, 공명은 평두→접착→공명 순서가 대표다. 대표 순서를 강제로 정답 취급하지 않고 실제 거리/잔량/부착물에 따라 조절한다.

## 자동 입력과 상태 추적

~~~sh
node tools/level-v7/prepare.mjs
node tools/level-v7/evaluate.mjs exploratory experiments/level-v7/candidate-6.json nine-linked
node tools/level-v7/evaluate.mjs holdout experiments/level-v7/candidate-6.json nine-linked
node tools/level-v7/replay.mjs 21002 recoil competent replay.local
node tools/level-v7/verify.mjs
node tools/level-v7/browser.mjs
node tools/level-v7/production-browser.mjs
node tools/level-v7/report.mjs
~~~

Playwright는 별도 설치하거나 PLAYWRIGHT_MODULE을 기존 index.mjs 절대 경로로 지정한다. BROWSER_CHANNEL 기본값은 chrome이다. 브라우저 자동 검사는 Vite 개발 서버가 필요하다. holdout은 동일 지문의 정확한 재현만 허용하며 후보를 수정하면 새 미사용 구간을 선언해야 한다. 기존3730001~3730080을 새 후보의 미사용 검증처럼 재사용하지 않는다.

## 분리된 경계 fixture

| 상황 | 입력과 기대 |
|---|---|
| 좋은/나쁜 순서 | 근접 지반54HP, 촉진→소이(1등급)→점화는 처치. 점화→소이→촉진은 즉사 |
| 특수탄 고갈 | 근접 지반54HP, 기본탄4발만 사용하면 실패 |
| 위치·충격 | 근접 일반 감염체에 후퇴→평두→평두→기본탄. 행동 중단 또는 사거리 지연 뒤 생존 |
| 미발사 | HP1,6발 자연 용량 부착물, 공명기폭탄6발 예약. 한 발만 소모하고 뒤5발 미발사 |
| 화면 경계 | 빈 탄창/가득 참/긴 이름/수치/제작·부착물·추가 배분/승패를 두 화면에서 촬영 |

경계 fixture는 validation=1에서만 사용할 수 있다. 자연 획득 성공률과 합산하지 않는다. 현행 루트 Game도 별도18개 계산/소모 동치 시나리오와 탐험2회로 검사한다. 실제 게임 입력 결과와 독립 수치 시뮬레이션은 별개다.
