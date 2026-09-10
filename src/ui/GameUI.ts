import { ammoStatsMarkup } from './AmmoView';
import { formatRangePenalty, getRangeBand } from '../combat/CombatResolver';
import type { AmmoType, AttachmentSlot, EnemyActionResult, EnemyState, PlayerCombatState, SequenceResult, ShotResult } from '../combat/types';
import { BUILD_LABEL } from '../buildInfo';
import type { GamePhase } from '../core/GameStateMachine';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_ORDER, ATTACHMENT_RARITY_NAMES, ATTACHMENT_SLOT_NAMES, ATTACHMENT_SLOT_ORDER, SERVICE_45, type AttachmentId, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS, AMMO_ORDER, AMMO_BUILD_BALANCE, createAmmoBuild, createStageStock, rewardAmount, type AmmoBuild, type SpecialAmmoType, BUILD_TAG_NAMES, COMBAT_BALANCE, RANGE_NAMES, RARITY_NAMES, type AmmoStock } from '../data/ammoDefinitions';
import type { RouteKind, RouteOption } from '../data/encounterDefinitions';
import { ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import type { AudioPreferences } from '../presentation/AudioPreferences';
import { applyResponsiveLayoutMode } from '../presentation/ResponsiveLayout';

export interface GameUICallbacks {
  onAddAmmo: (ammo: AmmoType) => void;
  onRemoveAmmo: (index: number) => void;
  onReplaceAmmo: (index: number, ammo: AmmoType) => void;
  onSwapAmmo: (first: number, second: number) => void;
  onMoveAmmo: (from: number, to: number) => void;
  onEquipAttachment: (id: AttachmentId) => void;
  onUnequipAttachment: (slot: AttachmentSlot) => void;
  onClaimAttachment: (equip: boolean) => void;
  onChooseAmmoReward: (ammo: SpecialAmmoType) => void;
  onReplaceReward: (ammo: SpecialAmmoType) => void;
  onSkipAmmoReward: () => void;
  onChooseRoute: (kind: RouteKind) => void;
  onAudioMutedChange: (muted: boolean) => void;
  onAudioVolumeChange: (volume: number) => void;
  onLoad: () => void;
  onRestart: () => void;
}

const PHASE_LABELS: Record<GamePhase, string> = {
  ATTACHMENT_REWARD: '부착물 획득', AMMO_REWARD: '탄약 보급', AMMO_SELECTION: '전투 준비', LOADING: '장전 중', FIRING: '사격 중', ENEMY_ACTION: '적 행동', ROUTE_SELECTION: '경로 선택', GAME_OVER: '게임 오버', VICTORY: '실험 완료',
};

export class GameUI {
  private readonly hpFill: HTMLElement;
  private readonly hpText: HTMLElement;
  private readonly armorText: HTMLElement;
  private readonly impactText: HTMLElement;
  private readonly impactThreshold: HTMLElement;
  private readonly impactFill: HTMLElement;
  private readonly enemyStatus: HTMLElement;
  private readonly enemyContext: HTMLElement;
  private readonly nextMoveText: HTMLElement;
  private readonly distanceText: HTMLElement;
  private readonly rangeBandText: HTMLElement;
  private readonly levelText: HTMLElement;
  private readonly waveText: HTMLElement;
  private readonly phaseText: HTMLElement;
  private readonly loadButton: HTMLButtonElement;
  private readonly slots: HTMLButtonElement[];
  private readonly overlay: HTMLElement;
  private readonly audioMute: HTMLButtonElement;
  private readonly audioState: HTMLElement;
  private readonly audioVolume: HTMLInputElement;
  private readonly previewOutcome: HTMLElement;
  private readonly intentCard: HTMLElement;
  private readonly attachmentBay: HTMLElement;
  private readonly attachmentTabs: HTMLButtonElement[];
  private readonly routeChoice: HTMLElement;
  private readonly endTitle: HTMLElement;
  private readonly ammoTooltip: HTMLElement;
  private readonly ammoInventory: HTMLElement;
  private readonly inventoryBackgroundInert = new Map<HTMLElement, boolean>();
  private inventoryOpener?: HTMLButtonElement;
  private inspectedAmmoButton?: HTMLButtonElement;
  private rounds: readonly AmmoType[] = [];
  private build = createAmmoBuild();
  private stock: AmmoStock = createStageStock(this.build);
  private specialCapacity: number = AMMO_BUILD_BALANCE.specialCapacity;
  private locked = false;
  private magazineCapacity: number = COMBAT_BALANCE.baseMagazineCapacity;
  private suppressClick = false;
  private gestureVersion = 0;
  private activeAttachmentSlot: AttachmentSlot = 'muzzle';
  private readonly shell: HTMLElement;

  constructor(root: HTMLElement, private readonly callbacks: GameUICallbacks) {
    root.innerHTML = `
      <div class="game-shell">
        <main class="game-stage" aria-label="전투 화면">
          <div id="canvas-host" class="canvas-host"></div>
          <header class="top-hud">
            <div class="brand"><span class="brand-mark"></span><strong>좀비 샷</strong></div>
            <div class="enemy-card" tabindex="0" aria-live="polite"><div class="enemy-heading"><span id="level-text">일반 감염체</span><span id="hp-text">22 / 22</span></div><div class="hp-track" aria-label="체력"><span id="hp-fill"></span></div><div class="enemy-vitals">
              <div class="enemy-stat enemy-armor"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v5.8c0 4.7-3.2 8.1-8 9.5-4.8-1.4-8-4.8-8-9.5V6l8-3.2Z"/><path d="M12 6.2v11.1"/></svg><span><small>방어</small><strong id="armor-text">0</strong></span></div>
              <div class="enemy-stat enemy-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong><b id="impact-text">0</b><em id="impact-threshold">/5</em></strong></span><i><b id="impact-fill"></b></i></div>
              <div class="enemy-stat enemy-advance"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 5 7 7-7 7M10 5l7 7-7 7M17 5l4 7-4 7"/></svg><span><small>다음 접근</small><strong id="next-move-text">2.0 m</strong></span></div>
              <div id="intent-card" class="enemy-intent" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17.2v.2"/></svg><span><small id="intent-timing">다음 행동</small><strong id="intent-name">특수 행동</strong></span></div>
            </div><div id="enemy-status" class="enemy-status-list" hidden></div><div id="enemy-context" class="enemy-context" role="note"></div></div>
            <div class="utility-stack"><div class="distance-card"><small id="range-band-text">중거리 · 화력 -10%</small><strong id="distance-text">8.0 m</strong></div><div class="audio-controls" aria-label="오디오 설정"><button id="audio-mute" type="button" aria-pressed="false"><span>음향</span><strong id="audio-state">켜짐</strong></button><label><span class="sr-only">전체 음량</span><input id="audio-volume" type="range" min="0" max="1" step="0.05" value="0.65" aria-label="전체 음량" /></label></div><button id="inventory-button" class="inventory-open-button" type="button" data-open-ammo-inventory aria-label="보유 탄약" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 15h6v4h-6z"/></svg><span>보유 탄약</span></button></div>
          </header>
          <aside class="phase-panel"><span id="wave-text" class="eyebrow">조우 1/5 · 표적 1/1</span><strong id="phase-text">전투 준비</strong></aside>
          <aside id="preview-outcome" class="combat-forecast" aria-label="발사 결과 예상" aria-live="polite" hidden></aside>
        </main>
        <section class="tactical-console" aria-label="전투 준비">
          <div class="loadout" aria-label="탄창과 부착물 구성 영역">
          <div class="ammo-rack"><div class="section-label"><span>탄약</span></div><div class="ammo-options">
            ${AMMO_ORDER.map((ammo) => { const definition = AMMO_DEFINITIONS[ammo]; return `<button class="ammo-token ammo-${ammo}" style="--bullet:${definition.cssColor}" data-ammo="${ammo}" aria-label="${definition.name}: ${definition.role}"><span class="round-visual"><i></i></span><span><strong>${definition.name}</strong><small>${RARITY_NAMES[definition.rarity]} · ${BUILD_TAG_NAMES[definition.tags[0]!]}</small></span><b class="stock-count" data-stock="${ammo}"></b></button>`; }).join('')}
          </div></div>
          <div class="magazine-panel"><div class="section-label"><span>발사 순서</span></div><div class="magazine-row"><div class="magazine-slots" role="group" aria-label="탄창 슬롯">
            ${Array.from({ length: COMBAT_BALANCE.maximumMagazineCapacity }, (_, index) => `<button class="mag-slot" data-slot="${index}" aria-label="${index + 1}번 탄창 슬롯"><span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span></button>`).join('')}
          </div><button id="load-button" class="load-button" disabled><span>탄창 장전</span></button></div></div>
          <section id="attachment-bay" class="attachment-bay" aria-label="부착물 구성"><div class="section-label"><span>부착물</span><small id="attachment-count">보유 0/10</small></div><div class="attachment-workspace">
            <div class="attachment-tabs" role="tablist" aria-label="부착물 슬롯">${ATTACHMENT_SLOT_ORDER.map((slot, index) => `<button type="button" role="tab" class="attachment-slot-tab" data-attachment-slot="${slot}" aria-controls="attachment-group-${slot}" aria-selected="${index === 0}"><small>${ATTACHMENT_SLOT_NAMES[slot]}</small><strong data-current-attachment="${slot}">비어 있음</strong></button>`).join('')}</div>
            <div class="attachment-groups">${ATTACHMENT_SLOT_ORDER.map((slot, index) => `<section id="attachment-group-${slot}" class="attachment-group" data-attachment-group="${slot}" role="tabpanel" ${index === 0 ? '' : 'hidden'}>${ATTACHMENT_ORDER.filter((id) => ATTACHMENT_DEFINITIONS[id].slot === slot).map((id) => { const item = ATTACHMENT_DEFINITIONS[id]; return `<button type="button" class="attachment-option" data-attachment="${id}"><span><strong>${item.name}</strong><small>${item.summary}</small></span><em><span class="attachment-rarity" data-rarity="${item.rarity}">${ATTACHMENT_RARITY_NAMES[item.rarity]}</span> · <span data-ownership>미획득</span></em></button>`; }).join('')}</section>`).join('')}</div>
          </div></section>
        </div></section>
        <aside id="ammo-tooltip" class="ammo-tooltip" role="tooltip" hidden></aside>
        <section id="route-choice" class="route-choice" hidden aria-label="다음 조우 경로 선택"><div class="route-card"><h2>경로 선택</h2><div id="route-options" class="route-options"></div></div></section>
        <section id="attachment-reward" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="attachment-reward-title"></section>
        <section id="ammo-reward" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="ammo-reward-title"></section>
        <section id="ammo-inventory" class="route-choice ammo-inventory-overlay" hidden role="dialog" aria-modal="true" aria-labelledby="ammo-inventory-title"></section>
        <div class="build-id" data-testid="build-id" aria-label="배포 빌드 식별자">${BUILD_LABEL}</div>
        <div id="game-over" class="game-over" hidden><div class="game-over-card"><h2 id="end-title">감염체가 방어선을 돌파했습니다</h2><button id="restart-button">다시 시작</button></div></div>
      </div>`;

    this.shell = this.required(root, '.game-shell');
    this.updateResponsiveLayout();

    this.hpFill = this.required(root, '#hp-fill');
    this.hpText = this.required(root, '#hp-text');
    this.armorText = this.required(root, '#armor-text');
    this.impactText = this.required(root, '#impact-text');
    this.impactThreshold = this.required(root, '#impact-threshold');
    this.impactFill = this.required(root, '#impact-fill');
    this.enemyStatus = this.required(root, '#enemy-status');
    this.enemyContext = this.required(root, '#enemy-context');
    this.nextMoveText = this.required(root, '#next-move-text');
    this.distanceText = this.required(root, '#distance-text');
    this.rangeBandText = this.required(root, '#range-band-text');
    this.levelText = this.required(root, '#level-text');
    this.waveText = this.required(root, '#wave-text');
    this.phaseText = this.required(root, '#phase-text');
    this.loadButton = this.required(root, '#load-button') as HTMLButtonElement;
    this.overlay = this.required(root, '#game-over');
    this.audioMute = this.required(root, '#audio-mute') as HTMLButtonElement;
    this.audioState = this.required(root, '#audio-state');
    this.audioVolume = this.required(root, '#audio-volume') as HTMLInputElement;
    this.previewOutcome = this.required(root, '#preview-outcome');
    this.intentCard = this.required(root, '#intent-card');
    this.attachmentBay = this.required(root, '#attachment-bay');
    this.attachmentTabs = [...root.querySelectorAll<HTMLButtonElement>('[data-attachment-slot]')];
    this.routeChoice = this.required(root, '#route-choice');
    this.endTitle = this.required(root, '#end-title');
    this.ammoTooltip = this.required(root, '#ammo-tooltip');
    this.ammoInventory = this.required(root, '#ammo-inventory');
    this.slots = [...root.querySelectorAll<HTMLButtonElement>('.mag-slot')];

    root.querySelectorAll<HTMLButtonElement>('.ammo-token').forEach((button) => {
      const ammo = button.dataset.ammo as AmmoType;
      button.addEventListener('click', () => {
        if (this.consumeSuppressedClick() || !this.isAmmoSelectable(ammo)) return;
        this.callbacks.onAddAmmo(ammo);
      });
      this.bindPointerDrag(button, () => this.isAmmoSelectable(ammo) ? ({ ammo }) : undefined);
      this.bindHoverTooltip(button, () => this.showAmmoTooltip(ammo, button));
      this.bindTouchTooltip(button, () => this.showAmmoTooltip(ammo, button));
    });

    this.slots.forEach((slot, index) => {
      slot.addEventListener('click', () => {
        if (this.consumeSuppressedClick() || this.locked) return;
        this.handleSlotTap(index);
      });
      this.bindPointerDrag(slot, () => this.rounds[index] ? ({ sourceIndex: index }) : undefined);
      this.bindHoverTooltip(slot, () => {
        const ammo = this.rounds[index];
        if (ammo) this.showAmmoTooltip(ammo, slot);
      });
      this.bindTouchTooltip(slot, () => {
        const ammo = this.rounds[index];
        if (ammo) this.showAmmoTooltip(ammo, slot);
      });
    });
    this.attachmentTabs.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.activeAttachmentSlot = button.dataset.attachmentSlot as AttachmentSlot;
        this.updateAttachmentPanel();
      });
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const lastIndex = this.attachmentTabs.length - 1;
        const nextIndex = event.key === 'Home' ? 0
          : event.key === 'End' ? lastIndex
            : event.key === 'ArrowLeft' ? (index - 1 + this.attachmentTabs.length) % this.attachmentTabs.length
              : (index + 1) % this.attachmentTabs.length;
        const next = this.attachmentTabs[nextIndex];
        if (!next) return;
        this.activeAttachmentSlot = next.dataset.attachmentSlot as AttachmentSlot;
        this.updateAttachmentPanel();
        next.focus();
      });
    });
    root.querySelectorAll<HTMLButtonElement>('[data-attachment]').forEach((button) => {
      button.addEventListener('click', () => {
        if (this.consumeSuppressedClick()) return;
        const id = button.dataset.attachment as AttachmentId;
        if (!this.locked) {
          this.hideTooltip();
          if (button.getAttribute('aria-pressed') === 'true') this.callbacks.onUnequipAttachment(ATTACHMENT_DEFINITIONS[id].slot);
          else this.callbacks.onEquipAttachment(id);
        }
      });
      const id = button.dataset.attachment as AttachmentId;
      this.bindHoverTooltip(button, () => this.showAttachmentTooltip(id, button));
      this.bindTouchTooltip(button, () => this.showAttachmentTooltip(id, button));
    });
    this.audioMute.addEventListener('click', () => this.callbacks.onAudioMutedChange(this.audioMute.getAttribute('aria-pressed') !== 'true'));
    this.audioVolume.addEventListener('input', () => this.callbacks.onAudioVolumeChange(Number(this.audioVolume.value)));
    this.loadButton.addEventListener('click', () => { if (!this.locked) this.callbacks.onLoad(); });
    this.required(root, '#inventory-button').addEventListener('click', (event) => this.openAmmoInventory(event.currentTarget as HTMLButtonElement));
    this.required(root, '#restart-button').addEventListener('click', this.callbacks.onRestart);
    window.addEventListener('blur', this.resetDragVisuals);
    window.addEventListener('resize', this.resetDragVisuals);
    window.addEventListener('resize', this.updateResponsiveLayout);
    window.visualViewport?.addEventListener('resize', this.updateResponsiveLayout);
    document.addEventListener('visibilitychange', this.resetDragVisuals);
    document.addEventListener('pointerdown', (event) => {
      if (!(event.target as Element).closest('.ammo-token, .mag-slot, .attachment-option')) this.hideTooltip();
    });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') this.hideTooltip(); });
  }

  get canvasHost(): HTMLElement { return document.querySelector<HTMLElement>('#canvas-host')!; }

  renderMagazine(rounds: readonly AmmoType[], stock: AmmoStock = this.stock, capacity: number = this.magazineCapacity, build: AmmoBuild = this.build, specialCapacity: number = this.specialCapacity): void {
    this.rounds = [...rounds];
    this.stock = { ...stock };
    this.magazineCapacity = capacity;
    const slotHost = this.slots[0]?.parentElement;
    slotHost?.style.setProperty('--mag-capacity', String(capacity));
    this.slots.forEach((slot, index) => {
      slot.hidden = index >= capacity;
      const ammo = rounds[index];
      slot.className = `mag-slot${ammo ? ` filled ammo-${ammo}` : ''}`;
      slot.innerHTML = ammo ? `<span class="slot-index">0${index + 1}</span><span class="round-visual"><i></i></span><strong>${AMMO_DEFINITIONS[ammo].shortName}</strong>` : `<span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span>`;
      slot.setAttribute('aria-label', ammo ? `${index + 1}번 슬롯: ${AMMO_DEFINITIONS[ammo].name}, 탭하여 즉시 제거` : `${index + 1}번 빈 슬롯`);
      slot.setAttribute('aria-pressed', 'false');
    });
    this.loadButton.disabled = this.locked || rounds.length === 0;
    this.renderAmmoStock(stock, build, specialCapacity, rounds);
    this.updateLoadButton();
  }

  renderAmmoStock(stock: AmmoStock, build: AmmoBuild, capacity: number, reserved: readonly AmmoType[]): void {
    this.stock = { ...stock };
    this.build = { ...build };
    this.specialCapacity = capacity;
    const visibleCount = AMMO_ORDER.filter(ammo => ammo === 'standard' || build[ammo] > 0).length;
    const options = this.required(this.shell, '.ammo-options');
    options.style.setProperty('--ammo-columns', String(Math.max(1, Math.min(5, visibleCount))));
    this.shell.querySelectorAll<HTMLButtonElement>('.ammo-token').forEach(button => {
      const ammo = button.dataset.ammo as AmmoType;
      const count = stock[ammo];
      const loaded = reserved.filter(value => value === ammo).length;
      button.hidden = ammo !== 'standard' && build[ammo] === 0;
      const unavailable = this.locked || (count !== 'infinite' && count - loaded <= 0);
      button.disabled = false;
      button.setAttribute('aria-disabled', String(unavailable));
      const label = ammo === 'standard' ? '∞' : count + ' / ' + build[ammo];
      button.querySelector<HTMLElement>('.stock-count')!.textContent = label;
      button.setAttribute('aria-label', AMMO_DEFINITIONS[ammo].name + ' · ' + RARITY_NAMES[AMMO_DEFINITIONS[ammo].rarity] + ' · ' + label + ' · 장전 예약 ' + loaded + '발');
    });
  }

  showAmmoRewards(options: readonly SpecialAmmoType[], build: AmmoBuild, stock: AmmoStock, _capacity: number, selected?: SpecialAmmoType, replacements: readonly SpecialAmmoType[] = []): void {
    this.hideTooltip();
    const host = this.required(this.shell, '#ammo-reward');
    const current = AMMO_ORDER.filter((ammo): ammo is SpecialAmmoType => ammo !== 'standard' && build[ammo] > 0);
    const choices = selected
      ? current.filter(ammo => build[ammo] > replacements.filter(value => value === ammo).length).map(ammo => `<button type="button" class="route-option ammo-reward-option" style="--bullet:${AMMO_DEFINITIONS[ammo].cssColor}" data-replace-reward="${ammo}">${this.ammoRarityMarkup(ammo)}<strong>${AMMO_DEFINITIONS[ammo].name}</strong><em>보유 ×${stock[ammo]} · 교체 ×1</em></button>`).join('')
      : options.map(ammo => `<button type="button" class="route-option ammo-reward-option" style="--bullet:${AMMO_DEFINITIONS[ammo].cssColor}" data-ammo-reward="${ammo}">${this.ammoRarityMarkup(ammo)}<strong>${AMMO_DEFINITIONS[ammo].name}</strong>${ammoStatsMarkup(ammo)}<em>보유 ×${stock[ammo]} · +${rewardAmount(ammo)}</em></button>`).join('');
    host.innerHTML = `<div class="route-card reward-card">
      <header class="ammo-screen-header"><h2 id="ammo-reward-title">탄약 보급</h2><button type="button" data-open-ammo-inventory aria-haspopup="dialog">보유 탄약</button></header>
      <div class="reward-options">${choices}</div>
      <div class="reward-actions"><button type="button" data-skip-ammo-reward>넘기기</button></div>
    </div>`;
    host.querySelectorAll<HTMLButtonElement>('[data-ammo-reward]').forEach(button => button.addEventListener('click', () => this.callbacks.onChooseAmmoReward(button.dataset.ammoReward as SpecialAmmoType)));
    host.querySelectorAll<HTMLButtonElement>('[data-replace-reward]').forEach(button => button.addEventListener('click', () => this.callbacks.onReplaceReward(button.dataset.replaceReward as SpecialAmmoType)));
    host.querySelector<HTMLButtonElement>('[data-open-ammo-inventory]')?.addEventListener('click', (event) => this.openAmmoInventory(event.currentTarget as HTMLButtonElement));
    host.querySelector<HTMLButtonElement>('[data-skip-ammo-reward]')?.addEventListener('click', this.callbacks.onSkipAmmoReward);
    host.hidden = false;
    host.querySelector<HTMLButtonElement>('button')?.focus();
  }

  showAttachmentReward(id: AttachmentId | undefined, loadout: LoadoutSnapshot): void {
    this.hideTooltip();
    const host = this.required(this.shell, '#attachment-reward');
    const item = id ? ATTACHMENT_DEFINITIONS[id] : undefined;
    const replaced = item ? loadout[item.slot] : undefined;
    host.innerHTML = `<div class="route-card attachment-reward-card">
      <h2 id="attachment-reward-title">${item ? item.name : '모든 부착물을 수집했습니다'}</h2>
      ${item ? `<p class="attachment-rarity" data-rarity="${item.rarity}">${ATTACHMENT_RARITY_NAMES[item.rarity]} · ${ATTACHMENT_SLOT_NAMES[item.slot]}</p>
      <div class="attachment-reward-effect">${item.summary}</div>
      <div class="reward-options"><button type="button" class="route-option" data-claim-attachment="equip"><strong>${replaced ? '교체' : '장착'}</strong></button><button type="button" class="route-option" data-claim-attachment="store"><strong>보관</strong></button></div>`
      : '<button type="button" class="route-option" data-claim-attachment="store">계속</button>'}
    </div>`;
    host.querySelectorAll<HTMLButtonElement>('[data-claim-attachment]').forEach(button => button.addEventListener('click', () => this.callbacks.onClaimAttachment(button.dataset.claimAttachment === 'equip')));
    host.onkeydown = event => {
      if (event.key !== 'Tab') return;
      const buttons = [...host.querySelectorAll<HTMLButtonElement>('button')];
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    host.hidden = false;
    host.querySelector<HTMLButtonElement>('button')?.focus();
  }

  hideAttachmentReward(): void { this.required(this.shell, '#attachment-reward').hidden = true; }

  hideAmmoRewards(): void {
    const host = this.required(this.shell, '#ammo-reward');
    host.hidden = true;
  }

  setLocked(locked: boolean): void {
    this.locked = locked;
    this.attachmentTabs.forEach((button) => {
      button.disabled = locked || button.dataset.sealed === 'true';
    });
    this.attachmentBay.querySelectorAll<HTMLButtonElement>('[data-attachment]').forEach((button) => {
      button.disabled = locked || button.dataset.sealed === 'true' || button.dataset.owned !== 'true';
    });
    this.renderMagazine(this.rounds, this.stock, this.magazineCapacity);
  }

  renderLoadout(loadout: LoadoutSnapshot, playerState: PlayerCombatState, capacity: number, owned: readonly AttachmentId[] = []): void {
    this.required(this.shell, '#attachment-count').textContent = `보유 ${owned.length}/${ATTACHMENT_ORDER.length}`;
    this.magazineCapacity = capacity;
    ATTACHMENT_SLOT_ORDER.forEach((slot) => {
      const id = loadout[slot];
      const disabledTurns = playerState.disabledSlots[slot] ?? 0;
      const label = id ? ATTACHMENT_DEFINITIONS[id].name : '비어 있음';
      const tab = this.attachmentBay.querySelector<HTMLButtonElement>(`[data-attachment-slot="${slot}"]`);
      const current = tab?.querySelector<HTMLElement>(`[data-current-attachment="${slot}"]`);
      if (current) current.textContent = disabledTurns ? `봉쇄 ${disabledTurns}턴` : label;
      tab?.classList.toggle('is-disrupted', disabledTurns > 0);
      tab?.setAttribute('aria-label', `${ATTACHMENT_SLOT_NAMES[slot]}: ${disabledTurns ? `${disabledTurns}턴 봉쇄` : label}`);
      if (tab) {
        tab.dataset.sealed = String(disabledTurns > 0);
        tab.disabled = this.locked || disabledTurns > 0;
      }
    });
    this.attachmentBay.querySelectorAll<HTMLButtonElement>('[data-attachment]').forEach((button) => {
      const id = button.dataset.attachment as AttachmentId;
      const slot = ATTACHMENT_DEFINITIONS[id].slot;
      const selected = loadout[slot] === id;
      const sealed = Boolean(playerState.disabledSlots[slot]);
      button.classList.toggle('is-equipped', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.dataset.sealed = String(sealed);
      button.dataset.owned = String(owned.includes(id));
      const ownership = button.querySelector('[data-ownership]');
      if (ownership) ownership.textContent = selected ? '장착 중 · 다시 눌러 해제' : owned.includes(id) ? '보유' : '미획득';
      button.setAttribute('aria-label', `${ATTACHMENT_DEFINITIONS[id].name}: ${selected ? '장착 중, 다시 눌러 해제' : ATTACHMENT_DEFINITIONS[id].summary}`);
      button.disabled = this.locked || sealed || !owned.includes(id);
    });
    this.updateAttachmentPanel();
  }

  showRouteChoice(options: readonly RouteOption[]): void {
    const host = this.required(this.routeChoice, '#route-options');
    host.innerHTML = options.map((option) => {
      const enemies = option.roster.map((type) => ENEMY_DEFINITIONS[type].name).join(' · ');
      const intent = option.roster.map((type) => ENEMY_DEFINITIONS[type].intent?.description).filter(Boolean).join(' / ');
      return `<button type="button" class="route-option route-${option.kind}" data-route="${option.kind}"><span>${option.kind === 'special' ? '특수 조우' : '일반 조우'}</span><strong>${option.title}</strong><em>${enemies}</em>${intent ? `<b>${intent}</b>` : ''}<i>${option.reward}</i></button>`;
    }).join('');
    host.querySelectorAll<HTMLButtonElement>('[data-route]').forEach((button) => button.addEventListener('click', () => this.callbacks.onChooseRoute(button.dataset.route as RouteKind)));
    this.routeChoice.hidden = false;
  }

  hideRouteChoice(): void { this.routeChoice.hidden = true; }

  renderAudioPreferences(preferences: AudioPreferences): void {
    this.audioMute.setAttribute('aria-pressed', String(preferences.muted));
    this.audioMute.setAttribute('aria-label', preferences.muted ? '음향 켜기' : '음향 끄기');
    this.audioState.textContent = preferences.muted ? '꺼짐' : '켜짐';
    this.audioVolume.value = String(preferences.volume);
    this.audioVolume.setAttribute('aria-valuetext', `${Math.round(preferences.volume * 100)}%`);
    this.audioVolume.disabled = preferences.muted;
  }

  setPhase(phase: GamePhase): void {
    this.phaseText.textContent = PHASE_LABELS[phase];
    document.body.dataset.phase = phase;
  }

  updateEnemy(enemy: EnemyState, wave: number, waveCount: number, enemyNumber: number, enemyCount: number): void {
    this.hpFill.style.width = `${Math.max(0, enemy.hp / enemy.maxHp) * 100}%`;
    this.hpText.textContent = `${enemy.hp} / ${enemy.maxHp}`;
    this.armorText.textContent = String(enemy.armor);
    this.armorText.closest<HTMLElement>('.enemy-stat')?.toggleAttribute('data-empty', enemy.armor === 0);
    this.impactText.textContent = String(enemy.statuses.impact);
    this.impactThreshold.textContent = `/${enemy.staggerThreshold}`;
    this.impactFill.style.width = `${Math.min(100, enemy.statuses.impact / enemy.staggerThreshold * 100)}%`;
    this.impactText.closest<HTMLElement>('.enemy-stat')?.toggleAttribute('data-empty', enemy.statuses.impact === 0);
    const statuses: string[] = [];
    if (enemy.statuses.burnTurns) statuses.push(`<span data-status="burn">화상 ${enemy.statuses.burnTurns}</span>`);
    if (enemy.statuses.slowTurns) statuses.push(`<span data-status="slow">둔화 ${enemy.statuses.slowTurns}</span>`);
    if (enemy.statuses.staggerTurns) statuses.push('<span data-status="stagger">이동 억제</span>');
    if (enemy.statuses.shockTurns) statuses.push('<span data-status="shock">전하 교란</span>');
    if (enemy.statuses.exposedShots) statuses.push('<span data-status="exposed">노출</span>');
    if (enemy.statuses.corruptedShots) statuses.push(`<span data-status="corruption">침식 ${enemy.statuses.corruptedShots}</span>`);
    this.enemyStatus.innerHTML = statuses.join('');
    this.enemyStatus.hidden = statuses.length === 0;
    this.distanceText.textContent = `${enemy.distance.toFixed(1)} m`;
    const rangeBand = getRangeBand(enemy.distance);
    this.rangeBandText.textContent = `${RANGE_NAMES[rangeBand]} · ${formatRangePenalty(SERVICE_45.rangePenaltyPercentages[rangeBand])}`;
    this.levelText.textContent = ENEMY_DEFINITIONS[enemy.type].name;
    this.waveText.textContent = `조우 ${wave}/${waveCount} · 표적 ${enemyNumber}/${enemyCount}`;
    this.intentCard.hidden = !enemy.intent;
    const intentDetail = enemy.intent?.description.replace('다음 행동: ', '');
    if (enemy.intent) {
      this.required(this.intentCard, '#intent-timing').textContent = enemy.intent.countdown <= 1 ? '다음 행동' : `${enemy.intent.countdown}행동 후`;
      this.required(this.intentCard, '#intent-name').textContent = enemy.intent.name;
    }
    this.enemyContext.innerHTML = `<span><b>방어</b> 피해를 먼저 흡수합니다.</span><span><b>충격</b> 가득 차면 다음 접근과 특수 행동이 지연됩니다.</span><span><b>다음 접근</b> 연속 사격의 반동 접근과 이후 이동 합계입니다.</span>${intentDetail ? `<span class="intent-detail"><b>${enemy.intent!.name}</b> ${intentDetail}</span>` : ''}`;
    this.enemyContext.parentElement?.setAttribute('aria-label', `${ENEMY_DEFINITIONS[enemy.type].name}, 체력 ${enemy.hp}/${enemy.maxHp}, 방어 ${enemy.armor}, 충격 ${enemy.statuses.impact}/${enemy.staggerThreshold}${enemy.intent ? `, ${enemy.intent.name} ${enemy.intent.countdown}행동 후` : ''}`);
  }

  renderPreview(sequence: SequenceResult | undefined, action: EnemyActionResult | undefined): void {
    const totalMovement = (sequence?.totalRecoilMovement ?? 0) + (action?.movement ?? 0);
    this.nextMoveText.textContent = sequence || action ? `${totalMovement.toFixed(1)} m` : '—';
    this.nextMoveText.closest<HTMLElement>('.enemy-stat')?.toggleAttribute('data-delayed', Boolean(action?.staggerConsumed));
    if (!sequence) {
      this.previewOutcome.hidden = true;
      this.previewOutcome.textContent = '';
      return;
    }
    const rangePenalty = sequence.effectiveRangePenaltyPercent === 0 ? '0%' : `-${sequence.effectiveRangePenaltyPercent}%`;
    this.previewOutcome.innerHTML = `
      <div class="forecast-stat forecast-damage"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg><span><small>총 피해</small><strong>${sequence.totalHpDamage}</strong></span></div>
      <div class="forecast-stat forecast-armor"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v5.8c0 4.7-3.2 8.1-8 9.5-4.8-1.4-8-4.8-8-9.5V6l8-3.2Z"/><path d="M12 6.2v11.1"/></svg><span><small>방어 파괴</small><strong>${sequence.totalArmorDamage}</strong></span></div>
      <div class="forecast-stat forecast-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong>${sequence.totalImpactApplied}</strong></span></div>
      <div class="forecast-stat forecast-range"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg><span><small>거리 감소</small><strong>${rangePenalty}</strong></span></div>`;
    this.previewOutcome.hidden = false;
    this.previewOutcome.setAttribute('aria-label', `예상 총 피해 ${sequence.totalHpDamage}, 방어 파괴 ${sequence.totalArmorDamage}, 충격 ${sequence.totalImpactApplied}, 최종 거리 화력 감소 ${sequence.effectiveRangePenaltyPercent}%`);
  }

  showShot(result: ShotResult): void {
    this.slots.forEach((slot, index) => slot.classList.toggle('is-firing', index === result.index));
  }
  showEndState(title: string, show: boolean): void {
    this.endTitle.textContent = title;
    this.overlay.hidden = !show;
  }

  private ammoRarityMarkup(ammo: AmmoType): string {
    const definition = AMMO_DEFINITIONS[ammo];
    return `<span class="ammo-rarity" data-rarity="${definition.rarity}">${RARITY_NAMES[definition.rarity]}</span>`;
  }

  private ammoQuantity(ammo: AmmoType): string {
    return ammo === 'standard' ? '∞' : `×${this.build[ammo]}`;
  }

  private openAmmoInventory(opener: HTMLButtonElement): void {
    this.hideTooltip();
    this.inventoryOpener = opener;
    this.inventoryBackgroundInert.clear();
    for (const sibling of this.ammoInventory.parentElement?.children ?? []) {
      if (!(sibling instanceof HTMLElement) || sibling === this.ammoInventory) continue;
      this.inventoryBackgroundInert.set(sibling, sibling.inert);
      sibling.inert = true;
    }
    const owned = AMMO_ORDER.filter(ammo => ammo === 'standard' || this.build[ammo] > 0);
    const inventory = owned.map(ammo => `<button type="button" class="ammo-inventory-card" style="--bullet:${AMMO_DEFINITIONS[ammo].cssColor}" data-inspect-ammo="${ammo}" aria-label="${AMMO_DEFINITIONS[ammo].name} ${this.ammoQuantity(ammo)} 상세 보기"><span class="inventory-card-head">${this.ammoRarityMarkup(ammo)}<b>${this.ammoQuantity(ammo)}</b></span><strong>${AMMO_DEFINITIONS[ammo].name}</strong>${ammoStatsMarkup(ammo)}</button>`).join('');
    this.ammoInventory.innerHTML = `<div class="route-card ammo-inventory-dialog">
      <header class="ammo-screen-header"><h2 id="ammo-inventory-title">보유 탄약</h2><button type="button" class="ammo-screen-close" data-close-ammo-inventory aria-label="보유 탄약 닫기">×</button></header>
      <div class="ammo-inventory-panel"><div class="ammo-inventory-grid">${inventory}</div></div>
      <button type="button" class="ammo-inspect-layer" data-ammo-inspect hidden aria-label="탄약 상세 닫기"></button>
    </div>`;
    const inspectLayer = this.required(this.ammoInventory, '[data-ammo-inspect]') as HTMLButtonElement;
    this.ammoInventory.querySelector<HTMLButtonElement>('[data-close-ammo-inventory]')?.addEventListener('click', () => this.closeAmmoInventory());
    this.ammoInventory.querySelectorAll<HTMLButtonElement>('[data-inspect-ammo]').forEach(button => button.addEventListener('click', () => {
      this.inspectedAmmoButton = button;
      const ammo = button.dataset.inspectAmmo as AmmoType;
      const definition = AMMO_DEFINITIONS[ammo];
      inspectLayer.style.setProperty('--bullet', definition.cssColor);
      inspectLayer.innerHTML = `<span class="ammo-inspect-card"><span class="inventory-card-head">${this.ammoRarityMarkup(ammo)}<b>${this.ammoQuantity(ammo)}</b></span><span class="inspect-round"><span class="round-visual"><i></i></span></span><strong>${definition.name}</strong>${ammoStatsMarkup(ammo)}</span>`;
      inspectLayer.hidden = false;
      inspectLayer.focus();
    }));
    inspectLayer.addEventListener('click', () => {
      inspectLayer.hidden = true;
      this.inspectedAmmoButton?.focus();
    });
    this.ammoInventory.onkeydown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!inspectLayer.hidden) inspectLayer.click();
        else this.closeAmmoInventory();
        return;
      }
      if (event.key !== 'Tab' || !inspectLayer.hidden) return;
      const focusable = [...this.ammoInventory.querySelectorAll<HTMLButtonElement>('button:not([hidden]):not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    this.ammoInventory.hidden = false;
    this.ammoInventory.querySelector<HTMLButtonElement>('[data-inspect-ammo]')?.focus();
  }

  private closeAmmoInventory(): void {
    this.ammoInventory.hidden = true;
    this.ammoInventory.onkeydown = null;
    for (const [element, wasInert] of this.inventoryBackgroundInert) element.inert = wasInert;
    this.inventoryBackgroundInert.clear();
    this.inventoryOpener?.focus();
    this.inventoryOpener = undefined;
    this.inspectedAmmoButton = undefined;
  }

  private required(root: HTMLElement, selector: string): HTMLElement {
    const element = root.querySelector<HTMLElement>(selector);
    if (!element) throw new Error(`UI 요소를 찾을 수 없습니다: ${selector}`);
    return element;
  }

  private handleSlotTap(index: number): void {
    if (this.rounds[index]) this.callbacks.onRemoveAmmo(index);
  }

  private updateLoadButton(): void {
    const label = this.loadButton.querySelector<HTMLElement>('span')!;
    label.textContent = '탄창 장전';
    this.loadButton.disabled = this.locked || this.rounds.length === 0;
    this.loadButton.setAttribute('aria-label', this.rounds.length ? `${this.rounds.length}발 탄창 장전` : '탄창 장전, 탄약 1발 이상 필요');
  }

  private consumeSuppressedClick(): boolean {
    if (!this.suppressClick) return false;
    this.suppressClick = false;
    return true;
  }

  private isAmmoSelectable(ammo: AmmoType): boolean {
    const count = this.stock[ammo];
    const loaded = this.rounds.filter(value => value === ammo).length;
    return !this.locked && (count === 'infinite' || count - loaded > 0);
  }

  private readonly resetDragVisuals = (): void => {
    this.gestureVersion += 1;
    document.body.classList.remove('ammo-drag-active');
    document.querySelectorAll('.is-dragging, .drop-target').forEach((element) => element.classList.remove('is-dragging', 'drop-target'));
    this.hideTooltip();
  };

  private readonly updateResponsiveLayout = (): void => {
    applyResponsiveLayoutMode(this.shell);
  };

  private showAmmoTooltip(ammo: AmmoType, anchor: HTMLElement): void {
    this.hideTooltip();
    const definition = AMMO_DEFINITIONS[ammo];
    const buildup = definition.buildup ? ` · ${this.statusLabel(definition.buildup.type)} 축적 ${definition.buildup.amount}` : '';
    const range = definition.rangePenaltyReduction ? `<span>거리 손실 <b>-${definition.rangePenaltyReduction}%p</b></span>` : '';
    this.ammoTooltip.innerHTML = `<header><span>${RARITY_NAMES[definition.rarity]} · ${BUILD_TAG_NAMES[definition.tags[0]!]}</span><strong>${definition.name}</strong></header><p>${definition.role}</p><div><span>화력 <b>${definition.firepower}</b></span><span>반동 <b>+${definition.recoil}</b></span><span>방어 파괴 <b>${definition.armorBreak}</b></span><span>충격 <b>${definition.impact}</b></span>${range}</div><small>반동: 연속 사격 시 재조준이 길어져 좀비가 더 접근합니다.${buildup}</small>`;
    this.ammoTooltip.style.setProperty('--tooltip-color', definition.cssColor);
    this.ammoTooltip.classList.remove('is-attachment');
    this.ammoTooltip.hidden = false;
    anchor.setAttribute('aria-describedby', 'ammo-tooltip');
  }

  private showAttachmentTooltip(id: AttachmentId, anchor: HTMLElement): void {
    this.hideTooltip();
    const definition = ATTACHMENT_DEFINITIONS[id];
    this.ammoTooltip.innerHTML = `<header><span>${ATTACHMENT_SLOT_NAMES[definition.slot]} · ${ATTACHMENT_RARITY_NAMES[definition.rarity]}</span><strong>${definition.name}</strong></header><p>${definition.summary}</p>`;
    this.ammoTooltip.style.setProperty('--tooltip-color', '#c8ff4d');
    this.ammoTooltip.classList.add('is-attachment');
    this.ammoTooltip.hidden = false;
    anchor.setAttribute('aria-describedby', 'ammo-tooltip');
  }

  private hideTooltip(): void {
    this.ammoTooltip.hidden = true;
    document.querySelectorAll('[aria-describedby="ammo-tooltip"]').forEach((element) => element.removeAttribute('aria-describedby'));
  }

  private statusLabel(status: string): string {
    return ({ burn: '열기', chill: '냉기', shock: '전하', corruption: '침식' } as Record<string, string>)[status] ?? status;
  }

  private updateAttachmentPanel(): void {
    this.attachmentTabs.forEach((button) => {
      const selected = button.dataset.attachmentSlot === this.activeAttachmentSlot;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    this.attachmentBay.querySelectorAll<HTMLElement>('[data-attachment-group]').forEach((group) => {
      group.hidden = group.dataset.attachmentGroup !== this.activeAttachmentSlot;
    });
  }

  private bindHoverTooltip(element: HTMLButtonElement, show: () => void): void {
    let timer: number | undefined;
    const clear = (): void => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    element.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      clear();
      timer = window.setTimeout(show, 500);
    });
    element.addEventListener('pointerleave', () => {
      clear();
      this.hideTooltip();
    });
    element.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') {
        clear();
        this.hideTooltip();
      }
    });
    element.addEventListener('blur', () => {
      clear();
      this.hideTooltip();
    });
    element.addEventListener('focus', () => {
      clear();
      show();
    });
  }

  private bindTouchTooltip(element: HTMLButtonElement, show: () => void): void {
    element.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' || event.button !== 0) return;
      const startX = event.clientX;
      const startY = event.clientY;
      let longPressed = false;
      const timer = window.setTimeout(() => {
        longPressed = true;
        show();
      }, 520);
      const move = (moveEvent: PointerEvent): void => {
        if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) >= 8) window.clearTimeout(timer);
      };
      const cleanup = (): void => {
        window.clearTimeout(timer);
        element.removeEventListener('pointermove', move);
        element.removeEventListener('pointerup', end);
        element.removeEventListener('pointercancel', cancel);
      };
      const end = (): void => {
        cleanup();
        if (!longPressed) return;
        this.suppressClick = true;
        window.setTimeout(() => { this.suppressClick = false; }, 0);
      };
      const cancel = (): void => cleanup();
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerup', end);
      element.addEventListener('pointercancel', cancel);
    });
  }

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
          this.hideTooltip();
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
