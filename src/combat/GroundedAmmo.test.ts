import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS, AMMO_ORDER } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { CombatResolver } from './CombatResolver';
import { createPlayerCombatState } from './AttachmentLoadout';
import type { AmmoType } from './types';

const resolver = new CombatResolver();
const target = (armor = 0) => ({ ...createEnemyState('tough'), hp: 500, maxHp: 500, armor, maxArmor: armor, distance: 3 });
const sequence = (rounds: AmmoType[], armor = 0) => resolver.resolveSequence(rounds, target(armor));

describe('누적 반동', () => {
  it('첫 고압탄은 자기 반동의 영향을 받지 않는다', () => {
    const shot = sequence(['overpressure']).shots[0]!;
    expect(shot.breakdown.accuracy).toBe(96);
    expect(shot.breakdown.cumulativeRecoil).toBe(0);
    expect(shot.breakdown.recoilGenerated).toBe(22);
  });
  it('저반동 선행은 후속 탄 정확도를 보존하고 고반동 선행은 낮춘다', () => {
    expect(sequence(['wadcutter', 'overpressure']).shots.map(shot => shot.breakdown.accuracy)).toEqual([112, 95]);
    expect(sequence(['overpressure', 'wadcutter']).shots.map(shot => shot.breakdown.accuracy)).toEqual([96, 90]);
    expect(sequence(['subsonic', 'standard']).shots[1]!.breakdown.accuracy).toBe(100);
  });
  it('같은 고압탄을 마지막에 배치하면 앞선 탄을 벌하지 않는다', () => {
    expect(sequence(['overpressure', 'standard', 'standard']).shots.map(shot => shot.breakdown.accuracy)).toEqual([96, 78, 71]);
    expect(sequence(['standard', 'standard', 'overpressure']).shots.map(shot => shot.breakdown.accuracy)).toEqual([100, 93, 82]);
  });
  it('장착물 반동은 발생량에 한 번 적용하고 봉쇄 시 제외한다', () => {
    const loadout = { muzzle: 'dualPortCompensator', grip: 'g10Grip' } as const;
    const stable = resolver.resolveSequence(['overpressure', 'standard'], target(), { loadout });
    expect(stable.shots[0]!.breakdown.accuracy).toBeCloseTo(102.76);
    expect(stable.shots[1]!.breakdown.accuracy).toBeCloseTo(92.68);
    expect(stable.shots[0]!.breakdown.recoilGenerated).toBeCloseTo(12.32);
    const state = createPlayerCombatState(); state.disabledSlots.muzzle = 2;
    const disrupted = resolver.resolveSequence(['overpressure', 'standard'], target(), { loadout, playerState: state });
    expect(disrupted.shots[1]!.breakdown.accuracy).toBeCloseTo(82.4);
  });
  it('최소 정확도와 100% 초과 피해 계수를 보존하며 탄창마다 누적을 초기화한다', () => {
    const result = sequence(Array<AmmoType>(8).fill('overpressure'));
    expect(result.shots.at(-1)!.breakdown.accuracy).toBe(25);
    expect(sequence(['match']).shots[0]!.hpDamage).toBe(Math.round(22 * 1.16));
    expect(sequence(['standard']).shots[0]!.breakdown.accuracy).toBe(100);
  });
});

describe('수치 방어층과 방어 파괴', () => {
  it('일반 피해는 방어를 소모한 후 남은 값만 체력에 적용한다', () => {
    const shot = sequence(['standard'], 3).shots[0]!;
    expect(shot.armorDamage).toBe(3);
    expect(shot.after.armor).toBe(0);
    expect(shot.hpDamage).toBe(19);
    expect(shot.after.hp).toBe(481);
  });
  it('큰 방어층은 흡수한 피해만 감소한다', () => {
    const shot = sequence(['standard'], 30).shots[0]!;
    expect(shot.after.armor).toBe(8);
    expect(shot.hpDamage).toBe(0);
  });
  it('방어 파괴가 선행하고 초과 파괴량은 체력 피해로 바뀌지 않는다', () => {
    const shot = sequence(['armorPiercing'], 3).shots[0]!;
    expect(shot.breakdown.armorBroken).toBe(3);
    expect(shot.breakdown.armorBlocked).toBe(0);
    expect(shot.hpDamage).toBe(18);
    expect(sequence(['armorPiercing']).shots[0]!.hpDamage).toBe(18);
  });
  it('무장갑에는 화력을 온전히 적용하고 철갑 선행은 역순보다 유리하다', () => {
    expect(sequence(['standard']).totalHpDamage).toBe(22);
    expect(sequence(['armorPiercing', 'hollowPoint'], 18).totalHpDamage).toBeGreaterThan(sequence(['hollowPoint', 'armorPiercing'], 18).totalHpDamage);
  });
});

describe('탄종 역할과 프리뷰의 공통 계산', () => {
  it('확장탄은 일반 등급 최고 무장갑 화력이며 철갑/본디드는 방어에 유리하다', () => {
    const common = AMMO_ORDER.filter(ammo => AMMO_DEFINITIONS[ammo].rarity === 'common' && ammo !== 'hollowPoint');
    for (const ammo of common) expect(sequence(['hollowPoint']).totalHpDamage).toBeGreaterThan(sequence([ammo]).totalHpDamage);
    expect(sequence(['armorPiercing'], 18).totalHpDamage).toBeGreaterThan(sequence(['standard'], 18).totalHpDamage);
    expect(sequence(['bonded'], 18).totalHpDamage).toBeGreaterThan(sequence(['hollowPoint'], 18).totalHpDamage);
  });
  it('평두탄 두 발은 충격/의도를 지연하며 다음 탄을 강화한다', () => {
    const enemy = { ...createEnemyState('contaminator'), distance: 3 };
    const setup = resolver.resolveSequence(['flatPoint', 'flatPoint'], enemy);
    expect(setup.finalState.statuses.staggerTurns).toBe(1);
    const action = resolver.resolveEnemyAction(setup.finalState);
    expect(action.intentDelayed).toBe(true);
    expect(action.movement).toBeLessThan(enemy.advancePerTurn);
    expect(resolver.resolveSequence(['flatPoint', 'flatPoint', 'hollowPoint'], enemy).shots[2]!.breakdown.statusMultiplier).toBe(1.4);
  });
  it('고압탄은 지금 더 강하지만 후속 사격 손실이 크다', () => {
    const heavy = sequence(['overpressure', 'standard']);
    const hollow = sequence(['hollowPoint', 'standard']);
    expect(heavy.shots[0]!.hpDamage).toBeGreaterThan(hollow.shots[0]!.hpDamage);
    expect(heavy.shots[1]!.hpDamage).toBeLessThan(hollow.shots[1]!.hpDamage);
  });
  it('전문화하지 않은 탄약의 파괴/충격은 정확히 0이다', () => {
    for (const ammo of AMMO_ORDER) {
      if (!['armorPiercing', 'bonded'].includes(ammo)) expect(AMMO_DEFINITIONS[ammo].armorBreak).toBe(0);
      if (ammo !== 'flatPoint') expect(AMMO_DEFINITIONS[ammo].impact).toBe(0);
    }
  });
  it('거리/상태/장착물/누적 반동을 적용한 프리뷰를 순차 사격과 일치시킨다', () => {
    const enemy = createEnemyState('groundshaker');
    const rounds: AmmoType[] = ['flatPoint', 'armorPiercing', 'hollowPoint', 'overpressure'];
    const playerState = createPlayerCombatState(); playerState.accuracyPenalty = -22;
    const context = { playerState, loadout: { magazine: 'extendedMagazine', muzzle: 'dualPortCompensator' } } as const;
    const preview = resolver.resolveSequence(rounds, enemy, context);
    let state = enemy, recoil = 0;
    const actual = rounds.map((ammo, index) => {
      const shot = resolver.resolveShot(ammo, index, state, { ...context, previousAmmo: rounds[index - 1], cumulativeRecoil: recoil });
      state = shot.after; recoil += shot.breakdown.recoilGenerated;
      return shot;
    });
    expect(preview.shots).toEqual(actual);
    expect(enemy.hp).toBe(enemy.maxHp);
    expect(preview).toEqual(resolver.resolveSequence(rounds, enemy, context));
  });
});
