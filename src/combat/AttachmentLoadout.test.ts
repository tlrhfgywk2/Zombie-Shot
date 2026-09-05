import { describe, expect, it } from 'vitest';
import { AttachmentLoadout, createPlayerCombatState, getEnabledAttachmentIds, getMagazineCapacity } from './AttachmentLoadout';

describe('AttachmentLoadout', () => {
  it('슬롯마다 하나만 장착하고 교체 항목을 반환한다', () => {
    const loadout = new AttachmentLoadout();
    expect(loadout.getSnapshot()).toEqual({});
    expect(loadout.equip('compactCompensator')).toBeUndefined();
    expect(loadout.getSnapshot().muzzle).toBe('compactCompensator');
    expect(loadout.equip('dualPortCompensator')).toBe('compactCompensator');
    expect(loadout.getSnapshot().muzzle).toBe('dualPortCompensator');
  });

  it('장착 해제와 재장착을 지원한다', () => {
    const loadout = new AttachmentLoadout();
    loadout.equip('highVisibilitySight');
    expect(loadout.unequip('optic')).toBe('highVisibilitySight');
    expect(loadout.getSnapshot().optic).toBeUndefined();
    expect(loadout.equip('compactReflexSight')).toBeUndefined();
    expect(loadout.getSnapshot().optic).toBe('compactReflexSight');
  });

  it('탄창 장착물의 용량 변경을 4~6발 범위에 반영한다', () => {
    expect(getMagazineCapacity({ magazine: 'extendedBasePad' })).toBe(5);
    expect(getMagazineCapacity({ magazine: 'extendedMagazine' })).toBe(6);
    expect(getMagazineCapacity({})).toBe(4);
  });

  it('봉쇄된 슬롯의 장착물과 용량 보너스를 제외한다', () => {
    const state = createPlayerCombatState();
    state.disabledSlots.magazine = 2;
    const loadout = { muzzle: 'compactCompensator', magazine: 'extendedBasePad' } as const;
    expect(getEnabledAttachmentIds(loadout, state)).toEqual(['compactCompensator']);
    expect(getMagazineCapacity(loadout, state)).toBe(4);
  });
});
