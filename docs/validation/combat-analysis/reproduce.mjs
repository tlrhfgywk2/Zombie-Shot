import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import assert from 'node:assert/strict';

// 프로젝트 루트에서 실행한다. 인수로 결과 JSON 경로를 지정할 수 있다.
const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = resolve(process.argv[2] ?? fileURLToPath(new URL('./results.json', import.meta.url)));
const temporary = mkdtempSync(join(tmpdir(), 'zombie-combat-'));
const seed = 20261125;
const scenario = { mode: 'analysis', weapon: 'P220', capacity: 4, maxHp: 100000,
  distance: 3, approach: 1, wound: 0, vulnerable: null, heat: 0, turns: 1, seed };
const reference = Array(4).fill('standard');
const groups = [
  ['상처·다중·집속', ['serrated_round', 'split_round', 'pulse_round', 'convergence_round']],
  ['고단발·충격·후속', ['reinforced', 'conduit_round', 'follow_up', 'pulse_round']],
  ['지연·취약·상처', ['echo_round', 'echo_round', 'vulnerability', 'serrated_round']],
  ['계열·쐐기·복제', ['serrated_round', 'wedge_round', 'pursuit_round', 'copy']],
];
const builds = [
  ['상처 누적', ['serrated_round', 'serrated_round', 'wounding_round', 'serrated_round']],
  ['독립 타격', ['wedge_round', 'split_round', 'pulse_round', 'split_round']],
  ['충격 전이', ['conduit_round', 'pulse_round', 'conduit_round', 'pulse_round']],
  ['고단발', Array(4).fill('reinforced')],
  ['상처·전이', ['serrated_round', 'serrated_round', 'conduit_round', 'pulse_round']],
  ['다중·집속', ['split_round', 'split_round', 'convergence_round', 'convergence_round']],
  ['상처·지연', ['echo_round', 'serrated_round', 'echo_round', 'conduit_round']],
  ['준비된 처형', ['vulnerability', 'reinforced', 'follow_up', 'execution'], { hp: 30000 }],
];
let revision;
let sourceDirty;
let commands = 0;

function run(command, config) {
  const file = join(temporary, 'input.json');
  writeFileSync(file, JSON.stringify(config));
  const data = JSON.parse(execFileSync(process.execPath, ['tools/combat-analysis.mjs', command, '--config', file],
    { cwd: root, encoding: 'utf8', maxBuffer: 12 * 1024 * 1024 }));
  if (revision) assert.equal(data.revision, revision, '측정 중 소스 리비전이 바뀌었습니다.');
  revision = data.revision;
  if (commands) assert.equal(data.sourceDirty, sourceDirty, '측정 중 분석 소스의 변경 상태가 바뀌었습니다.');
  sourceDirty = data.sourceDirty;
  commands++;
  return data.result;
}

function counts(rounds, copies = 1) {
  const stock = {};
  for (const round of rounds) stock[round] = (stock[round] ?? 0) + copies;
  return stock;
}

function pick(record, fields) {
  return Object.fromEntries(fields.map(key => [key, record[key]]));
}

try {
  const catalog = run('catalog', {});
  const single = run('single', { scenario });
  const fields = ['totalDamage', 'directDamage', 'delayedDamage', 'hits', 'shots', 'heatGenerated',
    'conditionalBaseDamage', 'conditionalHits', 'conditionalHitDamage', 'woundDamage', 'impactDamage', 'woundApplied', 'vulnerableApplied'];
  const individual = single.rows.map(row => ({ round: row.round, name: row.name,
    cold: pick(row.cold, fields), prepared: pick(row.prepared, fields) }));
  const orders = groups.map(([name, rounds]) => {
    const stock = counts(rounds);
    const result = run('search', { scenario: { ...scenario, inventory: stock },
      search: { pool: Object.keys(stock), maxScenarios: 24, keep: 1 } });
    assert(result.exhaustive);
    return { name, stock, ...pick(result, ['evaluated', 'mean', 'highest', 'lowest']), spread: result.max - result.min };
  });
  const comparisons = builds.map(([name, sequence, conditions = {}]) => {
    const result = run('compare', { scenario: { ...scenario, ...conditions, sequence }, against: reference });
    return { name, sequence, conditions, evaluated: result.evaluated, damage: result.selected.metrics.totalDamage,
      reference: result.reference.metrics.totalDamage, delta: result.delta, interaction: result.interactionDelta,
      substitutions: result.substitutions.map(row => ({ slot: row.slot, damage: row.damage, delta: row.delta })),
      metrics: pick(result.selected.metrics, ['woundDamage', 'impactDamage', 'delayedDamage', 'hits', 'heatGenerated']) };
  });
  const extreme = run('search', { scenario, search: { maxScenarios: 12000, keep: 3 } });
  const best = extreme.highest[0];
  const trace = run('trace', { scenario: { ...scenario, sequence: best.sequence } });
  assert.equal(trace.metrics.totalDamage, best.damage);
  assert.equal(trace.trace.dropped, 0);
  const hitFields = ['turn', 'shot', 'hit', 'ammo', 'source', 'effectId', 'rawBaseDamage', 'conditionalBaseDamage',
    'modifiedDamage', 'heat', 'woundBonus', 'impactBonus', 'appliedTransferBps', 'finalDamage', 'countAfter'];
  const bestHits = trace.trace.events.filter(e => e.kind === 'hit').map(e => pick(e, hitFields));
  assert.equal(bestHits.reduce((sum, hit) => sum + hit.finalDamage, 0), best.damage);
  const sequence = ['serrated_round', 'split_round', 'conduit_round', 'convergence_round'];
  const encounters = [
    ['두 탄창', 150, 3, 2], ['한 탄창', 150, 3, 1], ['접촉 직전', 250, 1, 2],
  ].map(([name, maxHp, distance, magazines]) => {
    const config = { ...scenario, mode: 'encounter', maxHp, distance, turns: 4, sequence, inventory: counts(sequence, magazines) };
    const result = run('ordered', { scenario: config });
    return { name, scenario: config, outcome: result.outcome, remaining: result.inventory, hp: result.state.hp,
      turns: result.turns.map(t => ({ turn: t.turn, shots: t.shots, hits: t.hits, damage: t.damage, peakHeat: t.peakHeat,
        endHeat: t.end.weaponHeat, endWound: t.end.wound, distance: t.end.distance, hp: t.end.hp })),
      total: result.metrics.totalDamage, effective: result.metrics.effectiveDamage };
  });
  const stress = [seed, 56009].map(batchSeed => run('stress', { stress: { seed: batchSeed, iterations: 5000 } }));
  assert(stress.every(batch => batch.failures.length === 0));
  const results = { revision, sourceDirty, commands, scenario, registry: catalog.weapon,
    individual: { evaluated: single.evaluated, rows: individual }, orders, comparisons,
    extreme: pick(extreme, ['seed', 'strategy', 'spaceSize', 'evaluated', 'min', 'max', 'mean', 'p10', 'median', 'p90',
      'highest', 'lowest', 'upperDecile']), bestHits, encounters, stress };
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(results, null, 2) + '\n');
  process.stdout.write(`실측 결과 저장 ${output}\n`);
} finally {
  rmSync(join(temporary, 'input.json'), { force: true });
  rmdirSync(temporary);
}
