/* global console, process, setTimeout, URL */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { production, rng, shuffle, quantile, summary, wilson, mean } from './common.mjs';
import { ARCHETYPES, acquired, capacity, createModel, oriented, optimizeOrder, selectMagazine, combat, rewardTape, reward, initialRun } from './model.mjs';
const protocol = JSON.parse(await readFile(new URL('./protocol.json', import.meta.url)));
const candidates = JSON.parse(await readFile(new URL('./candidates.json', import.meta.url)));
const args = process.argv.slice(2), version = args[0] ?? 'v1', split = args[1] ?? 'exploratory', section = args[2] ?? 'all';
const config = candidates[version]; if (!config) throw new Error('Unknown candidate');
const p = await production(), model = createModel(p, config);
const { firstSeed, count } = protocol[split];
const archetypes = Object.keys(ARCHETYPES), stages = Object.entries(protocol.stages);
const seeds = Array.from({ length: count }, (_, i) => firstSeed + i);
const hasher = createHash('sha256');
for (const file of ['./model.mjs', './evaluate.mjs', './common.mjs', '../src/combat/CombatResolver.ts', '../src/data/attachmentDefinitions.ts', '../src/data/enemyDefinitions.ts', '../src/data/weaponDefinitions.ts']) hasher.update(await readFile(new URL(file, import.meta.url)));
const hash = hasher.update(JSON.stringify(config)).update(JSON.stringify(protocol)).digest('hex');
if (split === 'holdout') {
  if (section !== 'all') throw new Error('Holdout requires a complete frozen run');
  const registryURL = new URL('./results/holdout-registry.json', import.meta.url);
  let registry = [];
  try { registry = JSON.parse(await readFile(registryURL)); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (registry.some(r => r.firstSeed === firstSeed && r.hash !== hash)) throw new Error('Holdout seeds already exposed to a different candidate; declare fresh seeds before running');
  if (!registry.some(r => r.hash === hash)) { registry.push({ version, hash, firstSeed, count }); await writeFile(registryURL, JSON.stringify(registry, null, 2) + '\n'); }
}
const result = { version, split, hash, protocolVersion: protocol.version, firstSeed, count, candidate: config, potential: {}, order: {}, hybrid: {}, combat: {}, acquisition: {}, stress: {}, gates: {} };
const target = () => ({ ...p.createEnemyState('normal'), hp: protocol.reference.hp, maxHp: protocol.reference.hp, distance: protocol.reference.distance });
const atomicWrite = async name => {
  await mkdir(new URL('./results/', import.meta.url), { recursive: true });
  const suffix = name.endsWith('progress') ? 'local' : 'json';
  for (let attempt = 0; ; attempt++) {
    try { await writeFile(new URL(`./results/${version}-${split}-${name}.${suffix}`, import.meta.url), JSON.stringify(result, null, 2) + '\n'); break; }
    catch (error) { if (attempt >= 3) throw error; await new Promise(resolve => setTimeout(resolve, 100)); }
  }
};
function bootstrap(values, statistic = values => quantile(values, .5)) {
  const random = rng(78123), stats = [];
  for (let b = 0; b < 400; b++) stats.push(statistic(Array.from({ length: values.length }, () => values[Math.floor(random() * values.length)])));
  return [quantile(stats, .025), quantile(stats, .975)];
}
function metrics(values, uncertainty = false) { return { ...summary(values), ...(uncertainty ? { medianCI95: bootstrap(values) } : {}) }; }
function rate(numerator, denominator) { return { successes: numerator, n: denominator, rate: numerator / denominator, ci95: wilson(numerator, denominator) }; }
function combatSummary(rows, clusterCount = 0) {
  const won = rows.filter(x => x.won);
  const out = { ...rate(won.length, rows.length), effectiveDamage: metrics(rows.map(x => x.damage)), winningRounds: won.length ? metrics(won.map(x => x.roundsFired)) : null, winningSpecial: won.length ? metrics(won.map(x => x.specialFired)) : null, winningTurns: won.length ? metrics(won.map(x => x.turns)) : null };
  if (clusterCount) {
    const clusters = Array(clusterCount).fill(0);
    rows.forEach((row, index) => { clusters[index % clusterCount] += Number(row.won) / (rows.length / clusterCount); });
    out.ci95 = bootstrap(clusters, mean); out.ciMethod = 'paired seed cluster bootstrap'; out.independentSeeds = clusterCount;
  }
  return out;
}
if (section === 'all' || section === 'potential') {
  const raw = [], orderRows = [], examples = {};
  for (const [phase, stage] of stages) {
    const damages = [], byCapacity = {}, hybrid = {};
    for (const archetype of archetypes) {
      hybrid[archetype] = [];
      for (const seed of seeds) {
        const run = acquired(seed, stage, archetype, config, p);
        const naturalCap = capacity(run, p), random = rng(seed ^ 2222);
        const rounds = selectMagazine(run.stock, naturalCap, run, target(), model, 'search', random, { damageOnly: true });
        const optimized = optimizeOrder(rounds, r => model.resolve(r, target(), run).damage, true, random);
        const outcome = model.resolve(optimized, target(), run);
        damages.push(outcome.damage);
        const synergy = oriented(optimized);
        let orderRatio = null;
        if (synergy) {
          const randomized = Array.from({ length: protocol.randomOrderSamples }, () => model.resolve(shuffle(rounds, random), target(), run).damage);
          orderRatio = outcome.damage / quantile(randomized, .5);
          orderRows.push({ seed, phase, archetype, cap: naturalCap, orderRatio, optimizedDamage: outcome.damage, randomMedian: quantile(randomized, .5) });
        }
        if (phase === 'late' && ['cauterize', 'concussion'].includes(archetype)) {
          const ablated = model.resolve(optimized, target(), run, { ablate: true }).damage;
          hybrid[archetype].push({ seed, gain: (outcome.damage - ablated) / Math.max(1, ablated), damage: outcome.damage, ablated });
        }
        raw.push({ seed, phase, archetype, capacity: naturalCap, damage: outcome.damage, orderRatio, stock: run.stock, ranks: run.ranks, attachments: run.loadout, rounds: optimized });
        if (!examples[archetype] && phase === 'late') examples[archetype] = { seed, ...run, outcome: model.resolve(optimized, target(), run, { trace: true }), rounds: optimized };
        for (const cap of protocol.capacities) {
          const mag = selectMagazine(run.stock, cap, run, target(), model, 'search', rng(seed ^ cap), { damageOnly: true });
          (byCapacity[cap] ??= []).push(model.resolve(mag, target(), run).damage);
        }
      }
    }
    // Each seed is a shared reward cluster across the six archetypes.
    const grouped = seeds.map(seed => raw.filter(row => row.seed === seed && row.phase === phase).map(row => row.damage));
    const random = rng(8642), boot = [], boot90 = [];
    for (let b = 0; b < 400; b++) {
      const values = Array.from({ length: count }, () => grouped[Math.floor(random() * count)]).flat();
      boot.push(quantile(values, .5)); boot90.push(quantile(values, .9));
    }
    result.potential[phase] = { ...summary(damages), medianCI95: [quantile(boot, .025), quantile(boot, .975)], p90CI95: [quantile(boot90, .025), quantile(boot90, .975)], capacityCells: Object.fromEntries(Object.entries(byCapacity).map(([cap, values]) => [cap, { ...metrics(values), stressOnly: +cap === 8 }])), note: 'Reward-acquisition ceiling conditional on reaching stage; survival is separately evaluated by E.' };
    for (const id of ['cauterize', 'concussion']) if (hybrid[id].length) result.hybrid[id] = { gain: metrics(hybrid[id].map(x => x.gain), true), positive: rate(hybrid[id].filter(x => x.gain > 0).length, count), rows: hybrid[id] };
    console.log(`${version}/${split}: potential ${phase} median=${result.potential[phase].median}`);
  }
  for (const phase of ['middle', 'late']) {
    const rows = orderRows.filter(row => row.phase === phase);
    result.order[phase] = { ...rate(rows.filter(x => x.orderRatio >= 1.25).length, rows.length), included: rows.length, excluded: count * archetypes.length - rows.length, ratios: metrics(rows.map(x => x.orderRatio)), byArchetype: {} };
    const clusters = seeds.map(seed => rows.filter(row => row.seed === seed));
    const random = rng(2468), boots = [];
    for (let b = 0; b < 400; b++) { const sample = Array.from({ length: count }, () => clusters[Math.floor(random() * count)]).flat(); boots.push(sample.filter(row => row.orderRatio >= 1.25).length / sample.length); }
    result.order[phase].ci95 = [quantile(boots, .025), quantile(boots, .975)];
    result.order[phase].byCapacity = Object.fromEntries([4, 5, 6].map(cap => { const cell = rows.filter(row => row.cap === cap); return [cap, { ...rate(cell.filter(row => row.orderRatio >= 1.25).length, cell.length) }]; }));
    for (const id of archetypes) { const selected = rows.filter(x => x.archetype === id); result.order[phase].byArchetype[id] = { ...rate(selected.filter(x => x.orderRatio >= 1.25).length, selected.length), ratios: selected.length ? metrics(selected.map(x => x.orderRatio)) : null }; }
  }
  const early = result.potential.early.median;
  result.gates.A = { pass: result.potential.middle.median >= early * 1.5 && result.potential.late.median >= early * 3 && result.potential.late.p90 >= early * 8, middleRatio: result.potential.middle.median / early, lateRatio: result.potential.late.median / early, lateP90Ratio: result.potential.late.p90 / early };
  result.gates.B = { pass: ['middle', 'late'].every(key => result.order[key].rate >= .6), middle: result.order.middle.rate, late: result.order.late.rate };
  result.gates.D = { pass: ['cauterize', 'concussion'].every(key => result.hybrid[key].gain.median >= .05), note: 'Hybrid viability additionally requires C combat.' };
  await writeFile(new URL(`./results/${version}-${split}-potential-raw.json`, import.meta.url), JSON.stringify(raw) + '\n');
  await writeFile(new URL(`./results/${version}-${split}-examples.json`, import.meta.url), JSON.stringify(examples, null, 2) + '\n');
  await atomicWrite('potential');
}
if (section === 'all' || section === 'combat') {
  const paired = [], cells = {}, aggregate = {}, scenarioWins = {};
  for (const [phase, stage] of stages.filter(([phase]) => phase !== 'early')) {
    for (const archetype of archetypes) {
      const overall = { random: [], heuristic: [], search: [], damage: [] };
      for (const enemyId of protocol.enemies) for (const distance of protocol.ranges) {
        const rows = { random: [], heuristic: [], search: [], damage: [] };
        for (const seed of seeds) {
          const run = acquired(seed, stage, archetype, config, p);
          const enemy = { ...p.createEnemyState(enemyId), distance };
          for (const strategy of protocol.strategies) {
            const outcome = combat(run.stock, run, enemy, model, p, strategy, rng(seed ^ 9999));
            rows[strategy].push(outcome); overall[strategy].push(outcome);
          }
          const damage = combat(run.stock, run, enemy, model, p, 'search', rng(seed ^ 9999), { damageOnly: true });
          rows.damage.push(damage); overall.damage.push(damage);
          paired.push({ seed, phase, archetype, enemy: enemyId, distance, utilityWon: rows.search.at(-1).won, damageWon: damage.won, utilitySpecial: rows.search.at(-1).specialFired, damageSpecial: damage.specialFired });
        }
        const key = `${phase}/${enemyId}/${distance}`;
        (cells[key] ??= {})[archetype] = Object.fromEntries(Object.entries(rows).map(([s, values]) => [s, combatSummary(values)]));
      }
      aggregate[`${phase}/${archetype}`] = Object.fromEntries(Object.entries(overall).map(([s, values]) => [s, combatSummary(values, count)]));
      console.log(`${version}/${split}: combat ${phase}/${archetype} search=${aggregate[`${phase}/${archetype}`].search.rate}`);
      result.combat = { cells, aggregate }; await atomicWrite('combat-progress');
    }
  }
  for (const id of archetypes) scenarioWins[id] = [];
  for (const [key, cell] of Object.entries(cells)) {
    const strongest = Math.max(...archetypes.map(id => cell[id].search.rate));
    for (const id of archetypes) if (cell[id].search.rate === strongest && strongest > 0) scenarioWins[id].push(key);
  }
  const relative = {};
  for (const phase of ['middle', 'late']) {
    const max = Math.max(...archetypes.map(id => aggregate[`${phase}/${id}`].search.rate));
    for (const id of archetypes) relative[`${phase}/${id}`] = aggregate[`${phase}/${id}`].search.rate / max;
  }
  result.combat = { cells, aggregate, relative, scenarioWins };
  result.utility = { pairedN: paired.length, survivalGains: paired.filter(x => x.utilityWon && !x.damageWon).length, survivalLosses: paired.filter(x => !x.utilityWon && x.damageWon).length, economyGains: paired.filter(x => x.utilityWon && x.damageWon && x.utilitySpecial < x.damageSpecial).length, economyLosses: paired.filter(x => x.utilityWon && x.damageWon && x.utilitySpecial > x.damageSpecial).length, survivalExamples: paired.filter(x => x.utilityWon && !x.damageWon).slice(0, 12), economyExamples: paired.filter(x => x.utilityWon && x.damageWon && x.utilitySpecial < x.damageSpecial).slice(0, 12) };
  const survivalDiff = seeds.map(seed => mean(paired.filter(row => row.seed === seed).map(row => Number(row.utilityWon) - Number(row.damageWon))));
  result.utility.survivalDifference = { mean: mean(survivalDiff), ci95: bootstrap(survivalDiff, mean), independentSeeds: count };
  result.gates.C = { pass: Object.values(relative).every(r => r >= .75) && archetypes.every(id => scenarioWins[id].length > 0), relative, scenarioAdvantages: Object.fromEntries(archetypes.map(id => [id, scenarioWins[id].length])) };
  result.gates.F = { pass: result.utility.survivalGains > 0 && result.utility.economyGains > 0 };
  // Matched stronger enemies, no weakened thresholds or extra replenishment.
  for (const hpScale of [2, 4]) for (const id of archetypes) {
    const outcomes = [];
    for (const seed of seeds) {
      const run = acquired(seed, 18, id, config, p);
      const enemy = p.createEnemyState(protocol.enemies[seed % protocol.enemies.length]);
      enemy.hp *= hpScale; enemy.maxHp = enemy.hp; enemy.distance = protocol.ranges[seed % 4];
      enemy.woundThreshold += seed % 3; enemy.burnThreshold += seed % 5; enemy.shockResistance += seed % 3;
      outcomes.push(combat(run.stock, run, enemy, model, p, 'search', rng(seed)));
    }
    result.stress[`${hpScale}x/${id}`] = combatSummary(outcomes);
  }
  await writeFile(new URL(`./results/${version}-${split}-combat-pairs.json`, import.meta.url), JSON.stringify(paired) + '\n');
  await atomicWrite('combat');
}
if (section === 'all' || section === 'acquisition') {
  for (const archetype of archetypes) {
    result.acquisition[archetype] = {};
    for (const strategy of protocol.strategies) {
      let coherent = 0, selectedCoherent = 0, survivedMiddle = 0, survivedLate = 0;
      const deaths = {}, rows = [];
      for (const seed of seeds) {
        const run = initialRun(archetype), tape = rewardTape(seed, p, config), random = rng(seed ^ 9999);
        let reached = 0, direction = false;
        for (let index = 0; index < 18; index++) {
          if (index === 8) {
            survivedMiddle++;
            const rounds = selectMagazine(run.stock, capacity(run, p), run, target(), model, strategy, rng(seed));
            if (oriented(rounds) && rounds.filter(id => id !== 'ball').length >= 2) selectedCoherent++;
            // Acquisition gate concerns an available legal interacting magazine, not
            // whether this controller happened to choose it against a reference dummy.
            const available = Object.entries(run.stock).flatMap(([id, n]) => Array(n).fill(id));
            direction = oriented(available) && available.length >= 2;
            if (direction) coherent++;
          }
          const enemy = { ...p.createEnemyState(tape[index].enemy), distance: tape[index].distance };
          const outcome = combat(run.stock, run, enemy, model, p, strategy, random);
          if (!outcome.won) { deaths[index + 1] = (deaths[index + 1] ?? 0) + 1; break; }
          reached++;
          if (index === 17) survivedLate++;
          reward(run, tape[index], config, p, strategy, random);
        }
        rows.push({ seed, reached, direction, stock: run.stock, ranks: run.ranks, upgrades: run.upgrades, attachments: run.loadout });
      }
      result.acquisition[archetype][strategy] = { coherent: rate(coherent, count), selectedCoherent: rate(selectedCoherent, count), survivedMiddle: rate(survivedMiddle, count), survivedLate: rate(survivedLate, count), deaths, rows };
      console.log(`${version}/${split}: acquisition ${archetype}/${strategy}: coherent=${coherent}/${count}, clear=${survivedLate}/${count}`);
      await atomicWrite('acquisition-progress');
    }
  }
  result.gates.E = { pass: archetypes.every(id => result.acquisition[id].search.coherent.rate >= .7), byArchetype: Object.fromEntries(archetypes.map(id => [id, result.acquisition[id].search.coherent.rate])) };
  await atomicWrite('acquisition');
}
result.gates.G = { pass: false, note: 'Requires documented rules and successful node --test simulation/model.check.mjs; resolved by verify.mjs.' };
if (section === 'all') {
  result.gates.D.pass &&= Object.entries(result.combat.relative).filter(([key]) => key.endsWith('/cauterize') || key.endsWith('/concussion')).every(([, r]) => r >= .75);
  await atomicWrite('all');
}
console.log(JSON.stringify(result.gates, null, 2));
