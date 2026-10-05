import { WEAPON_DEFINITIONS, WEAPON_ORDER, type WeaponDefinition, type WeaponId } from '../data/weaponDefinitions';
import { isAttachmentCompatible } from '../data/attachmentDefinitions';
import { ammoStatsMarkup, ammoTooltipFirepower, burnEffectText, firingOrderStatEntries } from './AmmoView';
import { ACTION_NAMES, getRangeBand, isIgnited, isVulnerable, previewEnemyAction } from '../combat/CombatResolver';
import { recoilFirepowerPenalty } from '../combat/RecoilPenalty';
import type { AmmoFamily, AmmoType, AttachmentSlot, EnemyActionPreview, EnemyState, FirepowerBreakdown, PlayerCombatState, RoundPreview, SequenceResult, ShotResult } from '../combat/types';
import { BUILD_LABEL } from '../buildInfo';
import type { GamePhase } from '../core/GameStateMachine';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_ORDER, ATTACHMENT_RARITY_NAMES, ATTACHMENT_SLOT_NAMES, ATTACHMENT_SLOT_ORDER, type AttachmentId, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS, AMMO_ORDER, AMMO_BUILD_BALANCE, createAmmoBuild, createStageStock, type AmmoBuild, type SpecialAmmoType, BUILD_TAG_NAMES, COMBAT_BALANCE, RANGE_NAMES, RARITY_NAMES, type AmmoStock } from '../data/ammoDefinitions';
import type { RouteKind, RouteOption } from '../data/encounterDefinitions';
import { ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import type { AudioPreferences } from '../presentation/AudioPreferences';
import { applyResponsiveLayoutMode } from '../presentation/ResponsiveLayout';
import { playerDebuffEntries, type PlayerDebuffKind } from './PlayerDebuffView';

export interface GameUICallbacks {
  onChooseWeapon: (id: WeaponId) => void;
  onCylinderDecision: (spin: boolean) => void;
  onFireCylinder: () => void;
  onAddAmmo: (ammo: AmmoType) => void;
  onRemoveAmmo: (index: number) => void;
  onReplaceAmmo: (index: number, ammo: AmmoType) => void;
  onSwapAmmo: (first: number, second: number) => void;
  onMoveAmmo: (from: number, to: number) => void;
  onEquipAttachment: (id: AttachmentId) => void;
  onUnequipAttachment: (slot: AttachmentSlot) => void;
  onClaimAttachment: (equip: boolean) => void;
  onSupplyAmmo: (ammo: SpecialAmmoType) => void;
  onRemoveSupplyAmmo: (ammo: SpecialAmmoType) => void;
  onSupplyAttachment: (id: AttachmentId) => void;
  onRemoveSupplyAttachment: (id: AttachmentId) => void;
  onChooseRoute: (kind: RouteKind) => void;
  onAudioMutedChange: (muted: boolean) => void;
  onAudioVolumeChange: (volume: number) => void;
  onLoad: () => void;
  onRestart: () => void;
}

const PHASE_LABELS: Record<GamePhase, string> = {
  WEAPON_SELECTION: '권총 선택', CYLINDER_CHOICE: '실린더 준비', ATTACHMENT_REWARD: '부착물 획득', AMMO_SELECTION: '전투 준비', LOADING: '장전 중', FIRING: '사격 중', ENEMY_ACTION: '적 행동', ROUTE_SELECTION: '경로 선택', GAME_OVER: '게임 오버', VICTORY: '실험 완료',
};

const AMMO_FAMILY_LABELS: Record<AmmoFamily, string> = {
  HEALTH: '일반 피해', WOUND: '상처', EXPLOSION: '폭발', IMPACT: '충격', BURN: '화상',
};

const COMBAT_STAT_ICONS = {
  burn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c2 5-3 6-1 9 1-1 3-3 4-5 5 5 7 14-3 16C2 20 4 12 8 8c-1 4 1 5 2 6-1-5 3-7 2-12Z"/></svg>',
  wound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg>',
  explosive: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-2 6-6-2 3 6-6 3 7 1 2 6 3-6 7-2-6-3 2-6-4 3Z"/></svg>',
  shock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg>',
  recoil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 15 4-4 3 3 5-7 4 3"/></svg>',
} as const;

const PLAYER_DEBUFF_ICONS: Record<PlayerDebuffKind, string> = {
  recoil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 15 4-4 3 3 5-7 4 3"/><path d="M5 20h14"/></svg>',
  range: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg>',
  attachment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v10H5zM8 4v3M16 4v3M8 17v3M16 17v3"/><path d="m8 9 8 6M16 9l-8 6"/></svg>',
};

export class GameUI {
  private readonly hpFill: HTMLElement;
  private readonly hpText: HTMLElement;
  private readonly woundText: HTMLElement;
  private readonly impactText: HTMLElement;
  private readonly impactThreshold: HTMLElement;
  private readonly impactFill: HTMLElement;
  private readonly enemyStatus: HTMLElement;
  private readonly enemyContext: HTMLElement;
  private readonly enemyCard: HTMLElement;
  private readonly nextAction: HTMLButtonElement;
  private readonly nextActionName: HTMLElement;
  private readonly nextActionShock: HTMLElement;
  private readonly distanceText: HTMLElement;
  private readonly rangeBandText: HTMLElement;
  private readonly recoilGauge: HTMLElement;
  private readonly recoilValue: HTMLElement;
  private readonly recoilNextPenalty: HTMLElement;
  private readonly recoilFill: HTMLElement;
  private readonly levelText: HTMLElement;
  private readonly waveText: HTMLElement;
  private readonly phaseText: HTMLElement;
  private readonly playerDebuffs: HTMLElement;
  private readonly loadButton: HTMLButtonElement;
  private readonly slots: HTMLButtonElement[];
  private readonly overlay: HTMLElement;
  private readonly audioMute: HTMLButtonElement;
  private readonly audioState: HTMLElement;
  private readonly audioVolume: HTMLInputElement;
  private readonly previewOutcome: HTMLElement;
  private readonly firepowerButton: HTMLButtonElement;
  private readonly firepowerValue: HTMLElement;
  private readonly firepowerLabel: HTMLElement;
  private readonly attachmentBay: HTMLElement;
  private readonly attachmentTabs: HTMLButtonElement[];
  private readonly routeChoice: HTMLElement;
  private readonly endTitle: HTMLElement;
  private readonly ammoTooltip: HTMLElement;
  private readonly ammoInventory: HTMLElement;
  private readonly inventoryBackgroundInert = new Map<HTMLElement, boolean>();
  private inventorySupplyMode = false;
  private inventoryOpener?: HTMLButtonElement;
  private inspectedAmmoButton?: HTMLButtonElement;
  private rounds: readonly AmmoType[] = [];
  private roundPreviews: readonly RoundPreview[] = [];
  private ammoOptionPreviews: Partial<Record<AmmoType, RoundPreview>> = {};
  private build = createAmmoBuild();
  private stock: AmmoStock = createStageStock(this.build);
  private specialCapacity: number = AMMO_BUILD_BALANCE.specialCapacity;
  private locked = false;
  private weapon: WeaponDefinition = WEAPON_DEFINITIONS.p220;
  private magazineCapacity: number = COMBAT_BALANCE.baseMagazineCapacity;
  private suppressClick = false;
  private gestureVersion = 0;
  private activeAttachmentSlot: AttachmentSlot = 'muzzle';
  private firepowerBreakdown?: FirepowerBreakdown;
  private firepowerTooltipMode?: 'mouse' | 'focus' | 'touch';
  private firepowerLeaveTimer?: number;
  private firepowerPointerType?: string;
  private nextActionPointerType?: string;
  private recoilThreshold: number = COMBAT_BALANCE.recoilThreshold;
  private recoilDebuffPenaltyBonus = 0;
  private recoilAmount = 0;
  private readonly shell: HTMLElement;

  constructor(root: HTMLElement, private readonly callbacks: GameUICallbacks) {
    root.innerHTML = `
      <div class="game-shell">
        <main class="game-stage" aria-label="전투 화면">
          <div id="canvas-host" class="canvas-host"></div>
          <header class="top-hud">
            <div class="brand"><span class="brand-mark"></span><strong>좀비 샷</strong></div>
            <div class="enemy-card" aria-live="polite"><div class="enemy-heading"><span id="level-text">일반 감염체</span><span id="hp-text">22 / 22</span></div><div class="hp-track" aria-label="체력"><span id="hp-fill"></span></div><div class="enemy-vitals">
              <div class="enemy-stat enemy-wound"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg><span><small>상처</small><strong id="wound-text">0/${COMBAT_BALANCE.woundThreshold}</strong></span></div>
              <div class="enemy-stat enemy-explosive">${COMBAT_STAT_ICONS.explosive}<span><small>폭발</small><strong id="explosive-text">0</strong></span></div>
              <div class="enemy-stat enemy-burn">${COMBAT_STAT_ICONS.burn}<span><small>화상</small><strong id="burn-text">0/20</strong></span></div>
              <div class="enemy-stat enemy-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong><b id="impact-text">0</b><em id="impact-threshold">/5</em></strong></span><i><b id="impact-fill"></b></i></div>
              <button id="enemy-action" type="button" class="enemy-action" aria-controls="enemy-context" aria-describedby="enemy-context" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg><span><small>다음 행동</small><strong id="next-action-name">접근 2.0 m</strong></span><em id="next-action-shock" aria-label="중단 충격 4"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><b>4</b></em></button>
            </div><div id="enemy-status" class="enemy-status-list" aria-live="polite" hidden></div><div id="enemy-context" class="enemy-context" role="tooltip"></div></div>
            <div class="utility-stack"><div class="distance-card"><small id="range-band-text">중거리</small><strong id="distance-text">8.0 m</strong></div><div id="recoil-gauge" class="recoil-gauge" role="meter" aria-label="예상 반동" aria-valuemin="0" aria-valuenow="0" aria-valuemax="3" aria-valuetext="반동 0, 임계치 3, 다음 탄 반동 화력 감소 없음" title="사격할 때 반동이 쌓입니다. 허용치를 넘으면 그다음 탄부터 화력이 감소합니다. 초과량이 커질수록 최대 3까지 감소합니다."><div class="recoil-gauge-head"><span>반동</span><strong id="recoil-value">0 / 3</strong></div><div class="recoil-track"><i id="recoil-fill"></i></div><div class="recoil-next"><span>다음 탄 화력</span><strong id="recoil-next-penalty">0</strong></div></div><div class="audio-controls" aria-label="오디오 설정"><button id="audio-mute" type="button" aria-pressed="false"><span>음향</span><strong id="audio-state">켜짐</strong></button><label><span class="sr-only">전체 음량</span><input id="audio-volume" type="range" min="0" max="1" step="0.05" value="0.65" aria-label="전체 음량" /></label></div><div class="ammo-utility-buttons"><button id="ammo-supply-button" class="inventory-open-button ammo-supply-open" type="button" aria-label="탄약 추가" aria-haspopup="dialog" aria-controls="ammo-inventory"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/></svg><span>탄약 추가</span></button><button id="inventory-button" class="inventory-open-button" type="button" data-open-ammo-inventory aria-label="보유 탄약" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 15h6v4h-6z"/></svg><span>보유 탄약</span></button></div></div>
          </header>
          <aside class="phase-panel"><span id="wave-text" class="eyebrow">조우 1/5 · 표적 1/1</span><strong id="phase-text">전투 준비</strong><section id="player-debuffs" class="player-debuffs" aria-label="플레이어 약화 효과" aria-live="polite" hidden></section></aside>
          <aside id="preview-outcome" class="combat-forecast" aria-label="발사 결과 예상" aria-live="polite" hidden>
            <button id="firepower-button" type="button" class="forecast-stat forecast-damage" aria-controls="ammo-tooltip" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg><span><small id="firepower-label">총 화력</small><strong id="firepower-value">0</strong></span></button>
            <div class="forecast-stat forecast-wound"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg><span><small>상처</small><strong id="forecast-wound-value">+0</strong></span></div>
            <div class="forecast-stat forecast-explosive">${COMBAT_STAT_ICONS.explosive}<span><small>폭발 잔량</small><strong id="forecast-explosive-value">0</strong></span></div>
            <div class="forecast-stat forecast-burn">${COMBAT_STAT_ICONS.burn}<span><small id="forecast-burn-label">화상 잔량</small><strong id="forecast-burn-value">0/20</strong></span></div>
            <div class="forecast-stat forecast-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong id="forecast-impact-value">0</strong></span></div>
            <div class="forecast-stat forecast-range"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg><span><small>최종 거리</small><strong id="forecast-range-value">0.0 m</strong></span></div>
          </aside>
          <aside id="ammo-tooltip" class="ammo-tooltip" role="tooltip" hidden></aside>
        </main>
        <section class="tactical-console" aria-label="전투 준비">
          <div class="loadout" aria-label="탄창과 부착물 구성 영역">
          <div class="ammo-rack"><div class="section-label"><span>탄약</span><small id="ammo-capacity">보유 6</small></div><div class="ammo-options">
            ${AMMO_ORDER.map((ammo) => { const definition = AMMO_DEFINITIONS[ammo]; return `<button class="ammo-token ammo-${ammo}" style="--bullet:${definition.cssColor}" data-ammo="${ammo}" aria-label="${definition.name}: ${definition.role}"><span class="round-visual"><i></i></span><span><strong>${definition.name}</strong><small>${RARITY_NAMES[definition.rarity]} · ${BUILD_TAG_NAMES[definition.tags[0]!]}</small></span><b class="stock-count" data-stock="${ammo}"></b></button>`; }).join('')}
          </div></div>
          <div class="magazine-panel"><details id="weapon-panel" class="weapon-panel"><summary><strong data-weapon-name>P220</strong><span data-weapon-trait>표준탄 반동 0</span></summary><p data-weapon-detail></p></details><div class="section-label"><span>발사 순서</span></div><div class="magazine-row"><div class="magazine-slots" role="group" aria-label="탄창 슬롯">
            ${Array.from({ length: COMBAT_BALANCE.maximumMagazineCapacity }, (_, index) => `<button class="mag-slot" data-slot="${index}" aria-label="${index + 1}번 탄창 슬롯"><span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span></button>`).join('')}
          </div><button id="load-button" class="load-button" disabled><span>탄창 장전</span></button></div><div id="cylinder-choice" class="cylinder-choice" hidden aria-label="실린더 시작 순서 선택"></div></div>
          <section id="attachment-bay" class="attachment-bay" aria-label="부착물 구성"><div class="section-label"><span>부착물</span><button id="attachment-supply-button" type="button" aria-haspopup="dialog" aria-controls="attachment-inventory">부착물 추가</button><small id="attachment-count">보유 0/11</small></div><div class="attachment-workspace">
            <div class="attachment-tabs" role="tablist" aria-label="부착물 슬롯">${ATTACHMENT_SLOT_ORDER.map((slot, index) => `<button type="button" role="tab" class="attachment-slot-tab" data-attachment-slot="${slot}" aria-controls="attachment-group-${slot}" aria-selected="${index === 0}"><small>${ATTACHMENT_SLOT_NAMES[slot]}</small><strong data-current-attachment="${slot}">비어 있음</strong></button>`).join('')}</div>
            <div class="attachment-groups">${ATTACHMENT_SLOT_ORDER.map((slot, index) => `<section id="attachment-group-${slot}" class="attachment-group" data-attachment-group="${slot}" role="tabpanel" ${index === 0 ? '' : 'hidden'}>${ATTACHMENT_ORDER.filter((id) => ATTACHMENT_DEFINITIONS[id].slot === slot).map((id) => { const item = ATTACHMENT_DEFINITIONS[id]; return `<button type="button" class="attachment-option" data-attachment="${id}"><span><strong>${item.name}</strong><small>${item.summary}</small></span><em><span class="attachment-rarity" data-rarity="${item.rarity}">${ATTACHMENT_RARITY_NAMES[item.rarity]}</span> · <span data-ownership>미획득</span></em></button>`; }).join('')}</section>`).join('')}</div>
          </div></section>
        </div></section>
        <section id="weapon-selection" class="route-choice weapon-selection" hidden role="dialog" aria-modal="true" aria-labelledby="weapon-selection-title"></section>
        <section id="route-choice" class="route-choice" hidden aria-label="다음 조우 경로 선택"><div class="route-card"><h2>경로 선택</h2><div id="route-options" class="route-options"></div></div></section>
        <section id="attachment-reward" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="attachment-reward-title"></section>
        <section id="ammo-inventory" class="route-choice ammo-inventory-overlay" hidden role="dialog" aria-modal="true" aria-labelledby="ammo-inventory-title"></section>
        <section id="attachment-inventory" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="attachment-inventory-title"></section>
        <div class="build-id" data-testid="build-id" aria-label="배포 빌드 식별자">${BUILD_LABEL}</div>
        <div id="game-over" class="game-over" hidden><div class="game-over-card"><h2 id="end-title">감염체가 방어선을 돌파했습니다</h2><button id="restart-button">다시 시작</button></div></div>
      </div>`;

    this.shell = this.required(root, '.game-shell');
    this.updateResponsiveLayout();

    this.hpFill = this.required(root, '#hp-fill');
    this.hpText = this.required(root, '#hp-text');
    this.woundText = this.required(root, '#wound-text');
    this.impactText = this.required(root, '#impact-text');
    this.impactThreshold = this.required(root, '#impact-threshold');
    this.impactFill = this.required(root, '#impact-fill');
    this.enemyStatus = this.required(root, '#enemy-status');
    this.enemyContext = this.required(root, '#enemy-context');
    this.enemyCard = this.required(root, '.enemy-card');
    this.nextAction = this.required(root, '#enemy-action') as HTMLButtonElement;
    this.nextActionName = this.required(root, '#next-action-name');
    this.nextActionShock = this.required(root, '#next-action-shock');
    this.distanceText = this.required(root, '#distance-text');
    this.rangeBandText = this.required(root, '#range-band-text');
    this.recoilGauge = this.required(root, '#recoil-gauge');
    this.recoilValue = this.required(root, '#recoil-value');
    this.recoilNextPenalty = this.required(root, '#recoil-next-penalty');
    this.recoilFill = this.required(root, '#recoil-fill');
    this.levelText = this.required(root, '#level-text');
    this.waveText = this.required(root, '#wave-text');
    this.phaseText = this.required(root, '#phase-text');
    this.playerDebuffs = this.required(root, '#player-debuffs');
    this.loadButton = this.required(root, '#load-button') as HTMLButtonElement;
    this.overlay = this.required(root, '#game-over');
    this.audioMute = this.required(root, '#audio-mute') as HTMLButtonElement;
    this.audioState = this.required(root, '#audio-state');
    this.audioVolume = this.required(root, '#audio-volume') as HTMLInputElement;
    this.previewOutcome = this.required(root, '#preview-outcome');
    this.firepowerButton = this.required(root, '#firepower-button') as HTMLButtonElement;
    this.firepowerValue = this.required(root, '#firepower-value');
    this.firepowerLabel = this.required(root, '#firepower-label');
    this.attachmentBay = this.required(root, '#attachment-bay');
    this.attachmentTabs = [...root.querySelectorAll<HTMLButtonElement>('[data-attachment-slot]')];
    this.routeChoice = this.required(root, '#route-choice');
    this.endTitle = this.required(root, '#end-title');
    this.ammoTooltip = this.required(root, '#ammo-tooltip');
    this.ammoInventory = this.required(root, '#ammo-inventory');
    this.slots = [...root.querySelectorAll<HTMLButtonElement>('.mag-slot')];

    this.nextAction.addEventListener('pointerdown', (event) => {
      this.nextActionPointerType = event.pointerType;
    });
    this.nextAction.addEventListener('click', () => {
      if (this.nextActionPointerType === 'touch' || this.nextActionPointerType === 'pen') {
        const open = !this.enemyCard.hasAttribute('data-action-tooltip-open');
        this.enemyCard.toggleAttribute('data-action-tooltip-open', open);
        this.nextAction.setAttribute('aria-expanded', String(open));
        if (!open) this.nextAction.blur();
      }
      this.nextActionPointerType = undefined;
    });
    this.nextAction.addEventListener('focus', () => {
      if (this.nextAction.matches(':focus-visible')) this.nextAction.setAttribute('aria-expanded', 'true');
    });
    this.nextAction.addEventListener('blur', () => {
      if (!this.enemyCard.hasAttribute('data-action-tooltip-open')) this.nextAction.setAttribute('aria-expanded', 'false');
    });

    this.firepowerButton.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      this.clearFirepowerLeaveTimer();
      if (this.firepowerTooltipMode === 'focus') return;
      this.showFirepowerTooltip('mouse');
    });
    this.firepowerButton.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse' && this.firepowerTooltipMode === 'mouse') this.scheduleFirepowerTooltipClose();
    });
    this.firepowerButton.addEventListener('focus', () => {
      if (this.firepowerButton.matches(':focus-visible')) this.showFirepowerTooltip('focus');
    });
    this.firepowerButton.addEventListener('blur', () => {
      if (this.firepowerTooltipMode === 'focus') this.hideTooltip();
    });
    this.firepowerButton.addEventListener('pointerdown', (event) => { this.firepowerPointerType = event.pointerType; });
    this.firepowerButton.addEventListener('click', () => {
      if (this.firepowerPointerType === 'touch' || this.firepowerPointerType === 'pen') {
        if (this.firepowerTooltipMode === 'touch') this.hideTooltip();
        else this.showFirepowerTooltip('touch');
      }
      this.firepowerPointerType = undefined;
    });
    this.ammoTooltip.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse' && this.firepowerTooltipMode === 'mouse') this.clearFirepowerLeaveTimer();
    });
    this.ammoTooltip.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse' && this.firepowerTooltipMode === 'mouse') this.hideTooltip();
    });
    document.addEventListener('pointerdown', (event) => {
      if (this.firepowerTooltipMode !== 'touch') return;
      if (event.target instanceof Node && (this.firepowerButton.contains(event.target) || this.ammoTooltip.contains(event.target))) return;
      this.hideTooltip();
    });

    root.querySelectorAll<HTMLButtonElement>('.ammo-token').forEach((button) => {
      const ammo = button.dataset.ammo as AmmoType;
      button.addEventListener('click', () => {
        if (this.consumeSuppressedClick() || !this.isAmmoSelectable(ammo)) return;
        this.callbacks.onAddAmmo(ammo);
      });
      this.bindPointerDrag(button, () => this.isAmmoSelectable(ammo) ? ({ ammo }) : undefined);
      this.bindHoverTooltip(button, () => this.showAmmoTooltip(ammo, button, this.ammoOptionPreviews[ammo], true));
      this.bindTouchTooltip(button, () => this.showAmmoTooltip(ammo, button, this.ammoOptionPreviews[ammo], true));
    });

    this.slots.forEach((slot, index) => {
      slot.addEventListener('click', () => {
        if (this.consumeSuppressedClick() || this.locked) return;
        this.handleSlotTap(index);
      });
      this.bindPointerDrag(slot, () => this.rounds[index] ? ({ sourceIndex: index }) : undefined);
      this.bindHoverTooltip(slot, () => {
        const ammo = this.rounds[index];
        if (ammo) this.showAmmoTooltip(ammo, slot, this.roundPreviews[index]);
      });
      this.bindTouchTooltip(slot, () => {
        const ammo = this.rounds[index];
        if (ammo) this.showAmmoTooltip(ammo, slot, this.roundPreviews[index]);
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
    this.required(root, '#ammo-supply-button').addEventListener('click', (event) => this.openAmmoInventory(event.currentTarget as HTMLButtonElement, true));
    this.required(root, '#inventory-button').addEventListener('click', (event) => this.openAmmoInventory(event.currentTarget as HTMLButtonElement));
    this.required(root, '#attachment-supply-button').addEventListener('click', (event) => this.openAttachmentInventory(event.currentTarget as HTMLButtonElement));
    this.required(root, '#restart-button').addEventListener('click', this.callbacks.onRestart);
    window.addEventListener('blur', this.resetDragVisuals);
    window.addEventListener('resize', this.resetDragVisuals);
    window.addEventListener('resize', this.updateResponsiveLayout);
    window.visualViewport?.addEventListener('resize', this.updateResponsiveLayout);
    document.addEventListener('visibilitychange', () => {
      this.resetDragVisuals();
      if (document.hidden) this.hideTooltip();
    });
    document.addEventListener('pointerdown', (event) => {
      if (!(event.target as Element).closest('.ammo-token, .mag-slot, .attachment-option, #firepower-button, #ammo-tooltip')) this.hideTooltip();
      if (event.target instanceof Node && !this.nextAction.contains(event.target)) this.closeNextActionTooltip();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      this.hideTooltip();
      this.closeNextActionTooltip();
    });
  }

  get canvasHost(): HTMLElement { return document.querySelector<HTMLElement>('#canvas-host')!; }

  showWeaponSelection(show: boolean): void {
    const host = this.required(this.shell, '#weapon-selection');
    host.hidden = !show;
    this.required(this.shell, '.game-stage').inert = show;
    this.required(this.shell, '.tactical-console').inert = show;
    if (!show) { this.shell.querySelector<HTMLButtonElement>('.ammo-token')?.focus(); return; }
    host.innerHTML = `<div class="route-card weapon-selection-card"><h2 id="weapon-selection-title">권총 선택</h2><div class="weapon-options">${WEAPON_ORDER.map(id => {
      const weapon = WEAPON_DEFINITIONS[id];
      const rating = weapon.ratings;
      return `<article class="weapon-option"><h3>${weapon.name}</h3><p>${weapon.role}</p><dl>
        <div><dt>탄창 ${rating.magazine}</dt><dd>${weapon.baseMagazineCapacity} / ${weapon.maximumMagazineCapacity}발</dd></div>
        <div><dt>화력 ${rating.firepower}</dt><dd title="탄약 기본 화력에 더하는 정수">기본 ${weapon.firepowerAdjustment >= 0 ? '+' : ''}${weapon.firepowerAdjustment}</dd></div>
        <div><dt>거리 ${rating.range}</dt><dd>0 / −${weapon.rangePenaltyPercentages.mid} / −${weapon.rangePenaltyPercentages.far}%</dd></div>
        <div><dt>반동 ${rating.recoil}</dt><dd title="원래 반동 0인 탄에는 추가 반동이 없습니다.">${weapon.recoilAdjustment ? `발생 +${weapon.recoilAdjustment} · ` : ''}허용 ${weapon.recoilThreshold}</dd></div>
        <div><dt>난도</dt><dd>${rating.difficulty}</dd></div>
      </dl><details><summary>${weapon.traitLabel}</summary><p>${weapon.traitDetail}</p></details><button type="button" data-choose-weapon="${id}">${weapon.name} 선택</button></article>`;
    }).join('')}</div></div>`;
    host.querySelectorAll<HTMLButtonElement>('[data-choose-weapon]').forEach(button => button.addEventListener('click', () => this.callbacks.onChooseWeapon(button.dataset.chooseWeapon as WeaponId)));
    host.onkeydown = event => {
      if (event.key !== 'Tab') return;
      const elements = [...host.querySelectorAll<HTMLElement>('button, summary')];
      if (event.shiftKey && document.activeElement === elements[0]) { event.preventDefault(); elements.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === elements.at(-1)) { event.preventDefault(); elements[0]?.focus(); }
    };
    host.querySelector<HTMLButtonElement>('button')?.focus();
  }

  renderWeapon(weapon: WeaponDefinition): void {
    this.weapon = weapon;
    this.required(this.shell, '[data-weapon-name]').textContent = weapon.name;
    this.required(this.shell, '[data-weapon-trait]').textContent = weapon.traitLabel;
    this.required(this.shell, '[data-weapon-detail]').textContent = `${weapon.traitDetail} 기본 화력 ${weapon.firepowerAdjustment >= 0 ? '+' : ''}${weapon.firepowerAdjustment} · 거리 감소 ${weapon.rangePenaltyPercentages.near}/${weapon.rangePenaltyPercentages.mid}/${weapon.rangePenaltyPercentages.far}% · 발생 반동 ${weapon.recoilAdjustment ? `+${weapon.recoilAdjustment} (원래 반동 0인 탄 제외)` : '추가 없음'} · 탄창 ${weapon.baseMagazineCapacity}~${weapon.maximumMagazineCapacity}발`;
    this.recoilGauge.title = `${weapon.traitDetail} 반동 허용치를 넘으면 초과량 2마다 화력 −1, 최대 −3. 새 탄창에서 초기화됩니다.`;
  }

  renderCylinderChoice(size: number, decided: boolean, spun: boolean): void {
    const host = this.required(this.shell, '#cylinder-choice');
    host.hidden = size === 0;
    this.loadButton.hidden = size > 0;
    if (!size) return;
    host.innerHTML = decided
      ? `<span>${spun ? '회전 완료 · 첫 탄 주효과 +50%' : '선택한 순서 유지'}</span><button type="button" data-cylinder-fire>발사</button>`
      : `<button type="button" data-cylinder-keep>순서 유지</button><button type="button" data-cylinder-spin ${size < 2 ? 'disabled' : ''}>실린더 회전</button>`;
    host.querySelector<HTMLButtonElement>('[data-cylinder-keep]')?.addEventListener('click', () => this.callbacks.onCylinderDecision(false));
    host.querySelector<HTMLButtonElement>('[data-cylinder-spin]')?.addEventListener('click', () => this.callbacks.onCylinderDecision(true));
    host.querySelector<HTMLButtonElement>('[data-cylinder-fire]')?.addEventListener('click', this.callbacks.onFireCylinder);
    host.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
  }

  renderMagazine(rounds: readonly AmmoType[], stock: AmmoStock = this.stock, capacity: number = this.magazineCapacity, build: AmmoBuild = this.build, specialCapacity: number = this.specialCapacity): void {
    this.rounds = [...rounds];
    this.stock = { ...stock };
    this.magazineCapacity = capacity;
    const slotHost = this.slots[0]?.parentElement;
    slotHost?.style.setProperty('--mag-capacity', String(capacity));
    slotHost?.parentElement?.toggleAttribute('data-expanded', capacity > 4);
    this.slots.forEach((slot, index) => {
      slot.hidden = index >= capacity;
      const ammo = rounds[index];
      slot.className = `mag-slot${ammo ? ` filled ammo-${ammo}` : ''}`;
      if (ammo) slot.style.setProperty('--bullet', AMMO_DEFINITIONS[ammo].cssColor);
      else slot.style.removeProperty('--bullet');
      slot.innerHTML = ammo ? `<span class="slot-index">0${index + 1}</span><span class="round-visual"><i></i></span><span class="slot-content"><strong>${AMMO_DEFINITIONS[ammo].shortName}</strong></span>` : `<span class="slot-index">0${index + 1}</span><span class="slot-empty">+</span>`;
      slot.setAttribute('aria-disabled', String(this.locked));
      slot.setAttribute('aria-label', ammo ? `${index + 1}번 슬롯: ${AMMO_DEFINITIONS[ammo].name}${this.locked ? ', 수정 불가' : ', 탭하여 즉시 제거'}` : `${index + 1}번 빈 슬롯`);
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
    this.required(this.shell, '#ammo-capacity').textContent = `보유 ${AMMO_ORDER.reduce((total, ammo) => total + (ammo === 'ball' ? 0 : stock[ammo]), 0)}`;
    if (this.inventorySupplyMode && !this.ammoInventory.hidden) {
      this.ammoInventory.querySelectorAll<HTMLElement>('[data-supply-quantity]').forEach(quantity => {
        const ammo = quantity.dataset.supplyQuantity as AmmoType;
        quantity.textContent = ammo === 'ball' ? '∞' : `×${stock[ammo]}`;
      });
      this.ammoInventory.querySelectorAll<HTMLButtonElement>('[data-remove-supply-ammo]').forEach(button => {
        const ammo = button.dataset.removeSupplyAmmo as AmmoType;
        button.disabled = ammo === 'ball' || build[ammo] <= 0 || stock[ammo] - reserved.filter(value => value === ammo).length <= 0;
      });
    }
    const visibleCount = AMMO_ORDER.filter(ammo => ammo === 'ball' || build[ammo] > 0).length;
    const options = this.required(this.shell, '.ammo-options');
    options.style.setProperty('--ammo-columns', String(Math.max(1, Math.min(5, visibleCount))));
    this.shell.querySelectorAll<HTMLButtonElement>('.ammo-token').forEach(button => {
      const ammo = button.dataset.ammo as AmmoType;
      const count = stock[ammo];
      const loaded = reserved.filter(value => value === ammo).length;
      button.hidden = ammo !== 'ball' && build[ammo] === 0;
      const unavailable = this.locked || (count !== 'infinite' && count - loaded <= 0);
      button.disabled = false;
      button.setAttribute('aria-disabled', String(unavailable));
      const label = ammo === 'ball' ? '∞' : count + ' / ' + build[ammo];
      button.querySelector<HTMLElement>('.stock-count')!.textContent = label;
      button.setAttribute('aria-label', AMMO_DEFINITIONS[ammo].name + ' · ' + RARITY_NAMES[AMMO_DEFINITIONS[ammo].rarity] + ' · ' + label + ' · 장전 예약 ' + loaded + '발');
    });
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

  setLocked(locked: boolean): void {
    this.locked = locked;
    (this.required(this.shell, '#attachment-supply-button') as HTMLButtonElement).disabled = locked;
    this.attachmentTabs.forEach((button) => {
      button.disabled = locked || button.dataset.compatible === 'false';
    });
    this.attachmentBay.querySelectorAll<HTMLButtonElement>('[data-attachment]').forEach((button) => {
      button.disabled = locked || button.dataset.compatible === 'false' || button.dataset.owned !== 'true';
    });
    this.renderMagazine(this.rounds, this.stock, this.magazineCapacity);
  }

  renderLoadout(loadout: LoadoutSnapshot, playerState: PlayerCombatState, capacity: number, owned: readonly AttachmentId[] = []): void {
    const inventory = this.required(this.shell, '#attachment-inventory');
    inventory.querySelectorAll<HTMLButtonElement>('[data-supply-attachment]').forEach(button => { button.disabled = owned.includes(button.dataset.supplyAttachment as AttachmentId); });
    inventory.querySelectorAll<HTMLButtonElement>('[data-remove-supply-attachment]').forEach(button => { button.disabled = !owned.includes(button.dataset.removeSupplyAttachment as AttachmentId); });
    inventory.querySelectorAll<HTMLElement>('[data-attachment-quantity]').forEach(element => { element.textContent = owned.includes(element.dataset.attachmentQuantity as AttachmentId) ? '보유 1' : '보유 0'; });
    this.required(this.shell, '#attachment-count').textContent = `보유 ${owned.filter(id => isAttachmentCompatible(id, this.weapon.id)).length}/${ATTACHMENT_ORDER.filter(id => isAttachmentCompatible(id, this.weapon.id)).length}`;
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
        tab.disabled = this.locked;
      }
    });
    this.attachmentBay.querySelectorAll<HTMLButtonElement>('[data-attachment]').forEach((button) => {
      const id = button.dataset.attachment as AttachmentId;
      const slot = ATTACHMENT_DEFINITIONS[id].slot;
      const selected = loadout[slot] === id;
      const sealed = Boolean(playerState.disabledSlots[slot]);
      button.classList.toggle('is-equipped', selected);
      button.setAttribute('aria-pressed', String(selected));
      const compatible = isAttachmentCompatible(id, this.weapon.id);
      button.dataset.compatible = String(compatible);
      button.dataset.sealed = String(sealed);
      button.dataset.owned = String(owned.includes(id));
      const ownership = button.querySelector('[data-ownership]');
      if (ownership) ownership.textContent = !compatible ? '장착 불가' : selected ? '장착 중 · 다시 눌러 해제' : owned.includes(id) ? '보유' : '미획득';
      button.setAttribute('aria-label', `${ATTACHMENT_DEFINITIONS[id].name}: ${selected ? '장착 중, 다시 눌러 해제' : ATTACHMENT_DEFINITIONS[id].summary}`);
      button.disabled = this.locked || !compatible || !owned.includes(id);
    });
    this.updateAttachmentPanel();
  }

  renderPlayerDebuffs(playerState: PlayerCombatState): void {
    const entries = playerDebuffEntries(playerState);
    this.playerDebuffs.innerHTML = entries.map((entry) => `
      <article class="player-debuff" data-debuff="${entry.kind}">
        ${PLAYER_DEBUFF_ICONS[entry.kind]}
        <span><small>${entry.label}</small><strong>${entry.value}</strong></span>
        <em>${entry.turns}턴</em>
      </article>`).join('');
    this.playerDebuffs.hidden = entries.length === 0;
    this.playerDebuffs.setAttribute('aria-label', entries.length === 0
      ? '플레이어 약화 효과 없음'
      : `플레이어 약화 효과: ${entries.map((entry) => `${entry.label}, ${entry.value}, ${entry.turns}턴`).join('; ')}`);
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

  updateRecoilThreshold(threshold: number, playerDebuffPenaltyBonus = 0): void {
    this.recoilThreshold = threshold;
    this.recoilDebuffPenaltyBonus = playerDebuffPenaltyBonus;
    this.renderRecoilGauge();
  }

  setPhase(phase: GamePhase): void {
    this.phaseText.textContent = PHASE_LABELS[phase];
    (this.required(this.shell, '#ammo-supply-button') as HTMLButtonElement).disabled = ['WEAPON_SELECTION', 'GAME_OVER', 'VICTORY'].includes(phase);
    if (this.inventorySupplyMode && (phase === 'GAME_OVER' || phase === 'VICTORY')) this.closeAmmoInventory();
    document.body.dataset.phase = phase;
    if (phase !== 'AMMO_SELECTION' && this.firepowerTooltipMode === 'touch') this.hideTooltip();
  }

  updateEnemy(enemy: EnemyState, action: EnemyActionPreview, wave: number, waveCount: number, enemyNumber: number, enemyCount: number): void {
    this.hpFill.style.width = `${Math.max(0, enemy.hp / enemy.maxHp) * 100}%`;
    this.hpText.textContent = `${enemy.hp} / ${enemy.maxHp}`;
    this.woundText.textContent = `${enemy.wound}/${enemy.woundThreshold}`;
    this.woundText.closest<HTMLElement>('.enemy-stat')?.toggleAttribute('data-empty', enemy.wound === 0);
    const explosiveText = this.required(this.shell, '#explosive-text');
    explosiveText.textContent = String(enemy.explosive);
    explosiveText.closest<HTMLElement>('.enemy-stat')?.toggleAttribute('data-empty', enemy.explosive === 0);
    this.required(this.shell, '#burn-text').textContent = `${enemy.burn}/${enemy.burnThreshold}`;
    this.impactText.textContent = String(enemy.actionShock);
    this.impactThreshold.textContent = `/${action.threshold}`;
    this.impactFill.style.width = `${Math.min(100, enemy.actionShock / action.threshold * 100)}%`;
    this.impactText.closest<HTMLElement>('.enemy-stat')?.toggleAttribute('data-empty', enemy.actionShock === 0);
    const statuses: string[] = [];
    if (isVulnerable(enemy)) statuses.push(`<span data-status="vulnerable">취약 ${enemy.vulnerableTurns}턴 · 체력 피해 +${COMBAT_BALANCE.vulnerableDamagePercent}%</span>`);
    if (isIgnited(enemy)) statuses.push('<span data-status="ignited">점화</span>');
    this.enemyStatus.innerHTML = statuses.join('');
    this.enemyStatus.hidden = statuses.length === 0;
    this.distanceText.textContent = `${enemy.distance.toFixed(1)} m`;
    const rangeBand = getRangeBand(enemy.distance);
    this.rangeBandText.textContent = RANGE_NAMES[rangeBand];
    const enemyName = enemy.trainingActions ? '훈련 감염체' : ENEMY_DEFINITIONS[enemy.type].name;
    this.levelText.textContent = enemyName;
    this.waveText.textContent = `조우 ${wave}/${waveCount} · 표적 ${enemyNumber}/${enemyCount}`;
    this.nextActionName.textContent = action.selectedAction === 'approach'
      ? `${ACTION_NAMES[action.selectedAction]} ${action.movement.toFixed(1)} m`
      : ACTION_NAMES[action.selectedAction];
    if (action.suppressedIntent) this.nextActionName.textContent = `${ACTION_NAMES[action.suppressedIntent]} 봉쇄 → 접근 ${action.movement.toFixed(1)} m`;
    this.nextAction.toggleAttribute('data-ignition-suppressed', Boolean(action.suppressedIntent));
    this.nextActionShock.querySelector<HTMLElement>('b')!.textContent = String(action.threshold);
    this.nextActionShock.setAttribute('aria-label', `중단 충격 ${action.threshold}`);
    const actionDescription = action.suppressedIntent
      ? `점화로 ${ACTION_NAMES[action.suppressedIntent]}의 모든 효과를 봉쇄하고 ${action.movement.toFixed(1)} m 접근합니다.`
      : action.selectedAction === 'approach'
      ? `${action.movement.toFixed(1)} m 접근합니다.`
      : action.selectedAction === 'attack'
        ? '방어선을 돌파해 전투를 끝냅니다.'
        : enemy.intent?.description ?? ({
          contaminate: '장착물 슬롯 하나를 2턴 동안 봉쇄합니다.',
          groundShock: '반동에 따른 화력 감소를 2턴 동안 강화합니다.',
          sonicPulse: '유효 거리 판정을 2턴 동안 1단계 악화합니다.',
        }[action.selectedAction]);
    this.enemyContext.innerHTML = `<span><b>상처 ${enemy.woundThreshold}</b>마다 소비하여 <b>취약 ${COMBAT_BALANCE.vulnerableTurns}턴</b>을 부여합니다. 발동 턴 포함, 후속 사격의 체력 피해만 +${COMBAT_BALANCE.vulnerableDamagePercent}% (열상탄 +100%).</span><span>초과 상처는 남고, 다시 발동하면 지속 시간을 갱신합니다.</span><span><b>폭발</b>은 한도 없이 누적됩니다. 충격 1 이상인 탄약이 명중하면 전량 소비해 <b>누적량 ×${COMBAT_BALANCE.explosionDamagePerStack} 피해</b>를 줍니다. 폭발 피해는 거리·반동·취약의 영향을 받지 않습니다.</span><span><b>충격</b>이 임계치에 닿으면 다음 행동이 중단됩니다.</span><span class="intent-detail"><b>${ACTION_NAMES[action.selectedAction]}</b> · ${actionDescription}</span>`;
    this.enemyContext.parentElement?.setAttribute('aria-label', `${enemyName}, 체력 ${enemy.hp}/${enemy.maxHp}, 상처 ${enemy.wound}/${enemy.woundThreshold}, 취약 ${enemy.vulnerableTurns}턴, 폭발 ${enemy.explosive}, 화상 ${enemy.burn}/${enemy.burnThreshold}${isIgnited(enemy) ? ', 점화' : ''}, 충격 ${enemy.actionShock}/${action.threshold}, 다음 행동 ${this.nextActionName.textContent}`);
    this.enemyContext.insertAdjacentHTML('beforeend', `<span><b>화상 ${enemy.burn}/${enemy.burnThreshold}</b> · 턴 사이에 유지되며 자동 피해는 없습니다. 한 발당 임계치를 한 번 소비해 초과분을 남기고 <b>점화</b>합니다. 다음 행동을 수행할 때 특수 행동을 일반 접근으로 바꾸고 점화가 해제됩니다. 충격으로 행동이 중단되면 점화는 유지됩니다.</span>`);
  }

  renderPreview(sequence: SequenceResult | undefined,
    ammoOptionPreviews: Partial<Record<AmmoType, RoundPreview>> = this.ammoOptionPreviews): void {
    this.roundPreviews = sequence?.roundPreviews ?? [];
    this.ammoOptionPreviews = ammoOptionPreviews;
    this.slots.forEach((slot, index) => {
      const content = slot.querySelector<HTMLElement>('.slot-content');
      content?.querySelector('.sequence-stats')?.remove();
      content?.querySelector('.trait-bonus')?.remove();
      content?.querySelector('.sequence-burn-state')?.remove();
      const predictedUnfired = Boolean(sequence?.killed && index >= sequence.shots.length && index < sequence.roundPreviews.length);
      slot.classList.toggle('will-not-fire', predictedUnfired);
      const round = sequence?.roundPreviews[index];
      if (!round || !content) return;
      const visibleStats = firingOrderStatEntries(round);
      content.insertAdjacentHTML('beforeend', `<span class="trait-bonus" ${round.traitBonus ? 'title="주효과 강화"' : 'aria-hidden="true"'}>${round.traitBonus ? `${({ firepower: '화력', wound: '상처', explosive: '폭발', actionShock: '충격', burn: '화상' })[AMMO_DEFINITIONS[round.ammoType].primaryPayload]} +${round.traitBonus}` : ''}</span>`);
      content.insertAdjacentHTML('beforeend', `<span class="sequence-stats">${visibleStats.map((stat) => `<span class="sequence-stat sequence-${stat.kind}" ${stat.modified ? 'data-modified' : ''} aria-label="${stat.label} ${stat.value}">${COMBAT_STAT_ICONS[stat.kind]}<b>${stat.value}</b></span>`).join('')}${round.movement ? `<span class="sequence-move" aria-label="${round.movement < 0 ? '사격 전 전진' : '사격 후 후퇴'} ${Math.abs(round.movement)}m">${round.movement < 0 ? '←' : '→'}${Math.abs(round.movement)}</span>` : ''}</span>`);
      slot.setAttribute('aria-label', `${index + 1}번 슬롯: ${AMMO_DEFINITIONS[round.ammoType].name}${this.locked ? ', 수정 불가' : ', 탭하여 즉시 제거'}, ${visibleStats.map((stat) => `${stat.label} ${stat.value}`).join(', ')}${predictedUnfired ? ', 예상 미발사' : ''}`);
      if (round.burn > 0 || round.ignitedBonus > 0) {
        content.insertAdjacentHTML('beforeend', `<span class="sequence-burn-state" title="화상 ${round.burnBefore} → ${round.burnAfter}/${round.burnThreshold} · 즉시 화상 피해 ${round.burnDamage}${round.ignitedBonus ? ` · 점화 화력 +${round.ignitedBonus}` : ''}">${round.ignitionTriggered ? '<span>점화</span>' : ''}<span>${round.burnAfter}/${round.burnThreshold}</span>${round.nextBurnPercent ? `<span>다음 ×${1 + round.nextBurnPercent / 100}</span>` : ''}${round.ignitedBonus ? `<span>화력 +${round.ignitedBonus}</span>` : ''}</span>`);
        slot.setAttribute('aria-label', `${slot.getAttribute('aria-label')}, 사격 후 화상 ${round.burnAfter}/${round.burnThreshold}${round.ignitionTriggered ? ', 점화' : ''}${round.nextBurnPercent ? `, 다음 탄 화상 +${round.nextBurnPercent}%` : ''}${round.ignitedBonus ? `, 점화 화력 +${round.ignitedBonus}` : ''}`);
      }
    });
    if (!sequence) {
      this.previewOutcome.hidden = true;
      this.firepowerBreakdown = undefined;
      this.setRecoilAmount(0, '예상 반동');
      if (this.firepowerTooltipMode) this.hideTooltip();
      return;
    }
    this.setRecoilAmount(sequence.shots.at(-1)?.breakdown.recoilAfter ?? 0, '예상 반동');
    this.updateForecastVisibility();
    this.updateFirepowerPanel(sequence.firepowerBreakdown, '총 화력');
    this.required(this.previewOutcome, '#forecast-wound-value').textContent = `+${sequence.totalWoundApplied}`;
    this.required(this.previewOutcome, '#forecast-explosive-value').textContent = String(sequence.finalState.explosive);
    this.renderBurnForecast(sequence.finalState);
    this.required(this.previewOutcome, '#forecast-impact-value').textContent = String(sequence.totalActionShockApplied);
    this.required(this.previewOutcome, '#forecast-range-value').textContent = `${sequence.finalState.distance.toFixed(1)} m`;
    this.previewOutcome.hidden = false;
    this.updateForecastLabel();
  }

  showShot(result: ShotResult): void {
    this.slots.forEach((slot, index) => slot.classList.toggle('is-firing', index === result.index));
    const shot = result.breakdown;
    this.updateFirepowerPanel({
      prePenaltyFirepower: shot.prePenaltyFirepower,
      recoilReduction: shot.recoilFirepowerReduction,
      playerDebuffReduction: shot.playerDebuffFirepowerReduction,
      distanceReduction: shot.distanceFirepowerReduction,
      distancePenaltyPercents: shot.distanceFirepowerReduction > 0 ? [shot.rangePenaltyPercent] : [],
      detonationDamage: shot.detonationDamage,
      finalFirepower: shot.finalFirepower,
    }, '현재 탄 화력');
    this.required(this.previewOutcome, '#forecast-wound-value').textContent = `+${result.woundApplied}`;
    this.required(this.previewOutcome, '#forecast-explosive-value').textContent = String(result.after.explosive);
    this.renderBurnForecast(result.after);
    this.required(this.previewOutcome, '#forecast-impact-value').textContent = String(result.actionShockApplied);
    this.required(this.previewOutcome, '#forecast-range-value').textContent = `${result.after.distance.toFixed(1)} m`;
    this.updateForecastLabel();
  }

  private updateForecastVisibility(): void {
    // 예상 미발사 탄약도 선택된 순서에 포함되며, 소비 후 잔량 0과 효과 없음은 구분한다.
    const effects = [
      ['wound', 'wound'], ['explosive', 'explosive'], ['burn', 'burn'], ['impact', 'effectiveActionShock'],
    ] as const;
    for (const [kind, payload] of effects) {
      const visible = this.roundPreviews.some(round =>
        round[payload] > 0 || AMMO_DEFINITIONS[round.ammoType][kind === 'impact' ? 'actionShock' : kind] > 0);
      this.required(this.previewOutcome, `.forecast-${kind}`).hidden = !visible;
    }
    const count = this.previewOutcome.querySelectorAll('.forecast-stat:not([hidden])').length;
    this.previewOutcome.style.setProperty('--forecast-stat-count', String(count));
  }

  private updateForecastLabel(): void {
    const entries = [...this.previewOutcome.querySelectorAll<HTMLElement>('.forecast-stat:not([hidden])')]
      .map(card => `${card.querySelector('small')?.textContent} ${card.querySelector('strong')?.textContent}`);
    this.previewOutcome.setAttribute('aria-label', `발사 결과 예상: ${entries.join(', ')}`);
  }

  showRecoilAfterShot(recoilAfter: number): void {
    this.setRecoilAmount(recoilAfter, '현재 반동');
  }
  private renderBurnForecast(enemy: EnemyState): void {
    this.required(this.previewOutcome, '#forecast-burn-value').textContent = `${enemy.burn}/${enemy.burnThreshold}`;
    const action = previewEnemyAction(enemy);
    this.required(this.previewOutcome, '#forecast-burn-label').textContent = action.suppressedIntent
      ? '점화·봉쇄' : isIgnited(enemy) ? '점화·잔량' : '화상 잔량';
    this.previewOutcome.querySelector('.forecast-burn')?.setAttribute('title', action.suppressedIntent
      ? `${ACTION_NAMES[action.suppressedIntent]} 봉쇄 → 접근 ${action.movement.toFixed(1)} m` : `화상 ${enemy.burn}/${enemy.burnThreshold}`);
  }
  showEndState(title: string, show: boolean): void {
    this.endTitle.textContent = title;
    this.overlay.hidden = !show;
  }

  private openAttachmentInventory(opener: HTMLButtonElement): void {
    if (this.locked) return;
    this.hideTooltip();
    const host = this.required(this.shell, '#attachment-inventory');
    const background = new Map<HTMLElement, boolean>();
    for (const sibling of host.parentElement?.children ?? []) {
      if (!(sibling instanceof HTMLElement) || sibling === host) continue;
      background.set(sibling, sibling.inert);
      sibling.inert = true;
    }
    const owned = [...this.attachmentBay.querySelectorAll<HTMLElement>('[data-attachment][data-owned="true"]')].map(button => button.dataset.attachment);
    host.innerHTML = `<div class="route-card ammo-inventory-dialog attachment-inventory-dialog">
      <header class="ammo-screen-header"><h2 id="attachment-inventory-title">부착물 추가</h2><button type="button" class="ammo-screen-close" data-close-attachment-inventory aria-label="부착물 추가 닫기">×</button></header>
      <div class="ammo-inventory-panel">${ATTACHMENT_SLOT_ORDER.map(slot => `<section class="ammo-family-group"><h3 class="ammo-family-heading">${ATTACHMENT_SLOT_NAMES[slot]}</h3><div class="attachment-inventory-grid">${ATTACHMENT_ORDER.filter(id => ATTACHMENT_DEFINITIONS[id].slot === slot).map(id => {
        const item = ATTACHMENT_DEFINITIONS[id];
        const has = owned.includes(id);
        return `<article class="attachment-inventory-card"><div class="inventory-card-head"><span class="attachment-rarity" data-rarity="${item.rarity}">${ATTACHMENT_RARITY_NAMES[item.rarity]}</span><b data-attachment-quantity="${id}">보유 ${has ? 1 : 0}</b></div><strong>${item.name}</strong><p>${item.summary}</p>${!isAttachmentCompatible(id, this.weapon.id) ? '<small>현재 총기 장착 불가</small>' : ''}<div class="supply-actions"><button type="button" class="supply-action" data-remove-supply-attachment="${id}" ${has ? '' : 'disabled'} aria-label="${item.name} 제거">−</button><button type="button" class="supply-action" data-supply-attachment="${id}" ${has ? 'disabled' : ''} aria-label="${item.name} 추가">+</button></div></article>`;
      }).join('')}</div></section>`).join('')}</div></div>`;
    const close = () => {
      host.hidden = true;
      host.onkeydown = null;
      for (const [element, wasInert] of background) element.inert = wasInert;
      opener.focus();
    };
    host.querySelector('[data-close-attachment-inventory]')?.addEventListener('click', close);
    host.querySelectorAll<HTMLButtonElement>('[data-supply-attachment]').forEach(button => button.addEventListener('click', () => {
      this.callbacks.onSupplyAttachment(button.dataset.supplyAttachment as AttachmentId);
      button.parentElement?.querySelector<HTMLButtonElement>('[data-remove-supply-attachment]')?.focus();
    }));
    host.querySelectorAll<HTMLButtonElement>('[data-remove-supply-attachment]').forEach(button => button.addEventListener('click', () => {
      this.callbacks.onRemoveSupplyAttachment(button.dataset.removeSupplyAttachment as AttachmentId);
      button.parentElement?.querySelector<HTMLButtonElement>('[data-supply-attachment]')?.focus();
    }));
    host.onkeydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key !== 'Tab') return;
      const buttons = [...host.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
      if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0]?.focus(); }
    };
    host.hidden = false;
    host.querySelector<HTMLButtonElement>('[data-close-attachment-inventory]')?.focus();
  }

  private ammoRarityMarkup(ammo: AmmoType): string {
    const definition = AMMO_DEFINITIONS[ammo];
    return `<span class="ammo-rarity" data-rarity="${definition.rarity}">${RARITY_NAMES[definition.rarity]}</span>`;
  }

  private ammoQuantity(ammo: AmmoType): string {
    return ammo === 'ball' ? '∞' : `×${this.build[ammo]}`;
  }

  private openAmmoInventory(opener: HTMLButtonElement, supply = false): void {
    this.inventorySupplyMode = supply;
    this.hideTooltip();
    this.inventoryOpener = opener;
    this.inventoryBackgroundInert.clear();
    for (const sibling of this.ammoInventory.parentElement?.children ?? []) {
      if (!(sibling instanceof HTMLElement) || sibling === this.ammoInventory) continue;
      this.inventoryBackgroundInert.set(sibling, sibling.inert);
      sibling.inert = true;
    }
    const owned = supply ? AMMO_ORDER : AMMO_ORDER.filter(ammo => ammo === 'ball' || this.build[ammo] > 0);
    const groups = Object.entries(AMMO_FAMILY_LABELS).map(([family, label]) => ({
      family, label, ammo: owned.filter(ammo => AMMO_DEFINITIONS[ammo].family === family),
    })).filter(group => group.ammo.length > 0);
    const inventory = groups.map(group => `<section id="ammo-family-${group.family}" class="ammo-family-group" aria-labelledby="ammo-family-${group.family}-title">
      <h3 id="ammo-family-${group.family}-title" class="ammo-family-heading">${group.label}</h3>
      <div class="ammo-inventory-grid">${group.ammo.map(ammo => this.ammoInventoryCardMarkup(ammo, supply)).join('')}</div>
    </section>`).join('');
    this.ammoInventory.innerHTML = `<div class="route-card ammo-inventory-dialog${supply ? ' ammo-supply-dialog' : ''}">
      <header class="ammo-screen-header"><h2 id="ammo-inventory-title">${supply ? '탄약 추가' : '보유 탄약'}</h2><button type="button" class="ammo-screen-close" data-close-ammo-inventory aria-label="${supply ? '탄약 추가' : '보유 탄약'} 닫기">×</button></header>
      <nav class="ammo-family-navigation" aria-label="탄약 계열 바로가기">${groups.map(group => `<button type="button" data-ammo-family-target="${group.family}" aria-controls="ammo-family-${group.family}">${group.label}</button>`).join('')}</nav>
      <div class="ammo-inventory-panel">${inventory}</div>
      <button type="button" class="ammo-inspect-layer" data-ammo-inspect hidden aria-label="탄약 상세 닫기"></button>
    </div>`;
    const panel = this.required(this.ammoInventory, '.ammo-inventory-panel');
    this.ammoInventory.querySelectorAll<HTMLButtonElement>('[data-ammo-family-target]').forEach(button => button.addEventListener('click', () => {
      const group = this.required(panel, `#ammo-family-${button.dataset.ammoFamilyTarget}`);
      panel.scrollTo({ top: panel.scrollTop + group.getBoundingClientRect().top - panel.getBoundingClientRect().top });
    }));
    const inspectLayer = this.required(this.ammoInventory, '[data-ammo-inspect]') as HTMLButtonElement;
    this.ammoInventory.querySelector<HTMLButtonElement>('[data-close-ammo-inventory]')?.addEventListener('click', () => this.closeAmmoInventory());
    this.ammoInventory.querySelectorAll<HTMLButtonElement>('[data-supply-ammo]').forEach(button => button.addEventListener('click', () => {
      this.callbacks.onSupplyAmmo(button.dataset.supplyAmmo as SpecialAmmoType);
    }));
    this.ammoInventory.querySelectorAll<HTMLButtonElement>('[data-remove-supply-ammo]').forEach(button => button.addEventListener('click', () => {
      this.callbacks.onRemoveSupplyAmmo(button.dataset.removeSupplyAmmo as SpecialAmmoType);
    }));
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
    this.ammoInventory.querySelector<HTMLButtonElement>('[data-supply-ammo]:not(:disabled), [data-inspect-ammo]:not(:disabled)')?.focus();
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

  private ammoInventoryCardMarkup(ammo: AmmoType, supply: boolean): string {
    const definition = AMMO_DEFINITIONS[ammo];
    const infinite = ammo === 'ball';
    const quantity = supply ? (infinite ? '∞' : `×${this.stock[ammo]}`) : this.ammoQuantity(ammo);
    if (supply) {
      const unavailable = infinite || this.build[ammo] <= 0 || (this.stock[ammo] as number) - this.rounds.filter(value => value === ammo).length <= 0;
      return `<div class="ammo-inventory-card ammo-${ammo} ammo-supply-card" style="--bullet:${definition.cssColor}">
        <span class="inventory-card-head">${this.ammoRarityMarkup(ammo)}<b data-supply-quantity="${ammo}">${quantity}</b></span>
        <span class="supply-round"><span class="round-visual"><i></i></span></span>
        <strong>${definition.name}</strong>${ammoStatsMarkup(ammo)}
        <div class="supply-actions"><button type="button" class="supply-action" data-remove-supply-ammo="${ammo}" ${unavailable ? 'disabled' : ''} aria-label="${definition.name} 1발 제거">-1</button><button type="button" class="supply-action" data-supply-ammo="${ammo}" ${infinite ? 'disabled' : ''} aria-label="${definition.name} 1발 추가">+1</button></div>
      </div>`;
    }
    return `<button type="button" class="ammo-inventory-card ammo-${ammo}"
      style="--bullet:${definition.cssColor}" data-inspect-ammo="${ammo}" aria-label="${definition.name} ${quantity} 상세 보기">
      <span class="inventory-card-head">${this.ammoRarityMarkup(ammo)}<b data-supply-quantity="${ammo}">${quantity}</b></span>
      <strong>${definition.name}</strong>${ammoStatsMarkup(ammo)}
    </button>`;
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
    label.textContent = this.weapon.trait === 'cylinder' ? '실린더 장전' : '탄창 장전';
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
    if (this.firepowerTooltipMode !== 'focus') this.hideTooltip();
  };

  private readonly updateResponsiveLayout = (): void => {
    applyResponsiveLayoutMode(this.shell);
  };

  private updateFirepowerPanel(breakdown: FirepowerBreakdown, label: string): void {
    this.firepowerBreakdown = breakdown;
    this.firepowerLabel.textContent = label;
    this.firepowerValue.textContent = String(breakdown.finalFirepower);
    this.firepowerButton.setAttribute('aria-label', `${label} ${breakdown.finalFirepower}, 화력 상세`);
    if (this.firepowerTooltipMode) this.renderFirepowerTooltip();
  }

  private setRecoilAmount(amount: number, label: string): void {
    this.recoilAmount = amount;
    this.recoilGauge.setAttribute('aria-label', label);
    this.renderRecoilGauge();
  }

  private renderRecoilGauge(): void {
    const scale = Math.max(this.recoilThreshold, 1);
    const recoilPenalty = recoilFirepowerPenalty(this.recoilAmount, this.recoilThreshold);
    const nextShotPenalty = recoilPenalty + (this.recoilAmount > 0 ? this.recoilDebuffPenaltyBonus : 0);
    const full = nextShotPenalty > 0;
    this.recoilFill.style.width = `${Math.min(100, this.recoilAmount / scale * 100)}%`;
    this.recoilValue.textContent = `${this.recoilAmount} / ${this.recoilThreshold}`;
    this.recoilNextPenalty.textContent = nextShotPenalty ? `-${nextShotPenalty}` : '0';
    this.recoilGauge.toggleAttribute('data-full', full);
    this.recoilGauge.setAttribute('aria-valuenow', String(this.recoilAmount));
    this.recoilGauge.setAttribute('aria-valuemax', String(Math.max(scale, this.recoilAmount)));
    this.recoilGauge.setAttribute('aria-valuetext', `반동 ${this.recoilAmount}, 임계치 ${this.recoilThreshold}, 다음 탄 반동 화력 ${recoilPenalty ? `-${recoilPenalty}` : '감소 없음'}${this.recoilDebuffPenaltyBonus && this.recoilAmount > 0 ? `, 교란 추가 -${this.recoilDebuffPenaltyBonus}` : ''}`);
  }

  private renderFirepowerTooltip(): void {
    const breakdown = this.firepowerBreakdown;
    if (!breakdown) return;
    const hasPenalty = breakdown.recoilReduction > 0 || breakdown.playerDebuffReduction > 0 || breakdown.distanceReduction > 0;
    this.ammoTooltip.innerHTML = `<header><span>화력 상세</span><strong>${breakdown.finalFirepower}</strong></header><div class="firepower-breakdown">
      ${breakdown.detonationDamage > 0 ? `<span>기폭 피해 <b>+${breakdown.detonationDamage}</b></span>` : ''}
      ${hasPenalty ? `<span>감쇠 전 탄약 화력 <b>${breakdown.prePenaltyFirepower - breakdown.detonationDamage}</b></span>
      ${breakdown.distanceReduction > 0 ? `<span class="distance-reduction">거리 감소 <b>-${breakdown.distanceReduction}</b></span>` : ''}
      ${breakdown.recoilReduction > 0 ? `<span class="recoil-reduction">반동 <b>-${breakdown.recoilReduction}</b></span>` : ''}
      ${breakdown.playerDebuffReduction > 0 ? `<span>반동 교란 <b>-${breakdown.playerDebuffReduction}</b></span>` : ''}` : '<span>적용된 화력 감소 없음</span>'}
    </div>`;
  }

  private showFirepowerTooltip(mode: 'mouse' | 'focus' | 'touch'): void {
    if (!this.firepowerBreakdown || this.previewOutcome.hidden) return;
    this.hideTooltip();
    this.firepowerTooltipMode = mode;
    this.ammoTooltip.classList.remove('is-attachment');
    this.ammoTooltip.classList.add('is-firepower');
    this.ammoTooltip.style.setProperty('--tooltip-color', '#ff6756');
    this.renderFirepowerTooltip();
    this.ammoTooltip.hidden = false;
    this.firepowerButton.setAttribute('aria-describedby', 'ammo-tooltip');
    this.firepowerButton.setAttribute('aria-expanded', 'true');
  }

  private clearFirepowerLeaveTimer(): void {
    if (this.firepowerLeaveTimer !== undefined) window.clearTimeout(this.firepowerLeaveTimer);
    this.firepowerLeaveTimer = undefined;
  }

  private scheduleFirepowerTooltipClose(): void {
    this.clearFirepowerLeaveTimer();
    this.firepowerLeaveTimer = window.setTimeout(() => {
      if (this.firepowerTooltipMode === 'mouse') this.hideTooltip();
    }, 140);
  }

  private showAmmoTooltip(ammo: AmmoType, anchor: HTMLElement, round?: RoundPreview, assumedAppend = false): void {
    this.hideTooltip();
    const definition = AMMO_DEFINITIONS[ammo];
    const firepower = ammoTooltipFirepower(ammo, round);
    const shock = round?.effectiveActionShock ?? definition.actionShock;
    const firepowerLabel = firepower.change === 'weakened' ? '반동 감소 반영 화력'
      : firepower.change === 'strengthened' ? '강화 반영 화력' : '화력';
    this.ammoTooltip.innerHTML = `<header><span>${RARITY_NAMES[definition.rarity]} · ${BUILD_TAG_NAMES[definition.tags[0]!]}</span><strong>${definition.name}</strong></header><p>${definition.role}</p><div><span class="tooltip-firepower">${assumedAppend ? '추가 시 화력' : '화력'} <b data-firepower-change="${firepower.change}" aria-label="${firepowerLabel} ${firepower.value}">${firepower.value}</b></span><span>상처 <b>${round?.wound ?? definition.wound}</b></span><span>폭발 <b>${round?.explosive ?? definition.explosive}</b></span><span>${assumedAppend ? '추가 시 충격' : '충격'} <b ${round && round.shockBonus > 0 ? 'data-shock-boosted' : ''}>${shock}</b></span><span>반동 <b>${round?.recoilGenerated ?? definition.recoil}</b></span></div>`;
    this.ammoTooltip.style.setProperty('--tooltip-color', definition.cssColor);
    if (definition.family === 'BURN' || round?.burn) {
      const values = this.ammoTooltip.querySelector('div')!;
      values.insertAdjacentHTML('beforeend', `<span>화상 축적 <b>${round?.burn ?? definition.burn}</b></span><span>즉시 화상 피해 <b>${round?.burnDamage ?? definition.burnDamage}</b></span>`);
      if (round) values.insertAdjacentHTML('beforeend', `<span>사격 후 화상 <b>${round.burnAfter}/${round.burnThreshold}${round.ignitionTriggered ? ' · 점화' : ''}</b></span><span>직접 최종 화력 <b>${round.directFirepower}</b></span>`);
      if (round) values.insertAdjacentHTML('beforeend', `<span>거리 감소 <b>${round.rangePenaltyPercent}%</b></span><span>반동 화력 감소 <b>${round.recoilPenalty}</b></span>`);
      const effect = burnEffectText(ammo);
      if (effect) this.ammoTooltip.insertAdjacentHTML('beforeend', `<small>${effect}</small>`);
    }
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
    this.clearFirepowerLeaveTimer();
    this.firepowerTooltipMode = undefined;
    this.ammoTooltip.hidden = true;
    this.ammoTooltip.classList.remove('is-firepower');
    this.firepowerButton.setAttribute('aria-expanded', 'false');
    document.querySelectorAll('[aria-describedby="ammo-tooltip"]').forEach((element) => element.removeAttribute('aria-describedby'));
  }

  private closeNextActionTooltip(): void {
    this.enemyCard.removeAttribute('data-action-tooltip-open');
    this.nextAction.setAttribute('aria-expanded', 'false');
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
      if (element.getAttribute('aria-describedby') === 'ammo-tooltip') this.hideTooltip();
    });
    element.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') {
        clear();
        this.hideTooltip();
      }
    });
    element.addEventListener('blur', () => {
      clear();
      if (element.getAttribute('aria-describedby') === 'ammo-tooltip') this.hideTooltip();
    });
    element.addEventListener('focus', () => {
      clear();
      if (element.matches(':focus-visible')) show();
    });
  }

  private bindTouchTooltip(element: HTMLButtonElement, show: () => void): void {
    element.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' || event.button !== 0) return;
      this.hideTooltip();
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
        if (!longPressed) {
          this.hideTooltip();
          return;
        }
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
