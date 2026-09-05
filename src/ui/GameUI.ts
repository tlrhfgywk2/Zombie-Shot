import { ammoStatsMarkup } from './AmmoView';
import { getRangeBand } from '../combat/CombatResolver';
import type { AmmoType, AttachmentSlot, EnemyActionResult, EnemyState, PlayerCombatState, SequenceResult, ShotResult } from '../combat/types';
import { BUILD_LABEL } from '../buildInfo';
import type { GamePhase } from '../core/GameStateMachine';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_ORDER, ATTACHMENT_RARITY_NAMES, SERVICE_45, ATTACHMENT_SLOT_NAMES, ATTACHMENT_SLOT_ORDER, type AttachmentId, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS, AMMO_ORDER, AMMO_BUILD_BALANCE, createAmmoBuild, createStageStock, countAllocations, rewardAmount, type AmmoBuild, type SpecialAmmoType, BUILD_TAG_NAMES, COMBAT_BALANCE, RANGE_NAMES, RARITY_NAMES, type AmmoStock } from '../data/ammoDefinitions';
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
  onCancelReward: () => void;
  onChooseRoute: (kind: RouteKind) => void;
  onAudioMutedChange: (muted: boolean) => void;
  onAudioVolumeChange: (volume: number) => void;
  onLoad: () => void;
  onRestart: () => void;
}

const PHASE_LABELS: Record<GamePhase, string> = {
  ATTACHMENT_REWARD: '부착물 획득', AMMO_REWARD: '탄약 배분', AMMO_SELECTION: '전투 준비', LOADING: '장전 중', FIRING: '사격 중', ENEMY_ACTION: '적 행동', ROUTE_SELECTION: '경로 선택', GAME_OVER: '게임 오버', VICTORY: '실험 완료',
};

export class GameUI {
  private readonly hpFill: HTMLElement;
  private readonly hpText: HTMLElement;
  private readonly armorText: HTMLElement;
  private readonly enemyStatus: HTMLElement;
  private readonly distanceText: HTMLElement;
  private readonly rangeBandText: HTMLElement;
  private readonly accuracyText: HTMLElement;
  private readonly levelText: HTMLElement;
  private readonly waveText: HTMLElement;
  private readonly phaseText: HTMLElement;
  private readonly statusText: HTMLElement;
  private readonly loadButton: HTMLButtonElement;
  private readonly slots: HTMLButtonElement[];
  private readonly overlay: HTMLElement;
  private readonly combatLog: HTMLElement;
  private readonly audioMute: HTMLButtonElement;
  private readonly audioState: HTMLElement;
  private readonly audioVolume: HTMLInputElement;
  private readonly previewChain: HTMLElement;
  private readonly previewOutcome: HTMLElement;
  private readonly intentCard: HTMLElement;
  private readonly attachmentBay: HTMLElement;
  private readonly attachmentTabs: HTMLButtonElement[];
  private readonly routeChoice: HTMLElement;
  private readonly magazineOrderLabel: HTMLElement;
  private readonly endEyebrow: HTMLElement;
  private readonly endTitle: HTMLElement;
  private readonly endDetail: HTMLElement;
  private readonly ammoTooltip: HTMLElement;
  private rounds: readonly AmmoType[] = [];
  private build = createAmmoBuild();
  private stock: AmmoStock = createStageStock(this.build);
  private specialCapacity: number = AMMO_BUILD_BALANCE.specialCapacity;
  private locked = false;
  private magazineCapacity: number = COMBAT_BALANCE.baseMagazineCapacity;
  private selectedIndex: number | null = null;
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
            <div class="brand"><span class="brand-mark"></span><div><small>전술 생존 실험</small><strong>좀비 샷</strong></div></div>
            <div class="enemy-card" aria-live="polite"><div class="enemy-heading"><span id="level-text">일반 감염체</span><span id="hp-text">76 / 76</span></div><div class="hp-track"><span id="hp-fill"></span></div><div class="enemy-meta"><span id="armor-text">방어 0</span><span id="enemy-status">상태 없음</span></div><div id="intent-card" class="enemy-intent" hidden></div></div>
            <div class="utility-stack"><div class="distance-card"><small id="range-band-text">중거리</small><strong id="distance-text">8.0 m</strong></div><div class="audio-controls" aria-label="오디오 설정"><button id="audio-mute" type="button" aria-pressed="false"><span>음향</span><strong id="audio-state">켜짐</strong></button><label><span class="sr-only">전체 음량</span><input id="audio-volume" type="range" min="0" max="1" step="0.05" value="0.65" aria-label="전체 음량" /></label></div></div>
          </header>
          <aside class="phase-panel"><span id="wave-text" class="eyebrow">조우 1/5 · 표적 1/1</span><strong id="phase-text">전투 준비</strong><p id="status-text">탄약과 장착물을 조합하세요.</p><div class="combat-metrics"><span>예상 정확도 <strong id="accuracy-text">100%</strong></span></div><div id="combat-log" class="combat-log" aria-live="assertive"></div></aside>
        </main>
        <section class="tactical-console" aria-label="전술 준비 패널">
          <header class="console-header"><strong>전술 준비 패널</strong><span><i></i>탄약 선택 · 발사 순서 · 부착물 구성을 한곳에서 조정합니다.</span></header>
          <div class="loadout" aria-label="탄창과 부착물 구성 영역">
          <div class="ammo-rack"><div class="section-label"><span>스테이지 탄약</span><small id="ammo-capacity"></small></div><div class="ammo-options">
            ${AMMO_ORDER.map((ammo) => { const definition = AMMO_DEFINITIONS[ammo]; return `<button class="ammo-token ammo-${ammo}" style="--bullet:${definition.cssColor}" data-ammo="${ammo}" aria-label="${definition.name}: ${definition.role}"><span class="ammo-heading"><strong>${definition.name}</strong><small>${RARITY_NAMES[definition.rarity]}</small></span><b class="stock-count" data-stock="${ammo}"></b>${ammoStatsMarkup(ammo)}<small class="ammo-reserved"></small></button>`; }).join('')}
          </div></div>
          <div class="magazine-panel"><div class="section-label"><span>발사 순서</span><small id="magazine-order-label">1 → 4</small></div><div class="sequence-preview" aria-live="polite"><div id="preview-chain">탄약을 장전하면 순서 프리뷰가 표시됩니다.</div><div id="preview-outcome"></div></div><div class="magazine-row"><div class="magazine-slots" role="group" aria-label="탄창 슬롯">
            ${Array.from({ length: COMBAT_BALANCE.maximumMagazineCapacity }, (_, index) => `<button class="mag-slot" data-slot="${index}" aria-label="${index + 1}번 탄창 슬롯"><span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span></button>`).join('')}
          </div><button id="load-button" class="load-button" disabled><span>탄창 장전</span><small>1발 이상 필요</small></button></div></div>
          <section id="attachment-bay" class="attachment-bay" aria-label="부착물 구성"><div class="section-label"><span>${SERVICE_45.name} · 부착물</span><small id="attachment-count">보유 0/10 · 특수 감염체 처치 시 획득</small></div><div class="attachment-workspace">
            <div class="attachment-tabs" role="tablist" aria-label="부착물 슬롯">${ATTACHMENT_SLOT_ORDER.map((slot, index) => `<button type="button" role="tab" class="attachment-slot-tab" data-attachment-slot="${slot}" aria-controls="attachment-group-${slot}" aria-selected="${index === 0}"><small>${ATTACHMENT_SLOT_NAMES[slot]}</small><strong data-current-attachment="${slot}">비어 있음</strong></button>`).join('')}</div>
            <div class="attachment-groups">${ATTACHMENT_SLOT_ORDER.map((slot, index) => `<section id="attachment-group-${slot}" class="attachment-group" data-attachment-group="${slot}" role="tabpanel" ${index === 0 ? '' : 'hidden'}><div><strong>${ATTACHMENT_SLOT_NAMES[slot]} 선택</strong><button type="button" data-unequip="${slot}">해제</button></div>${ATTACHMENT_ORDER.filter((id) => ATTACHMENT_DEFINITIONS[id].slot === slot).map((id) => { const item = ATTACHMENT_DEFINITIONS[id]; return `<button type="button" class="attachment-option" data-attachment="${id}"><span><strong>${item.name}</strong><small>${item.summary}</small></span><em><span class="attachment-rarity" data-rarity="${item.rarity}">${ATTACHMENT_RARITY_NAMES[item.rarity]}</span> · <span data-ownership>미획득</span></em></button>`; }).join('')}</section>`).join('')}</div>
          </div></section>
        </div></section>
        <aside id="ammo-tooltip" class="ammo-tooltip" role="tooltip" hidden></aside>
        <section id="route-choice" class="route-choice" hidden aria-label="다음 조우 경로 선택"><div class="route-card"><span>정찰 보고</span><h2>다음 조우를 선택하세요</h2><p>구간에 진입하면 확정한 배분만큼 특수탄 잔량을 채웁니다. 표준탄은 항상 무한입니다.</p><div id="route-options" class="route-options"></div></div></section>
        <section id="attachment-reward" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="attachment-reward-title"></section>
        <section id="ammo-reward" class="route-choice" hidden aria-label="탄약 배분 보상"></section>
        <div class="build-id" data-testid="build-id" aria-label="배포 빌드 식별자">${BUILD_LABEL}</div>
        <div id="game-over" class="game-over" hidden><div class="game-over-card"><span id="end-eyebrow">생존 실패</span><h2 id="end-title">감염체가 방어선을 돌파했습니다</h2><p id="end-detail">탄약 재고와 순서를 다시 설계해 보세요.</p><button id="restart-button">다시 시작</button></div></div>
      </div>`;

    this.shell = this.required(root, '.game-shell');
    this.updateResponsiveLayout();

    this.hpFill = this.required(root, '#hp-fill');
    this.hpText = this.required(root, '#hp-text');
    this.armorText = this.required(root, '#armor-text');
    this.enemyStatus = this.required(root, '#enemy-status');
    this.distanceText = this.required(root, '#distance-text');
    this.rangeBandText = this.required(root, '#range-band-text');
    this.accuracyText = this.required(root, '#accuracy-text');
    this.levelText = this.required(root, '#level-text');
    this.waveText = this.required(root, '#wave-text');
    this.phaseText = this.required(root, '#phase-text');
    this.statusText = this.required(root, '#status-text');
    this.combatLog = this.required(root, '#combat-log');
    this.loadButton = this.required(root, '#load-button') as HTMLButtonElement;
    this.overlay = this.required(root, '#game-over');
    this.audioMute = this.required(root, '#audio-mute') as HTMLButtonElement;
    this.audioState = this.required(root, '#audio-state');
    this.audioVolume = this.required(root, '#audio-volume') as HTMLInputElement;
    this.previewChain = this.required(root, '#preview-chain');
    this.previewOutcome = this.required(root, '#preview-outcome');
    this.intentCard = this.required(root, '#intent-card');
    this.attachmentBay = this.required(root, '#attachment-bay');
    this.attachmentTabs = [...root.querySelectorAll<HTMLButtonElement>('[data-attachment-slot]')];
    this.routeChoice = this.required(root, '#route-choice');
    this.magazineOrderLabel = this.required(root, '#magazine-order-label');
    this.endEyebrow = this.required(root, '#end-eyebrow');
    this.endTitle = this.required(root, '#end-title');
    this.endDetail = this.required(root, '#end-detail');
    this.ammoTooltip = this.required(root, '#ammo-tooltip');
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
      this.bindPointerDrag(button, () => ({ ammo }), () => this.showAmmoTooltip(ammo, button));
      this.bindHoverTooltip(button, () => this.showAmmoTooltip(ammo, button));
    });

    this.slots.forEach((slot, index) => {
      slot.addEventListener('click', () => {
        if (this.consumeSuppressedClick() || this.locked) return;
        this.handleSlotTap(index);
      });
      this.bindPointerDrag(slot, () => this.rounds[index] ? ({ sourceIndex: index }) : undefined);
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
          this.callbacks.onEquipAttachment(id);
        }
      });
      const id = button.dataset.attachment as AttachmentId;
      this.bindHoverTooltip(button, () => this.showAttachmentTooltip(id, button));
      this.bindTouchTooltip(button, () => this.showAttachmentTooltip(id, button));
    });
    root.querySelectorAll<HTMLButtonElement>('[data-unequip]').forEach((button) => {
      button.addEventListener('click', () => {
        const slot = button.dataset.unequip as AttachmentSlot;
        if (!this.locked) this.callbacks.onUnequipAttachment(slot);
      });
    });
    this.audioMute.addEventListener('click', () => this.callbacks.onAudioMutedChange(this.audioMute.getAttribute('aria-pressed') !== 'true'));
    this.audioVolume.addEventListener('input', () => this.callbacks.onAudioVolumeChange(Number(this.audioVolume.value)));
    this.loadButton.addEventListener('click', () => {
      if (this.locked) return;
      if (this.selectedIndex === null) {
        this.callbacks.onLoad();
        return;
      }
      const selectedIndex = this.selectedIndex;
      this.callbacks.onRemoveAmmo(selectedIndex);
      this.clearSelection();
    });
    this.required(root, '#restart-button').addEventListener('click', this.callbacks.onRestart);
    window.addEventListener('blur', this.resetDragVisuals);
    window.addEventListener('resize', this.resetDragVisuals);
    window.addEventListener('resize', this.updateResponsiveLayout);
    window.visualViewport?.addEventListener('resize', this.updateResponsiveLayout);
    document.addEventListener('visibilitychange', this.resetDragVisuals);
    document.addEventListener('pointerdown', (event) => {
      if (!(event.target as Element).closest('.ammo-token, .attachment-option')) this.hideTooltip();
    });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') this.hideTooltip(); });
  }

  get canvasHost(): HTMLElement { return document.querySelector<HTMLElement>('#canvas-host')!; }

  renderMagazine(rounds: readonly AmmoType[], stock: AmmoStock = this.stock, capacity: number = this.magazineCapacity, build: AmmoBuild = this.build, specialCapacity: number = this.specialCapacity): void {
    this.rounds = [...rounds];
    this.stock = { ...stock };
    this.magazineCapacity = capacity;
    this.magazineOrderLabel.textContent = `1 → ${capacity}`;
    const slotHost = this.slots[0]?.parentElement;
    slotHost?.style.setProperty('--mag-capacity', String(capacity));
    if (this.selectedIndex !== null && !rounds[this.selectedIndex]) this.selectedIndex = null;
    this.slots.forEach((slot, index) => {
      slot.hidden = index >= capacity;
      const ammo = rounds[index];
      slot.className = `mag-slot${ammo ? ` filled ammo-${ammo}` : ''}${this.selectedIndex === index ? ' is-selected' : ''}`;
      slot.innerHTML = ammo ? `<span class="slot-index">0${index + 1}</span><span class="round-visual"><i></i></span><strong>${AMMO_DEFINITIONS[ammo].shortName}</strong>` : `<span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span>`;
      slot.setAttribute('aria-label', ammo ? `${index + 1}번 슬롯: ${AMMO_DEFINITIONS[ammo].name}, 탭하여 선택` : `${index + 1}번 빈 슬롯${this.selectedIndex !== null ? ', 탭하여 선택 탄 이동' : ''}`);
      slot.setAttribute('aria-pressed', String(this.selectedIndex === index));
    });
    this.loadButton.disabled = this.locked || rounds.length === 0;
    this.loadButton.querySelector('small')!.textContent = rounds.length ? `${rounds.length}발로 전투 시작` : '1발 이상 필요';
    this.renderAmmoStock(stock, build, specialCapacity, rounds);
    this.updateSelectionUI();
  }

  renderAmmoStock(stock: AmmoStock, build: AmmoBuild, capacity: number, reserved: readonly AmmoType[]): void {
    this.stock = { ...stock };
    this.build = { ...build };
    this.specialCapacity = capacity;
    this.required(this.shell, '#ammo-capacity').textContent = '배분 ' + countAllocations(build) + '/' + capacity + ' · 다음 구간 회복';
    this.shell.querySelectorAll<HTMLButtonElement>('.ammo-token').forEach(button => {
      const ammo = button.dataset.ammo as AmmoType;
      const count = stock[ammo];
      const loaded = reserved.filter(value => value === ammo).length;
      button.hidden = ammo !== 'standard' && build[ammo] === 0;
      button.disabled = this.locked || (count !== 'infinite' && count - loaded <= 0);
      button.setAttribute('aria-disabled', String(button.disabled));
      const label = ammo === 'standard' ? '∞' : count + ' / ' + build[ammo];
      button.querySelector<HTMLElement>('.stock-count')!.textContent = label;
      button.querySelector<HTMLElement>('.ammo-reserved')!.textContent = loaded ? '장전 예약 ' + loaded + '발' : ammo === 'standard' ? '항상 사용 가능' : '잔량 / 런 배분';
      button.setAttribute('aria-label', AMMO_DEFINITIONS[ammo].name + ' · ' + RARITY_NAMES[AMMO_DEFINITIONS[ammo].rarity] + ' · ' + label + ' · 장전 예약 ' + loaded + '발');
    });
  }

  showAmmoRewards(options: readonly SpecialAmmoType[], build: AmmoBuild, capacity: number, selected?: SpecialAmmoType, replacements: readonly SpecialAmmoType[] = []): void {
    this.hideTooltip();
    const host = this.required(this.shell, '#ammo-reward');
    const current = AMMO_ORDER.filter((ammo): ammo is SpecialAmmoType => ammo !== 'standard' && build[ammo] > 0);
    const buildText = current.map(ammo => AMMO_DEFINITIONS[ammo].name + ' ×' + build[ammo]).join(' · ');
    const needed = selected ? Math.max(0, countAllocations(build) + rewardAmount(selected) - capacity) : 0;
    const title = selected ? AMMO_DEFINITIONS[selected].name + ' +' + rewardAmount(selected) + ' · 교체할 배분 선택' : '다음 구간의 탄약을 고르세요';
    const description = selected ? '현재 배분 중 ' + needed + '발을 직접 선택하세요. 남은 선택 ' + (needed - replacements.length) + '발.' : '3종 중 하나를 선택해 런 배분을 늘립니다. 용량이 가득 차면 기존 배분과 교체합니다.';
    const choices = selected ? current.filter(ammo => build[ammo] > replacements.filter(value => value === ammo).length).map(ammo => '<button type="button" class="route-option" data-replace-reward="' + ammo + '"><strong>' + AMMO_DEFINITIONS[ammo].name + ' 1발 교체</strong><small>현재 배분 ' + build[ammo] + ' → ' + (build[ammo] - replacements.filter(value => value === ammo).length - 1) + '</small></button>').join('') : options.map(ammo => '<button type="button" class="route-option ammo-reward-option" data-ammo-reward="' + ammo + '"><span>' + RARITY_NAMES[AMMO_DEFINITIONS[ammo].rarity] + ' · 배분 +' + rewardAmount(ammo) + '</span><strong>' + AMMO_DEFINITIONS[ammo].name + '</strong><small>' + AMMO_DEFINITIONS[ammo].role + '</small>' + ammoStatsMarkup(ammo) + '<em>현재 배분 ' + build[ammo] + '발</em></button>').join('');
    host.innerHTML = '<div class="route-card reward-card"><span>구간 완료 · 특수탄 배분 ' + countAllocations(build) + '/' + capacity + '</span><h2>' + title + '</h2><p>' + description + '</p><p>표준탄 ∞ · ' + buildText + '</p><div class="reward-options">' + choices + '</div>' + (selected ? '<button class="reward-back" type="button" data-cancel-reward>보상 다시 고르기</button>' : '') + '<p>배분 확정 후 다음 구간에 들어갈 때 잔량이 회복됩니다.</p></div>';
    host.querySelectorAll<HTMLButtonElement>('[data-ammo-reward]').forEach(button => button.addEventListener('click', () => this.callbacks.onChooseAmmoReward(button.dataset.ammoReward as SpecialAmmoType)));
    host.querySelectorAll<HTMLButtonElement>('[data-replace-reward]').forEach(button => button.addEventListener('click', () => this.callbacks.onReplaceReward(button.dataset.replaceReward as SpecialAmmoType)));
    host.querySelector('[data-cancel-reward]')?.addEventListener('click', () => this.callbacks.onCancelReward());
    host.hidden = false;
    host.querySelector<HTMLButtonElement>('button')?.focus();
  }

  showAttachmentReward(id: AttachmentId | undefined, loadout: LoadoutSnapshot): void {
    this.hideTooltip();
    const host = this.required(this.shell, '#attachment-reward');
    const item = id ? ATTACHMENT_DEFINITIONS[id] : undefined;
    const replaced = item ? loadout[item.slot] : undefined;
    host.innerHTML = `<div class="route-card attachment-reward-card">
      <span>특수 감염체 처치 · 부착물 확정 보상</span>
      <h2 id="attachment-reward-title">${item ? item.name : '모든 부착물을 수집했습니다'}</h2>
      ${item ? `<p class="attachment-rarity" data-rarity="${item.rarity}">${ATTACHMENT_RARITY_NAMES[item.rarity]} · ${ATTACHMENT_SLOT_NAMES[item.slot]} · ${SERVICE_45.name}</p>
      <div class="attachment-reward-effect">${item.summary}</div>
      <p>${replaced ? `${ATTACHMENT_DEFINITIONS[replaced].name} 대신 장착합니다. 교체한 부착물은 보관함에 남습니다.` : '지금 장착하거나 보관한 뒤 전투 준비 중 장착할 수 있습니다.'}</p>
      <div class="reward-options"><button type="button" class="route-option" data-claim-attachment="equip"><strong>받고 장착</strong><small>다음 전투부터 적용</small></button><button type="button" class="route-option" data-claim-attachment="store"><strong>받고 보관</strong><small>현재 장비 유지</small></button></div>`
      : '<p>이번 런의 호환 부착물 10종을 모두 보유하고 있어 중복 보상을 지급하지 않습니다.</p><button type="button" class="route-option" data-claim-attachment="store">계속</button>'}
      <p>이번 런 동안 유지 · 재시작 시 초기화</p>
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

  hideAmmoRewards(): void { this.required(this.shell, '#ammo-reward').hidden = true; }

  setLocked(locked: boolean): void {
    this.locked = locked;
    if (locked) this.clearSelection();
    this.attachmentTabs.forEach((button) => {
      button.disabled = locked || button.dataset.sealed === 'true';
    });
    this.attachmentBay.querySelectorAll<HTMLButtonElement>('[data-attachment]').forEach((button) => {
      button.disabled = locked || button.dataset.sealed === 'true' || button.dataset.owned !== 'true' || button.getAttribute('aria-pressed') === 'true';
    });
    this.attachmentBay.querySelectorAll<HTMLButtonElement>('[data-unequip]').forEach((button) => {
      button.disabled = locked || button.dataset.sealed === 'true' || button.dataset.equipped !== 'true';
    });
    this.renderMagazine(this.rounds, this.stock, this.magazineCapacity);
  }

  renderLoadout(loadout: LoadoutSnapshot, playerState: PlayerCombatState, capacity: number, owned: readonly AttachmentId[] = []): void {
    this.required(this.shell, '#attachment-count').textContent = `보유 ${owned.length}/${ATTACHMENT_ORDER.length} · 특수 감염체 처치 시 획득`;
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
      if (ownership) ownership.textContent = selected ? '장착 중' : owned.includes(id) ? '보유' : '미획득';
      button.disabled = this.locked || sealed || selected || !owned.includes(id);
    });
    this.attachmentBay.querySelectorAll<HTMLButtonElement>('[data-unequip]').forEach((button) => {
      const slot = button.dataset.unequip as AttachmentSlot;
      const sealed = Boolean(playerState.disabledSlots[slot]);
      button.dataset.equipped = String(Boolean(loadout[slot]));
      button.dataset.sealed = String(sealed);
      button.disabled = this.locked || sealed || !loadout[slot];
    });
    this.updateAttachmentPanel();
  }

  showRouteChoice(stageNumber: number, options: readonly RouteOption[]): void {
    const host = this.required(this.routeChoice, '#route-options');
    host.innerHTML = options.map((option) => {
      const enemies = option.roster.map((type) => ENEMY_DEFINITIONS[type].name).join(' · ');
      const intent = option.roster.map((type) => ENEMY_DEFINITIONS[type].intent?.description).filter(Boolean).join(' / ');
      return `<button type="button" class="route-option route-${option.kind}" data-route="${option.kind}"><span>${option.kind === 'special' ? '특수 조우' : '일반 조우'} · 구간 ${stageNumber}</span><strong>${option.title}</strong><small>${option.subtitle}</small><em>${enemies}</em>${intent ? `<b>${intent}</b>` : ''}<i>완료 보상: ${option.reward}</i></button>`;
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
    if (enemy.statuses.slowTurns) statuses.push(`빙결 둔화 ${enemy.statuses.slowTurns}턴`);
    if (enemy.statuses.staggerTurns) statuses.push('이동 억제');
    if (enemy.statuses.shockTurns) statuses.push('전하 교란');
    if (enemy.statuses.exposedShots) statuses.push('다음 탄 노출');
    if (enemy.statuses.corruptedShots) statuses.push(`침식 ${enemy.statuses.corruptedShots}발`);
    statuses.push(`충격 ${enemy.statuses.impact}/${enemy.staggerThreshold}`);
    this.enemyStatus.textContent = statuses.join(' · ') || '상태 없음';
    this.distanceText.textContent = `${enemy.distance.toFixed(1)} m`;
    this.rangeBandText.textContent = RANGE_NAMES[getRangeBand(enemy.distance)];
    this.levelText.textContent = ENEMY_DEFINITIONS[enemy.type].name;
    this.waveText.textContent = `조우 ${wave}/${waveCount} · 표적 ${enemyNumber}/${enemyCount}`;
    this.intentCard.hidden = !enemy.intent;
    if (enemy.intent) this.intentCard.innerHTML = `<strong>${enemy.intent.countdown <= 1 ? '다음 행동' : `${enemy.intent.countdown}행동 후`} · ${enemy.intent.name}</strong><span>${enemy.intent.description.replace('다음 행동: ', '')}</span>`;
  }

  renderPreview(sequence: SequenceResult | undefined, action: EnemyActionResult | undefined): void {
    if (!sequence) {
      this.previewChain.textContent = '탄약을 장전하면 순서 프리뷰가 표시됩니다.';
      this.previewOutcome.textContent = '';
      this.accuracyText.textContent = '—';
      return;
    }
    this.previewChain.innerHTML = sequence.shots.map((shot) => `<span title="정확도 ${Math.round(shot.breakdown.accuracy)}% · ${RANGE_NAMES[shot.breakdown.effectiveRangeBand]} ×${shot.breakdown.rangeMultiplier.toFixed(2)}" style="--ammo-color:${AMMO_DEFINITIONS[shot.ammoType].cssColor}">${shot.index + 1}. ${AMMO_DEFINITIONS[shot.ammoType].shortName} <b>${Math.round(shot.breakdown.accuracy)}%</b></span>`).join('<i>→</i>') + sequence.unfiredRounds.map(ammo => '<span>' + AMMO_DEFINITIONS[ammo].shortName + ' · 처치 후 미발사</span>').join('');
    const final = sequence.finalState;
    const effects: string[] = [`예상 정확도 ${Math.round(sequence.averageAccuracy)}%`, `체력 ${final.hp}`, `방어 ${final.armor}`, `체력 피해 ${sequence.totalHpDamage}`];
    if (sequence.totalArmorDamage) effects.push(`방어 감소 ${sequence.totalArmorDamage}`);
    if (final.statuses.burnTurns) effects.push(`화상 ${final.statuses.burnTurns}턴`);
    if (sequence.killed) effects.push('처치 예상');
    else if (action) effects.push(`다음 이동 ${action.movement.toFixed(1)}m`);
    if (sequence.returnedRounds.length) effects.push(`반환 ${sequence.returnedRounds.length}발`);
    this.previewOutcome.textContent = effects.join(' · ');
    this.accuracyText.textContent = `${Math.round(sequence.shots[0]?.breakdown.accuracy ?? 100)}%`;
  }

  showShot(result: ShotResult): void {
    const damageDetail = [`기본 ${result.breakdown.baseDamage}`, `정확도 ${Math.round(result.breakdown.accuracy)}%`, `${RANGE_NAMES[result.breakdown.effectiveRangeBand]} ×${result.breakdown.rangeMultiplier.toFixed(2)}`, `체력 피해 ${result.hpDamage}`];
    if (result.breakdown.armorBroken) damageDetail.push(`방어 파괴 ${result.breakdown.armorBroken}`);
    if (result.burnApplied) damageDetail.push(`화상 ${result.burnApplied}턴`);
    if (result.breakdown.armorBlocked) damageDetail.push(`방어 흡수 ${result.breakdown.armorBlocked}`);
    if (result.conserved) damageDetail.push('탄환 보존');
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
    const label = this.loadButton.querySelector<HTMLElement>('span')!;
    const detail = this.loadButton.querySelector<HTMLElement>('small')!;
    const removeMode = Boolean(ammo && this.selectedIndex !== null && !this.locked);
    this.loadButton.classList.toggle('is-remove-mode', removeMode);
    if (removeMode && ammo && this.selectedIndex !== null) {
      label.textContent = '선택 탄 제거';
      detail.textContent = `${this.selectedIndex + 1}번 ${AMMO_DEFINITIONS[ammo].shortName} · 재선택 시 취소`;
      this.loadButton.disabled = false;
      this.loadButton.setAttribute('aria-label', `${this.selectedIndex + 1}번 ${AMMO_DEFINITIONS[ammo].name} 제거`);
      return;
    }
    label.textContent = '탄창 장전';
    detail.textContent = this.rounds.length ? `${this.rounds.length}발로 전투 시작` : '1발 이상 필요';
    this.loadButton.disabled = this.locked || this.rounds.length === 0;
    this.loadButton.setAttribute('aria-label', this.rounds.length ? `${this.rounds.length}발 탄창 장전` : '탄창 장전, 탄약 1발 이상 필요');
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
    this.hideTooltip();
  };

  private readonly updateResponsiveLayout = (): void => {
    applyResponsiveLayoutMode(this.shell);
  };

  private showAmmoTooltip(ammo: AmmoType, anchor: HTMLElement): void {
    this.hideTooltip();
    const definition = AMMO_DEFINITIONS[ammo];
    const accuracy = `${definition.accuracy > 0 ? '+' : ''}${definition.accuracy}%`;
    const buildup = definition.buildup ? ` · ${this.statusLabel(definition.buildup.type)} 축적 ${definition.buildup.amount}` : '';
    this.ammoTooltip.innerHTML = `<header><span>${RARITY_NAMES[definition.rarity]} · ${BUILD_TAG_NAMES[definition.tags[0]!]}</span><strong>${definition.name}</strong></header><p>${definition.role}</p><div><span>화력 <b>${definition.directDamage}</b></span><span>명중 보정 <b>${accuracy}</b></span><span>반동 <b>+${definition.recoil}</b></span><span>방어 파괴 <b>${definition.armorBreak}</b></span><span>충격 <b>${definition.impact}</b></span></div><small>이 탄이 만든 반동은 다음 탄부터 누적 적용됩니다.${buildup}</small>`;
    this.ammoTooltip.style.setProperty('--tooltip-color', definition.cssColor);
    this.ammoTooltip.classList.remove('is-attachment');
    this.ammoTooltip.hidden = false;
    anchor.setAttribute('aria-describedby', 'ammo-tooltip');
  }

  private showAttachmentTooltip(id: AttachmentId, anchor: HTMLElement): void {
    this.hideTooltip();
    const definition = ATTACHMENT_DEFINITIONS[id];
    this.ammoTooltip.innerHTML = `<header><span>${ATTACHMENT_SLOT_NAMES[definition.slot]} · ${ATTACHMENT_RARITY_NAMES[definition.rarity]}</span><strong>${definition.name}</strong></header><p>${definition.summary}</p><small>정확도는 최종 피해 효율입니다. 탄약 페널티 감소는 탄약의 정확도 손실과 누적 반동에 적용됩니다. 같은 슬롯은 하나만 장착하며 교체한 부착물은 보관됩니다.</small>`;
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
      if (event.pointerType !== 'mouse' || element.disabled) return;
      clear();
      timer = window.setTimeout(show, 1000);
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
  }

  private bindTouchTooltip(element: HTMLButtonElement, show: () => void): void {
    element.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' || event.button !== 0 || element.disabled || this.locked) return;
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

  private bindPointerDrag(element: HTMLButtonElement, getPayload: () => { ammo?: AmmoType; sourceIndex?: number } | undefined, onLongPress?: () => void): void {
    element.addEventListener('pointerdown', (event) => {
      if (this.locked || event.button !== 0) return;
      const payload = getPayload();
      if (!payload) return;
      const startX = event.clientX;
      const startY = event.clientY;
      const gestureVersion = this.gestureVersion;
      let dragging = false;
      let longPressed = false;
      const longPressTimer = onLongPress && event.pointerType !== 'mouse' ? window.setTimeout(() => {
        if (gestureVersion !== this.gestureVersion) return;
        longPressed = true;
        onLongPress();
      }, 520) : undefined;
      element.setPointerCapture(event.pointerId);
      const move = (moveEvent: PointerEvent): void => {
        if (gestureVersion !== this.gestureVersion) return;
        if (!dragging && Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) >= 8) {
          if (longPressTimer !== undefined) window.clearTimeout(longPressTimer);
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
        if (longPressTimer !== undefined) window.clearTimeout(longPressTimer);
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
        if (longPressed) {
          this.suppressClick = true;
          window.setTimeout(() => { this.suppressClick = false; }, 0);
          return;
        }
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
