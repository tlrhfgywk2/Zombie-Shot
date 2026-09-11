import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS, AMMO_ORDER } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { CombatResolver } from './CombatResolver';
import type { AmmoType } from './types';

const resolver = new CombatResolver();
const target = (armor = 0) => ({ ...createEnemyState('tough'), hp: 500, maxHp: 500, armor, maxArmor: armor, distance: 3 });
const sequence = (rounds: AmmoType[], armor = 0) => resolver.resolveSequence(rounds, target(armor));

describe('수치 방어층과 방어 파괴', () => {
  it('중거리 오염 투척체의 방어를 먼저 파괴하고 거리 조정 화력을 적용한다', () => {
    const result = resolver.resolveSequence(['armorPiercing'], createEnemyState('contaminator'));
    const shot = result.shots[0]!;
    expect(shot.breakdown.rangeBand).toBe('mid');
    expect(result.finalRangePenaltyPercent).toBe(10);
    expect(shot.breakdown.armorBroken).toBe(3);
    expect(shot.breakdown.armorBlocked).toBe(0);
    expect(shot.after.armor).toBe(0);
    expect(shot.hpDamage).toBe(3);
  });

  it('방어 8 표적은 방어 파괴 4 철갑탄 한 발에 방어가 4만 감소한다', () => {
    const shot = resolver.resolveSequence(['armorPiercing'], createEnemyState('groundshaker')).shots[0]!;
    expect(shot.breakdown.armorBroken).toBe(4);
    expect(shot.breakdown.armorBlocked).toBe(3);
    expect(shot.armorDamage).toBe(4);
    expect(shot.after.armor).toBe(4);
    expect(shot.hpDamage).toBe(0);
  });

  it('일반 피해는 방어를 소모한 후 남은 값만 체력에 적용한다', () => {
    const shot = sequence(['standard'], 3).shots[0]!;
    expect(shot.armorDamage).toBe(3);
    expect(shot.after.armor).toBe(0);
    expect(shot.hpDamage).toBe(1);
  });

  it('방어 파괴가 선행하고 초과 파괴량은 체력 피해로 바뀌지 않는다', () => {
    const shot = sequence(['armorPiercing'], 3).shots[0]!;
    expect(shot.breakdown.armorBroken).toBe(3);
    expect(shot.breakdown.armorBlocked).toBe(0);
    expect(shot.hpDamage).toBe(3);
  });

  it('무장갑에는 화력을 온전히 적용하고 철갑 선행은 역순보다 유리하다', () => {
    expect(sequence(['standard']).totalHpDamage).toBe(4);
    expect(sequence(['armorPiercing', 'hollowPoint'], 5).totalHpDamage).toBeGreaterThan(sequence(['hollowPoint', 'armorPiercing'], 5).totalHpDamage);
  });
});

describe('탄종 역할과 프리뷰의 공통 계산', () => {
  it('확장탄은 일반 등급 최고 무장갑 화력이며 철갑/본디드는 방어에 유리하다', () => {
    const common = AMMO_ORDER.filter(ammo => AMMO_DEFINITIONS[ammo].rarity === 'common' && ammo !== 'hollowPoint');
    for (const ammo of common) expect(sequence(['hollowPoint']).totalHpDamage).toBeGreaterThan(sequence([ammo]).totalHpDamage);
    expect(sequence(['armorPiercing'], 5).totalHpDamage).toBeGreaterThan(sequence(['standard'], 5).totalHpDamage);
    expect(sequence(['bonded'], 5).totalHpDamage).toBeGreaterThan(sequence(['hollowPoint'], 5).totalHpDamage);
  });

  it('전문화하지 않은 탄약의 파괴/충격은 정확히 0이다', () => {
    for (const ammo of AMMO_ORDER) {
      if (!['armorPiercing', 'bonded'].includes(ammo)) expect(AMMO_DEFINITIONS[ammo].armorBreak).toBe(0);
      if (!['flatPoint', 'wadcutter'].includes(ammo)) expect(AMMO_DEFINITIONS[ammo].actionShock).toBe(0);
    }
  });

  it('거리·상태·장착물·순서 특성을 포함한 프리뷰는 반복 계산과 일치한다', () => {
    const enemy = createEnemyState('groundshaker');
    const rounds: AmmoType[] = ['flatPoint', 'armorPiercing', 'hollowPoint', 'overpressure'];
    const context = { loadout: { magazine: 'extendedMagazine', muzzle: 'dualPortCompensator' } } as const;
    const preview = resolver.resolveSequence(rounds, enemy, context);
    expect(preview).toEqual(resolver.resolveSequence(rounds, enemy, context));
    expect(enemy.hp).toBe(enemy.maxHp);
    expect(preview.finalState.distance).toBe(enemy.distance);
  });
});
