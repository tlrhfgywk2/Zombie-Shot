import { recoilFirepowerPenalty } from '../combat/RecoilPenalty';
import type { AmmoFamily } from '../combat/types';
import { WEAPON_DEFINITIONS } from '../data/weaponDefinitions';
import { EXPLOSION_BALANCE, heatDamagePercent, WEAPON_HEAT_BALANCE } from './combatBalance';
import { resolveDamage, resolveShotImpact } from './shotImpact';
import type { DamageInstance, ExplosionEvent } from './shotImpact';
export { resolveDamage } from './shotImpact';
export type { DamageInstance } from './shotImpact';

export const P220 = { name: 'P220', capacity: 4, recoilThreshold: WEAPON_DEFINITIONS.p220.recoilThreshold } as const;

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
  conduit_round: { name: '매개탄', family: 'IMPACT', base: 4, transferBps: 4000, heat: 5 },
  pulse_round: { name: '맥동탄', family: 'IMPACT', base: 4, hits: 2, transferBps: 2000, heat: 5 },
  wedge_round: { name: '쐐기탄', family: 'HEALTH', base: 2, secondHit: 8, heat: 5 },
  convergence_round: { name: '집속탄', family: 'HEALTH', base: 4, perPriorHit: 2, heat: 5 },
  explosive: { name: '폭발탄', family: 'EXPLOSION', base: 5, heat: 5, recoil: EXPLOSION_BALANCE.normalRecoil, stack: 4 },
  highExplosive: { name: '고폭탄', family: 'EXPLOSION', base: 6, heat: 5, recoil: EXPLOSION_BALANCE.highRecoil, stack: 6 },
  stickyCharge: { name: '접착폭약탄', family: 'EXPLOSION', base: 1, heat: 5, recoil: EXPLOSION_BALANCE.normalRecoil, stack: 8 },
  dispersal: { name: '확산탄', family: 'EXPLOSION', base: 3, heat: 5, recoil: EXPLOSION_BALANCE.normalRecoil, stack: 2, adjacentStack: 2 },
  residual: { name: '잔류탄', family: 'EXPLOSION', base: 8, heat: 5, recoil: EXPLOSION_BALANCE.normalRecoil, stack: 0, consumption: 0.25 },
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
  explosionStack: number;
  previousQualifyingHit: { finalDamage: number; ownTransferBps: number } | null;
  qualifyingHitCount: number;
  vulnerable: { percent: number; remaining: number } | null;
  phase: 'planning' | 'firing' | 'approach' | 'victory' | 'defeat';
}
export function startEncounter(scenario: Scenario): Encounter {
  if (!validScenario(scenario)) throw new RangeError('체력은 무한 또는 양의 정수, 거리와 접근은 양의 정수여야 합니다.');
  return { ...scenario, hp: scenario.maxHp, weaponHeat: WEAPON_HEAT_BALANCE.initial, turns: 0, actions: 0, wound: 0, explosionStack: 0,
    previousQualifyingHit: null, qualifyingHitCount: 0, vulnerable: null, phase: 'planning' };
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
  explosion: ExplosionEvent | null;
  recoilGenerated: number;
  recoilPenalty: number;
}

export interface EchoHit { shotIndex: number; hit: DamageInstance }

function modifiedDamage(power: number, percent: number, heat: number): number {
  // 두 배율을 곱한 뒤 마지막에 한 번만 반올림한다.
  return Math.floor(power * (100 + percent) * heatDamagePercent(heat) / 10_000 + 0.5);
}

export function lockMagazine(slots: readonly (Round | null)[], capacity: number): readonly Round[] | null {
  const copy = Array.from(slots);
  return capacity > 0 && copy.length === capacity && copy.every(isRound) ? Object.freeze(copy) : null;
}

type Event = { kind: 'shot'; shot: Shot } | { kind: 'echo'; echo: EchoHit } | { kind: 'turn' | 'approach' | 'cleanup' | 'victory' | 'defeat' };
export type Frame = Event & { state: Encounter };

// 한 발이 만든 상태를 다음 발이 그대로 읽는다. 렌더러와 타이머는 이 계산에 참여하지 않는다.
export function* resolveVolley(start: Encounter, locked: readonly Round[]): Generator<Frame, void> {
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
  let recoil = 0;
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
      if (round === 'convergence_round') bonus = state.qualifyingHitCount * ammo[round].perPriorHit;
      effect = { source: round, bonus };
      if (round === 'pursuit_round' && previousFamily !== undefined && previousFamily !== ammo[round].family) {
        effect.pursuitDamage = ammo[round].pursuitDamage;
      }
    }
    const { source, bonus } = effect;
    const heatBefore = state.weaponHeat;
    let percent = source ? state.vulnerable?.percent ?? 0 : 0;
    if (source === 'pain') percent *= ammo.pain.bonusFactor;
    const definition = source ? ammo[source] : undefined;
    const base = definition?.base ?? 0;
    const hitCount = definition && 'hits' in definition ? definition.hits : 1;
    const baseHits: number[] = Array(hitCount).fill(base);
    if (definition && 'secondHit' in definition) baseHits.push(definition.secondHit);
    if (effect.pursuitDamage) baseHits.push(effect.pursuitDamage);
    const transferBps = definition && 'transferBps' in definition ? definition.transferBps : 0;
    const fired = ammo[round];
    const recoilGenerated = 'recoil' in fired ? fired.recoil : 0;
    recoil += recoilGenerated;
    const recoilPenalty = recoilFirepowerPenalty(recoil, P220.recoilThreshold);
    const before = state.hp;
    const powers = baseHits.map((baseHit, i) => Math.max(0, baseHit + (i === 0 ? bonus - recoilPenalty : 0)));
    const payload = definition && 'stack' in definition ? definition : undefined;
    const impact = resolveShotImpact([state], 0, source ? round : null,
      powers.map(power => modifiedDamage(power, percent, heatBefore)), transferBps, payload);
    state = impact.formation[0]!;
    const { hits, explosion, attemptedHits } = impact;
    const baseDamage = baseHits.slice(0, attemptedHits).reduce((sum, value) => sum + value, 0);
    const preHeatDamage = powers.slice(0, attemptedHits).reduce((sum, power) => sum + power * (100 + percent) / 100, 0);
    const damage = hits.reduce((sum, hit) => sum + hit.damage, 0) + (explosion?.hits[0]?.hit.damage ?? 0);
    previousDamage = hits.reduce((sum, hit) => sum + hit.modifiedDamage, 0);
    const after = state.hp;
    const applied = source === 'vulnerability' && after > 0;
    const woundApplied = after > 0 && definition && 'wound' in definition ? definition.wound : 0;
    const vulnerable = applied ? { percent: ammo.vulnerability.percent, remaining: ammo.vulnerability.turns } : state.vulnerable;
    const heatAfter = heatBefore + ammo[round].heat;
    previousFamily = ammo[round].family;
    if (after > 0 && definition && 'echoDamage' in definition) {
      pendingEchoes.push({ shotIndex: index, power: definition.echoDamage, heat: heatBefore });
    }
    state = { ...state, wound: state.wound + woundApplied, vulnerable, weaponHeat: heatAfter };
    if (after === 0) pendingEchoes.length = 0;
    const removed = before === Infinity ? 0 : before - after;
    yield { kind: 'shot', state, shot: {
      index, round, before, after, removed, baseDamage, preHeatDamage, damage, percent, applied, heatBefore, heatAfter, hits, woundApplied, source, bonus,
      explosion, recoilGenerated, recoilPenalty,
    } };
    if (!after) break;
  }
  for (const { shotIndex, power, heat } of pendingEchoes) {
    const resolved = resolveDamage(state, 'echo', modifiedDamage(power, state.vulnerable?.percent ?? 0, heat));
    if (!resolved) continue;
    const { hit } = resolved;
    state = resolved.state;
    yield { kind: 'echo', state, echo: { shotIndex, hit } };
    if (state.hp === 0) break;
  }
  state = { ...state, wound: Math.floor(state.wound / 2), previousQualifyingHit: null, qualifyingHitCount: 0, turns: state.turns + 1,
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
