import { describe, expect, it } from 'vitest';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import { WEAPON_ORDER } from '../data/weaponDefinitions';
import type { AmmoType } from '../combat/types';

const resolver = new CombatResolver();
const plans: Record<string, AmmoType[]> = {
  '소이 → 소이 → 점화': ['incendiary', 'incendiary', 'ignition'],
  '촉진 → 고열 → 발화': ['accelerant', 'highHeat', 'kindling'],
  '고열 → 촉진 → 발화': ['highHeat', 'accelerant', 'kindling'],
  '저열 → 고열 → 점화': ['lowHeat', 'highHeat', 'ignition'],
  '소이 → 표준 → 고열': ['incendiary', 'ball', 'highHeat'],
  '소이 → 소이 → 표준': ['incendiary', 'incendiary', 'ball'],
  '표준 3발': ['ball', 'ball', 'ball'],
};
describe('화상 계열 집중 밸런스', () => {
  it('세 거리에서 대표 순서와 일반탄 혼합을 비교한다', () => {
    const rows = [3, 7, 11].flatMap(distance => Object.entries(plans).map(([name, rounds]) => {
      const enemy = { ...createEnemyState('normal'), hp: 500, maxHp: 500, distance };
      const result = resolver.resolveSequence(rounds, enemy);
      return { name, distance, damage: result.totalHpDamage, immediate: result.totalBurnDamage,
        burn: result.totalBurnApplied, remaining: result.finalState.burn, ignited: result.finalState.ignitedActions,
        recoil: result.shots.at(-1)!.breakdown.recoilAfter };
    }));
    console.table(rows);
    for (const distance of [3, 7, 11]) {
      const at = (name: string) => rows.find(row => row.name === name && row.distance === distance)!;
      expect(at('촉진 → 고열 → 발화').ignited).toBe(1);
      expect(at('고열 → 촉진 → 발화').ignited).toBe(0);
      expect(at('촉진 → 고열 → 발화').damage).toBeGreaterThan(at('고열 → 촉진 → 발화').damage);
      expect(at('소이 → 소이 → 점화').ignited).toBe(1);
      expect(at('저열 → 고열 → 점화').ignited).toBe(1);
      expect(at('소이 → 표준 → 고열').ignited).toBe(1);
      expect(at('소이 → 소이 → 표준').damage).toBe(at('표준 3발').damage);
    }
  });
  it('모든 권총·적에서 한두 소이탄의 즉시 가치와 제한된 특수 행동 제어를 비교한다', () => {
    for (const weaponId of WEAPON_ORDER) {
      for (const type of ['normal', 'brute', 'fast', 'tough', 'contaminator', 'groundshaker', 'screecher'] as const) {
        const enemy = { ...createEnemyState(type), hp: 500, maxHp: 500 };
        const one = resolver.resolveSequence(['incendiary'], enemy, { weaponId });
        const two = resolver.resolveSequence(['incendiary', 'incendiary'], enemy, { weaponId });
        expect(one.totalHpDamage).toBeGreaterThanOrEqual(3);
        expect(one.totalBurnDamage).toBeGreaterThan(0);
        expect(two.totalHpDamage).toBeGreaterThan(one.totalHpDamage);
        expect(two.totalBurnDamage).toBeGreaterThan(one.totalBurnDamage);
        expect(two.totalActionShockApplied).toBe(0);
        expect(resolver.resolveEnemyAction(one.finalState).after.hp).toBe(one.finalState.hp);
      }
    }
  });
});
