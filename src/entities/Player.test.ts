import { describe, expect, it } from 'vitest';
import { Player } from './Player';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import { createAmmoBuild } from '../data/ammoDefinitions';
import { WEAPON_ORDER } from '../data/weaponDefinitions';
import { STARTING_AMMO_LOADOUTS } from '../data/gameModes';

describe('런 탄약 소유와 소비', () => {
  it.each(WEAPON_ORDER)('%s의 초기 탄약은 조우 안에서만 소모되고 종료하면 복구한다', weapon => {
    const player = new Player();
    player.startRun('free', weapon);
    const initial = createAmmoBuild(STARTING_AMMO_LOADOUTS[weapon]);
    expect(player.weapon.id).toBe(weapon);
    expect(player.getBuild()).toEqual(initial);
    for (const [ammo, count] of Object.entries(initial)) {
      for (let index = 0; index < count; index++) {
        const type = ammo as Parameters<Player['supplyAmmo']>[0];
        expect(player.addAmmo(type)).toBe(true);
        player.fireRound({ ammoType: type });
      }
    }
    expect(Object.entries(player.getStock()).filter(([id]) => id !== 'ball').every(([, count]) => count === 0)).toBe(true);
    expect(player.getBuild()).toEqual(initial);
    expect(player.addAmmo('opening')).toBe(false);
    for (let index = 0; index < 12; index++) {
      expect(player.getAvailable('ball')).toBe('infinite');
      expect(player.addAmmo('ball')).toBe(true);
      player.fireRound({ ammoType: 'ball' });
    }
    player.endEncounter();
    expect(player.getStock()).toEqual({ ...initial, ball: 'infinite' });
    player.endEncounter();
    expect(player.getBuild()).toEqual(initial);
  });

  it('조우 복구는 획득·영구 제거·용량·부착물을 보존하고 최초 배분을 다시 적용하지 않는다', () => {
    const player = new Player();
    player.startRun('free', 'p220');
    player.supplyAmmo('opening');
    player.removeSupplyAmmo('flatNose');
    player.applyAmmoReward('mimic');
    player.upgradeAmmoCapacity();
    player.claimAttachment('highCapacityMagazine'); player.equipAttachment('highCapacityMagazine');
    player.addAmmo('opening'); player.fireRound({ ammoType: 'opening' });
    player.addAmmo('flatNose');
    player.endEncounter();
    expect(player.getBuild()).toEqual(createAmmoBuild({ opening: 2, flatNose: 1, mimic: 1 }));
    expect(player.getStock()).toEqual({ ...player.getBuild(), ball: 'infinite' });
    expect(player.magazine.size).toBe(0);
    expect(player.magazine.capacity).toBe(6);
    expect(player.getSpecialCapacity()).toBe(16);
    expect(player.getOwnedAttachments()).toEqual(['highCapacityMagazine']);
  });

  it.each(WEAPON_ORDER)('재시작은 %s와 모드를 유지하며 최초 배분으로 초기화한다', weapon => {
    const player = new Player();
    player.startRun('free', weapon);
    player.supplyAmmo('mimic'); player.claimAttachment('compensator');
    player.upgradeAmmoCapacity(); player.addAmmo('ball'); player.isAlive = false;
    player.reset();
    expect(player.gameMode).toBe('free');
    expect(player.weapon.id).toBe(weapon);
    expect(player.getBuild()).toEqual(createAmmoBuild(STARTING_AMMO_LOADOUTS[weapon]));
    expect(player.getStock()).toEqual({ ...player.getBuild(), ball: 'infinite' });
    expect(player.magazine.size).toBe(0);
    expect(player.getOwnedAttachments()).toEqual([]);
    expect(player.getSpecialCapacity()).toBe(14);
    expect(player.isAlive).toBe(true);
  });

  it('새 런의 모드·무기 변경은 보유·잔량·예약을 넘기지 않는다', () => {
    const player = new Player();
    player.startRun('free', 'p220'); player.addAmmo('opening');
    player.startRun('exploration', 'm500');
    expect(player.getBuild()).toEqual(createAmmoBuild({ lightLoad: 1, relay: 1 }));
    expect(player.magazine.size).toBe(0);
    player.supplyAmmo('highHeat'); player.addAmmo('highHeat');
    player.startRun('free', 'm1911');
    expect(player.getBuild()).toEqual(createAmmoBuild({ finisher: 1, wounding: 2 }));
    expect(player.getStock().highHeat).toBe(0);
    expect(player.magazine.size).toBe(0);
  });

  it('통합 프리 모드는 초기 지급과 수동 보급을 조우 종료 때 함께 복구한다', () => {
    const player = new Player();
    player.startRun('free', 'desertEagle'); player.supplyAmmo('plusP');
    player.addAmmo('plusP'); player.fireRound({ ammoType: 'plusP' });
    player.endEncounter();
    expect(player.getStock().plusP).toBe(2);
    player.startStage();
    expect(player.getStock().plusP).toBe(2);
    player.reset();
    expect(player.weapon.id).toBe('desertEagle');
    expect(player.getBuild()).toEqual(createAmmoBuild(STARTING_AMMO_LOADOUTS.desertEagle));
  });
  it('선택 전 빈 보유량은 재시작할 때 기본 무기의 최초 지급량으로 돌아간다', () => {
    const player = new Player();
    expect(player.getAvailable('ball')).toBe('infinite');
    expect(Object.values(player.getBuild()).every(count => count === 0)).toBe(true);
    player.supplyAmmo('laceration'); player.supplyAmmo('wounding');
    player.reset();
    expect(player.getBuild()).toEqual(createAmmoBuild(STARTING_AMMO_LOADOUTS.p220));
  });

  it('장착 부착물을 보유 목록에서 제거하면 용량과 장전 예약을 함께 갱신한다', () => {
    const player = new Player();
    player.claimAttachment('highCapacityMagazine'); player.equipAttachment('highCapacityMagazine');
    for (let i = 0; i < 6; i++) player.addAmmo('ball');
    expect(player.removeAttachment('highCapacityMagazine')).toBe(true);
    expect(player.getOwnedAttachments()).toEqual([]);
    expect(player.loadout.getSnapshot().magazine).toBeUndefined();
    expect(player.magazine.size).toBe(4);
    expect(player.removeAttachment('highCapacityMagazine')).toBe(false);
    expect(player.claimAttachment('highCapacityMagazine')).toBe(true);
  });
  it('대용량과 확장 탄창을 교체하면 추가 용량이 중첩되지 않고 초과 장전만 해제한다', () => {
    const player = new Player();
    player.supplyAmmo('wounding');
    player.claimAttachment('highCapacityMagazine'); player.claimAttachment('extendedMagazine');
    player.equipAttachment('highCapacityMagazine');
    for (let i = 0; i < 5; i++) player.addAmmo('ball');
    player.addAmmo('wounding');
    expect(player.magazine.capacity).toBe(6);
    expect(player.getAvailable('wounding')).toBe(0);
    expect(player.equipAttachment('extendedMagazine')).toBe('highCapacityMagazine');
    expect(player.magazine.capacity).toBe(5);
    expect(player.magazine.size).toBe(5);
    expect(player.getAvailable('wounding')).toBe(1);
    expect(player.getSpecialCapacity()).toBe(14);
    player.unequipAttachment('magazine');
    expect(player.magazine.capacity).toBe(4);
    expect(player.magazine.size).toBe(4);
  });
  it('수동 제거는 배분과 잔량을 줄이고 장전 예약과 무제한 탄약을 보호한다', () => {
    const player = new Player();
    for (let i = 0; i < 3; i++) player.supplyAmmo('wounding');
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
    for (let i = 0; i < 3; i++) player.supplyAmmo('wounding');
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
    expect(player.getSpecialCapacity()).toBe(20);
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
    for (let i = 0; i < 3; i++) { player.supplyAmmo('wounding'); player.supplyAmmo('laceration'); }
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
