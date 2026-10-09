import type { EnemyIntentType } from '../combat/types';
import { COMBAT_BALANCE } from './ammoDefinitions';

/** 임시 밸런스 값. 능력별 최대 사거리는 여기에서 독립적으로 조정한다. */
export const ENEMY_RANGED_ACTIONS: Record<EnemyIntentType, { maxRange: number }> = {
  contaminate: { maxRange: COMBAT_BALANCE.rangeThresholds.mid },
  groundShock: { maxRange: COMBAT_BALANCE.rangeThresholds.near },
  sonicPulse: { maxRange: COMBAT_BALANCE.maxDistance },
};
