import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { production, root } from './runtime.mjs';
import { rng, shuffle } from '../../experiments/level-v7/random.mjs';
import { createModel, capacity, optimizeOrder, oriented, rewardTape, reward, initialRun } from '../../experiments/level-v7/model-portable.mjs';
import { createModel as createAblation } from '../../experiments/level-v7/model-ablation.mjs';
import { LevelSession, autoNoncombat, observe, chooseRounds, templates, activate, coherent, complete } from '../../experiments/level-v7/engine.mjs';
import { DEFAULT_SETTINGS } from '../../experiments/level-v7/design.mjs';
import { quantile, mean, wilson } from '../../simulation/common.mjs';

const protocol = JSON.parse(await readFile(new URL('experiments/level-v7/protocol.json', root)));
const config = JSON.parse(await readFile(new URL('experiments/level-v7/v7-config.json', root)));
const p = await production(), model = createModel(p, config), ablation = createAblation(p, config);
const split = process.argv[2] ?? 'exploratory';
const settingsFile = process.argv[3];
const settings = settingsFile ? JSON.parse(await readFile(settingsFile)) : DEFAULT_SETTINGS;
const variantArgs = process.argv[4]?.split(',');
const variants = variantArgs ?? protocol.variants;
const { firstSeed, count } = protocol[split];
const output = new URL('experiments/level-v7/results/', root); await mkdir(output, { recursive: true });
const files = ['experiments/level-v7/engine.mjs', 'experiments/level-v7/design.mjs', 'experiments/level-v7/protocol.json', 'experiments/level-v7/model-portable.mjs', 'experiments/level-v7/model-ablation.mjs', 'tools/level-v7/evaluate.mjs', 'package-lock.json'];
const hash = createHash('sha256');
for (const file of files) hash.update(file).update((await readFile(new URL(file, root), 'utf8')).replace(/\r\n/g, '\n'));
// 실제 적 행동·무기·부착물을 포함한 의존 그래프는 원래 v7 fingerprint에도 포함된다.
const { fingerprint } = await import('../../simulation/provenance.mjs');
hash.update(await fingerprint(config, protocol)).update(JSON.stringify(settings));
const fingerprintValue = hash.digest('hex');
if (split === 'holdout') {
  if (variants.join() !== 'nine-linked') throw new Error('홀드아웃은 최종 9노드 후보 전체 전략/빌드만 평가');
  const path = new URL('holdout-registry.json', output);
  let registry = []; try { registry = JSON.parse(await readFile(path)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (registry.some(item => item.firstSeed === firstSeed && item.hash !== fingerprintValue)) throw new Error('이미 노출된 홀드아웃: 새 시드를 선언해야 함');
  if (!registry.length) { registry.push({ firstSeed, count, hash: fingerprintValue, settings }); await writeFile(path, JSON.stringify(registry, null, 2)); }
}

function finishWithBasic(observation, rounds, engine, ablateEngine) {
  let enemy = structuredClone(observation.enemy), player = structuredClone(observation.player);
  let turns = 0;
  for (; turns < 12; turns++) {
    const shot = engine.resolve(turns === 0 ? rounds : Array(capacity(observation, p, player)).fill('ball'), enemy, observation, { player, ablateEngine, trace: turns === 0 });
    enemy = shot.after;
    if (shot.killed) return { won: true, turns: turns + 1, first: turns === 0 ? shot : undefined };
    const action = engine.action(enemy, player, observation.loadout);
    if (action.playerKilled) return { won: false, turns: turns + 1 };
    enemy = action.after; player = action.playerAfter;
  }
  return { won: false, turns };
}
function meaningful(observation, rounds) {
  const shot = model.resolve(rounds, observation.enemy, observation, { player: observation.player, trace: true });
  const basic = model.resolve(Array(capacity(observation, p, observation.player)).fill('ball'), observation.enemy, observation, { player: observation.player });
  if (basic.killed || !activate(observation.archetype, shot)) return false;
  const actual = finishWithBasic(observation, rounds, model);
  const without = finishWithBasic(observation, rounds, ablation, observation.archetype);
  return actual.won && (!without.won || actual.turns < without.turns);
}
function orderMeasure(observation, seed) {
  const target = { ...observation.enemy, hp: 1e9, maxHp: 1e9, wound: 0, burn: 0, explosive: 0, actionShock: 0, vulnerableTurns: 0, ignitedActions: 0, distance: 6 };
  const measured = { ...observation, enemy: target };
  const rounds = chooseRounds(measured, 'optimized', model, p, rng(seed ^ 18181));
  if (!oriented(rounds)) return { eligible: false };
  const score = r => model.resolve(r, target, measured, { player: measured.player }).potential;
  const best = optimizeOrder(rounds, score, true, rng(seed));
  const median = quantile(Array.from({ length: protocol.orderSamples }, () => score(shuffle(rounds, rng(seed++)))), .5);
  return { eligible: true, ratio: score(best) / median, rounds: best };
}

function run(seed, archetype, strategy, variant) {
  const s = new LevelSession(p, model, config, seed, archetype, variant, settings);
  let tape;
  if (variant === 'eighteen-v7') {
    tape = rewardTape(seed, p, config);
    s.run = initialRun(archetype);
    s.plan = tape.map((node, i) => ({ kind: 'combat', depth: i + 1, title: '기존18전투', waves: [{ enemy: node.enemy, distance: node.distance, role: i >= 12 ? 'boss' : i >= 8 ? 'elite' : 'regular' }], offers: node.offers }));
  }
  let lateReached = false, opportunity = false, actualMeaningful = false, middle = false, completed = false, middleChecked = false;
  const orders = [], phases = [], logs = [];
  let steps = 0;
  while (!['victory', 'defeat', 'timeout'].includes(s.phase) && steps++ < 300) {
    if (s.phase === 'advance' && s.depth === s.plan.length) { s.phase = 'victory'; break; }
    if (s.phase === 'combat') {
      const observation = observe(s), late = s.plan.length === 18 ? 13 : s.plan.length === 12 ? 9 : 6;
      const midpoint = s.plan.length === 18 ? 9 : s.plan.length === 12 ? 7 : 5;
      if (s.depth >= late) { lateReached = true; completed ||= complete(s.run); }
      if (s.depth >= midpoint && !middleChecked) { middle = coherent(s.run); middleChecked = true; }
      const measuredArchetype = s.run.archetype;
      const rounds = chooseRounds(observation, strategy, model, p, s.random);
      let availableOpportunity = false;
      if (s.depth >= late && s.turn === 1) {
        availableOpportunity = [...templates(observation, p), rounds].some(trial => meaningful(observation, trial));
        opportunity ||= availableOpportunity;
      }
      const appliedMeaningful = s.depth >= late && meaningful(observation, rounds);
      actualMeaningful ||= appliedMeaningful;
      opportunity ||= appliedMeaningful;
      const row = s.fire(rounds);
      logs.push({ depth: row.depth, wave: row.wave, role: row.role, enemy: row.before.enemy.type, hp: row.before.enemy.hp, distance: row.before.enemy.distance, turn: row.turn,
        rounds, fired: row.shot.rounds, effective: row.shot.damage, potential: row.shot.potential,
        plannedPotential: model.resolve(rounds, { ...observation.enemy, hp: 1e9, maxHp: 1e9 }, observation, { player: observation.player }).potential,
        special: row.shot.special, unused: row.unused.length, activated: activate(measuredArchetype, row.shot), opportunity: availableOpportunity, meaningful: appliedMeaningful,
        action: row.action?.selectedAction, interrupted: row.action?.interrupted ?? false, died: row.action?.playerKilled ?? false });
      if (strategy === 'competent' && row.turn === 1 && (row.depth === midpoint || row.depth === late)) orders.push({ depth: row.depth, ...orderMeasure(observation, seed ^ row.depth) });
      s.logs.length = 0;
    } else if (variant === 'eighteen-v7' && s.phase === 'reward') {
      const before = { ...s.run.stock };
      // LevelSession의 처치 계수와 원래 reward()의 승리 계수를 이중 집계하지 않는다.
      s.run.victories--;
      reward(s.run, tape[s.depth - 1], config, p, strategy === 'random' ? 'random' : 'heuristic', s.random);
      s.rewards.push({ depth: s.depth, chosen: Object.keys(s.run.stock).find(id => s.run.stock[id] > (before[id] ?? 0)), rejected: [] });
      s.phase = 'advance';
    } else autoNoncombat(s, strategy);
    phases.push([s.depth, s.phase]);
  }
  return { seed, archetype, actualBuild: s.run.archetype, strategy, variant, phase: s.phase, reached: s.depth, lateReached, opportunity, actualMeaningful, coherentByMiddle: s.plan.length === 18 ? middle : s.directionByMiddle,
    buildCompleted: s.completeByLate || completed, stock: s.run.stock, ranks: s.run.ranks, loadout: s.run.loadout, rewards: s.rewards, orders, logs, phases };
}

const rows = [];
for (const variant of variants) {
  for (const strategy of protocol.strategies) {
    for (let seed = firstSeed; seed < firstSeed + count; seed++) for (const archetype of protocol.archetypes) rows.push(run(seed, archetype, strategy, variant));
    console.log(`${split}/${settings.id}/${variant}/${strategy}: ${rows.filter(r => r.variant === variant && r.strategy === strategy && r.phase === 'victory').length}/${count * 6}`);
  }
  // 진행을 저장해 중단 시 재시작 근거를 남긴다.
  await writeFile(new URL(`${settings.id}-${split}-raw.json.gz`, output), gzipSync(JSON.stringify(rows)));
}
function rate(yes, n) { return { yes, n, rate: n ? yes / n : null, ci95: wilson(yes, n) }; }
function clusterCI(sample, value) {
  const clusters = [...new Set(sample.map(r => r.seed))].map(seed => mean(sample.filter(r => r.seed === seed).map(value)));
  if (!clusters.length) return [null, null];
  const random = rng(7788), boots = Array.from({ length: 400 }, () => mean(clusters.map(() => clusters[Math.floor(random() * clusters.length)])));
  return [quantile(boots, .025), quantile(boots, .975)];
}
const cells = {}, byBuild = {}, byActualBuild = {}, byRole = {};
function aggregate(sample) {
  const logs = sample.flatMap(r => r.logs), late = sample.filter(r => r.lateReached);
  const sum = key => logs.reduce((s, r) => s + r[key], 0), effective = sum('effective'), potential = sum('potential');
  const deaths = {};
  for (const run of sample.filter(r => r.phase !== 'victory')) {
    const last = run.logs.at(-1), key = `${run.reached}/${last?.enemy}/${last?.action ?? run.phase}`;
    deaths[key] = (deaths[key] ?? 0) + 1;
  }
  return { completion: { ...rate(sample.filter(r => r.phase === 'victory').length, sample.length), ci95: clusterCI(sample, r => +(r.phase === 'victory')), independentSeeds: new Set(sample.map(r => r.seed)).size },
    coherent: rate(sample.filter(r => r.coherentByMiddle).length, sample.length), buildCompleted: rate(sample.filter(r => r.buildCompleted).length, sample.length),
    opportunities: rate(late.filter(r => r.opportunity).length, late.length), actualMeaningful: rate(late.filter(r => r.actualMeaningful).length, late.length),
    activatedVolleys: rate(logs.filter(r => r.activated).length, logs.length),
    effective, potential, utilization: effective / potential, plannedUtilization: effective / sum('plannedPotential'), overkill: potential - effective, unused: sum('unused'),
    turnsPerRun: logs.length / sample.length, roundsPerRun: logs.reduce((s, r) => s + r.fired.length, 0) / sample.length, specialPerRun: sum('special') / sample.length, deaths };
}
for (const variant of variants) for (const strategy of protocol.strategies) {
  const sample = rows.filter(r => r.variant === variant && r.strategy === strategy);
  cells[`${variant}/${strategy}`] = aggregate(sample);
  for (const archetype of protocol.archetypes) byBuild[`${variant}/${strategy}/${archetype}`] = aggregate(sample.filter(r => r.archetype === archetype));
  for (const archetype of protocol.archetypes) {
    const actualSample = sample.filter(r => r.actualBuild === archetype);
    if (actualSample.length) byActualBuild[`${variant}/${strategy}/${archetype}`] = aggregate(actualSample);
  }
  for (const role of ['regular', 'dangerous', 'elite', 'boss']) {
    const logs = sample.flatMap(r => r.logs).filter(r => r.role === role);
    if (logs.length) byRole[`${variant}/${strategy}/${role}`] = { volleys: logs.length, enemies: logs.filter(r => r.turn === 1).length,
      effective: logs.reduce((s, r) => s + r.effective, 0), potential: logs.reduce((s, r) => s + r.potential, 0), meaningful: logs.filter(r => r.meaningful).length, deaths: logs.filter(r => r.died).length };
  }
}
const orderRows = rows.flatMap(r => r.orders.map(x => ({ archetype: r.archetype, variant: r.variant, ...x })));
const order = Object.fromEntries(variants.map(variant => {
  const subset = orderRows.filter(r => r.variant === variant), eligible = subset.filter(r => r.eligible);
  return [variant, { ...rate(eligible.filter(r => r.ratio >= 1.25).length, eligible.length), excluded: subset.length - eligible.length,
    byBuild: Object.fromEntries(protocol.archetypes.map(id => { const cell = eligible.filter(r => r.archetype === id); return [id, rate(cell.filter(r => r.ratio >= 1.25).length, cell.length)]; })) }];
}));
const selected = 'nine-linked', key = strategy => cells[`${selected}/${strategy}`];
let gates = null;
if (key('competent')) {
  const buildCells = protocol.archetypes.map(id => byBuild[`${selected}/competent/${id}`]);
  const best = Math.max(...buildCells.map(c => c.completion.rate));
  gates = {
    A: { status: buildCells.every(c => c.opportunities.rate >= .7) ? 'PASS' : 'FAIL', rates: buildCells.map(c => c.opportunities) },
    B: { status: key('competent').coherent.rate >= .7 ? 'PASS' : 'FAIL', value: key('competent').coherent },
    C: { status: buildCells.every(c => c.completion.rate >= best * .75) ? 'PASS' : 'FAIL', relative: buildCells.map(c => c.completion.rate / best), note: '고유 이점과 혼합 기여는 보고서에서 별도 판정' },
    D: { status: order[selected].rate >= .6 ? 'PASS' : 'FAIL', value: order[selected] },
    E: { status: key('competent').completion.rate >= .45 && key('competent').completion.rate <= .85 && key('optimized').completion.rate >= .65 && key('optimized').completion.rate <= .98 && key('competent').completion.rate - key('random').completion.rate >= .15 ? 'PASS' : 'FAIL', competent: key('competent').completion, optimized: key('optimized').completion, random: key('random').completion },
    F: { status: buildCells.every(c => c.opportunities.rate >= .7) ? 'PASS' : 'FAIL', note: '일반 적 보존 및 역할별 피해 활용은 byRole 참조' },
    G: { status: 'FAIL', reason: 'v7은 실험 페이지/시뮬레이터 전용이며 현행 실게임 탄약 계약과 의도된 차이가 있음. 브라우저 증거는 별도 보고.' },
  };
}
const summary = { split, settings, hash: fingerprintValue, firstSeed, count, runCount: rows.length, cells, byBuild, byActualBuild, byRole, order, gates };
await writeFile(new URL(`${settings.id}-${split}-summary.json`, output), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ runCount: rows.length, gates: gates && Object.fromEntries(Object.entries(gates).map(([id, gate]) => [id, gate.status])) }));
