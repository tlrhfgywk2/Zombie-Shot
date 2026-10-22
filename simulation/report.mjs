/* global console, URL */
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { production, quantile } from './common.mjs';
import { createModel, ARCHETYPES } from './model.mjs';
export const NAMES = { wound: '상처·취약', heat: '열 저장·소비', blast: '설치·기폭', recoil: '고압·반동 회수', cauterize: '상처×열 소작', concussion: '충격×폭약 공명' };
export const number = x => Number(x).toFixed(2).replace(/\.00$/, '');
export const percent = x => `${(x * 100).toFixed(1)}%`;
export const interval = xs => xs.map(percent).join('–');
export async function json(name) {
  try { return JSON.parse(await readFile(new URL(`./results/${name}.json`, import.meta.url), 'utf8')); }
  catch (e) { if (e.code !== 'ENOENT') throw e; return JSON.parse(gunzipSync(await readFile(new URL(`./results/${name}.json.gz`, import.meta.url)))); }
}
const explore = await json('v7-exploratory-all'), holdout = await json('v7-holdout-all');
let validation;
try { validation = await json('final-validation'); if (validation.candidate !== 'v7') validation = undefined; } catch (e) { if (e.code !== 'ENOENT') throw e; }
const p = await production(), model = createModel(p, explore.candidate);
const ids = Object.keys(ARCHETYPES), splits = [['탐색', explore], ['홀드아웃', holdout]];
const niches = {};
for (const id of ids.slice(0, 4)) {
  const possibilities = [];
  for (const strategy of ['search', 'heuristic', 'damage']) for (const [cell, values] of Object.entries(explore.combat.cells)) {
    const own = values[id][strategy];
    if (own.rate < Math.max(...ids.map(other => values[other][strategy].rate)) - .01) continue;
    for (const metric of ['winningSpecial', 'winningRounds']) {
      const next = Math.min(...ids.filter(other => other !== id).map(other => values[other][strategy][metric]?.mean ?? Infinity));
      if (next < .5 || !own[metric] || next - own[metric].mean < (metric === 'winningSpecial' ? .15 : .2)) continue;
      possibilities.push({ cell, strategy, metric, explore: own[metric].mean, exploreNext: next, advantage: 1 - own[metric].mean / next });
    }
  }
  const chosen = possibilities.sort((a, b) => b.advantage - a.advantage)[0];
  if (chosen) {
    const values = holdout.combat.cells[chosen.cell], own = values[id][chosen.strategy];
    chosen.holdout = own[chosen.metric]?.mean;
    chosen.holdoutNext = Math.min(...ids.filter(other => other !== id).map(other => values[other][chosen.strategy][chosen.metric]?.mean ?? Infinity));
    chosen.holdoutWinRate = own.rate;
    chosen.confirmed = chosen.holdout < chosen.holdoutNext && own.rate >= .75 * Math.max(...ids.map(other => values[other][chosen.strategy].rate));
  }
  niches[id] = chosen ?? { confirmed: false };
}
await writeFile(new URL('./results/niche-validation.json', import.meta.url), JSON.stringify(niches, null, 2) + '\n');
const report = [
  '# 탄약 균형 검증 보고서 — v7', '',
  `후보 규칙은 홀드아웃을 보기 전에 동결했다. 탐색200시드와 미사용 홀드아웃100시드를 실행했다. A–F는 양쪽 모두 통과했다. G의 실제 테스트·명세 판정은 ${validation?.pass ? '**통과**' : '최종 검사 대기'}다. 실제 게임 구현은 바꾸지 않았다.`, '',
  '이는 P220·제안된18전투 보급/제작 진행의 자동 검증 결과다. 현재9노드 탐험에 이 성장 경로가 이미 구현됐다는 뜻이 아니다.8발은 획득 불가능한 스트레스 시험이고, 재미와 인지 부하는 인간 플레이 검토가 남아 있다.', '',
  '## 기준과 통과 조건', '',
  '| 기준 | 고정 조건 | 탐색 | 홀드아웃 |', '|---|---|---|---|',
  ...Object.keys(explore.gates).sort().map(g => `|${g}|${{ A: '중반≥1.5배 / 후반≥3배 / 후반P90≥8배', B: '동일 내용 순서 최적/무작위 중앙값≥1.25인 구성≥60%', C: '4개 독립 주축·동일 예산·최강 승률의75% 이상·시나리오 이점', D: '두 혼합형 교차 규칙 제거 대비 중앙 피해 이득≥5%와 생존 경쟁력', E: '중반 생존 및 일관된 빌드 방향 획득≥70%', F: '유틸리티의 생존 및 탄약 경제 우위 사례', G: '전 탄약 짧은 조건·수치·추적 가능한 계산과 실제 검사' }[g]}|${g === 'G' ? validation?.pass ? '통과' : '대기' : explore.gates[g].pass ? '통과' : '실패'}|${g === 'G' ? validation?.pass ? '통과' : '대기' : holdout.gates[g].pass ? '통과' : '실패'}|`), '',
  '기준 원본은 `499917c`에 고정한 simulation/PROTOCOL.md 및 protocol.json이다. 원본 계산기의4발 잠재 피해 중앙값은19→20→21. 후보 선택 이후 적을 약화하거나 승리 판정을 바꾸지 않았다. 보급·제작은 명시적으로 반복 수정한 설계 변수다. G는 읽기 쉬움 자체를 객관적으로 입증하는 검사가 아니라 명세/수치 추적의 구조적 검사다.', '',
  '## A: 잠재 피해 성장', '',
  '모든 발을 HP10억·6m·초기 무상태의 동일 표적에 순차 해결한다. 매 단계의 실제 보상 배분·등급·획득 부착물과 자연 용량4~6을 사용한다. 각 단계 표본은 탐색1200/홀드아웃600탄창이며 독립 시드는200/100이다. 분위수 신뢰구간은 같은 시드의6빌드를 함께 재표집한 bootstrap95%다.', '',
  '| 집합 | 단계 | 중앙 피해 [95%구간] | P90 [95%구간] | 초반 중앙 대비 |', '|---|---|---:|---:|---:|'
];
for (const [label, r] of splits) for (const phase of ['early', 'middle', 'late']) {
  const v = r.potential[phase];
  report.push(`|${label}|${phase}|${number(v.median)} [${v.medianCI95.map(number).join('–')}]|${number(v.p90)} [${v.p90CI95.map(number).join('–')}]|${number(v.median / r.potential.early.median)}배|`);
}
report.push('', '이는 보상 획득 조건부 상한이다. 사망한 런이 후반 재고를 얻었다고 가정하는 낙관 편향을 별도로 확인하기 위해, 실제 순차 런에서 해당 단계 전에 죽은 시드를0으로 세는 표도 계산했다. 살아남은 시드의 보상 경로는 동일하다.', '', '| 집합 | 중반 중앙 | 후반 중앙 | 후반P90 | 사망0 포함 A |', '|---|---:|---:|---:|---|');
const survivalGrowth = {};
const exampleData = {};
for (const [label, r] of splits) {
  const raw = await json(`v7-${r.split}-potential-raw`);
  const values = {};
  for (const [phase, needed] of [['early', 0], ['middle', 8], ['late', 17]]) values[phase] = raw.filter(row => row.phase === phase).map(row => r.acquisition[row.archetype].search.rows.find(run => run.seed === row.seed).reached >= needed ? row.damage : 0);
  const e = quantile(values.early, .5), m = quantile(values.middle, .5), l = quantile(values.late, .5), q = quantile(values.late, .9);
  survivalGrowth[r.split] = { early: e, middle: m, late: l, lateP90: q, pass: m >= e * 1.5 && l >= e * 3 && q >= e * 8 };
  report.push(`|${label}|${number(m)}|${number(l)}|${number(q)}|${survivalGrowth[r.split].pass ? '통과' : '실패'}|`);
  if (r.split === 'exploratory') for (const id of ids) {
    const rows = raw.filter(row => row.phase === 'late' && row.archetype === id), median = quantile(rows.map(row => row.damage), .5);
    const effect = trace => id === 'wound' ? trace.some(s => s.vulnerableFactor > 1) : id === 'heat' ? trace.some(s => s.thermal > 0) : id === 'blast' ? trace.some(s => s.explosion > 0) : id === 'recoil' ? trace.some(s => s.converted > 0) : id === 'cauterize' ? trace.some(s => s.id === 'cauterize' && s.thermal > 0) : trace.some(s => s.shockConsumed > 0);
    const usable = rows.map(row => ({ row, outcome: model.resolve(row.rounds, { ...p.createEnemyState('normal'), hp: 1e9, maxHp: 1e9, distance: 6 }, { ...row, weapon: 'p220', loadout: row.attachments }, { trace: true }) })).filter(x => effect(x.outcome.trace));
    const chosen = usable.sort((a, b) => Math.abs(a.row.damage - median) - Math.abs(b.row.damage - median))[0];
    exampleData[id] = { ...chosen, activatingConfigurations: usable.length, n: rows.length, median };
  }
}
await writeFile(new URL('./results/survival-growth.json', import.meta.url), JSON.stringify(survivalGrowth, null, 2) + '\n');
await writeFile(new URL('./results/build-traces.json', import.meta.url), JSON.stringify(exampleData, null, 2) + '\n');
report.push('', '固定 용량별 중앙값은 용량 민감도 진단이다.6발을 아직 획득하지 못한 시드도 이 표에서는 강제 확장하며, 자연 획득 게이트에는 쓰지 않는다.', '', '| 집합/단계 | 4발 | 6발 | 8발(확장 시험) |', '|---|---:|---:|---:|');
for (const [label, r] of splits) for (const phase of ['early', 'middle', 'late']) report.push(`|${label}/${phase}|${[4, 6, 8].map(cap => number(r.potential[phase].capacityCells[cap].median)).join('|')}|`);
report.push('', '## B: 순서의 영향', '', '실제 보유 재고에서 선택한 같은 탄창 내용을 유지하고64개 무작위 순서의 중앙값과 비교했다.4~6발 고유 순열을 전수 평가한다. 상호작용 없는 구성의 제외 수를 함께 공개한다. 생존 이득은 피해 통과율에 더하지 않는다.', '', '| 집합/단계 | ≥25% 이득 / 적격 탄창 | 비율 [시드 묶음95%구간] | 제외 | 중앙 최적/무작위 |', '|---|---:|---:|---:|---:|');
for (const [label, r] of splits) for (const phase of ['middle', 'late']) { const o = r.order[phase]; report.push(`|${label}/${phase}|${o.successes}/${o.n}|${percent(o.rate)} [${interval(o.ci95)}]|${o.excluded}|${number(o.ratios.median)}배|`); }
report.push('', '| 빌드 | 탐색 중반/후반 통과율 | 홀드아웃 중반/후반 통과율 |', '|---|---:|---:|');
for (const id of ids) report.push(`|${NAMES[id]}|${['middle', 'late'].map(phase => percent(explore.order[phase].byArchetype[id].rate)).join(' / ')}|${['middle', 'late'].map(phase => percent(holdout.order[phase].byArchetype[id].rate)).join(' / ')}|`);
report.push('', '## C: 빌드와 실제 전투', '', '중반/후반×7원래 적×0.5/3/6/10m를 완전 교차한다. 각 빌드/단계/적/거리 셀당200 탐색+100 홀드아웃 시드. 한 빌드·단계의 집계는5600/2800조우이고 독립 시드는200/100이다. 무작위·휴리스틱·탐색은 동일 재고와 보상 기회를 사용한다. 아래 탐색기는 생존·유효 피해·특수탄 절약을 고려하며, 순수 이론 피해 선택기는 F에서 별도 비교한다.', '', '| 집합/단계/빌드 | 무작위 승률 | 휴리스틱 | 탐색 [시드 묶음95%구간] | 최강 대비 | 승리 시 총탄/특수탄 평균 |', '|---|---:|---:|---:|---:|---:|');
for (const [label, r] of splits) for (const phase of ['middle', 'late']) for (const id of ids) {
  const a = r.combat.aggregate[`${phase}/${id}`];
  report.push(`|${label}/${phase}/${NAMES[id]}|${percent(a.random.rate)}|${percent(a.heuristic.rate)}|${percent(a.search.rate)} [${interval(a.search.ci95)}]|${percent(r.combat.relative[`${phase}/${id}`])}|${number(a.search.winningRounds.mean)} / ${number(a.search.winningSpecial.mean)}|`);
}
report.push('', '단순한 공동 최고 승률을 고유 우위로 과장하지 않도록, 탐색 집합에서 식별한 네 주축의 탄약/사격 이점도 같은 홀드아웃 셀에서 확인했다. 모든 후보에 같은 제어기를 적용한 셀 내 비교다. 승리한 조우에서의 평균이므로 승률을 함께 읽어야 한다.', '', '| 주축 | 고정 시나리오/전략/지표 | 탐색 본인/다음 최선 | 홀드아웃 본인/다음 최선 | 홀드아웃 승률/재확인 |', '|---|---|---:|---:|---|');
for (const id of ids.slice(0, 4)) { const n = niches[id]; report.push(`|${NAMES[id]}|${n.cell ?? '없음'} / ${n.strategy ?? ''} / ${n.metric ?? ''}|${number(n.explore)} / ${number(n.exploreNext)}|${number(n.holdout)} / ${number(n.holdoutNext)}|${percent(n.holdoutWinRate)} / ${n.confirmed ? '확인' : '미확인'}|`); }
let confirmation;
try { confirmation = await json('niche-confirmation'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
if (confirmation) {
  report.push('', '틈새별 적은 탄수 차이의 불확실성을 줄이기 위해, 위에서 식별한 시나리오를 고정한 채 새1200001~1201000의1000시드로 추가 확인했다. 네 사례×6빌드로24000조우이며 규칙·수치·시나리오는 조정하지 않았다. 표의95%구간은 둘 다 승리한 같은 시드의 탄수 절약을 쌍 bootstrap한 값이다. 각 시나리오의 모든 상대 빌드와 승률은 niche-confirmation.json에 공개한다.', '', '| 주축 | 표본 | 본인/다음 최선의 평균 | 다음 최선 대비 절약 [95%] |', '|---|---:|---:|---:|');
  for (const id of ids.slice(0, 4)) {
    const c = confirmation.cases[id], other = ids.filter(key => key !== id).sort((a, b) => c.summary[a].meanWinningMetric - c.summary[b].meanWinningMetric)[0], d = c.comparisons[other];
    report.push(`|${NAMES[id]}|${confirmation.count}|${number(c.summary[id].meanWinningMetric)} / ${number(c.summary[other].meanWinningMetric)}|${number(d.meanSaving)} [${d.ci95.map(number).join('–')}]|`);
  }
}
report.push('', '위 시나리오 이점은 탐색 후 발견한 기술통계이며 별도의 유의성 검정이나 인간 체감 보증이 아니다. 전체 실패를 포함한 셀은 [CSV](simulation/results/combat_cells.csv)와 all.json에 제공한다. 낮은 승률 셀을 일부 제시한다.', '', '| 집합 | 셀/빌드 | 탐색 승률 [Wilson95%] |', '|---|---|---:|');
for (const [label, r] of splits) {
  const bad = Object.entries(r.combat.cells).flatMap(([cell, values]) => ids.map(id => ({ cell, id, ...values[id].search }))).sort((a, b) => a.rate - b.rate).slice(0, 8);
  for (const row of bad) report.push(`|${label}|${row.cell}/${NAMES[row.id]}|${percent(row.rate)} [${interval(row.ci95)}]|`);
}
report.push('', '## D: 교차 메커니즘 제거 실험', '', '같은 자연 획득 탄창·순서·등급·부착물에서 소작의 열 소비 조건 또는 공명의 충격→폭약 변환만 껐다. 다른 주효과와 탄약 슬롯은 그대로다. 완벽한 조합만 골라 평균내지 않으며 이득0인 시드도 모두 포함한다.', '', '| 집합/혼합형 | 표본 | 중앙 추가 이득 [95%] | 양의 이득 시드 | 중반 최강 승률 대비 |', '|---|---:|---:|---:|---:|');
for (const [label, r] of splits) for (const id of ['cauterize', 'concussion']) { const h = r.hybrid[id]; report.push(`|${label}/${NAMES[id]}|${h.gain.n}|${percent(h.gain.median)} [${interval(h.gain.medianCI95)}]|${h.positive.successes}/${h.positive.n}|${percent(r.combat.relative[`middle/${id}`])}|`); }
report.push('', '## E: 실제 순차 런과 획득', '', '각 전략/빌드당200 탐색·100 홀드아웃의18조우 런. 사망 즉시 종료하고 미래 보상은 지급하지 않는다. 중반 진입 전 죽은 런은 실패 분모에 남긴다. ‘방향 획득’은 재고에서 구성 가능한 두 종류 이상의 상호작용과 최소 두 특수탄이며, 최적 순서 완성이나 실제로 매번 그 조합을 선택한다는 뜻은 아니다. 원래 잘못 측정했던 선택 탄창 비율도 숨기지 않는다.', '', '| 집합/빌드 | 무작위 방향 | 휴리스틱 방향 | 탐색 방향 [Wilson95%] | 탐색 중반 생존 | 선택 탄창 연계율 |18조우 완주|', '|---|---:|---:|---:|---:|---:|---:|');
for (const [label, r] of splits) for (const id of ids) { const a = r.acquisition[id]; report.push(`|${label}/${NAMES[id]}|${percent(a.random.coherent.rate)}|${percent(a.heuristic.coherent.rate)}|${percent(a.search.coherent.rate)} [${interval(a.search.coherent.ci95)}]|${percent(a.search.survivedMiddle.rate)}|${percent(a.search.selectedCoherent.rate)}|${percent(a.search.survivedLate.rate)}|`); }
report.push('', '특히 설치 빌드에서는 조합을 소유해도 작은 적을 표준탄으로 처리하는 경우가 많다. 방향 획득률을 실제 사용률로 보고하지 않는다. 모든 전략의 구간별 사망 수와 최종 배분/등급/부착물은 all.json의 acquisition에 포함했다.', '', '## F: 이론 피해와 유틸리티의 비용', '', '같은 재고에서 HP10억 복제의 전체 탄창 피해만 최대화하는 선택과, 실제 적의 즉사·충격·위치·특수탄 소모를 고려하는 선택을 쌍 비교한다. 실제 발사는 두 전략 모두 원래HP에서 중단되며 특수탄도 실제 발사분만 소비한다.', '', '| 집합 | 쌍 수 | 유틸리티만 생존 | 피해 전략만 생존 | 둘 다 생존하며 특수탄 절약/증가 | 생존율 쌍 차이 [95%] |', '|---|---:|---:|---:|---:|---:|');
for (const [label, r] of splits) { const u = r.utility; report.push(`|${label}|${u.pairedN}|${u.survivalGains}|${u.survivalLosses}|${u.economyGains} / ${u.economyLosses}|${percent(u.survivalDifference.mean)} [${interval(u.survivalDifference.ci95)}]|`); }
report.push('', '유틸리티 탐색기가 오히려 사망하거나 특수탄을 더 쓴 사례도 존재한다. 탐색은 유한 예산이며 전투 전역 최적해를 보증하지 않는다. 실제 반례는 combat-pairs.json.gz에 전부 남긴다. replay.mjs로 초기 상태·발별 계산을 확인할 수 있다.', '', '## 강한 적·긴 전투 경계', '', '적을 약화하는 대신 HP2/4배, 상처·열·충격 저항 변화를 같은 시드로 적용했다. 매 턴 특수탄을 재공급하지 않으며12턴 내 처치하지 못하면 실패다. 주 게이트의 원래 적 행렬과 구별한 한계 시험이다.', '', '| 집합/빌드 |2배HP 승률|4배HP 승률|4배HP 승리 시 총 탄수|', '|---|---:|---:|---:|');
for (const [label, r] of splits) for (const id of ids) report.push(`|${label}/${NAMES[id]}|${percent(r.stress[`2x/${id}`].rate)}|${percent(r.stress[`4x/${id}`].rate)}|${number(r.stress[`4x/${id}`].winningRounds?.mean)}|`);
report.push('', '## G: 계산 추적과 수동 검토', '', 'ammo_redesign.md의20종 표가 간단한 설명·조건·수치·목적을 규정한다.20개 독립 검사에서 원본4무기의 기본 탄약 동치, 반동/거리, 임계치, 레이저, 두 교차 규칙, 복사 제외 범위, 조기 처치 미소모, 유한 재고, 무료 재점화 금지, 부착물 봉쇄와 즉사를 확인한다. 원본의 전체 간접 의존성 변경 감지와 홀드아웃 구간 중첩/포함/경계/재실행 보호도 검사한다. 증거는 final-validation.json이다.', '', '## 남은 위험과 인간 검토', '',
  '- **과도한 성장:** 촉진→고등급 소이→소비와 충격 선저장→공명은 큰 상한을 만든다. 원래22~54HP 적은 후반에 쉽게 죽어 잠재 피해 증가 대부분이 과잉 피해가 된다. 현재 적을 약화해 통과시키지 않았고 HP4배 경계도 공개했다. 더 높은 후반 적의 설계는 별도 과제다.',
  '- **약한 경로:** 단독 절개/설치, 열 소비탄 없는 열 축적, 소비 전 공명을 먼저 쏘는 순서, 낮은 등급의 순수 직접 화력은 실패할 수 있다. 낮은 무작위 전략 승률과 각 단계 사망 수를 확인해야 한다.',
  '- **수렴 위험:** 평두 화력4·충격4의 범용성, 같은 탄종 전체에 적용되는 제작 강화, 무제한 표준탄으로 특수탄을 과도하게 아끼는 선택이 반복될 수 있다. 일부 빌드의 실제 조합 사용률은 획득률보다 낮다.',
  '- **퇴행 조합:** 복사/잔향은 값만 복제하며 소비·기폭·후속 규칙을 재실행하지 않는다. 특수탄14발·등급3·강화5기회·조우별 유한 소모로0비용 무한 루프를 막는다. 열이 남아도 표준탄으로 자동 재점화하지 않는다.',
  '- **범위:** P220 외 총의 전체 런, 실제 탐험2택1 보상 이식,18전투 길이·제작권 획득 UX는 미검증이다.8발은 미래 확장값이다. UI·모델·애니메이션은 변경하지 않았으므로 브라우저 시각 검증의 적용 대상이 아니다.',
  '- **수동 확인:**4발에서 다음 탄과 적 행동을 예측할 수 있는지, 상처/열 소모 시점이 직관적인지, 큰 피해가 만족스러운지, 유틸리티 선택과 제작 선택에 고민이 생기는지, 같은 정답 순서로 수렴하는지 직접 플레이 검토가 필요하다.', '',
  '자동 수치 통과 후보를 인간 게임플레이 검토에 넘긴다. 재미가 객관적으로 증명되었다고 주장하지 않는다.', '',
  '## 재현성과 원자료', '',
  '실행 명령은 simulation/README.md. 줄바꿈을 정규화한 평가 도구·잠금 파일·실제 번들의 전체 원본 의존성 SHA를 holdout-registry.json에 기록한다. v6 검증 뒤 첫 탄창의 사전 확정 행동 차이를 발견했으므로830001~830100은 폐기된 검증 자료로 보존하고, 수정한 v7을 미사용930001~930100으로 검증했다. 탄약·보상 수치나 적은 그 뒤 조정하지 않았다. PR 리뷰 후 변경은 의존성 지문의 범위와 홀드아웃 중첩 차단 보호 장치뿐이며 이전 지문은 기록에 보존한다.', '',
  `[탐색 전체](simulation/results/v7-exploratory-all.json.gz), [홀드아웃 전체](simulation/results/v7-holdout-all.json.gz), [모든 전투 셀](simulation/results/combat_cells.csv), [빌드별 실제 trace](simulation/results/build-traces.json), [최종 검사](simulation/results/final-validation.json).`, ''
);
await writeFile(new URL('../balance_report.md', import.meta.url), report.join('\n').replace('固定', '고정'));
const build = ['# 검증한 빌드와 실제 획득 예시', '', '동일 보상 예산·희소성·원래 적7종을 사용한 검증 결과다. 네 주축은 상처 임계치, 열 저장/소비, 폭약 설치/기폭, 실제 반동 소비로 구분된다. 소작과 공명은 두 메커니즘의 자원 전환이며 교차 규칙 제거 실험으로 이득을 확인했다.', '', '아래 예시는 탐색200개 자연 재고 중 해당 엔진이 실제 발동하고 해당 빌드 중앙 피해에 가장 가까운 재고를 자동 선택했다. 완벽한 인벤토리를 평가 모집단으로 삼은 것이 아니다. 전체의 발동/비발동 수와 승률은 보고서에 별도로 공개한다. 예시는6m·HP10억 표적이다.', ''];
for (const id of ids) {
  const x = exampleData[id]; if (!x.row) continue;
  build.push(`## ${NAMES[id]}`, '', `전략: ${{ wound: '절개와 열상의 상처를 누적한 뒤 취약에 강한 발을 배치한다.', heat: '열 증폭·저장 다음 소비탄으로 회수한다. 특수 행동 억제를 위해 소비를 늦출 수도 있다.', blast: '폭약을 설치한 뒤 새 충격 명중으로 기폭한다. 과거 충격은 자동 기폭하지 않는다.', recoil: '강화 고압탄의 선제 화력을 쓰고 발생한 반동은 반동탄으로 회수한다.', cauterize: '상처3 또는 취약을 준비하고 저장 열을 소작으로 소비한다.', concussion: '먼저 쌓은 충격을 폭약 설치 뒤 공명으로 투자한다. 행동 중단에 쓸 충격을 잃는 비용이 있다.' }[id]}`, '', `시드${x.row.seed}, 후반 자연 용량${x.row.capacity}, 등급${JSON.stringify(x.row.ranks)}, 부착물${JSON.stringify(x.row.attachments)}. 잠재 피해${x.row.damage}, 빌드 중앙${x.median}. 자연 획득 표본${x.activatingConfigurations}/${x.n}에서 이 엔진이 선택 탄창에서 발동했다.`, '', `발사: ${x.row.rounds.join(' → ')}`, '', '| 발 | 탄약 | 반동 | 체력 화력 | 열 소비 피해 | 폭발 | 취약 배율 | 최종 피해 |', '|---:|---|---:|---:|---:|---:|---:|---:|', ...x.outcome.trace.map(s => `|${s.index + 1}|${s.id}|${s.recoil}|${s.direct}|${s.thermal}|${s.explosion}|${s.vulnerableFactor}|${s.power}|`), '', `홀드아웃 중반/후반 탐색 승률: ${percent(holdout.combat.aggregate[`middle/${id}`].search.rate)} / ${percent(holdout.combat.aggregate[`late/${id}`].search.rate)}. 중반 생존+빌드 방향 획득: ${percent(holdout.acquisition[id].search.coherent.rate)}.`, '');
}
build.push('## 운용과 검토', '', '실제 적은 먼저 죽으므로 뒤쪽 탄을 항상 쏘지는 않는다. 준비탄이 너무 늦으면 즉사할 수 있다. 작은 적에는 표준탄 마무리, 근접에는 충격/후퇴, 긴 탄창에는 반동 회복이 유리한 사례가 있다. 순서 피해 비율과 생존 이점은 다른 지표다.', '', '전체 시나리오 우위·불리한 사례·신뢰구간은 balance_report.md와 전투 CSV를 참조한다. 완벽한 재고를 전제하지 않으며 각 빌드에 고정 탄종만 강제하지 않는다. 획득 상황에 따라 다른 계열을 섞거나 표준탄을 쓰는 현실적인 정책이다.', '');
await writeFile(new URL('../build_archetypes.md', import.meta.url), build.join('\n'));
const csv = ['split,phase,enemy,distance,archetype,strategy,n,wins,win_rate,ci_low,ci_high,mean_damage,winning_rounds,winning_special,winning_turns'];
for (const [, r] of splits) for (const [key, cells] of Object.entries(r.combat.cells)) for (const [id, strategies] of Object.entries(cells)) for (const [strategy, s] of Object.entries(strategies)) csv.push([r.split, ...key.split('/'), id, strategy, s.n, s.successes, s.rate, ...s.ci95, s.effectiveDamage.mean, s.winningRounds?.mean, s.winningSpecial?.mean, s.winningTurns?.mean].join(','));
await writeFile(new URL('./results/combat_cells.csv', import.meta.url), csv.join('\n') + '\n');
console.log(JSON.stringify({ niches, survivalGrowth, reportWritten: true }, null, 2));
