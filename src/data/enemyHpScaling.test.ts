import { describe, expect, it } from 'vitest';
import { createEnemyState, createProgressionEnemyState, ENEMY_DEFINITIONS } from './enemyDefinitions';
import { getEnemyHp, interpolateEnemyHp, ENEMY_HP_CURVES } from './enemyHpScaling';
import { Zombie } from '../entities/Zombie';
import { CombatResolver } from '../combat/CombatResolver';
import type { EnemyType } from '../combat/types';

describe('진행 HP와 즉사 전투의 경계', () => {
  it('두 게임의 깊이와 적별 표를 실제 스폰에 적용하며 체력 이외 능력을 보존한다', () => {
    for (const type of Object.keys(ENEMY_DEFINITIONS) as EnemyType[]) for (const profile of ['exploration', 'v7'] as const) for (const depth of [1, 3, 5, 6, 8]) {
      const base = createEnemyState(type), scaled = createProgressionEnemyState(type, depth, profile);
      expect(scaled.hp).toBe(getEnemyHp(type, depth, profile)); expect(scaled.maxHp).toBe(scaled.hp);
      expect({ ...scaled, hp: base.hp, maxHp: base.maxHp }).toEqual(base);
    }
    expect(new Zombie('groundshaker', false, 8).hp).toBe(78);
    expect(createProgressionEnemyState('groundshaker', 8, 'v7', true).hp).toBe(57);
    expect(new Zombie('normal', true, 8).hp).toBe(10000);
  });
  it('정수 선형 보간과 끝 구간 고정을 사용하며 난수나 무제한 HP 성장을 넣지 않는다', () => {
    expect(getEnemyHp('normal', 2, 'exploration')).toBe(25);
    expect(getEnemyHp('brute', 5, 'exploration')).toBe(64);
    expect(getEnemyHp('groundshaker', 99, 'exploration')).toBe(78);
    expect(() => getEnemyHp('normal', NaN, 'exploration')).toThrow();
    expect(() => getEnemyHp('normal', 0, 'exploration')).toThrow();
    expect(interpolateEnemyHp('normal', 1, ENEMY_HP_CURVES.v7)).toBe(22);
  });
  it('같은 적 행동에서 HP2 차이로 한 턴을 더 살아 즉사가 발생하는 실제 한계를 보존한다', () => {
    const resolver = new CombatResolver(() => .5);
    const battle = (hp: number) => {
      let enemy = { ...createEnemyState('groundshaker'), hp, maxHp: hp };
      for (let turn = 1; turn <= 8; turn++) {
        const shot = resolver.resolveSequence(['ball', 'ball', 'ball', 'ball'], enemy); enemy = shot.finalState;
        if (shot.killed) return true;
        const action = resolver.resolveEnemyAction(enemy); enemy = action.after;
        if (action.playerKilled) return false;
      }
      return false;
    };
    expect(battle(54)).toBe(true); expect(battle(78)).toBe(false);
  });
});
