import { Magazine } from '../combat/Magazine';
import { AttachmentLoadout, createPlayerCombatState, getMagazineCapacity } from '../combat/AttachmentLoadout';
import type { AmmoType, AttachmentSlot, PlayerCombatState, ShotResult } from '../combat/types';
import type { AttachmentId } from '../data/attachmentDefinitions';
import { AMMO_BUILD_BALANCE, AMMO_ORDER, countAllocations, createAmmoBuild, createStageStock, rewardAmount, type AmmoBuild, type AmmoStock, type SpecialAmmoType } from '../data/ammoDefinitions';

export class Player {
  readonly magazine = new Magazine();
  readonly loadout = new AttachmentLoadout();
  isAlive = true;
  private build = createAmmoBuild();
  private stock = createStageStock(this.build);
  private specialCapacity: number = AMMO_BUILD_BALANCE.specialCapacity;
  private combatState: PlayerCombatState = createPlayerCombatState();

  constructor() { this.syncMagazineCapacity(); }
  getStock(): AmmoStock { return { ...this.stock }; }
  getBuild(): AmmoBuild { return { ...this.build }; }
  getSpecialCapacity(): number { return this.specialCapacity; }
  setSpecialCapacity(capacity: number): boolean {
    if (!Number.isInteger(capacity) || capacity < countAllocations(this.build)) return false;
    this.specialCapacity = capacity;
    return true;
  }
  getAvailable(ammo: AmmoType): number | 'infinite' {
    if (ammo === 'standard') return 'infinite';
    return this.stock[ammo] - this.magazine.getRounds().filter(round => round === ammo).length;
  }
  getCombatState(): PlayerCombatState { return { ...this.combatState, disabledSlots: { ...this.combatState.disabledSlots } }; }
  addAmmo(ammo: AmmoType): boolean {
    if (!AMMO_ORDER.includes(ammo) || this.getAvailable(ammo) === 0) return false;
    return this.magazine.add(ammo);
  }
  removeAmmo(index: number): boolean { return this.magazine.remove(index) !== undefined; }
  replaceAmmo(index: number, ammo: AmmoType): boolean {
    if (this.magazine.getRounds()[index] === ammo) return true;
    if (!AMMO_ORDER.includes(ammo) || this.getAvailable(ammo) === 0) return false;
    return this.magazine.set(index, ammo);
  }
  /** 장전은 예약이다. 실제 사격 시에만 스테이지 잔량을 차감한다. */
  fireRound(shot: Pick<ShotResult, 'ammoType' | 'conserved'>): void {
    if (this.magazine.getRounds()[0] !== shot.ammoType) throw new Error('장전 순서와 사격이 일치하지 않습니다.');
    if (shot.ammoType !== 'standard' && this.stock[shot.ammoType] <= 0) throw new Error('스테이지 탄약이 부족합니다.');
    this.magazine.remove(0);
    if (shot.ammoType !== 'standard' && !shot.conserved) this.stock[shot.ammoType] -= 1;
  }
  startStage(): void {
    this.magazine.clear();
    this.stock = createStageStock(this.build);
    this.clearCombatDisruptions();
  }
  /** 교체 목록 전체를 검증한 뒤 한 번에 반영한다. 실패 시 배분과 잔량 모두 유지된다. */
  applyAmmoReward(ammo: SpecialAmmoType, replacements: readonly SpecialAmmoType[] = []): boolean {
    if (!Object.hasOwn(this.build, ammo) || !AMMO_ORDER.includes(ammo)) return false;
    const amount = rewardAmount(ammo);
    const required = Math.max(0, countAllocations(this.build) + amount - this.specialCapacity);
    if (replacements.length !== required) return false;
    const next = { ...this.build };
    for (const removed of replacements) {
      if (!(next[removed] > 0)) return false;
      next[removed] -= 1;
    }
    next[ammo] += amount;
    this.build = next;
    return true;
  }
  equipAttachment(id: AttachmentId): AttachmentId | undefined {
    const replaced = this.loadout.equip(id); this.syncMagazineCapacity(); return replaced;
  }
  unequipAttachment(slot: AttachmentSlot): AttachmentId | undefined {
    const removed = this.loadout.unequip(slot); this.syncMagazineCapacity(); return removed;
  }
  applyCombatState(state: PlayerCombatState): void {
    this.combatState = { ...state, disabledSlots: { ...state.disabledSlots } }; this.syncMagazineCapacity();
  }
  clearCombatDisruptions(): void { this.combatState = createPlayerCombatState(); this.syncMagazineCapacity(); }
  reset(): void {
    this.build = createAmmoBuild(); this.specialCapacity = AMMO_BUILD_BALANCE.specialCapacity;
    this.loadout.reset(); this.startStage(); this.isAlive = true;
  }
  private syncMagazineCapacity(): void { this.magazine.setCapacity(getMagazineCapacity(this.loadout.getSnapshot(), this.combatState)); }
}
