import { ACTION_NAMES } from '../combat/CombatResolver';
import type { EnemyActionPreview, EnemyActionResult } from '../combat/types';

export const enemyActionPreviewText = (action: EnemyActionPreview): string => {
  const movement = `${action.movement.toFixed(1)} m`;
  if (action.suppressedIntent) return `${ACTION_NAMES[action.suppressedIntent]} 봉쇄 → 접근 ${movement}`;
  if (action.rangeDelayed) return `${ACTION_NAMES[action.selectedAction]} 지연 → 접근 ${movement}`;
  if (action.delayedAction && action.selectedAction === 'approach') return `${ACTION_NAMES[action.delayedAction]} 지연 → 접근 ${movement}`;
  return action.selectedAction === 'approach' ? `접근 ${movement}` : ACTION_NAMES[action.selectedAction];
};

export const enemyActionResultText = (action: EnemyActionResult): string => {
  if (action.resolution === 'dead') return '처치';
  if (action.interrupted) return `${ACTION_NAMES[action.selectedAction]} · 충격 중단`;
  if (action.resolution === 'retreat-delayed') return `${ACTION_NAMES[action.selectedAction]} 지연 → 접근 ${action.movement.toFixed(1)} m`;
  if (action.suppressedIntent) return `${ACTION_NAMES[action.suppressedIntent]} 봉쇄 → 접근 ${action.movement.toFixed(1)} m`;
  return action.executedAction === 'approach' ? `접근 ${action.movement.toFixed(1)} m` : ACTION_NAMES[action.selectedAction];
};
