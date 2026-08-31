import { describe, expect, it } from 'vitest';
import { COMBAT_BALANCE } from '../data/ammoDefinitions';
import { Zombie } from '../entities/Zombie';
import { CombatResolver } from './CombatResolver';

describe('CombatResolver', () => {
  const resolver = new CombatResolver();

  it('탄창 순서대로 발사를 해결한다', () => {
    const results = resolver.resolveSequence(['incendiary', 'standard', 'tracer'], 8);
    expect(results.map((result) => result.ammoType)).toEqual(['incendiary', 'standard', 'tracer']);
    expect(results.map((result) => result.index)).toEqual([0, 1, 2]);
  });

  it('예광탄은 이전 탄환이 아니라 다음 탄환을 증폭한다', () => {
    const tracerFirst = resolver.resolveSequence(['tracer', 'fragmenting'], 8);
    const tracerLast = resolver.resolveSequence(['fragmenting', 'tracer'], 8);
    expect(tracerFirst[0]?.bonusDamage).toBe(0);
    expect(tracerFirst[1]?.damage).toBeGreaterThan(tracerLast[0]?.damage ?? 0);
    expect(tracerLast[1]?.bonusDamage).toBe(0);
  });

  it('파편탄은 가까운 거리에서 더 강하다', () => {
    const close = resolver.resolveSequence(['fragmenting'], 3)[0];
    const far = resolver.resolveSequence(['fragmenting'], 8)[0];
    expect(close?.damage).toBeGreaterThan(far?.damage ?? 0);
  });

  it('소이탄은 지연 화상을 부여하고 적 행동 때 피해를 준다', () => {
    const result = resolver.resolveSequence(['incendiary'], 8)[0];
    const zombie = new Zombie();
    zombie.applyBurn(result?.burnApplied ?? 0);
    const before = zombie.hp;
    expect(zombie.resolveBurn()).toBe(COMBAT_BALANCE.burnDamagePerStack * COMBAT_BALANCE.burnTicks);
    expect(zombie.hp).toBeLessThan(before);
  });
});
