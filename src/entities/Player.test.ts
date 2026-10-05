import { describe, expect, it } from 'vitest';
import { Player } from './Player';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';

describe('런 탄약 소유와 소비', () => {
  it('수동 제거는 배분과 잔량을 줄이고 장전 예약과 무제한 탄약을 보호한다', () => {
    const player = new Player();
    player.addAmmo('wounding');
    expect(player.removeSupplyAmmo('wounding')).toBe(true);
    expect(player.removeSupplyAmmo('wounding')).toBe(true);
    expect(player.getStock().wounding).toBe(1);
    expect(player.getBuild().wounding).toBe(1);
    expect(player.removeSupplyAmmo('wounding')).toBe(false);
    expect(player.magazine.getRounds()).toEqual(['wounding']);
    player.removeAmmo(0);
    expect(player.removeSupplyAmmo('wounding')).toBe(true);
    expect(player.removeSupplyAmmo('wounding')).toBe(false);
    expect(player.removeSupplyAmmo('ball' as Parameters<Player['removeSupplyAmmo']>[0])).toBe(false);
    expect(player.removeSupplyAmmo('invalid' as Parameters<Player['removeSupplyAmmo']>[0])).toBe(false);
    player.startStage();
    expect(player.getStock().wounding).toBe(0);
    expect(player.supplyAmmo('wounding')).toBe(true);
    expect(player.getAvailable('wounding')).toBe(1);
  });
  it('수동 보급은 소진된 탄과 미보유 탄을 즉시 지급하고 장전 예약을 유지한다', () => {
    const player = new Player();
    for (let i = 0; i < 3; i++) {
      player.addAmmo('wounding');
      player.fireRound({ ammoType: 'wounding' });
    }
    player.addAmmo('ball');
    expect(player.supplyAmmo('wounding')).toBe(true);
    expect(player.getAvailable('wounding')).toBe(1);
    expect(player.supplyAmmo('stickyCharge')).toBe(true);
    expect(player.getAvailable('stickyCharge')).toBe(1);
    expect(player.magazine.getRounds()).toEqual(['ball']);
    expect(player.addAmmo('stickyCharge')).toBe(true);
    expect(player.getAvailable('stickyCharge')).toBe(0);
    player.fireRound({ ammoType: 'ball' });
    player.fireRound({ ammoType: 'stickyCharge' });
    expect(player.getStock().stickyCharge).toBe(0);
    player.startStage();
    expect(player.getStock().stickyCharge).toBe(1);
  });

  it('수동 보급은 휴대 한도를 자동 확장하고 잘못된 탄약을 거부하며 재시작 때 초기화한다', () => {
    const player = new Player();
    for (let i = 0; i < 20; i++) expect(player.supplyAmmo('highHeat')).toBe(true);
    expect(player.getSpecialCapacity()).toBe(26);
    const stock = player.getStock();
    expect(player.supplyAmmo('ball' as Parameters<Player['supplyAmmo']>[0])).toBe(false);
    expect(player.supplyAmmo('invalid' as Parameters<Player['supplyAmmo']>[0])).toBe(false);
    expect(player.getStock()).toEqual(stock);
    player.reset();
    expect(player.getStock().highHeat).toBe(0);
    expect(player.getSpecialCapacity()).toBe(14);
  });

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
