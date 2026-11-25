import type { AmmoFamily } from '../../combat/types';
import type { DamageSource, Encounter, Round } from '../rules';

export type TraceHp = number | 'infinite';
export const traceHp = (hp: number): TraceHp => hp === Infinity ? 'infinite' : hp;

export function traceState(state: Encounter) {
  return {
    phase: state.phase, hp: traceHp(state.hp), maxHp: traceHp(state.maxHp),
    distance: state.distance, approach: state.approach, actions: state.actions, turns: state.turns,
    heat: state.weaponHeat, wound: state.wound, vulnerability: state.vulnerable && { ...state.vulnerable },
    previousHit: state.previousQualifyingHit && { ...state.previousQualifyingHit }, qualifyingHits: state.qualifyingHitCount,
  };
}

type Snapshot = ReturnType<typeof traceState>;
export interface HitOrigin {
  shot?: number;
  hit: number;
  ammo?: Round;
  effectId?: string;
  rawBaseDamage: number;
  conditionalBaseDamage: number;
  vulnerabilityPercent: number;
  heat: number;
  heatPercent: number;
}

export type TracePayload =
  | ({ kind: 'hit'; source: DamageSource; modifiedDamage: number; woundBefore: number; woundAfter: number;
       woundBonus: number; qualifies: boolean; previousHit: Encounter['previousQualifyingHit']; ownTransferBps: number;
       appliedTransferBps: number; impactBonus: number; finalDamage: number; effectiveHpDamage: number; overkill: number;
       hpBefore: TraceHp; hpAfter: TraceHp; storedHit: Encounter['previousQualifyingHit']; countBefore: number; countAfter: number } & HitOrigin)
  | { kind: 'shot'; shot: number; ammo: Round; name: string; family: AmmoFamily; previousFamily: AmmoFamily | null;
      weapon: string; distance: number; remainingRounds: number; effectRound: Round | null;
      heatBefore: number; heatAfter: number; expectedHits: number; resolvedHits: number;
      woundApplied: number; vulnerabilityApplied: boolean; vulnerabilityAfter: Encounter['vulnerable'] }
  | { kind: 'pending'; action: 'created' | 'resolved' | 'cancelled'; shot: number; ammo: Round; source: DamageSource; effectId: string }
  | { kind: 'lifecycle'; stage: 'turn-start' | 'action-complete' | 'delayed-start' | 'turn-end' | 'enemy-action' |
      'turn-ready' | 'victory' | 'defeat' | 'reset'; before: Snapshot; after: Snapshot; pending?: number };

export type CombatTraceEvent = TracePayload & { combatId: string; targetId: string; turn: number };
export interface CombatTraceSink {
  combatId: string;
  targetId: string;
  emit: (event: CombatTraceEvent) => void;
}

// 컨트롤러가 애니메이션 중 일제사격을 폐기하면 아직 처리하지 않은 효과도 함께 끝난다.
export function traceControllerCombat(sink: CombatTraceSink) {
  const pending = new Map<string, Extract<CombatTraceEvent, { kind: 'pending' }>>();
  return {
    combatId: sink.combatId, targetId: sink.targetId,
    emit(event: CombatTraceEvent) {
      if (event.kind === 'pending') {
        if (event.action === 'created') pending.set(event.effectId, event);
        else pending.delete(event.effectId);
      }
      sink.emit(event);
    },
    cancelPending() {
      for (const event of pending.values()) sink.emit({ ...event, action: 'cancelled' });
      pending.clear();
    },
  };
}

export function traceTurn(sink: CombatTraceSink | undefined, turn: number) {
  if (sink) return (event: TracePayload) => sink.emit({ ...event, combatId: sink.combatId, targetId: sink.targetId, turn });
}

export type TraceWriter = (event: TracePayload) => void;
type Stage = Extract<TracePayload, { kind: 'lifecycle' }>['stage'];
export function traceTransition(write: TraceWriter | undefined, stage: Stage, before: Encounter, after = before, pending?: number) {
  if (!write) return;
  const snapshot = traceState(before);
  write({ kind: 'lifecycle', stage, before: snapshot, after: before === after ? snapshot : traceState(after), pending });
}

export interface TraceFilter { targetId?: string; ammo?: Round; turn?: number; source?: DamageSource; combatId?: string }

function matches(event: CombatTraceEvent, filter: TraceFilter) {
  return (filter.combatId === undefined || event.combatId === filter.combatId)
    && (filter.targetId === undefined || event.targetId === filter.targetId)
    && (filter.turn === undefined || event.turn === filter.turn)
    && (filter.ammo === undefined || ('ammo' in event && event.ammo === filter.ammo))
    && (filter.source === undefined || ('source' in event && event.source === filter.source));
}

export class CombatTraceBuffer {
  private readonly events: CombatTraceEvent[] = [];
  private count = 0;

  constructor(private readonly capacity = 2048) {
    if (!Number.isSafeInteger(capacity) || capacity < 1) throw new RangeError('추적 용량은 양의 정수여야 합니다.');
  }

  sink(combatId: string, targetId = 'target-1'): CombatTraceSink {
    return { combatId, targetId, emit: event => { this.events[this.count++ % this.capacity] = event; } };
  }

  recent(filter: TraceFilter = {}, limit = 50) {
    if (!Number.isSafeInteger(limit) || limit < 0) throw new RangeError('조회 개수는 0 이상의 정수여야 합니다.');
    const result: CombatTraceEvent[] = [];
    const first = this.count - this.events.length;
    for (let i = this.count - 1; i >= first && result.length < limit; --i) {
      const event = this.events[i % this.capacity]!;
      if (matches(event, filter)) result.push(event);
    }
    return result.reverse();
  }

  export(filter: TraceFilter = {}) {
    return { recorded: this.count, dropped: this.count - this.events.length, events: this.recent(filter, this.capacity) };
  }
}
