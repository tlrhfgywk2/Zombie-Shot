import { WEAPON_DEFINITIONS, type WeaponId } from '../data/weaponDefinitions';
import { createRunAmmoBuild, type GameMode } from '../data/gameModes';
import { Magazine } from '../combat/Magazine';
import { AttachmentLoadout, createPlayerCombatState, getMagazineCapacity } from '../combat/AttachmentLoadout';
import type { AmmoType, AttachmentSlot, PlayerCombatState, ShotResult } from '../combat/types';
import { ATTACHMENT_DEFINITIONS, type AttachmentId } from '../data/attachmentDefinitions';
import { AMMO_BUILD_BALANCE, AMMO_ORDER, countAllocations, createAmmoBuild, createStageStock, rewardAmount, type AmmoBuild, type AmmoStock, type SpecialAmmoType } from '../data/ammoDefinitions';

export class Player {
  readonly magazine = new Magazine();
  readonly loadout = new AttachmentLoadout();
  isAlive = true;
  private build = createAmmoBuild();
  private stock = createStageStock(this.build);
  private specialCapacity: number = AMMO_BUILD_BALANCE.specialCapacity;
  private ownedAttachments = new Set<AttachmentId>();
  private combatState: PlayerCombatState = createPlayerCombatState();
  private mode: GameMode = 'free';

  constructor() { this.syncMagazineCapacity(); }
  get weapon() { return WEAPON_DEFINITIONS[this.loadout.weapon]; }
  get gameMode(): GameMode { return this.mode; }
  startRun(mode: GameMode, weapon: WeaponId): void {
    this.mode = mode;
    this.build = createRunAmmoBuild(mode, weapon);
    this.specialCapacity = AMMO_BUILD_BALANCE.specialCapacity;
    this.ownedAttachments.clear();
    this.magazine.clear();
    this.selectWeapon(weapon);
    this.startStage();
    this.isAlive = true;
  }
  selectWeapon(id: WeaponId): void {
    this.loadout.reset(); this.loadout.weapon = id; this.magazine.setWeapon(id); this.syncMagazineCapacity();
  }
  getStock(): AmmoStock { return { ...this.stock }; }
  getBuild(): AmmoBuild { return { ...this.build }; }
  getSpecialCapacity(): number { return this.specialCapacity; }
  setSpecialCapacity(capacity: number): boolean {
    if (!Number.isInteger(capacity) || capacity < countAllocations(this.build)) return false;
    this.specialCapacity = capacity;
    return true;
  }
  /** 한 런 동안 유지되는 독립적인 휴대 탄약 강화. 장착물과 무관하다. */
  upgradeAmmoCapacity(amount = 2): boolean {
    if (!Number.isInteger(amount) || amount <= 0) return false;
    this.specialCapacity += amount;
    return true;
  }
  getAvailable(ammo: AmmoType): number | 'infinite' {
    if (ammo === 'ball') return 'infinite';
    return this.stock[ammo] - this.magazine.getRounds().filter(round => round === ammo).length;
  }
  getCombatState(): PlayerCombatState { return { ...this.combatState, disabledSlots: { ...this.combatState.disabledSlots } }; }
  /** 테스트용 수동 보급은 현재 잔량과 다음 구간 배분에 즉시 반영한다. */
  supplyAmmo(ammo: SpecialAmmoType): boolean {
    if (!Object.hasOwn(this.build, ammo) || !AMMO_ORDER.includes(ammo)) return false;
    this.build[ammo] += 1;
    this.stock[ammo] += 1;
    this.specialCapacity = Math.max(this.specialCapacity, countAllocations(this.build));
    return true;
  }
  removeSupplyAmmo(ammo: SpecialAmmoType): boolean {
    if (!Object.hasOwn(this.build, ammo) || !AMMO_ORDER.includes(ammo)
      || this.build[ammo] <= 0 || this.stock[ammo] - this.magazine.getRounds().filter(round => round === ammo).length <= 0) return false;
    this.build[ammo] -= 1;
    this.stock[ammo] -= 1;
    return true;
  }
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
  fireRound(shot: Pick<ShotResult, 'ammoType'>): void {
    if (this.magazine.getRounds()[0] !== shot.ammoType) throw new Error('장전 순서와 사격이 일치하지 않습니다.');
    if (shot.ammoType !== 'ball' && this.stock[shot.ammoType] <= 0) throw new Error('스테이지 탄약이 부족합니다.');
    this.magazine.remove(0);
    if (shot.ammoType !== 'ball') this.stock[shot.ammoType] -= 1;
  }
  startStage(): void {
    this.magazine.clear();
    this.stock = createStageStock(this.build);
    this.clearCombatDisruptions();
  }
  /** 발사 소모만 복구한다. 거래로 넘긴 소유권은 복구하지 않는다. */
  endEncounter(): void {
    this.startStage();
  }
  /** 탐험 보상과 거래는 전체 검증 후 소유량·잔량을 함께 반영한다. 표준탄은 지불할 수 없다. */
  exchangeAmmo(payment: readonly SpecialAmmoType[], gains: readonly SpecialAmmoType[] = []): boolean {
    if (this.magazine.size > 0) return false;
    const next = { ...this.build };
    for (const ammo of payment) {
      if (!Object.hasOwn(next, ammo) || next[ammo] <= 0) return false;
      next[ammo] -= 1;
    }
    for (const ammo of gains) {
      if (!Object.hasOwn(next, ammo)) return false;
      next[ammo] += 1;
    }
    if (countAllocations(next) > this.specialCapacity) return false;
    this.build = next;
    this.stock = createStageStock(next);
    return true;
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
    if (!this.ownedAttachments.has(id)) return undefined;
    const replaced = this.loadout.equip(id); this.syncMagazineCapacity(); return replaced;
  }
  getOwnedAttachments(): AttachmentId[] { return [...this.ownedAttachments]; }
  claimAttachment(id: AttachmentId): boolean {
    if (!Object.hasOwn(ATTACHMENT_DEFINITIONS, id) || this.ownedAttachments.has(id)) return false;
    this.ownedAttachments.add(id);
    return true;
  }
  removeAttachment(id: AttachmentId): boolean {
    if (!this.ownedAttachments.has(id)) return false;
    const slot = ATTACHMENT_DEFINITIONS[id].slot;
    if (this.loadout.getSnapshot()[slot] === id) this.unequipAttachment(slot);
    this.ownedAttachments.delete(id);
    return true;
  }
  unequipAttachment(slot: AttachmentSlot): AttachmentId | undefined {
    const removed = this.loadout.unequip(slot); this.syncMagazineCapacity(); return removed;
  }
  applyCombatState(state: PlayerCombatState): void {
    this.combatState = { ...state, disabledSlots: { ...state.disabledSlots } }; this.syncMagazineCapacity();
  }
  clearCombatDisruptions(): void { this.combatState = createPlayerCombatState(); this.syncMagazineCapacity(); }
  reset(): void {
    this.startRun(this.mode, this.weapon.id);
  }
  private syncMagazineCapacity(): void { this.magazine.setCapacity(getMagazineCapacity(this.loadout.getSnapshot(), this.combatState, this.loadout.weapon)); }
}
