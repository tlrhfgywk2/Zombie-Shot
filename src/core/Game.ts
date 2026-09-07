import { CombatResolver } from '../combat/CombatResolver';
import type { AmmoType, AttachmentSlot } from '../combat/types';
import type { AttachmentId } from '../data/attachmentDefinitions';
import { countAllocations, rewardAmount, type SpecialAmmoType } from '../data/ammoDefinitions';
import { generateAttachmentReward } from '../progression/AttachmentRewards';
import { generateAmmoRewards } from '../progression/AmmoRewards';
import { ENCOUNTER_STAGES, type RouteKind } from '../data/encounterDefinitions';
import { Player } from '../entities/Player';
import { Zombie } from '../entities/Zombie';
import { GamePresentation } from '../presentation/GamePresentation';
import { type AudioPreferences, loadAudioPreferences, saveAudioPreferences } from '../presentation/AudioPreferences';
import { PRESENTATION_TIMING } from '../presentation/presentationConfig';
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
  private rewardOptions: SpecialAmmoType[] = [];
  private pendingReward?: SpecialAmmoType;
  private pendingAttachment?: AttachmentId;
  private rewardReplacements: SpecialAmmoType[] = [];

  constructor(root: HTMLElement) {
    this.ui = new GameUI(root, {
      onAddAmmo: (ammo) => this.addAmmo(ammo),
      onRemoveAmmo: (index) => this.removeAmmo(index),
      onReplaceAmmo: (index, ammo) => this.replaceAmmo(index, ammo),
      onSwapAmmo: (first, second) => this.swapAmmo(first, second),
      onMoveAmmo: (from, to) => this.moveAmmo(from, to),
      onEquipAttachment: (id) => this.equipAttachment(id),
      onUnequipAttachment: (slot) => this.unequipAttachment(slot),
      onClaimAttachment: (equip) => void this.claimAttachmentReward(equip),
      onChooseAmmoReward: (ammo) => this.chooseAmmoReward(ammo),
      onReplaceReward: (ammo) => this.replaceReward(ammo),
      onSkipAmmoReward: () => this.skipAmmoReward(),
      onChooseRoute: (kind) => void this.chooseRoute(kind),
      onAudioMutedChange: (muted) => this.setAudioPreferences({ ...this.audioPreferences, muted }),
      onAudioVolumeChange: (volume) => this.setAudioPreferences({ ...this.audioPreferences, volume }),
      onLoad: () => void this.beginCombat(),
      onRestart: () => this.restart(),
    });
    this.presentation = new GamePresentation(this.ui.canvasHost);
    this.setAudioPreferences(this.audioPreferences);
    this.sync();
  }

  private addAmmo(ammo: AmmoType): void {
    if (this.state.phase !== 'AMMO_SELECTION') return;
    this.player.addAmmo(ammo);
    this.syncMagazine();
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
    const rounds = this.player.magazine.getRounds();
    const sequence = this.resolver.resolveSequence(rounds, this.zombie.snapshot(), {
      loadout: this.player.loadout.getSnapshot(),
      playerState: this.player.getCombatState(),
    });
    this.state.transition('LOADING');
    this.ui.setLocked(true);
    this.ui.setPhase('LOADING');
    await this.presentation.animateLoading(rounds);
    this.state.transition('FIRING');
    this.ui.setPhase('FIRING');
    for (const shot of sequence.shots) {
      this.ui.showShot(shot);
      await this.presentation.animateShot(shot.ammoType);
      this.player.fireRound(shot);
      this.zombie.applyState(shot.after);
      this.ui.renderAmmoStock(this.player.getStock(), this.player.getBuild(), this.player.getSpecialCapacity(), this.player.magazine.getRounds());
      this.syncEnemy();
      await this.pause(PRESENTATION_TIMING.betweenShots);
    }
    this.player.magazine.clear();
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
    if (action.burnDamage > 0) {
      await this.presentation.animateBurn();
      this.syncEnemy();
      await this.pause(350);
    }
    if (action.killedByBurn) { await this.handleZombieDeath(); return; }

    if (action.intentDetail) {
      this.syncEnemy();
      await this.pause(420);
    }

    await this.presentation.animateAdvance(this.zombie.distance);
    this.syncEnemy();
    if (this.zombie.distance <= 0) {
      this.player.isAlive = false;
      this.state.transition('GAME_OVER');
      this.ui.setPhase('GAME_OVER');
      this.ui.showEndState('감염체가 방어선을 돌파했습니다', true);
      return;
    }
    await this.pause(350);
    this.state.transition('AMMO_SELECTION');
    this.ui.setLocked(false);
    this.ui.setPhase('AMMO_SELECTION');
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

    this.state.transition('AMMO_REWARD');
    this.rewardOptions = generateAmmoRewards();
    this.pendingReward = undefined;
    this.rewardReplacements = [];
    this.ui.setLocked(true);
    this.ui.setPhase('AMMO_REWARD');
    this.showAmmoRewards();
  }

  private showAmmoRewards(): void {
    this.ui.showAmmoRewards(this.rewardOptions, this.player.getBuild(), this.player.getSpecialCapacity(), this.pendingReward, this.rewardReplacements);
  }

  private chooseAmmoReward(ammo: SpecialAmmoType): void {
    if (this.state.phase !== 'AMMO_REWARD' || !this.rewardOptions.includes(ammo) || this.pendingReward) return;
    this.pendingReward = ammo;
    if (countAllocations(this.player.getBuild()) + rewardAmount(ammo) > this.player.getSpecialCapacity()) this.showAmmoRewards();
    else this.finishAmmoReward();
  }

  private replaceReward(ammo: SpecialAmmoType): void {
    if (this.state.phase !== 'AMMO_REWARD' || !this.pendingReward) return;
    const used = this.rewardReplacements.filter(value => value === ammo).length;
    if (this.player.getBuild()[ammo] <= used) return;
    this.rewardReplacements.push(ammo);
    const required = countAllocations(this.player.getBuild()) + rewardAmount(this.pendingReward) - this.player.getSpecialCapacity();
    if (this.rewardReplacements.length === required) this.finishAmmoReward();
    else this.showAmmoRewards();
  }

  private finishAmmoReward(): void {
    if (!this.pendingReward || !this.player.applyAmmoReward(this.pendingReward, this.rewardReplacements)) return;
    this.advanceAfterAmmoReward();
  }

  private skipAmmoReward(): void {
    if (this.state.phase !== 'AMMO_REWARD') return;
    this.advanceAfterAmmoReward();
  }

  private advanceAfterAmmoReward(): void {
    this.ui.hideAmmoRewards();
    this.pendingReward = undefined;
    this.rewardReplacements = [];
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
    this.state.transition('AMMO_SELECTION');
    this.player.reset();
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
    this.presentation.setZombie(this.zombie.distance, 1, false, 1, this.zombie.type);
    this.sync();
  }

  private sync(): void {
    this.syncMagazine();
    this.syncEnemy();
    this.ui.setPhase(this.state.phase);
  }

  private syncMagazine(): void {
    const rounds = this.player.magazine.getRounds();
    this.ui.renderMagazine(rounds, this.player.getStock(), this.player.magazine.capacity, this.player.getBuild(), this.player.getSpecialCapacity());
    const context = { loadout: this.player.loadout.getSnapshot(), playerState: this.player.getCombatState() };
    if (rounds.length === 0) {
      const action = this.resolver.resolveEnemyAction(this.zombie.snapshot(), context.playerState, context.loadout);
      this.ui.renderPreview(undefined, action);
    } else {
      const sequence = this.resolver.resolveSequence(rounds, this.zombie.snapshot(), context);
      const action = sequence.killed ? undefined : this.resolver.resolveEnemyAction(sequence.finalState, context.playerState, context.loadout);
      this.ui.renderPreview(sequence, action);
    }
  }

  private syncEnemy(): void {
    const waveSize = this.currentRoster.length || 1;
    this.ui.updateEnemy(this.zombie.snapshot(), this.waveIndex + 1, ENCOUNTER_STAGES.length, this.enemyIndex + 1, waveSize);
    this.ui.renderLoadout(this.player.loadout.getSnapshot(), this.player.getCombatState(), this.player.magazine.capacity, this.player.getOwnedAttachments());
    this.presentation.setAttachments(this.player.loadout.getSnapshot(), this.player.getCombatState());
    this.presentation.setZombie(this.zombie.distance, this.zombie.hp / this.zombie.maxHp, this.zombie.statuses.burnTurns > 0, this.waveIndex + 1, this.zombie.type);
  }

  private pause(milliseconds: number): Promise<void> { return this.presentation.wait(milliseconds); }
}
