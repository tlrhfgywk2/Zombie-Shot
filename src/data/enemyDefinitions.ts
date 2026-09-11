import type { EnemyIntentState, EnemyState, EnemyType, StatusType } from '../combat/types';

export interface EnemyDefinition {
  id: EnemyType;
  name: string;
  role: string;
  hp: number;
  armor: number;
  distance: number;
  advancePerTurn: number;
  shockResistance: number;
  special: boolean;
  intent?: Omit<EnemyIntentState, 'countdown'> & { initialCountdown: number };
}

export const ENEMY_DEFINITIONS: Record<EnemyType, EnemyDefinition> = {
  normal: { id: 'normal', name: '일반 감염체', role: '기본 표적', hp: 22, armor: 0, distance: 8, advancePerTurn: 2, shockResistance: 0, special: false },
  armored: { id: 'armored', name: '장갑 감염체', role: '방어 파괴가 효율적인 표적', hp: 28, armor: 5, distance: 9, advancePerTurn: 2, shockResistance: 1, special: false },
  fast: { id: 'fast', name: '질주 감염체', role: '충격으로 제어할 근접 압박 표적', hp: 20, armor: 0, distance: 5, advancePerTurn: 3.1, shockResistance: -1, special: false },
  tough: { id: 'tough', name: '거대 감염체', role: '긴 연계를 시험하는 표적', hp: 38, armor: 0, distance: 10, advancePerTurn: 1.7, shockResistance: 2, special: false },
  contaminator: { id: 'contaminator', name: '오염 투척체', role: '장착물 슬롯을 봉쇄', hp: 50, armor: 3, distance: 6, advancePerTurn: 2.8, shockResistance: 1, special: true, intent: { type: 'contaminate', name: '오염 투척', description: '다음 행동: 장착물 슬롯 하나를 2턴 봉쇄', initialCountdown: 1, cooldown: 3 } },
  groundshaker: { id: 'groundshaker', name: '지반 파쇄체', role: '반동 제어를 흔듦', hp: 54, armor: 8, distance: 6.5, advancePerTurn: 2.8, shockResistance: 2, special: true, intent: { type: 'groundShock', name: '지반 충격', description: '다음 행동: 강한 반동 후속 화력 -3 (2턴)', initialCountdown: 1, cooldown: 3 } },
  screecher: { id: 'screecher', name: '공명 비명체', role: '원거리 효율을 압박', hp: 46, armor: 0, distance: 7, advancePerTurn: 3, shockResistance: 1, special: true, intent: { type: 'sonicPulse', name: '초음파 공명', description: '다음 행동: 유효 거리 1단계 악화 (2턴)', initialCountdown: 1, cooldown: 3 } },
};

const emptyBuildup = (): Record<StatusType, number> => ({ burn: 0, chill: 0, shock: 0, corruption: 0 });

export const createEnemyState = (type: EnemyType): EnemyState => {
  const definition = ENEMY_DEFINITIONS[type];
  const intent = definition.intent ? { type: definition.intent.type, name: definition.intent.name, description: definition.intent.description, countdown: definition.intent.initialCountdown, cooldown: definition.intent.cooldown } : undefined;
  return {
    type, hp: definition.hp, maxHp: definition.hp, armor: definition.armor, maxArmor: definition.armor,
    distance: definition.distance, advancePerTurn: definition.advancePerTurn, shockResistance: definition.shockResistance,
    actionShock: 0, special: definition.special, turnsElapsed: 0, intent,
    statuses: { burnTurns: 0, slowTurns: 0, shockTurns: 0, corruptedShots: 0, buildup: emptyBuildup() },
  };
};
