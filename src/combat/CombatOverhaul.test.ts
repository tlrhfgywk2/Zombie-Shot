import { describe, expect, it } from 'vitest';
import { CombatResolver, getActionShockThreshold, isVulnerable } from './CombatResolver';
import { createPlayerCombatState } from './AttachmentLoadout';
import { createEnemyState, ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import { AMMO_DEFINITIONS, AMMO_ORDER } from '../data/ammoDefinitions';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_ORDER } from '../data/attachmentDefinitions';
import { generateAmmoRewards } from '../progression/AmmoRewards';
import { generateAttachmentReward } from '../progression/AttachmentRewards';
import { Player } from '../entities/Player';
import type { AmmoType, EnemyState } from './types';

const resolver = new CombatResolver();
const target = (hp = 100, distance = 3): EnemyState => ({ ...createEnemyState('normal'), hp, maxHp: hp, distance });
const damage = (ammo: AmmoType, enemy = target(), loadout = {}) => resolver.resolveShot(ammo, 0, enemy, { loadout }).hpDamage;

describe('새 탄약과 전투 상태', () => {
  it('방어구 필드·계산 경로 없이 체력과 상처를 분리한다', () => {
    const enemy = { ...createEnemyState('brute'), distance: 3 };
    expect(enemy).not.toHaveProperty('armor');
    expect(ENEMY_DEFINITIONS.brute).not.toHaveProperty('armor');
    expect(resolver.resolveShot('ball', 0, enemy).hpDamage).toBe(5);
    const wound = resolver.resolveShot('wounding', 0, enemy);
    expect(wound).toMatchObject({ hpDamage: 2, woundApplied: 3, after: { wound: 3 } });
    expect(wound.after).not.toHaveProperty('armor');
    expect(wound.breakdown).not.toHaveProperty('armorBroken');
  });
  it('상처는 적 행동 뒤에도 남고, 새 적에서는 0부터 시작한다', () => {
    const wounded = resolver.resolveShot('wounding', 0, target()).after;
    expect(isVulnerable(wounded)).toBe(true);
    expect(resolver.resolveEnemyAction(wounded).after.wound).toBe(3);
    expect(createEnemyState('normal').wound).toBe(0);
  });
  it('열상탄은 그 탄 이전 상처만 읽고 준비 없이는 볼탄보다 약하다', () => {
    expect(damage('laceration')).toBe(2);
    const sequence = resolver.resolveSequence(['wounding', 'laceration', 'laceration'], target());
    expect(sequence.shots.map(shot => shot.hpDamage)).toEqual([2, 5, 5]);
    expect(sequence.finalState.wound).toBe(3);
    expect(resolver.resolveSequence(['wounding', 'wounding', 'laceration'], target()).shots[2]?.hpDamage).toBe(8);
  });
  it('릴레이는 바로 다음 한 발만 강화하며 연속 릴레이는 덮어써 이어 간다', () => {
    expect(resolver.resolveSequence(['relay', 'ball', 'ball'], target()).shots.map(s => s.breakdown.followUpBonus)).toEqual([0, 4, 0]);
    expect(resolver.resolveSequence(['relay', 'relay', 'ball'], target()).shots.map(s => s.breakdown.followUpBonus)).toEqual([0, 4, 4]);
    expect(damage('relay')).toBeLessThan(damage('ball'));
  });
  it('반동 전환탄은 누적 반동을 피해로 바꾸고 모두 소비한다', () => {
    const sequence = resolver.resolveSequence(['plusP', 'plusP', 'kickback', 'ball'], target());
    expect(sequence.shots[2]).toMatchObject({ hpDamage: 8, breakdown: { recoilBefore: 6, recoilAfter: 0, conditionalBonus: 6 } });
    expect(sequence.shots[3]?.breakdown.recoilPenalty).toBe(0);
    expect(damage('kickback')).toBe(2);
  });
  it('저반동탄은 피해를 지불하고 누적 반동을 회복한다', () => {
    const sequence = resolver.resolveSequence(['plusP', 'plusP', 'lowRecoil', 'ball'], target());
    expect(sequence.shots[2]?.breakdown.recoilAfter).toBe(4);
    expect(sequence.shots[3]?.breakdown.recoilPenalty).toBe(1);
    expect(resolver.resolveSequence(['plusP', 'plusP', 'ball', 'ball'], target()).shots[3]?.breakdown.recoilPenalty).toBe(4);
  });
  it('취약은 상처에서 파생되고, 제압은 기존 충격 중단 조건을 사용한다', () => {
    const enemy = target();
    expect(damage('frangible', enemy)).toBe(4);
    expect(damage('frangible', { ...enemy, wound: 1 })).toBe(6);
    expect(damage('suppression', enemy)).toBe(3);
    expect(damage('suppression', { ...enemy, actionShock: getActionShockThreshold(enemy) })).toBe(6);
  });
  it('할로 포인트와 처형탄은 서로 다른 체력 조건을 사용한다', () => {
    expect(damage('hollowPoint', target(100))).toBe(6);
    expect(damage('hollowPoint', target(9))).toBe(3);
    expect(damage('execution', { ...target(100), hp: 31 })).toBe(3);
    expect(damage('execution', { ...target(100), hp: 30 })).toBe(7);
  });
  it('충격탄은 기존 행동 충격에 더하며 처치 뒤 불필요한 충격은 쌓지 않는다', () => {
    const sequence = resolver.resolveSequence(['flatNose', 'heavy'], target());
    expect(sequence.finalState.actionShock).toBe(6);
    expect(resolver.resolveEnemyAction(sequence.finalState)).toMatchObject({ interrupted: true, shockConsumed: 4, shockRemaining: 2 });
    expect(resolver.resolveShot('flatNose', 0, target(1)).actionShockApplied).toBe(0);
  });
  it('전진은 사격 전, 후퇴는 사격 후 거리와 화력에 반영한다', () => {
    const fromFive = target(100, 5);
    const advance = resolver.resolveShot('advance', 0, fromFive);
    expect(advance).toMatchObject({ shotDistance: 3, movement: -2, hpDamage: 6, after: { distance: 3 } });
    const retreat = resolver.resolveShot('retreat', 0, fromFive);
    expect(retreat).toMatchObject({ shotDistance: 5, movement: 2, after: { distance: 7 } });
    expect(resolver.resolveSequence(['retreat', 'ball'], fromFive).shots[1]?.shotDistance).toBe(7);
    expect(resolver.resolveSequence(['advanceCutter', 'laceration'], fromFive).shots[1]?.shotDistance).toBe(3);
  });
  it('거리 경계를 넘지 않으며 컷터도 같은 이동 순서를 따른다', () => {
    expect(resolver.resolveShot('advanceCutter', 0, target(100, 1)).after.distance).toBe(0);
    expect(resolver.resolveShot('retreatCutter', 0, target(100, 11)).after.distance).toBe(12);
    expect(resolver.resolveShot('retreatCutter', 0, target(100, 11)).shotDistance).toBe(11);
  });
});

describe('최종 부착물과 런 진행', () => {
  it('확장 탄창과 휴대 용량 강화는 각각 별개 값을 바꾸며 런 종료 시 초기화된다', () => {
    const player = new Player();
    expect(player.magazine.capacity).toBe(4);
    expect(player.getSpecialCapacity()).toBe(14);
    player.claimAttachment('extendedMagazine'); player.equipAttachment('extendedMagazine');
    expect(player.magazine.capacity).toBe(6);
    expect(player.getSpecialCapacity()).toBe(14);
    player.upgradeAmmoCapacity();
    expect(player.getSpecialCapacity()).toBe(16);
    expect(player.magazine.capacity).toBe(6);
    player.unequipAttachment('magazine');
    expect(player.getSpecialCapacity()).toBe(16);
    player.reset();
    expect(player.getSpecialCapacity()).toBe(14);
  });
  it('중거리 반사 조준기와 근거리 손해가 있는 권총 조준경은 거리별로 구분된다', () => {
    const mid = target(100, 7), near = target(), far = target(100, 11);
    expect(damage('plusP', mid, { optic: 'reflexSight' })).toBeGreaterThan(damage('plusP', mid));
    expect(damage('plusP', mid, { optic: 'pistolScope' })).toBe(8);
    expect(damage('plusP', near, { optic: 'pistolScope' })).toBeLessThan(damage('plusP', near));
    expect(damage('plusP', far, { optic: 'pistolScope' })).toBeGreaterThan(damage('plusP', far));
    expect(damage('plusP', far, { barrel: 'extendedBarrel' })).toBeGreaterThan(damage('plusP', far));
  });
  it('레이저는 취약 효과, 조명은 근거리 충격, 결합형은 각 효과가 약하다', () => {
    const wounded = { ...target(), wound: 3 };
    expect(damage('frangible', wounded, { rail: 'laserSight' })).toBe(8);
    expect(damage('frangible', wounded, { rail: 'laserLightModule' })).toBe(7);
    const impact = (rail: 'tacticalLight' | 'laserLightModule') =>
      resolver.resolveShot('flatNose', 0, target(), { loadout: { rail } }).actionShockApplied;
    expect(impact('tacticalLight')).toBe(6);
    expect(impact('laserLightModule')).toBe(5);
    expect(resolver.resolveShot('flatNose', 0, target(100, 7), { loadout: { rail: 'tacticalLight' } }).actionShockApplied).toBe(4);
    expect(resolver.resolveShot('flatNose', 0, target(), { loadout: { rail: 'tacticalLight' },
      playerState: { ...createPlayerCombatState(), rangePenaltySteps: 1 } }).actionShockApplied).toBe(6);
  });
  it('보정기·제퇴기·손잡이는 서로 다른 반동 역할을 갖는다', () => {
    const rounds: AmmoType[] = ['plusP', 'plusP', 'ball'];
    const base = resolver.resolveSequence(rounds, target()).shots[2]!;
    const compensator = resolver.resolveSequence(rounds, target(), { loadout: { muzzle: 'compensator' } }).shots[2]!;
    const brake = resolver.resolveSequence(rounds, target(), { loadout: { muzzle: 'muzzleBrake' } }).shots[2]!;
    expect(compensator.breakdown.recoilGenerated).toBe(base.breakdown.recoilGenerated);
    expect(compensator.breakdown.recoilPenalty).toBeLessThan(base.breakdown.recoilPenalty);
    expect(brake.breakdown.recoilBefore).toBe(4);
    expect(resolver.resolveSequence(['ball', 'ball'], target(), { loadout: { grip: 'texturedGrip' } }).shots[1]?.breakdown.recoilBefore).toBe(0);
  });
  it('인체공학 손잡이는 릴레이 후속 효과만 키운다', () => {
    const base = resolver.resolveSequence(['relay', 'ball'], target()).shots[1]!.hpDamage;
    const boosted = resolver.resolveSequence(['relay', 'ball'], target(), { loadout: { grip: 'ergonomicGrip' } }).shots[1]!.hpDamage;
    expect(boosted).toBe(base + 1);
    expect(damage('ball', target(), { grip: 'ergonomicGrip' })).toBe(5);
  });
});

describe('데이터와 완성 탄창', () => {
  it('최종 18종 탄약과 11종 부착물만 정의·보상에 포함한다', () => {
    expect(AMMO_ORDER).toHaveLength(18);
    expect(ATTACHMENT_ORDER).toHaveLength(11);
    expect(new Set(AMMO_ORDER)).toEqual(new Set(Object.keys(AMMO_DEFINITIONS)));
    expect(new Set(ATTACHMENT_ORDER)).toEqual(new Set(Object.keys(ATTACHMENT_DEFINITIONS)));
    const excluded = ['matchBarrel', 'threadedBarrel', 'heavyBarrel', 'flashSuppressor', 'linearCompensator',
      'suppressor', 'extraPowerSpringMagazine', 'lightweightMagazine', 'microRedDot', 'adjustableIronSight',
      'infraredAimingModule', 'laserRangefinder', 'rubberGrip', 'slimGrip', 'spareMagazineCarrier',
      'armorPiercing', 'standard', 'incendiary', 'wadcutter', 'bonded', 'match'];
    for (const id of excluded) {
      expect(AMMO_ORDER).not.toContain(id);
      expect(ATTACHMENT_ORDER).not.toContain(id);
    }
    for (const [index, ammo] of AMMO_ORDER.filter(value => value !== 'ball').entries()) {
      expect(generateAmmoRewards(() => index / 17)).toContain(ammo);
    }
    expect(ATTACHMENT_ORDER.every(id => generateAttachmentReward(ATTACHMENT_ORDER.filter(other => other !== id), 'service45', () => 0) === id)).toBe(true);
  });
  it('구 저장 ID를 보상·소유·장전으로 되살리지 않는다', () => {
    const player = new Player();
    expect(player.addAmmo('armorPiercing' as AmmoType)).toBe(false);
    expect(player.claimAttachment('rubberGrip' as keyof typeof ATTACHMENT_DEFINITIONS)).toBe(false);
    expect(player.applyAmmoReward('match' as keyof ReturnType<Player['getBuild']>)).toBe(false);
  });
  it('상처→열상, 충격→제압, 전진→후속 탄은 반대 순서와 결과가 다르다', () => {
    const enemy = target(100, 5);
    expect(resolver.resolveSequence(['wounding', 'laceration'], enemy).totalHpDamage)
      .toBeGreaterThan(resolver.resolveSequence(['laceration', 'wounding'], enemy).totalHpDamage);
    expect(resolver.resolveSequence(['flatNose', 'suppression'], enemy).totalHpDamage)
      .toBeGreaterThan(resolver.resolveSequence(['suppression', 'flatNose'], enemy).totalHpDamage);
    expect(resolver.resolveSequence(['advance', 'plusP'], enemy).totalHpDamage)
      .toBeGreaterThan(resolver.resolveSequence(['plusP', 'advance'], enemy).totalHpDamage);
  });
  it('처치 뒤 탄은 미발사로 반환되며 장전 전체 프리뷰는 유지한다', () => {
    const sequence = resolver.resolveSequence(['plusP', 'ball', 'wounding'], target(4));
    expect(sequence.shots).toHaveLength(1);
    expect(sequence.unfiredRounds).toEqual(['ball', 'wounding']);
    expect(sequence.roundPreviews).toHaveLength(3);
  });
});
