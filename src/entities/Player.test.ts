import { describe, expect, it } from 'vitest';
import { CombatResolver } from '../combat/CombatResolver';
import { AMMO_BUILD_BALANCE, countAllocations } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { Player } from './Player';

describe('런 배분과 스테이지 잔량', () => {
  it('시작 배분은 확장 3, 철갑 3이며 표준은 명시적 무한이다', () => {
    const player = new Player();
    expect(player.getStock().standard).toBe('infinite');
    expect(player.getBuild().hollowPoint).toBe(3);
    expect(player.getBuild().armorPiercing).toBe(3);
    expect(countAllocations(player.getBuild())).toBe(player.getSpecialCapacity());
    expect(player.addAmmo('match')).toBe(false);
    expect(player.addAmmo('incendiary')).toBe(false);
  });
  it('장전/제거/교체는 예약만 변경하고 발사 시에만 잔량을 차감한다', () => {
    const player = new Player();
    player.addAmmo('hollowPoint');
    expect(player.getStock().hollowPoint).toBe(3);
    expect(player.getAvailable('hollowPoint')).toBe(2);
    player.replaceAmmo(0, 'armorPiercing');
    expect(player.getStock().hollowPoint).toBe(3);
    expect(player.getAvailable('hollowPoint')).toBe(3);
    player.removeAmmo(0);
    expect(player.getAvailable('armorPiercing')).toBe(3);
    player.addAmmo('hollowPoint');
    player.fireRound({ ammoType: 'hollowPoint', conserved: false });
    expect(player.getStock().hollowPoint).toBe(2);
    expect(player.getBuild().hollowPoint).toBe(3);
  });
  it('미발사탄은 적 사망 후에도 소비되지 않는다', () => {
    const player = new Player();
    player.addAmmo('standard'); player.addAmmo('hollowPoint');
    const result = new CombatResolver().resolveSequence(player.magazine.getRounds(), { ...createEnemyState('normal'), hp: 1 });
    result.shots.forEach(shot => player.fireRound(shot));
    player.magazine.clear();
    expect(result.unfiredRounds).toEqual(['hollowPoint']);
    expect(player.getStock().hollowPoint).toBe(3);
    expect(player.getStock().standard).toBe('infinite');
  });
  it('남은 탄을 중복 예약할 수 없고 잔량 0이면 선택할 수 없다', () => {
    const player = new Player();
    for (let i = 0; i < 3; i += 1) expect(player.addAmmo('armorPiercing')).toBe(true);
    expect(player.addAmmo('armorPiercing')).toBe(false);
    for (let i = 0; i < 3; i += 1) player.fireRound({ ammoType: 'armorPiercing', conserved: false });
    expect(player.getStock().armorPiercing).toBe(0);
    expect(player.addAmmo('armorPiercing')).toBe(false);
    expect(player.replaceAmmo(0, 'armorPiercing')).toBe(false);
    expect(() => player.fireRound({ ammoType: 'armorPiercing', conserved: false })).toThrow();
  });
  it('적/턴 사이에는 유지하고 다음 스테이지에서만 배분만큼 회복한다', () => {
    const player = new Player();
    player.addAmmo('hollowPoint'); player.fireRound({ ammoType: 'hollowPoint', conserved: false });
    player.clearCombatDisruptions();
    player.applyCombatState(player.getCombatState());
    expect(player.getStock().hollowPoint).toBe(2);
    player.startStage();
    expect(player.getStock().hollowPoint).toBe(3);
  });
  it('표준탄은 반복 발사해도 줄지 않고 특수 용량을 쓰지 않는다', () => {
    const player = new Player();
    for (let i = 0; i < 100; i += 1) {
      expect(player.addAmmo('standard')).toBe(true);
      player.fireRound({ ammoType: 'standard', conserved: false });
    }
    expect(player.getStock().standard).toBe('infinite');
    expect(countAllocations(player.getBuild())).toBe(6);
  });
  it('용량 축소 시 초과 장전 예약을 풀고 잔량을 보존한다', () => {
    const player = new Player();
    player.equipAttachment('extendedFeed');
    for (let i = 0; i < 3; i += 1) player.addAmmo('standard');
    player.addAmmo('hollowPoint'); player.addAmmo('armorPiercing');
    player.equipAttachment('reserveFeed');
    expect(player.magazine.size).toBe(3);
    expect(player.getAvailable('hollowPoint')).toBe(3);
    expect(player.getAvailable('armorPiercing')).toBe(3);
  });
  it('가득 찬 배분은 명시적인 교체를 요구하고 실패 시 그대로 유지한다', () => {
    const player = new Player();
    const before = player.getBuild();
    expect(player.applyAmmoReward('match')).toBe(false);
    expect(player.applyAmmoReward('match', ['subsonic'])).toBe(false);
    expect(player.getBuild()).toEqual(before);
    expect(player.applyAmmoReward('match', ['armorPiercing'])).toBe(true);
    expect(player.getBuild().match).toBe(1);
    expect(player.getBuild().armorPiercing).toBe(2);
    expect(player.getStock().match).toBe(0);
    player.startStage();
    expect(player.getStock().match).toBe(1);
    expect(player.getStock().armorPiercing).toBe(2);
  });
  it('소유 탄종 집중과 용량 증가 후 추가 배분이 가능하다', () => {
    const player = new Player();
    expect(player.applyAmmoReward('hollowPoint', ['armorPiercing'])).toBe(true);
    expect(player.getBuild().hollowPoint).toBe(4);
    expect(player.setSpecialCapacity(7)).toBe(true);
    expect(player.applyAmmoReward('match')).toBe(true);
    expect(countAllocations(player.getBuild())).toBe(7);
    expect(player.setSpecialCapacity(6)).toBe(false);
  });
  it('탄종별 보상량을 변경해도 필요한 교체 수를 원자적으로 검증한다', () => {
    const player = new Player();
    AMMO_BUILD_BALANCE.rewardAmounts.match = 2;
    try {
      expect(player.applyAmmoReward('match', ['armorPiercing'])).toBe(false);
      expect(player.applyAmmoReward('match', ['armorPiercing', 'armorPiercing'])).toBe(true);
      expect(player.getBuild().match).toBe(2);
      expect(countAllocations(player.getBuild())).toBe(6);
    } finally { delete AMMO_BUILD_BALANCE.rewardAmounts.match; }
  });
  it('초기화는 새로운 런 배분과 잔량을 복원한다', () => {
    const player = new Player();
    player.applyAmmoReward('match', ['armorPiercing']); player.startStage(); player.addAmmo('match');
    player.reset();
    expect(player.getBuild().match).toBe(0);
    expect(player.getStock().armorPiercing).toBe(3);
    expect(player.magazine.size).toBe(0);
  });
});
