import { describe, expect, it } from 'vitest';
import { createEnemyState } from '../data/enemyDefinitions';
import { createPlayerCombatState } from './AttachmentLoadout';
import { CombatResolver } from './CombatResolver';

describe('CombatResolver', () => {
  const resolver = new CombatResolver();

  it('관통탄 → 확장탄은 역순보다 장갑 적에게 큰 체력 피해를 준다', () => {
    const enemy = createEnemyState('armored');
    const setupFirst = resolver.resolveSequence(['armorPiercing', 'hollowPoint'], enemy);
    const payoffFirst = resolver.resolveSequence(['hollowPoint', 'armorPiercing'], enemy);

    expect(setupFirst.totalHpDamage).toBeGreaterThan(payoffFirst.totalHpDamage);
    expect(setupFirst.finalState.armor).toBe(0);
    expect(payoffFirst.shots[0]?.breakdown.armorBlocked).toBeGreaterThan(0);
  });

  it('정확도는 100%를 넘을 수 있고 해당 비율로 피해에 기여한다', () => {
    const enemy = createEnemyState('screecher');
    const result = resolver.resolveSequence(['standard'], enemy, { loadout: { optic: 'rangeSight' } });
    const baseline = resolver.resolveSequence(['standard'], enemy);
    const shot = result.shots[0];

    expect(shot?.breakdown.accuracy).toBe(122);
    expect(shot?.breakdown.finalDamage).toBeGreaterThan(baseline.shots[0]!.breakdown.finalDamage);
  });

  it('반동은 후속 탄 정확도를 낮추고 안정 장착물은 손실을 줄인다', () => {
    const enemy = createEnemyState('normal');
    const bare = resolver.resolveSequence(['standard', 'standard', 'standard'], enemy);
    const stable = resolver.resolveSequence(['standard', 'standard', 'standard'], enemy, { loadout: { muzzle: 'returnBrake' } });

    expect(bare.shots.map((shot) => shot.breakdown.accuracy)).toEqual([100, 93, 86]);
    expect(stable.shots[2]!.breakdown.accuracy - stable.shots[0]!.breakdown.accuracy).toBe(-6);
  });

  it('거리 단계와 초음파 불이익을 피해 내역에 분리해 표시한다', () => {
    const state = createPlayerCombatState();
    state.rangePenaltySteps = 1;
    state.rangePenaltyTurns = 2;
    const normal = resolver.resolveSequence(['standard'], createEnemyState('tough'));
    const disrupted = resolver.resolveSequence(['standard'], createEnemyState('tough'), { playerState: state });

    expect(normal.shots[0]?.breakdown.rangeBand).toBe('far');
    expect(disrupted.shots[0]?.breakdown.rangeMultiplier).toBeLessThan(normal.shots[0]!.breakdown.rangeMultiplier);
  });

  it('충격 누적이 임계치에 도달하면 이동과 특수 의도를 함께 지연한다', () => {
    const sequence = resolver.resolveSequence(['stagger', 'stagger'], createEnemyState('contaminator'));
    const action = resolver.resolveEnemyAction(sequence.finalState, createPlayerCombatState(), { optic: 'rangeSight' });

    expect(sequence.finalState.statuses.staggerTurns).toBe(1);
    expect(action.staggerConsumed).toBe(true);
    expect(action.intentDelayed).toBe(true);
    expect(action.playerAfter.disabledSlots).toEqual({});
  });

  it('공유 축적 임계치가 화상·냉기·전하·침식을 서로 다른 효과로 바꾼다', () => {
    const enemy = createEnemyState('tough');
    const context = { loadout: { muzzle: 'elementCatalyst', rail: 'responseScanner' } } as const;
    const burn = resolver.resolveSequence(['incendiary'], enemy, context).finalState.statuses;
    const chill = resolver.resolveSequence(['cryo'], enemy, context).finalState.statuses;
    const shock = resolver.resolveSequence(['arc'], enemy, context).finalState.statuses;
    const corruption = resolver.resolveSequence(['bloodHex', 'bloodHex'], enemy).finalState.statuses;

    expect(burn.burnTurns).toBe(2);
    expect(chill.slowTurns).toBe(2);
    expect(shock.shockTurns).toBe(1);
    expect(corruption.corruptedShots).toBe(2);
  });

  it('침식 표식은 희귀 탄약만 강화하고 사용 횟수를 소비한다', () => {
    const enemy = createEnemyState('tough');
    enemy.statuses.corruptedShots = 2;
    const sequence = resolver.resolveSequence(['standard', 'magnum', 'incendiary'], enemy);

    expect(sequence.shots[0]?.breakdown.statusMultiplier).toBe(1);
    expect(sequence.shots[1]?.breakdown.statusMultiplier).toBe(1.25);
    expect(sequence.shots[2]?.breakdown.statusMultiplier).toBe(1.25);
    expect(sequence.finalState.statuses.corruptedShots).toBe(0);
  });

  it('회수 급탄기는 110% 이상인 첫 희귀탄만 보존한다', () => {
    const result = resolver.resolveSequence(['sanctified', 'cryo'], createEnemyState('screecher'), { loadout: { magazine: 'reserveFeed', optic: 'rangeSight' } });

    expect(result.shots[0]?.breakdown.accuracy).toBeGreaterThanOrEqual(110);
    expect(result.conservedRounds).toEqual(['sanctified']);
  });

  it('사망 후 발사하지 않은 탄환과 조건부 회수탄을 반환 목록에 남긴다', () => {
    const enemy = { ...createEnemyState('normal'), hp: 5 };
    const result = resolver.resolveSequence(['bloodHex', 'incendiary', 'standard'], enemy);

    expect(result.shots).toHaveLength(1);
    expect(result.conservedRounds).toEqual(['bloodHex']);
    expect(result.unfiredRounds).toEqual(['incendiary', 'standard']);
    expect(result.returnedRounds).toEqual(['bloodHex', 'incendiary', 'standard']);
  });

  it('화상은 발동 뒤 정확히 두 번의 적 행동에 피해를 준다', () => {
    const shot = resolver.resolveSequence(['incendiary', 'incendiary'], createEnemyState('tough'));
    const first = resolver.resolveEnemyAction(shot.finalState);
    const second = resolver.resolveEnemyAction(first.after, first.playerAfter);
    const third = resolver.resolveEnemyAction(second.after, second.playerAfter);

    expect([first.burnDamage, second.burnDamage, third.burnDamage]).toEqual([8, 8, 0]);
  });

  it.each([
    ['contaminator', 'contaminate'],
    ['groundshaker', 'groundShock'],
    ['screecher', 'sonicPulse'],
  ] as const)('%s의 예고 의도 %s를 다음 행동에 해결한다', (enemyType, intentType) => {
    const action = resolver.resolveEnemyAction(createEnemyState(enemyType), createPlayerCombatState(), { muzzle: 'quietBore', optic: 'rangeSight' });
    expect(action.intentResolved).toBe(intentType);
    expect(action.intentDetail).toBeTruthy();
  });

  it('같은 상태·탄약·장착물 조합은 완전히 결정론적이다', () => {
    const enemy = createEnemyState('groundshaker');
    const rounds = ['arc', 'stagger', 'sanctified', 'standard'] as const;
    const context = { loadout: { optic: 'rangeSight', rail: 'responseScanner' } } as const;
    expect(resolver.resolveSequence(rounds, enemy, context)).toEqual(resolver.resolveSequence(rounds, enemy, context));
  });
});
