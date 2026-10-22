/* global console, URL */
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { production, rng, mean, quantile, wilson } from './common.mjs';
import { ARCHETYPES, acquired, createModel, combat } from './model.mjs';
const niches = JSON.parse(await readFile(new URL('./results/niche-validation.json', import.meta.url)));
const config = JSON.parse(await readFile(new URL('./candidates.json', import.meta.url))).v7;
const p = await production(), model = createModel(p, config), archetypes = Object.keys(ARCHETYPES);
const firstSeed = 1200001, count = 1000, result = { version: 'v7', firstSeed, count, cases: {} }, raw = [];
for (const [id, niche] of Object.entries(niches)) {
  const [phase, enemyId, distance] = niche.cell.split('/');
  const rows = {};
  for (const archetype of archetypes) {
    rows[archetype] = [];
    for (let i = 0; i < count; i++) {
      const seed = firstSeed + i, run = acquired(seed, phase === 'middle' ? 9 : 18, archetype, config, p);
      const enemy = { ...p.createEnemyState(enemyId), distance: +distance };
      const outcome = combat(run.stock, run, enemy, model, p, niche.strategy === 'damage' ? 'search' : niche.strategy, rng(seed ^ 9999), { damageOnly: niche.strategy === 'damage' });
      const row = { seed, archetype, case: id, won: outcome.won, value: niche.metric === 'winningSpecial' ? outcome.specialFired : outcome.roundsFired };
      rows[archetype].push(row); raw.push(row);
    }
  }
  const summary = Object.fromEntries(archetypes.map(key => {
    const won = rows[key].filter(x => x.won);
    return [key, { n: count, wins: won.length, winRate: won.length / count, ci95: wilson(won.length, count), meanWinningMetric: mean(won.map(x => x.value)) }];
  }));
  const comparisons = {};
  for (const other of archetypes.filter(key => key !== id)) {
    const paired = rows[id].map((own, i) => own.won && rows[other][i].won ? rows[other][i].value - own.value : null).filter(x => x !== null);
    const random = rng(23456), boots = [];
    for (let b = 0; b < 1000; b++) boots.push(mean(Array.from({ length: paired.length }, () => paired[Math.floor(random() * paired.length)])));
    comparisons[other] = { nJointVictories: paired.length, meanSaving: mean(paired), ci95: [quantile(boots, .025), quantile(boots, .975)] };
  }
  result.cases[id] = { cell: niche.cell, strategy: niche.strategy, metric: niche.metric, summary, comparisons, pointAdvantage: summary[id].meanWinningMetric < Math.min(...archetypes.filter(key => key !== id).map(key => summary[key].meanWinningMetric)) };
  console.log(id, JSON.stringify(result.cases[id]));
}
await writeFile(new URL('./results/niche-confirmation.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
await writeFile(new URL('./results/niche-confirmation-raw.json.gz', import.meta.url), gzipSync(JSON.stringify(raw), { level: 9 }));
