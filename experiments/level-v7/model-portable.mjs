// 생성 파일: tools/level-v7/prepare.mjs, 원본 SHA256 de192a2262bf3c0477fa3379a8068f04176a97dcfb0a1d7b40abf21b1fd636b2
import { pick, rng, shuffle } from './random.mjs';

// [family, direct, recoil, primary, amount, rarity]. All costs are real rounds.
export const AMMO = {
  ball: ['health', 5, 1, 'power', 5, 'common'],
  opening: ['health', 3, 1, 'power', 3, 'common'],
  plusP: ['health', 8, 3, 'power', 8, 'common'],
  lowRecoil: ['health', 3, 0, 'power', 3, 'common'],
  relay: ['health', 2, 0, 'power', 2, 'common'],
  kickback: ['health', 2, 0, 'power', 2, 'common'],
  retreat: ['health', 3, 1, 'power', 3, 'common'],
  advance: ['health', 6, 2, 'power', 6, 'common'],
  mimic: ['health', 0, 1, 'power', 0, 'uncommon'],
  afterimage: ['health', 1, 0, 'power', 1, 'uncommon'],
  wounding: ['wound', 2, 1, 'wound', 3, 'common'],
  laceration: ['health', 6, 1, 'power', 6, 'common'],
  incendiary: ['heat', 3, 1, 'heat', 8, 'common'],
  accelerant: ['heat', 1, 1, 'heat', 2, 'uncommon'],
  ignition: ['heat', 1, 1, 'heat', 0, 'common'],
  cauterize: ['heat', 4, 1, 'power', 4, 'uncommon'],
  explosive: ['blast', 3, 1, 'charge', 2, 'common'],
  stickyCharge: ['blast', 1, 2, 'charge', 4, 'common'],
  flatNose: ['shock', 1, 1, 'shock', 4, 'common'],
  resonance: ['shock', 1, 1, 'shock', 2, 'uncommon'],
};
export const ARCHETYPES = {
  wound: ['wounding', 'laceration', 'relay', 'mimic', 'lowRecoil', 'retreat'],
  heat: ['incendiary', 'ignition', 'accelerant', 'mimic', 'lowRecoil', 'retreat'],
  blast: ['stickyCharge', 'explosive', 'flatNose', 'mimic', 'lowRecoil', 'retreat'],
  recoil: ['plusP', 'kickback', 'relay', 'mimic', 'lowRecoil', 'retreat'],
  cauterize: ['wounding', 'incendiary', 'cauterize', 'ignition', 'laceration', 'accelerant'],
  concussion: ['flatNose', 'stickyCharge', 'resonance', 'explosive', 'mimic', 'retreat'],
};
export const UPGRADE_PRIORITY = {
  wound: ['laceration', 'wounding', 'relay'], heat: ['incendiary', 'ignition', 'accelerant'],
  blast: ['stickyCharge', 'explosive', 'flatNose'], recoil: ['kickback', 'plusP', 'relay'],
  cauterize: ['cauterize', 'incendiary', 'wounding'], concussion: ['resonance', 'stickyCharge', 'flatNose'],
};
export const total = stock => Object.values(stock).reduce((a, b) => a + b, 0);
export const expand = stock => Object.entries(stock).flatMap(([id, n]) => Array(n).fill(id));
export function initialRun(archetype, weapon = 'p220') {
  const starts = { p220: { opening: 1, flatNose: 2 }, m1911: { opening: 1, wounding: 2 }, desertEagle: { plusP: 1, lowRecoil: 2 }, m500: { opening: 1, relay: 1 } };
  // Removed starting IDs get their closest retained role; no extra resources.
  return { archetype, weapon, stock: { ...starts[weapon] }, ranks: {}, owned: [], loadout: {}, victories: 0, upgrades: 0 };
}
export function rewardTape(seed, p, config = {}) {
  const random = rng(seed), attachmentRandom = rng(seed ^ 0x5a5a5a5a), owned = [];
  const draft = shuffle(['wounding', 'incendiary', 'stickyCharge', 'plusP'], rng(seed ^ 10101)).slice(0, 3);
  const pair = { wounding: 'laceration', incendiary: 'ignition', stickyCharge: 'flatNose', plusP: 'kickback' };
  return Array.from({ length: 18 }, (_, i) => {
    const pool = Object.keys(AMMO).filter(id => id !== 'ball'), offers = [];
    for (let choice = 0; choice < 3; choice++) {
      const rarity = random() < .75 ? 'common' : 'uncommon';
      const preferred = pool.filter(id => AMMO[id][5] === rarity);
      const id = pick(preferred.length ? preferred : pool, random);
      offers.push(id); pool.splice(pool.indexOf(id), 1);
    }
    const attachment = (i + 1) % 3 === 0 ? p.generateAttachmentReward(owned, 'p220', attachmentRandom) : undefined;
    if (attachment) owned.push(attachment);
    // Independent of policy/rewards. First actual encounter is the actual normal at 8m.
    const enemyRandom = rng(seed ^ Math.imul(i + 1, 7919));
    const enemy = i === 0 ? 'normal' : pick(Object.keys(p.ENEMY_DEFINITIONS), enemyRandom);
    const distance = i === 0 ? 8 : pick([3, 6, 10], enemyRandom);
    return { offers: config.linkedDraft && i < 2 ? i === 0 ? draft : draft.map(id => pair[id]) : offers, attachment, enemy, distance };
  });
}
export function reward(run, tape, config, p, strategy = 'heuristic', random = rng(1)) {
  const list = ARCHETYPES[run.archetype];
  const preference = id => {
    const at = list.indexOf(id);
    return at < 0 ? -2 : 12 - at - (run.stock[id] ?? 0) * 2;
  };
  const id = strategy === 'random' ? pick(tape.offers, random) : [...tape.offers].sort((a, b) => preference(b) - preference(a))[0];
  if (total(run.stock) >= 14) {
    const remove = Object.keys(run.stock).filter(key => run.stock[key] > 0).sort((a, b) => preference(a) - preference(b))[0];
    if (preference(id) > preference(remove) || strategy === 'random') { run.stock[remove]--; run.stock[id] = (run.stock[id] ?? 0) + 1; }
  } else run.stock[id] = (run.stock[id] ?? 0) + 1;
  run.victories++;
  if (tape.attachment && p.ATTACHMENT_DEFINITIONS[tape.attachment].compatibleWeapons.includes(run.weapon)) {
    run.owned.push(tape.attachment);
    const item = p.ATTACHMENT_DEFINITIONS[tape.attachment];
    run.loadout[item.slot] = item.id;
  }
  if (run.victories % config.upgradeEvery === 0) {
    const priority = config.pressureFirst && run.archetype === 'recoil' ? ['plusP', 'kickback', 'relay'] : UPGRADE_PRIORITY[run.archetype];
    const eligible = priority.filter(key => run.stock[key] > 0 && (run.ranks[key] ?? 0) < config.maxRank);
    const chosen = strategy === 'random' ? pick(eligible, random) : eligible[0];
    if (chosen) { run.ranks[chosen] = (run.ranks[chosen] ?? 0) + 1; run.upgrades++; }
  }
}
export function acquired(seed, stage, archetype, config, p, strategy = 'heuristic') {
  const run = initialRun(archetype), tape = rewardTape(seed, p, config), random = rng(seed ^ 4321);
  for (let i = 0; i < stage - 1; i++) reward(run, tape[i], config, p, strategy, random);
  return run;
}
export function capacity(run, p, player) {
  const weapon = p.WEAPON_DEFINITIONS[run.weapon];
  const mod = Object.values(run.loadout).filter(id => !(player?.disabledSlots[p.ATTACHMENT_DEFINITIONS[id].slot] > 0)).flatMap(id => p.ATTACHMENT_DEFINITIONS[id].modifiers).filter(x => x.kind === 'capacity').reduce((s, x) => s + x.value, 0);
  return Math.min(weapon.maximumMagazineCapacity, weapon.baseMagazineCapacity + mod);
}
export function createModel(p, config) {
  const actionResolver = new p.CombatResolver(() => .5);
  function resolve(rounds, enemy, run, options = {}) {
    const after = { ...enemy, intent: enemy.intent ? { ...enemy.intent } : undefined };
    // The production resolver commits the enemy action before the first shot.
    // Movement can delay that action; it must not silently choose a cheaper one.
    if (!after.telegraphedAction) {
      const action = p.previewEnemyAction(enemy);
      after.telegraphedAction = action.suppressedIntent ?? action.selectedAction;
    }
    let recoil = 0, incomingPower = 0, incomingHeat = 1, previous, previousFamily, loss = 0;
    const trace = [];
    let damage = 0, fired = 0, special = 0, potential = 0;
    const player = options.player ?? p.createPlayerCombatState();
    const mods = Object.values(run.loadout).filter(id => !(player.disabledSlots[p.ATTACHMENT_DEFINITIONS[id].slot] > 0)).flatMap(id => p.ATTACHMENT_DEFINITIONS[id].modifiers);
    const modifier = (kind, band) => mods.filter(m => m.kind === kind && (!m.condition?.range || m.condition.range === (band === 'melee' ? 'near' : band))).reduce((s, m) => s + m.value, 0);
    const weapon = p.WEAPON_DEFINITIONS[run.weapon];
    for (let index = 0; index < rounds.length && after.hp > 0; index++) {
      const id = rounds[index], [family, base, kick, primary, value] = AMMO[id];
      const rank = run.ranks[id] ?? 0;
      const before = options.trace ? { ...after } : null;
      const wasVulnerable = after.vulnerableTurns > 0;
      if (id === 'advance') after.distance = Math.max(0, after.distance - 2);
      const band = after.distance < 1 ? 'melee' : after.distance < 4 ? 'near' : after.distance < 8 ? 'mid' : 'far';
      const rangeOrder = ['melee', 'near', 'mid', 'far'];
      const effectiveBand = rangeOrder[Math.min(3, rangeOrder.indexOf(band) + (player.rangePenaltySteps ?? 0))];
      const rangePercent = Math.max(0, weapon.rangePenaltyPercentages[effectiveBand] - modifier('rangePenaltyReductionPercent', effectiveBand));
      const raw = { power: Math.max(0, base + weapon.firepowerAdjustment + (id === 'ball' ? 0 : 2 * rank)), wound: 0, heat: 0, charge: 0, shock: 0 };
      if (id === 'flatNose' && config.flatPower) raw.power += config.flatPower - base;
      if (primary === 'power' && !['ball', 'mimic', 'afterimage'].includes(id)) raw.power = Math.max(0, base + weapon.firepowerAdjustment + config.directRank * rank);
      if (primary !== 'power') raw[primary] = value + rank * (primary === 'heat' ? config.heatRank : primary === 'charge' ? config.chargeRank : primary === 'wound' ? 1 : 2);
      if (id === 'ignition') raw.heat = 0;
      if (id === 'laceration') raw.wound = config.lacerationWound ?? 0;
      if (weapon.trait === 'familyChain' && previousFamily === family) raw[primary]++;
      if (weapon.trait === 'cylinder' && index === 0 && options.boostedOpening) raw[primary] = Math.round(raw[primary] * 1.5);
      if (id === 'opening' && index === 0) raw.power += 3 + 2 * rank;
      if (id === 'lowRecoil') recoil = Math.max(0, recoil - 2 - rank);
      let converted = 0;
      if (id === 'kickback') { converted = recoil * (config.ventFactor + rank); raw.power += converted; recoil = 0; }
      if (id === 'mimic') { for (const key of Object.keys(raw)) raw[key] = previous?.[key] ?? 0; }
      if (id === 'afterimage' && previous) for (const key of Object.keys(raw)) raw[key] += Math.floor(previous[key] / 2);
      raw.power += incomingPower;
      raw.heat = Math.floor(raw.heat * incomingHeat);
      incomingPower = id === 'relay' ? 4 + config.directRank * rank + modifier('followUpEffect') : 0;
      incomingHeat = id === 'accelerant' ? 2 + .5 * rank : 1;
      // A value snapshot, never the rule, movement, consumption, thermal burst or detonation.
      if (config.primaryOnly && id !== 'mimic') {
        const copiedKeys = id === 'afterimage' ? Object.keys(previous ?? {}).filter(key => previous[key] > 0) : [];
        previous = Object.fromEntries(Object.keys(raw).map(key => [key, key === primary || copiedKeys.includes(key) ? raw[key] : 0]));
      } else previous = { ...raw };
      previousFamily = family;
      const generated = Math.max(0, (weapon.trait === 'standardBall' && id === 'ball' ? 0 : kick + (kick > 0 ? weapon.recoilAdjustment : 0)) - modifier('recoilReduction') - (kick >= 3 ? modifier('highRecoilReduction') : 0));
      const oldRecoil = recoil;
      recoil += generated;
      const threshold = weapon.recoilThreshold + modifier('recoilThreshold');
      const penalty = id === 'kickback' ? 0 : Math.min(3, Math.ceil(Math.max(0, (weapon.trait === 'deferredRecoil' ? oldRecoil : recoil) - threshold) / 2));
      const debuff = id !== 'kickback' && oldRecoil > 0 ? player.heavyKickPenaltyBonus ?? 0 : 0;
      let direct = Math.max(0, raw.power - penalty - debuff);
      if (config.vulnerableAttachment && wasVulnerable && raw.power > 0) direct += modifier('vulnerableEffect');
      const vulnerableFactor = wasVulnerable ? id === 'laceration' ? 2 + config.vulnerableRank * rank : 1.5 : 1;
      direct = Math.floor(direct * vulnerableFactor + .5);
      let thermal = 0, heatConsumed = 0, shockConsumed = 0;
      if (id === 'ignition' || id === 'cauterize' && (wasVulnerable || after.wound >= (config.cauterizeWoundGate ?? Infinity)) && !options.ablate) {
        heatConsumed = after.burn;
        thermal = Math.floor(heatConsumed * (config.thermalFactor + rank) * (id === 'cauterize' ? 1.5 : 1));
        after.burn = 0; after.ignitedActions = 0;
      }
      if (id === 'resonance' && after.explosive > 0 && !options.ablate) {
        shockConsumed = after.actionShock;
        after.explosive += shockConsumed * (config.shockChargeFactor + rank);
        after.actionShock = 0;
      }
      const preRange = direct + thermal;
      const nextLoss = loss + preRange * rangePercent;
      const ranged = preRange - (Math.round(nextLoss / 100) - Math.round(loss / 100));
      loss = nextLoss;
      after.explosive += raw.charge;
      const shock = raw.shock > 0 ? raw.shock + modifier('impact', band) : 0;
      const chargeConsumed = shock > 0 ? after.explosive : 0;
      const explosion = chargeConsumed * config.explosionFactor;
      after.explosive -= chargeConsumed;
      const power = ranged + explosion;
      const dealt = Math.min(after.hp, power);
      after.hp -= dealt; damage += dealt; potential += power; fired++; if (id !== 'ball') special++;
      if (after.hp > 0) {
        after.burn += raw.heat;
        if (raw.heat > 0 && after.burn >= after.burnThreshold) after.ignitedActions = 1;
        after.wound += raw.wound;
        if (after.wound >= after.woundThreshold) { after.wound %= after.woundThreshold; after.vulnerableTurns = Math.max(after.vulnerableTurns, 2); }
        after.actionShock += shock;
      }
      if (id === 'retreat') after.distance = Math.min(12, after.distance + 2);
      if (options.trace) trace.push({ index, id, rank, before, raw: { ...raw }, recoil, generated, penalty, converted, vulnerableFactor, direct, thermal, heatConsumed, shockConsumed, chargeConsumed, explosion, rangePercent, power, effective: dealt, after: { ...after } });
    }
    return { after, damage, potential, fired, special, trace, rounds: rounds.slice(0, fired), killed: after.hp <= 0 };
  }
  return { resolve, action: (enemy, player, loadout) => actionResolver.resolveEnemyAction(enemy, player, loadout) };
}
export function oriented(rounds) {
  const has = id => rounds.includes(id);
  return has('wounding') && has('laceration') || (has('incendiary') || has('accelerant')) && (has('ignition') || has('cauterize'))
    || (has('stickyCharge') || has('explosive')) && (has('flatNose') || has('resonance'))
    || has('plusP') && has('kickback') || has('relay') && rounds.some(id => ['plusP', 'laceration', 'kickback'].includes(id));
}
export function heuristicOrder(rounds) {
  // A cheap imperfect policy; never reads future rewards or permutations.
  const score = { opening: 0, flatNose: 1, wounding: 2, relay: 3, accelerant: 3, stickyCharge: 4, explosive: 4, incendiary: 5, plusP: 6, lowRecoil: 7, laceration: 8, ignition: 9, cauterize: 9, kickback: 10, resonance: 10, mimic: 11, afterimage: 12, ball: 13, retreat: 14, advance: 0 };
  return [...rounds].sort((a, b) => score[a] - score[b]);
}
export function optimizeOrder(rounds, score, exhaustive = true, random = rng(1)) {
  let best = [...rounds], bestValue = score(best);
  if (rounds.length <= 6 && exhaustive) {
    const counts = {}; for (const id of rounds) counts[id] = (counts[id] ?? 0) + 1;
    const keys = Object.keys(counts), path = [];
    const visit = () => {
      if (path.length === rounds.length) { const value = score(path); if (value > bestValue) { bestValue = value; best = [...path]; } return; }
      for (const id of keys) if (counts[id]) { counts[id]--; path.push(id); visit(); path.pop(); counts[id]++; }
    };
    visit();
  } else {
    for (let i = 0; i < 16; i++) { const trial = shuffle(rounds, random); const value = score(trial); if (value > bestValue) { best = trial; bestValue = value; } }
    for (let pass = 0; pass < 2; pass++) for (let i = 0; i < rounds.length; i++) for (let j = i + 1; j < rounds.length; j++) {
      const trial = [...best]; [trial[i], trial[j]] = [trial[j], trial[i]];
      const value = score(trial); if (value > bestValue) { best = trial; bestValue = value; }
    }
  }
  return best;
}
export function selectMagazine(stock, cap, run, enemy, model, strategy, random, options = {}) {
  const pool = [...expand(stock), ...Array(cap).fill('ball')];
  const grade = id => { const at = ARCHETYPES[run.archetype].indexOf(id); return at < 0 ? id === 'ball' ? 0 : -1 : 10 - at; };
  const evaluate = rounds => {
    const outcome = model.resolve(rounds, enemy, run, options);
    if (options.damageOnly) return model.resolve(rounds, { ...enemy, hp: 1e9, maxHp: 1e9 }, run, options).potential;
    const action = model.action(outcome.after, options.player, run.loadout);
    return (outcome.killed ? 1e6 : 0) - (action.playerKilled ? 1e7 : 0) + outcome.damage * 10
      + (action.interrupted ? 20 : 0) + outcome.after.actionShock + outcome.after.distance
      - outcome.special * (outcome.killed ? 10 : 1);
  };
  if (strategy === 'random') return shuffle(pool, random).slice(0, cap);
  const preferred = heuristicOrder([...pool].sort((a, b) => grade(b) - grade(a)).slice(0, cap));
  if (strategy === 'heuristic') return preferred;
  let best = preferred, bestValue = evaluate(best);
  const candidates = options.candidates ?? 32;
  for (let trial = 0; trial < candidates; trial++) {
    let rounds = trial === 0 ? Array(cap).fill('ball') : shuffle(pool, random).slice(0, cap);
    rounds = heuristicOrder(rounds);
    const value = evaluate(rounds); if (value > bestValue) { best = rounds; bestValue = value; }
  }
  return optimizeOrder(best, evaluate, false, random);
}
export function combat(stock, run, enemy, model, p, strategy, random, options = {}) {
  const available = { ...stock };
  let current = { ...enemy }, player = p.createPlayerCombatState(), roundsFired = 0, specialFired = 0, damage = 0, interruptions = 0;
  const history = [];
  for (let turn = 1; turn <= 12; turn++) {
    const cap = options.cap ?? capacity(run, p, player);
    const rounds = selectMagazine(available, cap, run, current, model, strategy, random, { ...options, player });
    const shot = model.resolve(rounds, current, run, { ...options, player });
    for (const id of shot.rounds) if (id !== 'ball') { if (!(available[id] > 0)) throw new Error('Inventory overdraft'); available[id]--; }
    roundsFired += shot.fired; specialFired += shot.special; damage += shot.damage; current = shot.after;
    if (options.trace) history.push(shot);
    if (shot.killed) return { won: true, turns: turn, roundsFired, specialFired, damage, interruptions, history };
    const action = model.action(current, player, run.loadout);
    current = action.after; player = action.playerAfter; if (action.interrupted) interruptions++;
    if (action.playerKilled) return { won: false, turns: turn, roundsFired, specialFired, damage, interruptions, history };
  }
  return { won: false, turns: 12, roundsFired, specialFired, damage, interruptions, history };
}
