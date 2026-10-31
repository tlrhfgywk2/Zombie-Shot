import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { production, root } from './runtime.mjs';
import { wilson } from '../../simulation/common.mjs';
const p = await production();
const json = async name => JSON.parse(await readFile(new URL(`tools/hp-balance/results/${name}`, root)));
const raw = async name => JSON.parse(gunzipSync(await readFile(new URL(`tools/hp-balance/results/${name}`, root))));
const baseline = await json('baseline-exploratory.json'), result = await json('hp5-holdout.json');
const beforeRuns = await raw('baseline-exploratory-campaign.json.gz'), afterRuns = await raw('hp5-holdout-campaign.json.gz');
const matrix = await raw('hp5-holdout-raw.json.gz');
const names = { basic: '기본 구성', wound: '상처·취약', heat: '열 저장·소비', blast: '설치·기폭', recoil: '고압·반동 회수', cauterize: '상처·열 소작', concussion: '충격·폭약 공명' };
const pct = value => `${(value * 100).toFixed(1)}%`, fmt = value => value == null ? '—' : value.toFixed(2);
const table = (headers, rows) => `| ${headers.join(' | ')} |\n|${headers.map(() => '---').join('|')}|\n${rows.map(row => `| ${row.join(' | ')} |`).join('\n')}`;
const write = (name, source) => writeFile(new URL(name, root), source.trim() + '\n');
const key = (profile, phase, build, strategy = 'competent', utility = 'utility') => `${profile}/${phase}/${build}/${strategy}/${utility}`;
const full = (rows, profile, build, strategy) => {
  const sample = rows.filter(row => row.profile === profile && row.archetype === build && row.strategy === strategy), wins = sample.filter(row => row.won).length;
  return { n: sample.length, wins, rate: wins / sample.length, ci95: wilson(wins, sample.length) };
};
const hpRows = Object.keys(p.ENEMY_DEFINITIONS).map(type => [p.ENEMY_DEFINITIONS[type].name, p.ENEMY_DEFINITIONS[type].hp,
  ...[1, 3, 6, 8].map(depth => p.getEnemyHp(type, depth, 'exploration')),
  ...[3, 5, 6, 8].map(depth => p.getEnemyHp(type, depth, 'v7'))]);
const fullRows = [];
for (const profile of ['exploration', 'v7']) for (const build of profile === 'exploration' ? ['basic', 'wound'] : Object.keys(names)) {
  const before = full(beforeRuns, profile, build, 'competent'), after = full(afterRuns, profile, build, 'competent'), heuristic = full(afterRuns, profile, build, 'heuristic'), search = full(afterRuns, profile, build, 'search');
  fullRows.push([profile === 'exploration' ? '현행 탐험' : 'v7 실험', names[build], `${before.wins}/${before.n} · ${pct(before.rate)}`, `${after.wins}/${after.n} · ${pct(after.rate)}`, after.ci95.map(pct).join('–'), pct(heuristic.rate), `${search.wins}/${search.n}`]);
}
const battleRows = [];
for (const profile of ['exploration', 'v7']) for (const phase of ['early', 'middle', 'late']) {
  const b = baseline.cells[key(profile, phase, 'basic')], a = result.cells[key(profile, phase, 'basic')], w = result.cells[key(profile, phase, 'wound')];
  battleRows.push([profile === 'exploration' ? '현행' : 'v7', { early: '초반', middle: '중반', late: '후반' }[phase],
    pct(b.winRate), `${a.wins}/${a.n} · ${pct(a.winRate)}`, pct(w.winRate), `${fmt(b.winningShots)} → ${fmt(a.winningShots)}`, `${fmt(b.winningTurns)} → ${fmt(a.winningTurns)}`]);
}
const usage = Object.keys(names).map(build => {
  const row = result.cells[key('v7', 'late', build)];
  return [names[build], pct(row.winRate), fmt(row.winningShots), fmt(row.winningTurns), fmt(row.enemyActions), fmt(row.special), pct(row.activationRate), pct(row.utilization), row.overkill, row.extraTurnLosses];
});
const windows = await json('instant-death-windows.json');
const equality = [];
// 같은 시드 안에서만 비교한다. 기준 측정과 독립 홀드아웃을 쌍으로 섞지 않는다.
const bestBasic = matrix.filter(row => row.archetype === 'basic' && row.strategy === 'competent' && row.utility);
for (const row of bestBasic) {
  const others = matrix.filter(r => r.profile === row.profile && r.seed === row.seed && r.phase === row.phase && r.type === row.type && r.distance === row.distance && r.strategy === 'competent' && r.archetype !== 'basic');
  for (const other of others) if (row.won && other.won && row.turn <= other.turn && row.shots <= other.shots) equality.push({ seed: row.seed, profile: row.profile, phase: row.phase, type: row.type, advanced: other.archetype, basicShots: row.shots, advancedShots: other.shots });
}
await writeFile(new URL('tools/hp-balance/results/basic-equality-examples.json', root), JSON.stringify({ count: equality.length, examples: equality.slice(0, 30) }, null, 2));
const csv = ['seed,profile,phase,build,strategy,utility,enemy,distance,hp,won,shots,turn,enemy_actions,special,synergy,potential,effective,overkill,one_more_turn_loss'];
for (const row of matrix) csv.push([row.seed, row.profile, row.phase, row.archetype, row.strategy, row.utility, row.type, row.distance, row.hp, row.won, row.shots, row.turn, row.actions, row.special, row.synergy, row.potential, row.damage, row.potential - row.damage, row.oneMoreTurnLoss].join(','));
await writeFile(new URL('tools/hp-balance/results/holdout-combat.csv', root), csv.join('\n'));
const goals = {
  earlySafety: ['exploration', 'v7'].every(profile => result.cells[key(profile, 'early', 'basic')].winRate >= .85) ? 'PASS' : 'FAIL',
  basicMiddle35to65: ['exploration', 'v7'].every(profile => { const rate = result.cells[key(profile, 'middle', 'basic')].winRate; return rate >= .35 && rate <= .65; }) ? 'PASS' : 'FAIL',
  basicLateBelow30: ['exploration', 'v7'].every(profile => result.cells[key(profile, 'late', 'basic')].winRate < .3) ? 'PASS' : 'FAIL',
  allSixLate60to85: Object.keys(names).filter(id => id !== 'basic').every(id => { const value = result.cells[key('v7', 'late', id)].winRate; return value >= .6 && value <= .85; }) ? 'PASS' : 'FAIL',
  minimumSixProgression60: Object.keys(names).filter(id => id !== 'basic').every(id => full(afterRuns, 'v7', id, 'competent').rate >= .6) ? 'PASS' : 'FAIL',
  hpOnlyRules: 'PASS', trueOptimalUpperBound: 'NOT VERIFIED', humanSatisfaction: 'NOT VERIFIED',
};
await writeFile(new URL('tools/hp-balance/results/final-assessment.json', root), JSON.stringify({ candidate: 'hp5', hash: result.hash, holdout: [result.firstSeed, result.count], observations: result.observations, campaignRuns: afterRuns.length, goals,
  mergeRecommendation: '보류: 중반 기본 구성/일부 강한 빌드/전투 시간의 목표를 HP만으로 동시에 충족하지 못함. 기능 검사 통과와 균형 수락을 구별.' }, null, 2));
const iterations = [];
for (const id of ['baseline', 'hp1', 'hp2', 'hp3', 'hp4', 'hp5']) {
  const rows = await raw(`${id}-exploratory-campaign.json.gz`);
  iterations.push([id, pct(full(rows, 'exploration', 'basic', 'competent').rate), pct(full(rows, 'exploration', 'wound', 'competent').rate),
    pct(full(rows, 'v7', 'basic', 'competent').rate), ...['wound', 'heat', 'blast', 'recoil', 'cauterize', 'concussion'].map(id => pct(full(rows, 'v7', id, 'competent').rate))]);
}
await write('enemy_hp_balance_report.md', `# 적 HP 성장과 난이도 재균형 · 2026-10-31

현행 탐험과 v7 실험에 **서로 다른 적별·깊이별 HP 표**를 구현했다. 한 종류의 일괄 배율을 적용하지 않았다. 최종 후보는 hp5다. 다섯 후보와 독립 검증을 실행했으나 모든 난이도 목표를 동시에 충족하지 못했다. **기능 검사 통과와 균형 수락은 다르며 이 PR의 자동 병합은 보류한다.**

## 1. 실제 구현과 쉬웠던 원인

기준 develop은85e6d22. 현행 탐험은9노드이고 적의 HP20~54가 진행 내내 같았다. P220의 무제한 표준탄은 반동0이며 먼 거리의 느린 적에게 여러 탄창을 안전하게 쏠 수 있다. 초탄·연계탄은 같은 예산에서 즉시 피해를 올리므로 낮은 HP에서는 긴 상태 조합이 필요 없었다. 특수탄은 조우마다 배분이 복구되며 영구 거래 지불만 사라진다. 현재 탐험은 자연 탄창이4발이고 보상/상인 풀에 탄창 부착물이 없다. v7 실험만 무작위 부착물로 자연4~6발이다. 8발은 어느 쪽에도 제공하지 않는다.

v7의 열 저장/소비, 소작, 충격→폭약 공명, 제작 등급은 현행 생산 탄약 구현과 다르다. 이것을 HP 작업을 이유로 몰래 이식하지 않았다. 실험은 PR #77 후보6의 보급·제작2회·추가 배분·3연속 적을 그대로 사용한다. 실험의 발전 화력은 수십~수백이므로 원래50 전후 HP에서는 뒷탄과 상태 회수가 낭비됐다. 훈련 모드의10000HP 표적은 진행 균형 대상이 아니며 유지했다.

## 2. 변경 전후 HP 표

${table(['적', '원형 HP', '현행1', '현행3', '현행6', '현행8', 'v7 3', 'v7 5', 'v7 6', 'v7 8 주 경비'], hpRows)}

v7 첫 노드의 일반 감염체는22HP를 유지한다. 마지막3연속 적 중 후속 지반 파쇄체는54→57HP다. 주 경비와 같은 증가폭을 주면 앞선 적에게 재료를 쓴 빌드가 회복할 수 없어 별도 표로 제한했다. 조우 사이 재보급과 같은 조우의 탄약 공유는 바꾸지 않았다. 기존 적 종류를 추가하거나 이동/저항/공격/행동 시점을 바꾸지 않았다. 표의 일부 적은 현행 탐험 경로에 등장하지 않으며 공용 스폰 함수의 값만 정의한다.

현행 깊이 기준점은1/3/6/8, v7은1/3/5/6/8이다. 사이 값은 HP=반올림(아래 HP+(위 HP−아래 HP)×(현재 깊이−아래 깊이)/(위 깊이−아래 깊이))로 정수 선형 보간한다. 마지막 기준점 이후는 고정한다. HP 무작위 편차는 없다. 원형 createEnemyState는 기존 단위 비교를 위해 보존하고 실제 Game→Zombie→createProgressionEnemyState 스폰 경로가 hp/maxHp를 함께 적용한다. UI는 이 실제 maxHp를 그대로 표시한다.

## 3. 즉사까지 허용되는 피해량

아래는 P220·부착물 없음·표준탄4발만 쏘고 원래 행동을 실행한 정확한 계산이다. 무한 HP의 동일 적으로 치명 행동 직전까지 누적한 비교이며 실제 게임에 무한 표적을 넣은 것은 아니다.

${table(['적', '기본 거리', '치명 행동 턴', '그 직전까지 표준탄 피해'], windows.map(row => [p.ENEMY_DEFINITIONS[row.type].name, row.distance + 'm', row.lethalTurn, row.standardDamageBeforeAttack]))}

느린 강인/거대 감염체는 기본탄만으로도 큰 누적 피해를 낼 시간이 있다. 기본 구성 승률을 낮추기 위해 이 상한을 넘는 HP를 주면 여러 번의 반복 장전이 먼저 늘어난다. 반대로 근접 특수 적의 HP를 몇 점만 올려도 한 턴의 공격을 더 허용해 즉시 패배한다. HP만으로 생존 구간을 넓히거나 줄일 수는 있지만 모든 조합의 화력/제어 격차를 없앨 수는 없다.

## 4. 초·중·후 단일 조우 비교

${table(['환경', '구간', '기본 변경 전', '기본 변경 후', '상처 발전 구성', '기본 처치 탄수 전→후', '기본 처치 턴 전→후'], battleRows)}

이 표는 조건부 획득 상한 비교다. 진입1, 초기3, 중반5·6, 후반8의 두 위협을 관찰한다. 원래 HP 진행에서 실제로 얻은 재고/등급/부착물을 고정한 뒤 HP만 바꿨다. 따라서 죽은 새 HP 런에 이 미래 재고를 지급했다고 주장하지 않는다. 실패도 조우 표 분모에 넣으며 탄수/턴수는 **승리한 조우 조건부 평균**이다. 같은 시드의 여러 조우/빌드를 독립 표본으로 세지 않는다. 현재 실제 순차 결과는 다음 표다.

## 5. 재고 소모와 사망을 포함한 전체 런

${table(['환경', '구성', '원래 HP 숙련·탐색80시드', '새 HP 숙련·홀드아웃80시드', '새 HP 95% 구간', '새 HP 기초 정책', '탐색 참고16시드'], fullRows)}

두 집합의 환경 시드는 독립이므로 이 표를 같은 시드의 쌍 효과라고 부르지 않는다. 각 빌드별 비율 구간은80개 환경 시드의 Wilson95%다. 같은 환경의 여러 빌드를 합친 전체 비율은 군집 결과로 해석한다. 초반에 죽은 런은 후반 보상을 얻지 못하며 그대로 실패다. 현행의 상처 구성은 v7 제작 빌드가 아니라 기존 보상으로 상처/열상/후퇴/충격을 우선 고른 적응 구성이다. 생산 보상에 없는 여섯 v7 빌드가 이미 생산 게임에 존재한다고 주장하지 않는다.

기본 구성은 표준탄·초탄·연계탄을 주로 사용하고 실제 시작 평두탄2발도 허용한다. 순수3탄종 비교는 raw와 cells의 pure에 따로 있다. 초탄은 제작 대상이 아니며 연계탄은 실제 획득했을 때만 강화한다. 모든 전략은 같은 보상 제시/가격/상한을 받는다. 선택 때문에 소유량이 달라지는 것은 실제 진행의 일부이며 무료 완성 재고로 맞추지 않는다. 현행 상인에서는 목표와 맞는3발 묶음을 실제 특수탄1발을 영구 지불해 한 번 구매한다. 사건 위험 보상은 생략한 고정 경로다.

기초 정책은 준비/마무리의 고정 순서를 쓰며 숙련은 현재 적·예고·재고·등급·부착물과 짧은 기본탄 생존 예측만 쓴다. 미래 보상/적/시드는 정책에 전달하지 않는다. 제한 탐색은128개 구성과 순서 탐색의 참고값이며 **전역 최적 상한은 NOT VERIFIED**다. 승률이 높다는 사실만으로 재미나 적절한 난이도를 입증하지 않는다.

## 6. 후반 소비·발동·유효 피해

${table(['v7 구성', '단일 조우 승률', '승리 탄수', '승리 턴수', '적 행동기회', '특수탄', '조합 발동 조우', '피해 활용률', '과잉 피해 합', '한 턴 부족 사망'], usage)}

적 행동기회에는 중단된 행동도 포함한다. 실제 실행 수는 원자료 actions−interruptions다. 한 턴 부족 사망은 죽은 시점의 남은 HP를 다음 기본탄 탄창으로 마무리할 수 있었는지 확인한 반사실 지표다. 실제로 부활시키거나 공격을 약화하지 않았다. 피해 활용률은 유효 피해/실제 발사한 탄의 HP 절단 전 피해다. 적 처치 뒤 남은 탄은 발사/소모/과잉 피해에 넣지 않는다. 기본 구성도 발전 구성과 같은 턴·탄수로 이긴 셀 ${equality.length}개를 basic-equality-examples.json에 공개한다. 이들은 독립 사례 수가 아니다.

## 7. 반복과 남은 한계

${table(['안', '현행 기본 완주', '현행 적응 완주', 'v7 기본', '상처', '열', '폭약', '반동', '소작', '공명'], iterations)}

hp1은 처음으로 후반 기본탄을 억제했지만 마지막 두 위협의 HP를 함께 높여 재료 소진 뒤 발전 빌드도 붕괴했다. hp2는 큰 HP로 진행을 억지로 막았고 처치 턴이 길어져 폐기했다. hp3/4는 즉사 창과 후속 경비의 남은 재료를 분리했다. hp5는 상대적으로 약한 일반 적을 유지하고 주 경비의 내구도만 높이는 절충안이다. 표는 동일 최종 관측 정책으로 탐색 시드를 재실행한 값이다. 초기 측정의 수집 구간·상인 생략·정책 미비를 보완한 이력은 Git 체크포인트 ebae61e에 남긴다. 홀드아웃 이후에는 HP/정책을 튜닝하지 않았다.

판정: 초반 안전 경로 ${goals.earlySafety}, 중반 기본35~65% ${goals.basicMiddle35to65}, 후반 기본30% 미만 ${goals.basicLateBelow30}, 여섯 발전 경로의 최소60% ${goals.minimumSixProgression60}, 여섯 빌드 모두60~85% ${goals.allSixLate60to85}. 범위를 느슨하게 바꾸어 통과 처리하지 않는다. 공명과 폭약은 여전히 높은 생존/경제 이점을 보이고 현행 중반은 기본탄으로도 안전한 시간이 길다. 모든 목표를 강제하는 HP는 약한 빌드의 필패 또는 지루한 반복 사격을 만들었다. **시험한 진행·재고·샘플에서 HP만으로 모든 목표를 동시에 충족하지 못했다.** 이것을 해결하려고 탄약/보상/AI/공격을 변경하지 않았다.

다음 결정은 중반의 긴 안전 사격 창과 v7의 큰 제어/화력 격차를 어떤 설계 축으로 다룰지다. 이는 이번 HP 단독 작업 밖의 변경이므로 자동으로 진행하지 않는다. 실제 생산의 v7 전체 이식, 모든 권총의 전체 런 균형, 인간의 재미 평가는 NOT VERIFIED다.

## 8. 실행과 Git 상태

독립 홀드아웃은5810001~5810080, 탐색은5110001~5110080이다. 최종 단일 조우 관측 ${result.observations}건, 순차 런 ${afterRuns.length}개를 기록했다. 제한 탐색은 각집합 첫16환경 시드만 참고한다. JSON/gzip/CSV/지문/레지스트리/로그는 tools/hp-balance/results/에 있다. 구현 지문은 ${result.hash}이며 같은 구간의 정확한 재현 외에는 검증 시드 재사용을 거부한다.

기능 검사는 package.json과 동일한 테스트·린트·타입·빌드·탄약 명세 검사, 기존 v7 독립20개, 새 계약 검사5개로 실행한다. 이 호스트에는 npm 실행 파일이 없어 동일 Node 진입점을 직접 실행했다. 실제 브라우저 실행 결과는 results/browser/results.json의 PASS 증거를 확인한다. 자연 획득 현행2회와 v7 여섯 빌드×두 화면12회, HP 표기·발별 피해·구간 전환·승패·재시작을 직접 입력으로 검사한다. 첫 자동 입력의 스폰 대기 누락은 시험 도구만 수정했고 harness-initial-failure.json으로 보존했다.

최종 로컬 결과는59개 파일·882개 테스트, 린트·타입·빌드·탄약 명세·기존 v7 20개·신규 계약5개 모두 통과다. 실제 Chrome156에서188개 사격 순서·680발을 비교했고 브라우저 오류는0건이었다. PC와 세로 화면의108/108 및57/57 HP 표기와 컨테이너 경계를 캡처로 확인했다. 전체 권총의 자연 진행 균형을 검사한 것은 아니며 P220 자연 진행과4권총의 유한 재고 기능 검사를 구별한다.

브랜치 balance/enemy-hp-progression은 최신화한 develop에서 만들었다. main/release는 변경하지 않는다. 남은 균형 수락 기준 때문에 PR은 draft로 보존하고 develop 병합·Pages 배포는 보류한다. 기존 v7 탄약 정의/평가 결과와 PR #77을 덮어쓰지 않는다. 재현 명령과 정확한 다음 작업은 tools/hp-balance/README.md 및 PR의 Codex Handoff에 기록한다.
`);
await write('tools/hp-balance/README.md', `# HP 단독 재균형

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
`);
console.log('HP 비교 보고서·재현 안내·CSV·수락 판정 갱신');
