import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS } from '../data/ammoDefinitions';
import { ATTACHMENT_DEFINITIONS } from '../data/attachmentDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { createPlayerCombatState } from './AttachmentLoadout';
import { calculateFinalFirepower, CombatResolver, roundPositiveFirepower } from './CombatResolver';

describe('CombatResolver', () => {
  const resolver = new CombatResolver();

  it('직접 화력을 합산한 뒤 거리 퍼센트를 적용하고 최근접 정수로 만든다', () => {
    expect(calculateFinalFirepower({
      weaponFirepower: 2, ammoFirepower: 5, attachmentFirepower: 0,
      statusFirepowerBonus: 0, specialFirepowerBonus: 0, rangePenaltyPercent: 10,
    })).toBe(6);
  });

  it.each([
    [4.1, 4], [4.2, 4], [4.3, 4], [4.4, 4], [4.5, 5],
    [4.6, 5], [4.7, 5], [4.8, 5], [4.9, 5],
  ])('소수 경계 %s를 전역 .5 올림 규칙으로 %s로 만든다', (input, expected) => {
    expect(roundPositiveFirepower(input)).toBe(expected);
  });

  it('철갑탄 → 확장탄은 역순보다 장갑 적에게 큰 체력 피해를 준다', () => {
    const enemy = createEnemyState('armored');
    const setupFirst = resolver.resolveSequence(['armorPiercing', 'hollowPoint'], enemy);
    const payoffFirst = resolver.resolveSequence(['hollowPoint', 'armorPiercing'], enemy);

    expect(setupFirst.totalHpDamage).toBeGreaterThan(payoffFirst.totalHpDamage);
    expect(setupFirst.finalState.armor).toBeGreaterThanOrEqual(0);
    expect(payoffFirst.shots[0]?.breakdown.armorBlocked).toBeGreaterThan(0);
  });

  it('폐기된 명중 보정 데이터가 탄약·무기·장착물·피해 내역에 없다', () => {
    for (const ammo of Object.values(AMMO_DEFINITIONS)) expect(ammo).not.toHaveProperty('accuracyModifier');
    for (const attachment of Object.values(ATTACHMENT_DEFINITIONS)) {
      expect(attachment.modifiers.some(modifier => modifier.kind === ('accuracy' as never))).toBe(false);
    }
    const shot = resolver.resolveShot('standard', 0, createEnemyState('normal'));
    expect(shot.breakdown).not.toHaveProperty('accuracyModifier');
    expect(shot.description).not.toContain('정확도');
  });

  it('거리 단계와 초음파 불이익을 피해 내역에 분리해 표시한다', () => {
    const state = createPlayerCombatState();
    state.rangePenaltySteps = 1;
    state.rangePenaltyTurns = 2;
    const enemy = { ...createEnemyState('normal'), distance: 7 };
    const normal = resolver.resolveSequence(['standard'], enemy);
    const disrupted = resolver.resolveSequence(['standard'], enemy, { playerState: state });

    expect(normal.shots[0]?.breakdown.rangeBand).toBe('mid');
    expect(normal.shots[0]?.breakdown.rangePenaltyPercent).toBe(10);
    expect(normal.effectiveRangePenaltyPercent).toBe(10);
    expect(disrupted.shots[0]?.breakdown.effectiveRangeBand).toBe('far');
    expect(disrupted.shots[0]?.breakdown.rangePenaltyPercent).toBe(25);
    expect(disrupted.effectiveRangePenaltyPercent).toBe(25);
  });

  it('혼합 탄약과 부착물의 최종 거리 손실을 직접 화력 가중 퍼센트로 집계한다', () => {
    const enemy = { ...createEnemyState('tough'), hp: 100, maxHp: 100, distance: 11 };
    const rounds = ['standard', 'match'] as const;
    const bare = resolver.resolveSequence(rounds, enemy);
    const tuned = resolver.resolveSequence(rounds, enemy, { loadout: { optic: 'compactReflexSight' } });

    expect(bare.shots.map(shot => shot.breakdown.rangePenaltyPercent)).toEqual([25, 10]);
    expect(bare.effectiveRangePenaltyPercent).toBe(18.6);
    expect(tuned.shots.map(shot => shot.breakdown.rangePenaltyPercent)).toEqual([15, 0]);
    expect(tuned.effectiveRangePenaltyPercent).toBe(8.6);
  });

  it('보통 4발 표준탄은 일반 감염체의 기준 4행동 접근을 3행동으로 줄이지 않는다', () => {
    const turnsToContact = (withShots: boolean): number => {
      let enemy = { ...createEnemyState('normal'), hp: 1000, maxHp: 1000 };
      let turns = 0;
      while (enemy.distance > 0 && turns < 10) {
        if (withShots) enemy = resolver.resolveSequence(['standard', 'standard', 'standard', 'standard'], enemy).finalState;
        if (enemy.distance > 0) enemy = resolver.resolveEnemyAction(enemy).after;
        turns += 1;
      }
      return turns;
    };
    expect(turnsToContact(false)).toBe(4);
    expect(turnsToContact(true)).toBe(4);
  });

  it('공유 축적 임계치가 화상·냉기·전하·침식을 서로 다른 효과로 바꾼다', () => {
    const enemy = createEnemyState('tough');
    expect(resolver.resolveSequence(['incendiary', 'incendiary'], enemy).finalState.statuses.burnTurns).toBe(2);
    expect(resolver.resolveSequence(['cryo', 'cryo'], enemy).finalState.statuses.slowTurns).toBe(2);
    expect(resolver.resolveSequence(['arc', 'arc'], enemy).finalState.statuses.shockTurns).toBe(1);
    expect(resolver.resolveSequence(['bloodHex', 'bloodHex'], enemy).finalState.statuses.corruptedShots).toBe(2);
  });

  it('거리 손실은 방어 파괴·화상 같은 독립 특수 효과 수치를 바꾸지 않는다', () => {
    const nearArmor = resolver.resolveShot('armorPiercing', 0, { ...createEnemyState('groundshaker'), distance: 3 });
    const farArmor = resolver.resolveShot('armorPiercing', 0, { ...createEnemyState('groundshaker'), distance: 11 });
    const farBurn = resolver.resolveSequence(['incendiary', 'incendiary'], { ...createEnemyState('tough'), distance: 11 });

    expect([nearArmor.breakdown.armorBroken, farArmor.breakdown.armorBroken]).toEqual([4, 4]);
    expect(farBurn.finalState.statuses.burnTurns).toBe(2);
    const first = resolver.resolveEnemyAction(farBurn.finalState);
    const second = resolver.resolveEnemyAction(first.after, first.playerAfter);
    expect([first.burnDamage, second.burnDamage]).toEqual([3, 3]);
  });

  it('침식 표식은 희귀 탄약만 강화하고 사용 횟수를 소비한다', () => {
    const enemy = createEnemyState('tough');
    enemy.statuses.corruptedShots = 2;
    const sequence = resolver.resolveSequence(['standard', 'magnum', 'incendiary'], enemy);

    expect(sequence.shots[0]?.breakdown.statusFirepowerBonus).toBe(0);
    expect(sequence.shots[1]?.breakdown.statusFirepowerBonus).toBe(2);
    expect(sequence.shots[2]?.breakdown.statusFirepowerBonus).toBe(2);
    expect(sequence.finalState.statuses.corruptedShots).toBe(0);
  });

  it('사망 후 발사하지 않은 탄환과 조건부 회수탄을 반환 목록에 남긴다', () => {
    const enemy = { ...createEnemyState('normal'), hp: 2 };
    const result = resolver.resolveSequence(['bloodHex', 'incendiary', 'standard'], enemy);

    expect(result.shots).toHaveLength(1);
    expect(result.conservedRounds).toEqual(['bloodHex']);
    expect(result.unfiredRounds).toEqual(['incendiary', 'standard']);
    expect(result.returnedRounds).toEqual(['bloodHex', 'incendiary', 'standard']);
  });

  it('총 피해 프리뷰는 현재 체력과 돌파에 제한되지 않고 탄창 전체를 계산한다', () => {
    const enemy = { ...createEnemyState('normal'), hp: 1, armor: 0, distance: 0.01 };
    const rounds = ['standard', 'standard', 'standard', 'standard'] as const;

    expect(resolver.resolveSequence(rounds, enemy).totalHpDamage).toBe(1);
    expect(resolver.resolveSequence(rounds, enemy).shots).toHaveLength(1);
    expect(resolver.resolveFullMagazineDamage(rounds, enemy)).toBe(16);
  });

});
