import { describe, expect, it } from 'vitest';
import { CombatResolver, isVulnerable } from './CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import type { AmmoType, EnemyState } from './types';

const resolver = new CombatResolver();
const target = (changes: Partial<EnemyState> = {}): EnemyState =>
  ({ ...createEnemyState('normal'), hp: 100, maxHp: 100, distance: 3, ...changes });

describe('상처 임계치와 취약 창', () => {
  it.each([['wounding', 3], ['serrated', 5], ['retreatCutter', 2], ['advanceCutter', 4]] as const)('%s는 기존 수치인 상처 %i를 더한다', (ammo, wound) => {
    const shot = resolver.resolveShot(ammo, 0, target());
    expect(shot.woundApplied).toBe(wound);
    expect(shot.after.wound).toBe(wound);
    expect(isVulnerable(shot.after)).toBe(false);
  });

  it.each([2, 5])('상처 %i/6은 일반 체력 피해와 취약 조건을 강화하지 않는다', wound => {
    const enemy = target({ wound });
    expect(resolver.resolveShot('ball', 0, enemy).hpDamage).toBe(5);
    expect(resolver.resolveShot('frangible', 0, enemy).hpDamage).toBe(4);
    expect(isVulnerable(enemy)).toBe(false);
  });

  it('상처는 턴 사이에 유지되고 정확한 임계치에서 다음 탄부터 취약을 적용한다', () => {
    const first = resolver.resolveShot('wounding', 0, target()).after;
    const nextTurn = resolver.resolveEnemyAction(first).after;
    expect(nextTurn).toMatchObject({ wound: 3, vulnerableTurns: 0 });
    const result = resolver.resolveSequence(['wounding', 'ball', 'ball'], nextTurn);
    expect(result.shots.map(shot => shot.hpDamage)).toEqual([2, 8, 8]);
    expect(result.shots[0]).toMatchObject({ vulnerableTriggered: true, after: { wound: 0, vulnerableTurns: 2 } });
    expect(result.shots.every(shot => shot.after.vulnerableTurns === 2)).toBe(true);
    expect(result.roundPreviews.map(round => round.effectiveFirepower)).toEqual([2, 8, 8]);
  });

  it('상처탄 두 발 뒤 체력탄은 같은 탄창에서 취약 혜택을 받는다', () => {
    const result = resolver.resolveSequence(['wounding', 'wounding', 'ball'], target());
    expect(result.shots.map(shot => shot.hpDamage)).toEqual([2, 2, 8]);
    expect(result.shots.map(shot => shot.vulnerableTriggered)).toEqual([false, true, false]);
    expect(result.finalState).toMatchObject({ wound: 0, vulnerableTurns: 2, actionShock: 0 });
  });

  it('임계치 초과분을 보존하며 같은 입력에는 같은 결과를 낸다', () => {
    const enemy = target({ wound: 4 });
    const shot = resolver.resolveShot('serrated', 0, enemy);
    expect(shot).toMatchObject({ vulnerableTriggered: true, after: { wound: 3, vulnerableTurns: 2 } });
    expect(resolver.resolveShot('serrated', 0, enemy)).toEqual(shot);
    expect(enemy).toMatchObject({ wound: 4, vulnerableTurns: 0 });
    // 적별 임계치보다 한 번의 적용량이 큰 경우도 같은 규칙을 따른다.
    expect(resolver.resolveShot('serrated', 0, target({ woundThreshold: 4 })))
      .toMatchObject({ vulnerableTriggered: true, after: { wound: 1, vulnerableTurns: 2 } });
  });

  it('취약은 발동 턴과 다음 턴에 유지되고 탄 수와 관계없이 턴당 한 번 감소한다', () => {
    const triggered = resolver.resolveSequence(['wounding', 'wounding', 'ball'], target()).finalState;
    const nextTurn = resolver.resolveEnemyAction(triggered).after;
    expect(nextTurn.vulnerableTurns).toBe(1);
    const volley = resolver.resolveSequence(['ball', 'ball', 'ball', 'ball'], nextTurn);
    expect(volley.shots.map(shot => shot.hpDamage)).toEqual([8, 8, 8, 8]);
    expect(volley.finalState.vulnerableTurns).toBe(1);
    const expired = resolver.resolveEnemyAction(volley.finalState).after;
    expect(expired.vulnerableTurns).toBe(0);
    expect(resolver.resolveShot('ball', 0, expired).hpDamage).toBe(5);
  });

  it('마지막 탄에서 발동해도 다음 턴을 활용할 수 있고 충격 중단 시에도 지속 시간은 감소한다', () => {
    const state = resolver.resolveSequence(['wounding', 'wounding'], target({ actionShock: 4 })).finalState;
    const action = resolver.resolveEnemyAction(state);
    expect(action.interrupted).toBe(true);
    expect(action.after.vulnerableTurns).toBe(1);
    expect(resolver.resolveShot('ball', 0, action.after).hpDamage).toBe(8);
  });

  it('취약 중 새 임계치 도달은 2턴으로 갱신하고 지속 시간을 합산하지 않는다', () => {
    const shot = resolver.resolveShot('wounding', 0, target({ wound: 5, vulnerableTurns: 1 }));
    expect(shot).toMatchObject({ vulnerableTriggered: true, after: { wound: 2, vulnerableTurns: 2 } });
    const notTriggered = resolver.resolveShot('ball', 0, target({ wound: 5, vulnerableTurns: 1 }));
    expect(notTriggered.after.vulnerableTurns).toBe(1);
  });

  it.each(['wounding', 'serrated', 'advanceCutter', 'retreatCutter', 'flatNose', 'heavy'] as AmmoType[])('취약은 %s의 체력 피해만 증폭하고 상처·충격·이동·반동은 보존한다', ammo => {
    const normal = resolver.resolveShot(ammo, 0, target());
    const vulnerable = resolver.resolveShot(ammo, 0, target({ vulnerableTurns: 1 }));
    expect(vulnerable.hpDamage).toBeGreaterThan(normal.hpDamage);
    expect(vulnerable.woundApplied).toBe(normal.woundApplied);
    expect(vulnerable.actionShockApplied).toBe(normal.actionShockApplied);
    expect(vulnerable.movement).toBe(normal.movement);
    expect(vulnerable.shotDistance).toBe(normal.shotDistance);
    expect(vulnerable.breakdown.recoilAfter).toBe(normal.breakdown.recoilAfter);
  });

  it('상처로 적 행동을 막지 않고 충격으로 취약을 만들지 않는다', () => {
    const wounded = resolver.resolveSequence(['wounding', 'wounding'], target()).finalState;
    expect(resolver.resolveEnemyAction(wounded)).toMatchObject({ interrupted: false, movement: 2 });
    const shocked = resolver.resolveShot('flatNose', 0, target()).after;
    expect(shocked).toMatchObject({ wound: 0, vulnerableTurns: 0 });
    expect(resolver.resolveEnemyAction(shocked).interrupted).toBe(true);
  });

  it('열상탄은 남은 상처와 무관하게 취약 효과를 두 배로 적용한다', () => {
    expect(resolver.resolveShot('laceration', 0, target({ wound: 3 })).hpDamage).toBe(5);
    expect(resolver.resolveShot('laceration', 0, target({ wound: 3, vulnerableTurns: 1 })).hpDamage).toBe(10);
    expect(resolver.resolveShot('laceration', 0, target({ vulnerableTurns: 1 })).hpDamage).toBe(10);
    const triggered = resolver.resolveShot('serrated', 0, target({ wound: 4 })).after;
    expect(triggered.wound).toBe(3);
    expect(resolver.resolveShot('laceration', 0, triggered).breakdown.vulnerableDamageBonus).toBe(5);
    expect(resolver.resolveShot('laceration', 0, triggered).breakdown.conditionalBonus).toBe(0);
    expect(resolver.resolveShot('ball', 0, target({ wound: 3 })).breakdown.conditionalBonus).toBe(0);
  });

  it('레이저는 임계치 미만 상처에 취약 보너스를 주지 않는다', () => {
    const context = { loadout: { rail: 'laserSight' as const } };
    expect(resolver.resolveShot('frangible', 0, target({ wound: 5 }), context).hpDamage).toBe(4);
    expect(resolver.resolveShot('frangible', 0, target({ vulnerableTurns: 1 }), context).hpDamage).toBe(12);
    expect(resolver.resolveShot('ball', 0, target({ vulnerableTurns: 1 }), context).hpDamage).toBe(8);
  });

  it('처치한 적에는 취약을 새로 부여하지 않고 새 적은 초기 상태로 시작한다', () => {
    expect(resolver.resolveShot('wounding', 0, target({ hp: 1, wound: 5 })).vulnerableTriggered).toBe(false);
    expect(createEnemyState('normal')).toMatchObject({ wound: 0, woundThreshold: 6, vulnerableTurns: 0 });
  });
});
