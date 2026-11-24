import { heatDamagePercent, WEAPON_HEAT_BALANCE } from './combatBalance';

export const P220 = { name: 'P220', capacity: 4 } as const;

export const ammo = {
  standard: { name: '표준탄', base: 10, heat: 16 },
  reinforced: { name: '강화탄', base: 20, heat: 3 },
  follow_up: { name: '후속탄', base: 8, previousRatio: 0.5, heat: 5 },
  finisher: { name: '종결탄', base: 8, lastBonus: 1, heat: 12 },
  execution: { name: '처형탄', base: 6, threshold: 30, bonus: 2.5, heat: 9 },
  vulnerability: { name: '취약탄', base: 0, percent: 25, turns: 2, heat: 5 },
  pain: { name: '고통탄', base: 10, bonusFactor: 2, heat: 7 },
  resonance: { name: '동조탄', base: 6, perRound: 4, heat: 4 },
  mixed: { name: '혼합탄', base: 8, perType: 2, heat: 6 },
  copy: { name: '복제탄', base: 0, heat: 0 },
} as const;
export type Round = keyof typeof ammo;
export function isRound(value: unknown): value is Round {
  return typeof value === 'string' && Object.hasOwn(ammo, value);
}

export interface Scenario { maxHp: number; distance: number; approach: number }
export const defaultScenario: Readonly<Scenario> = { maxHp: 100, distance: 3, approach: 1 };
export function validScenario({ maxHp, distance, approach }: Scenario): boolean {
  return [maxHp, distance, approach].every(n => Number.isSafeInteger(n) && n > 0);
}
export interface Encounter extends Scenario {
  hp: number;
  weaponHeat: number;
  turns: number;
  actions: number;
  vulnerable: { percent: number; remaining: number } | null;
  phase: 'planning' | 'firing' | 'approach' | 'victory' | 'defeat';
}
export function startEncounter(scenario: Scenario): Encounter {
  if (!validScenario(scenario)) throw new RangeError('전투 설정에는 양의 정수가 필요합니다.');
  return { ...scenario, hp: scenario.maxHp, weaponHeat: WEAPON_HEAT_BALANCE.initial, turns: 0, actions: 0, vulnerable: null, phase: 'planning' };
}
interface ShotEffect {
  source: Exclude<Round, 'copy'> | null;
  bonus: number;
}
export interface Shot extends ShotEffect {
  index: number;
  round: Round;
  damage: number;
  percent: number;
  applied: boolean;
  heatBefore: number;
  heatAfter: number;
  before: number;
  after: number;
  removed: number;
}
export function lockMagazine(slots: readonly (Round | null)[], capacity: number): readonly Round[] | null {
  const copy = Array.from(slots);
  return capacity > 0 && copy.length === capacity && copy.every(isRound) ? Object.freeze(copy) : null;
}

type Event = { kind: 'shot'; shot: Shot } | { kind: 'turn' | 'approach' | 'cleanup' | 'victory' | 'defeat' };
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
  let effect: ShotEffect = { source: null, bonus: 0 };
  let previousDamage = 0;
  for (const [index, round] of locked.entries()) {
    // 복제탄은 원본 탄의 조건부 보너스를 보존하고, 발사 시점의 배율로 피해를 계산한다.
    if (round !== 'copy') {
      const base = ammo[round].base;
      let bonus = 0;
      if (round === 'follow_up') bonus = previousDamage * ammo.follow_up.previousRatio;
      if (round === 'finisher' && index === locked.length - 1) bonus = base * ammo.finisher.lastBonus;
      if (round === 'execution' && state.hp * 100 <= state.maxHp * ammo.execution.threshold) bonus = base * ammo.execution.bonus;
      if (round === 'resonance') bonus = largestGroup * ammo.resonance.perRound;
      if (round === 'mixed') bonus = counts.size * ammo.mixed.perType;
      effect = { source: round, bonus };
    }
    const { source, bonus } = effect;
    const heatBefore = state.weaponHeat;
    const applied = source === 'vulnerability';
    let percent = source ? state.vulnerable?.percent ?? 0 : 0;
    if (source === 'pain') percent *= ammo.pain.bonusFactor;
    const intrinsicDamage = source ? ammo[source].base + bonus : 0;
    // 두 배율을 백분율로 곱한 뒤 나눠서 14.5 같은 경계값의 오차를 줄인다.
    const damage = Math.floor(intrinsicDamage * (100 + percent) * heatDamagePercent(heatBefore) / 10_000 + 0.5);
    const before = state.hp;
    const after = Math.max(0, before - damage);
    const vulnerable = applied ? { percent: ammo.vulnerability.percent, remaining: ammo.vulnerability.turns } : state.vulnerable;
    const heatAfter = heatBefore + ammo[round].heat;
    previousDamage = damage;
    state = { ...state, hp: after, vulnerable, weaponHeat: heatAfter };
    yield { kind: 'shot', state, shot: { index, round, before, after, removed: before - after, damage, percent, applied, heatBefore, heatAfter, ...effect } };
    if (!after) break;
  }
  state = { ...state, turns: state.turns + 1, weaponHeat: state.weaponHeat * (1 - WEAPON_HEAT_BALANCE.turnCoolingRate) };
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
