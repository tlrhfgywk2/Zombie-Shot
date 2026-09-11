import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS, AMMO_ORDER } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { CombatResolver, getActionShockThreshold, selectEnemyAction } from './CombatResolver';
import type { AmmoType } from './types';

const resolver = new CombatResolver();
const target = (armor = 0, distance = 3) => ({ ...createEnemyState('normal'), hp: 1000, maxHp: 1000, armor, distance });

describe('행동 충격과 단일 행동', () => {
  it.each([['normal', 4, 8], ['armored', 5, 9], ['fast', 3, 7], ['tough', 6, 10],
    ['contaminator', 5, 9], ['groundshaker', 6, 10], ['screecher', 5, 9]] as const)('%s 저항을 행동별로 적용한다', (type, approach, attack) => {
    const enemy = createEnemyState(type);
    expect(getActionShockThreshold(enemy, 'approach')).toBe(approach);
    expect(getActionShockThreshold(enemy, 'attack')).toBe(attack);
  });
  it('부분 충격은 이동 뒤에도 남으며 다음 턴의 충격과 합쳐진다', () => {
    const first = resolver.resolveSequence(['wadcutter'], target());
    const action = resolver.resolveEnemyAction(first.finalState);
    expect(action).toMatchObject({ interrupted: false, movement: 2, shockConsumed: 0, shockRemaining: 2 });
    const second = resolver.resolveSequence(['wadcutter'], action.after);
    const interrupted = resolver.resolveEnemyAction(second.finalState);
    expect(interrupted).toMatchObject({ selectedAction: 'approach', interrupted: true, movement: 0, shockConsumed: 4, shockRemaining: 0 });
    expect(interrupted.after.distance).toBe(action.after.distance);
  });
  it('임계치만 소비하며 충격은 추가 화력이나 노출을 만들지 않는다', () => {
    const enemy = { ...target(), actionShock: 13 };
    const shot = resolver.resolveSequence(['standard'], enemy);
    expect(shot.shots[0]?.hpDamage).toBe(4);
    const action = resolver.resolveEnemyAction(shot.finalState);
    expect(action.shockRemaining).toBe(9);
    expect(action.after.advancePerTurn).toBe(enemy.advancePerTurn);
    expect(action.after.statuses).not.toHaveProperty('exposedShots');
  });
  it('접근 도착은 즉사가 아니며 다음 행동만 치명 공격이다', () => {
    const action = resolver.resolveEnemyAction(target(0, 1));
    expect(action).toMatchObject({ selectedAction: 'approach', movement: 1, playerKilled: false });
    expect(action.after.distance).toBe(0);
    expect(selectEnemyAction(action.after)).toBe('attack');
    expect(resolver.resolveSequence(['standard', 'standard'], action.after).shots).toHaveLength(2);
    expect(resolver.resolveEnemyAction(action.after).playerKilled).toBe(true);
  });
  it('충격으로 치명 공격을 막아도 거리는 0이며 다음 공격을 다시 준비한다', () => {
    const action = resolver.resolveEnemyAction({ ...target(0, 0), actionShock: 10 });
    expect(action).toMatchObject({ selectedAction: 'attack', threshold: 8, interrupted: true, shockConsumed: 8, shockRemaining: 2, playerKilled: false });
    expect(action.after.distance).toBe(0);
    expect(resolver.resolveEnemyAction(action.after).playerKilled).toBe(true);
  });
  it.each([['contaminator', 'contaminate', 7], ['groundshaker', 'groundShock', 9], ['screecher', 'sonicPulse', 7]] as const)('%s 특수 행동은 실행/중단 모두 이동 없이 재사용 대기한다', (type, selectedAction, threshold) => {
    const enemy = createEnemyState(type);
    const action = resolver.resolveEnemyAction({ ...enemy, actionShock: threshold + 2 }, undefined, { optic: 'compactReflexSight' });
    expect(action).toMatchObject({ selectedAction, threshold, interrupted: true, movement: 0, shockRemaining: 2 });
    expect(action.after.distance).toBe(enemy.distance);
    expect(action.intentResolved).toBeUndefined();
    expect(action.playerAfter).toEqual(action.playerBefore);
    expect(action.after.intent?.countdown).toBe(enemy.intent?.cooldown);
    expect(selectEnemyAction(action.after)).toBe('approach');
    const executed = resolver.resolveEnemyAction(enemy, undefined, { optic: 'compactReflexSight' });
    expect(executed).toMatchObject({ intentResolved: selectedAction, movement: 0, interrupted: false });
    expect(executed.after.distance).toBe(enemy.distance);
    expect(executed.playerAfter).not.toEqual(executed.playerBefore);
    const attack = resolver.resolveEnemyAction({ ...enemy, distance: 0 });
    expect(attack.selectedAction).toBe('attack');
    expect(attack.intentResolved).toBeUndefined();
  });
  it('사망 뒤 충격을 추가하거나 소비하지 않고 남은 탄을 발사하지 않는다', () => {
    const sequence = resolver.resolveSequence(['flatPoint', 'overpressure'], { ...target(), hp: 1, actionShock: 9 });
    expect(sequence.shots).toHaveLength(1);
    expect(sequence.totalActionShockApplied).toBe(0);
    expect(sequence.finalState.actionShock).toBe(9);
    expect(sequence.unfiredRounds).toEqual(['overpressure']);
    const action = resolver.resolveEnemyAction(sequence.finalState);
    expect(action).toMatchObject({ shockConsumed: 0, movement: 0, playerKilled: false });
  });
  it('휴면 원소 전하의 특수 교란은 행동 충격과 별개로 처리한다', () => {
    const enemy = createEnemyState('contaminator');
    enemy.statuses.shockTurns = 1;
    enemy.actionShock = 2;
    const action = resolver.resolveEnemyAction(enemy);
    expect(action).toMatchObject({ interrupted: true, elementalInterruption: true, shockConsumed: 0, shockRemaining: 2, movement: 0 });
    expect(action.after.intent?.countdown).toBe(enemy.intent?.cooldown);
  });
});

describe('인접 탄약 효과', () => {
  it.each([
    [['overpressure', 'standard', 'standard'], [8, 2, 4]],
    [['overpressure', 'subsonic', 'match'], [8, 4, 3]],
    [['overpressure', 'overpressure', 'standard'], [8, 6, 2]],
  ] as const)('%j 화력은 바로 앞 탄에만 영향을 받는다', (rounds, expected) => {
    expect(resolver.resolveSequence(rounds, target()).shots.map(shot => shot.breakdown.directFirepower)).toEqual(expected);
  });
  it('강한 반동이 방어 파괴와 충격을 깎지 않는다', () => {
    const armor = resolver.resolveSequence(['overpressure', 'armorPiercing'], target(50));
    expect(armor.shots[1]?.breakdown.armorBroken).toBe(4);
    expect(armor.shots[1]?.breakdown.directFirepower).toBe(1);
    const shock = resolver.resolveSequence(['overpressure', 'flatPoint'], target());
    expect(shock.shots[1]?.actionShockApplied).toBe(5);
    expect(shock.shots[1]?.breakdown.directFirepower).toBe(2);
  });
  it('안정은 반동을 소비하고 두 순서 효과는 다음 탄창으로 넘어가지 않는다', () => {
    const stable = resolver.resolveSequence(['overpressure', 'subsonic', 'standard'], target());
    expect(stable.shots[1]?.breakdown.stabilized).toBe(true);
    expect(stable.shots[2]?.breakdown.heavyKickPenalty).toBe(0);
    for (const last of ['overpressure', 'flatPoint'] as const) {
      const first = resolver.resolveSequence([last], target());
      const next = resolver.resolveSequence(['wadcutter'], first.finalState);
      expect(next.shots[0]?.breakdown).toMatchObject({ directFirepower: 3, projectedShock: 2 });
    }
  });
  it.each([
    [['flatPoint', 'wadcutter'], [5, 0]],
    [['flatPoint', 'standard', 'wadcutter'], [5, 0, 2]],
    [['flatPoint', 'flatPoint', 'wadcutter'], [5, 3, 0]],
  ] as const)('%j 충격 포화는 바로 다음 탄만 확인한다', (rounds, expected) => {
    expect(resolver.resolveSequence(rounds, target()).shots.map(shot => shot.actionShockApplied)).toEqual(expected);
  });
  it.each([['hollowPoint', 1, 4], ['hollowPoint', 0, 7], ['bonded', 5, 5], ['bonded', 0, 3]] as const)('%s 장갑 %s 사격 시작 조건을 검사한다', (ammo, armor, firepower) => {
    const shot = resolver.resolveShot(ammo, 0, target(armor));
    expect(shot.breakdown.directFirepower).toBe(firepower);
    expect(shot.after.armor).toBe(0);
    if (ammo === 'bonded' && armor > 0) expect(shot.breakdown.armorBroken).toBe(5);
  });
  it('매치탄은 반동 직후 화력과 정밀 효과를 잃고 안정탄 뒤에서는 보존한다', () => {
    const single = resolver.resolveShot('match', 0, target(0, 11));
    expect(single.breakdown).toMatchObject({ directFirepower: 3, rangePenaltyPercent: 10 });
    const unstable = resolver.resolveSequence(['overpressure', 'match'], target(0, 11));
    expect(unstable.shots[1]?.breakdown).toMatchObject({ directFirepower: 1, rangePenaltyPercent: 25 });
    const stable = resolver.resolveSequence(['overpressure', 'subsonic', 'match'], target(0, 11));
    expect(stable.shots[2]?.breakdown).toMatchObject({ directFirepower: 3, rangePenaltyPercent: 10 });
  });
  it('지반 충격은 2턴 동안 반동 후속 화력만 -3으로 바꾼다', () => {
    const state = resolver.resolveEnemyAction(createEnemyState('groundshaker')).playerAfter;
    expect(state.heavyKickPenaltyTurns).toBe(2);
    const sequence = resolver.resolveSequence(['overpressure', 'flatPoint'], target(), { playerState: state });
    expect(sequence.shots[1]?.breakdown).toMatchObject({ heavyKickPenalty: 3, directFirepower: 1, projectedShock: 5 });
    const stable = resolver.resolveSequence(['overpressure', 'subsonic'], target(), { playerState: state });
    expect(stable.shots[1]?.breakdown.directFirepower).toBe(4);
    const one = resolver.resolveEnemyAction(target(), state).playerAfter;
    expect(one.heavyKickPenaltyTurns).toBe(1);
    const expired = resolver.resolveEnemyAction(target(), one).playerAfter;
    expect(expired.heavyKickPenaltyBonus).toBe(0);
    expect(expired.heavyKickPenaltyTurns).toBe(0);
  });
  it('모든 활성 탄약 쌍은 사격 거리를 바꾸지 않으며 프리뷰와 재실행이 같다', () => {
    for (const first of AMMO_ORDER) for (const next of AMMO_ORDER) {
      const rounds: AmmoType[] = [first, next, 'wadcutter'];
      const enemy = target(5, 0);
      const preview = resolver.resolveSequence(rounds, enemy);
      const actual = resolver.resolveSequence(rounds, enemy);
      expect(actual).toEqual(preview);
      expect(resolver.resolveEnemyAction(actual.finalState)).toEqual(resolver.resolveEnemyAction(preview.finalState));
      expect(actual.shots.every(shot => shot.after.distance === 0)).toBe(true);
      expect(AMMO_DEFINITIONS[first]).not.toHaveProperty('recoil');
    }
  });
});
