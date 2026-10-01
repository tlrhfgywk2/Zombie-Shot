import { describe, expect, it } from 'vitest';
import { CombatResolver } from './CombatResolver';
import { weaponPayload, spinCylinder } from './WeaponTraits';
import { createPlayerCombatState, getEnabledAttachmentIds, getMagazineCapacity } from './AttachmentLoadout';
import { AMMO_DEFINITIONS, AMMO_ORDER } from '../data/ammoDefinitions';
import { WEAPON_DEFINITIONS, WEAPON_ORDER, type WeaponId } from '../data/weaponDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { Player } from '../entities/Player';
import type { AmmoType } from './types';
import { generateAttachmentReward } from '../progression/AttachmentRewards';

const resolver = new CombatResolver();
const target = (distance = 3) => ({ ...createEnemyState('normal'), hp: 1000, maxHp: 1000, distance });
const volley = (weaponId: WeaponId, rounds: readonly AmmoType[], boostedOpening = false) =>
  resolver.resolveSequence(rounds, target(), { weaponId, boostedOpening });
const families = ['ball', 'wounding', 'explosive', 'heavy'] as const;

describe('권총 공통 계산과 용량', () => {
  it.each(WEAPON_ORDER)('%s의 기본·최대 용량을 모든 용량 경로에서 지킨다', id => {
    const weapon = WEAPON_DEFINITIONS[id];
    const player = new Player(); player.selectWeapon(id);
    expect(player.weapon.id).toBe(id);
    expect(player.magazine.capacity).toBe(weapon.baseMagazineCapacity);
    player.magazine.setCapacity(100);
    expect(player.magazine.capacity).toBe(weapon.maximumMagazineCapacity);
    expect(getMagazineCapacity({ magazine: 'extendedMagazine' }, undefined, id)).toBe(weapon.maximumMagazineCapacity);
    expect(getMagazineCapacity({ magazine: 'extendedMagazine' }, { ...createPlayerCombatState(), disabledSlots: { magazine: 1 } }, id))
      .toBe(weapon.baseMagazineCapacity);
  });
  it.each(WEAPON_ORDER)('%s의 모든 탄약·거리·부착물 미리보기는 실제 사격 계산과 같다', weaponId => {
    for (const distance of [3, 7, 11]) for (const ammo of AMMO_ORDER) {
      const context = { weaponId, boostedOpening: true, loadout: { muzzle: 'muzzleBrake', optic: 'pistolScope', barrel: 'extendedBarrel' } as const };
      const result = resolver.resolveSequence(['plusP', ammo, 'lowRecoil', 'kickback'], target(distance), context);
      for (const [index, shot] of result.shots.entries()) {
        expect(result.roundPreviews[index]).toMatchObject({ effectiveFirepower: shot.breakdown.effectiveFirepower,
          finalFirepower: shot.breakdown.finalFirepower, wound: shot.woundApplied, effectiveActionShock: shot.actionShockApplied,
          recoil: shot.breakdown.recoilAfter, traitBonus: shot.breakdown.traitBonus });
      }
      const appended = resolver.previewAppendedAmmo(['plusP'], [ammo], target(distance), context)[ammo];
      expect(appended).toEqual(resolver.resolveSequence(['plusP', ammo], target(distance), context).roundPreviews[1]);
    }
  });
  it.each(WEAPON_ORDER)('%s의 거리 보정은 광학·이동·봉쇄 규칙을 사용한다', weaponId => {
    const range = WEAPON_DEFINITIONS[weaponId].rangePenaltyPercentages;
    const context = { weaponId, loadout: { optic: 'reflexSight' } as const };
    expect(resolver.resolveShot('advance', 0, target(5), context).breakdown.rangePenaltyPercent).toBe(0);
    const moved = resolver.resolveSequence(['retreat', 'ball'], target(7), context);
    expect(moved.shots.map(shot => shot.breakdown.rangePenaltyPercent)).toEqual([Math.max(0, range.mid - 10), range.far]);
    expect(resolver.resolveShot('ball', 0, target(11), { weaponId, loadout: { barrel: 'extendedBarrel', optic: 'pistolScope' } })
      .breakdown.rangePenaltyPercent).toBe(Math.max(0, range.far - 20));
    expect(resolver.resolveShot('ball', 0, target(), { weaponId, loadout: { optic: 'pistolScope' } })
      .breakdown.rangePenaltyPercent).toBe(10);
  });
});
describe('P220', () => {
  it('무제한 표준탄만 반동이 0이며 손잡이는 음수 반동을 만들지 않는다', () => {
    expect(volley('p220', ['ball', 'ball']).shots.map(shot => shot.breakdown.recoilGenerated)).toEqual([0, 0]);
    for (const ammo of AMMO_ORDER.filter(ammo => ammo !== 'ball'))
      expect(volley('p220', [ammo]).shots[0]!.breakdown.recoilGenerated).toBe(AMMO_DEFINITIONS[ammo].recoil);
    expect(resolver.resolveShot('ball', 0, target(), { weaponId: 'p220', loadout: { grip: 'texturedGrip' } }).breakdown.recoilAfter).toBe(0);
  });
});
describe('M1911 같은 계열 연속 효과', () => {
  it.each(families)('%s의 주효과만 0→+1→+1로 강화한다', ammo => {
    const result = volley('m1911', [ammo, ammo, ammo]);
    expect(result.shots.map(shot => shot.breakdown.traitBonus)).toEqual([0, 1, 1]);
    const key = AMMO_DEFINITIONS[ammo].primaryPayload;
    const base = weaponPayload(AMMO_DEFINITIONS[ammo], WEAPON_DEFINITIONS.m1911);
    expect(result.shots.map(shot => shot.breakdown.primaryPayloadValue)).toEqual([base[key], base[key] + 1, base[key] + 1]);
    expect(result.shots.map(shot => shot.breakdown.recoilGenerated)).toEqual(Array(3).fill(AMMO_DEFINITIONS[ammo].recoil));
  });
  it('계열 전환과 탄창 경계에서 초기화한다', () => {
    expect(volley('m1911', ['ball', 'wounding', 'wounding', 'ball', 'ball']).shots.map(shot => shot.breakdown.traitBonus))
      .toEqual([0, 0, 1, 0, 1]);
    expect(volley('m1911', ['ball']).shots[0]!.breakdown.traitBonus).toBe(0);
  });
  it('혼합 중량탄의 명시적 충격 주계열과 서로 다른 같은 계열 탄을 사용한다', () => {
    expect(AMMO_DEFINITIONS.heavy).toMatchObject({ family: 'IMPACT', primaryPayload: 'actionShock' });
    const shots = volley('m1911', ['flatNose', 'heavy', 'ball', 'plusP']).shots;
    expect(shots[1]).toMatchObject({ actionShockApplied: 3, breakdown: { effectiveFirepower: 2, traitBonus: 1 } });
    expect(shots[3]!.breakdown.primaryPayloadValue).toBe(8);
  });
  it('이동·취약 지속·후속 강화·기폭 배율을 증폭하지 않는다', () => {
    const shots = volley('m1911', ['advanceCutter', 'retreatCutter', 'explosive', 'explosive', 'heavy']).shots;
    expect(shots[1]!.movement).toBe(2);
    expect(shots[1]!.after.vulnerableTurns).toBe(2);
    expect(shots[4]!.breakdown.detonationDamage).toBe(10);
    expect(volley('m1911', ['relay', 'relay']).shots[1]!.breakdown.followUpBonus).toBe(4);
  });
});
describe('데저트 이글 지연 반동', () => {
  it('이번 고압탄은 기존 반동으로 계산하고 생성 반동은 후속 탄에 남긴다', () => {
    const shots = volley('desertEagle', ['plusP', 'plusP', 'plusP', 'ball']).shots;
    expect(shots.map(shot => shot.breakdown.recoilAfter)).toEqual([3, 6, 9, 10]);
    expect(shots.map(shot => shot.breakdown.recoilPenalty)).toEqual([0, 0, 2, 3]);
    expect(shots[1]!.breakdown.effectiveFirepower).toBe(9);
    expect(shots[2]!.breakdown.effectiveFirepower).toBe(7);
  });
  it('반동 감소·허용치 부착물과 봉쇄를 실제 계산에 적용한다', () => {
    const rounds: AmmoType[] = ['plusP', 'plusP', 'plusP'];
    expect(resolver.resolveSequence(rounds, target(), { weaponId: 'desertEagle', loadout: { grip: 'texturedGrip' } })
      .shots.map(shot => shot.breakdown.recoilPenalty)).toEqual([0, 0, 1]);
    expect(resolver.resolveSequence(rounds, target(), { weaponId: 'desertEagle', loadout: { muzzle: 'compensator' } })
      .shots[2]!.breakdown.recoilPenalty).toBe(1);
    expect(resolver.resolveSequence(rounds, target(), { weaponId: 'desertEagle', loadout: { muzzle: 'compensator' },
      playerState: { ...createPlayerCombatState(), disabledSlots: { muzzle: 1 } } }).shots[2]!.breakdown.recoilPenalty).toBe(2);
  });
  it('보정기와 손잡이를 함께 써도 고압탄 네 번째에는 반동 부담이 남는다', () => {
    const result = resolver.resolveSequence(['plusP', 'plusP', 'plusP', 'plusP'], target(), { weaponId: 'desertEagle', loadout: { muzzle: 'compensator', grip: 'texturedGrip' } });
    expect(result.shots[3]!.breakdown).toMatchObject({ recoilBefore: 6, recoilPenalty: 1 });
  });
  it('회복은 현재 탄부터, 전환은 기존 누적량을 읽은 뒤 소비하며 0반동도 기존 감점은 받는다', () => {
    const shots = volley('desertEagle', ['plusP', 'plusP', 'lowRecoil', 'kickback', 'ball']).shots;
    expect(shots[2]!.breakdown).toMatchObject({ recoilBefore: 6, recoilAfter: 4, recoilPenalty: 1 });
    expect(shots[3]!.breakdown).toMatchObject({ conditionalBonus: 4, recoilAfter: 0, recoilPenalty: 0 });
    expect(shots[4]!.breakdown.recoilPenalty).toBe(0);
    expect(volley('desertEagle', ['plusP', 'plusP', 'reducedImpact']).shots[2]!.breakdown.recoilPenalty).toBe(2);
  });
});
describe('M500 실린더', () => {
  it('확장 탄창은 장착·용량·보상·활성 효과 모든 경로에서 제외한다', () => {
    const player = new Player(); player.selectWeapon('m500'); player.claimAttachment('extendedMagazine');
    player.equipAttachment('extendedMagazine');
    expect(player.loadout.getSnapshot()).toEqual({});
    expect(player.magazine.capacity).toBe(4);
    expect(getEnabledAttachmentIds({ magazine: 'extendedMagazine' }, undefined, 'm500')).toEqual([]);
    expect(generateAttachmentReward([], 'm500', () => .4)).not.toBe('extendedMagazine');
  });
  it('순서 유지는 원본 그대로이며 회전은 다른 시작 칸으로 원형 순서만 이동한다', () => {
    const original: AmmoType[] = ['ball', 'wounding', 'explosive', 'heavy'];
    expect(volley('m500', original).shots.map(shot => shot.ammoType)).toEqual(original);
    expect(volley('m500', original).shots.map(shot => shot.breakdown.traitBonus)).toEqual([0, 0, 0, 0]);
    for (const [random, start] of [[0, 1], [.5, 2], [.999, 3]]) {
      const rotated = spinCylinder(original, () => random!);
      expect(rotated).toEqual([...original.slice(start), ...original.slice(0, start)]);
      expect(volley('m500', rotated, true).shots.map(shot => shot.ammoType)).toEqual(rotated);
    }
    expect(original).toEqual(['ball', 'wounding', 'explosive', 'heavy']);
    expect(spinCylinder(['ball'], () => .5)).toEqual(['ball']);
    expect(spinCylinder([], () => .5)).toEqual([]);
  });
  it.each(families)('%s의 시작 탄 주효과만 정확히 한 번 1.5배 반올림한다', ammo => {
    const base = weaponPayload(AMMO_DEFINITIONS[ammo], WEAPON_DEFINITIONS.m500);
    const key = AMMO_DEFINITIONS[ammo].primaryPayload;
    const result = volley('m500', [ammo, ammo], true);
    expect(result.shots[0]!.breakdown.primaryPayloadValue).toBe(Math.floor(base[key] * 1.5 + .5));
    expect(result.shots[1]!.breakdown.primaryPayloadValue).toBe(base[key]);
    expect(volley('m500', [ammo, ammo], true)).toEqual(result);
    expect(AMMO_DEFINITIONS[ammo][key]).toBe(base[key] - (key === 'firepower' ? 2 : 0));
  });
  it('발생 반동 +2는 원래 반동이 있는 탄에만 적용하고 감소 부착물 뒤 음수가 되지 않는다', () => {
    expect(volley('m500', ['ball', 'lowRecoil', 'reducedImpact']).shots.map(shot => shot.breakdown.recoilGenerated)).toEqual([3, 0, 0]);
    expect(resolver.resolveShot('plusP', 0, target(), { weaponId: 'm500', loadout: { muzzle: 'muzzleBrake', grip: 'texturedGrip' } }).breakdown.recoilGenerated).toBe(3);
  });
  it('이동·반동·기폭 배율·후속 강화·취약 시간을 증폭하지 않는다', () => {
    const advance = volley('m500', ['advance'], true).shots[0]!;
    expect(advance).toMatchObject({ movement: -2, breakdown: { recoilGenerated: 4, primaryPayloadValue: 12 } });
    const explosion = volley('m500', ['stickyCharge', 'flatNose'], true).shots;
    expect(explosion[0]!.explosiveApplied).toBe(6);
    expect(explosion[1]!.breakdown.detonationDamage).toBe(12);
    expect(volley('m500', ['relay', 'ball'], true).shots[1]!.breakdown.followUpBonus).toBe(4);
    expect(volley('m500', ['serrated'], true).shots[0]).toMatchObject({ woundApplied: 8, after: { vulnerableTurns: 2 } });
  });
  it('회전 배열 그대로 플레이어 탄약을 소비하고 미발사 탄은 재고를 소비하지 않는다', () => {
    const player = new Player(); player.selectWeapon('m500');
    player.addAmmo('ball'); player.addAmmo('wounding'); player.addAmmo('laceration'); player.addAmmo('ball');
    const rotated = spinCylinder(player.magazine.getRounds(), () => 0);
    player.magazine.setRounds(rotated);
    const result = resolver.resolveSequence(rotated, { ...target(), hp: 1 }, { weaponId: 'm500', boostedOpening: true });
    player.fireRound(result.shots[0]!);
    expect(player.getStock().wounding).toBe(2);
    expect(player.getStock().laceration).toBe(3);
    expect(player.magazine.getRounds()).toEqual(rotated.slice(1));
  });
});
