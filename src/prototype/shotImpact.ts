import { EXPLOSION_BALANCE } from './combatBalance';
import type { Encounter, Round } from './rules';

export interface DamageInstance {
  source: DamageSource;
  ownTransferBps: number;
  impactBonus: number;
  modifiedDamage: number;
  woundDamage: number;
  damage: number;
  before: number;
  after: number;
  removed: number;
}

type DamageSource = Round | 'echo' | 'playerEffect' | 'environment' | 'explosion';

// 보정이 끝난 독립 타격 한 건과 그 직후의 표적 상태를 함께 반환한다.
export function resolveDamage(state: Encounter, source: DamageSource, modified: number, ownTransferBps = 0) {
  if (state.hp <= 0 || state.phase === 'victory' || state.phase === 'defeat' || !(modified > 0)) return;
  if (!Number.isInteger(modified)) throw new RangeError('보정 피해는 반올림이 끝난 정수여야 합니다.');
  if (!Number.isSafeInteger(ownTransferBps) || ownTransferBps < 0) throw new RangeError('전이율은 0 이상의 정수 베이시스 포인트여야 합니다.');
  const before = state.hp;
  const qualifies = source !== 'environment' && source !== 'explosion';
  const previous = state.previousQualifyingHit;
  // 체력 입력 범위의 큰 정수에서도 곱셈 중간값의 반올림 없이 한 번만 내린다.
  const impactBonus = qualifies && previous
    ? Number(BigInt(previous.finalDamage) * BigInt(Math.max(previous.ownTransferBps, ownTransferBps)) / 10_000n) : 0;
  const woundDamage = state.wound;
  const damage = modified + woundDamage + impactBonus;
  const after = Math.max(0, before - damage);
  const removed = before === Infinity ? 0 : before - after;
  const hit: DamageInstance = { source, modifiedDamage: modified, ownTransferBps, impactBonus, woundDamage, damage, before, after, removed };
  const next = { ...state, hp: after };
  if (after === 0) {
    next.wound = 0;
    next.explosionStack = 0;
    next.previousQualifyingHit = null;
    next.qualifyingHitCount = 0;
  } else if (qualifies) {
    next.previousQualifyingHit = { finalDamage: damage, ownTransferBps };
    next.qualifyingHitCount++;
  }
  return { hit, state: next };
}

interface ExplosionPayload {
  stack: number;
  adjacentStack?: number;
  consumption?: number;
}

export interface ExplosionEvent {
  origin: number;
  power: number;
  hits: { lane: number; hit: DamageInstance }[];
}

/** 배열 인덱스는 고정 차선이다. 사격 도중 사망해도 차선을 당기지 않는다. */
export function resolveShotImpact(start: readonly Encounter[], origin: number, round: Round | null,
  directDamage: readonly number[], transferBps = 0, payload?: ExplosionPayload) {
  const formation = [...start];
  const target = formation[origin];
  const hits: DamageInstance[] = [];
  let attemptedHits = 0;
  let explosion: ExplosionEvent | null = null;
  if (!round || !target || target.hp <= 0 || target.phase === 'victory' || target.phase === 'defeat') {
    return { formation, hits, attemptedHits, explosion };
  }

  const area = formation.flatMap((enemy, lane) =>
    enemy.hp > 0 && Math.abs(lane - origin) <= EXPLOSION_BALANCE.radius ? [lane] : []);
  const power = target.explosionStack;
  for (const value of directDamage) {
    attemptedHits++;
    const result = resolveDamage(formation[origin]!, round, value, transferBps);
    if (!result) continue;
    hits.push(result.hit);
    formation[origin] = result.state;
    if (!result.state.hp) break;
  }

  if (power > 0) {
    explosion = { origin, power, hits: [] };
    for (const lane of area) {
      const result = resolveDamage(formation[lane]!, 'explosion', power);
      if (!result) continue;
      explosion.hits.push({ lane, hit: result.hit });
      formation[lane] = result.state;
    }
  }
  const remainingAtOrigin = Math.floor(power * (1 - (payload?.consumption ?? EXPLOSION_BALANCE.consumption)));
  for (const lane of area) {
    const enemy = formation[lane]!;
    if (!enemy.hp) continue;
    const remaining = lane === origin ? remainingAtOrigin : enemy.explosionStack;
    const addition = lane === origin ? payload?.stack : payload?.adjacentStack;
    const explosionStack = remaining + (addition ?? 0);
    if (explosionStack !== enemy.explosionStack) formation[lane] = { ...enemy, explosionStack };
  }
  return { formation, hits, attemptedHits, explosion };
}
