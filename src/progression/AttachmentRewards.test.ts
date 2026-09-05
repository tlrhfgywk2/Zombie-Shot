import { describe, expect, it } from 'vitest';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_ORDER, ATTACHMENT_RARITIES, ATTACHMENT_REWARD_WEIGHTS, ATTACHMENT_SLOT_ORDER, type AttachmentId } from '../data/attachmentDefinitions';
import { Player } from '../entities/Player';
import { generateAttachmentReward } from './AttachmentRewards';

describe('서비스 .45 런 부착물 보상', () => {
  it('5개 슬롯에 일반/고급 10종만 제공하고 미래 등급을 유지한다', () => {
    expect(ATTACHMENT_RARITIES).toEqual(['common', 'advanced', 'rare', 'epic']);
    expect(ATTACHMENT_REWARD_WEIGHTS).toEqual({ common: 70, advanced: 30, rare: 0, epic: 0 });
    expect(ATTACHMENT_ORDER).toHaveLength(10);
    for (const slot of ATTACHMENT_SLOT_ORDER) {
      expect(ATTACHMENT_ORDER.filter(id => ATTACHMENT_DEFINITIONS[id].slot === slot).map(id => ATTACHMENT_DEFINITIONS[id].rarity).sort()).toEqual(['advanced', 'common']);
    }
  });
  it('등급 추첨은 70:30이고 경계값 0.7부터 고급이다', () => {
    for (const [roll, rarity] of [[0, 'common'], [0.69999, 'common'], [0.7, 'advanced'], [0.99999, 'advanced']] as const) {
      expect(ATTACHMENT_DEFINITIONS[generateAttachmentReward([], 'service45', () => roll)!].rarity).toBe(rarity);
    }
    const samples = Array.from({ length: 1000 }, (_, i) => ATTACHMENT_DEFINITIONS[generateAttachmentReward([], 'service45', () => i / 1000)!].rarity);
    expect(samples.filter(rarity => rarity === 'common')).toHaveLength(700);
  });
  it('뽑힌 등급이 소진되면 다른 등급으로 대체하고 열한 번째 보상은 중복을 주지 않는다', () => {
    for (const roll of [0, 0.99]) {
      const owned: AttachmentId[] = [];
      for (let i = 0; i < 10; i += 1) {
        const reward = generateAttachmentReward(owned, 'service45', () => roll)!;
        expect(reward).toBeDefined(); expect(owned).not.toContain(reward); owned.push(reward);
      }
      expect(generateAttachmentReward(owned)).toBeUndefined();
    }
    expect(generateAttachmentReward([], 'service45', () => 0.9, { common: 0, advanced: 0, rare: 100, epic: 0 })).toBeDefined();
  });
  it('새 런은 비어 있고 미소유 장착을 거부하며 교체/해제/구간 이동은 소유권을 유지한다', () => {
    const player = new Player();
    expect(player.getOwnedAttachments()).toEqual([]);
    player.equipAttachment('compactCompensator');
    expect(player.loadout.getSnapshot()).toEqual({});
    expect(player.claimAttachment('compactCompensator')).toBe(true);
    expect(player.claimAttachment('compactCompensator')).toBe(false);
    player.claimAttachment('dualPortCompensator');
    player.equipAttachment('compactCompensator');
    expect(player.equipAttachment('dualPortCompensator')).toBe('compactCompensator');
    expect(player.unequipAttachment('muzzle')).toBe('dualPortCompensator');
    player.startStage();
    expect(player.getOwnedAttachments()).toEqual(['compactCompensator', 'dualPortCompensator']);
    player.reset();
    expect(player.getOwnedAttachments()).toEqual([]);
    expect(player.loadout.getSnapshot()).toEqual({});
  });
  it('탄창은 4/5/6발이고 휴대 용량·배분·잔량은 바뀌지 않는다', () => {
    const player = new Player();
    const stock = player.getStock(), build = player.getBuild(), carry = player.getSpecialCapacity();
    expect(player.magazine.capacity).toBe(4);
    for (const [id, capacity] of [['extendedBasePad', 5], ['extendedMagazine', 6]] as const) {
      player.claimAttachment(id); player.equipAttachment(id);
      expect(player.magazine.capacity).toBe(capacity);
      expect(player.getSpecialCapacity()).toBe(carry);
      expect(player.getBuild()).toEqual(build); expect(player.getStock()).toEqual(stock);
    }
    player.magazine.setCapacity(100);
    expect(player.magazine.capacity).toBe(6);
    player.unequipAttachment('magazine');
    expect(player.magazine.capacity).toBe(4);
  });
});
