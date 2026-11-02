import { behaviorPhase, disruptionTarget, guardBreakReady } from '../combat/EnemyBehavior';
import { previewEnemyAction } from '../combat/CombatResolver';
import { createPlayerCombatState } from '../combat/AttachmentLoadout';
import type { EnemyState, PlayerCombatState } from '../combat/types';
import { ATTACHMENT_SLOT_NAMES, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { ENEMY_BEHAVIORS } from '../data/enemyBehaviorDefinitions';
import type { WeaponId } from '../data/weaponDefinitions';

export function disruptionText(loadout: LoadoutSnapshot = {}, player = createPlayerCombatState(), weapon: WeaponId = 'p220'): string {
  const slot = disruptionTarget(loadout, player, weapon);
  return slot ? `${ATTACHMENT_SLOT_NAMES[slot]} 봉쇄 1턴` : '거리 교란 1턴';
}
export function behaviorView(enemy: EnemyState, loadout: LoadoutSnapshot = {}, player: PlayerCombatState = createPlayerCombatState(), weapon: WeaponId = 'p220', order = 1, activeCount = 1) {
  const state = enemy.behavior;
  const phase = behaviorPhase(enemy);
  if (!state || !phase) return undefined;
  const transition = state.transition === 'guardBreak' ? '방어 붕괴' : state.transition === 'shock' ? '충격 중단'
    : state.transition === 'ignition' ? '점화 봉쇄' : phase.name;
  const threshold = ENEMY_BEHAVIORS[state.archetype].guardBreak;
  const progress = state.phase === 'guard' && threshold
    ? guardBreakReady(enemy) ? '붕괴 예약' : `붕괴 ${state.guardPressure}/${threshold.pressure} · ${state.guardHits}/${threshold.hits}발` : '';
  const action = previewEnemyAction(enemy);
  const disruption = state.archetype === 'disruptor' && state.phase !== 'recovery' && action.selectedAction !== 'attack' ? disruptionText(loadout, player, weapon) : '';
  const timing = state.phase === 'guard' && !guardBreakReady(enemy) && action.selectedAction === 'guard' ? `돌진 ${order + activeCount * state.remaining}턴 뒤`
    : state.phase === 'prepare' && action.selectedAction === 'prepareDisruption' ? `교란 ${order + activeCount * state.remaining}턴 뒤` : '';
  return {
    label: transition,
    phase: state.phase,
    modifier: `직접 화력 ${phase.directDamagePercent}%`,
    detail: progress || disruption,
    timing,
    description: `${phase.name} · 직접 화력 ${phase.directDamagePercent}%. ${state.remaining}번의 자기 행동 기회 뒤 단계 전환.${progress ? ` ${progress}. 방어 중 누적 피해 또는 명중 횟수로 다음 행동을 취소합니다.` : ''}${disruption ? ` ${disruption}. 탄창 용량은 유지합니다.` : ''} 돌격은 이동만 하고, 치명 공격은 예고된 근접 공격에서만 실행합니다.`,
  };
}
export function behaviorMarkup(enemy: EnemyState, loadout?: LoadoutSnapshot, player?: PlayerCombatState, weapon?: WeaponId, order = 1, activeCount = 1): string {
  const view = behaviorView(enemy, loadout, player, weapon, order, activeCount);
  return view ? `<span class="behavior-state" data-behavior-phase="${view.phase}" title="${view.description}"><span><b>${view.label}${view.timing ? ` · ${view.timing}` : ''}</b><strong>${view.modifier}</strong></span>${view.detail ? `<em>${view.detail}</em>` : ''}</span>` : '';
}
