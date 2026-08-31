import type { AmmoType, ShotResult } from '../combat/types';
import type { GamePhase } from '../core/GameStateMachine';
import { AMMO_DEFINITIONS, AMMO_ORDER, COMBAT_BALANCE } from '../data/ammoDefinitions';

export interface GameUICallbacks {
  onAddAmmo: (ammo: AmmoType) => void;
  onRemoveAmmo: (index: number) => void;
  onReplaceAmmo: (index: number, ammo: AmmoType) => void;
  onSwapAmmo: (first: number, second: number) => void;
  onMoveAmmo: (from: number, to: number) => void;
  onLoad: () => void;
  onRestart: () => void;
}

const PHASE_LABELS: Record<GamePhase, string> = {
  AMMO_SELECTION: '탄약 선택', LOADING: '장전 중', FIRING: '사격 중', ENEMY_ACTION: '적 행동', GAME_OVER: '게임 오버',
};

export class GameUI {
  private readonly hpFill: HTMLElement;
  private readonly hpText: HTMLElement;
  private readonly distanceText: HTMLElement;
  private readonly levelText: HTMLElement;
  private readonly phaseText: HTMLElement;
  private readonly statusText: HTMLElement;
  private readonly loadButton: HTMLButtonElement;
  private readonly slots: HTMLButtonElement[];
  private readonly overlay: HTMLElement;
  private readonly combatLog: HTMLElement;
  private readonly selectionActions: HTMLElement;
  private readonly selectionText: HTMLElement;
  private rounds: readonly AmmoType[] = [];
  private locked = false;
  private selectedIndex: number | null = null;
  private suppressClick = false;

  constructor(root: HTMLElement, private readonly callbacks: GameUICallbacks) {
    root.innerHTML = `
      <div class="game-shell">
        <div id="canvas-host" class="canvas-host"></div>
        <header class="top-hud">
          <div class="brand"><span class="brand-mark"></span><div><small>전술 생존 실험</small><strong>좀비 샷</strong></div></div>
          <div class="enemy-card" aria-live="polite"><div class="enemy-heading"><span id="level-text">감염체 01</span><span id="hp-text">74 / 74</span></div><div class="hp-track"><span id="hp-fill"></span></div></div>
          <div class="distance-card"><small>거리</small><strong id="distance-text">10.0 m</strong></div>
        </header>
        <aside class="phase-panel"><span class="eyebrow">현재 단계</span><strong id="phase-text">탄약 선택</strong><p id="status-text">탄약을 누르거나 빈 슬롯으로 끌어 놓으세요.</p><div id="combat-log" class="combat-log" aria-live="assertive"></div></aside>
        <section class="loadout" aria-label="탄창 장전 영역">
          <div class="ammo-rack"><div class="section-label"><span>탄약 보급</span><small>무제한</small></div><div class="ammo-options">
            ${AMMO_ORDER.map((ammo) => { const definition = AMMO_DEFINITIONS[ammo]; return `<button class="ammo-token ammo-${ammo}" data-ammo="${ammo}" aria-label="${definition.name}: ${definition.role}"><span class="round-visual"><i></i></span><span><strong>${definition.name}</strong><small>${definition.role}</small></span></button>`; }).join('')}
          </div></div>
          <div class="magazine-panel"><div class="section-label"><span>발사 순서</span><small>1 → 4</small></div><div class="magazine-row"><div class="magazine-slots" role="group" aria-label="탄창 슬롯">
            ${Array.from({ length: COMBAT_BALANCE.magazineCapacity }, (_, index) => `<button class="mag-slot" data-slot="${index}" aria-label="${index + 1}번 탄창 슬롯"><span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span></button>`).join('')}
          </div><button id="load-button" class="load-button" disabled><span>탄창 장전</span><small>1발 이상 필요</small></button></div>
          <div id="selection-actions" class="selection-actions" hidden><span id="selection-text"></span><button id="remove-round" type="button">선택 탄 제거</button><button id="cancel-selection" type="button">취소</button></div></div>
        </section>
        <div class="hint"><span></span>탄약 탭: 추가/교체 · 슬롯 선택 후 목적지 탭: 순서 변경 · 드래그도 지원</div>
        <div id="game-over" class="game-over" hidden><div class="game-over-card"><span>생존 실패</span><h2>감염체가 방어선을 돌파했습니다</h2><p>탄약의 종류보다 순서를 다시 설계해 보세요.</p><button id="restart-button">다시 시작</button></div></div>
      </div>`;

    this.hpFill = this.required(root, '#hp-fill');
    this.hpText = this.required(root, '#hp-text');
    this.distanceText = this.required(root, '#distance-text');
    this.levelText = this.required(root, '#level-text');
    this.phaseText = this.required(root, '#phase-text');
    this.statusText = this.required(root, '#status-text');
    this.combatLog = this.required(root, '#combat-log');
    this.loadButton = this.required(root, '#load-button') as HTMLButtonElement;
    this.overlay = this.required(root, '#game-over');
    this.selectionActions = this.required(root, '#selection-actions');
    this.selectionText = this.required(root, '#selection-text');
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
    this.loadButton.addEventListener('click', this.callbacks.onLoad);
    this.required(root, '#restart-button').addEventListener('click', this.callbacks.onRestart);
  }

  get canvasHost(): HTMLElement { return document.querySelector<HTMLElement>('#canvas-host')!; }

  renderMagazine(rounds: readonly AmmoType[]): void {
    this.rounds = [...rounds];
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
    this.updateSelectionUI();
  }

  setLocked(locked: boolean): void {
    this.locked = locked;
    if (locked) this.clearSelection();
    document.querySelectorAll<HTMLButtonElement>('.ammo-token').forEach((button) => { button.disabled = locked; });
    this.renderMagazine(this.rounds);
  }

  setPhase(phase: GamePhase, message: string): void {
    this.phaseText.textContent = PHASE_LABELS[phase];
    this.statusText.textContent = message;
    document.body.dataset.phase = phase;
  }

  updateEnemy(hp: number, maxHp: number, distance: number, level: number, burnTicks: number): void {
    this.hpFill.style.width = `${Math.max(0, hp / maxHp) * 100}%`;
    this.hpText.textContent = `${hp} / ${maxHp}${burnTicks ? ` · 화상 ${burnTicks}` : ''}`;
    this.distanceText.textContent = `${distance.toFixed(1)} m`;
    this.levelText.textContent = `감염체 ${String(level).padStart(2, '0')}`;
  }

  showShot(result: ShotResult): void {
    this.combatLog.innerHTML = `<span style="--ammo-color:${AMMO_DEFINITIONS[result.ammoType].cssColor}">${result.index + 1}</span><div><strong>${result.description}</strong><small>피해 ${result.damage}${result.burnApplied ? ` · 화상 ${result.burnApplied}단계` : ''}</small></div>`;
    this.slots.forEach((slot, index) => slot.classList.toggle('is-firing', index === result.index));
  }

  showEvent(title: string, detail: string): void {
    this.combatLog.innerHTML = `<span class="event-mark">!</span><div><strong>${title}</strong><small>${detail}</small></div>`;
    this.slots.forEach((slot) => slot.classList.remove('is-firing'));
  }

  clearEvent(): void { this.combatLog.innerHTML = ''; this.slots.forEach((slot) => slot.classList.remove('is-firing')); }
  showGameOver(show: boolean): void { this.overlay.hidden = !show; }

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

  private bindPointerDrag(element: HTMLButtonElement, getPayload: () => { ammo?: AmmoType; sourceIndex?: number } | undefined): void {
    element.addEventListener('pointerdown', (event) => {
      if (this.locked || event.button !== 0) return;
      const payload = getPayload();
      if (!payload) return;
      const startX = event.clientX;
      const startY = event.clientY;
      let dragging = false;
      element.setPointerCapture(event.pointerId);
      const move = (moveEvent: PointerEvent): void => {
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
      const end = (endEvent: PointerEvent): void => {
        element.removeEventListener('pointermove', move);
        element.removeEventListener('pointerup', end);
        element.removeEventListener('pointercancel', cancel);
        if (element.hasPointerCapture(endEvent.pointerId)) element.releasePointerCapture(endEvent.pointerId);
        if (dragging) {
          const target = document.elementFromPoint(endEvent.clientX, endEvent.clientY)?.closest<HTMLButtonElement>('.mag-slot');
          const destination = target ? Number(target.dataset.slot) : Number.NaN;
          if (Number.isInteger(destination)) {
            if (payload.ammo) this.callbacks.onReplaceAmmo(destination, payload.ammo);
            else if (payload.sourceIndex !== undefined) this.callbacks.onMoveAmmo(payload.sourceIndex, destination);
          }
          this.suppressClick = true;
        }
        element.classList.remove('is-dragging');
        document.body.classList.remove('ammo-drag-active');
        this.slots.forEach((slot) => slot.classList.remove('drop-target'));
      };
      const cancel = (cancelEvent: PointerEvent): void => end(cancelEvent);
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerup', end);
      element.addEventListener('pointercancel', cancel);
    });
  }
}
