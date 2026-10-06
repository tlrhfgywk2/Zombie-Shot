import { describe, expect, it } from 'vitest';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState, ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import type { AmmoType, EnemyType } from '../combat/types';

const resolver = new CombatResolver();
const plans: { name: string; rounds: AmmoType[]; capacity: number }[] = [
  { name: '표준', rounds: ['ball', 'ball', 'ball', 'ball'], capacity: 4 },
  { name: '고압 연사', rounds: ['plusP', 'plusP', 'plusP', 'plusP'], capacity: 4 },
  { name: '단일 계열 배열', rounds: ['opening', 'focus', 'core', 'finisher'], capacity: 4 },
  { name: '집중 연사', rounds: ['focus', 'focus', 'focus', 'focus'], capacity: 4 },
  { name: '다섯 계열 혼합', rounds: ['wounding', 'incendiary', 'explosive', 'flatNose', 'mosaic'], capacity: 6 },
  { name: '교차 계열', rounds: ['wounding', 'alternator', 'explosive', 'alternator'], capacity: 4 },
  { name: '초탄 연계 종결', rounds: ['opening', 'relay', 'core', 'finisher'], capacity: 4 },
  { name: '초탄 매개 종결', rounds: ['opening', 'wounding', 'bridge', 'finisher'], capacity: 4 },
  { name: '부분 장전', rounds: ['lightLoad', 'finisher'], capacity: 4 },
  { name: '네 발 경량', rounds: ['lightLoad', 'lightLoad', 'lightLoad', 'lightLoad'], capacity: 6 },
  { name: '복사 잔향 연계', rounds: ['plusP', 'mimic', 'afterimage', 'mimic'], capacity: 4 },
  { name: '화상 복사', rounds: ['highHeat', 'mimic', 'kindling', 'finisher'], capacity: 4 },
];
describe('대표 배열의 밸런스와 실제 적 상태', () => {
  it('세 거리에서 피해·상태·반동을 비교하며 특수 조건의 이득은 제한된다', () => {
    const rows = [3, 7, 11].flatMap(distance => plans.map(plan => {
      const result = resolver.resolveSequence(plan.rounds, { ...createEnemyState('normal'), hp: 500, maxHp: 500, distance }, { magazineCapacity: plan.capacity });
      return { 배열: plan.name, 거리: distance, 피해: result.totalHpDamage, 상처: result.totalWoundApplied,
        화상: result.totalBurnApplied, 충격: result.totalActionShockApplied, 폭발잔량: result.finalState.explosive,
        반동: result.shots.at(-1)!.breakdown.recoilAfter };
    }));
    console.table(rows);
    expect(rows.every(row => row.피해 <= (row.배열 === '네 발 경량' ? 34 : 32))).toBe(true);
    const near = rows.filter(row => row.거리 === 3);
    expect(near.find(row => row.배열 === '단일 계열 배열')!.피해).toBeGreaterThan(20);
    expect(near.find(row => row.배열 === '집중 연사')!.피해).toBeLessThanOrEqual(near.find(row => row.배열 === '고압 연사')!.피해);
    expect(near.find(row => row.배열 === '부분 장전')!.피해).toBeLessThan(20);
    expect(near.find(row => row.배열 === '부분 장전')!.피해).toBeGreaterThan(10);
  });
  it('혼합탄과 집중탄은 혼합·단일 계열에서 반대 이득을 제공한다', () => {
    const primary = (rounds: AmmoType[], index: number) => resolver.resolveSequence(rounds,
      { ...createEnemyState('normal'), hp: 500, maxHp: 500 }, { magazineCapacity: 6 }).shots[index]!.breakdown.resolvedPrimary.firepower;
    expect(primary(['focus', 'ball'], 0)).toBeGreaterThan(primary(['mosaic', 'ball'], 0));
    expect(primary(['wounding', 'incendiary', 'explosive', 'flatNose', 'mosaic'], 4)).toBeGreaterThan(primary(['wounding', 'incendiary', 'explosive', 'flatNose', 'focus'], 4));
  });
  it('적 7종에서 완성 탄창을 실제 체력과 행동 상태로 해결한다', () => {
    const rows = (Object.keys(ENEMY_DEFINITIONS) as EnemyType[]).flatMap(type => plans.map(plan => {
      const result = resolver.resolveSequence(plan.rounds, createEnemyState(type), { magazineCapacity: plan.capacity });
      const action = resolver.resolveEnemyAction(result.finalState);
      expect(result.totalHpDamage).toBeLessThanOrEqual(ENEMY_DEFINITIONS[type].hp);
      expect(result.shots.length + result.unfiredRounds.length).toBe(plan.rounds.length);
      expect(result.finalState.wound).toBeLessThan(result.finalState.woundThreshold);
      return { 적: ENEMY_DEFINITIONS[type].name, 배열: plan.name, 피해: result.totalHpDamage, 발사: result.shots.length,
        처치: result.killed, 행동중단: !result.killed && action.interrupted };
    }));
    console.table(rows);
    expect(rows.filter(row => row.적 === '거대 감염체').every(row => !row.처치)).toBe(true);
  });
});
