import { heatDamagePercent, WEAPON_HEAT_BALANCE } from './combatBalance';
import type { AmmoFamily } from '../combat/types';

export const P220 = { name: 'P220', capacity: 4 } as const;

export const ammo = {
  standard: { name: '표준탄', family: 'HEALTH', base: 10, heat: 16 },
  reinforced: { name: '강화탄', family: 'HEALTH', base: 20, heat: 3 },
  follow_up: { name: '후속탄', family: 'HEALTH', base: 8, previousRatio: 0.5, heat: 5 },
  finisher: { name: '종결탄', family: 'HEALTH', base: 8, lastBonus: 1, heat: 12 },
  execution: { name: '처형탄', family: 'HEALTH', base: 6, threshold: 30, bonus: 2.5, heat: 9 },
  vulnerability: { name: '취약탄', family: 'HEALTH', base: 0, percent: 25, turns: 2, heat: 5 },
  pain: { name: '고통탄', family: 'HEALTH', base: 10, bonusFactor: 2, heat: 7 },
  resonance: { name: '동조탄', family: 'HEALTH', base: 6, perRound: 4, heat: 4 },
  mixed: { name: '혼합탄', family: 'HEALTH', base: 8, perType: 2, heat: 6 },
  copy: { name: '복제탄', family: 'HEALTH', base: 0, heat: 0 },
  wounding_round: { name: '절개탄', family: 'WOUND', base: 5, wound: 3, heat: 5 },
  serrated_round: { name: '톱니탄', family: 'WOUND', base: 3, wound: 6, heat: 5 },
  split_round: { name: '분열탄', family: 'HEALTH', base: 3, hits: 3, heat: 5 },
  pursuit_round: { name: '추격탄', family: 'HEALTH', base: 7, pursuitDamage: 5, heat: 5 },
  echo_round: { name: '반향탄', family: 'HEALTH', base: 5, echoDamage: 5, heat: 5 },
} as const satisfies Record<string, { name: string; family: AmmoFamily; base: number; heat: number } & Record<string, string | number>>;
export type Round = keyof typeof ammo;
export function isRound(value: unknown): value is Round {
  return typeof value === 'string' && Object.hasOwn(ammo, value);
}

export interface Scenario { maxHp: number; distance: number; approach: number }
export const defaultScenario: Readonly<Scenario> = { maxHp: Infinity, distance: 3, approach: 1 };
export function validScenario({ maxHp, distance, approach }: Scenario): boolean {
  const positiveInteger = (value: number) => Number.isSafeInteger(value) && value > 0;
  return (maxHp === Infinity || positiveInteger(maxHp)) && positiveInteger(distance) && positiveInteger(approach);
}
export interface Encounter extends Scenario {
  hp: number;
  weaponHeat: number;
  turns: number;
  actions: number;
  wound: number;
  vulnerable: { percent: number; remaining: number } | null;
  phase: 'planning' | 'firing' | 'approach' | 'victory' | 'defeat';
}
export function startEncounter(scenario: Scenario): Encounter {
  if (!validScenario(scenario)) throw new RangeError('체력은 무한 또는 양의 정수, 거리와 접근은 양의 정수여야 합니다.');
  return { ...scenario, hp: scenario.maxHp, weaponHeat: WEAPON_HEAT_BALANCE.initial, turns: 0, actions: 0, wound: 0, vulnerable: null, phase: 'planning' };
}
interface ShotEffect {
  source: Exclude<Round, 'copy'> | null;
  bonus: number;
}
export interface Shot extends ShotEffect {
  index: number;
  round: Round;
  baseDamage: number;
  preHeatDamage: number;
  damage: number;
  percent: number;
  applied: boolean;
  heatBefore: number;
  heatAfter: number;
  before: number;
  after: number;
  removed: number;
  hits: readonly DamageInstance[];
  woundApplied: number;
}

export interface DamageInstance {
  modifiedDamage: number;
  woundDamage: number;
  damage: number;
  before: number;
  after: number;
  removed: number;
}

export interface EchoHit { shotIndex: number; hit: DamageInstance }

function modifiedDamage(power: number, percent: number, heat: number): number {
  // 두 배율을 곱한 뒤 마지막에 한 번만 반올림한다.
  return Math.floor(power * (100 + percent) * heatDamagePercent(heat) / 10_000 + 0.5);
}

function resolveDamage(state: Encounter, modified: number): DamageInstance | undefined {
  if (modified <= 0 || state.hp <= 0) return;
  const before = state.hp;
  const woundDamage = state.wound;
  const damage = modified + woundDamage;
  const after = Math.max(0, before - damage);
  const removed = before === Infinity ? 0 : before - after;
  return { modifiedDamage: modified, woundDamage, damage, before, after, removed };
}
export function lockMagazine(slots: readonly (Round | null)[], capacity: number): readonly Round[] | null {
  const copy = Array.from(slots);
  return capacity > 0 && copy.length === capacity && copy.every(isRound) ? Object.freeze(copy) : null;
}

type Event = { kind: 'shot'; shot: Shot } | { kind: 'echo'; echo: EchoHit } | { kind: 'turn' | 'approach' | 'cleanup' | 'victory' | 'defeat' };
export type Frame = Event & { state: Encounter };

// 한 발이 만든 상태를 다음 발이 그대로 읽는다. 렌더러와 타이머는 이 계산에 참여하지 않는다.
export function* resolveVolley(start: Encounter, locked: readonly Round[]): Generator<Frame> {
  if (start.phase !== 'planning') return;
  let state: Encounter = { ...start, phase: 'firing' };
  const counts = new Map<Round, number>();
  for (const round of locked) {
    if (!isRound(round)) return;
    counts.set(round, (counts.get(round) ?? 0) + 1);
  }
  const largestGroup = Math.max(0, ...counts.values());
  let effect: ShotEffect & { pursuitDamage?: number } = { source: null, bonus: 0 };
  let previousDamage = 0;
  let previousFamily: AmmoFamily | undefined;
  // 단일 표적과 이번 턴을 공유한다. 전투 초기화 시 이 일제사격 자체가 폐기된다.
  const pendingEchoes: { shotIndex: number; power: number; heat: number }[] = [];
  for (const [index, round] of locked.entries()) {
    if (state.hp <= 0) break;
    // 복제탄은 원본 탄의 조건부 보너스를 보존하고, 발사 시점의 배율로 피해를 계산한다.
    if (round !== 'copy') {
      const base = ammo[round].base;
      let bonus = 0;
      if (round === 'follow_up') bonus = previousDamage * ammo.follow_up.previousRatio;
      if (round === 'finisher' && index === locked.length - 1) bonus = base * ammo.finisher.lastBonus;
      if (round === 'execution' && Number.isFinite(state.maxHp) && state.hp * 100 <= state.maxHp * ammo.execution.threshold) {
        bonus = base * ammo.execution.bonus;
      }
      if (round === 'resonance') bonus = largestGroup * ammo.resonance.perRound;
      if (round === 'mixed') bonus = counts.size * ammo.mixed.perType;
      effect = { source: round, bonus };
      if (round === 'pursuit_round' && previousFamily !== undefined && previousFamily !== ammo[round].family) {
        effect.pursuitDamage = ammo[round].pursuitDamage;
      }
    }
    const { source, bonus } = effect;
    const heatBefore = state.weaponHeat;
    const applied = source === 'vulnerability';
    let percent = source ? state.vulnerable?.percent ?? 0 : 0;
    if (source === 'pain') percent *= ammo.pain.bonusFactor;
    const definition = source ? ammo[source] : undefined;
    const base = definition?.base ?? 0;
    const hitCount = definition && 'hits' in definition ? definition.hits : 1;
    const baseHits: number[] = Array(hitCount).fill(base);
    if (effect.pursuitDamage) baseHits.push(effect.pursuitDamage);
    const hits: DamageInstance[] = [];
    const before = state.hp;
    let baseDamage = 0;
    let preHeatDamage = 0;
    let damage = 0;
    previousDamage = 0;
    for (const [hitIndex, baseHit] of baseHits.entries()) {
      const power = baseHit + (hitIndex === 0 ? bonus : 0);
      const hit = resolveDamage(state, modifiedDamage(power, percent, heatBefore));
      baseDamage += baseHit;
      preHeatDamage += power * (100 + percent) / 100;
      if (hit) {
        hits.push(hit);
        damage += hit.damage;
        // 후속탄은 직전 샷의 보정된 기본 피해만 읽는다.
        previousDamage += hit.modifiedDamage;
        state = { ...state, hp: hit.after };
        if (state.hp === 0) break;
      }
    }
    const after = state.hp;
    const woundApplied = after > 0 && definition && 'wound' in definition ? definition.wound : 0;
    const vulnerable = applied ? { percent: ammo.vulnerability.percent, remaining: ammo.vulnerability.turns } : state.vulnerable;
    const heatAfter = heatBefore + ammo[round].heat;
    previousFamily = ammo[round].family;
    if (after > 0 && definition && 'echoDamage' in definition) {
      pendingEchoes.push({ shotIndex: index, power: definition.echoDamage, heat: heatBefore });
    }
    state = { ...state, wound: after > 0 ? state.wound + woundApplied : 0, vulnerable, weaponHeat: heatAfter };
    const removed = before === Infinity ? 0 : before - after;
    yield { kind: 'shot', state, shot: {
      index, round, before, after, removed, baseDamage, preHeatDamage, damage, percent, applied, heatBefore, heatAfter, hits, woundApplied, source, bonus,
    } };
    if (!after) break;
  }
  for (const { shotIndex, power, heat } of pendingEchoes) {
    const hit = resolveDamage(state, modifiedDamage(power, state.vulnerable?.percent ?? 0, heat));
    if (!hit) break;
    state = { ...state, hp: hit.after, wound: hit.after > 0 ? state.wound : 0 };
    yield { kind: 'echo', state, echo: { shotIndex, hit } };
    if (state.hp === 0) break;
  }
  state = { ...state, wound: Math.floor(state.wound / 2), turns: state.turns + 1,
    weaponHeat: state.weaponHeat * (1 - WEAPON_HEAT_BALANCE.turnCoolingRate) };
  yield { kind: 'turn', state };
  if (!state.hp) {
    yield { kind: 'victory', state: { ...state, phase: 'victory', weaponHeat: WEAPON_HEAT_BALANCE.initial } };
    return;
  }
  state = { ...state, phase: 'approach', actions: state.actions + 1, distance: Math.max(0, state.distance - state.approach) };
  yield { kind: 'approach', state };
  if (!state.distance) {
    yield { kind: 'defeat', state: { ...state, phase: 'defeat', weaponHeat: WEAPON_HEAT_BALANCE.initial } };
    return;
  }
  const status = state.vulnerable;
  const vulnerable = status && status.remaining > 1 ? { ...status, remaining: status.remaining - 1 } : null;
  yield { kind: 'cleanup', state: { ...state, phase: 'planning', vulnerable } };
}
