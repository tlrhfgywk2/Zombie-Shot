import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS, AMMO_ORDER } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { CombatResolver } from './CombatResolver';
import type { AmmoType } from './types';

const resolver = new CombatResolver();
const target = (armor = 0) => ({ ...createEnemyState('tough'), hp: 500, maxHp: 500, armor, maxArmor: armor, distance: 3 });
const sequence = (rounds: AmmoType[], armor = 0) => resolver.resolveSequence(rounds, target(armor));

describe('누적 반동', () => {
  it('첫 탄은 누적 0에서 시작하고 자기 반동은 다음 재조준부터 사용한다', () => {
    const shots = sequence(['overpressure', 'standard']).shots;
    expect(shots[0]!.breakdown.cumulativeRecoil).toBe(0);
    expect(shots[0]!.breakdown.recoilGenerated).toBe(2);
    expect(shots[0]!.breakdown.recoilAfterShot).toBe(2);
    expect(shots[1]!.breakdown.cumulativeRecoil).toBe(2);
  });

  it('저반동 선행은 후속 재조준 접근을 줄이고 고반동 선행은 늘린다', () => {
    const lowFirst = sequence(['subsonic', 'standard', 'standard']);
    const highFirst = sequence(['overpressure', 'standard', 'standard']);
    expect(lowFirst.shots.map(shot => shot.breakdown.recoilMovement)).toEqual([0, 0.03, 0]);
    expect(highFirst.shots.map(shot => shot.breakdown.recoilMovement)).toEqual([0.05, 0.08, 0]);
    expect(highFirst.totalRecoilMovement).toBeGreaterThan(lowFirst.totalRecoilMovement);
  });

  it('반동 순서는 화력이 아닌 접근 위험만 바꾼다', () => {
    const highFirst = sequence(['overpressure', 'standard', 'standard']);
    const highLast = sequence(['standard', 'standard', 'overpressure']);
    expect(highFirst.shots.map(shot => shot.breakdown.finalFirepower)).toEqual([8, 4, 4]);
    expect(highLast.shots.map(shot => shot.breakdown.finalFirepower)).toEqual([4, 4, 8]);
    expect(highFirst.totalRecoilMovement).toBeGreaterThan(highLast.totalRecoilMovement);
  });

  it('장착물 반동 제어는 발생량에 한 번 적용하고 봉쇄 시 제외한다', () => {
    const loadout = { muzzle: 'dualPortCompensator', grip: 'g10Grip' } as const;
    const stable = resolver.resolveSequence(['overpressure', 'standard'], target(), { loadout });
    expect(stable.shots[0]!.breakdown.recoilGenerated).toBe(0.975);
    expect(stable.shots[0]!.breakdown.recoilMovement).toBe(0.02);
    const playerState = { recoilPenaltyPercent: 0, recoilPenaltyTurns: 0, rangePenaltySteps: 0, rangePenaltyTurns: 0, disabledSlots: { muzzle: 2 } } as const;
    const disrupted = resolver.resolveSequence(['overpressure', 'standard'], target(), { loadout, playerState });
    expect(disrupted.shots[0]!.breakdown.recoilGenerated).toBe(1.5);
  });
});

describe('수치 방어층과 방어 파괴', () => {
  it('중거리 오염 투척체의 방어를 먼저 파괴하고 거리 조정 화력을 적용한다', () => {
    const shot = resolver.resolveSequence(['armorPiercing'], createEnemyState('contaminator')).shots[0]!;
    expect(shot.breakdown.rangeBand).toBe('mid');
    expect(shot.breakdown.rangePenaltyPercent).toBe(10);
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

  it('평두탄 두 발은 충격/의도를 지연하며 다음 탄을 강화한다', () => {
    const enemy = { ...createEnemyState('contaminator'), distance: 3 };
    const setup = resolver.resolveSequence(['flatPoint', 'flatPoint'], enemy);
    expect(setup.finalState.statuses.staggerTurns).toBe(1);
    const action = resolver.resolveEnemyAction(setup.finalState);
    expect(action.intentDelayed).toBe(true);
    expect(action.movement).toBeLessThan(enemy.advancePerTurn);
    expect(resolver.resolveSequence(['flatPoint', 'flatPoint', 'hollowPoint'], enemy).shots[2]!.breakdown.statusFirepowerBonus).toBe(3);
  });

  it('전문화하지 않은 탄약의 파괴/충격은 정확히 0이다', () => {
    for (const ammo of AMMO_ORDER) {
      if (!['armorPiercing', 'bonded'].includes(ammo)) expect(AMMO_DEFINITIONS[ammo].armorBreak).toBe(0);
      if (ammo !== 'flatPoint') expect(AMMO_DEFINITIONS[ammo].impact).toBe(0);
    }
  });

  it('거리·상태·장착물·누적 반동을 포함한 프리뷰는 반복 계산과 일치한다', () => {
    const enemy = createEnemyState('groundshaker');
    const rounds: AmmoType[] = ['flatPoint', 'armorPiercing', 'hollowPoint', 'overpressure'];
    const context = { loadout: { magazine: 'extendedMagazine', muzzle: 'dualPortCompensator' } } as const;
    const preview = resolver.resolveSequence(rounds, enemy, context);
    expect(preview).toEqual(resolver.resolveSequence(rounds, enemy, context));
    expect(enemy.hp).toBe(enemy.maxHp);
    expect(preview.totalRecoilMovement).toBeGreaterThan(0);
  });
});
