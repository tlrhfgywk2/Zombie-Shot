import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { production, root } from './runtime.mjs';
import { LevelSession, autoNoncombat, observe } from '../../experiments/level-v7/engine.mjs';
import { createModel } from '../../simulation/model.mjs';
import { rng } from '../../simulation/common.mjs';
import { choose, BASIC_IDS, PACKS, combat, productionModel, activated } from './combat.mjs';
import { buyProductionBundle } from './inventory.mjs';
const p = await production(), id = process.argv[2] ?? 'baseline';
const curve = id === 'baseline' ? null : JSON.parse(await readFile(new URL(`tools/hp-balance/candidates/${id}.json`, root)));
const config = JSON.parse(await readFile(new URL('simulation/candidates.json', root))).v7;
const settings = JSON.parse(await readFile(new URL('experiments/level-v7/candidate-6.json', root)));
const rows = [];
const hp = (type, depth, profile) => curve ? p.interpolateEnemyHp(type, depth, curve[profile]) : p.ENEMY_DEFINITIONS[type].hp;
for (const profile of ['exploration', 'v7']) for (const archetype of profile === 'v7' ? Object.keys(PACKS) : ['basic', 'wound']) for (const strategy of ['heuristic', 'competent']) {
  for (let seed = 5110001; seed <= 5110080; seed++) {
    const logs = [];
    if (profile === 'v7') {
      let s;
      const getHp = type => s.depth === 8 && s.wave >= 2 && curve?.[profile].reserveHp?.[type] || hp(type, s.depth, profile);
      const overlay = { ...p, createEnemyState: type => ({ ...p.createEnemyState(type), hp: getHp(type), maxHp: getHp(type) }) };
      s = new LevelSession(overlay, createModel(p, config), config, seed, archetype === 'basic' ? 'wound' : archetype, 'nine-linked', settings);
      for (let step = 0; step < 250 && !['victory', 'defeat', 'timeout'].includes(s.phase); step++) {
        if (s.phase === 'combat') {
          const observation = observe(s); observation.archetype = archetype;
          if (archetype === 'basic') observation.stock = Object.fromEntries(Object.entries(observation.stock).filter(([id]) => BASIC_IDS.has(id) || id === 'flatNose'));
          const rounds = choose(observation, strategy, s.model, p, rng(seed ^ step));
          const row = s.fire(rounds);
          logs.push({ depth: row.depth, wave: row.wave, turn: row.turn, type: row.before.enemy.type, hp: row.before.enemy.hp, maxHp: row.before.enemy.maxHp,
            won: row.shot.killed, died: row.action?.playerKilled ?? false, rounds: row.shot.rounds, damage: row.shot.damage, potential: row.shot.potential,
            special: row.shot.special, action: row.action?.selectedAction, activated: activated(archetype, row.shot) });
          s.logs.length = 0;
        } else if (archetype === 'basic' && s.phase === 'reward') s.chooseReward(s.node.offers.includes('relay') ? 'relay' : s.node.offers.includes('opening') ? 'opening' : s.node.offers[0]);
        else if (archetype === 'basic' && s.phase === 'workshop') {
          if (s.run.stock.relay > 0) s.upgrade('relay'); s.reinforce(s.run.stock.relay > 0 ? 'relay' : 'opening'); s.leave();
        } else autoNoncombat(s, 'competent');
      }
      rows.push({ seed, profile, archetype, strategy, won: s.phase === 'victory', reached: s.depth, logs, stock: s.run.stock, ranks: s.run.ranks });
    } else {
      const run = new p.ExplorationRun(`hp-${seed}`), player = new p.Player(), model = productionModel(p); player.startRun('exploration', 'p220');
      let won = true;
      for (let depth = 1; depth <= 9; depth++) {
        const node = run.enter(seed % run.routes.length);
        if (node.kind === 'combat') {
          const inventory = { archetype, weapon: 'p220', stock: Object.fromEntries(Object.entries(player.getBuild()).filter(([id, count]) => count > 0 && (archetype !== 'basic' || BASIC_IDS.has(id) || id === 'flatNose'))), owned: player.getOwnedAttachments(), loadout: player.loadout.getSnapshot(), ranks: {} };
          const value = hp(node.enemy, depth, profile), enemy = { ...p.createEnemyState(node.enemy), hp: value, maxHp: value };
          const result = combat(inventory, enemy, model, p, strategy, seed, { trace: true });
          logs.push(...result.history.map((row, index) => ({ depth, wave: 0, turn: index + 1, type: node.enemy, hp: row.shot.result.shots[0]?.before.hp ?? enemy.hp, maxHp: value,
            won: row.shot.killed, died: row.action?.playerKilled ?? false, rounds: row.shot.rounds, damage: row.shot.damage, potential: row.shot.potential,
            special: row.shot.special, action: row.action?.selectedAction, activated: activated(archetype, row.shot) })));
          if (!result.won) { won = false; break; }
          const list = archetype === 'basic' ? ['relay', 'opening', 'lowRecoil'] : ['wounding', 'laceration', 'retreat', 'hammer', 'plusP', 'relay'];
          const chosen = [...node.rewards].sort((a, b) => (list.indexOf(a) < 0 ? 99 : list.indexOf(a)) - (list.indexOf(b) < 0 ? 99 : list.indexOf(b)))[0];
          if (chosen) player.exchangeAmmo([], [chosen]); run.settleCombat();
        } else if (node.kind === 'merchant') buyProductionBundle(player, node, archetype);
        run.leave();
      }
      rows.push({ seed, profile, archetype, strategy, won, reached: run.depth, logs });
    }
  }
  const cell = rows.filter(row => row.profile === profile && row.archetype === archetype && row.strategy === strategy);
  console.log(`${id}/${profile}/${archetype}/${strategy}: ${cell.filter(row => row.won).length}/${cell.length}`);
}
const output = new URL('tools/hp-balance/results/', root); await mkdir(output, { recursive: true });
await writeFile(new URL(`${id}-campaign.json.gz`, output), gzipSync(JSON.stringify(rows)));
