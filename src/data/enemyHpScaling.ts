import type { EnemyType } from '../combat/types';

export type EnemyHpProfile = 'exploration' | 'v7';
export interface EnemyHpCurve {
  depths: readonly number[];
  hp: Record<EnemyType, readonly number[]>;
  reserveHp?: Partial<Record<EnemyType, number>>;
}

/** HP 이외의 적 능력과 거리에는 적용하지 않는 구간별 정수 보간. */
export function interpolateEnemyHp(type: EnemyType, depth: number, curve: EnemyHpCurve, reserve = false): number {
  if (!Number.isFinite(depth) || depth < 1) throw new Error('탐험 깊이는 1 이상의 유한한 수여야 합니다.');
  const values = curve.hp[type];
  if (reserve && depth >= 8 && curve.reserveHp?.[type]) return curve.reserveHp[type]!;
  const position = Math.min(depth, curve.depths.at(-1)!);
  const upper = curve.depths.findIndex(node => node >= position);
  if (upper === 0) return values[0]!;
  const low = upper - 1;
  const ratio = (position - curve.depths[low]!) / (curve.depths[upper]! - curve.depths[low]!);
  return Math.round(values[low]! + (values[upper]! - values[low]!) * ratio);
}

// hp5: 즉사까지 남은 행동 수와 조우 내 유한 재고를 함께 비교한 절충 후보.
export const ENEMY_HP_CURVES: Record<EnemyHpProfile, EnemyHpCurve> = {
  exploration: { depths: [1, 3, 6, 8], hp: {
    normal: [22, 28, 46, 50], brute: [32, 40, 76, 86], fast: [20, 24, 60, 64],
    tough: [38, 48, 108, 120], contaminator: [50, 58, 78, 90],
    groundshaker: [54, 62, 74, 78], screecher: [46, 54, 76, 86],
  } },
  v7: { depths: [1, 3, 5, 6, 8], hp: {
    normal: [22, 26, 28, 30, 32], brute: [32, 38, 50, 56, 68], fast: [20, 24, 30, 34, 38],
    tough: [38, 44, 76, 82, 92], contaminator: [50, 54, 74, 74, 74],
    groundshaker: [54, 58, 62, 64, 70], screecher: [46, 50, 56, 58, 64],
  }, reserveHp: { groundshaker: 57 } },
};
export const getEnemyHp = (type: EnemyType, depth: number, profile: EnemyHpProfile, reserve = false): number =>
  interpolateEnemyHp(type, depth, ENEMY_HP_CURVES[profile], reserve);
