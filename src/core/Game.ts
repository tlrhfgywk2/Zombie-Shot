import { CombatResolver } from '../combat/CombatResolver';
import type { AmmoType, AttachmentSlot } from '../combat/types';
import type { AttachmentId } from '../data/attachmentDefinitions';
import { NORMAL_AMMO_SUPPLY, SPECIAL_AMMO_SUPPLY } from '../data/ammoDefinitions';
import { ENCOUNTER_STAGES, type RouteKind } from '../data/encounterDefinitions';
import { ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
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
  private currentRoute: RouteKind = 'normal';
  private currentRoster = ENCOUNTER_STAGES[0]?.normal.roster ?? ['normal'];
  private zombie = new Zombie(this.currentRoster[0] ?? 'normal');
  private busy = false;

  constructor(root: HTMLElement) {
    this.ui = new GameUI(root, {
      onAddAmmo: (ammo) => this.addAmmo(ammo),
      onRemoveAmmo: (index) => this.removeAmmo(index),
      onReplaceAmmo: (index, ammo) => this.replaceAmmo(index, ammo),
      onSwapAmmo: (first, second) => this.swapAmmo(first, second),
      onMoveAmmo: (from, to) => this.moveAmmo(from, to),
      onEquipAttachment: (id) => this.equipAttachment(id),
      onUnequipAttachment: (slot) => this.unequipAttachment(slot),
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
    if (!this.player.addAmmo(ammo)) this.ui.showEvent('장전할 수 없습니다', this.player.magazine.size >= this.player.magazine.capacity ? '탄창이 가득 찼습니다.' : '해당 탄약 재고가 없습니다.');
    else this.ui.clearEvent();
    this.syncMagazine();
  }

  private removeAmmo(index: number): void {
    if (this.state.phase === 'AMMO_SELECTION') { this.player.removeAmmo(index); this.syncMagazine(); }
  }

  private replaceAmmo(index: number, ammo: AmmoType): void {
    if (this.state.phase !== 'AMMO_SELECTION') return;
    if (!this.player.replaceAmmo(index, ammo)) this.ui.showEvent('교체할 수 없습니다', '해당 탄약 재고가 없습니다.');
    else this.ui.clearEvent();
    this.syncMagazine();
  }

  private swapAmmo(first: number, second: number): void {
    if (this.state.phase === 'AMMO_SELECTION') { this.player.magazine.swap(first, second); this.syncMagazine(); }
  }

  private moveAmmo(from: number, to: number): void {
    if (this.state.phase === 'AMMO_SELECTION') { this.player.magazine.move(from, to); this.syncMagazine(); }
  }

  private equipAttachment(id: AttachmentId): void {
    if (this.state.phase !== 'AMMO_SELECTION') return;
    this.player.equipAttachment(id);
    this.sync();
    this.ui.showEvent('장착물 교체', '정확도와 탄창 용량을 새 구성으로 다시 계산했습니다.');
  }

  private unequipAttachment(slot: AttachmentSlot): void {
    if (this.state.phase !== 'AMMO_SELECTION' || !this.player.unequipAttachment(slot)) return;
    this.sync();
    this.ui.showEvent('장착물 해제', '빈 슬롯은 효과와 불이익을 모두 제거합니다.');
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
    this.ui.setPhase('LOADING', `${rounds.length}발을 탄창에 밀어 넣고 약실을 준비합니다.`);
    this.ui.clearEvent();
    await this.presentation.animateLoading(rounds);
    this.state.transition('FIRING');
    this.ui.setPhase('FIRING', '프리뷰와 같은 규칙으로 순서대로 해결합니다.');
    for (const shot of sequence.shots) {
      this.ui.showShot(shot);
      await this.presentation.animateShot(shot.ammoType);
      this.zombie.applyState(shot.after);
      this.syncEnemy();
      await this.pause(PRESENTATION_TIMING.betweenShots);
    }
    this.player.magazine.clear();
    this.player.returnAmmo(sequence.returnedRounds);
    this.syncMagazine();
    await this.resolveEnemyAction();
    this.busy = false;
  }

  private async resolveEnemyAction(): Promise<void> {
    this.state.transition('ENEMY_ACTION');
    this.ui.setPhase('ENEMY_ACTION', '화상과 이동 억제를 처리합니다.');
    if (this.zombie.isDead) { await this.handleZombieDeath(); return; }

    const action = this.resolver.resolveEnemyAction(this.zombie.snapshot(), this.player.getCombatState(), this.player.loadout.getSnapshot());
    this.zombie.applyState(action.after);
    this.player.applyCombatState(action.playerAfter);
    if (action.burnDamage > 0) {
      this.ui.showEvent('화상 피해', `${action.burnDamage} 피해 · 남은 화상 ${action.after.statuses.burnTurns}턴`);
      await this.presentation.animateBurn();
      this.syncEnemy();
      await this.pause(350);
    }
    if (action.killedByBurn) { await this.handleZombieDeath(); return; }

    if (action.intentDetail) {
      this.ui.showEvent(action.intentDelayed ? '특수 행동 지연' : '특수 행동 발동', action.intentDetail);
      this.syncEnemy();
      await this.pause(420);
    }

    const movementNote = action.staggerConsumed ? `충격으로 ${action.movement.toFixed(1)} m만 이동` : `${action.movement.toFixed(1)} m 이동`;
    this.ui.showEvent('감염체 접근', `${movementNote} · 남은 거리 ${this.zombie.distance.toFixed(1)} m`);
    await this.presentation.animateAdvance(this.zombie.distance);
    this.syncEnemy();
    if (this.zombie.distance <= 0) {
      this.player.isAlive = false;
      this.state.transition('GAME_OVER');
      this.ui.setPhase('GAME_OVER', '방어선이 돌파되었습니다.');
      this.ui.showEndState('생존 실패', '감염체가 방어선을 돌파했습니다', '탄약 재고와 순서를 다시 설계해 보세요.', true);
      return;
    }
    await this.pause(350);
    this.state.transition('AMMO_SELECTION');
    this.ui.setLocked(false);
    this.ui.setPhase('AMMO_SELECTION', '현재 상태와 프리뷰를 비교해 다음 순서를 설계하세요.');
    this.ui.clearEvent();
  }

  private async handleZombieDeath(): Promise<void> {
    this.ui.showEvent('감염체 제거', '다음 표적을 확인합니다.');
    await this.presentation.animateDeath();

    if (this.enemyIndex + 1 < this.currentRoster.length) {
      this.enemyIndex += 1;
      await this.spawnCurrentEnemy();
      return;
    }

    this.player.resupply(this.currentRoute === 'special' ? SPECIAL_AMMO_SUPPLY : NORMAL_AMMO_SUPPLY);
    if (this.waveIndex + 1 < ENCOUNTER_STAGES.length) {
      const nextStage = ENCOUNTER_STAGES[this.waveIndex + 1];
      if (!nextStage) return;
      this.state.transition('ROUTE_SELECTION');
      this.ui.setLocked(true);
      this.ui.setPhase('ROUTE_SELECTION', `${this.currentRoute === 'special' ? '정예' : '일반'} 보급을 확보했습니다. 다음 위험을 선택하세요.`);
      this.ui.showRouteChoice(this.waveIndex + 2, nextStage.special ? [nextStage.normal, nextStage.special] : [nextStage.normal]);
      return;
    }

    this.state.transition('VICTORY');
    this.ui.setPhase('VICTORY', '5개 조우를 모두 방어했습니다.');
    this.ui.showEndState('실험 완료', '탄약 순서 검증 구간 생존', '같은 적에게 다른 순서로 다시 시도해 결과를 비교해 보세요.', true);
  }

  private async chooseRoute(kind: RouteKind): Promise<void> {
    if (this.state.phase !== 'ROUTE_SELECTION') return;
    const nextIndex = this.waveIndex + 1;
    const stage = ENCOUNTER_STAGES[nextIndex];
    const option = kind === 'special' ? stage?.special : stage?.normal;
    if (!option) return;
    this.currentRoute = kind;
    this.currentRoster = option.roster;
    this.waveIndex = nextIndex;
    this.enemyIndex = 0;
    this.ui.hideRouteChoice();
    await this.spawnCurrentEnemy();
  }

  private async spawnCurrentEnemy(): Promise<void> {
    const type = this.currentRoster[this.enemyIndex] ?? 'normal';
    this.player.clearCombatDisruptions();
    this.zombie = new Zombie(type);
    this.sync();
    await this.presentation.animateSpawn(this.zombie.distance);
    this.state.transition('AMMO_SELECTION');
    this.ui.setLocked(false);
    this.ui.setPhase('AMMO_SELECTION', `${ENEMY_DEFINITIONS[type].name} 출현 · 재고와 순서를 확인하세요.`);
    this.ui.clearEvent();
  }

  private restart(): void {
    if (this.state.phase !== 'GAME_OVER' && this.state.phase !== 'VICTORY') return;
    this.state.transition('AMMO_SELECTION');
    this.player.reset();
    this.waveIndex = 0;
    this.enemyIndex = 0;
    this.currentRoute = 'normal';
    this.currentRoster = ENCOUNTER_STAGES[0]?.normal.roster ?? ['normal'];
    this.zombie = new Zombie(this.currentRoster[0] ?? 'normal');
    this.busy = false;
    this.ui.showEndState('', '', '', false);
    this.ui.hideRouteChoice();
    this.ui.setLocked(false);
    this.ui.clearEvent();
    this.presentation.setZombie(this.zombie.distance, 1, false, 1);
    this.sync();
  }

  private sync(): void {
    this.syncMagazine();
    this.syncEnemy();
    this.ui.setPhase(this.state.phase, '탄약을 누르거나 빈 슬롯으로 끌어 놓으세요.');
  }

  private syncMagazine(): void {
    const rounds = this.player.magazine.getRounds();
    this.ui.renderMagazine(rounds, this.player.getStock(), this.player.magazine.capacity);
    if (rounds.length === 0) this.ui.renderPreview(undefined, undefined);
    else {
      const context = { loadout: this.player.loadout.getSnapshot(), playerState: this.player.getCombatState() };
      const sequence = this.resolver.resolveSequence(rounds, this.zombie.snapshot(), context);
      const action = sequence.killed ? undefined : this.resolver.resolveEnemyAction(sequence.finalState, context.playerState, context.loadout);
      this.ui.renderPreview(sequence, action);
    }
  }

  private syncEnemy(): void {
    const waveSize = this.currentRoster.length || 1;
    this.ui.updateEnemy(this.zombie.snapshot(), this.waveIndex + 1, ENCOUNTER_STAGES.length, this.enemyIndex + 1, waveSize);
    this.ui.renderLoadout(this.player.loadout.getSnapshot(), this.player.getCombatState(), this.player.magazine.capacity);
    this.presentation.setZombie(this.zombie.distance, this.zombie.hp / this.zombie.maxHp, this.zombie.statuses.burnTurns > 0, this.waveIndex + 1);
  }

  private pause(milliseconds: number): Promise<void> { return this.presentation.wait(milliseconds); }
}
