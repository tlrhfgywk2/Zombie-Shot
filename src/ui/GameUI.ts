import type { AmmoType, EnemyActionResult, EnemyState, SequenceResult, ShotResult } from '../combat/types';
import type { GamePhase } from '../core/GameStateMachine';
import { AMMO_DEFINITIONS, AMMO_ORDER, COMBAT_BALANCE, type AmmoStock } from '../data/ammoDefinitions';
import { ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import type { AudioPreferences } from '../presentation/AudioPreferences';
import { applyResponsiveLayoutMode } from '../presentation/ResponsiveLayout';

export interface GameUICallbacks {
  onAddAmmo: (ammo: AmmoType) => void;
  onRemoveAmmo: (index: number) => void;
  onReplaceAmmo: (index: number, ammo: AmmoType) => void;
  onSwapAmmo: (first: number, second: number) => void;
  onMoveAmmo: (from: number, to: number) => void;
  onAudioMutedChange: (muted: boolean) => void;
  onAudioVolumeChange: (volume: number) => void;
  onLoad: () => void;
  onRestart: () => void;
}

const PHASE_LABELS: Record<GamePhase, string> = {
  AMMO_SELECTION: '탄약 선택', LOADING: '장전 중', FIRING: '사격 중', ENEMY_ACTION: '적 행동', GAME_OVER: '게임 오버', VICTORY: '실험 완료',
};

export class GameUI {
  private readonly hpFill: HTMLElement;
  private readonly hpText: HTMLElement;
  private readonly armorText: HTMLElement;
  private readonly enemyStatus: HTMLElement;
  private readonly distanceText: HTMLElement;
  private readonly levelText: HTMLElement;
  private readonly waveText: HTMLElement;
  private readonly phaseText: HTMLElement;
  private readonly statusText: HTMLElement;
  private readonly loadButton: HTMLButtonElement;
  private readonly slots: HTMLButtonElement[];
  private readonly overlay: HTMLElement;
  private readonly combatLog: HTMLElement;
  private readonly selectionActions: HTMLElement;
  private readonly selectionText: HTMLElement;
  private readonly audioMute: HTMLButtonElement;
  private readonly audioState: HTMLElement;
  private readonly audioVolume: HTMLInputElement;
  private readonly previewChain: HTMLElement;
  private readonly previewOutcome: HTMLElement;
  private readonly endEyebrow: HTMLElement;
  private readonly endTitle: HTMLElement;
  private readonly endDetail: HTMLElement;
  private rounds: readonly AmmoType[] = [];
  private stock: AmmoStock = { standard: 0, armorPiercing: 0, hollowPoint: 0, incendiary: 0, stagger: 0, magnum: 0 };
  private locked = false;
  private selectedIndex: number | null = null;
  private suppressClick = false;
  private gestureVersion = 0;
  private readonly shell: HTMLElement;

  constructor(root: HTMLElement, private readonly callbacks: GameUICallbacks) {
    root.innerHTML = `
      <div class="game-shell">
        <div id="canvas-host" class="canvas-host"></div>
        <header class="top-hud">
          <div class="brand"><span class="brand-mark"></span><div><small>전술 생존 실험</small><strong>좀비 샷</strong></div></div>
          <div class="enemy-card" aria-live="polite"><div class="enemy-heading"><span id="level-text">일반 감염체</span><span id="hp-text">72 / 72</span></div><div class="hp-track"><span id="hp-fill"></span></div><div class="enemy-meta"><span id="armor-text">방어 0</span><span id="enemy-status">상태 없음</span></div></div>
          <div class="utility-stack"><div class="distance-card"><small>거리</small><strong id="distance-text">10.0 m</strong></div><div class="audio-controls" aria-label="오디오 설정"><button id="audio-mute" type="button" aria-pressed="false"><span>음향</span><strong id="audio-state">켜짐</strong></button><label><span class="sr-only">전체 음량</span><input id="audio-volume" type="range" min="0" max="1" step="0.05" value="0.65" aria-label="전체 음량" /></label></div></div>
        </header>
        <aside class="phase-panel"><span id="wave-text" class="eyebrow">웨이브 1/5 · 표적 1/1</span><strong id="phase-text">탄약 선택</strong><p id="status-text">탄약을 누르거나 빈 슬롯으로 끌어 놓으세요.</p><div id="combat-log" class="combat-log" aria-live="assertive"></div></aside>
        <section class="loadout" aria-label="탄창 장전 영역">
          <div class="ammo-rack"><div class="section-label"><span>탄약 보급</span><small>웨이브 단위 제한</small></div><div class="ammo-options">
            ${AMMO_ORDER.map((ammo) => { const definition = AMMO_DEFINITIONS[ammo]; return `<button class="ammo-token ammo-${ammo}" data-ammo="${ammo}" aria-label="${definition.name}: ${definition.role}"><span class="round-visual"><i></i></span><span><strong>${definition.name}</strong><small>${definition.role}</small></span><b class="stock-count" data-stock="${ammo}">0</b></button>`; }).join('')}
          </div></div>
          <div class="magazine-panel"><div class="section-label"><span>발사 순서</span><small>1 → 4</small></div><div class="sequence-preview" aria-live="polite"><div id="preview-chain">탄약을 장전하면 순서 프리뷰가 표시됩니다.</div><div id="preview-outcome"></div></div><div class="magazine-row"><div class="magazine-slots" role="group" aria-label="탄창 슬롯">
            ${Array.from({ length: COMBAT_BALANCE.magazineCapacity }, (_, index) => `<button class="mag-slot" data-slot="${index}" aria-label="${index + 1}번 탄창 슬롯"><span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span></button>`).join('')}
          </div><button id="load-button" class="load-button" disabled><span>탄창 장전</span><small>1발 이상 필요</small></button></div>
          <div id="selection-actions" class="selection-actions" hidden><span id="selection-text"></span><button id="remove-round" type="button">선택 탄 제거</button><button id="cancel-selection" type="button">취소</button></div></div>
        </section>
        <div class="hint"><span></span>탄약 탭: 추가/교체 · 슬롯 선택 후 목적지 탭: 순서 변경 · 드래그도 지원</div>
        <div id="game-over" class="game-over" hidden><div class="game-over-card"><span id="end-eyebrow">생존 실패</span><h2 id="end-title">감염체가 방어선을 돌파했습니다</h2><p id="end-detail">탄약 재고와 순서를 다시 설계해 보세요.</p><button id="restart-button">다시 시작</button></div></div>
      </div>`;

    this.shell = this.required(root, '.game-shell');
    this.updateResponsiveLayout();

    this.hpFill = this.required(root, '#hp-fill');
    this.hpText = this.required(root, '#hp-text');
    this.armorText = this.required(root, '#armor-text');
    this.enemyStatus = this.required(root, '#enemy-status');
    this.distanceText = this.required(root, '#distance-text');
    this.levelText = this.required(root, '#level-text');
    this.waveText = this.required(root, '#wave-text');
    this.phaseText = this.required(root, '#phase-text');
    this.statusText = this.required(root, '#status-text');
    this.combatLog = this.required(root, '#combat-log');
    this.loadButton = this.required(root, '#load-button') as HTMLButtonElement;
    this.overlay = this.required(root, '#game-over');
    this.selectionActions = this.required(root, '#selection-actions');
    this.selectionText = this.required(root, '#selection-text');
    this.audioMute = this.required(root, '#audio-mute') as HTMLButtonElement;
    this.audioState = this.required(root, '#audio-state');
    this.audioVolume = this.required(root, '#audio-volume') as HTMLInputElement;
    this.previewChain = this.required(root, '#preview-chain');
    this.previewOutcome = this.required(root, '#preview-outcome');
    this.endEyebrow = this.required(root, '#end-eyebrow');
    this.endTitle = this.required(root, '#end-title');
    this.endDetail = this.required(root, '#end-detail');
    this.slots = [...root.querySelectorAll<HTMLButtonElement>('.mag-slot')];

    root.querySelectorAll<HTMLButtonElement>('.ammo-token').forEach((button) => {
      const ammo = button.dataset.ammo as AmmoType;
      button.addEventListener('click', () => {
        if (this.consumeSuppressedClick() || this.locked) return;
        if (this.selectedIndex !== null && this.rounds[this.selectedIndex]) {
          this.callbacks.onReplaceAmmo(this.selectedIndex, ammo);
          this.clearSelection();
        } else this.callbacks.onAddAmmo(ammo);
      });
      this.bindPointerDrag(button, () => ({ ammo }));
    });

    this.slots.forEach((slot, index) => {
      slot.addEventListener('click', () => {
        if (this.consumeSuppressedClick() || this.locked) return;
        this.handleSlotTap(index);
      });
      this.bindPointerDrag(slot, () => this.rounds[index] ? ({ sourceIndex: index }) : undefined);
    });
    this.required(root, '#remove-round').addEventListener('click', () => {
      if (this.selectedIndex === null || this.locked) return;
      this.callbacks.onRemoveAmmo(this.selectedIndex);
      this.clearSelection();
    });
    this.required(root, '#cancel-selection').addEventListener('click', () => this.clearSelection());
    this.audioMute.addEventListener('click', () => this.callbacks.onAudioMutedChange(this.audioMute.getAttribute('aria-pressed') !== 'true'));
    this.audioVolume.addEventListener('input', () => this.callbacks.onAudioVolumeChange(Number(this.audioVolume.value)));
    this.loadButton.addEventListener('click', this.callbacks.onLoad);
    this.required(root, '#restart-button').addEventListener('click', this.callbacks.onRestart);
    window.addEventListener('blur', this.resetDragVisuals);
    window.addEventListener('resize', this.resetDragVisuals);
    window.addEventListener('resize', this.updateResponsiveLayout);
    window.visualViewport?.addEventListener('resize', this.updateResponsiveLayout);
    document.addEventListener('visibilitychange', this.resetDragVisuals);
  }

  get canvasHost(): HTMLElement { return document.querySelector<HTMLElement>('#canvas-host')!; }

  renderMagazine(rounds: readonly AmmoType[], stock: AmmoStock = this.stock): void {
    this.rounds = [...rounds];
    this.stock = { ...stock };
    if (this.selectedIndex !== null && !rounds[this.selectedIndex]) this.selectedIndex = null;
    this.slots.forEach((slot, index) => {
      const ammo = rounds[index];
      slot.className = `mag-slot${ammo ? ` filled ammo-${ammo}` : ''}${this.selectedIndex === index ? ' is-selected' : ''}`;
      slot.innerHTML = ammo ? `<span class="slot-index">0${index + 1}</span><span class="round-visual"><i></i></span><strong>${AMMO_DEFINITIONS[ammo].shortName}</strong>` : `<span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span>`;
      slot.setAttribute('aria-label', ammo ? `${index + 1}번 슬롯: ${AMMO_DEFINITIONS[ammo].name}, 탭하여 선택` : `${index + 1}번 빈 슬롯${this.selectedIndex !== null ? ', 탭하여 선택 탄 이동' : ''}`);
      slot.setAttribute('aria-pressed', String(this.selectedIndex === index));
    });
    this.loadButton.disabled = this.locked || rounds.length === 0;
    this.loadButton.querySelector('small')!.textContent = rounds.length ? `${rounds.length}발로 전투 시작` : '1발 이상 필요';
    document.querySelectorAll<HTMLButtonElement>('.ammo-token').forEach((button) => {
      const ammo = button.dataset.ammo as AmmoType;
      const count = this.stock[ammo];
      button.disabled = this.locked || count <= 0;
      button.querySelector<HTMLElement>('.stock-count')!.textContent = String(count);
      button.setAttribute('aria-label', `${AMMO_DEFINITIONS[ammo].name}: ${AMMO_DEFINITIONS[ammo].role}, 재고 ${count}발`);
    });
    this.updateSelectionUI();
  }

  setLocked(locked: boolean): void {
    this.locked = locked;
    if (locked) this.clearSelection();
    this.renderMagazine(this.rounds, this.stock);
  }

  renderAudioPreferences(preferences: AudioPreferences): void {
    this.audioMute.setAttribute('aria-pressed', String(preferences.muted));
    this.audioMute.setAttribute('aria-label', preferences.muted ? '음향 켜기' : '음향 끄기');
    this.audioState.textContent = preferences.muted ? '꺼짐' : '켜짐';
    this.audioVolume.value = String(preferences.volume);
    this.audioVolume.setAttribute('aria-valuetext', `${Math.round(preferences.volume * 100)}%`);
    this.audioVolume.disabled = preferences.muted;
  }

  setPhase(phase: GamePhase, message: string): void {
    this.phaseText.textContent = PHASE_LABELS[phase];
    this.statusText.textContent = message;
    document.body.dataset.phase = phase;
  }

  updateEnemy(enemy: EnemyState, wave: number, waveCount: number, enemyNumber: number, enemyCount: number): void {
    this.hpFill.style.width = `${Math.max(0, enemy.hp / enemy.maxHp) * 100}%`;
    this.hpText.textContent = `${enemy.hp} / ${enemy.maxHp}`;
    this.armorText.textContent = `방어 ${enemy.armor} / ${enemy.maxArmor}`;
    const statuses: string[] = [];
    if (enemy.statuses.burnTurns) statuses.push(`화상 ${enemy.statuses.burnTurns}턴`);
    if (enemy.statuses.staggerTurns) statuses.push('이동 억제');
    if (enemy.statuses.exposedShots) statuses.push('다음 탄 노출');
    this.enemyStatus.textContent = statuses.join(' · ') || '상태 없음';
    this.distanceText.textContent = `${enemy.distance.toFixed(1)} m`;
    this.levelText.textContent = ENEMY_DEFINITIONS[enemy.type].name;
    this.waveText.textContent = `웨이브 ${wave}/${waveCount} · 표적 ${enemyNumber}/${enemyCount}`;
  }

  renderPreview(sequence: SequenceResult | undefined, action: EnemyActionResult | undefined): void {
    if (!sequence) {
      this.previewChain.textContent = '탄약을 장전하면 순서 프리뷰가 표시됩니다.';
      this.previewOutcome.textContent = '';
      return;
    }
    this.previewChain.innerHTML = sequence.shots.map((shot) => `<span style="--ammo-color:${AMMO_DEFINITIONS[shot.ammoType].cssColor}">${shot.index + 1}. ${AMMO_DEFINITIONS[shot.ammoType].shortName}</span>`).join('<i>→</i>');
    const final = sequence.finalState;
    const effects: string[] = [`체력 ${final.hp}`, `방어 ${final.armor}`, `체력 피해 ${sequence.totalHpDamage}`];
    if (sequence.totalArmorDamage) effects.push(`방어 파괴 ${sequence.totalArmorDamage}`);
    if (final.statuses.burnTurns) effects.push(`화상 ${final.statuses.burnTurns}턴`);
    if (sequence.killed) effects.push('처치 예상');
    else if (action) effects.push(`다음 이동 ${action.movement.toFixed(1)}m`);
    this.previewOutcome.textContent = effects.join(' · ');
  }

  showShot(result: ShotResult): void {
    const damageDetail = [`체력 피해 ${result.hpDamage}`];
    if (result.armorDamage) damageDetail.push(`방어 파괴 ${result.armorDamage}`);
    if (result.burnApplied) damageDetail.push(`화상 ${result.burnApplied}턴`);
    this.combatLog.innerHTML = `<span style="--ammo-color:${AMMO_DEFINITIONS[result.ammoType].cssColor}">${result.index + 1}</span><div><strong>${result.description}</strong><small>${damageDetail.join(' · ')}</small></div>`;
    this.slots.forEach((slot, index) => slot.classList.toggle('is-firing', index === result.index));
  }

  showEvent(title: string, detail: string): void {
    this.combatLog.innerHTML = `<span class="event-mark">!</span><div><strong>${title}</strong><small>${detail}</small></div>`;
    this.slots.forEach((slot) => slot.classList.remove('is-firing'));
  }

  clearEvent(): void { this.combatLog.innerHTML = ''; this.slots.forEach((slot) => slot.classList.remove('is-firing')); }
  showEndState(eyebrow: string, title: string, detail: string, show: boolean): void {
    this.endEyebrow.textContent = eyebrow;
    this.endTitle.textContent = title;
    this.endDetail.textContent = detail;
    this.overlay.hidden = !show;
  }

  private required(root: HTMLElement, selector: string): HTMLElement {
    const element = root.querySelector<HTMLElement>(selector);
    if (!element) throw new Error(`UI 요소를 찾을 수 없습니다: ${selector}`);
    return element;
  }

  private handleSlotTap(index: number): void {
    if (this.selectedIndex === null) {
      if (this.rounds[index]) this.selectSlot(index);
      return;
    }
    if (this.selectedIndex === index) {
      this.clearSelection();
      return;
    }
    this.callbacks.onMoveAmmo(this.selectedIndex, index);
    this.clearSelection();
  }

  private selectSlot(index: number): void {
    this.selectedIndex = index;
    this.renderMagazine(this.rounds);
  }

  private clearSelection(): void {
    this.selectedIndex = null;
    this.slots.forEach((slot) => slot.classList.remove('is-selected', 'drop-target'));
    this.updateSelectionUI();
  }

  private updateSelectionUI(): void {
    const ammo = this.selectedIndex === null ? undefined : this.rounds[this.selectedIndex];
    this.selectionActions.hidden = !ammo || this.locked;
    if (ammo && this.selectedIndex !== null) this.selectionText.textContent = `${this.selectedIndex + 1}번 ${AMMO_DEFINITIONS[ammo].name} 선택됨 · 목적 슬롯이나 교체할 탄약을 누르세요.`;
  }

  private consumeSuppressedClick(): boolean {
    if (!this.suppressClick) return false;
    this.suppressClick = false;
    return true;
  }

  private readonly resetDragVisuals = (): void => {
    this.gestureVersion += 1;
    document.body.classList.remove('ammo-drag-active');
    document.querySelectorAll('.is-dragging, .drop-target').forEach((element) => element.classList.remove('is-dragging', 'drop-target'));
  };

  private readonly updateResponsiveLayout = (): void => {
    applyResponsiveLayoutMode(this.shell);
  };

  private bindPointerDrag(element: HTMLButtonElement, getPayload: () => { ammo?: AmmoType; sourceIndex?: number } | undefined): void {
    element.addEventListener('pointerdown', (event) => {
      if (this.locked || event.button !== 0) return;
      const payload = getPayload();
      if (!payload) return;
      const startX = event.clientX;
      const startY = event.clientY;
      const gestureVersion = this.gestureVersion;
      let dragging = false;
      element.setPointerCapture(event.pointerId);
      const move = (moveEvent: PointerEvent): void => {
        if (gestureVersion !== this.gestureVersion) return;
        if (!dragging && Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) >= 8) {
          dragging = true;
          element.classList.add('is-dragging');
          document.body.classList.add('ammo-drag-active');
        }
        if (!dragging) return;
        moveEvent.preventDefault();
        const target = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest<HTMLButtonElement>('.mag-slot');
        this.slots.forEach((slot) => slot.classList.toggle('drop-target', slot === target));
      };
      const cleanup = (pointerId: number): void => {
        element.removeEventListener('pointermove', move);
        element.removeEventListener('pointerup', end);
        element.removeEventListener('pointercancel', cancel);
        element.removeEventListener('lostpointercapture', lostCapture);
        if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
        element.classList.remove('is-dragging');
        document.body.classList.remove('ammo-drag-active');
        this.slots.forEach((slot) => slot.classList.remove('drop-target'));
      };
      const end = (endEvent: PointerEvent): void => {
        cleanup(endEvent.pointerId);
        if (dragging && gestureVersion === this.gestureVersion) {
          const target = document.elementFromPoint(endEvent.clientX, endEvent.clientY)?.closest<HTMLButtonElement>('.mag-slot');
          const destination = target ? Number(target.dataset.slot) : Number.NaN;
          if (Number.isInteger(destination)) {
            if (payload.ammo) this.callbacks.onReplaceAmmo(destination, payload.ammo);
            else if (payload.sourceIndex !== undefined) this.callbacks.onMoveAmmo(payload.sourceIndex, destination);
          }
          this.suppressClick = true;
          window.setTimeout(() => { this.suppressClick = false; }, 0);
        }
      };
      const cancel = (cancelEvent: PointerEvent): void => cleanup(cancelEvent.pointerId);
      const lostCapture = (lostEvent: PointerEvent): void => cleanup(lostEvent.pointerId);
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerup', end);
      element.addEventListener('pointercancel', cancel);
      element.addEventListener('lostpointercapture', lostCapture);
    });
  }
}
