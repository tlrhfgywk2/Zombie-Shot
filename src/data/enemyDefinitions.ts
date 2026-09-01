import type { EnemyState, EnemyType } from '../combat/types';

export interface EnemyDefinition {
  id: EnemyType;
  name: string;
  role: string;
  hp: number;
  armor: number;
  distance: number;
  advancePerTurn: number;
}

export const ENEMY_DEFINITIONS: Record<EnemyType, EnemyDefinition> = {
  normal: { id: 'normal', name: '일반 감염체', role: '기본 표적', hp: 72, armor: 0, distance: 10, advancePerTurn: 2 },
  armored: { id: 'armored', name: '장갑 감염체', role: '선행 방어 파괴 필요', hp: 78, armor: 24, distance: 10, advancePerTurn: 2 },
  fast: { id: 'fast', name: '질주 감염체', role: '이동 억제 필요', hp: 62, armor: 0, distance: 9, advancePerTurn: 3 },
  tough: { id: 'tough', name: '거대 감염체', role: '긴 연계 시험', hp: 112, armor: 8, distance: 11, advancePerTurn: 1.7 },
};

export const WAVE_ROSTER: readonly (readonly EnemyType[])[] = [
  ['normal'],
  ['normal', 'fast'],
  ['armored', 'normal'],
  ['fast', 'armored'],
  ['tough', 'fast', 'armored'],
];

export const createEnemyState = (type: EnemyType): EnemyState => {
  const definition = ENEMY_DEFINITIONS[type];
  return {
    type,
    hp: definition.hp,
    maxHp: definition.hp,
    armor: definition.armor,
    maxArmor: definition.armor,
    distance: definition.distance,
    advancePerTurn: definition.advancePerTurn,
    statuses: { burnTurns: 0, staggerTurns: 0, exposedShots: 0 },
  };
};
