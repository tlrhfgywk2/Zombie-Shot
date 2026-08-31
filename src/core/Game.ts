import { CombatResolver } from '../combat/CombatResolver';
import type { AmmoType } from '../combat/types';
import { Player } from '../entities/Player';
import { Zombie } from '../entities/Zombie';
import { GamePresentation } from '../presentation/GamePresentation';
import { PRESENTATION_TIMING } from '../presentation/presentationConfig';
import { GameUI } from '../ui/GameUI';
import { GameStateMachine } from './GameStateMachine';

export class Game {
  private readonly player = new Player();
  private readonly resolver = new CombatResolver();
  private readonly state = new GameStateMachine();
  private readonly ui: GameUI;
  private readonly presentation: GamePresentation;
  private zombie = new Zombie();
  private busy = false;

  constructor(root: HTMLElement) {
    this.ui = new GameUI(root, {
      onAddAmmo: (ammo) => this.addAmmo(ammo), onRemoveAmmo: (index) => this.removeAmmo(index), onReplaceAmmo: (index, ammo) => this.replaceAmmo(index, ammo), onSwapAmmo: (first, second) => this.swapAmmo(first, second), onMoveAmmo: (from, to) => this.moveAmmo(from, to), onLoad: () => void this.beginCombat(), onRestart: () => this.restart(),
    });
    this.presentation = new GamePresentation(this.ui.canvasHost);
    this.sync();
  }

  private addAmmo(ammo: AmmoType): void {
    if (this.state.phase !== 'AMMO_SELECTION') return;
    if (!this.player.magazine.add(ammo)) this.ui.showEvent('탄창이 가득 찼습니다', '슬롯을 탭해 제거하거나 탄약을 끌어 교체하세요.');
    else this.ui.clearEvent();
    this.syncMagazine();
  }

  private removeAmmo(index: number): void { if (this.state.phase === 'AMMO_SELECTION') { this.player.magazine.remove(index); this.syncMagazine(); } }
  private replaceAmmo(index: number, ammo: AmmoType): void { if (this.state.phase === 'AMMO_SELECTION') { this.player.magazine.set(index, ammo); this.syncMagazine(); } }
  private swapAmmo(first: number, second: number): void { if (this.state.phase === 'AMMO_SELECTION') { this.player.magazine.swap(first, second); this.syncMagazine(); } }
  private moveAmmo(from: number, to: number): void { if (this.state.phase === 'AMMO_SELECTION') { this.player.magazine.move(from, to); this.syncMagazine(); } }

  private async beginCombat(): Promise<void> {
    if (this.busy || this.state.phase !== 'AMMO_SELECTION' || this.player.magazine.size === 0) return;
    this.busy = true;
    const rounds = this.player.magazine.getRounds();
    this.state.transition('LOADING');
    this.ui.setLocked(true);
    this.ui.setPhase('LOADING', `${rounds.length}발을 탄창에 밀어 넣고 약실을 준비합니다.`);
    this.ui.clearEvent();
    await this.presentation.animateLoading(rounds);
    this.state.transition('FIRING');
    this.ui.setPhase('FIRING', '장전한 순서대로 자동 사격합니다.');
    const context = this.resolver.createContext();
    for (let index = 0; index < rounds.length; index += 1) {
      const ammo = rounds[index];
      if (!ammo || this.zombie.isDead) break;
      const result = this.resolver.resolveShot(ammo, index, this.zombie.distance, context);
      this.ui.showShot(result);
      await this.presentation.animateShot(ammo);
      this.zombie.takeDamage(result.damage);
      if (result.burnApplied) this.zombie.applyBurn(result.burnApplied);
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
    this.ui.setPhase('ENEMY_ACTION', '감염체의 상태와 이동을 처리합니다.');
    if (this.zombie.isDead) { await this.handleZombieDeath(); return; }
    if (this.zombie.burnTicks > 0) {
      const burnDamage = this.zombie.resolveBurn();
      this.ui.showEvent('화상 폭발', `적 행동 전에 ${burnDamage} 피해`);
      await this.presentation.animateBurn();
      this.syncEnemy();
      await this.pause(350);
      if (this.zombie.isDead) { await this.handleZombieDeath(); return; }
    }
    this.zombie.advance();
    this.ui.showEvent('감염체 접근', `남은 거리 ${this.zombie.distance.toFixed(1)} m`);
    await this.presentation.animateAdvance(this.zombie.distance);
    this.syncEnemy();
    if (this.zombie.distance <= 0) {
      this.player.isAlive = false;
      this.state.transition('GAME_OVER');
      this.ui.setPhase('GAME_OVER', '방어선이 돌파되었습니다.');
      this.ui.showGameOver(true);
      return;
    }
    await this.pause(350);
    this.state.transition('AMMO_SELECTION');
    this.ui.setLocked(false);
    this.ui.setPhase('AMMO_SELECTION', '거리와 화상 상태를 확인하고 다음 순서를 설계하세요.');
    this.ui.clearEvent();
  }

  private async handleZombieDeath(): Promise<void> {
    this.ui.showEvent('감염체 제거', '더 강한 감염체가 접근합니다.');
    await this.presentation.animateDeath();
    const nextLevel = this.zombie.level + 1;
    this.zombie = new Zombie(nextLevel);
    this.syncEnemy();
    await this.presentation.animateSpawn(this.zombie.distance);
    this.state.transition('AMMO_SELECTION');
    this.ui.setLocked(false);
    this.ui.setPhase('AMMO_SELECTION', `감염체 ${String(nextLevel).padStart(2, '0')} 출현 · 탄약 순서를 정하세요.`);
    this.ui.clearEvent();
  }

  private restart(): void {
    if (this.state.phase !== 'GAME_OVER') return;
    this.state.transition('AMMO_SELECTION');
    this.player.reset();
    this.zombie = new Zombie();
    this.busy = false;
    this.ui.showGameOver(false);
    this.ui.setLocked(false);
    this.ui.clearEvent();
    this.presentation.setZombie(this.zombie.distance, 1, false, this.zombie.level);
    this.sync();
  }

  private sync(): void { this.syncMagazine(); this.syncEnemy(); this.ui.setPhase(this.state.phase, '탄약을 누르거나 빈 슬롯으로 끌어 놓으세요.'); }
  private syncMagazine(): void { this.ui.renderMagazine(this.player.magazine.getRounds()); }
  private syncEnemy(): void {
    this.ui.updateEnemy(this.zombie.hp, this.zombie.maxHp, this.zombie.distance, this.zombie.level, this.zombie.burnTicks);
    this.presentation.setZombie(this.zombie.distance, this.zombie.hp / this.zombie.maxHp, this.zombie.burnTicks > 0, this.zombie.level);
  }
  private pause(milliseconds: number): Promise<void> { return new Promise((resolve) => window.setTimeout(resolve, milliseconds)); }
}
