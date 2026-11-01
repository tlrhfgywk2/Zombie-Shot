import type { EnemyType } from '../combat/types';
import { ENEMY_DEFINITIONS } from './enemyDefinitions';

/** 적 체력·탄약 수치를 건드리지 않는 다수전 배치 값. 증원에는 적용하지 않는다. */
export const ENCOUNTER_SPACING = { pairedFast: 4, dangerousScreecher: 3.5, pairedGroundshaker: 4 } as const;
export const encounterStartingDistances = (roster: readonly EnemyType[]): readonly number[] => roster.map(type => {
  if (roster.length > 1) {
    if (type === 'fast') return ENCOUNTER_SPACING.pairedFast;
    if (type === 'groundshaker') return ENCOUNTER_SPACING.pairedGroundshaker;
    if (type === 'screecher' && roster.includes('contaminator')) return ENCOUNTER_SPACING.dangerousScreecher;
  }
  return ENEMY_DEFINITIONS[type].distance;
});
export type RouteKind = 'normal' | 'special';
export interface RouteOption { kind: RouteKind; title: string; subtitle: string; roster: readonly EnemyType[]; reinforcements?: readonly EnemyType[]; reward: string }
export interface EncounterStage { normal: RouteOption; special?: RouteOption }
const normal = (title: string, roster: readonly EnemyType[]): RouteOption => ({
  kind: 'normal', title, subtitle: roster.length === 1 ? '단독 조우' : '동시 2마리 · 탄창마다 한 마리 행동', roster, reward: '',
});
export const ENCOUNTER_STAGES: readonly EncounterStage[] = [
  { normal: normal('통로의 감염체', ['normal']) },
  { normal: normal('무리 조우', ['normal', 'normal']), special: { ...normal('질주와 거체', ['fast', 'tough']), kind: 'special' } },
  { normal: normal('단독 조우', ['brute']), special: { kind: 'special', title: '위험 조우', subtitle: '오염·공명 동시 출현 · 일반 감염체 증원 1마리', roster: ['contaminator', 'screecher'], reinforcements: ['normal'], reward: '부착물' } },
];

/** 탐험의 지도·보상은 유지하며 전투 구성만 확장한다. 진입 전에 같은 구성을 표시한다. */
export const explorationEncounter = (type: EnemyType): Pick<RouteOption, 'roster' | 'reinforcements'> => {
  if (['contaminator', 'groundshaker', 'screecher'].includes(type)) return { roster: [type, 'normal'], reinforcements: ['normal'] };
  if (type === 'fast') return { roster: ['fast', 'brute'] };
  if (type === 'tough') return { roster: ['normal', 'tough'] };
  return { roster: [type] };
};
