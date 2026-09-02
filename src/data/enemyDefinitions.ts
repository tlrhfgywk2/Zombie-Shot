import type { EnemyIntentState, EnemyState, EnemyType, StatusType } from '../combat/types';

export interface EnemyDefinition {
  id: EnemyType;
  name: string;
  role: string;
  hp: number;
  armor: number;
  distance: number;
  advancePerTurn: number;
  staggerThreshold: number;
  special: boolean;
  intent?: Omit<EnemyIntentState, 'countdown'> & { initialCountdown: number };
}

export const ENEMY_DEFINITIONS: Record<EnemyType, EnemyDefinition> = {
  normal: { id: 'normal', name: '일반 감염체', role: '기본 표적', hp: 76, armor: 0, distance: 8, advancePerTurn: 2, staggerThreshold: 100, special: false },
  armored: { id: 'armored', name: '장갑 감염체', role: '관통탄 준비가 필요한 표적', hp: 82, armor: 28, distance: 9, advancePerTurn: 2, staggerThreshold: 115, special: false },
  fast: { id: 'fast', name: '질주 감염체', role: '충격과 냉기로 제어할 표적', hp: 66, armor: 0, distance: 8, advancePerTurn: 3, staggerThreshold: 85, special: false },
  tough: { id: 'tough', name: '거대 감염체', role: '긴 연계를 시험하는 표적', hp: 126, armor: 10, distance: 10, advancePerTurn: 1.7, staggerThreshold: 135, special: false },
  contaminator: { id: 'contaminator', name: '오염 투척체', role: '장착물 슬롯을 봉쇄', hp: 118, armor: 12, distance: 10, advancePerTurn: 1.7, staggerThreshold: 115, special: true, intent: { type: 'contaminate', name: '오염 투척', description: '다음 행동: 장착물 슬롯 하나를 2턴 봉쇄', initialCountdown: 1, cooldown: 3 } },
  groundshaker: { id: 'groundshaker', name: '지반 파쇄체', role: '정확도 중심 빌드를 흔듦', hp: 132, armor: 18, distance: 10, advancePerTurn: 1.55, staggerThreshold: 130, special: true, intent: { type: 'groundShock', name: '지반 충격', description: '다음 행동: 정확도 -22% (2턴)', initialCountdown: 1, cooldown: 3 } },
  screecher: { id: 'screecher', name: '공명 비명체', role: '원거리 효율을 압박', hp: 108, armor: 6, distance: 12, advancePerTurn: 1.9, staggerThreshold: 105, special: true, intent: { type: 'sonicPulse', name: '초음파 공명', description: '다음 행동: 유효 거리 1단계 감소 (2턴)', initialCountdown: 1, cooldown: 3 } },
};

export const WAVE_ROSTER: readonly (readonly EnemyType[])[] = [['normal'], ['normal', 'fast'], ['armored', 'normal'], ['fast', 'armored'], ['tough', 'fast', 'armored']];
const emptyBuildup = (): Record<StatusType, number> => ({ burn: 0, chill: 0, shock: 0, corruption: 0 });

export const createEnemyState = (type: EnemyType): EnemyState => {
  const definition = ENEMY_DEFINITIONS[type];
  const intent = definition.intent ? { type: definition.intent.type, name: definition.intent.name, description: definition.intent.description, countdown: definition.intent.initialCountdown, cooldown: definition.intent.cooldown } : undefined;
  return {
    type, hp: definition.hp, maxHp: definition.hp, armor: definition.armor, maxArmor: definition.armor,
    distance: definition.distance, advancePerTurn: definition.advancePerTurn, staggerThreshold: definition.staggerThreshold,
    special: definition.special, turnsElapsed: 0, intent,
    statuses: { burnTurns: 0, slowTurns: 0, staggerTurns: 0, shockTurns: 0, exposedShots: 0, corruptedShots: 0, impact: 0, buildup: emptyBuildup() },
  };
};
