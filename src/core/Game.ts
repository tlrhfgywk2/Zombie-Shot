import { type WeaponId } from '../data/weaponDefinitions';
import { spinCylinder } from '../combat/WeaponTraits';
import { CombatResolver, getVisualKickScale, previewEnemyAction } from '../combat/CombatResolver';
import type { AmmoType, AttachmentSlot } from '../combat/types';
import type { AttachmentId } from '../data/attachmentDefinitions';
import { AMMO_ORDER, type SpecialAmmoType } from '../data/ammoDefinitions';
import { generateAttachmentReward } from '../progression/AttachmentRewards';
import { ENCOUNTER_STAGES, type RouteKind } from '../data/encounterDefinitions';
import { Player } from '../entities/Player';
import { Zombie } from '../entities/Zombie';
import { GamePresentation } from '../presentation/GamePresentation';
import { type AudioPreferences, loadAudioPreferences, saveAudioPreferences } from '../presentation/AudioPreferences';
import { GameUI } from '../ui/GameUI';
import { GameStateMachine } from './GameStateMachine';

export class Game {
  private readonly player = new Player();
  private readonly resolver = new CombatResolver();
  private readonly state = new GameStateMachine();
  private readonly ui: GameUI;
  private readonly presentation: GamePresentation;
  private audioPreferences: AudioPreferences = loadAudioPreferences();
  private waveIndex = 0;
  private enemyIndex = 0;
  private currentRoster = ENCOUNTER_STAGES[0]?.normal.roster ?? ['normal'];
  private zombie = new Zombie(this.currentRoster[0] ?? 'normal');
  private busy = false;
  private boostedOpening = false;
  private cylinderDecided = false;
  private pendingAttachment?: AttachmentId;

  constructor(root: HTMLElement) {
    this.ui = new GameUI(root, {
      onChooseWeapon: id => this.chooseWeapon(id),
      onCylinderDecision: spin => this.chooseCylinder(spin),
      onFireCylinder: () => void this.fireLoadedMagazine(),
      onAddAmmo: (ammo) => this.addAmmo(ammo),
      onRemoveAmmo: (index) => this.removeAmmo(index),
      onReplaceAmmo: (index, ammo) => this.replaceAmmo(index, ammo),
      onSwapAmmo: (first, second) => this.swapAmmo(first, second),
      onMoveAmmo: (from, to) => this.moveAmmo(from, to),
      onEquipAttachment: (id) => this.equipAttachment(id),
      onUnequipAttachment: (slot) => this.unequipAttachment(slot),
      onClaimAttachment: (equip) => void this.claimAttachmentReward(equip),
      onSupplyAmmo: (ammo) => this.supplyAmmo(ammo),
      onChooseRoute: (kind) => void this.chooseRoute(kind),
      onAudioMutedChange: (muted) => this.setAudioPreferences({ ...this.audioPreferences, muted }),
      onAudioVolumeChange: (volume) => this.setAudioPreferences({ ...this.audioPreferences, volume }),
      onLoad: () => void this.beginCombat(),
      onRestart: () => this.restart(),
    });
    this.presentation = new GamePresentation(this.ui.canvasHost);
    this.setAudioPreferences(this.audioPreferences);
    this.sync();
    this.ui.showWeaponSelection(true);
    this.ui.setLocked(true);
  }

  private chooseWeapon(id: WeaponId): void {
    if (this.state.phase !== 'WEAPON_SELECTION') return;
    this.player.selectWeapon(id);
    this.state.transition('AMMO_SELECTION');
    this.ui.showWeaponSelection(false);
    this.ui.setLocked(false);
    this.sync();
  }

  private combatContext() {
    return { weaponId: this.player.weapon.id, boostedOpening: this.boostedOpening,
      loadout: this.player.loadout.getSnapshot(), playerState: this.player.getCombatState() };
  }

  private chooseCylinder(spin: boolean): void {
    if (this.state.phase !== 'CYLINDER_CHOICE' || this.cylinderDecided) return;
    const rounds = this.player.magazine.getRounds();
    if (spin && rounds.length < 2) return;
    if (spin) this.player.magazine.setRounds(spinCylinder(rounds));
    this.boostedOpening = spin;
    this.cylinderDecided = true;
    this.syncMagazine();
    this.ui.renderCylinderChoice(this.player.magazine.size, true, spin);
  }

  private addAmmo(ammo: AmmoType): void {
    if (this.state.phase !== 'AMMO_SELECTION') return;
    this.player.addAmmo(ammo);
    this.syncMagazine();
  }

  private supplyAmmo(ammo: SpecialAmmoType): void {
    if (['WEAPON_SELECTION', 'GAME_OVER', 'VICTORY'].includes(this.state.phase) || !this.player.supplyAmmo(ammo)) return;
    this.ui.renderAmmoStock(this.player.getStock(), this.player.getBuild(), this.player.getSpecialCapacity(), this.player.magazine.getRounds());
  }

  private removeAmmo(index: number): void {
    if (this.state.phase === 'AMMO_SELECTION') { this.player.removeAmmo(index); this.syncMagazine(); }
  }

  private replaceAmmo(index: number, ammo: AmmoType): void {
    if (this.state.phase !== 'AMMO_SELECTION') return;
    this.player.replaceAmmo(index, ammo);
    this.syncMagazine();
  }

  private swapAmmo(first: number, second: number): void {
    if (this.state.phase === 'AMMO_SELECTION') { this.player.magazine.swap(first, second); this.syncMagazine(); }
  }

  private moveAmmo(from: number, to: number): void {
    if (this.state.phase === 'AMMO_SELECTION') { this.player.magazine.move(from, to); this.syncMagazine(); }
  }

  private equipAttachment(id: AttachmentId): void {
    if (this.state.phase !== 'AMMO_SELECTION' || !this.player.getOwnedAttachments().includes(id)) return;
    this.player.equipAttachment(id);
    this.sync();
  }

  private unequipAttachment(slot: AttachmentSlot): void {
    if (this.state.phase !== 'AMMO_SELECTION' || !this.player.unequipAttachment(slot)) return;
    this.sync();
  }

  private setAudioPreferences(preferences: AudioPreferences): void {
    this.audioPreferences = preferences;
    saveAudioPreferences(preferences);
    this.ui.renderAudioPreferences(preferences);
    this.presentation.setAudioPreferences(preferences);
  }

  private async beginCombat(): Promise<void> {
    if (this.busy || this.state.phase !== 'AMMO_SELECTION' || this.player.magazine.size === 0) return;
    this.busy = true;
    this.boostedOpening = false;
    this.cylinderDecided = false;
    const rounds = this.player.magazine.getRounds();
    const sequence = this.resolver.resolveSequence(rounds, this.zombie.snapshot(), this.combatContext());
    this.state.transition('LOADING');
    this.ui.setLocked(true);
    this.ui.renderPreview(sequence);
    this.ui.setPhase('LOADING');
    await this.presentation.animateLoading(rounds);
    if (this.presentation.isDestroyed()) return;
    if (this.player.weapon.trait === 'cylinder') {
      this.state.transition('CYLINDER_CHOICE');
      this.ui.setPhase('CYLINDER_CHOICE');
      this.ui.renderCylinderChoice(rounds.length, false, false);
      this.busy = false;
      return;
    }
    await this.fireLoadedMagazine();
  }

  private async fireLoadedMagazine(): Promise<void> {
    if (this.state.phase !== 'LOADING' && (this.state.phase !== 'CYLINDER_CHOICE' || !this.cylinderDecided || this.busy)) return;
    this.busy = true;
    this.ui.renderCylinderChoice(0, false, false);
    const sequence = this.resolver.resolveSequence(this.player.magazine.getRounds(), this.zombie.snapshot(), this.combatContext());
    this.state.transition('FIRING');
    this.ui.setPhase('FIRING');
    for (const shot of sequence.shots) {
      if (shot.shotDistance !== shot.before.distance) await this.presentation.animateDistanceChange(shot.shotDistance);
      this.ui.showShot(shot);
      await this.presentation.animateShot(shot.ammoType, shot.explosiveConsumed);
      this.ui.showRecoilAfterShot(shot.breakdown.recoilAfter);
      this.player.fireRound(shot);
      this.zombie.applyState(shot.after);
      this.ui.renderAmmoStock(this.player.getStock(), this.player.getBuild(), this.player.getSpecialCapacity(), this.player.magazine.getRounds());
      const hasNextShot = shot !== sequence.shots.at(-1);
      if (shot.after.distance !== shot.shotDistance) await this.presentation.animateDistanceChange(shot.after.distance);
      this.syncEnemy();
      if (hasNextShot) await this.presentation.animateReacquisition(shot.breakdown.recoilGenerated >= 3,
        getVisualKickScale(shot.before, { loadout: this.player.loadout.getSnapshot(), playerState: this.player.getCombatState() }));
    }
    await this.presentation.animateMagazineDiscard();
    this.player.magazine.clear();
    this.boostedOpening = false;
    this.cylinderDecided = false;
    this.syncMagazine();
    await this.resolveEnemyAction();
    this.busy = false;
  }

  private async resolveEnemyAction(): Promise<void> {
    this.state.transition('ENEMY_ACTION');
    this.ui.setPhase('ENEMY_ACTION');
    if (this.zombie.isDead) { await this.handleZombieDeath(); return; }

    const action = this.resolver.resolveEnemyAction(this.zombie.snapshot(), this.player.getCombatState(), this.player.loadout.getSnapshot());
    this.zombie.applyState(action.after);
    this.player.applyCombatState(action.playerAfter);
    if (action.intentDetail) {
      this.syncEnemy();
      await this.pause(420);
    }

    if (action.movement > 0) await this.presentation.animateAdvance(this.zombie.distance);
    this.syncEnemy();
    if (action.playerKilled) {
      this.showBreach();
      return;
    }
    await this.pause(350);
    this.state.transition('AMMO_SELECTION');
    this.ui.setLocked(false);
    this.ui.setPhase('AMMO_SELECTION');
    this.syncMagazine();
  }

  private async handleZombieDeath(): Promise<void> {
    await this.presentation.animateDeath();

    if (this.zombie.snapshot().special) {
      this.pendingAttachment = generateAttachmentReward(this.player.getOwnedAttachments(), this.player.loadout.weapon);
      this.state.transition('ATTACHMENT_REWARD');
      this.ui.setLocked(true);
      this.ui.setPhase('ATTACHMENT_REWARD');
      this.ui.showAttachmentReward(this.pendingAttachment, this.player.loadout.getSnapshot());
      return;
    }
    await this.continueAfterDeath();
  }

  private showBreach(): void {
    this.player.isAlive = false;
    this.state.transition('GAME_OVER');
    this.ui.setPhase('GAME_OVER');
    this.ui.showEndState('감염체가 방어선을 돌파했습니다', true);
  }

  private async claimAttachmentReward(equip: boolean): Promise<void> {
    if (this.busy || this.state.phase !== 'ATTACHMENT_REWARD') return;
    this.busy = true;
    const id = this.pendingAttachment;
    this.pendingAttachment = undefined;
    if (id && this.player.claimAttachment(id) && equip) this.player.equipAttachment(id);
    this.ui.hideAttachmentReward();
    this.sync();
    await this.continueAfterDeath();
    this.busy = false;
  }

  private async continueAfterDeath(): Promise<void> {
    if (this.enemyIndex + 1 < this.currentRoster.length) {
      this.enemyIndex += 1;
      await this.spawnCurrentEnemy();
      return;
    }

    if (this.waveIndex + 1 < ENCOUNTER_STAGES.length) {
      const nextStage = ENCOUNTER_STAGES[this.waveIndex + 1]!;
      this.state.transition('ROUTE_SELECTION');
      this.ui.setPhase('ROUTE_SELECTION');
      this.ui.showRouteChoice(nextStage.special ? [nextStage.normal, nextStage.special] : [nextStage.normal]);
      return;
    }

    this.state.transition('VICTORY');
    this.ui.setPhase('VICTORY');
    this.ui.showEndState('탄약 순서 검증 구간 생존', true);
  }

  private async chooseRoute(kind: RouteKind): Promise<void> {
    if (this.busy || this.state.phase !== 'ROUTE_SELECTION') return;
    const nextIndex = this.waveIndex + 1;
    const stage = ENCOUNTER_STAGES[nextIndex];
    const option = kind === 'special' ? stage?.special : stage?.normal;
    if (!option) return;
    this.busy = true;
    this.currentRoster = option.roster;
    this.waveIndex = nextIndex;
    this.enemyIndex = 0;
    this.ui.hideRouteChoice();
    this.player.startStage();
    await this.spawnCurrentEnemy();
    this.busy = false;
  }

  private async spawnCurrentEnemy(): Promise<void> {
    const type = this.currentRoster[this.enemyIndex] ?? 'normal';
    this.player.clearCombatDisruptions();
    this.zombie = new Zombie(type);
    this.sync();
    await this.presentation.animateSpawn(this.zombie.distance);
    this.state.transition('AMMO_SELECTION');
    this.ui.setLocked(false);
    this.ui.setPhase('AMMO_SELECTION');
  }

  private restart(): void {
    if (this.state.phase !== 'GAME_OVER' && this.state.phase !== 'VICTORY') return;
    this.state.transition('WEAPON_SELECTION');
    this.player.reset();
    this.boostedOpening = false;
    this.cylinderDecided = false;
    this.pendingAttachment = undefined;
    this.ui.hideAttachmentReward();
    this.waveIndex = 0;
    this.enemyIndex = 0;
    this.currentRoster = ENCOUNTER_STAGES[0]?.normal.roster ?? ['normal'];
    this.zombie = new Zombie(this.currentRoster[0] ?? 'normal');
    this.busy = false;
    this.ui.showEndState('', false);
    this.ui.hideRouteChoice();
    this.ui.setLocked(false);
    this.presentation.setZombie(this.zombie.distance, 1, 1, this.zombie.type);
    this.sync();
    this.ui.showWeaponSelection(true);
    this.ui.setLocked(true);
  }

  private sync(): void {
    this.syncEnemy();
    this.syncMagazine();
    this.ui.setPhase(this.state.phase);
  }

  private syncMagazine(): void {
    const rounds = this.player.magazine.getRounds();
    this.ui.renderMagazine(rounds, this.player.getStock(), this.player.magazine.capacity, this.player.getBuild(), this.player.getSpecialCapacity());
    const context = this.combatContext();
    const enemy = this.zombie.snapshot();
    const sequence = rounds.length > 0 ? this.resolver.resolveSequence(rounds, enemy, context) : undefined;
    const ammoOptionPreviews = this.resolver.previewAppendedAmmo(rounds, AMMO_ORDER, enemy, context);
    this.ui.renderPreview(sequence, ammoOptionPreviews);
  }

  private syncEnemy(): void {
    const enemy = this.zombie.snapshot();
    const context = this.combatContext();
    const waveSize = this.currentRoster.length || 1;
    this.ui.updateEnemy(enemy, previewEnemyAction(enemy), this.waveIndex + 1, ENCOUNTER_STAGES.length, this.enemyIndex + 1, waveSize);
    this.ui.renderWeapon(this.player.weapon);
    this.ui.updateRecoilThreshold(this.resolver.getRecoilThreshold(context), context.playerState.heavyKickPenaltyBonus);
    this.ui.renderPlayerDebuffs(context.playerState);
    this.ui.renderLoadout(context.loadout, context.playerState, this.player.magazine.capacity, this.player.getOwnedAttachments());
    this.presentation.setAttachments(context.loadout, context.playerState);
    this.presentation.setZombie(this.zombie.distance, this.zombie.hp / this.zombie.maxHp, this.waveIndex + 1, this.zombie.type, enemy.ignitedActions > 0);
  }

  private pause(milliseconds: number): Promise<void> { return this.presentation.wait(milliseconds); }
}
