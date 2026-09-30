import { describe, expect, it } from 'vitest';
import { CombatResolver } from './CombatResolver';
import { AMMO_DEFINITIONS, createAmmoBuild } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { Player } from '../entities/Player';
import { generateAmmoRewards } from '../progression/AmmoRewards';
import type { EnemyState } from './types';

const resolver = new CombatResolver();
const target = (changes: Partial<EnemyState> = {}): EnemyState =>
  ({ ...createEnemyState('normal'), hp: 10000, maxHp: 10000, distance: 3, ...changes });

describe('폭발 누적과 충격 명중 기폭', () => {
  it('임계치 없이 큰 수치까지 누적하고 적 행동과 다음 탄창에도 보존한다', () => {
    const first = resolver.resolveSequence(['explosive', 'highExplosive', 'stickyCharge'], target({ explosive: 100000 }));
    expect(first.finalState.explosive).toBe(100009);
    const nextTurn = resolver.resolveEnemyAction(first.finalState).after;
    expect(nextTurn.explosive).toBe(100009);
    expect(resolver.resolveShot('explosive', 0, nextTurn).after.explosive).toBe(100011);
    expect(createEnemyState('normal').explosive).toBe(0);
  });

  it('기존 충격은 폭발탄을 기폭하지 않고, 충격탄 명중 시 전량 한 번만 소비한다', () => {
    const result = resolver.resolveSequence(['explosive', 'stickyCharge', 'flatNose', 'heavy'], target({ actionShock: 50 }));
    expect(result.shots.map(shot => shot.after.explosive)).toEqual([2, 6, 0, 0]);
    expect(result.shots.map(shot => shot.breakdown.detonationDamage)).toEqual([0, 0, 12, 0]);
    expect(result.shots[2]!.after.actionShock).toBe(54);
  });

  it('충격이 정확히 1이어도 행동 중단 임계치와 무관하게 기폭한다', () => {
    const original = AMMO_DEFINITIONS.flatNose;
    AMMO_DEFINITIONS.flatNose = { ...original, actionShock: 1 };
    try {
      const shot = resolver.resolveShot('flatNose', 0, target({ explosive: 3, shockResistance: 100 }));
      expect(shot.explosiveConsumed).toBe(3);
      expect(shot.explosionDamage).toBe(6);
      expect(shot.after.actionShock).toBe(1);
    } finally {
      AMMO_DEFINITIONS.flatNose = original;
    }
  });

  it('반동으로 직접 화력이 0이어도 명중한 충격탄은 기폭한다', () => {
    const result = resolver.resolveSequence(['highExplosive', 'highExplosive', 'flatNose'], target());
    const trigger = result.shots[2]!;
    expect(trigger.breakdown.effectiveFirepower).toBe(0);
    expect(trigger.hpDamage).toBe(12);
    expect(trigger.after.explosive).toBe(0);
  });

  it('거리·취약·부착물로 기폭 피해가 증감하거나 비충격탄이 기폭하지 않는다', () => {
    for (const distance of [3, 7, 11]) {
      for (const vulnerableTurns of [0, 2]) {
        const enemy = target({ distance, vulnerableTurns, explosive: 7 });
        const context = { loadout: { rail: 'tacticalLight' as const } };
        expect(resolver.resolveShot('flatNose', 0, enemy, context).explosionDamage).toBe(14);
        expect(resolver.resolveShot('ball', 0, enemy, context).after.explosive).toBe(7);
      }
    }
  });

  it('순서를 바꾸면 기폭 여부와 피해가 달라지며 재누적·재기폭할 수 있다', () => {
    const armed = resolver.resolveSequence(['stickyCharge', 'flatNose'], target());
    const reversed = resolver.resolveSequence(['flatNose', 'stickyCharge'], target());
    expect(armed.totalHpDamage - reversed.totalHpDamage).toBe(8);
    expect(reversed.finalState.explosive).toBe(4);
    const twice = resolver.resolveSequence(['explosive', 'flatNose', 'explosive', 'flatNose'], target());
    expect(twice.shots.map(shot => shot.explosiveConsumed)).toEqual([0, 2, 0, 2]);
  });

  it('기폭 처치는 남은 탄을 발사·소모하지 않고 실제 피해는 남은 체력으로 제한한다', () => {
    const player = new Player();
    player.applyAmmoReward('stickyCharge');
    player.applyAmmoReward('flatNose');
    player.startStage();
    for (const ammo of ['stickyCharge', 'flatNose', 'wounding'] as const) player.addAmmo(ammo);
    const result = resolver.resolveSequence(player.magazine.getRounds(), target({ hp: 8 }));
    expect(result.totalHpDamage).toBe(8);
    expect(result.shots[1]!.explosionDamage).toBe(6);
    expect(result.shots[1]!.explosiveConsumed).toBe(4);
    expect(result.unfiredRounds).toEqual(['wounding']);
    result.shots.forEach(shot => player.fireRound(shot));
    expect(player.getStock().wounding).toBe(3);
    expect(player.getStock().stickyCharge).toBe(0);
    expect(result.roundPreviews).toHaveLength(3);
  });

  it('직접 피해로 죽어도 충격 명중은 기폭하며 죽은 적에게 폭발을 더 쌓지 않는다', () => {
    expect(resolver.resolveShot('heavy', 0, target({ hp: 1, explosive: 4 }))).toMatchObject({
      hpDamage: 1, explosiveConsumed: 4, explosionDamage: 0, after: { explosive: 0 },
    });
    expect(resolver.resolveShot('explosive', 0, target({ hp: 1 })).explosiveApplied).toBe(0);
  });

  it('프리뷰는 원본 상태를 변경하지 않으며 기폭을 포함한 화력 합산이 일치한다', () => {
    const enemy = target({ distance: 11, vulnerableTurns: 2 });
    const saved = structuredClone(enemy);
    const result = resolver.resolveSequence(['highExplosive', 'stickyCharge', 'heavy'], enemy);
    const b = result.firepowerBreakdown;
    expect(b.detonationDamage).toBe(14);
    expect(b.finalFirepower).toBe(result.totalHpDamage);
    expect(b.prePenaltyFirepower - b.recoilReduction - b.playerDebuffReduction - b.distanceReduction).toBe(b.finalFirepower);
    resolver.previewAppendedAmmo(['stickyCharge'], ['flatNose', 'explosive'], enemy);
    expect(enemy).toEqual(saved);
  });

  it('신규 탄약은 보상으로 획득하여 다음 스테이지에 장전할 수 있다', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) generateAmmoRewards(() => i / 100).forEach(ammo => seen.add(ammo));
    for (const ammo of ['explosive', 'highExplosive', 'stickyCharge'] as const) {
      expect(seen.has(ammo)).toBe(true);
      expect(createAmmoBuild()[ammo]).toBe(0);
      const player = new Player();
      expect(player.applyAmmoReward(ammo)).toBe(true);
      player.startStage();
      expect(player.addAmmo(ammo)).toBe(true);
    }
  });
});
