import { ATTACHMENT_DEFINITIONS, ATTACHMENT_SLOT_ORDER, DEFAULT_LOADOUT, isAttachmentCompatible, type WeaponId, type AttachmentId, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { COMBAT_BALANCE } from '../data/ammoDefinitions';
import type { AttachmentSlot, PlayerCombatState } from './types';

export const createPlayerCombatState = (): PlayerCombatState => ({ accuracyPenalty: 0, accuracyPenaltyTurns: 0, rangePenaltySteps: 0, rangePenaltyTurns: 0, disabledSlots: {} });

export const getEnabledAttachmentIds = (loadout: LoadoutSnapshot, playerState: PlayerCombatState = createPlayerCombatState()): AttachmentId[] => ATTACHMENT_SLOT_ORDER.flatMap((slot) => {
  const id = loadout[slot];
  return id && isAttachmentCompatible(id, 'service45', slot) && !playerState.disabledSlots[slot] ? [id] : [];
});

export const getMagazineCapacity = (loadout: LoadoutSnapshot, playerState: PlayerCombatState = createPlayerCombatState()): number => {
  const bonus = getEnabledAttachmentIds(loadout, playerState).flatMap((id) => ATTACHMENT_DEFINITIONS[id].modifiers).filter((modifier) => modifier.kind === 'capacity').reduce((sum, modifier) => sum + modifier.value, 0);
  return Math.max(COMBAT_BALANCE.minimumMagazineCapacity, Math.min(COMBAT_BALANCE.maximumMagazineCapacity, COMBAT_BALANCE.baseMagazineCapacity + bonus));
};

export class AttachmentLoadout {
  constructor(readonly weapon: WeaponId = 'service45') {}
  private equipped: LoadoutSnapshot = { ...DEFAULT_LOADOUT };
  getSnapshot(): LoadoutSnapshot { return { ...this.equipped }; }
  equip(id: AttachmentId): AttachmentId | undefined { if (!isAttachmentCompatible(id, this.weapon)) return undefined; const definition = ATTACHMENT_DEFINITIONS[id]; const replaced = this.equipped[definition.slot]; this.equipped[definition.slot] = id; return replaced; }
  unequip(slot: AttachmentSlot): AttachmentId | undefined { const removed = this.equipped[slot]; delete this.equipped[slot]; return removed; }
  reset(): void { this.equipped = { ...DEFAULT_LOADOUT }; }
}
