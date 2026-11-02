import type { EnemyIntentState, EnemyState, EnemyType } from '../combat/types';
import { COMBAT_BALANCE } from './ammoDefinitions';
import { createBehaviorState } from '../combat/EnemyBehavior';
import type { BehaviorArchetype } from '../combat/types';
export interface EnemyDefinition {
  id: EnemyType; name: string; role: string; hp: number; distance: number;
  advancePerTurn: number; shockResistance: number; special: boolean;
  woundThreshold?: number;
  burnThreshold?: number;
  behavior?: BehaviorArchetype;
  intent?: Omit<EnemyIntentState, 'countdown'> & { initialCountdown: number };
}
export const ENEMY_DEFINITIONS: Record<EnemyType, EnemyDefinition> = {
  normal: { id: 'normal', burnThreshold: 20, name: '일반 감염체', role: '기본 표적', hp: 22, distance: 8, advancePerTurn: 2, shockResistance: 0, special: false },
  brute: { id: 'brute', burnThreshold: 24, name: '강인한 감염체', role: '큰 체력의 표적', hp: 32, distance: 9, advancePerTurn: 2, shockResistance: 1, special: false },
  fast: { id: 'fast', burnThreshold: 16, name: '질주 감염체', role: '충격으로 제어할 근접 압박 표적', hp: 20, distance: 5, advancePerTurn: 3.1, shockResistance: -1, special: false },
  tough: { id: 'tough', burnThreshold: 28, name: '거대 감염체', role: '긴 연계를 시험하는 표적', hp: 38, distance: 10, advancePerTurn: 1.7, shockResistance: 2, special: false },
  contaminator: { id: 'contaminator', burnThreshold: 20, name: '오염 투척체', role: '장착물 슬롯을 봉쇄', hp: 50, distance: 6, advancePerTurn: 2.8, shockResistance: 1, special: true, intent: { type: 'contaminate', name: '오염 투척', description: '장착물 슬롯 하나를 2턴 동안 봉쇄합니다.', initialCountdown: 1, cooldown: 3 } },
  groundshaker: { id: 'groundshaker', burnThreshold: 24, name: '지반 파쇄체', role: '반동 제어를 흔듦', hp: 54, distance: 6.5, advancePerTurn: 2.8, shockResistance: 2, special: true, intent: { type: 'groundShock', name: '지반 충격', description: '반동에 따른 화력 감소를 2턴 동안 강화합니다.', initialCountdown: 1, cooldown: 3 } },
  screecher: { id: 'screecher', burnThreshold: 18, name: '공명 비명체', role: '원거리 효율을 압박', hp: 46, distance: 7, advancePerTurn: 3, shockResistance: 1, special: true, intent: { type: 'sonicPulse', name: '초음파 공명', description: '유효 거리 판정을 2턴 동안 1단계 악화합니다.', initialCountdown: 1, cooldown: 3 } },
  shieldCharger: { id: 'shieldCharger', burnThreshold: 20, name: '방패 돌진체', role: '방어 뒤 노출 · 5 m 돌진', hp: 32, distance: 7, advancePerTurn: 1.5, shockResistance: 0, special: true, behavior: 'shieldCharger' },
  frenzied: { id: 'frenzied', burnThreshold: 20, name: '광란 감염체', role: '준비 중 노출 · 근접 치명 공격', hp: 32, distance: 4.5, advancePerTurn: 2, shockResistance: 0, special: true, behavior: 'frenzied' },
  disruptor: { id: 'disruptor', burnThreshold: 20, name: '장비 교란체', role: '준비 뒤 장착물 1턴 봉쇄', hp: 32, distance: 7, advancePerTurn: 1.7, shockResistance: 0, special: true, behavior: 'disruptor' },
};
export const createEnemyState = (type: EnemyType): EnemyState => {
  const definition = ENEMY_DEFINITIONS[type];
  const intent = definition.intent ? { type: definition.intent.type, name: definition.intent.name,
    description: definition.intent.description, countdown: definition.intent.initialCountdown,
    cooldown: definition.intent.cooldown } : undefined;
  return { type, hp: definition.hp, maxHp: definition.hp, wound: 0, explosive: 0, burn: 0,
    burnThreshold: definition.burnThreshold ?? COMBAT_BALANCE.burnThreshold, ignitedActions: 0,
    woundThreshold: definition.woundThreshold ?? COMBAT_BALANCE.woundThreshold,
    vulnerableTurns: 0, distance: definition.distance,
    advancePerTurn: definition.advancePerTurn, shockResistance: definition.shockResistance,
    actionShock: 0, special: definition.special, turnsElapsed: 0, intent,
    behavior: definition.behavior ? createBehaviorState(definition.behavior) : undefined };
};
