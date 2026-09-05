import type { EnemyType } from '../combat/types';
import { ENEMY_DEFINITIONS } from './enemyDefinitions';

export type RouteKind = 'normal' | 'special';

export interface RouteOption {
  kind: RouteKind;
  title: string;
  subtitle: string;
  roster: readonly EnemyType[];
  reward: string;
}

export interface EncounterStage {
  normal: RouteOption;
  special?: RouteOption;
}

const normal = (title: string, roster: readonly EnemyType[]): RouteOption => ({
  kind: 'normal', title, subtitle: '예측 가능한 감염체 무리', roster, reward: '탄약 배분 선택 +1 · 다음 구간에서 잔량 회복',
});

const special = (enemy: EnemyType): RouteOption => ({
  kind: 'special', title: ENEMY_DEFINITIONS[enemy].name, subtitle: ENEMY_DEFINITIONS[enemy].role,
  roster: [enemy], reward: '미소유 부착물 1개 확정 · 탄약 배분 선택 +1',
});

export const ENCOUNTER_STAGES: readonly EncounterStage[] = [
  { normal: normal('외곽 골목', ['normal', 'normal']) },
  { normal: normal('붕괴된 교차로', ['normal', 'fast']), special: special('contaminator') },
  { normal: normal('장갑 검문소', ['armored', 'normal']), special: special('groundshaker') },
  { normal: normal('공명 지하도', ['fast', 'armored']), special: special('screecher') },
  { normal: normal('최종 방어선', ['tough', 'fast', 'armored']), special: special('groundshaker') },
];
