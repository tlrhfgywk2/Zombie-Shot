import { describe, expect, it } from 'vitest';
import { Player } from './Player';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';

describe('런 탄약 소유와 소비', () => {
  it('장전은 예약이며 실제 발사한 특수탄만 구간 잔량에서 차감한다', () => {
    const player = new Player();
    expect(player.addAmmo('wounding')).toBe(true);
    expect(player.addAmmo('ball')).toBe(true);
    expect(player.addAmmo('laceration')).toBe(true);
    expect(player.getStock().wounding).toBe(3);
    const enemy = { ...createEnemyState('normal'), hp: 1 };
    const sequence = new CombatResolver().resolveSequence(player.magazine.getRounds(), enemy);
    expect(sequence.unfiredRounds).toEqual(['ball', 'laceration']);
    for (const shot of sequence.shots) player.fireRound(shot);
    expect(player.getStock().wounding).toBe(2);
    expect(player.getStock().laceration).toBe(3);
    player.magazine.clear();
    player.startStage();
    expect(player.getStock().wounding).toBe(3);
  });

  it('휴대 용량 강화는 배분 상한만 높이고 탄약을 즉시 지급하지 않는다', () => {
    const player = new Player();
    const before = player.getStock();
    expect(player.upgradeAmmoCapacity()).toBe(true);
    expect(player.getSpecialCapacity()).toBe(16);
    expect(player.getStock()).toEqual(before);
    player.reset();
    expect(player.getSpecialCapacity()).toBe(14);
  });
});
