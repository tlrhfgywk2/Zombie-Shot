import type { BehaviorAction, BehaviorArchetype, BehaviorPhase } from '../combat/types';

export interface BehaviorPhaseDefinition {
  name: string;
  action: BehaviorAction;
  next: BehaviorPhase;
  /** 이 감염체 자신의 행동 기회 수. 탄 수나 전역 턴 수가 아니다. */
  opportunities: number;
  directDamagePercent: number;
  movement: number;
  color: number;
}
export interface EnemyBehaviorDefinition {
  initial: BehaviorPhase;
  phases: Partial<Record<BehaviorPhase, BehaviorPhaseDefinition>>;
  guardBreak?: { pressure: number; hits: number };
}
const phase = (name: string, action: BehaviorAction, next: BehaviorPhase, directDamagePercent: number,
  movement: number, color: number): BehaviorPhaseDefinition =>
  ({ name, action, next, opportunities: 1, directDamagePercent, movement, color });

/** 실험 밸런스: 직접 화력만 조정한다. 상처·화상·폭발·충격의 기존 의미를 보존한다. */
export const ENEMY_BEHAVIORS: Record<BehaviorArchetype, EnemyBehaviorDefinition> = {
  shieldCharger: {
    initial: 'guard', guardBreak: { pressure: 18, hits: 3 },
    phases: {
      guard: phase('방어', 'guard', 'windup', 60, 1.5, 0x75b7ee),
      windup: phase('돌진 준비', 'charge', 'recovery', 140, 5, 0xffa34f),
      recovery: phase('회복', 'recover', 'guard', 130, 0, 0x7be4be),
    },
  },
  frenzied: {
    initial: 'windup',
    phases: {
      windup: phase('광란 준비', 'frenzy', 'recovery', 150, 3.5, 0xff805f),
      recovery: phase('회복', 'recover', 'windup', 125, 0, 0x7be4be),
    },
  },
  disruptor: {
    initial: 'prepare',
    phases: {
      prepare: phase('교란 준비', 'prepareDisruption', 'disruption', 100, 1.7, 0xd3a5ff),
      disruption: phase('교란 직전', 'disrupt', 'recovery', 120, 0, 0xffa34f),
      recovery: phase('회복', 'recover', 'prepare', 120, 0, 0x7be4be),
    },
  },
};
export const DISRUPTION_BALANCE = { maxRange: 8, duration: 1, fallbackRangeSteps: 1 } as const;
