import { describe, expect, it } from 'vitest';
import { COMBAT_BALANCE } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { CombatResolver } from './CombatResolver';

describe('CombatResolver', () => {
  const resolver = new CombatResolver();

  it('철갑탄 → 확장탄은 역순보다 장갑 적에게 큰 체력 피해를 준다', () => {
    const enemy = createEnemyState('armored');
    const setupFirst = resolver.resolveSequence(['armorPiercing', 'hollowPoint'], enemy);
    const payoffFirst = resolver.resolveSequence(['hollowPoint', 'armorPiercing'], enemy);

    expect(setupFirst.totalHpDamage).toBe(43);
    expect(payoffFirst.totalHpDamage).toBe(13);
    expect(setupFirst.finalState.hp).toBeLessThan(payoffFirst.finalState.hp);
  });

  it('충격탄이 만든 노출이 바로 다음 매그넘탄에 전파된다', () => {
    const enemy = createEnemyState('normal');
    const setupFirst = resolver.resolveSequence(['stagger', 'magnum'], enemy);
    const payoffFirst = resolver.resolveSequence(['magnum', 'stagger'], enemy);

    expect(setupFirst.shots[1]?.vulnerabilityMultiplier).toBe(COMBAT_BALANCE.exposedDamageMultiplier);
    expect(setupFirst.totalHpDamage).toBe(52);
    expect(payoffFirst.totalHpDamage).toBe(40);
  });

  it('사망한 표적에는 후속 탄환과 상태 효과를 적용하지 않는다', () => {
    const enemy = { ...createEnemyState('normal'), hp: 10 };
    const result = resolver.resolveSequence(['magnum', 'incendiary', 'stagger'], enemy);

    expect(result.shots).toHaveLength(1);
    expect(result.finalState.hp).toBe(0);
    expect(result.finalState.statuses).toEqual({ burnTurns: 0, staggerTurns: 0, exposedShots: 0 });
  });

  it('프리뷰 결과와 같은 탄환별 상태를 실제 적용해도 최종 결과가 일치한다', () => {
    const enemy = createEnemyState('tough');
    const preview = resolver.resolveSequence(['armorPiercing', 'stagger', 'hollowPoint', 'incendiary'], enemy);
    let actual = enemy;
    for (const shot of preview.shots) actual = resolver.resolveShot(shot.ammoType, shot.index, actual).after;

    expect(actual).toEqual(preview.finalState);
  });

  it('화상은 정확히 두 번의 적 행동에 피해를 주고 종료된다', () => {
    const shot = resolver.resolveSequence(['incendiary'], createEnemyState('normal'));
    const firstAction = resolver.resolveEnemyAction(shot.finalState);
    const secondAction = resolver.resolveEnemyAction(firstAction.after);
    const thirdAction = resolver.resolveEnemyAction(secondAction.after);

    expect(firstAction.burnDamage).toBe(COMBAT_BALANCE.burnDamagePerTurn);
    expect(secondAction.burnDamage).toBe(COMBAT_BALANCE.burnDamagePerTurn);
    expect(thirdAction.burnDamage).toBe(0);
    expect(secondAction.after.statuses.burnTurns).toBe(0);
  });

  it('이동 억제는 다음 적 행동 한 번에만 적용된다', () => {
    const shot = resolver.resolveSequence(['stagger'], createEnemyState('fast'));
    const firstAction = resolver.resolveEnemyAction(shot.finalState);
    const secondAction = resolver.resolveEnemyAction(firstAction.after);

    expect(firstAction.movement).toBe(1.05);
    expect(firstAction.staggerConsumed).toBe(true);
    expect(secondAction.movement).toBe(3);
    expect(secondAction.staggerConsumed).toBe(false);
  });

  it('표준탄은 숨은 조건 없이 항상 정의된 기본 피해를 준다', () => {
    const single = resolver.resolveSequence(['standard'], createEnemyState('normal'));
    const repeated = resolver.resolveSequence(['standard', 'standard'], createEnemyState('normal'));

    expect(single.shots[0]?.hpDamage).toBe(22);
    expect(repeated.shots.map((shot) => shot.hpDamage)).toEqual([22, 22]);
    expect(repeated.finalState.statuses).toEqual({ burnTurns: 0, staggerTurns: 0, exposedShots: 0 });
  });

  it('같은 적 상태와 탄약 순서는 완전히 결정론적이다', () => {
    const enemy = createEnemyState('armored');
    const rounds = ['stagger', 'armorPiercing', 'hollowPoint', 'standard'] as const;
    expect(resolver.resolveSequence(rounds, enemy)).toEqual(resolver.resolveSequence(rounds, enemy));
  });
});
