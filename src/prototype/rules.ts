export const P220 = { name: 'P220', capacity: 4 } as const;

export const ammo = {
  standard: { name: '표준탄', base: 10 },
  reinforced: { name: '강화탄', base: 20 },
  follow_up: { name: '후속탄', base: 8, previousRatio: 0.5 },
  finisher: { name: '종결탄', base: 8, lastBonus: 1 },
  execution: { name: '처형탄', base: 6, threshold: 30, bonus: 2.5 },
  vulnerability: { name: '취약탄', base: 0, percent: 25, turns: 2 },
  pain: { name: '고통탄', base: 10, bonusFactor: 2 },
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
  turns: number;
  actions: number;
  vulnerable: { percent: number; remaining: number } | null;
  phase: 'planning' | 'firing' | 'approach' | 'victory' | 'defeat';
}
export function startEncounter(scenario: Scenario): Encounter {
  if (!validScenario(scenario)) throw new RangeError('전투 설정에는 양의 정수가 필요합니다.');
  return { ...scenario, hp: scenario.maxHp, turns: 0, actions: 0, vulnerable: null, phase: 'planning' };
}
export interface Shot {
  index: number;
  round: Round;
  before: number;
  after: number;
  damage: number;
  removed: number;
  bonus: number;
  percent: number;
  applied: boolean;
}
export function lockMagazine(slots: readonly (Round | null)[], capacity: number): readonly Round[] | null {
  const copy = Array.from(slots);
  return capacity > 0 && copy.length === capacity && copy.every(isRound) ? Object.freeze(copy) : null;
}

type Event = { kind: 'shot'; shot: Shot } | { kind: 'turn' | 'approach' | 'cleanup' | 'victory' | 'defeat' };
export type Frame = Event & { state: Encounter };

// 한 발이 만든 상태를 다음 발이 그대로 읽는다. 렌더러와 타이머는 이 계산에 참여하지 않는다.
export function* resolveVolley(start: Encounter, locked: readonly Round[]): Generator<Frame> {
  let state: Encounter = { ...start, phase: 'firing' };
  let previousDamage = 0;
  for (const [index, round] of locked.entries()) {
    const base = ammo[round].base;
    let bonus = 0;
    if (round === 'follow_up') bonus = previousDamage * ammo.follow_up.previousRatio;
    if (round === 'finisher' && index === locked.length - 1) bonus = base * ammo.finisher.lastBonus;
    if (round === 'execution' && state.hp * 100 <= state.maxHp * ammo.execution.threshold) bonus = base * ammo.execution.bonus;
    let percent = state.vulnerable?.percent ?? 0;
    if (round === 'pain') percent *= ammo.pain.bonusFactor;
    const damage = Math.floor((base + bonus) * (100 + percent) / 100 + 0.5);
    const before = state.hp;
    const after = Math.max(0, before - damage);
    const applied = round === 'vulnerability';
    const vulnerable = applied ? { percent: ammo.vulnerability.percent, remaining: ammo.vulnerability.turns } : state.vulnerable;
    state = { ...state, hp: after, vulnerable };
    yield { kind: 'shot', state, shot: { index, round, before, after, damage, removed: before - after, bonus, percent, applied } };
    previousDamage = damage;
    if (!after) break;
  }
  state = { ...state, turns: state.turns + 1 };
  yield { kind: 'turn', state };
  if (!state.hp) {
    yield { kind: 'victory', state: { ...state, phase: 'victory' } };
    return;
  }
  state = { ...state, phase: 'approach', actions: state.actions + 1, distance: Math.max(0, state.distance - state.approach) };
  yield { kind: 'approach', state };
  if (!state.distance) {
    yield { kind: 'defeat', state: { ...state, phase: 'defeat' } };
    return;
  }
  const status = state.vulnerable;
  const vulnerable = status && status.remaining > 1 ? { ...status, remaining: status.remaining - 1 } : null;
  yield { kind: 'cleanup', state: { ...state, phase: 'planning', vulnerable } };
}

