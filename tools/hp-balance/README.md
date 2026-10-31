# HP 단독 재균형

현재 후보 hp5는 구현과 기능 검증을 마쳤지만 일부 난이도 목표는 FAIL이다. 자동 병합하지 않는다. 먼저 루트 enemy_hp_balance_report.md를 읽는다.

생산 탐험과 v7 실험의 HP는 src/data/enemyHpScaling.ts가 정수 보간한다. 생산 스폰은 Game→Zombie→createProgressionEnemyState, 실험 스폰은 기존 PR #77 제어기의 spawn에서 같은 함수를 호출한다. 실험의 탄약/보급/부착물/3연속 적은 바꾸지 않는다. 동작을 비교할 원형 createEnemyState와 훈련 표적은 유지한다.

개발 서버는 npm run dev -- --host 127.0.0.1로 실행한다. 생산은 /Zombie-Shot/, 실험은 /Zombie-Shot/experiments/level-v7/ 이다. 개발 중인 실험 페이지는 일반 프로덕션 빌드 진입점에 포함되지 않는다. 실제 Playwright 검증은 실행 중인 개발 서버를 필요로 한다.

~~~sh
node tools/hp-balance/replay-exploratory.mjs
node tools/hp-balance/evaluate.mjs hp5 holdout
node tools/hp-balance/campaign.mjs hp5 holdout
node tools/hp-balance/verify.mjs
node tools/hp-balance/browser.mjs
node tools/hp-balance/report.mjs
~~~

Playwright를 별도 설치하거나 PLAYWRIGHT_MODULE에 index.mjs의 절대 경로를 지정한다. BROWSER_CHANNEL 기본은 chrome이다. 기본 포트는5173이고 VALIDATION_BASE로 변경할 수 있다.

보고서의 단일 조우 표는 원래 진행에서 얻은 재고의 조건부 비교다. 전체 순차 런이 실제 생존·재고 공유의 기준이다. 둘을 혼동하지 않는다. 기본 구성은 실제 시작 평두탄을 포함한 utility와 순수 표준/초탄/연계의 pure를 분리한다. 희귀 완성 재고나8발 탄창은 지급하지 않는다.

초기 파일 baseline-campaign.json.gz 및 hp1~hp5-campaign.json.gz는 상인·관측 정책을 보완하기 전의 측정 이력이다. 최종 비교에는 *-exploratory-campaign.json.gz와 hp5-holdout-campaign.json.gz를 쓴다. 브라우저의680발 비교 집계는 traces.json.gz에서 발사된 탄만 합산한 값이며188개 사격 순서와 구별한다.

재개: 이 PR의 head에서 AGENTS.md, PR 설명, 최근 커밋, develop 대비 diff, 보고서와 결과를 먼저 읽는다. 이미 노출된5810001~5810080을 변경 후보의 독립 홀드아웃으로 다시 쓰지 않는다. HP만으로 남은 목표를 해결하지 못한 이유를 확인하고, 후속 범위가 승인되기 전에는 탄약/보급/AI/공격을 바꾸지 않는다. 고정 원본은 ebae61e와 ddaf219에 있다.
