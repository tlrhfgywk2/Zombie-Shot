import type { EnemyType } from '../combat/types';

export type EnemyHpProfile = 'exploration' | 'v7';
export interface EnemyHpCurve {
  depths: readonly number[];
  hp: Record<EnemyType, readonly number[]>;
}

/** HP 이외의 적 능력과 거리에는 적용하지 않는 구간별 정수 보간. */
export function interpolateEnemyHp(type: EnemyType, depth: number, curve: EnemyHpCurve): number {
  if (!Number.isFinite(depth) || depth < 1) throw new Error('탐험 깊이는 1 이상의 유한한 수여야 합니다.');
  const values = curve.hp[type];
  const position = Math.min(depth, curve.depths.at(-1)!);
  const upper = curve.depths.findIndex(node => node >= position);
  if (upper === 0) return values[0]!;
  const low = upper - 1;
  const ratio = (position - curve.depths[low]!) / (curve.depths[upper]! - curve.depths[low]!);
  return Math.round(values[low]! + (values[upper]! - values[low]!) * ratio);
}

// 최종 수치는 tools/hp-balance의 비교 실행 뒤 선택한다. 전체 일괄 배율은 사용하지 않는다.
export const ENEMY_HP_CURVES: Record<EnemyHpProfile, EnemyHpCurve> = {
  exploration: { depths: [1, 3, 6, 8], hp: {
    normal: [22, 28, 46, 50], brute: [32, 40, 82, 94], fast: [20, 24, 40, 44],
    tough: [38, 48, 108, 120], contaminator: [50, 58, 78, 90],
    groundshaker: [54, 64, 84, 94], screecher: [46, 56, 80, 92],
  } },
  v7: { depths: [1, 3, 5, 6, 8], hp: {
    normal: [22, 26, 28, 30, 32], brute: [32, 38, 50, 56, 68], fast: [20, 24, 30, 34, 38],
    tough: [38, 44, 76, 82, 92], contaminator: [50, 56, 78, 78, 82],
    groundshaker: [54, 60, 70, 72, 76], screecher: [46, 52, 64, 66, 72],
  } },
};
export const getEnemyHp = (type: EnemyType, depth: number, profile: EnemyHpProfile): number =>
  interpolateEnemyHp(type, depth, ENEMY_HP_CURVES[profile]);
