import { describe, expect, it } from 'vitest';
import { AttachmentLoadout, createPlayerCombatState, getEnabledAttachmentIds, getMagazineCapacity } from './AttachmentLoadout';

describe('AttachmentLoadout', () => {
  it('슬롯마다 하나만 장착하고 교체 항목을 반환한다', () => {
    const loadout = new AttachmentLoadout();
    expect(loadout.equip('quietBore')).toBe('returnBrake');
    expect(loadout.getSnapshot().muzzle).toBe('quietBore');
    expect(loadout.equip('elementCatalyst')).toBe('quietBore');
    expect(loadout.getSnapshot().muzzle).toBe('elementCatalyst');
  });

  it('장착 해제와 재장착을 지원한다', () => {
    const loadout = new AttachmentLoadout();
    expect(loadout.unequip('optic')).toBe('reflexSight');
    expect(loadout.getSnapshot().optic).toBeUndefined();
    expect(loadout.equip('rangeSight')).toBeUndefined();
    expect(loadout.getSnapshot().optic).toBe('rangeSight');
  });

  it('탄창 장착물의 용량 변경을 3~5발 범위에 반영한다', () => {
    expect(getMagazineCapacity({ magazine: 'extendedFeed' })).toBe(5);
    expect(getMagazineCapacity({ magazine: 'reserveFeed' })).toBe(3);
    expect(getMagazineCapacity({ magazine: 'crossFeed' })).toBe(4);
  });

  it('봉쇄된 슬롯의 장착물과 용량 보너스를 제외한다', () => {
    const state = createPlayerCombatState();
    state.disabledSlots.magazine = 2;
    const loadout = { muzzle: 'quietBore', magazine: 'extendedFeed' } as const;
    expect(getEnabledAttachmentIds(loadout, state)).toEqual(['quietBore']);
    expect(getMagazineCapacity(loadout, state)).toBe(4);
  });
});
