import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS, COMBAT_BALANCE } from '../data/ammoDefinitions';
import { ATTACHMENT_DEFINITIONS } from '../data/attachmentDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { createPlayerCombatState } from './AttachmentLoadout';
import { calculateFinalFirepower, calculateRecoilMovement, CombatResolver, roundPositiveFirepower } from './CombatResolver';

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

  it('반동은 같은 거리의 후속 탄 직접 피해를 낮추지 않는다', () => {
    const enemy = { ...createEnemyState('tough'), hp: 100, maxHp: 100, distance: 3 };
    const shots = resolver.resolveSequence(['standard', 'standard', 'standard', 'standard'], enemy).shots;

    expect(shots.map(shot => shot.breakdown.cumulativeRecoil)).toEqual([0, 1, 2, 3]);
    expect(shots.map(shot => shot.breakdown.finalFirepower)).toEqual([4, 4, 4, 4]);
  });

  it('누적 반동과 재조준 접근은 문턱 없이 정비례한다', () => {
    expect([1, 2, 3].map(recoil => calculateRecoilMovement(2, recoil))).toEqual([0.03, 0.06, 0.09]);
    const sequence = resolver.resolveSequence(['standard', 'standard', 'standard', 'standard'], { ...createEnemyState('normal'), hp: 100, maxHp: 100 });
    expect(sequence.shots.map(shot => shot.breakdown.recoilMovement)).toEqual([0.03, 0.06, 0.09, 0]);
    expect(sequence.totalRecoilMovement).toBe(0.18);
  });

  it('반동은 탄창 안에서 누적되고 새 발사 시퀀스에서는 0으로 초기화된다', () => {
    const enemy = { ...createEnemyState('normal'), hp: 100, maxHp: 100, distance: 3 };
    const first = resolver.resolveSequence(['overpressure', 'standard'], enemy);
    const nextMagazine = resolver.resolveSequence(['standard'], first.finalState);

    expect(first.shots.map(shot => shot.breakdown.cumulativeRecoil)).toEqual([0, 2]);
    expect(nextMagazine.shots[0]?.breakdown.cumulativeRecoil).toBe(0);
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

    expect(bare.shots.map(shot => shot.breakdown.rangePenaltyPercent)).toEqual([25, 15]);
    expect(bare.effectiveRangePenaltyPercent).toBe(20.7);
    expect(tuned.shots.map(shot => shot.breakdown.rangePenaltyPercent)).toEqual([15, 5]);
    expect(tuned.effectiveRangePenaltyPercent).toBe(10.7);
  });

  it('일반 이동과 반동 접근을 각각 한 번만 적용한다', () => {
    const enemy = { ...createEnemyState('normal'), hp: 100, maxHp: 100 };
    const sequence = resolver.resolveSequence(['standard', 'standard', 'standard', 'standard'], enemy);
    const action = resolver.resolveEnemyAction(sequence.finalState);

    expect(sequence.finalState.distance).toBe(7.82);
    expect(action.movement).toBe(2);
    expect(action.after.distance).toBe(5.82);
    expect(enemy.distance - action.after.distance).toBeCloseTo(2 + sequence.totalRecoilMovement, 5);
  });

  it('재조준 중 돌파하면 후속 탄을 멈추고 별도 적 이동을 요구하지 않는다', () => {
    const enemy = { ...createEnemyState('normal'), hp: 100, maxHp: 100, distance: 0.02 };
    const sequence = resolver.resolveSequence(['standard', 'standard'], enemy);

    expect(sequence.shots).toHaveLength(1);
    expect(sequence.breached).toBe(true);
    expect(sequence.finalState.distance).toBe(0);
    expect(sequence.unfiredRounds).toEqual(['standard']);
  });

  it('보통 4발 표준탄은 일반 감염체의 기준 4행동 접근을 3행동으로 줄이지 않는다', () => {
    const turnsToContact = (withRecoil: boolean): number => {
      let enemy = { ...createEnemyState('normal'), hp: 1000, maxHp: 1000 };
      let turns = 0;
      while (enemy.distance > 0 && turns < 10) {
        if (withRecoil) enemy = resolver.resolveSequence(['standard', 'standard', 'standard', 'standard'], enemy).finalState;
        if (enemy.distance > 0) enemy = resolver.resolveEnemyAction(enemy).after;
        turns += 1;
      }
      return turns;
    };
    expect(turnsToContact(false)).toBe(4);
    expect(turnsToContact(true)).toBe(4);
  });

  it('충격 누적이 임계치에 도달하면 이동과 특수 의도를 함께 지연한다', () => {
    const sequence = resolver.resolveSequence(['stagger', 'stagger'], createEnemyState('contaminator'));
    const action = resolver.resolveEnemyAction(sequence.finalState, createPlayerCombatState(), { optic: 'compactReflexSight' });

    expect(sequence.finalState.statuses.staggerTurns).toBe(1);
    expect(action.staggerConsumed).toBe(true);
    expect(action.intentDelayed).toBe(true);
    expect(action.movement).toBe(0.84);
    expect(action.playerAfter.disabledSlots).toEqual({});
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

  it('지반 충격은 2턴 동안 반동만 늘리고 무반동 탄은 그대로 둔다', () => {
    const applied = resolver.resolveEnemyAction(createEnemyState('groundshaker')).playerAfter;
    expect(applied.recoilPenaltyPercent).toBe(50);
    expect(applied.recoilPenaltyTurns).toBe(2);
    expect(resolver.resolveShot('standard', 0, createEnemyState('normal'), { playerState: applied }).breakdown.recoilGenerated).toBe(1.5);
    expect(resolver.resolveShot('subsonic', 0, createEnemyState('normal'), { playerState: applied }).breakdown.recoilGenerated).toBe(0);
  });

  it('같은 상태·탄약·장착물 조합은 완전히 결정론적이다', () => {
    const enemy = createEnemyState('groundshaker');
    const rounds = ['arc', 'stagger', 'sanctified', 'standard'] as const;
    const context = { loadout: { optic: 'compactReflexSight', rail: 'laserLightModule' } } as const;
    expect(resolver.resolveSequence(rounds, enemy, context)).toEqual(resolver.resolveSequence(rounds, enemy, context));
    expect(COMBAT_BALANCE.recoilMovementCoefficient).toBe(0.015);
  });
});
