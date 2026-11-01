import { Encounter } from '../combat/Encounter';
import { CombatResolver, previewEnemyAction, tickPlayerEffects } from '../combat/CombatResolver';
import type { AmmoType, EnemyState, EnemyType } from '../combat/types';
import { Player } from '../entities/Player';
import type { AttachmentId } from '../data/attachmentDefinitions';
import type { WeaponId } from '../data/weaponDefinitions';
import { ENEMY_DEFINITIONS } from '../data/enemyDefinitions';

export const baselineEncounterDistances = (roster: readonly EnemyType[]) => roster.map(type => ENEMY_DEFINITIONS[type].distance);

export interface EncounterScenario {
  id: string;
  roster: readonly EnemyType[];
  reinforcements?: readonly EnemyType[];
  distances?: readonly number[];
  distancePenalty?: number;
}
export type TargetPolicy = 'focus-first' | 'focus-second' | 'nearest' | 'actor' | 'alternate';
export interface EncounterBalanceOptions {
  scenario: EncounterScenario;
  weapon: WeaponId;
  magazines?: readonly (readonly AmmoType[])[];
  openingTargets?: readonly number[];
  policy?: TargetPolicy;
  attachments?: readonly AttachmentId[];
  maxTurns?: number;
}
export interface BalanceShot { ammo: AmmoType; lane: number; type: EnemyType; hpDamage: number; shock: number; killed: boolean }
export interface BalanceTurn {
  turn: number;
  before: EnemyState[];
  actorLane: number | undefined;
  shots: BalanceShot[];
  action: string;
  after: EnemyState[];
}

/** 전투 계산은 실제 Encounter·Player·CombatResolver를 사용한다. 애니메이션과 보상만 생략한다. */
export function simulateEncounterBalance(options: EncounterBalanceOptions) {
  const { scenario, weapon } = options;
  const encounter = new Encounter(scenario.roster, scenario.reinforcements);
  for (const [index, enemy] of encounter.living.entries()) {
    const state = enemy.zombie.snapshot();
    enemy.zombie.applyState({ ...state, distance: Math.max(3, (scenario.distances?.[index] ?? state.distance) - (scenario.distancePenalty ?? 0)) });
  }
  const player = new Player();
  player.selectWeapon(weapon);
  for (const id of options.attachments ?? []) { player.claimAttachment(id); player.equipAttachment(id); }
  const magazines = options.magazines ?? [];
  for (const ammo of magazines.flat()) if (ammo !== 'ball') player.supplyAmmo(ammo);
  const resolver = new CombatResolver(() => .5);
  if (options.policy === 'focus-second' && encounter.living[1]) encounter.select(encounter.living[1].id);
  let shots = 0, specialSpent = 0, enemyActions = 0, interruptions = 0, intents = 0, canceled = 0, dangerTurns = 0;
  let firstKillTurn: number | undefined;
  const trace: BalanceTurn[] = [];
  for (let turn = 0; turn < (options.maxTurns ?? 20) && !encounter.complete && player.isAlive; turn += 1) {
    const actorId = encounter.nextActorId;
    encounter.announceActions();
    const actor = encounter.living.find(enemy => enemy.id === actorId);
    if (actor && previewEnemyAction(actor.zombie.snapshot()).selectedAction === 'attack') dangerTurns += 1;
    const record: BalanceTurn = { turn: turn + 1, before: encounter.living.map(enemy => enemy.zombie.snapshot()), actorLane: actor?.lane, shots: [], action: '', after: [] };
    const rounds = magazines[turn] ?? Array.from({ length: player.magazine.capacity }, () => 'ball' as const);
    for (const ammo of rounds) if (!player.addAmmo(ammo)) throw new Error(`불법 탄창: ${ammo}`);
    const volley = resolver.createVolley(player.magazine.commit());
    while (player.magazine.size && !encounter.complete) {
      const living = encounter.living;
      const requestedLane = turn === 0 ? options.openingTargets?.[volley.index] : undefined;
      const chosen = requestedLane !== undefined ? living.find(enemy => enemy.lane === requestedLane)
        : options.policy === 'nearest' ? [...living].sort((a, b) => a.zombie.distance - b.zombie.distance || a.lane - b.lane)[0]
        : options.policy === 'actor' ? living.find(enemy => enemy.id === actorId)
        : options.policy === 'alternate' ? living.find(enemy => enemy.lane === shots % 2) : undefined;
      if (chosen) encounter.select(chosen.id);
      const target = encounter.selected;
      const shot = resolver.resolveVolleyShot(volley, target.zombie.snapshot(), { weaponId: weapon, playerState: player.getCombatState(), loadout: player.loadout.getSnapshot() });
      player.fireRound(shot);
      encounter.applyShot(target.id, shot);
      record.shots.push({ ammo: shot.ammoType, lane: target.lane, type: target.zombie.type, hpDamage: shot.hpDamage, shock: shot.actionShockApplied, killed: shot.killed });
      shots += 1;
      if (shot.ammoType !== 'ball') specialSpent += 1;
      if (shot.killed) { firstKillTurn ??= turn + 1; encounter.settleDeaths(); }
    }
    player.magazine.clear();
    if (!encounter.complete) {
      const action = resolver.resolveEnemyAction(actor?.zombie.snapshot() ?? { ...encounter.selected.zombie.snapshot(), hp: 0 }, player.getCombatState(), player.loadout.getSnapshot());
      actor?.zombie.applyState(action.after);
      player.applyCombatState(action.resolution === 'dead' ? tickPlayerEffects(action.playerAfter) : action.playerAfter);
      if (action.resolution === 'dead') canceled += 1;
      else if (action.interrupted) interruptions += 1;
      else enemyActions += 1;
      if (action.intentResolved) intents += 1;
      player.isAlive = !action.playerKilled;
      record.action = action.resolution === 'normal' ? action.executedAction ?? action.resolution : action.resolution;
      encounter.finishOpportunity(actorId);
    } else record.action = 'complete';
    record.after = encounter.living.map(enemy => enemy.zombie.snapshot());
    trace.push(record);
  }
  return { won: encounter.complete && player.isAlive, breached: !player.isAlive, turns: trace.length, shots, specialSpent, enemyActions, interruptions, intents, canceled, dangerTurns,
    firstKillTurn, remainingHp: encounter.living.reduce((sum, enemy) => sum + enemy.zombie.hp, 0), trace };
}

export function uniqueOrders(rounds: readonly AmmoType[]): AmmoType[][] {
  if (!rounds.length) return [[]];
  return [...new Set(rounds)].flatMap(ammo => {
    const remaining = [...rounds]; remaining.splice(remaining.indexOf(ammo), 1);
    return uniqueOrders(remaining).map(tail => [ammo, ...tail]);
  });
}

export const ENCOUNTER_BALANCE_BAGS: Record<string, readonly AmmoType[]> = {
  '표준탄': ['ball', 'ball', 'ball', 'ball'],
  '상처 연계': ['wounding', 'wounding', 'laceration', 'ball'],
  '폭발 기폭': ['explosive', 'explosive', 'flatNose', 'ball'],
  '충격과 반동': ['hammer', 'plusP', 'kickback', 'ball'],
  '화력 연계': ['relay', 'plusP', 'lowRecoil', 'ball'],
  '화상 연계': ['incendiary', 'incendiary', 'kindling', 'ball'],
  '이동': ['retreat', 'advance', 'ball', 'ball'],
  '강한 폭발': ['stickyCharge', 'stickyCharge', 'stickyCharge', 'flatNose'],
};

export function summarizeEncounter(result: ReturnType<typeof simulateEncounterBalance>) {
  const { trace, ...summary } = result;
  void trace;
  return summary;
}

/** 같은 소유 탄약의 모든 첫 탄창 순서와 2^4 표적 배정. 이후는 동일한 근접 우선 표준탄 정책이다. */
export function compareEncounterOpening(scenario: EncounterScenario, weapon: WeaponId, bag: readonly AmmoType[]) {
  const rows = uniqueOrders(bag).flatMap((rounds, orderIndex) => Array.from({ length: 2 ** rounds.length }, (_, mask) => {
    const targets = rounds.map((_, index) => mask >> index & 1);
    const result = simulateEncounterBalance({ scenario, weapon, magazines: [rounds], openingTargets: targets, policy: 'nearest' });
    return { orderIndex, rounds, targets, ...summarizeEncounter(result) };
  }));
  const fixedOrder = rows.filter(row => row.orderIndex === 0);
  const focused = rows.filter(row => row.targets.every(lane => lane === 0));
  const sorted = [...rows].sort((a, b) => Number(b.won) - Number(a.won) || (!a.won ? a.remainingHp - b.remainingHp : 0)
    || a.turns - b.turns || a.enemyActions - b.enemyActions || a.intents - b.intents || a.shots - b.shots);
  const spread = (set: typeof rows) => {
    const wins = set.filter(row => row.won);
    return { count: set.length, wins: wins.length,
      minTurns: wins.length ? Math.min(...wins.map(row => row.turns)) : null, maxTurns: wins.length ? Math.max(...wins.map(row => row.turns)) : null,
      minActions: wins.length ? Math.min(...wins.map(row => row.enemyActions)) : null, maxActions: wins.length ? Math.max(...wins.map(row => row.enemyActions)) : null };
  };
  return { scenario: scenario.id, weapon, bag, all: spread(rows), targeting: spread(fixedOrder), order: spread(focused), best: sorted[0], worst: sorted.at(-1) };
}
