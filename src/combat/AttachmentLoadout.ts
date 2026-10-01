import { ATTACHMENT_DEFINITIONS, ATTACHMENT_SLOT_ORDER, DEFAULT_LOADOUT, isAttachmentCompatible, type WeaponId, type AttachmentId, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { WEAPON_DEFINITIONS } from '../data/weaponDefinitions';
import type { AttachmentSlot, PlayerCombatState } from './types';

export const createPlayerCombatState = (): PlayerCombatState => ({ heavyKickPenaltyBonus: 0, heavyKickPenaltyTurns: 0, rangePenaltySteps: 0, rangePenaltyTurns: 0, disabledSlots: {} });

export const getEnabledAttachmentIds = (loadout: LoadoutSnapshot, playerState: PlayerCombatState = createPlayerCombatState(), weapon: WeaponId = 'p220'): AttachmentId[] => ATTACHMENT_SLOT_ORDER.flatMap((slot) => {
  const id = loadout[slot];
  return id && Object.hasOwn(ATTACHMENT_DEFINITIONS, id) && isAttachmentCompatible(id, weapon, slot) && !playerState.disabledSlots[slot] ? [id] : [];
});

export const getMagazineCapacity = (loadout: LoadoutSnapshot, playerState: PlayerCombatState = createPlayerCombatState(), weapon: WeaponId = 'p220'): number => {
  const bonus = getEnabledAttachmentIds(loadout, playerState, weapon).flatMap((id) => ATTACHMENT_DEFINITIONS[id].modifiers).filter((modifier) => modifier.kind === 'capacity').reduce((sum, modifier) => sum + modifier.value, 0);
  const definition = WEAPON_DEFINITIONS[weapon];
  return Math.min(definition.maximumMagazineCapacity, definition.baseMagazineCapacity + bonus);
};

export class AttachmentLoadout {
  constructor(public weapon: WeaponId = 'p220') {}
  private equipped: LoadoutSnapshot = { ...DEFAULT_LOADOUT };
  getSnapshot(): LoadoutSnapshot { return { ...this.equipped }; }
  equip(id: AttachmentId): AttachmentId | undefined { if (!isAttachmentCompatible(id, this.weapon)) return undefined; const definition = ATTACHMENT_DEFINITIONS[id]; const replaced = this.equipped[definition.slot]; this.equipped[definition.slot] = id; return replaced; }
  unequip(slot: AttachmentSlot): AttachmentId | undefined { const removed = this.equipped[slot]; delete this.equipped[slot]; return removed; }
  reset(): void { this.equipped = { ...DEFAULT_LOADOUT }; }
}
