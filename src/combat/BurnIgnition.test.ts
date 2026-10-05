import { describe, expect, it } from 'vitest';
import { CombatResolver, isIgnited, previewEnemyAction } from './CombatResolver';
import { createPlayerCombatState } from './AttachmentLoadout';
import { AMMO_DEFINITIONS, AMMO_ORDER, countAllocations } from '../data/ammoDefinitions';
import { createEnemyState, ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import { WEAPON_ORDER } from '../data/weaponDefinitions';
import { generateAmmoRewards } from '../progression/AmmoRewards';
import { Player } from '../entities/Player';
import type { AmmoType, EnemyState, EnemyType } from './types';

const resolver = new CombatResolver();
const burnAmmo = ['incendiary', 'highHeat', 'lowHeat', 'accelerant', 'ignition', 'kindling'] as const;
const target = (extra: Partial<EnemyState> = {}): EnemyState => ({
  ...createEnemyState('normal'), hp: 500, maxHp: 500, distance: 3, ...extra,
});

describe('화상 누적과 즉시 피해', () => {
  it('화상은 감소와 자동 피해 없이 여러 플레이어 턴에 남는다', () => {
    let enemy = resolver.resolveShot('incendiary', 0, target({ distance: 12 })).after;
    const hp = enemy.hp;
    for (let turn = 0; turn < 3; turn++) {
      enemy = resolver.resolveEnemyAction(enemy).after;
      expect(enemy).toMatchObject({ burn: 8, hp });
    }
    expect(resolver.resolveShot('incendiary', 0, enemy).after.burn).toBe(16);
  });
  it.each(burnAmmo)('%s는 설정된 즉시 피해와 축적을 분리해서 적용한다', ammo => {
    const definition = AMMO_DEFINITIONS[ammo];
    const enemy = target();
    const shot = resolver.resolveShot(ammo, 0, enemy);
    expect(shot.burnDamage).toBe(definition.burnDamage);
    expect(shot.hpDamage).toBe(definition.firepower + definition.burnDamage);
    expect(shot.burnApplied).toBe(definition.burn);
    expect(resolver.resolveShot(ammo, 0, enemy)).toEqual(shot);
    expect(enemy).toMatchObject({ burn: 0, hp: 500 });
  });
  it('한두 발도 점화 없이 즉시 피해를 제공한다', () => {
    expect(resolver.resolveSequence(['incendiary'], target())).toMatchObject({ totalHpDamage: 5, finalState: { burn: 8, ignitedActions: 0 } });
    expect(resolver.resolveSequence(['incendiary', 'incendiary'], target())).toMatchObject({ totalHpDamage: 10, totalBurnDamage: 4, finalState: { burn: 16, ignitedActions: 0 } });
  });
  it('사망하면 누적 화상과 점화가 초기화되고 뒤쪽 탄은 발사되지 않는다', () => {
    const result = resolver.resolveSequence(['incendiary', 'highHeat'], target({ hp: 1, burn: 19, ignitedActions: 1 }));
    expect(result.finalState).toMatchObject({ hp: 0, burn: 0, ignitedActions: 0 });
    expect(result.shots[0]).toMatchObject({ ignitionTriggered: false, burnApplied: 0 });
    expect(result.unfiredRounds).toEqual(['highHeat']);
  });
});

describe('점화와 적 행동', () => {
  it.each([[11, 19, false], [12, 0, true], [17, 5, true]] as const)('기존 화상 %i에 소이탄을 더하면 잔량 %i, 점화 %s', (burn, remaining, ignited) => {
    const shot = resolver.resolveShot('incendiary', 0, target({ burn }));
    expect(shot.after.burn).toBe(remaining);
    expect(shot.ignitionTriggered).toBe(ignited);
    expect(isIgnited(shot.after)).toBe(ignited);
  });
  it('극단적인 한 발도 임계치를 한 번만 소비하며 이후 초과분을 보존한다', () => {
    const shot = resolver.resolveShot('highHeat', 0, target({ burn: 39, burnThreshold: 5 }));
    expect(shot.after).toMatchObject({ burn: 46, ignitedActions: 1 });
    expect(resolver.resolveShot('ball', 1, shot.after).after.burn).toBe(46);
  });
  it.each(['contaminator', 'groundshaker', 'screecher'] as const)('%s의 예정된 특수 행동 효과를 전부 봉쇄하고 일반 접근한다', type => {
    const enemy = { ...createEnemyState(type), ignitedActions: 1 };
    const preview = previewEnemyAction(enemy);
    expect(preview).toMatchObject({ selectedAction: 'approach', suppressedIntent: enemy.intent!.type, movement: enemy.advancePerTurn });
    const normal = resolver.resolveEnemyAction({ ...enemy, ignitedActions: 0 }, createPlayerCombatState(), { rail: 'laserSight' });
    expect(normal.intentResolved).toBe(enemy.intent!.type);
    expect(normal.playerAfter).not.toEqual(createPlayerCombatState());
    const action = resolver.resolveEnemyAction(enemy, createPlayerCombatState(), { rail: 'laserSight' });
    expect(action).toMatchObject({ selectedAction: 'approach', suppressedIntent: enemy.intent!.type, movement: enemy.advancePerTurn, interrupted: false });
    expect(action.intentResolved).toBeUndefined();
    expect(action.intentDetail).toBeUndefined();
    expect(action.playerAfter).toEqual(createPlayerCombatState());
    expect(action.after.distance).toBeCloseTo(enemy.distance - enemy.advancePerTurn);
    expect(action.after.ignitedActions).toBe(0);
    expect(action.after.intent!.countdown).toBe(enemy.intent!.cooldown);
    expect(enemy.ignitedActions).toBe(1);
  });
  it('일반 접근은 유지하고 접근 후 점화만 해제한다', () => {
    expect(resolver.resolveEnemyAction(target({ ignitedActions: 1, burn: 7 }))).toMatchObject({ movement: 2, after: { ignitedActions: 0, burn: 7 } });
  });
  it.each(['normal', 'contaminator'] as const)('%s의 치명 공격은 점화가 막지 않는다', type => {
    const result = resolver.resolveEnemyAction({ ...createEnemyState(type), distance: 0, ignitedActions: 1 });
    expect(result).toMatchObject({ selectedAction: 'attack', playerKilled: true, after: { ignitedActions: 0 } });
    expect(result.suppressedIntent).toBeUndefined();
  });
  it('이미 점화된 적에 재발동해도 미래 행동 여러 번을 예약하지 않는다', () => {
    const shot = resolver.resolveShot('incendiary', 0, target({ burn: 17, ignitedActions: 1, distance: 12 }));
    expect(shot.after).toMatchObject({ burn: 5, ignitedActions: 1 });
    const next = resolver.resolveEnemyAction(shot.after);
    expect(next.after.ignitedActions).toBe(0);
    expect(resolver.resolveEnemyAction(next.after).after.ignitedActions).toBe(0);
  });
  it('충격으로 중단된 행동은 수행으로 계산하지 않아 다음 행동까지 점화를 유지한다', () => {
    const enemy = { ...createEnemyState('contaminator'), ignitedActions: 1, actionShock: 5 };
    const first = resolver.resolveEnemyAction(enemy);
    expect(first).toMatchObject({ interrupted: true, movement: 0, after: { ignitedActions: 1, actionShock: 0, intent: { countdown: 1 } } });
    expect(resolver.resolveEnemyAction(first.after)).toMatchObject({ movement: 2.8, after: { ignitedActions: 0 }, suppressedIntent: 'contaminate' });
  });
});

describe('화상 탄약 순서와 독립성', () => {
  it('고열탄은 소이탄보다 강하게 축적하고 후속 직접 화력을 반동으로 감소시킨다', () => {
    const hot = resolver.resolveSequence(['highHeat', 'highHeat', 'ball'], target());
    const base = resolver.resolveSequence(['incendiary', 'incendiary', 'ball'], target());
    expect(hot.totalBurnApplied).toBeGreaterThan(base.totalBurnApplied);
    expect(hot.shots[2]!.breakdown.recoilPenalty).toBeGreaterThan(base.shots[2]!.breakdown.recoilPenalty);
    expect(hot.shots[2]!.hpDamage).toBeLessThan(base.shots[2]!.hpDamage);
  });
  it('저열탄은 축적이 약하지만 반동이 없고 기존 반동 1도 회복한다', () => {
    const low = resolver.resolveSequence(['highHeat', 'lowHeat', 'highHeat'], target());
    const base = resolver.resolveSequence(['highHeat', 'incendiary', 'highHeat'], target());
    expect(low.shots[1]!.burnApplied).toBeLessThan(base.shots[1]!.burnApplied);
    expect(low.shots[1]!.breakdown).toMatchObject({ recoilGenerated: 0, recoilAfter: 2 });
    expect(low.shots[2]!.breakdown.recoilPenalty).toBeLessThan(base.shots[2]!.breakdown.recoilPenalty);
  });
  it('연소촉진탄은 바로 다음 한 발만 1.5배 버림으로 강화한다', () => {
    expect(resolver.resolveSequence(['accelerant', 'highHeat', 'incendiary'], target()).shots.map(shot => shot.burnApplied)).toEqual([2, 18, 8]);
    expect(resolver.resolveSequence(['highHeat', 'accelerant', 'incendiary'], target()).shots.map(shot => shot.burnApplied)).toEqual([12, 2, 12]);
    expect(resolver.resolveSequence(['accelerant', 'ball', 'highHeat'], target()).shots.map(shot => shot.burnApplied)).toEqual([2, 0, 12]);
    expect(resolver.resolveSequence(['accelerant', 'accelerant', 'incendiary'], target()).shots.map(shot => shot.burnApplied)).toEqual([2, 3, 12]);
    expect(resolver.resolveShot('highHeat', 0, target()).burnApplied).toBe(12);
  });
  it.each([[0, 2], [1, 2], [8, 6], [17, 10], [19, 11]])('점화탄은 기존 화상 %i에서 화상 %i를 더한다', (burn, expected) => {
    expect(resolver.resolveShot('ignition', 0, target({ burn })).burnApplied).toBe(expected);
  });
  it('점화탄은 먼저 발사할 때보다 누적 뒤에 발사할 때 강하다', () => {
    const before = resolver.resolveSequence(['ignition', 'incendiary', 'incendiary'], target());
    const after = resolver.resolveSequence(['incendiary', 'incendiary', 'ignition'], target());
    expect(before.finalState.ignitedActions).toBe(0);
    expect(after.finalState).toMatchObject({ ignitedActions: 1, burn: 6 });
  });
  it('발화탄의 직접 화력 +3은 사격 시작 시 점화된 대상에만 적용한다', () => {
    const cold = resolver.resolveShot('kindling', 0, target());
    const hot = resolver.resolveShot('kindling', 0, target({ ignitedActions: 1 }));
    expect(hot.hpDamage - cold.hpDamage).toBe(3);
    expect(hot.burnDamage).toBe(cold.burnDamage);
    expect(hot.burnApplied).toBe(cold.burnApplied);
    expect(resolver.resolveShot('kindling', 0, target({ burn: 19 })).breakdown.ignitedBonus).toBe(0);
    expect(resolver.resolveSequence(['accelerant', 'highHeat', 'kindling'], target()).shots[2]!.breakdown.ignitedBonus).toBe(3);
  });
  it.each(burnAmmo)('취약은 %s의 직접 화력만 증폭한다', ammo => {
    const cold = resolver.resolveShot(ammo, 0, target({ burn: 7, explosive: 4 }));
    const wounded = resolver.resolveShot(ammo, 0, target({ burn: 7, explosive: 4, vulnerableTurns: 1 }));
    expect(wounded.burnApplied).toBe(cold.burnApplied);
    expect(wounded.burnDamage).toBe(cold.burnDamage);
    expect(wounded.after.explosive).toBe(4);
    expect(wounded.actionShockApplied).toBe(0);
    expect(wounded.explosiveConsumed).toBe(0);
  });
  it('충격 연쇄는 화상탄에도 명시적인 충격을 더하고 폭발은 실제 충격 시점에만 기폭한다', () => {
    const result = resolver.resolveSequence(['impactRelay', 'incendiary'], target({ explosive: 4 }));
    expect(result.shots[0]).toMatchObject({ explosiveConsumed: 4, explosionDamage: 8 });
    expect(result.shots[1]).toMatchObject({ actionShockApplied: 3, explosiveConsumed: 0, explosionDamage: 0, burnApplied: 8, burnDamage: 2 });
  });
  it.each([3, 7, 11])('거리 %im의 피해 감쇠는 즉시 화상 피해에도 적용하지만 축적에는 적용하지 않는다', distance => {
    const result = resolver.resolveSequence(['highHeat', 'highHeat', 'highHeat'], target({ distance }));
    expect(result.totalBurnApplied).toBe(36);
    for (const shot of result.shots) {
      const b = shot.breakdown;
      expect(b.finalFirepower).toBe(b.prePenaltyFirepower - b.recoilFirepowerReduction - b.playerDebuffFirepowerReduction - b.distanceFirepowerReduction);
      expect(b.finalFirepower).toBe(b.directFirepower + b.burnDamage + b.detonationDamage);
    }
    if (distance === 11) expect(result.totalBurnDamage).toBeLessThan(9);
    expect(result.finalState).not.toHaveProperty('armor');
  });
});

describe('화상 예측과 무기', () => {
  it.each(WEAPON_ORDER)('%s에서 모든 순서 수치와 실제 사격이 일치한다', weaponId => {
    for (const distance of [3, 7, 11]) {
      for (const rounds of [
        ['incendiary', 'incendiary', 'ignition', 'kindling'],
        ['accelerant', 'highHeat', 'kindling', 'ball'],
        ['lowHeat', 'highHeat', 'ignition', 'kindling'],
        ['wounding', 'explosive', 'impactRelay', 'incendiary'],
      ] as AmmoType[][]) {
        const result = resolver.resolveSequence(rounds, target({ distance }), { weaponId, boostedOpening: true, loadout: { rail: 'tacticalLight' } });
        result.shots.forEach((shot, index) => {
          expect(result.roundPreviews[index]).toMatchObject({ burn: shot.burnApplied, burnDamage: shot.burnDamage, burnAfter: shot.after.burn, ignitionTriggered: shot.ignitionTriggered, ignitedBonus: shot.breakdown.ignitedBonus });
        });
      }
    }
  });
  it('추가 후보 미리보기는 촉진과 기존 화상에 따른 최종 축적을 포함한다', () => {
    const previews = resolver.previewAppendedAmmo(['accelerant'], ['highHeat', 'ignition'], target({ burn: 17 }));
    expect(previews.highHeat).toMatchObject({ burn: 18, burnBefore: 19, burnAfter: 17, ignitionTriggered: true });
    expect(previews.ignition).toMatchObject({ burn: 16, burnBefore: 19, burnAfter: 15, ignitionTriggered: true });
  });
  it('화상 예측으로 특수 행동 교체를 결정하며 실제 행동도 일치한다', () => {
    const result = resolver.resolveSequence(['accelerant', 'highHeat'], createEnemyState('contaminator'));
    const preview = previewEnemyAction(result.finalState);
    const actual = resolver.resolveEnemyAction(result.finalState);
    expect(preview.suppressedIntent).toBe('contaminate');
    expect(actual.selectedAction).toBe(preview.selectedAction);
    expect(actual.movement).toBe(preview.movement);
    expect(actual.threshold).toBe(preview.threshold);
  });
});

describe('화상 보급과 용량', () => {
  it.each(burnAmmo)('%s는 지정 등급의 중복 없는 보상에 포함되며 기존 배분·재보급을 따른다', ammo => {
    const rarity = ['incendiary', 'lowHeat'].includes(ammo) ? 'common' : 'uncommon';
    expect(AMMO_DEFINITIONS[ammo].rarity).toBe(rarity);
    const pool = AMMO_ORDER.filter(id => id !== 'ball' && AMMO_DEFINITIONS[id].rarity === rarity);
    const rolls = [rarity === 'common' ? 0 : 0.99, (pool.indexOf(ammo) + 0.5) / pool.length];
    const rewards = generateAmmoRewards(() => rolls.shift() ?? 0);
    expect(rewards).toContain(ammo);
    expect(new Set(rewards).size).toBe(rewards.length);
    const player = new Player();
    for (let i = 0; i < 3; i++) { player.supplyAmmo('wounding'); player.supplyAmmo('laceration'); }
    expect(player.getBuild()[ammo]).toBe(0);
    expect(player.applyAmmoReward(ammo)).toBe(true);
    expect(countAllocations(player.getBuild())).toBe(7);
    expect(player.getAvailable(ammo)).toBe(0);
    player.startStage();
    expect(player.addAmmo(ammo)).toBe(true);
    player.fireRound({ ammoType: ammo });
    expect(player.getStock()[ammo]).toBe(0);
    player.startStage();
    expect(player.getStock()[ammo]).toBe(1);
    expect(player.setSpecialCapacity(7)).toBe(true);
    expect(player.applyAmmoReward(ammo)).toBe(false);
    expect(player.applyAmmoReward(ammo, ['wounding'])).toBe(true);
    expect(countAllocations(player.getBuild())).toBe(7);
  });
  it('모든 표적의 화상 임계치는 데이터에 정의되어 있고 새 표적은 화상 0으로 시작한다', () => {
    for (const type of Object.keys(ENEMY_DEFINITIONS) as EnemyType[]) {
      expect(createEnemyState(type)).toMatchObject({ burn: 0, burnThreshold: ENEMY_DEFINITIONS[type].burnThreshold, ignitedActions: 0 });
      expect(ENEMY_DEFINITIONS[type].burnThreshold).toBeGreaterThan(0);
    }
  });
});
