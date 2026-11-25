import { heatDamagePercent, WEAPON_HEAT_BALANCE } from './combatBalance';
import type { AmmoFamily } from '../combat/types';
import { traceHp, traceTransition, traceTurn } from './analysis/trace';
import type { CombatTraceSink, HitOrigin, TraceWriter } from './analysis/trace';

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
  conduit_round: { name: '매개탄', family: 'IMPACT', base: 4, transferBps: 4000, heat: 5 },
  pulse_round: { name: '맥동탄', family: 'IMPACT', base: 4, hits: 2, transferBps: 2000, heat: 5 },
  wedge_round: { name: '쐐기탄', family: 'HEALTH', base: 2, secondHit: 8, heat: 5 },
  convergence_round: { name: '집속탄', family: 'HEALTH', base: 4, perPriorHit: 2, heat: 5 },
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
  previousQualifyingHit: { finalDamage: number; ownTransferBps: number } | null;
  qualifyingHitCount: number;
  vulnerable: { percent: number; remaining: number } | null;
  phase: 'planning' | 'firing' | 'approach' | 'victory' | 'defeat';
}
export function startEncounter(scenario: Scenario): Encounter {
  if (!validScenario(scenario)) throw new RangeError('체력은 무한 또는 양의 정수, 거리와 접근은 양의 정수여야 합니다.');
  return { ...scenario, hp: scenario.maxHp, weaponHeat: WEAPON_HEAT_BALANCE.initial, turns: 0, actions: 0, wound: 0,
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
}

export interface DamageInstance {
  source: DamageSource;
  conditionalExtraHit?: true;
  ownTransferBps: number;
  impactBonus: number;
  modifiedDamage: number;
  woundDamage: number;
  damage: number;
  before: number;
  after: number;
  removed: number;
}

export interface EchoHit { shotIndex: number; rawBaseDamage: number; hit: DamageInstance }

function modifiedDamage(power: number, percent: number, heatPercent: number): number {
  // 두 배율을 곱한 뒤 마지막에 한 번만 반올림한다.
  return Math.floor(power * (100 + percent) * heatPercent / 10_000 + 0.5);
}

export type DamageSource = Round | 'echo' | 'playerEffect' | 'environment';

// 보정이 끝난 독립 타격 한 건과 그 직후의 표적 상태를 함께 반환한다.
export function resolveDamage(state: Encounter, source: DamageSource, modified: number, ownTransferBps = 0,
  trace?: { write: TraceWriter; origin: HitOrigin }) {
  if (state.hp <= 0 || state.phase === 'victory' || state.phase === 'defeat' || !(modified > 0)) return;
  if (!Number.isInteger(modified)) throw new RangeError('보정 피해는 반올림이 끝난 정수여야 합니다.');
  if (!Number.isSafeInteger(ownTransferBps) || ownTransferBps < 0) throw new RangeError('전이율은 0 이상의 정수 베이시스 포인트여야 합니다.');
  const before = state.hp;
  const qualifies = source !== 'environment';
  const previous = state.previousQualifyingHit;
  // 체력 입력 범위의 큰 정수에서도 곱셈 중간값의 반올림 없이 한 번만 내린다.
  const appliedTransferBps = qualifies && previous ? Math.max(previous.ownTransferBps, ownTransferBps) : 0;
  const impactBonus = qualifies && previous
    ? Number(BigInt(previous.finalDamage) * BigInt(appliedTransferBps) / 10_000n) : 0;
  const woundDamage = state.wound;
  const damage = modified + woundDamage + impactBonus;
  const after = Math.max(0, before - damage);
  const removed = before === Infinity ? 0 : before - after;
  const hit: DamageInstance = { source, modifiedDamage: modified, ownTransferBps, impactBonus, woundDamage, damage, before, after, removed };
  const next = { ...state, hp: after };
  if (after === 0) {
    next.wound = 0;
    next.previousQualifyingHit = null;
    next.qualifyingHitCount = 0;
  } else if (qualifies) {
    next.previousQualifyingHit = { finalDamage: damage, ownTransferBps };
    next.qualifyingHitCount++;
  }
  trace?.write({ kind: 'hit', ...trace.origin, source, modifiedDamage: modified, qualifies, ownTransferBps, appliedTransferBps,
    previousHit: previous && { ...previous }, storedHit: next.previousQualifyingHit && { ...next.previousQualifyingHit },
    countBefore: state.qualifyingHitCount, countAfter: next.qualifyingHitCount, woundBefore: state.wound, woundAfter: next.wound,
    woundBonus: woundDamage, impactBonus, finalDamage: damage, hpBefore: traceHp(before), hpAfter: traceHp(after),
    effectiveHpDamage: removed, overkill: before === Infinity ? 0 : damage - removed });
  return { hit, state: next };
}
export function lockMagazine(slots: readonly (Round | null)[], capacity: number): readonly Round[] | null {
  const copy = Array.from(slots);
  return capacity > 0 && copy.length === capacity && copy.every(isRound) ? Object.freeze(copy) : null;
}

type Event = { kind: 'shot'; shot: Shot } | { kind: 'echo'; echo: EchoHit } | { kind: 'turn' | 'approach' | 'cleanup' | 'victory' | 'defeat' };
export type Frame = Event & { state: Encounter };

// 한 발이 만든 상태를 다음 발이 그대로 읽는다. 렌더러와 타이머는 이 계산에 참여하지 않는다.
export function* resolveVolley(start: Encounter, locked: readonly Round[], trace?: CombatTraceSink): Generator<Frame, void> {
  if (start.phase !== 'planning') return;
  let state: Encounter = { ...start, phase: 'firing' };
  const counts = new Map<Round, number>();
  for (const round of locked) {
    if (!isRound(round)) return;
    counts.set(round, (counts.get(round) ?? 0) + 1);
  }
  const write = traceTurn(trace, start.turns + 1);
  traceTransition(write, 'turn-start', start, state);
  const largestGroup = Math.max(0, ...counts.values());
  let effect: ShotEffect & { pursuitDamage?: number } = { source: null, bonus: 0 };
  let previousDamage = 0;
  let previousFamily: AmmoFamily | undefined;
  // 단일 표적과 이번 턴을 공유한다. 전투 초기화 시 이 일제사격 자체가 폐기된다.
  const pendingEchoes: { shotIndex: number; power: number; heat: number }[] = [];
  const logEcho = write && ((shotIndex: number, action: 'created' | 'resolved' | 'cancelled') => {
    write({ kind: 'pending', action, shot: shotIndex + 1, ammo: locked[shotIndex]!, source: 'echo', effectId: `echo-${shotIndex + 1}` });
  });
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
    const heatPercent = heatDamagePercent(heatBefore);
    const applied = source === 'vulnerability';
    let percent = source ? state.vulnerable?.percent ?? 0 : 0;
    if (source === 'pain') percent *= ammo.pain.bonusFactor;
    const definition = source ? ammo[source] : undefined;
    const base = definition?.base ?? 0;
    const hitCount = definition && 'hits' in definition ? definition.hits : 1;
    const baseHits: number[] = Array(hitCount).fill(base);
    if (definition && 'secondHit' in definition) baseHits.push(definition.secondHit);
    const unconditionalHits = baseHits.length;
    if (effect.pursuitDamage) baseHits.push(effect.pursuitDamage);
    const transferBps = definition && 'transferBps' in definition ? definition.transferBps : 0;
    const hits: DamageInstance[] = [];
    const before = state.hp;
    let baseDamage = 0;
    let preHeatDamage = 0;
    let damage = 0;
    previousDamage = 0;
    for (const [hitIndex, baseHit] of baseHits.entries()) {
      const conditionalBaseDamage = hitIndex === 0 ? bonus : 0;
      const conditionalExtraHit = hitIndex >= unconditionalHits ? true : undefined;
      const power = baseHit + conditionalBaseDamage;
      const resolved = resolveDamage(state, round, modifiedDamage(power, percent, heatPercent), transferBps,
        write && { write, origin: { shot: index + 1, hit: hitIndex + 1, ammo: round, rawBaseDamage: baseHit,
          conditionalBaseDamage, conditionalExtraHit, vulnerabilityPercent: percent, heat: heatBefore, heatPercent } });
      baseDamage += baseHit;
      preHeatDamage += power * (100 + percent) / 100;
      if (resolved) {
        const { hit } = resolved;
        if (conditionalExtraHit) hit.conditionalExtraHit = true;
        state = resolved.state;
        hits.push(hit);
        damage += hit.damage;
        // 후속탄은 직전 샷의 보정된 기본 피해만 읽는다.
        previousDamage += hit.modifiedDamage;
        if (state.hp === 0) break;
      }
    }
    const after = state.hp;
    const woundApplied = after > 0 && definition && 'wound' in definition ? definition.wound : 0;
    const vulnerable = applied ? { percent: ammo.vulnerability.percent, remaining: ammo.vulnerability.turns } : state.vulnerable;
    const heatAfter = heatBefore + ammo[round].heat;
    if (after > 0 && definition && 'echoDamage' in definition) {
      pendingEchoes.push({ shotIndex: index, power: definition.echoDamage, heat: heatBefore });
      logEcho?.(index, 'created');
    }
    state = { ...state, wound: state.wound + woundApplied, vulnerable, weaponHeat: heatAfter };
    if (after === 0) {
      if (logEcho) for (const echo of pendingEchoes) logEcho(echo.shotIndex, 'cancelled');
      pendingEchoes.length = 0;
    }
    write?.({ kind: 'shot', shot: index + 1, ammo: round, name: ammo[round].name, family: ammo[round].family,
      previousFamily: previousFamily ?? null, weapon: P220.name, distance: state.distance, remainingRounds: locked.length - index - 1,
      effectRound: source, heatBefore, heatAfter, expectedHits: base === 0 && bonus === 0 ? 0 : baseHits.length,
      resolvedHits: hits.length, woundApplied, vulnerabilityApplied: applied, vulnerabilityAfter: vulnerable && { ...vulnerable } });
    previousFamily = ammo[round].family;
    const removed = before === Infinity ? 0 : before - after;
    yield { kind: 'shot', state, shot: {
      index, round, before, after, removed, baseDamage, preHeatDamage, damage, percent, applied, heatBefore, heatAfter, hits, woundApplied, source, bonus,
    } };
    if (!after) break;
  }
  traceTransition(write, 'action-complete', state);
  traceTransition(write, 'delayed-start', state, state, pendingEchoes.length);
  for (let i = 0; i < pendingEchoes.length; ++i) {
    const { shotIndex, power, heat } = pendingEchoes[i]!;
    const percent = state.vulnerable?.percent ?? 0;
    const heatPercent = heatDamagePercent(heat);
    const resolved = resolveDamage(state, 'echo', modifiedDamage(power, percent, heatPercent), 0,
      write && { write, origin: { shot: shotIndex + 1, hit: 1, ammo: locked[shotIndex]!, effectId: `echo-${shotIndex + 1}`,
        rawBaseDamage: power, conditionalBaseDamage: 0, vulnerabilityPercent: percent, heat, heatPercent } });
    if (!resolved) {
      logEcho?.(shotIndex, 'cancelled');
      continue;
    }
    const { hit } = resolved;
    state = resolved.state;
    logEcho?.(shotIndex, 'resolved');
    if (state.hp === 0 && logEcho) {
      for (let j = i + 1; j < pendingEchoes.length; ++j) logEcho(pendingEchoes[j]!.shotIndex, 'cancelled');
    }
    yield { kind: 'echo', state, echo: { shotIndex, rawBaseDamage: power, hit } };
    if (state.hp === 0) break;
  }
  const endOfFire = state;
  state = { ...state, wound: Math.floor(state.wound / 2), previousQualifyingHit: null, qualifyingHitCount: 0, turns: state.turns + 1,
    weaponHeat: state.weaponHeat * (1 - WEAPON_HEAT_BALANCE.turnCoolingRate) };
  traceTransition(write, 'turn-end', endOfFire, state);
  yield { kind: 'turn', state };
  if (!state.hp) {
    const victory: Encounter = { ...state, phase: 'victory', weaponHeat: WEAPON_HEAT_BALANCE.initial };
    traceTransition(write, 'victory', state, victory);
    yield { kind: 'victory', state: victory };
    return;
  }
  const beforeApproach = state;
  state = { ...state, phase: 'approach', actions: state.actions + 1, distance: Math.max(0, state.distance - state.approach) };
  traceTransition(write, 'enemy-action', beforeApproach, state);
  yield { kind: 'approach', state };
  if (!state.distance) {
    const defeat: Encounter = { ...state, phase: 'defeat', weaponHeat: WEAPON_HEAT_BALANCE.initial };
    traceTransition(write, 'defeat', state, defeat);
    yield { kind: 'defeat', state: defeat };
    return;
  }
  const status = state.vulnerable;
  const vulnerable = status && status.remaining > 1 ? { ...status, remaining: status.remaining - 1 } : null;
  const ready: Encounter = { ...state, phase: 'planning', vulnerable };
  traceTransition(write, 'turn-ready', state, ready);
  yield { kind: 'cleanup', state: ready };
}
