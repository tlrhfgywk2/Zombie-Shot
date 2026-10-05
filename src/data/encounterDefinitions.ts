import type { EnemyType } from '../combat/types';
export type RouteKind = 'normal' | 'special';
export interface RouteOption { kind: RouteKind; title: string; subtitle: string; roster: readonly EnemyType[]; reward: string }
export interface EncounterStage { normal: RouteOption; special?: RouteOption }
const normal = (title: string, roster: readonly EnemyType[]): RouteOption => ({
  kind: 'normal', title, subtitle: '모든 행동을 시험하는 훈련 표적', roster, reward: '',
});
export const ENCOUNTER_STAGES: readonly EncounterStage[] = [
  { normal: normal('훈련장', ['normal']) },
];
