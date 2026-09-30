import { describe, expect, it } from 'vitest';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState, ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import type { AmmoType, EnemyType } from '../combat/types';

const resolver = new CombatResolver();
const plans: Record<string, AmmoType[]> = {
  '표준탄': ['ball', 'ball', 'ball', 'ball'],
  '고압 연사': ['plusP', 'plusP', 'plusP', 'plusP'],
  '반동 연계': ['plusP', 'plusP', 'kickback', 'ball'],
  '상처 연계': ['wounding', 'wounding', 'laceration', 'laceration'],
  '폭발 연계': ['explosive', 'explosive', 'explosive', 'flatNose'],
  '고폭 연계': ['highExplosive', 'highExplosive', 'highExplosive', 'flatNose'],
  '접착 연계': ['stickyCharge', 'stickyCharge', 'stickyCharge', 'flatNose'],
  '혼합 연계': ['explosive', 'highExplosive', 'stickyCharge', 'heavy'],
};

describe('폭발 탄약 밸런스', () => {
  it('세 거리의 피해·기폭·반동과 기존 연계를 비교한다', () => {
    const rows = Object.entries(plans).flatMap(([name, rounds]) => [3, 7, 11].map(distance => {
      const enemy = { ...createEnemyState('normal'), hp: 1000, maxHp: 1000, distance };
      const result = resolver.resolveSequence(rounds, enemy);
      return { name, distance, damage: result.totalHpDamage, explosion: result.firepowerBreakdown.detonationDamage,
        recoil: result.shots.at(-1)!.breakdown.recoilAfter };
    }));
    console.table(rows);
    for (const distance of [3, 7, 11]) {
      const at = rows.filter(row => row.distance === distance);
      const baseline = at.find(row => row.name === '표준탄')!.damage;
      for (const row of at.filter(row => row.explosion > 0)) {
        expect(row.damage).toBeGreaterThan(baseline);
        expect(row.damage).toBeLessThanOrEqual(at.find(candidate => candidate.name === '반동 연계')!.damage * 1.3);
      }
    }
  });

  it('모든 적의 시작 상태에서 처치 시점과 남은 체력을 비교한다', () => {
    const rows = (Object.keys(ENEMY_DEFINITIONS) as EnemyType[]).flatMap(type =>
      Object.entries(plans).map(([name, rounds]) => {
        const result = resolver.resolveSequence(rounds, createEnemyState(type));
        return { enemy: ENEMY_DEFINITIONS[type].name, special: ENEMY_DEFINITIONS[type].special, name, hp: result.finalState.hp,
          shots: result.shots.length, killed: result.killed };
      }));
    console.table(rows);
    expect(rows.filter(row => row.special).every(row => !row.killed)).toBe(true);
  });

  it('기폭하지 않은 폭발탄 연사는 표준탄보다 약하고 쌓인 수치는 남는다', () => {
    const enemy = { ...createEnemyState('normal'), hp: 1000, maxHp: 1000, distance: 3 };
    const baseline = resolver.resolveSequence(plans['표준탄']!, enemy).totalHpDamage;
    for (const ammo of ['explosive', 'highExplosive', 'stickyCharge'] as const) {
      const result = resolver.resolveSequence(Array<AmmoType>(4).fill(ammo), enemy);
      expect(result.totalHpDamage).toBeLessThan(baseline);
      expect(result.finalState.explosive).toBeGreaterThan(0);
      expect(result.firepowerBreakdown.detonationDamage).toBe(0);
    }
  });
});
