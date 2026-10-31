import { LevelSession, autoNoncombat, observe, chooseRounds } from '../../experiments/level-v7/engine.mjs';
import { createModel } from '../../simulation/model.mjs';
import { BASIC_IDS } from './combat.mjs';
export function collectV7(seed, build, p, config, settings) {
  const actualBuild = build === 'basic' ? 'wound' : build;
  const session = new LevelSession(p, createModel(p, config), config, seed, actualBuild, 'nine-linked', settings);
  const records = [];
  for (let step = 0; step < 200 && !['victory', 'defeat', 'timeout'].includes(session.phase); step++) {
    if (session.phase === 'combat') {
      if (session.turn === 1) {
        const label = session.depth === 1 ? 'entry' : session.depth === 3 ? 'early' : session.depth === 5 || session.depth === 6 ? 'middle' : session.depth === 8 && session.wave >= 1 ? 'late' : null;
        if (label) records.push({ label, depth: session.depth, reserve: session.depth === 8 && session.wave >= 2, enemy: structuredClone(session.enemy), inventory: { ...structuredClone(session.run), archetype: build,
          stock: Object.fromEntries(Object.entries(session.available).filter(([id]) => build !== 'basic' || BASIC_IDS.has(id) || id === 'flatNose')) } });
      }
      session.fire(chooseRounds(observe(session), 'competent', session.model, p, session.random));
    } else if (build === 'basic' && session.phase === 'reward') {
      const chosen = session.node.offers.includes('relay') ? 'relay' : session.node.offers.includes('opening') ? 'opening' : session.node.offers[0];
      session.chooseReward(chosen);
    } else if (build === 'basic' && session.phase === 'workshop') {
      if (session.run.stock.relay > 0) session.upgrade('relay');
      session.reinforce(session.run.stock.relay > 0 ? 'relay' : 'opening');
      session.leave();
    } else autoNoncombat(session, 'competent');
  }
  return records;
}
export function collectProduction(seed, build, p) {
  const run = new p.ExplorationRun(`hp-${seed}`), player = new p.Player(); player.startRun('exploration', 'p220');
  const records = [];
  for (let index = 0; index < 9; index++) {
    const node = run.enter(seed % run.routes.length);
    if (node.kind === 'combat') {
      const depth = run.depth, label = depth === 1 ? 'entry' : depth === 3 ? 'early' : depth === 5 || depth === 6 ? 'middle' : depth === 8 ? 'late' : null;
      if (label) records.push({ label, depth, enemy: p.createEnemyState(node.enemy), inventory: { archetype: build === 'basic' ? 'basic' : 'wound', weapon: 'p220', stock: Object.fromEntries(Object.entries(player.getBuild()).filter(([id, n]) => n > 0 && (build !== 'basic' || BASIC_IDS.has(id) || id === 'flatNose'))), loadout: player.loadout.getSnapshot(), owned: player.getOwnedAttachments(), ranks: {} } });
      // 획득 천장 표본. 실제 순차 생존은 별도로 실행하며 이 재고를 사망 런에 부여하지 않는다.
      const preference = build === 'basic' ? ['relay', 'opening', 'lowRecoil'] : ['wounding', 'laceration', 'retreat', 'hammer', 'plusP', 'relay'];
      const selected = [...node.rewards].sort((a, b) => (preference.indexOf(a) < 0 ? 99 : preference.indexOf(a)) - (preference.indexOf(b) < 0 ? 99 : preference.indexOf(b)))[0];
      if (selected) player.exchangeAmmo([], [selected]);
      run.settleCombat();
    } else if (node.kind === 'merchant') {
      buyProductionBundle(player, node, build);
    }
    run.leave();
  }
  return records;
}
export function buyProductionBundle(player, node, build) {
  const target = node.rewards[0];
  const wanted = build === 'basic' ? ['opening', 'relay'] : ['wounding', 'laceration', 'plusP', 'retreat', 'hammer'];
  if (!wanted.includes(target)) return;
  const stock = player.getBuild(), payment = stock.flatNose > 0 ? 'flatNose' : stock.opening > 0 ? 'opening' : Object.keys(stock).find(id => stock[id] > 0 && !wanted.includes(id));
  if (payment) player.exchangeAmmo([payment], [target, target, target]);
}
