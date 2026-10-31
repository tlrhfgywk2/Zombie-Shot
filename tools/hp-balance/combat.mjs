import { rng, shuffle } from '../../simulation/common.mjs';
import { capacity, expand, heuristicOrder, selectMagazine } from '../../simulation/model.mjs';
export const PACKS = {
  basic: ['opening', 'relay', 'ball'], wound: ['wounding', 'wounding', 'laceration'], heat: ['accelerant', 'incendiary', 'ignition'],
  blast: ['stickyCharge', 'explosive', 'flatNose'], recoil: ['plusP', 'plusP', 'kickback'],
  cauterize: ['wounding', 'incendiary', 'cauterize'], concussion: ['flatNose', 'stickyCharge', 'resonance'],
};
export const BASIC_IDS = new Set(['ball', 'opening', 'relay']);
export function templates(observation, p) {
  const cap = capacity(observation, p, observation.player), stock = observation.stock;
  const fill = prefix => {
    const remaining = { ...stock }, rounds = [];
    for (const id of prefix) if (id === 'ball' || remaining[id] > 0) {
      rounds.push(id); if (id !== 'ball') remaining[id]--;
      if (rounds.length === cap) break;
    }
    return rounds.concat(Array(cap - rounds.length).fill('ball'));
  };
  const pack = PACKS[observation.archetype], pool = expand(stock);
  const sequences = [[], pack, ['opening', ...pack], ['opening', 'relay', 'ball', 'ball', 'relay', 'ball'],
    ['relay', 'relay', 'relay', 'ball', 'ball', 'ball'], ['wounding', 'wounding', 'laceration', 'mimic', 'ball'],
    ['accelerant', 'incendiary', 'ignition', 'ball'], ['stickyCharge', 'explosive', 'flatNose', 'ball'],
    ['plusP', 'plusP', 'plusP', 'kickback'], ['wounding', 'incendiary', 'cauterize', 'ball'],
    ['flatNose', 'stickyCharge', 'resonance', 'ball'], ['flatNose', 'flatNose', 'retreat', 'ball'],
    ['advance', ...pack], ['retreat', ...pack], heuristicOrder(pool), ...pool.map(id => [id])];
  if (observation.enemy.vulnerableTurns > 0) sequences.push(['laceration', 'plusP', 'mimic', 'ball']);
  if (observation.enemy.burn > 0) sequences.push(['ignition', 'cauterize', 'mimic', 'ball']);
  return [...new Map(sequences.map(fill).map(rounds => [rounds.join(','), rounds])).values()];
}
export function choose(observation, strategy, model, p, random = rng(1)) {
  const candidates = templates(observation, p), cap = capacity(observation, p, observation.player);
  if (strategy === 'heuristic') return candidates[1] ?? candidates[0];
  // 기존 v7 숙련 정책과 같은 자원 보존: 현재 적의 안전한 기본탄2턴 처치만 예측한다.
  const basic = Array(cap).fill('ball'), first = model.resolve(basic, observation.enemy, observation, { player: observation.player });
  if (first.killed) return basic;
  const action = model.action(first.after, observation.player, observation.loadout);
  if (!action.playerKilled && !action.intentResolved && model.resolve(Array(capacity(observation, p, action.playerAfter)).fill('ball'), action.after, observation, { player: action.playerAfter }).killed) return basic;
  if (strategy === 'search') {
    if (observation.archetype !== 'basic') candidates.push(selectMagazine(observation.stock, cap, observation, observation.enemy, model, 'search', random, { player: observation.player, candidates: 128 }));
    else for (let i = 0; i < 64; i++) candidates.push(shuffle([...expand(observation.stock), ...Array(cap).fill('ball')], random).slice(0, cap));
  }
  const evaluate = rounds => {
    const shot = model.resolve(rounds, observation.enemy, observation, { player: observation.player });
    const action = model.action(shot.after, observation.player, observation.loadout);
    let value = shot.damage * 10 + Math.min(shot.after.actionShock, 12) + shot.after.distance - shot.special * 3;
    if (shot.killed) value += 1e6 - shot.special * 15;
    else if (action.playerKilled) value -= 1e7;
    else {
      const next = model.resolve(Array(capacity(observation, p, action.playerAfter)).fill('ball'), action.after, observation, { player: action.playerAfter });
      if (next.killed) value += 8e5 - shot.special * 15;
      if (action.interrupted) value += 20;
    }
    return value;
  };
  return candidates.sort((a, b) => evaluate(b) - evaluate(a))[0];
}
export function activated(build, shot) {
  return shot.trace.some(t => build === 'wound' ? t.vulnerableFactor > 1 : build === 'heat' ? t.thermal > 0
    : build === 'blast' ? t.explosion > 0 : build === 'recoil' ? t.converted > 0
    : build === 'cauterize' ? t.id === 'cauterize' && t.thermal > 0 : build === 'concussion' ? t.shockConsumed > 0 && t.explosion > 0 : false);
}
export function combat(inventory, enemy, model, p, strategy, seed, options = {}) {
  const run = structuredClone(inventory), stock = { ...run.stock }, random = rng(seed);
  let current = structuredClone(enemy), player = p.createPlayerCombatState(), shots = 0, special = 0, actions = 0, damage = 0, potential = 0, synergy = 0, interruptions = 0;
  const history = [];
  const finish = (won, turn) => ({ won, turn, shots, special, actions, damage, potential, synergy, interruptions, remainingHp: current.hp, history,
    oneMoreTurnLoss: !won && current.hp > 0 && model.resolve(Array(capacity(run, p, player)).fill('ball'), current, run, { player }).killed });
  for (let turn = 1; turn <= 12; turn++) {
    const observation = { ...run, stock, enemy: current, player };
    const rounds = choose(observation, strategy, model, p, random), shot = model.resolve(rounds, current, run, { player, trace: true });
    for (const id of shot.rounds) if (id !== 'ball') { if (!(stock[id] > 0)) throw new Error('유한 재고 초과'); stock[id]--; }
    shots += shot.fired; special += shot.special; damage += shot.damage; potential += shot.potential; synergy += Number(activated(run.archetype, shot)); current = shot.after;
    const action = shot.killed ? null : model.action(current, player, run.loadout);
    if (options.trace) history.push({ rounds, shot, action, stock: { ...stock } });
    if (shot.killed) return finish(true, turn);
    actions++; interruptions += Number(action.interrupted); current = action.after; player = action.playerAfter;
    if (action.playerKilled) return finish(false, turn);
  }
  return finish(false, 12);
}
export function productionModel(p) {
  const resolver = new p.CombatResolver(() => .5);
  return {
    resolve(rounds, enemy, run, options = {}) {
      const result = resolver.resolveSequence(rounds, enemy, { weaponId: run.weapon, loadout: run.loadout, playerState: options.player, magazineCapacity: capacity(run, p, options.player) });
      const trace = result.shots.map(s => ({ id: s.ammoType, vulnerableFactor: s.breakdown.vulnerableDamageBonus > 0 ? 1.5 : 1, thermal: s.burnDamage,
        explosion: s.explosionDamage, converted: s.ammoType === 'kickback' ? Math.max(0, s.breakdown.effectiveFirepower - 2) : 0, shockConsumed: 0 }));
      return { after: result.finalState, damage: result.totalHpDamage, potential: result.firepowerBreakdown.finalFirepower, fired: result.shots.length,
        special: result.shots.filter(s => s.ammoType !== 'ball').length, rounds: result.shots.map(s => s.ammoType), trace, killed: result.killed, result };
    },
    action: (enemy, player, loadout) => resolver.resolveEnemyAction(enemy, player, loadout),
  };
}
