import { type WeaponId } from '../data/weaponDefinitions';
import type { GameMode } from '../data/gameModes';
import { spinCylinder } from '../combat/WeaponTraits';
import { CombatResolver, getVisualKickScale, previewEnemyAction } from '../combat/CombatResolver';
import type { AmmoType, AttachmentSlot } from '../combat/types';
import type { AttachmentId } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS, AMMO_ORDER, countAllocations, type SpecialAmmoType } from '../data/ammoDefinitions';
import { ATTACHMENT_DEFINITIONS } from '../data/attachmentDefinitions';
import { ExplorationRun, EXPLORATION_TOOLS, EVENT_NAMES, RUN_LENGTH, encounterName, merchantOffers, seededRandom, type ExplorationTool } from '../exploration/ExplorationRun';
import type { ExplorationChoice, ExplorationScreen } from '../ui/ExplorationView';
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
  private zombie = new Zombie(this.currentRoster[0] ?? 'normal', true);
  private busy = false;
  private boostedOpening = false;
  private cylinderDecided = false;
  private pendingAttachment?: AttachmentId;
  private selectedMode: GameMode = 'free';
  private exploration?: ExplorationRun;
  private caveScreen: 'entry' | 'junction' | 'encounter' | 'reward' = 'entry';
  private payment?: SpecialAmmoType;
  private combatRandom: () => number = Math.random;

  constructor(root: HTMLElement) {
    this.ui = new GameUI(root, {
      onChooseMode: mode => this.chooseMode(mode),
      onReturnToMenu: () => this.returnToMenu(),
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
      onRemoveSupplyAmmo: (ammo) => this.removeSupplyAmmo(ammo),
      onSupplyAttachment: id => this.supplyAttachment(id),
      onRemoveSupplyAttachment: id => this.removeSupplyAttachment(id),
      onChooseRoute: (kind) => void this.chooseRoute(kind),
      onExplorationAction: (action, payment) => void this.explorationAction(action, payment),
      onAudioMutedChange: (muted) => this.setAudioPreferences({ ...this.audioPreferences, muted }),
      onAudioVolumeChange: (volume) => this.setAudioPreferences({ ...this.audioPreferences, volume }),
      onLoad: () => void this.beginCombat(),
      onRestart: () => this.restart(),
    });
    this.presentation = new GamePresentation(this.ui.canvasHost);
    this.setAudioPreferences(this.audioPreferences);
    this.sync();
    this.ui.showModeSelection();
    this.ui.setLocked(true);
  }

  private chooseMode(mode: GameMode): void {
    if (this.state.phase !== 'MODE_SELECTION') return;
    this.selectedMode = mode;
    this.ui.setGameMode(mode);
    this.state.transition('WEAPON_SELECTION');
    this.ui.showWeaponSelection(true, mode);
    this.ui.setPhase(this.state.phase);
  }

  private chooseWeapon(id: WeaponId): void {
    if (this.state.phase !== 'WEAPON_SELECTION') return;
    this.player.startRun(this.selectedMode, id);
    this.ui.showWeaponSelection(false);
    if (this.selectedMode === 'exploration') {
      this.startExploration();
      return;
    }
    this.state.transition('AMMO_SELECTION');
    this.ui.setLocked(false);
    this.sync();
  }

  private combatContext() {
    return { weaponId: this.player.weapon.id, boostedOpening: this.boostedOpening, magazineCapacity: this.player.magazine.capacity,
      loadout: this.player.loadout.getSnapshot(), playerState: this.player.getCombatState() };
  }

  private chooseCylinder(spin: boolean): void {
    if (this.state.phase !== 'CYLINDER_CHOICE' || this.cylinderDecided) return;
    const rounds = this.player.magazine.getRounds();
    if (spin && rounds.length < 2) return;
    if (spin) this.player.magazine.setRounds(spinCylinder(rounds, this.combatRandom));
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
    if (this.selectedMode !== 'free') return;
    if (['MODE_SELECTION', 'WEAPON_SELECTION', 'GAME_OVER', 'VICTORY'].includes(this.state.phase) || !this.player.supplyAmmo(ammo)) return;
    this.ui.renderAmmoStock(this.player.getStock(), this.player.getBuild(), this.player.getSpecialCapacity(), this.player.magazine.getRounds());
  }

  private removeSupplyAmmo(ammo: SpecialAmmoType): void {
    if (this.selectedMode !== 'free') return;
    if (['MODE_SELECTION', 'WEAPON_SELECTION', 'GAME_OVER', 'VICTORY'].includes(this.state.phase) || !this.player.removeSupplyAmmo(ammo)) return;
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

  private supplyAttachment(id: AttachmentId): void {
    if (this.selectedMode !== 'free') return;
    if (this.state.phase !== 'AMMO_SELECTION' || !this.player.claimAttachment(id)) return;
    this.sync();
  }

  private removeSupplyAttachment(id: AttachmentId): void {
    if (this.selectedMode !== 'free') return;
    if (this.state.phase !== 'AMMO_SELECTION' || !this.player.removeAttachment(id)) return;
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
    if (this.busy || this.state.phase !== 'AMMO_SELECTION') return;
    this.busy = true;
    this.boostedOpening = false;
    this.cylinderDecided = false;
    const rounds = this.player.magazine.getRounds();
    if (rounds.length === 0) {
      this.ui.setLocked(true);
      try { await this.resolveEnemyAction(); }
      finally { this.busy = false; }
      return;
    }
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
    // 실린더 회전까지 결정한 최종 배열을 고정한다. 실제 사격의 remove(0)는 이 배열에 영향을 주지 않는다.
    const committedMagazine = this.player.magazine.commit();
    const sequence = this.resolver.resolveSequence(committedMagazine.rounds, this.zombie.snapshot(), { ...this.combatContext(), committedMagazine });
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
    this.ui.showEnemyAction(action);
    if (action.intentDetail) await this.pause(420);
    if (action.movement > 0) await this.presentation.animateAdvance(this.zombie.distance);
    if (action.playerKilled) {
      this.showBreach();
      return;
    }
    await this.pause(350);
    this.syncEnemy();
    this.state.transition('AMMO_SELECTION');
    this.ui.setLocked(false);
    this.ui.setPhase('AMMO_SELECTION');
    this.syncMagazine();
  }

  private async handleZombieDeath(): Promise<void> {
    await this.presentation.animateDeath();
    this.player.endEncounter();
    this.syncMagazine();

    if (this.exploration) {
      if (!this.exploration.settleCombat()) return;
      const attachment = this.exploration.active?.attachment;
      if (attachment) this.player.claimAttachment(attachment);
      this.state.transition('EXPLORATION');
      this.caveScreen = 'reward';
      this.presentation.setExploring(true);
      this.renderExploration();
      return;
    }

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
    this.player.endEncounter();
    this.syncMagazine();
    this.player.isAlive = false;
    this.state.transition('GAME_OVER');
    this.ui.setPhase('GAME_OVER');
    this.ui.hideExploration();
    this.ui.showEndState(this.exploration ? `탐험 실패 · ${this.exploration.depth}/${RUN_LENGTH}구간` : '감염체가 방어선을 돌파했습니다', true);
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
    this.zombie = new Zombie(type, true);
    this.sync();
    await this.presentation.animateSpawn(this.zombie.distance);
    this.state.transition('AMMO_SELECTION');
    this.ui.setLocked(false);
    this.ui.setPhase('AMMO_SELECTION');
  }

  private restart(): void {
    if (this.busy || !['AMMO_SELECTION', 'GAME_OVER', 'VICTORY', 'ROUTE_SELECTION', 'ATTACHMENT_REWARD', 'EXPLORATION'].includes(this.state.phase)) return;
    this.player.reset();
    this.resetBattle();
    if (this.selectedMode === 'exploration') {
      this.startExploration(true);
      return;
    }
    this.state.reset('AMMO_SELECTION');
    this.ui.showWeaponSelection(false);
    this.ui.setLocked(false);
    this.sync();
  }

  private returnToMenu(): void {
    if (this.busy || !this.state.canTransition('MODE_SELECTION')) return;
    this.state.transition('MODE_SELECTION');
    this.player.startRun('free', 'p220');
    this.selectedMode = 'free';
    this.ui.setGameMode('free');
    this.resetBattle();
    this.sync();
    this.ui.showModeSelection();
    this.ui.setLocked(true);
  }

  private resetBattle(): void {
    this.presentation.setExploring(false);
    this.ui.hideExploration();
    this.exploration = undefined;
    this.payment = undefined;
    this.combatRandom = Math.random;
    this.boostedOpening = false;
    this.cylinderDecided = false;
    this.pendingAttachment = undefined;
    this.ui.hideAttachmentReward();
    this.waveIndex = 0;
    this.enemyIndex = 0;
    this.currentRoster = ENCOUNTER_STAGES[0]?.normal.roster ?? ['normal'];
    this.zombie = new Zombie(this.currentRoster[0] ?? 'normal', true);
    this.busy = false;
    this.ui.showEndState('', false);
    this.ui.hideRouteChoice();
    this.ui.renderCylinderChoice(0, false, false);
    this.presentation.resetZombie(this.zombie.distance);
    this.presentation.setZombie(this.zombie.distance, 1, 1, this.zombie.type);
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
    this.ui.updateEnemy(enemy, previewEnemyAction(enemy), this.exploration?.depth ?? this.waveIndex + 1, this.exploration ? RUN_LENGTH : ENCOUNTER_STAGES.length, this.enemyIndex + 1, waveSize);
    this.ui.renderWeapon(this.player.weapon);
    this.ui.updateRecoilThreshold(this.resolver.getRecoilThreshold(context), context.playerState.heavyKickPenaltyBonus);
    this.ui.renderPlayerDebuffs(context.playerState);
    this.ui.renderLoadout(context.loadout, context.playerState, this.player.magazine.capacity, this.player.getOwnedAttachments());
    this.presentation.setAttachments(context.loadout, context.playerState);
    this.presentation.setZombie(this.zombie.distance, this.zombie.hp / this.zombie.maxHp, this.waveIndex + 1, this.zombie.type, enemy.ignitedActions > 0);
  }

  private pause(milliseconds: number): Promise<void> { return this.presentation.wait(milliseconds); }

  private startExploration(reset = false): void {
    const suppliedSeed = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('seed');
    const seed = suppliedSeed?.slice(0, 80) || `${Date.now().toString(36)}-${Math.floor(Math.random() * 100000).toString(36)}`;
    this.exploration = new ExplorationRun(seed);
    this.combatRandom = seededRandom(`${seed}:combat`);
    this.caveScreen = 'entry';
    this.payment = undefined;
    if (reset) this.state.reset('EXPLORATION');
    else this.state.transition('EXPLORATION');
    this.presentation.setExploring(true);
    this.ui.setLocked(true);
    this.renderExploration();
  }

  private paymentOptions() {
    const build = this.player.getBuild();
    return AMMO_ORDER.filter((ammo): ammo is SpecialAmmoType => ammo !== 'ball' && build[ammo] > 0)
      .map(ammo => ({ ammo, count: build[ammo] }));
  }

  private renderExploration(): void {
    const run = this.exploration;
    if (!run) return;
    const options = this.paymentOptions();
    if (!options.some(option => option.ammo === this.payment)) this.payment = options[0]?.ammo;
    const active = run.active;
    const full = countAllocations(this.player.getBuild()) >= this.player.getSpecialCapacity();
    const screen: ExplorationScreen = {
      title: '', description: '', progress: `동굴 탐험 · ${run.depth}/${RUN_LENGTH}`, awareness: run.awareness,
      tools: [...run.tools].map(tool => `${EXPLORATION_TOOLS[tool].name}${tool === 'map' ? ` ${run.mapCharges}/2` : ''}`),
      capacity: `특수탄 ${countAllocations(this.player.getBuild())}/${this.player.getSpecialCapacity()}`,
      choices: [],
    };
    if (this.caveScreen === 'entry') {
      screen.title = '동굴 입구';
      screen.description = '바깥의 소리가 끊긴다. 탐색 장비 하나를 챙긴다.';
      screen.choices = (['echo', 'uv'] as const).map(tool => ({ id: `tool:${tool}`, label: EXPLORATION_TOOLS[tool].name, detail: `${EXPLORATION_TOOLS[tool].detail} · 인지 +1` }));
    } else if (this.caveScreen === 'junction') {
      screen.title = run.depth === RUN_LENGTH - 1 ? '빛이 스미는 통로' : '어둠 속 갈림길';
      screen.description = '한 길만 선택할 수 있다.';
      screen.choices = run.routes.flatMap((route, index): ExplorationChoice[] => [
        { id: `route:${index}`, label: run.routes.length === 1 ? '앞으로' : index === 0 ? '왼쪽 통로' : '오른쪽 통로', detail: run.routeClues(route).join(' · ') },
        ...(run.mapCharges > 0 && !run.revealed.has(route.id) ? [{ id: `inspect:${index}`, label: `${index === 0 ? '왼쪽' : '오른쪽'} 측량도 확인`, detail: '목적지 공개', badge: '−1회' }] : []),
      ]);
    } else if (this.caveScreen === 'reward' && active) {
      screen.title = '감염체의 흔적';
      screen.description = active.attachment ? `회수한 ${ATTACHMENT_DEFINITIONS[active.attachment].name} · 다음 전투 준비에서 장착` : '밀봉된 탄약 하나를 회수한다.';
      screen.choices = [...active.rewards.map((ammo, index) => ({ id: `reward:${index}`, label: AMMO_DEFINITIONS[ammo].name, detail: AMMO_DEFINITIONS[ammo].role, ammo, amount: 1, disabled: full })),
        { id: 'leave', label: '계속 탐험', detail: full ? '휴대 한도 도달 · 보상 포기' : '보상 포기' }];
    } else if (active?.kind === 'combat') {
      screen.title = encounterName(active);
      screen.description = run.isDisruptor() ? '공명이 감각을 덮는다. 지나칠 수 없다.' : '통로를 막은 감염체가 고개를 든다.';
      const required = active.enemy === 'fast' ? 3 : 2;
      screen.choices = [
        { id: 'fight', label: '전투 준비', detail: '처치하면 특수탄 획득 · 인지 +1' },
        { id: 'avoid', label: '소리 없이 우회', detail: run.isDisruptor() ? '인지 교란 · 회피 불가' : `인지 ${required} 이상 필요 · 보상 포기 · 인지 −1`, disabled: !run.canAvoid() },
      ];
    } else if (active?.kind === 'merchant') {
      screen.title = '말하는 감염체';
      screen.description = '“쏘지 마. 탄은 이쪽에.” 표준탄은 받지 않는다. 지불한 특수탄은 돌아오지 않는다.';
      screen.payment = { options, selected: this.payment };
      screen.choices = [...merchantOffers(active).map(offer => {
        const owned = Boolean(offer.tool && run.tools.has(offer.tool) || offer.attachment && this.player.getOwnedAttachments().includes(offer.attachment));
        const sold = run.purchased.has(`${active.id}:${offer.id}`);
        const fits = countAllocations(this.player.getBuild()) - offer.price + (offer.amount ?? 0) <= this.player.getSpecialCapacity();
        return { id: `buy:${offer.id}`, label: offer.ammo ? AMMO_DEFINITIONS[offer.ammo].name : offer.attachment ? ATTACHMENT_DEFINITIONS[offer.attachment].name : offer.name,
          detail: owned ? '이미 보유' : sold ? '거래 완료' : offer.detail, badge: `특수탄 ${offer.price}발`, ammo: offer.ammo,
          disabled: owned || sold || !fits || !this.payment || this.player.getBuild()[this.payment] < offer.price };
      }), { id: 'leave', label: '거래를 마친다', detail: '계속 탐험' }];
    } else if (active?.kind === 'event') {
      screen.title = EVENT_NAMES[active.event!];
      if (active.event === 'survey' || active.event === 'shrine') screen.payment = { options, selected: this.payment };
      const canPay = Boolean(this.payment);
      const mapOwned = run.tools.has('map');
      switch (active.event) {
        case 'cache':
          screen.description = '탄약은 마른 틈에 있다. 발을 들이면 바닥이 울린다.';
          screen.choices = [{ id: 'event:risk', label: '안쪽 탄약을 꺼낸다', detail: '평두탄 2발 · 다음 전투 시작 거리 −2m', ammo: 'flatNose', amount: 2, disabled: countAllocations(this.player.getBuild()) + 2 > this.player.getSpecialCapacity() },
            { id: 'event:listen', label: '흔적만 살핀다', detail: '인지 +1' }];
          break;
        case 'survey':
          screen.description = '녹슨 관측기에 남은 회로와 측량도. 탄두가 접점에 맞는다.';
          screen.choices = [{ id: 'event:map', label: '측량도를 복구한다', detail: mapOwned ? '이미 보유' : '특수탄 1발 영구 지불 · 목적지 확인 2회', disabled: !canPay || mapOwned },
            { id: 'event:tool', label: '감지 회로를 떼어낸다', detail: `특수탄 1발 영구 지불 · ${EXPLORATION_TOOLS[run.tools.has('echo') ? 'uv' : 'echo'].name}`, disabled: !canPay || run.tools.has('echo') && run.tools.has('uv') }];
          break;
        case 'shrine':
          screen.description = '탄피 아래에는 정돈된 탄약이 있다. 무엇을 두고 갈까.';
          screen.choices = [{ id: 'event:exchange', label: '탄약을 맞바꾼다', detail: '특수탄 1발 영구 지불 · 중공탄 2발', ammo: 'hollowPoint', amount: 2, disabled: !canPay || full },
            { id: 'event:capacity', label: '탄약 주머니를 기워 쓴다', detail: '특수탄 1발 영구 지불 · 휴대 한도 +2', disabled: !canPay }];
          break;
        case 'nest':
          screen.description = '균사 사이로 느린 맥박이 이어진다.';
          screen.choices = [{ id: 'event:listen', label: '맥박의 간격을 익힌다', detail: '인지 +1' },
            { id: 'event:grip', label: '감겨 있는 손잡이를 회수한다', detail: '텍스처 손잡이 획득 · 다음 전투 시작 거리 −2m', disabled: this.player.getOwnedAttachments().includes('texturedGrip') }];
          break;
      }
      screen.choices = [...screen.choices, { id: 'leave', label: '그냥 지나간다', detail: '계속 탐험' }];
    }
    this.ui.setPhase('EXPLORATION');
    this.ui.showExploration(screen);
  }

  private async explorationAction(action: string, payment?: SpecialAmmoType): Promise<void> {
    if (this.busy || this.state.phase !== 'EXPLORATION' || !this.exploration) return;
    if (action === 'menu') { this.returnToMenu(); return; }
    if (action === 'restart') { this.restart(); return; }
    const run = this.exploration;
    const active = run.active;
    if (action === 'payment') {
      if (this.paymentOptions().some(option => option.ammo === payment)) this.payment = payment;
      this.renderExploration();
      return;
    }
    if (this.caveScreen === 'entry' && (action === 'tool:echo' || action === 'tool:uv')) {
      run.acquire(action.slice(5) as ExplorationTool);
      this.caveScreen = 'junction';
    } else if (this.caveScreen === 'junction' && action.startsWith('inspect:')) {
      run.inspect(Number(action.slice(8)));
    } else if (this.caveScreen === 'junction' && action.startsWith('route:')) {
      if (!run.enter(Number(action.slice(6)))) return;
      this.caveScreen = 'encounter';
      if (run.active?.kind === 'exit') {
        this.state.transition('VICTORY');
        this.ui.hideExploration();
        this.ui.setPhase('VICTORY');
        this.ui.showEndState(`동굴 탈출 · 처치 ${run.victories} · 회피 ${run.avoided}`, true);
        return;
      }
    } else if (this.caveScreen === 'encounter' && active?.kind === 'combat' && action === 'fight') {
      this.busy = true;
      this.player.startStage();
      this.currentRoster = [active.enemy!];
      this.enemyIndex = 0;
      this.zombie = new Zombie(active.enemy!);
      this.zombie.applyState({ ...this.zombie.snapshot(), distance: Math.max(3, this.zombie.distance - run.nextDistancePenalty) });
      run.nextDistancePenalty = 0;
      this.ui.hideExploration();
      this.presentation.setExploring(false);
      this.sync();
      await this.presentation.animateSpawn(this.zombie.distance);
      this.state.transition('AMMO_SELECTION');
      this.ui.setLocked(false);
      this.ui.setPhase('AMMO_SELECTION');
      this.busy = false;
      return;
    } else if (this.caveScreen === 'encounter' && action === 'avoid') {
      if (!run.settleCombat(true)) return;
      this.leaveCaveEncounter();
    } else if (this.caveScreen === 'reward' && active && action.startsWith('reward:')) {
      const ammo = active.rewards[Number(action.slice(7))];
      if (!ammo || !this.player.exchangeAmmo([], [ammo])) return;
      this.leaveCaveEncounter();
    } else if (this.caveScreen === 'encounter' && active?.kind === 'merchant' && action.startsWith('buy:')) {
      const offer = merchantOffers(active).find(offer => offer.id === action.slice(4));
      if (!offer || !this.payment || run.purchased.has(`${active.id}:${offer.id}`)
        || offer.tool && run.tools.has(offer.tool) || offer.attachment && this.player.getOwnedAttachments().includes(offer.attachment)) return;
      const gains = offer.ammo ? Array.from({ length: offer.amount ?? 1 }, () => offer.ammo!) : [];
      if (!this.player.exchangeAmmo(Array.from({ length: offer.price }, () => this.payment!), gains)) return;
      if (offer.tool) run.acquire(offer.tool);
      if (offer.attachment) this.player.claimAttachment(offer.attachment);
      if (offer.capacity) this.player.upgradeAmmoCapacity(offer.capacity);
      run.purchased.add(`${active.id}:${offer.id}`);
    } else if (this.caveScreen === 'encounter' && active?.kind === 'event' && action.startsWith('event:')) {
      if (!this.resolveCaveEvent(action.slice(6))) return;
      this.leaveCaveEncounter();
    } else if (action === 'leave' && (this.caveScreen === 'reward' || active?.kind === 'merchant' || active?.kind === 'event')) {
      this.leaveCaveEncounter();
    } else return;
    this.renderExploration();
  }

  private resolveCaveEvent(choice: string): boolean {
    const run = this.exploration!;
    const event = run.active?.event;
    const pay = (gains: SpecialAmmoType[] = []) => Boolean(this.payment && this.player.exchangeAmmo([this.payment], gains));
    if (choice === 'listen' && (event === 'cache' || event === 'nest')) run.awareness = Math.min(3, run.awareness + 1);
    else if (choice === 'risk' && event === 'cache') {
      if (!this.player.exchangeAmmo([], ['flatNose', 'flatNose'])) return false;
      run.nextDistancePenalty = 2;
    } else if (choice === 'map' && event === 'survey') {
      if (run.tools.has('map') || !pay()) return false;
      run.acquire('map');
    } else if (choice === 'tool' && event === 'survey') {
      const tool = run.tools.has('echo') ? 'uv' : 'echo';
      if (run.tools.has(tool) || !pay()) return false;
      run.acquire(tool);
    } else if (choice === 'exchange' && event === 'shrine') { if (!pay(['hollowPoint', 'hollowPoint'])) return false; }
    else if (choice === 'capacity' && event === 'shrine') { if (!pay()) return false; this.player.upgradeAmmoCapacity(2); }
    else if (choice === 'grip' && event === 'nest') {
      if (!this.player.claimAttachment('texturedGrip')) return false;
      run.nextDistancePenalty = 2;
    } else return false;
    return true;
  }

  private leaveCaveEncounter(): void {
    this.exploration?.leave();
    this.caveScreen = 'junction';
    this.payment = undefined;
    this.presentation.setExploring(true);
    this.syncMagazine();
  }
}
