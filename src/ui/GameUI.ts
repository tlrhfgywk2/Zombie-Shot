import type { AmmoType, ShotResult } from '../combat/types';
import type { GamePhase } from '../core/GameStateMachine';
import { AMMO_DEFINITIONS, AMMO_ORDER, COMBAT_BALANCE } from '../data/ammoDefinitions';

export interface GameUICallbacks {
  onAddAmmo: (ammo: AmmoType) => void;
  onRemoveAmmo: (index: number) => void;
  onReplaceAmmo: (index: number, ammo: AmmoType) => void;
  onSwapAmmo: (first: number, second: number) => void;
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
  private rounds: readonly AmmoType[] = [];
  private locked = false;

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
            ${AMMO_ORDER.map((ammo) => { const definition = AMMO_DEFINITIONS[ammo]; return `<button class="ammo-token ammo-${ammo}" data-ammo="${ammo}" draggable="true" aria-label="${definition.name}: ${definition.role}"><span class="round-visual"><i></i></span><span><strong>${definition.name}</strong><small>${definition.role}</small></span></button>`; }).join('')}
          </div></div>
          <div class="magazine-panel"><div class="section-label"><span>발사 순서</span><small>1 → 4</small></div><div class="magazine-row"><div class="magazine-slots" role="group" aria-label="탄창 슬롯">
            ${Array.from({ length: COMBAT_BALANCE.magazineCapacity }, (_, index) => `<button class="mag-slot" data-slot="${index}" aria-label="${index + 1}번 탄창 슬롯"><span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span></button>`).join('')}
          </div><button id="load-button" class="load-button" disabled><span>탄창 장전</span><small>1발 이상 필요</small></button></div></div>
        </section>
        <div class="hint"><span></span>탄약을 탭해 추가 · 슬롯을 탭해 제거 · 드래그해 교체</div>
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
    this.slots = [...root.querySelectorAll<HTMLButtonElement>('.mag-slot')];

    root.querySelectorAll<HTMLButtonElement>('.ammo-token').forEach((button) => {
      const ammo = button.dataset.ammo as AmmoType;
      button.addEventListener('click', () => { if (!this.locked) this.callbacks.onAddAmmo(ammo); });
      button.addEventListener('dragstart', (event) => {
        if (this.locked) return event.preventDefault();
        event.dataTransfer?.setData('application/x-ammo', ammo);
        if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
      });
    });

    this.slots.forEach((slot, index) => {
      slot.addEventListener('click', () => { if (!this.locked && this.rounds[index]) this.callbacks.onRemoveAmmo(index); });
      slot.addEventListener('dragstart', (event) => {
        if (this.locked || !this.rounds[index]) return event.preventDefault();
        event.dataTransfer?.setData('application/x-slot', String(index));
        if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
      });
      slot.addEventListener('dragover', (event) => { if (!this.locked) event.preventDefault(); });
      slot.addEventListener('drop', (event) => {
        event.preventDefault();
        if (this.locked) return;
        const ammo = event.dataTransfer?.getData('application/x-ammo') as AmmoType;
        const source = event.dataTransfer?.getData('application/x-slot');
        if (ammo) this.callbacks.onReplaceAmmo(index, ammo);
        else if (source !== undefined && source !== '') this.callbacks.onSwapAmmo(Number(source), index);
      });
    });
    this.loadButton.addEventListener('click', this.callbacks.onLoad);
    this.required(root, '#restart-button').addEventListener('click', this.callbacks.onRestart);
  }

  get canvasHost(): HTMLElement { return document.querySelector<HTMLElement>('#canvas-host')!; }

  renderMagazine(rounds: readonly AmmoType[]): void {
    this.rounds = [...rounds];
    this.slots.forEach((slot, index) => {
      const ammo = rounds[index];
      slot.className = `mag-slot${ammo ? ` filled ammo-${ammo}` : ''}`;
      slot.draggable = Boolean(ammo) && !this.locked;
      slot.innerHTML = ammo ? `<span class="slot-index">0${index + 1}</span><span class="round-visual"><i></i></span><strong>${AMMO_DEFINITIONS[ammo].shortName}</strong>` : `<span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span>`;
      slot.setAttribute('aria-label', ammo ? `${index + 1}번 슬롯: ${AMMO_DEFINITIONS[ammo].name}, 탭하여 제거` : `${index + 1}번 빈 슬롯`);
    });
    this.loadButton.disabled = this.locked || rounds.length === 0;
    this.loadButton.querySelector('small')!.textContent = rounds.length ? `${rounds.length}발로 전투 시작` : '1발 이상 필요';
  }

  setLocked(locked: boolean): void {
    this.locked = locked;
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
}
