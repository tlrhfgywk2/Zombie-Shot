import { rng, shuffle, pick } from './random.mjs';
import { ARCHETYPES, UPGRADE_PRIORITY, initialRun, capacity, expand, total, heuristicOrder, selectMagazine, oriented } from './model-portable.mjs';
import { PACKS, makePlan, DEFAULT_SETTINGS } from './design.mjs';

export const clone = value => JSON.parse(JSON.stringify(value));
export function activate(id, shot) {
  return shot.trace.some(t => id === 'wound' ? t.vulnerableFactor > 1 : id === 'heat' ? t.thermal > 0
    : id === 'blast' ? t.explosion > 0 : id === 'recoil' ? t.converted > 0
    : id === 'cauterize' ? t.id === 'cauterize' && t.thermal > 0 : t.id === 'resonance' && t.shockConsumed > 0 && t.explosion > 0);
}
export function coherent(run) {
  return oriented(expand(run.stock)) && total(run.stock) >= 2;
}
export function complete(run) {
  const counts = {}; for (const id of PACKS[run.archetype]) counts[id] = (counts[id] ?? 0) + 1;
  return Object.entries(counts).every(([id, n]) => run.stock[id] >= n);
}
export function templates(observation, p) {
  const { stock, enemy } = observation, cap = capacity(observation, p, observation.player);
  const pool = expand(stock), preferred = ARCHETYPES[observation.archetype];
  const fill = prefix => {
    const available = { ...stock }, rounds = [];
    for (const id of prefix) if (id === 'ball' || available[id] > 0) {
      rounds.push(id); if (id !== 'ball') available[id]--;
      if (rounds.length === cap) break;
    }
    return rounds.concat(Array(cap - rounds.length).fill('ball'));
  };
  const sequences = [[], PACKS[observation.archetype],
    ['opening', ...PACKS[observation.archetype]], ['wounding', 'wounding', 'laceration', 'mimic'],
    ['accelerant', 'incendiary', 'ignition', 'mimic'], ['stickyCharge', 'explosive', 'flatNose'],
    ['plusP', 'plusP', 'kickback', 'mimic'], ['wounding', 'incendiary', 'cauterize'],
    ['flatNose', 'stickyCharge', 'resonance'],
    ['flatNose', 'flatNose', 'retreat', 'ball'], ['advance', ...PACKS[observation.archetype]],
    [...pool].sort((a, b) => preferred.indexOf(a) - preferred.indexOf(b))];
  if (enemy.vulnerableTurns > 0) sequences[3] = ['laceration', 'mimic', 'plusP'];
  if (enemy.burn > 0) sequences[4] = ['ignition', 'cauterize', 'ball'];
  return [...new Map(sequences.map(fill).map(rounds => [rounds.join(','), rounds])).values()];
}
// 정책에는 이 관측 목록만 전달한다. 계획·시드·미래 보상은 전달하지 않는다.
export function observe(state) {
  return clone({ archetype: state.run.archetype, weapon: state.run.weapon, stock: state.available,
    ranks: state.run.ranks, owned: state.run.owned, loadout: state.run.loadout, enemy: state.enemy, player: state.player });
}
export function chooseRounds(observation, strategy, model, p, random) {
  const cap = capacity(observation, p, observation.player), pool = [...expand(observation.stock), ...Array(cap).fill('ball')];
  if (strategy === 'random') return shuffle(pool, random).slice(0, cap);
  if (strategy === 'damage') {
    // 현재 상태의 단발 직접 화력만 비교한다. 저장/후속/행동 가치는 읽지 않는다.
    return pool.map((id, i) => ({ id, i, value: model.resolve([id], { ...observation.enemy, hp: 1e6 }, observation, { player: observation.player, trace: true }).trace[0].direct }))
      .sort((a, b) => b.value - a.value || a.i - b.i).slice(0, cap).map(x => x.id);
  }
  if (strategy === 'heuristic') {
    const list = ARCHETYPES[observation.archetype];
    const score = id => list.includes(id) ? 20 - list.indexOf(id) : id === 'ball' ? 0 : 1;
    return heuristicOrder([...pool].sort((a, b) => score(b) - score(a)).slice(0, cap));
  }
  // 현재 적에 대한 두 턴 기본탄 미리보기만 사용한다. 다음 적과 보상은 보지 않는다.
  const basic = Array(cap).fill('ball'), firstBasic = model.resolve(basic, observation.enemy, observation, { player: observation.player });
  if (firstBasic.killed) return basic;
  const firstAction = model.action(firstBasic.after, observation.player, observation.loadout);
  if (!firstAction.playerKilled && !firstAction.intentResolved && model.resolve(Array(capacity(observation, p, firstAction.playerAfter)).fill('ball'), firstAction.after, observation,
    { player: firstAction.playerAfter }).killed) return basic;
  if (strategy === 'optimized') return selectMagazine(observation.stock, cap, observation, observation.enemy, model, 'search', random, { player: observation.player, candidates: 128 });
  const score = rounds => {
    const shot = model.resolve(rounds, observation.enemy, observation, { player: observation.player });
    const action = model.action(shot.after, observation.player, observation.loadout);
    return (shot.killed ? 100000 : 0) - (action.playerKilled ? 1000000 : 0) + shot.damage * 10
      + (action.interrupted ? 25 : 0) + shot.after.distance - shot.special * (shot.killed ? 12 : 1);
  };
  return templates(observation, p).sort((a, b) => score(b) - score(a))[0];
}
export class LevelSession {
  constructor(p, model, config, seed, archetype, variant = 'nine-linked', settings = DEFAULT_SETTINGS) {
    this.p = p; this.model = model; this.config = config; this.seed = seed; this.variant = variant; this.settings = settings;
    this.run = initialRun(archetype); this.plan = makePlan(seed, variant, p, settings); this.random = rng(seed ^ 4242);
    this.depth = 0; this.phase = 'ready'; this.available = {}; this.player = p.createPlayerCombatState(); this.logs = []; this.rewards = [];
    this.directionByMiddle = false; this.completeByLate = false; this.upgrades = 0; this.victories = 0;
  }
  advance() {
    if (!['ready', 'advance'].includes(this.phase)) return false;
    this.node = this.plan[this.depth++];
    if (!this.node) throw new Error('노드 범위 초과');
    this.phase = this.node.kind;
    if (this.node.kind === 'exit') { this.phase = 'victory'; return true; }
    if (this.node.kind === 'combat') {
      this.available = { ...this.run.stock }; this.player = this.p.createPlayerCombatState(); this.wave = 0; this.turn = 1; this.spawn();
    }
    const mid = this.plan.length === 12 ? 7 : 5, late = this.plan.length === 12 ? 9 : 6;
    if (this.depth === mid) this.directionByMiddle = coherent(this.run);
    if (this.depth === late) this.completeByLate = complete(this.run);
    return true;
  }
  spawn() {
    const wave = this.node.waves[this.wave];
    const state = this.p.createProgressionEnemyState
      ? this.p.createProgressionEnemyState(wave.enemy, this.depth, 'v7', this.depth === 8 && this.wave >= 2)
      : this.p.createEnemyState(wave.enemy);
    this.enemy = { ...state, distance: wave.distance }; this.phase = 'combat';
  }
  add(id) { if (total(this.run.stock) < 14) this.run.stock[id] = (this.run.stock[id] ?? 0) + 1; }
  chooseDiscovery(build) {
    if (this.phase !== 'discovery' || !PACKS[build]) return false;
    this.discovery = build;
    this.run.archetype = build;
    for (const id of PACKS[build].slice(0, 2)) this.add(id);
    this.rewards.push({ depth: this.depth, kind: 'discovery', chosen: build, rejected: Object.keys(PACKS).filter(id => id !== build) });
    this.phase = 'advance'; return true;
  }
  chooseReward(id) {
    if (this.phase !== 'reward' || !this.node.offers.includes(id)) return false;
    this.add(id);
    if (this.victories === 2 && this.discovery) this.add(PACKS[this.discovery][2]);
    this.rewards.push({ depth: this.depth, kind: 'ammo', chosen: id, rejected: this.node.offers.filter(x => x !== id) });
    this.phase = 'advance'; return true;
  }
  upgrade(id) {
    if (this.phase !== 'workshop' || this.workshopUsed === this.depth || !(this.run.stock[id] > 0) || (this.run.ranks[id] ?? 0) >= 3 || this.upgrades >= this.settings.workshopRanks) return false;
    this.run.ranks[id] = (this.run.ranks[id] ?? 0) + 1; this.upgrades++; this.workshopUsed = this.depth; return true;
  }
  reinforce(id) {
    if (!this.settings.reinforcement || this.depth !== 7 || this.phase !== 'workshop' || this.reinforced || !(this.run.stock[id] > 0) || total(this.run.stock) >= 14) return false;
    this.add(id); this.reinforced = true;
    this.rewards.push({ depth: this.depth, kind: 'reinforcement', chosen: id, rejected: Object.keys(this.run.stock).filter(key => this.run.stock[key] > 0 && key !== id) });
    return true;
  }
  tradeAttachment(id, payment) {
    if (this.phase !== 'workshop' || this.tradeUsed === this.depth || !this.node.attachments.includes(id) || !(this.run.stock[payment] > 0)) return false;
    this.run.stock[payment]--; this.run.owned.push(id); this.run.loadout[this.p.ATTACHMENT_DEFINITIONS[id].slot] = id;
    this.rewards.push({ depth: this.depth, kind: 'attachment', chosen: id, payment, rejected: this.node.attachments.filter(x => x !== id) });
    this.tradeUsed = this.depth; return true;
  }
  leave() {
    if (['workshop', 'supply', 'rest'].includes(this.phase)) { this.phase = 'advance'; return true; }
    return false;
  }
  fire(rounds, annotate) {
    if (this.phase !== 'combat' || rounds.length > capacity(this.run, this.p, this.player)) throw new Error('발사 불가');
    const reserved = {};
    for (const id of rounds) if (id !== 'ball') { reserved[id] = (reserved[id] ?? 0) + 1; if (reserved[id] > (this.available[id] ?? 0)) throw new Error('탄약 부족'); }
    const before = observe(this), shot = this.model.resolve(rounds, this.enemy, this.run, { player: this.player, trace: true });
    for (const id of shot.rounds) if (id !== 'ball') this.available[id]--;
    this.enemy = shot.after;
    const action = shot.killed ? null : this.model.action(this.enemy, this.player, this.run.loadout);
    if (action) { this.enemy = action.after; this.player = action.playerAfter; }
    const row = { depth: this.depth, wave: this.wave, role: this.node.waves[this.wave].role, turn: this.turn, before, rounds: [...rounds],
      shot, action, unused: rounds.slice(shot.fired), ...annotate?.(before, rounds, shot) };
    this.logs.push(row);
    if (action?.playerKilled) this.phase = 'defeat';
    else if (shot.killed) {
      if (++this.wave < this.node.waves.length) { this.turn = 1; this.spawn(); }
      else { this.victories++; this.run.victories++; this.phase = this.node.offers.length ? 'reward' : 'advance'; }
    } else if (this.turn++ >= 12) this.phase = 'timeout';
    return row;
  }
}
export function rewardChoice(offers, observation, strategy, random) {
  if (!offers.length) return undefined;
  if (strategy === 'random') return pick(offers, random);
  const list = ARCHETYPES[observation.archetype];
  return [...offers].sort((a, b) => {
    const value = id => (list.includes(id) ? 12 - list.indexOf(id) : 0) - (observation.stock[id] ?? 0) * 2;
    return value(b) - value(a);
  })[0];
}
export function autoNoncombat(session, strategy) {
  if (['ready', 'advance'].includes(session.phase)) return session.advance();
  if (session.phase === 'discovery') return session.chooseDiscovery(strategy === 'random' ? pick(Object.keys(PACKS), session.random) : session.run.archetype);
  if (session.phase === 'reward') return session.chooseReward(rewardChoice(session.node.offers, session.run, strategy, session.random));
  if (session.phase === 'supply') {
    const id = rewardChoice(session.node.offers, session.run, strategy, session.random); if (id) session.add(id); return session.leave();
  }
  if (session.phase === 'workshop') {
    const priorities = strategy === 'random' ? [...new Set(Object.values(UPGRADE_PRIORITY).flat())]
      : session.run.archetype === 'recoil' ? ['plusP', 'kickback', 'relay'] : UPGRADE_PRIORITY[session.run.archetype];
    const choices = priorities.filter(id => session.run.stock[id] > 0 && (session.run.ranks[id] ?? 0) < 3);
    session.upgrade(strategy === 'random' ? pick(choices, session.random) : choices[0]);
    const ownedAmmo = Object.keys(session.run.stock).filter(id => session.run.stock[id] > 0);
    session.reinforce(strategy === 'random' ? pick(ownedAmmo, session.random) : priorities.find(id => session.run.stock[id] > 0));
    const expendable = Object.keys(session.run.stock).filter(id => session.run.stock[id] > 0 && (strategy === 'random' || !PACKS[session.run.archetype].includes(id)));
    if (expendable.length && session.node.attachments.length) {
      const id = strategy === 'random' ? pick(session.node.attachments, session.random) : [...session.node.attachments].sort((a, b) => {
        const score = key => key.includes('Magazine') ? 5 : key === 'texturedGrip' && session.run.archetype === 'recoil' ? -1 : key === 'reflexSight' ? 3 : 1;
        return score(b) - score(a);
      })[0];
      session.tradeAttachment(id, strategy === 'random' ? pick(expendable, session.random) : expendable[0]);
    }
    return session.leave();
  }
  return session.leave();
}
