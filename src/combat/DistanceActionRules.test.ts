import { describe, expect, it } from 'vitest';
import { CombatResolver, getEffectiveRangeBand, getRangeBand, isEnemyActionInRange, previewEnemyAction } from './CombatResolver';
import { createEnemyState, ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import { WEAPON_DEFINITIONS, WEAPON_ORDER } from '../data/weaponDefinitions';
import type { EnemyState } from './types';

const resolver = new CombatResolver(() => 0);
const target = (extra: Partial<EnemyState> = {}): EnemyState => ({ ...createEnemyState('normal'), hp: 500, ...extra });

describe('1·4·8m 거리 경계', () => {
  it.each([[0, 'melee'], [0.999, 'melee'], [1, 'near'], [3.999, 'near'], [4, 'mid'], [7.999, 'mid'], [8, 'far'], [12, 'far']] as const)('%fm는 %s 구간이다', (distance, band) => {
    expect(getRangeBand(distance)).toBe(band);
    expect(isEnemyActionInRange(target({ distance }), 'attack')).toBe(distance < 1);
    expect(isEnemyActionInRange(target({ distance }), 'sonicPulse')).toBe(distance >= 1);
  });
  it.each(WEAPON_ORDER)('%s는 근접 기본 피해를 보존하고 4m·8m부터 다음 감쇠를 적용한다', weaponId => {
    for (const [distance, band] of [[0.5, 'melee'], [1, 'near'], [4, 'mid'], [8, 'far']] as const) {
      const shot = resolver.resolveShot('ball', 0, target({ distance }), { weaponId });
      expect(shot.breakdown.rangeBand).toBe(band);
      expect(shot.breakdown.rangePenaltyPercent).toBe(WEAPON_DEFINITIONS[weaponId].rangePenaltyPercentages[band]);
    }
  });
  it('거리 약화도 네 구간을 순서대로 이동하며 근접의 기존 근거리 장착물 효과를 보존한다', () => {
    expect(getEffectiveRangeBand('melee', 1)).toBe('near');
    expect(getEffectiveRangeBand('melee', 2)).toBe('mid');
    expect(getEffectiveRangeBand('far', 1)).toBe('far');
    const near = resolver.resolveShot('flatNose', 0, target({ distance: 1 }), { loadout: { rail: 'tacticalLight' } });
    const melee = resolver.resolveShot('flatNose', 0, target({ distance: 0.5 }), { loadout: { rail: 'tacticalLight' } });
    const bare = resolver.resolveShot('flatNose', 0, target({ distance: 0.5 }));
    expect(melee.actionShockApplied).toBe(near.actionShockApplied);
    expect(melee.actionShockApplied).toBe(bare.actionShockApplied + 2);
  });
});

describe('치명 공격 중단·회피 후 거리 기준 예고', () => {
  it.each([0, 0.5, 0.999])('%fm의 치명 공격을 충격으로 막으면 다음에도 치명 공격이다', distance => {
    const result = resolver.resolveEnemyAction(target({ distance, actionShock: 8, trainingActions: ['sonicPulse'] }));
    expect(result).toMatchObject({ interrupted: true, movement: 0, playerKilled: false });
    expect(previewEnemyAction(result.after).selectedAction).toBe('attack');
  });
  it.each([0.5, 0.9])('%fm 치명 공격에서 후퇴하면 이번에는 접근만 하고 다음 근접 공격을 예고한다', distance => {
    const volley = resolver.resolveSequence(['retreat'], target({ distance }));
    const result = resolver.resolveEnemyAction(volley.finalState);
    expect(result).toMatchObject({ executedAction: 'approach', resolution: 'retreat-delayed', movement: 2, playerKilled: false });
    expect(result.after.distance).toBeCloseTo(distance);
    expect(previewEnemyAction(result.after).selectedAction).toBe('attack');
  });
  it('멀리 후퇴하면 원거리 능력 대신 계속 접근하고 충격 중단 뒤에도 접근 예고를 보존한다', () => {
    const volley = resolver.resolveSequence(['retreat', 'retreat', 'hammer', 'hammer'], target({ distance: 0.5, trainingActions: ['sonicPulse'] }));
    let result = resolver.resolveEnemyAction(volley.finalState);
    expect(result).toMatchObject({ interrupted: true, movement: 0, after: { distance: 4.5, telegraphedAction: 'approach' } });
    result = resolver.resolveEnemyAction({ ...result.after, actionShock: 0 });
    expect(result.after).toMatchObject({ distance: 2.5, telegraphedAction: 'approach' });
    result = resolver.resolveEnemyAction(result.after);
    expect(result).toMatchObject({ playerKilled: false, after: { distance: 0.5, telegraphedAction: 'attack' } });
  });
});

describe('다음 턴 근접 공격을 준비하는 접근 우선권', () => {
  it.each(Object.keys(ENEMY_DEFINITIONS) as (keyof typeof ENEMY_DEFINITIONS)[])('%s는 한 번 접근해 1m 미만이 되면 원거리 예고보다 접근한다', type => {
    const enemy = createEnemyState(type);
    const distance = enemy.advancePerTurn + 0.5;
    const state = { ...enemy, distance, trainingActions: ['sonicPulse'] as const, delayedAction: 'sonicPulse' as const };
    expect(previewEnemyAction(state).selectedAction).toBe('approach');
    const result = resolver.resolveEnemyAction(state);
    expect(result).toMatchObject({ executedAction: 'approach', playerKilled: false });
    expect(result.after.distance).toBeCloseTo(0.5);
    expect(result.after.delayedAction).toBeUndefined();
    expect(previewEnemyAction(result.after).selectedAction).toBe('attack');
  });
  it.each([3, 3.001, 4])('%fm에서 접근 후 1m 이상이면 가능한 원거리 행동을 강제로 바꾸지 않는다', distance => {
    expect(previewEnemyAction(target({ distance, trainingActions: ['sonicPulse'] })).selectedAction).toBe('sonicPulse');
  });
  it('접근 후 정확히 1m인 소수 거리도 부동소수점 오차로 근접 처리하지 않는다', () => {
    expect(previewEnemyAction(target({ distance: 3.8, advancePerTurn: 2.8, trainingActions: ['sonicPulse'] })).selectedAction).toBe('sonicPulse');
    expect(previewEnemyAction(target({ distance: 3.799, advancePerTurn: 2.8, trainingActions: ['sonicPulse'] })).selectedAction).toBe('approach');
  });
  it('사격 중 전진으로 접근 가능한 거리에 들어가면 원거리 행동보다 접근하고 즉시 치명 공격을 추가하지 않는다', () => {
    const volley = resolver.resolveSequence(['advance'], target({ distance: 4.5, trainingActions: ['sonicPulse'] }));
    expect(previewEnemyAction(volley.finalState).selectedAction).toBe('approach');
    const result = resolver.resolveEnemyAction(volley.finalState);
    expect(result).toMatchObject({ executedAction: 'approach', playerKilled: false, after: { distance: 0.5, telegraphedAction: 'attack' } });
  });
});
