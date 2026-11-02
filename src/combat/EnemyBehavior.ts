import { ENEMY_BEHAVIORS, DISRUPTION_BALANCE } from '../data/enemyBehaviorDefinitions';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_SLOT_ORDER, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import type { WeaponId } from '../data/weaponDefinitions';
import { getEnabledAttachmentIds } from './AttachmentLoadout';
import type { BehaviorArchetype, BehaviorOffensiveAction, BehaviorPhase, EnemyActionType, EnemyBehaviorState, EnemyState, PlayerCombatState } from './types';

export const createBehaviorState = (archetype: BehaviorArchetype): EnemyBehaviorState => {
  const phase = ENEMY_BEHAVIORS[archetype].initial;
  return { archetype, phase, remaining: ENEMY_BEHAVIORS[archetype].phases[phase]!.opportunities, guardPressure: 0, guardHits: 0 };
};
export const behaviorPhase = (enemy: EnemyState) => enemy.behavior
  ? ENEMY_BEHAVIORS[enemy.behavior.archetype].phases[enemy.behavior.phase]! : undefined;
export const behaviorDamagePercent = (enemy: EnemyState): number => behaviorPhase(enemy)?.directDamagePercent ?? 100;
export const isBehaviorOffense = (action: EnemyActionType): action is BehaviorOffensiveAction =>
  action === 'charge' || action === 'frenzy' || action === 'disrupt';
export const guardBreakReady = (enemy: EnemyState): boolean => {
  const state = enemy.behavior;
  if (!state || state.phase !== 'guard') return false;
  const threshold = ENEMY_BEHAVIORS[state.archetype].guardBreak;
  return Boolean(threshold && (state.guardPressure >= threshold.pressure || state.guardHits >= threshold.hits));
};
/** 명중 중에는 압력만 누적한다. 배율·단계·예고는 행동 경계까지 고정한다. */
export function recordGuardHit(enemy: EnemyState, directDamage: number): void {
  if (enemy.behavior?.phase !== 'guard' || directDamage <= 0) return;
  enemy.behavior.guardPressure += directDamage;
  enemy.behavior.guardHits += 1;
}
export function transitionBehavior(enemy: EnemyState, next: BehaviorPhase, transition: EnemyBehaviorState['transition']): void {
  const state = enemy.behavior;
  if (!state) return;
  enemy.behavior = { ...state, phase: next, remaining: ENEMY_BEHAVIORS[state.archetype].phases[next]!.opportunities,
    guardPressure: 0, guardHits: 0, transition };
}
export function advanceBehavior(enemy: EnemyState): void {
  if (!enemy.behavior) return;
  enemy.behavior.remaining -= 1;
  if (enemy.behavior.remaining <= 0) transitionBehavior(enemy, behaviorPhase(enemy)!.next, 'cycle');
}

/** 탄창 용량은 건드리지 않는다. 실제 호환·활성 장착물만 고정 순서로 예고한다. */
export function disruptionTarget(loadout: LoadoutSnapshot, player: PlayerCombatState, weapon: WeaponId = 'p220') {
  const enabled = getEnabledAttachmentIds(loadout, player, weapon);
  return ATTACHMENT_SLOT_ORDER.find(slot => slot !== 'magazine' && loadout[slot]
    && enabled.includes(loadout[slot]!) && ATTACHMENT_DEFINITIONS[loadout[slot]!].slot === slot);
}
export function applyDisruption(player: PlayerCombatState, before: PlayerCombatState, loadout: LoadoutSnapshot, weapon: WeaponId): void {
  const slot = disruptionTarget(loadout, before, weapon);
  if (slot) player.disabledSlots[slot] = DISRUPTION_BALANCE.duration;
  else {
    player.rangePenaltySteps = Math.max(player.rangePenaltySteps, DISRUPTION_BALANCE.fallbackRangeSteps);
    player.rangePenaltyTurns = Math.max(player.rangePenaltyTurns, DISRUPTION_BALANCE.duration);
  }
}
