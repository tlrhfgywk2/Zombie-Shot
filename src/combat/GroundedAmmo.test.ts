import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS, AMMO_ORDER } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { CombatResolver } from './CombatResolver';
import type { AmmoType } from './types';

const resolver = new CombatResolver();
const target = (armor = 0) => ({ ...createEnemyState('tough'), hp: 500, maxHp: 500, armor, maxArmor: armor, distance: 3 });
const sequence = (rounds: AmmoType[], armor = 0) => resolver.resolveSequence(rounds, target(armor));

describe('수치 방어층과 방어 파괴', () => {
  it('철갑탄이 방어를 전부 파괴해도 그 탄의 화력은 사격 전 방어에 의해 경감된다', () => {
    const result = resolver.resolveSequence(['armorPiercing'], createEnemyState('contaminator'));
    const shot = result.shots[0]!;
    expect(shot.breakdown.rangeBand).toBe('mid');
    expect(result.finalRangePenaltyPercent).toBe(10);
    expect(shot.breakdown.armorBroken).toBe(3);
    expect(shot.breakdown.armorBlocked).toBe(3);
    expect(shot.after.armor).toBe(0);
    expect(shot.hpDamage).toBe(0);
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

  it('방어 파괴량의 초과분은 체력 피해로 바뀌지 않고 같은 탄의 화력은 기존 방어에 막힌다', () => {
    const shot = sequence(['armorPiercing'], 3).shots[0]!;
    expect(shot.breakdown.armorBroken).toBe(3);
    expect(shot.breakdown.armorBlocked).toBe(3);
    expect(shot.hpDamage).toBe(0);
  });

  it('철갑탄이 방어를 전부 제거한 다음 탄부터는 화력이 방어에 경감되지 않는다', () => {
    const shots = sequence(['armorPiercing', 'standard'], 3).shots;
    expect(shots[0]).toMatchObject({ hpDamage: 0, after: { armor: 0 }, breakdown: { armorBroken: 3, armorBlocked: 3 } });
    expect(shots[1]).toMatchObject({ hpDamage: 4, breakdown: { armorBlocked: 0 } });
  });

  it('무장갑에는 화력을 온전히 적용하고 철갑 선행은 역순보다 유리하다', () => {
    expect(sequence(['standard']).totalHpDamage).toBe(4);
    expect(sequence(['armorPiercing', 'hollowPoint'], 5).totalHpDamage).toBeGreaterThan(sequence(['hollowPoint', 'armorPiercing'], 5).totalHpDamage);
  });
});

describe('탄종 역할과 프리뷰의 공통 계산', () => {
  it('확장탄은 일반 등급 최고 무장갑 화력이며 철갑/본디드는 방어를 파괴해도 자기 화력이 경감된다', () => {
    const common = AMMO_ORDER.filter(ammo => AMMO_DEFINITIONS[ammo].rarity === 'common' && ammo !== 'hollowPoint');
    for (const ammo of common) expect(sequence(['hollowPoint']).totalHpDamage).toBeGreaterThan(sequence([ammo]).totalHpDamage);
    const armorPiercing = sequence(['armorPiercing'], 5).shots[0]!;
    const bonded = sequence(['bonded'], 5).shots[0]!;
    expect(armorPiercing).toMatchObject({ hpDamage: 0, breakdown: { armorBroken: 4, armorBlocked: 3 } });
    expect(bonded).toMatchObject({ hpDamage: 0, breakdown: { armorBroken: 5, armorBlocked: 5 } });
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
