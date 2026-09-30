import { describe, expect, it } from 'vitest';
import { CombatResolver, getActionShockThreshold } from '../combat/CombatResolver';
import { createEnemyState, ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import type { AmmoType, EnemyType } from '../combat/types';

const resolver = new CombatResolver();
const durable = (distance = 3, actionShock = 0) => ({ ...createEnemyState('normal'), hp: 1000, maxHp: 1000, distance, actionShock });
const plans: Record<string, AmmoType[]> = {
  '평두 연사': ['flatNose', 'flatNose', 'flatNose', 'flatNose'],
  '중량 연사': ['heavy', 'heavy', 'heavy', 'heavy'],
  '저충격 연사': ['reducedImpact', 'reducedImpact', 'reducedImpact', 'reducedImpact'],
  '강타 연사': ['hammer', 'hammer', 'hammer', 'hammer'],
  '증폭 연사': ['resonance', 'resonance', 'resonance', 'resonance'],
  '연쇄 일반탄': ['impactRelay', 'ball', 'ball', 'ball'],
  '충격 혼합': ['impactRelay', 'hammer', 'resonance', 'heavy'],
  '기존 폭발': ['explosive', 'highExplosive', 'stickyCharge', 'heavy'],
  '저반동 기폭': ['explosive', 'highExplosive', 'stickyCharge', 'reducedImpact'],
  '충격 연쇄 기폭': ['explosive', 'impactRelay', 'stickyCharge', 'ball'],
};

describe('충격 탄약 밸런스 비교', () => {
  it('세 거리에서 체력 피해·행동 충격·기폭 피해·반동을 기존 탄약과 비교한다', () => {
    const rows = Object.entries(plans).flatMap(([name, rounds]) => [3, 7, 11].map(distance => {
      const result = resolver.resolveSequence(rounds, durable(distance));
      return { name, distance, damage: result.totalHpDamage, shock: result.totalActionShockApplied,
        explosion: result.firepowerBreakdown.detonationDamage, recoil: result.shots.at(-1)!.breakdown.recoilAfter };
    }));
    console.table(rows);
    for (const distance of [3, 7, 11]) {
      const at = (name: string) => rows.find(row => row.name === name && row.distance === distance)!;
      expect(at('저충격 연사').shock).toBeLessThan(at('평두 연사').shock);
      expect(at('저충격 연사').recoil).toBe(0);
      expect(at('강타 연사').shock).toBeGreaterThan(at('평두 연사').shock);
      expect(at('강타 연사').recoil).toBeGreaterThan(at('평두 연사').recoil);
      expect(at('증폭 연사').shock).toBeLessThan(at('평두 연사').shock);
      expect(at('저반동 기폭').explosion).toBe(at('기존 폭발').explosion);
      expect(at('저반동 기폭').damage).toBeLessThanOrEqual(at('기존 폭발').damage);
      expect(at('저반동 기폭').shock).toBe(at('기존 폭발').shock);
      expect(at('저반동 기폭').recoil).toBeLessThan(at('기존 폭발').recoil);
    }
  });

  it('증폭 준비·긴 탄창의 보상과 단발 충격탄의 우위를 구분한다', () => {
    const rows = [0, 2, 4, 6, 8].flatMap(actionShock => [4, 6].flatMap(slots =>
      (['flatNose', 'hammer', 'resonance'] as const).map(ammo => {
        const result = resolver.resolveSequence(Array<AmmoType>(slots).fill(ammo), durable(3, actionShock));
        return { ammo, actionShock, slots, addedShock: result.totalActionShockApplied,
          recoil: result.shots.at(-1)!.breakdown.recoilAfter };
      })));
    console.table(rows);
    const at = (ammo: string, actionShock: number, slots: number) => rows.find(row => row.ammo === ammo && row.actionShock === actionShock && row.slots === slots)!;
    expect(at('resonance', 0, 4).addedShock).toBe(15);
    expect(at('resonance', 4, 4).addedShock).toBe(22);
    expect(at('resonance', 0, 6).addedShock).toBe(27);
    for (const row of rows.filter(row => row.ammo === 'resonance')) {
      expect(row.addedShock).toBeLessThanOrEqual(at('hammer', row.actionShock, row.slots).addedShock);
      expect(row.recoil).toBeLessThan(at('hammer', row.actionShock, row.slots).recoil);
    }
  });

  it('적 7종의 접근·특수·치명 공격에서 단발 행동 중단 범위를 비교한다', () => {
    const rows = (Object.keys(ENEMY_DEFINITIONS) as EnemyType[]).flatMap(type => [false, true].flatMap(attack =>
      (['flatNose', 'reducedImpact', 'hammer', 'resonance'] as const).map(ammo => {
        const enemy = createEnemyState(type);
        if (attack) enemy.distance = 0;
        const result = resolver.resolveShot(ammo, 0, enemy);
        const action = resolver.resolveEnemyAction(result.after);
        return { type, ammo, action: action.selectedAction, threshold: getActionShockThreshold(enemy),
          shock: result.actionShockApplied, interrupted: action.interrupted };
      })));
    console.table(rows);
    expect(rows.filter(row => row.ammo === 'hammer' && row.action === 'approach').every(row => row.interrupted)).toBe(true);
    expect(rows.filter(row => row.action === 'attack').every(row => !row.interrupted)).toBe(true);
  });
});
