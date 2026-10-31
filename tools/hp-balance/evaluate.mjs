import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { production, root } from './runtime.mjs';
import { createModel } from '../../simulation/model.mjs';
import { mean, quantile, rng } from '../../simulation/common.mjs';
import { combat, PACKS, productionModel, BASIC_IDS } from './combat.mjs';
import { collectProduction, collectV7 } from './inventory.mjs';
import { fingerprint } from './provenance.mjs';
const p = await production(), config = JSON.parse(await readFile(new URL('simulation/candidates.json', root))).v7;
const settings = JSON.parse(await readFile(new URL('experiments/level-v7/candidate-6.json', root)));
const args = process.argv.slice(2), id = args[0] ?? 'baseline', split = args[1] ?? 'exploratory';
const candidate = id === 'baseline' ? null : JSON.parse(await readFile(new URL(`tools/hp-balance/candidates/${id}.json`, root)));
const firstSeed = split === 'holdout' ? 5810001 : 5110001, count = 80;
const output = new URL('tools/hp-balance/results/', root); await mkdir(output, { recursive: true });
const { hash, sources } = await fingerprint(candidate);
if (split === 'holdout') {
  if (!candidate) throw new Error('홀드아웃은 최종 HP 후보에만 사용');
  const path = new URL('holdout-registry.json', output); let registry = [];
  try { registry = JSON.parse(await readFile(path)); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const { assertFreshOrExactReplay } = await import('../../simulation/exposure.mjs');
  assertFreshOrExactReplay(registry, { firstSeed, count, hash });
  if (!registry.some(row => row.hash === hash)) { registry.push({ firstSeed, count, hash, id }); await writeFile(path, JSON.stringify(registry, null, 2)); }
}
const models = { exploration: productionModel(p), v7: createModel(p, config) };
const rows = [], acquisition = [];
for (let seed = firstSeed; seed < firstSeed + count; seed++) {
  for (const profile of ['exploration', 'v7']) {
    for (const archetype of profile === 'v7' ? Object.keys(PACKS) : ['basic', 'wound']) {
      const observations = profile === 'v7' ? collectV7(seed, archetype, p, config, settings) : collectProduction(seed, archetype, p);
      acquisition.push({ seed, profile, archetype, phases: observations.map(row => row.label) });
      for (const observation of observations) for (const strategy of seed < firstSeed + 16 ? ['heuristic', 'competent', 'search'] : ['heuristic', 'competent']) {
        for (const utility of archetype === 'basic' ? [false, true] : [true]) {
          const inventory = structuredClone(observation.inventory);
          if (archetype === 'basic' && !utility) inventory.stock = Object.fromEntries(Object.entries(inventory.stock).filter(([id]) => BASIC_IDS.has(id)));
          const hp = candidate ? observation.reserve && candidate[profile].reserveHp?.[observation.enemy.type]
            || p.interpolateEnemyHp(observation.enemy.type, observation.depth, candidate[profile]) : observation.enemy.maxHp;
          const enemy = { ...observation.enemy, hp, maxHp: hp };
          const result = combat(inventory, enemy, models[profile], p, strategy, seed);
          rows.push({ seed, profile, archetype, strategy, utility, phase: observation.label, depth: observation.depth, type: enemy.type, distance: enemy.distance, hp,
            stock: inventory.stock, ranks: inventory.ranks, loadout: inventory.loadout, ...result });
        }
      }
    }
  }
  if ((seed - firstSeed + 1) % 20 === 0) console.log(`${id}/${split}: ${seed - firstSeed + 1}/${count}`);
}
function rateCI(sample) {
  const clusters = [...new Set(sample.map(row => row.seed))].map(seed => mean(sample.filter(row => row.seed === seed).map(row => +row.won)));
  const random = rng(88217), boots = Array.from({ length: 400 }, () => mean(clusters.map(() => clusters[Math.floor(random() * clusters.length)])));
  return [quantile(boots, .025), quantile(boots, .975)];
}
const cells = {}, encounterCells = {};
function aggregate(sample) {
  const won = sample.filter(row => row.won), sum = key => sample.reduce((s, row) => s + row[key], 0), damage = sum('damage'), potential = sum('potential');
  return { n: sample.length, wins: won.length, winRate: won.length / sample.length, ci95: rateCI(sample),
    winningShots: won.length ? mean(won.map(row => row.shots)) : null, winningTurns: won.length ? mean(won.map(row => row.turn)) : null,
    enemyActions: mean(sample.map(row => row.actions)), special: mean(sample.map(row => row.special)),
    activationRate: sample.filter(row => row.synergy > 0).length / sample.length, damage, potential, utilization: damage / potential, overkill: potential - damage,
    extraTurnLosses: sample.filter(row => row.oneMoreTurnLoss).length, maxWinningTurns: won.length ? Math.max(...won.map(row => row.turn)) : null };
}
for (const row of rows) {
  const key = `${row.profile}/${row.phase}/${row.archetype}/${row.strategy}/${row.utility ? 'utility' : 'pure'}`;
  (cells[key] ??= []).push(row);
  (encounterCells[`${key}/${row.type}/${row.distance}`] ??= []).push(row);
}
const result = { id, split, firstSeed, count, hash, sources, candidate, observations: rows.length, acquisition,
  cells: Object.fromEntries(Object.entries(cells).map(([key, sample]) => [key, aggregate(sample)])),
  encounterCells: Object.fromEntries(Object.entries(encounterCells).map(([key, sample]) => [key, aggregate(sample)])) };
await writeFile(new URL(`${id}-${split}-raw.json.gz`, output), gzipSync(JSON.stringify(rows)));
await writeFile(new URL(`${id}-${split}.json`, output), JSON.stringify(result, null, 2));
for (const [key, row] of Object.entries(result.cells)) if (key.includes('/competent/')) console.log(`${key}: ${(row.winRate * 100).toFixed(1)}% / ${row.winningTurns?.toFixed(2)}턴`);
