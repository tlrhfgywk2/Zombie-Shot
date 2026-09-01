import { CombatResolver } from '../combat/CombatResolver';
import type { AmmoType } from '../combat/types';
import { WAVE_AMMO_SUPPLY } from '../data/ammoDefinitions';
import { ENEMY_DEFINITIONS, WAVE_ROSTER } from '../data/enemyDefinitions';
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
  private zombie = new Zombie(WAVE_ROSTER[0]?.[0] ?? 'normal');
  private busy = false;

  constructor(root: HTMLElement) {
    this.ui = new GameUI(root, {
      onAddAmmo: (ammo) => this.addAmmo(ammo),
      onRemoveAmmo: (index) => this.removeAmmo(index),
      onReplaceAmmo: (index, ammo) => this.replaceAmmo(index, ammo),
      onSwapAmmo: (first, second) => this.swapAmmo(first, second),
      onMoveAmmo: (from, to) => this.moveAmmo(from, to),
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
    const sequence = this.resolver.resolveSequence(rounds, this.zombie.snapshot());
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
    this.syncMagazine();
    await this.resolveEnemyAction();
    this.busy = false;
  }

  private async resolveEnemyAction(): Promise<void> {
    this.state.transition('ENEMY_ACTION');
    this.ui.setPhase('ENEMY_ACTION', '화상과 이동 억제를 처리합니다.');
    if (this.zombie.isDead) { await this.handleZombieDeath(); return; }

    const action = this.resolver.resolveEnemyAction(this.zombie.snapshot());
    this.zombie.applyState(action.after);
    if (action.burnDamage > 0) {
      this.ui.showEvent('화상 피해', `${action.burnDamage} 피해 · 남은 화상 ${action.after.statuses.burnTurns}턴`);
      await this.presentation.animateBurn();
      this.syncEnemy();
      await this.pause(350);
    }
    if (action.killedByBurn) { await this.handleZombieDeath(); return; }

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

    const currentWave = WAVE_ROSTER[this.waveIndex] ?? [];
    if (this.enemyIndex + 1 < currentWave.length) {
      this.enemyIndex += 1;
      await this.spawnCurrentEnemy();
      return;
    }

    if (this.waveIndex + 1 < WAVE_ROSTER.length) {
      this.waveIndex += 1;
      this.enemyIndex = 0;
      this.player.resupply(WAVE_AMMO_SUPPLY);
      this.ui.showEvent(`웨이브 ${this.waveIndex + 1} 보급`, '표준탄 5발과 매그넘을 제외한 특수탄 각 1발을 받았습니다.');
      await this.pause(450);
      await this.spawnCurrentEnemy();
      return;
    }

    this.state.transition('VICTORY');
    this.ui.setPhase('VICTORY', '5개 웨이브를 모두 방어했습니다.');
    this.ui.showEndState('실험 완료', '탄약 순서 검증 구간 생존', '같은 적에게 다른 순서로 다시 시도해 결과를 비교해 보세요.', true);
  }

  private async spawnCurrentEnemy(): Promise<void> {
    const type = WAVE_ROSTER[this.waveIndex]?.[this.enemyIndex] ?? 'normal';
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
    this.zombie = new Zombie(WAVE_ROSTER[0]?.[0] ?? 'normal');
    this.busy = false;
    this.ui.showEndState('', '', '', false);
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
    this.ui.renderMagazine(rounds, this.player.getStock());
    if (rounds.length === 0) this.ui.renderPreview(undefined, undefined);
    else {
      const sequence = this.resolver.resolveSequence(rounds, this.zombie.snapshot());
      const action = sequence.killed ? undefined : this.resolver.resolveEnemyAction(sequence.finalState);
      this.ui.renderPreview(sequence, action);
    }
  }

  private syncEnemy(): void {
    const waveSize = WAVE_ROSTER[this.waveIndex]?.length ?? 1;
    this.ui.updateEnemy(this.zombie.snapshot(), this.waveIndex + 1, WAVE_ROSTER.length, this.enemyIndex + 1, waveSize);
    this.presentation.setZombie(this.zombie.distance, this.zombie.hp / this.zombie.maxHp, this.zombie.statuses.burnTurns > 0, this.waveIndex + 1);
  }

  private pause(milliseconds: number): Promise<void> { return this.presentation.wait(milliseconds); }
}
