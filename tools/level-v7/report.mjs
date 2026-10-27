import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, production } from './runtime.mjs';
import { BUILD_NAMES, PACKS } from '../../experiments/level-v7/design.mjs';
const read = async name => JSON.parse(await readFile(new URL(`experiments/level-v7/results/${name}`, root)));
const p = await production(), exp = await read('candidate-6-exploratory-summary.json'), hold = await read('candidate-6-holdout-summary.json');
const old = await read('candidate-4-exploratory-summary.json');
const baseline = await read('production-baseline.json');
const raw = JSON.parse(gunzipSync(await readFile(new URL('experiments/level-v7/results/candidate-6-holdout-raw.json.gz', root))));
const pct = value => value == null ? '—' : `${(value * 100).toFixed(1)}%`, num = value => value.toFixed(2);
const builds = Object.keys(BUILD_NAMES), strategies = ['random', 'damage', 'heuristic', 'competent', 'optimized'];
const strategyNames = { random: '무작위', damage: '직접 화력', heuristic: '기초 휴리스틱', competent: '관측 숙련', optimized: '제한 탐색' };
const cell = (summary, strategy) => summary.cells[`nine-linked/${strategy}`];
const buildCell = (summary, build) => summary.byBuild[`nine-linked/competent/${build}`];
const ammoName = id => id === 'resonance' ? '공명기폭탄' : p.AMMO_DEFINITIONS[id]?.name ?? (id === 'cauterize' ? '소작탄' : BUILD_NAMES[id] ?? id);
const write = (name, content) => writeFile(new URL(name, root), content.trim() + '\n');
const table = (head, rows) => `| ${head.join(' | ')} |\n|${head.map(() => '---').join('|')}|\n${rows.map(row => `| ${row.join(' | ')} |`).join('\n')}`;
const winTable = table(['정책', '탐색 완주', '독립 홀드아웃 완주', '홀드아웃 95% 시드 구간', '평균 턴/런', '총탄/특수탄'], strategies.map(strategy => {
  const c = cell(hold, strategy); return [strategyNames[strategy], pct(cell(exp, strategy).completion.rate), `${c.completion.yes}/${c.completion.n} · ${pct(c.completion.rate)}`,
    c.completion.ci95.map(pct).join('–'), num(c.turnsPerRun), `${num(c.roundsPerRun)}/${num(c.specialPerRun)}`];
}));
const buildTable = table(['빌드', '완주', '엄격한 조합 기회', '실제 의미 있는 사용', '발사 탄 피해 활용', '특수탄/런'], builds.map(id => {
  const c = buildCell(hold, id); return [BUILD_NAMES[id], pct(c.completion.rate), `${c.opportunities.yes}/${c.opportunities.n} · ${pct(c.opportunities.rate)}`,
    pct(c.actualMeaningful.rate), pct(c.utilization), num(c.specialPerRun)];
}));
const roleTable = table(['역할', '조우 수', '탄창 수/조우', '유효/발사 잠재 피해', '활용률', '사망'], ['regular', 'dangerous', 'elite', 'boss'].map(role => {
  const row = hold.byRole[`nine-linked/competent/${role}`];
  return [{ regular: '일반', dangerous: '위험', elite: '엘리트', boss: '주 경비' }[role], row.enemies, num(row.volleys / row.enemies), `${row.effective}/${row.potential}`, pct(row.effective / row.potential), row.deaths];
}));
const criteria = table(['기준', '탐색', '새 홀드아웃', '해석'], [
  ['A 조합 기회', exp.gates.A.status, hold.gates.A.status, '숙련의 각 빌드별 후반 실제 도달 런. 표준탄만으로 안전하게 이기는 전투 전부 제외'],
  ['B 중반 방향 획득', exp.gates.B.status, hold.gates.B.status, '사망 포함 전체 런. 2노드 발견 + 3노드 승리 연결 보상'],
  ['C 4주축·2혼합 생존', exp.gates.C.status, hold.gates.C.status, '동일 예산/적 테이프, 각 빌드 숙련 완주율이 최고 빌드의 75% 이상'],
  ['D 순서 25%/60%', exp.gates.D.status, hold.gates.D.status, `적격 ${hold.order['nine-linked'].n}개 중 ${hold.order['nine-linked'].yes}개. 반동은 개별 순서 기준 미달`],
  ['E 난이도 목표', exp.gates.E.status, hold.gates.E.status, '숙련 상한85% 초과. 초보/숙련 격차도 큼. 목표 완화하지 않음'],
  ['F 피해 활용·위협 기회', exp.gates.F.status, hold.gates.F.status, '기본 적 보존. 조합이 필요한 실제 위협의 기회와 역할별 활용을 함께 확인'],
  ['G 실게임 일치', 'FAIL', 'FAIL', '공유 제어 규칙/현행 E2E는 통과. v7은 생산 게임 미이식이며 4m 부동소수점 경계 불일치 발견'],
  ['재미·조합 이해·다른 무기 전체 런', 'NOT VERIFIED', 'NOT VERIFIED', '자동화로 재미를 입증하지 않음. 본 균형 표본은 P220만 포함'],
]);
const deathRows = Object.entries(cell(hold, 'competent').deaths).sort((a, b) => b[1] - a[1]);
const rewardCounts = new Map();
for (const r of raw.filter(r => r.strategy === 'competent')) for (const event of r.rewards) {
  const key = `${event.kind}:${event.chosen}`;
  const count = rewardCounts.get(key) ?? { chosen: 0, rejected: 0 }; count.chosen++; rewardCounts.set(key, count);
  for (const id of event.rejected) { const key = `${event.kind}:${id}`, count = rewardCounts.get(key) ?? { chosen: 0, rejected: 0 }; count.rejected++; rewardCounts.set(key, count); }
}
const rewards = [...rewardCounts].map(([key, count]) => ({ key, ...count })).sort((a, b) => b.chosen - a.chosen);
await writeFile(new URL('experiments/level-v7/results/reward-decisions.json', root), JSON.stringify(rewards, null, 2));
const csv = ['seed,archetype,strategy,depth,wave,enemy,turn,rounds,special,effective,potential,unused,meaningful,died'];
for (const run of raw) for (const row of run.logs) csv.push([run.seed, run.actualBuild, run.strategy, row.depth, row.wave, row.enemy, row.turn, row.fired.length, row.special, row.effective, row.potential, row.unused, row.meaningful, row.died].join(','));
await writeFile(new URL('experiments/level-v7/results/holdout-combat.csv', root), csv.join('\n'));

await write('level_design_v7.md', `# v7 레벨 설계 · 검토 후보6

최종 후보는 **9노드 유지, 초반 연결 보급, 제작2회, 마지막3연속 적의 탄약 공유**다. 현재 실게임을 교체하지 않는 별도 플레이 페이지다. A/B/C/D/F는 새 독립 검증 통과, E/G는 실패다. 전부 통과한 출시 후보로 제출하지 않는다.

## 실제 구현 감사

기준 develop은 85e6d22. 현행 탐험은 9노드, 전투4~5회이며 9번째는 출구다. v7의18전투와 제작권은 시뮬레이터 전용이다. P220 자연 탄창4~6발, 8발은 획득 불가능한 스트레스 시험이다. 원래 적은 **20~54HP**이며 질주 감염체가20HP라서 요청문의 약22~54보다 낮다. 탐험 보상 풀에는 열·폭약·복사·공명 등이 없고 기존 제작도 없다. 특수탄은 조우 안에서만 소모되고 다음 조우에서 배분이 복구된다. 영구 거래 지불은 복구되지 않는다.

## 노드와 의도

${table(['노드', '배치·보상', '역할'], [
  [1, '일반 감염체22HP·8m / 3택1 한 발', '기본 조작, 표준탄 경제와 시작 제어탄'],
  [2, '여섯 빌드 상자 중 하나 / 준비 재료2발', '미래 무작위 보상 없이 방향 발견'],
  [3, '강인/질주·5 또는6m / 한 발 + 선택 상자의 완성 재료1발', '직접 화력·충격·초기 연결'],
  [4, '제작1회 / 두 부착물 중 하나를 특수탄1발 영구 지불로 교환', '보유 핵심 탄종과 호환 슬롯 선택'],
  [5, '거대/오염 투척체·6 또는8m / 한 발', '거리, 열 억제, 부착물 봉쇄'],
  [6, '질주/지반/비명체·3.2m / 한 발', '늦은 준비와 반동 누적의 위험'],
  [7, '제작1회 + 보유 탄종1발 추가 배분 / 부착물 영구 교환', '마지막 연속 조우에 필요한 유한 재료 보강'],
  [8, '일반22HP·6m → 원래 특수 적46/50/54HP·3.5m(시드25%는0.5m) → 지반54HP·3.5m', '약한 적 절약 → 주 조합 → 남은 자원으로 두 번째 위협'],
  [9, '출구', '승리·재시작'],
])}

시드25%는 확률 규칙이며 80개 표본에서 정확히20회가 되도록 결과를 조작하지 않는다. 후반은6노드부터다. 8노드 적 사이에는 특수탄과 플레이어 방해 상태를 복구하지 않는다. 반동은 원래처럼 새 탄창마다 초기화한다. 각 적 HP/속도/저항/행동을 바꾸지 않았다. 탄약 계수와 제작 등급0~3 계약도 원본 v7 그대로다. 자연 진행에서는 제작2회뿐이므로 전체 강화 예산도2다.

## 보상 계약

${table(['빌드', '발견2발 → 3노드 승리 연결1발'], builds.map(id => [BUILD_NAMES[id], PACKS[id].map(ammoName).join(' → ')]))}

승리마다 별도의 무작위3택1·1발을 받는다. 후보6은7노드에서 보유 탄종 하나의 배분만1 늘릴 수 있다. 무료 복제 무한 반복이나 전투 중 보급은 없고 한도14를 유지한다. 부착물은 실제 생성기의 호환 추첨을 사용하며 미소유 두 후보 중 하나, 슬롯 하나에 하나만 장착한다. 재고·등급·탄창·적 예고를 읽는 숙련 정책은 현재 적을 기본탄만으로2턴 안에 안전하게 이길 수 있으면 특수탄을 보존한다.

## 역할과 남은 문제

일반 적은 절약과 원하는 경우 빠른 제압, 위험 적은 즉시 피해/제어, 엘리트는 준비와 방해 상태, 마지막3연속 조우는 유한 자원 배분을 시험한다. HP를 키워 수백 잠재 피해를 억지로 모두 사용시키지 않는다. 소작은 준비 슬롯이 많고, 반동은 회복 부착물로 회수량이 줄며, 폭발은 설치와 충격이 따로 필요하다. 공명은 제어 자원을 피해에 쓰므로 연속 적의 후속 공격 방어와 충돌한다.

후보6의 숙련 완주가 ${pct(cell(hold, 'competent').completion.rate)}로 목표 상한을 넘고 무작위는 ${pct(cell(hold, 'random').completion.rate)}다. 이 격차를 좋은 난이도의 증거로 포장하지 않는다. 즉사 규칙과 큰 조합 피해 사이의 급격한 학습 곡선은 레벨 변경만으로 충분히 해결되지 않았다.

프로토타입은 **선형 경로**다. 기존 갈림길·인지·우회·지도·다양한 사건을 모두 이식한 버전이 아니다. 실제 도입은 기존9노드의2/4/7 보급 지점과8노드 연속 적에 연결하는 별도 작업이 필요하다. 우회·보상 포기 경로에서 같은 획득률이 유지되는지는 NOT VERIFIED다. 모델·애니메이션·원본 전투 소스는 수정하지 않았다.
`);

const comparisonRows = [
  ['현행 실게임9노드', pct(baseline.summary.competent.winRate), '미구현', num(baseline.summary.competent.turnsPerRun), '현재46종 규칙 / 왼쪽 경로·사건/상인 생략 대조'],
  ...Object.entries({ 'nine-original-pacing': 'v7+현재9노드 보상 경로', 'nine-linked': '9노드 후보4', 'twelve-linked': '12노드 확장', 'eighteen-v7': '기존18전투 제안' }).map(([id, label]) => {
    const c = old.cells[id + '/competent']; return [label, pct(c.completion.rate), pct(c.coherent.rate), num(c.turnsPerRun), `${pct(c.utilization)} 피해 활용`];
  }),
  ['최종9노드 후보6', pct(cell(hold, 'competent').completion.rate), pct(cell(hold, 'competent').coherent.rate), num(cell(hold, 'competent').turnsPerRun), '별도 정책·추가 배분·마지막3연속 적, 새 홀드아웃'],
];
await write('progression_comparison.md', `# 진행 구조 비교

**9노드를 유지하고 보급·마지막 조우를 연결하는 안을 우선 권고한다.** 현재의 적은 HP20~54이고 기존 v7 후반 잠재 피해 중앙값은147~157로 이미 과하다. 전투 수나 HP를 늘리는 것만으로 조합 기회를 만들 수 없다.

${table(['구조', '숙련 완주', '중반 방향', '평균 턴/런', '범위·활용'], comparisonRows)}

구조4종 비교는 같은 탐색80시드·6빌드·5정책, 후보4/당시 정책에 대한9600개 순차 런이다. 현행 대조는 별도 원래 Player/CombatResolver의80시드·5정책400런이다. 최종 후보6은 자원 보존 정책과 보급·3연속 적도 바뀌었으므로 길이만의 효과로 해석하면 안 된다. 각각의 원자료와 지문은 results/와 Git 체크포인트 e45b24f에 보존한다.

9노드 원래 보상 경로에는 제작과 대부분의 조합 재료가 없어 v7 탄약만 얹어도 방향 획득이 ${pct(old.cells['nine-original-pacing/competent'].coherent.rate)}에 머문다. 이 대조는 현재 경로의 왼쪽을 고정하고 사건·상인 거래를 생략했으며 v7에서 제외된 탄약 보상은 선택할 수 없다. 현행 게임 전체의 최적 경로 성공률이라는 주장은 하지 않는다.

12노드 안은 일반 적1회·추가 보급·엘리트1회를 넣는다. 보급 증가로 완주율이 오르며 전투가 더 길어졌다는 사실 자체가 긴장감을 보장하지 않았다. 18전투는 원래 제작5회와 훨씬 많은 배분/부착물을 주어 피해 활용이 낮아진다. 약한 적을 삭제하면 활용률 숫자는 올라가지만 성장 확인과 절약 역할도 사라지므로 채택하지 않았다.

9노드 권고는 생산 탐험을 이미 변경했다는 뜻이 아니다. 후보의 단일 경로를 기존 두 갈림길, 우회, 사건 비용, 퀘스트성 도구와 통합하는 것은 남아 있다. 12/18안은 수치 시뮬레이션이며 실제 브라우저 캠페인으로 구현·플레이하지 않았다. 이 긴 구조의 재미와 실제 플레이 시간은 NOT VERIFIED다.
`);

await write('gameplay_validation_report.md', `# 게임플레이 검증 보고서

최종 후보6의 자동 판정은 **A/B/C/D/F PASS, E/G FAIL**이다. 전체 자동 기준 통과나 재미 입증을 주장하지 않는다.

## 범위와 독립성

기준 생산 리비전85e6d22. 최종 후보 탐색21001~21080의2400런과 새 홀드아웃3730001~3730080의2400런을 실행했다. 같은 시드의6빌드·5정책은 독립 표본으로 세지 않는다. 완주 구간은 시드 묶음400회 bootstrap, 개별 빌드의80시드는 Wilson95%를 사용한다. 사망 후 미래 보상을 부여하지 않는다.

1730001~1730080은 v1의 안전한 기본탄2턴 처치를 기회로 세는 과대 측정 때문에 보존 후 폐기했다. 2730001~2730080은 엄격한 정의의 후보4 검증 후 후속 자원/정책 수정에 노출된 자료다. 최종 후보에는 새3730001부터 사용했다. 기준 수치나 적 능력은 낮추지 않았다. protocol-v1.json, protocol-v1.1.json, 현재 protocol.json과 레지스트리가 이력을 보존한다.

${criteria}

## 정책별 결과

${winTable}

무작위는 탄창·보상·제작·부착물·영구 지불을 무작위로 고른다. 발견 상자로 실제 선택한 빌드를 actualBuild에 기록한다. 같은 환경 시드의 반복 무작위 궤적은 상관되므로480개의 독립 무작위 환경으로 부풀리지 않는다. 기초 휴리스틱은 정해진 우선순위와 순서만 사용한다. 숙련은 현재 보이는 재고/적/예고/등급/부착물과 최대12개 구성·안전한 기본탄2턴 예측만 사용한다. 시드·미래 적·미래 보상은 전달하지 않는다.

제한 탐색은128개 구성과 순서 교환을 조사한다. 미래 적을 모르는 국소 탐색이므로 수학적인 전체 런 최적 상한은 아니다. 숙련보다 낮은 완주가 나타나는 것은 과도한 즉시 처치/피해 가치와 다음 적에 남길 탄약 평가의 한계다. **진정한 전역 최적 상한은 NOT VERIFIED**이며 이 정책의 높은 승률만으로 균형을 입증하지 않는다.

숙련 실패 위치: ${deathRows.map(([key, n]) => key + ' ' + n + '회').join(', ')}. 전체 정책의 사망 위치/적/행동, 매 턴 탄수·특수탄 소모는 압축 원자료와 holdout-combat.csv에 모두 남겼다.

## 실제 브라우저 실행

- 현행 Game: 실제 입력 탐험2회(1440×900,390×844), 전투·보상·거래·사건·승리·실패·재시작 및44개 화면 경계 검증.
- 현행 Game 추가: 두 화면에서 계산/반동/거리/상태/적 행동/소모/부착물/조기 사망의9개씩, 총18개 입력 시나리오. 실제 player.fireRound의 발별 결과를 원래 계산기와 대조했다.
- 후보6: 같은 탐색 시드로6빌드×2화면의 자연 획득·제작·추가 배분·마지막 연속 적·탈출을 실제 DOM 클릭과 원래 Three.js 장전/사격 연출로 실행한다. 각 샷 결과를 Node v7 모델과 대조한다.
- 좋은/나쁜 순서, 특수탄 고갈, 후퇴·충격 생존,6발 긴 이름·뒤5발 미발사도 두 화면에서 별도 fixture로 검사한다. 이 fixture를 자연 런 성공률에 합산하지 않는다.

스크린샷은 results/browser/와 results/production-browser/, 상태 trace와 오류는 같은 디렉터리에 있다. 빈/가득 찬 탄창, 탄 그림·제목·수치의 기준선, 긴 이름, 예측 처치 뒤 미발사, 제작/보상 선택 화면을 직접 확인했다. 세로 화면은 재고가 길면 페이지를 스크롤한다. BUILD LOCAL을 유지하며 일반 플레이에는 검증 참조와 presentationDebug 진단을 노출하지 않는다.

## 생산 일치와 한계

브라우저 이식 모델은 원본 model.mjs의 가져오기 경로만 변경한 생성본이며168개 교차 구성에서 완전히 같다. 현행과 공유한다고 명시한 화력/거리/이동/부착물 제어84개도 일치한다. 원래 v7 검사20개와 실험 불변조건7개를 통과했다. 일반 테스트/린트/타입 검사/빌드/탄약 명세 검사 로그는 results/checks/에 저장한다. 이 호스트에 npm 실행 파일이 없어 package.json의 동일 Node 진입점을 직접 실행했다.

G는 FAIL이다. 원래 게임에는 소작과 v7의 열 저장/소비·기폭 계수·제작·공명 계약이 없다. 또한 거리3.999999999999m에서 기본탄 피해는 v7=5, 실게임=4다. 실게임은 거리 비교를1e-9로 정규화하지만 v7은 원시 부동소수점으로 비교한다. 원본을 몰래 수정하지 않았으며 consistency.json에 재현을 남겼다. Pages는 사용자 제한에 따라 배포하지 않았고 NOT VERIFIED다. 모든 자동 기준을 통과한 정식 인간 플레이 검토 단계에는 아직 도달하지 않았다.
`);

await write('build_usage_report.md', `# 빌드 사용과 피해 활용

아래는 최종 후보6, 새 홀드아웃80환경 시드, P220, 관측 숙련 정책이다. 모든 빌드는 같은 배분/제작/부착물 기회와 같은 적 분포를 받는다. 완성 재고를 무료로 미리 지급한 표가 아니다.

${buildTable}

조합 기회는 보유 재고에서 제한된 구성들을 조사한 보수적 하한이다. 실제 조합이 발동하고 해당 엔진만 제거한 같은 탄창보다 승리/턴수가 좋아져야 한다. **표준탄만으로 전체 전투를 안전하게 이기는 경우는 제외**한다. 발동 자체와 실제 의미 있는 사용은 구별하며 죽은 런에 미래 보상을 부여하지 않는다. 기회는 가능한 구성, 실제 사용은 정책이 선택한 구성이다.

${roleTable}

발사 잠재 피해는 실제 발사한 탄의 HP 절단 전 피해다. 활용률=유효 피해/발사 잠재 피해이며 초과 피해는 두 값의 차이다. 적 사망 뒤 미발사된 탄은 소모/과잉 피해에 넣지 않는다. 전체 계획 탄창의 HP무한 표적 피해를 분모로 한 plannedUtilization도 원자료에 따로 있다. 일반 적을 없애 활용률만 높이지 않는다.

## 강점과 취약점

- 상처: 낮은 직접 피해를 내고 임계치를 만든 뒤 열상·취약을 회수한다. 앞쪽 순서가 틀리면 준비 슬롯이 낭비된다.
- 열: 저장·촉진·소비가 큰 짧은 폭발력을 준다. 열을 먼저 소비하면 후속 점화 억제와 두 번째 적의 소비탄이 부족해진다.
- 폭발: 설치 뒤 충격으로 거리와 무관하게 회수한다. 많은 부착물에 덜 의존하지만 제어탄을 기폭에 써야 한다.
- 반동: 고압의 비용을 반동탄으로 회수한다. 반동 회복 부착물과 상충하며 직접 강화 고압만으로 충분하면 회수 엔진은 무의미해진다. 추가 배분과 일반 적 탄약 절약이 이를 개선했다.
- 소작: 상처·열·소비의 세 재료가 필요해 긴 연속 조우에서 조립 비용이 높다. 준비 슬롯을 빼면 열상/단순 점화 운용으로 전환해야 한다.
- 공명: 충격을 피해에 투자해 짧은 마무리가 강하다. 사용 후 남은 적을 제어할 충격은 사라진다.

순서 벤치마크는 ${hold.order['nine-linked'].yes}/${hold.order['nine-linked'].n}=${pct(hold.order['nine-linked'].rate)}가 최적 순서에서 무작위 중앙 순서보다25% 이상 높았다. 제외 수는 ${hold.order['nine-linked'].excluded}다. 반동 개별 통과율은 ${pct(hold.order['nine-linked'].byBuild.recoil.rate)}로 낮다. 전체 통과를 여섯 빌드 각각의 순서 민감도 통과로 오해하면 안 된다. 이 탄약 수준 문제는 별도 설계 검토가 필요하며 원본 탄약을 바꾸지 않았다.

## 보상 선택

${table(['보상', '선택', '거절'], rewards.slice(0, 16).map(r => [r.key.split(':')[0] + ' · ' + ammoName(r.key.split(':')[1]), r.chosen, r.rejected]))}

전체 선택·거절은 reward-decisions.json에 있다. 발견 상자는 목표 빌드의 재료를 보장한다. 숙련 정책은 고정 우선순위를 사용하므로 그 선택 빈도를 인간 선호나 보편 최적 증거로 해석하지 않는다. 중반 이후 빌드 밖 단독 재료와 이미 충분한 준비탄은 자주 거절된다. 기본탄 무한/조우 재보급 구조에서 런 전체 탄약 소모량은 영구 배분 지불과 다른 지표다.

E는 FAIL: 자동 숙련이 너무 잘 풀고 무작위는 너무 자주 죽는다. 긴장감/피로감, 어느 빌드가 더 재미있는지와 다른 무기 전체 런은 NOT VERIFIED다.
`);

await write('playtest_scenarios.md', `# 재현 가능한 플레이 시나리오

Node22 이상에서 npm ci, npm run dev -- --host 127.0.0.1 후 아래 페이지를 연다. 생산 게임은 루트, 후보는 /Zombie-Shot/experiments/level-v7/ 이다. 정상 후보에는 validation=1을 붙이지 않아도 플레이할 수 있다.

## 자연 획득 런

results/browser/results.json의 commonSeed를 사용한다. 1440×900과390×844에서 여섯 빌드를 각각 고른다. 첫 전투는 실제 시작3발과 무제한 기본탄으로 해결한다. 2노드에서 상자를 선택하고3노드 승리 뒤 연결 재료를 받는다. 4·7노드에서 보유 핵심 탄약을 한 번씩 강화하고,7노드에서 한 종류를1발 추가 배분한다. 8노드의3연속 적 사이에서 재보급되지 않는지 확인한다.

${table(['빌드', '대표 순서'], builds.map(id => [BUILD_NAMES[id], PACKS[id].map(ammoName).join(' → ')]))}

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
`);

await write('human_playtest_checklist.md', `# 최종 인간 플레이 검토 목록

현재 E/G가 FAIL이므로 정식 최종 검토 승인은 보류 상태다. 자동 검증이 맡아야 할 수치·구현 문제는 별도 보고서에 남겼다. 아래는 그 문제가 해결된 뒤 인간만 평가할 주관적 질문이다.

- 사격과 장전이 손에 맞고 타격이 만족스러운가?
- 상처·열·폭약·반동의 준비와 회수를 화면만 보고 이해할 수 있는가?
- 완성한 조합이 강해졌다는 느낌을 주는가?
- 마지막 연속 조우가 지루한 소모전보다 긴장감으로 느껴지는가?
- 제작·추가 배분·부착물 교환에서 두 선택 사이에 실제로 고민하는가?
- 실패 뒤 다른 빌드로 다시 해보고 싶은가?

자동 통과를 재미의 객관적 증명으로 간주하지 않는다.
`);

const history = [];
for (const id of [1, 2, 3, 4, 5, 6, 7]) {
  const s = await read(`candidate-${id}-exploratory-summary.json`);
  history.push([id, pct(cell(s, 'competent').completion.rate), pct(cell(s, 'optimized').completion.rate), Object.entries(s.gates).filter(([, gate]) => gate.status === 'FAIL').map(([id]) => id).join('·')]);
}
const iterationSection = `## 레벨 v7 후속 실험 · 2026-10-27

앞의 탄약 v1~v7 기록과 simulation/results 원본은 보존한다. 레벨 평가 규약은 c5d66e6에서 구현 전에 동결했다. 후보 원형은 b4aa5ad, 엄격한 기본탄 반사실과 후보4 실패 보존은 e45b24f다.

${table(['후보', '숙련 완주', '제한 탐색 완주', '실패 기준'], history)}

1은9노드 연결 보급과 두 적 경비였다. 2는 거대 감염체를 더했지만 기본탄2턴 처치가 가능해 압박 변화가 거의 없었다. 3은 주 경비를 항상 근접 배치해 빌드 다양성을 해쳤다. 4는 일부 근접 배치를 섞었지만 안전한 기본탄2턴 처치를 조합 기회로 세던 측정 문제를 발견했다. 엄격히 다시 검증하자 반동 기회가53.8%로 실패했다.

5는 관측 정보만으로 안전한 기본탄2턴 처치를 골라 자원을 아끼게 하고 마지막 작업대에 유한 추가 배분1발을 넣었다. 조합 기회는 개선됐지만 숙련99.4%로 너무 쉬웠다. 6은 일반 경비 뒤 두 번의 원래 특수 위협을 재보급 없이 두어 자원 압박을 복구했다. 7은 세 번째 적에도 일부 즉시 근접을 넣었으나 소작의 상대 생존이73.8%로 다양성 기준을 깼다. 더 높은 사망률만 만들기보다6을 보존했다.

최종 후보6의 독립3730001~3730080은 A/B/C/D/F PASS, E/G FAIL이다. 후보나 기준을 바꿔 이 결과를 통과로 덮지 않는다. 자동 숙련95.4%/무작위13.8%의 격차, 제한 탐색이 숙련보다 낮은 국소 정책 한계, 실게임 미이식과4m 수치 경계 차이가 남았다. 원래 탄약 계수/적 HP/모델/애니메이션/일반 게임은 수정하지 않았다.

측정/도구 수정: 무작위 상자 선택 후 실제 빌드를 기록하도록 고쳤고 목표 빌드와 실제 빌드를 분리했다. 브라우저 사격 후 버튼 잠금과 빈 슬롯 정렬을 수정했다. 지문은 esbuild의 실제 실험·생산 의존 그래프까지 확장하고 기존 구간 중첩 검사를 재사용했다. 최초 지문과 보강 지문의 동일 수치 재현은 레지스트리/보존 결과에 남겼다. npm이 없는 호스트에서 동일 Node 진입점으로 검사했으며 패키지/워크플로는 바꾸지 않았다.

다음 작업: 이 실험 PR의 head에서 시작한다. AGENTS.md, 이 기록, 검증 보고서, 최근 커밋과 develop 대비 diff를 읽는다. E/G를 통과로 주장하지 말고 기존 실게임의9노드 갈림길·우회까지 포함한 이식 계약과 경계 계산 문제를 별도 결정한다. 새 후보 변경 시 이미 노출된 세 홀드아웃 구간을 재사용하지 않는다. 자동 병합·Pages 배포는 이 요청에서 금지됐다.
`;
const logURL = new URL('iteration_log.md', root), existing = await readFile(logURL, 'utf8');
await writeFile(logURL, existing.split('## 레벨 v7 후속 실험 · 2026-10-27')[0].trimEnd() + '\n\n' + iterationSection);
console.log('레벨 설계·비교·검증·사용·시나리오·인간 검토·반복 기록 7개 갱신');
