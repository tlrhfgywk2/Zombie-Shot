import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS, AMMO_ORDER, COMBAT_BALANCE } from '../data/ammoDefinitions';
import { ATTACHMENT_DEFINITIONS, SERVICE_45 } from '../data/attachmentDefinitions';
import { createEnemyState, ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import { CombatResolver, formatRangePenalty } from './CombatResolver';

const resolver = new CombatResolver();
const unarmoredTarget = (distance: number) => ({
  ...createEnemyState('tough'), hp: 100, maxHp: 100, armor: 0, maxArmor: 0, distance,
});
const expectBetween = (value: number, minimum: number, maximum: number): void => {
  expect(value).toBeGreaterThanOrEqual(minimum);
  expect(value).toBeLessThanOrEqual(maximum);
};

describe('정규화 전투 수치 스케일', () => {
  it('직접 피해·특수 효과는 작은 정수이고 폐기 필드가 없다', () => {
    for (const definition of Object.values(AMMO_DEFINITIONS)) {
      for (const value of [definition.firepower, definition.armorBreak, definition.actionShock, definition.buildup?.amount ?? 0, definition.specialEnemyFirepowerBonus ?? 0]) {
        expect(Number.isInteger(value)).toBe(true);
      }
      expect(definition).not.toHaveProperty('directDamage');
      expect(definition).not.toHaveProperty('accuracy');
      expect(definition).not.toHaveProperty('accuracyModifier');
      expect(definition).not.toHaveProperty('penetration');
    }
    for (const value of [SERVICE_45.baseFirepower, ...Object.values(SERVICE_45.rangePenaltyPercentages), COMBAT_BALANCE.minimumFirepower, COMBAT_BALANCE.burnDamagePerTurn]) {
      expect(Number.isInteger(value)).toBe(true);
    }
    expect(SERVICE_45.baseFirepower).toBe(0);
    for (const attachment of Object.values(ATTACHMENT_DEFINITIONS)) {
      for (const modifier of attachment.modifiers) expect(Number.isInteger(modifier.value)).toBe(true);
    }
  });

  it('초반 일반·강적·특수 적 체력과 방어가 읽기 쉬운 기준 범위에 있다', () => {
    for (const type of ['normal', 'fast'] as const) expectBetween(ENEMY_DEFINITIONS[type].hp, 18, 28);
    for (const type of ['armored', 'tough'] as const) expectBetween(ENEMY_DEFINITIONS[type].hp, 28, 40);
    for (const type of ['contaminator', 'groundshaker', 'screecher'] as const) expectBetween(ENEMY_DEFINITIONS[type].hp, 40, 60);
    expectBetween(ENEMY_DEFINITIONS.armored.armor, 2, 5);
    expectBetween(ENEMY_DEFINITIONS.groundshaker.armor, 6, 10);
    for (const definition of Object.values(ENEMY_DEFINITIONS)) {
      expect(Number.isInteger(definition.hp)).toBe(true);
      expect(Number.isInteger(definition.armor)).toBe(true);
      expect(Number.isInteger(definition.shockResistance)).toBe(true);
    }
  });

  it('서비스 .45 거리 단계는 0%/10%/25%를 적용하고 최종 화력을 정수화한다', () => {
    const sequences = [3, 7, 11].map(distance => resolver.resolveSequence(['standard'], unarmoredTarget(distance)));
    expect(sequences.map(sequence => sequence.finalRangePenaltyPercent)).toEqual([0, 10, 25]);
    expect(sequences.map(sequence => sequence.rawVolleyFirepower)).toEqual([4, 4, 4]);
    expect(sequences.map(sequence => sequence.finalVolleyFirepower)).toEqual([4, 4, 3]);
    expect([0, 10, 25].map(formatRangePenalty)).toEqual(['피해 감소 없음', '화력 -10%', '화력 -25%']);
  });

  it('대표 탄약은 화력·반동·거리 유지·방어/충격 역할 차이를 보존한다', () => {
    const mid = unarmoredTarget(7);
    const basic = resolver.resolveShot('standard', 0, mid);
    const strong = resolver.resolveShot('overpressure', 0, mid);
    const matchFar = resolver.resolveSequence(['match'], unarmoredTarget(11));
    const armor = resolver.resolveShot('armorPiercing', 0, createEnemyState('armored'));
    const impact = resolver.resolveSequence(['flatPoint', 'flatPoint'], createEnemyState('normal'));

    expect(basic.breakdown.finalFirepower).toBe(4);
    expect(strong.breakdown.finalFirepower).toBe(7);
    expect(matchFar.finalRangePenaltyPercent).toBe(22);
    expect(matchFar.finalVolleyFirepower).toBe(2);
    expect(armor.breakdown.armorBroken).toBe(4);
    expect(impact.finalState.actionShock).toBe(8);
  });

  it('철갑 선행, 무관통 방어 흡수, 화상 지속 피해가 독립적으로 작동한다', () => {
    const armored = createEnemyState('armored');
    const setupFirst = resolver.resolveSequence(['armorPiercing', 'hollowPoint'], armored);
    const payoffFirst = resolver.resolveSequence(['hollowPoint', 'armorPiercing'], armored);
    const noPenetration = resolver.resolveShot('standard', 0, armored);
    const burning = resolver.resolveSequence(['incendiary', 'incendiary'], unarmoredTarget(11));
    const firstBurn = resolver.resolveEnemyAction(burning.finalState);
    const secondBurn = resolver.resolveEnemyAction(firstBurn.after, firstBurn.playerAfter);

    expect(setupFirst.totalHpDamage).toBeGreaterThan(payoffFirst.totalHpDamage);
    expect(noPenetration.hpDamage).toBe(0);
    expect(noPenetration.armorDamage).toBe(3);
    expect(burning.totalHpDamage).toBe(5);
    expect(firstBurn.burnDamage + secondBurn.burnDamage).toBe(6);
  });

  it('활성 탄약의 첫 직접 화력은 너무 이른 일격 처치를 만들지 않는다', () => {
    const normal = createEnemyState('normal');
    const firstShots = AMMO_ORDER.map(ammo => resolver.resolveShot(ammo, 0, normal));
    expect(Math.max(...firstShots.map(shot => shot.hpDamage))).toBeLessThan(normal.hp);
    expect(firstShots.every(shot => Number.isInteger(shot.breakdown.finalFirepower))).toBe(true);
  });
});
