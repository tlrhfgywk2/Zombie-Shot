import { writeFile, mkdir } from 'node:fs/promises';
import { production, rng, pick, shuffle, summary } from './common.mjs';
const p = await production();
const resolver = new p.CombatResolver(() => .5);
const result = { revision: '4850a01', design: 'unchanged production', samplesPerCell: 200, potential: {}, combat: {}, exploration: {} };
const preferred = ['relay', 'plusP', 'wounding', 'laceration', 'explosive', 'flatNose', 'mimic', 'incendiary', 'ignition', 'kickback'];
for (const capacity of [4, 6, 8]) {
  result.potential[capacity] = {};
  for (const stage of [1, 9, 18]) {
    const damages = [], orders = [];
    for (let seed = 1; seed <= 200; seed++) {
      const random = rng(seed), stock = ['opening', 'flatNose', 'flatNose'];
      const owned = [];
      for (let s = 1; s < stage; s++) {
        const offered = p.generateAmmoRewards(random);
        if (stock.length < 14) stock.push(offered.find(id => preferred.includes(id)) ?? offered[0]);
        if (s % 3 === 0) { const id = p.generateAttachmentReward(owned, 'p220', random); if (id) owned.push(id); }
      }
      const loadout = {};
      for (const id of owned) loadout[p.ATTACHMENT_DEFINITIONS[id].slot] = id;
      const target = { ...p.createEnemyState('normal'), hp: 1e9, maxHp: 1e9, distance: 6 };
      const pool = [...stock, ...Array(capacity).fill('ball')];
      let best = -1, chosen;
      for (let trial = 0; trial < 48; trial++) {
        const magazine = shuffle(pool, random).slice(0, capacity);
        const damage = resolver.resolveSequence(magazine, target, { magazineCapacity: capacity, loadout }).totalHpDamage;
        if (damage > best) { best = damage; chosen = magazine; }
      }
      const randomOrders = Array.from({ length: 32 }, () => resolver.resolveSequence(shuffle(chosen, random), target, { magazineCapacity: capacity, loadout }).totalHpDamage);
      damages.push(best); orders.push(best / summary(randomOrders).median);
    }
    result.potential[capacity][stage] = { damage: summary(damages), orderRatio: summary(orders), naturalCapacity: capacity <= 6, note: capacity === 8 ? 'hypothetical stress; not obtainable' : 'fixed capacity diagnostic; attachment acquisition is not guaranteed' };
  }
}
for (const id of Object.keys(p.ENEMY_DEFINITIONS)) {
  let wins = 0;
  const turns = [];
  for (let seed = 1; seed <= 200; seed++) {
    const random = rng(10000 + seed), stock = ['opening', 'flatNose', 'flatNose'];
    let enemy = { ...p.createEnemyState(id), distance: pick([.5, 3, 6, 10], random) }, player = p.createPlayerCombatState();
    for (let turn = 1; turn <= 12; turn++) {
      let best, bestValue = -Infinity;
      for (let i = 0; i < 32; i++) {
        const mag = shuffle([...stock, 'ball', 'ball', 'ball', 'ball'], random).slice(0, 4);
        const outcome = resolver.resolveSequence(mag, enemy);
        const action = resolver.resolveEnemyAction(outcome.finalState, player);
        const value = (outcome.killed ? 1e6 : 0) - (action.playerKilled ? 1e5 : 0) + outcome.totalHpDamage;
        if (value > bestValue) { bestValue = value; best = outcome; }
      }
      for (const shot of best.shots) if (shot.ammoType !== 'ball') stock.splice(stock.indexOf(shot.ammoType), 1);
      enemy = best.finalState;
      if (enemy.hp <= 0) { wins++; turns.push(turn); break; }
      const action = resolver.resolveEnemyAction(enemy, player);
      enemy = action.after; player = action.playerAfter;
      if (action.playerKilled) break;
    }
  }
  result.combat[id] = { wins, n: 200, winRate: wins / 200, winningTurns: turns.length ? summary(turns) : null };
}
const routeCounts = {};
for (let seed = 1; seed <= 200; seed++) {
  const run = new p.ExplorationRun(`baseline-${seed}`);
  for (const layer of run.layers) { const route = layer[seed % layer.length]; routeCounts[route.kind] = (routeCounts[route.kind] ?? 0) + 1; }
}
result.exploration = { n: 200, routeCounts, actualLength: 9, actualRewardPoolOmitsBurnAndExplosive: true, lateRunImplemented: false };
await mkdir(new URL('./results/', import.meta.url), { recursive: true });
await writeFile(new URL('./results/baseline.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
