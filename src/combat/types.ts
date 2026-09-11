export type AmmoType =
  | 'wadcutter'
  | 'flatPoint'
  | 'overpressure'
  | 'subsonic'
  | 'bonded'
  | 'match'
  | 'standard'
  | 'armorPiercing'
  | 'hollowPoint'
  | 'incendiary'
  | 'stagger'
  | 'magnum'
  | 'cryo'
  | 'arc'
  | 'sanctified'
  | 'bloodHex';

export type AmmoRarity = 'common' | 'uncommon' | 'rare' | 'mythic';
export type BuildTag = 'ballistic' | 'elemental' | 'sacred' | 'occult';
export type RangeBand = 'near' | 'mid' | 'far';
export type StatusType = 'burn' | 'chill' | 'shock' | 'corruption';
export type AttachmentSlot = 'muzzle' | 'magazine' | 'optic' | 'rail' | 'grip';

export type EnemyType = 'normal' | 'armored' | 'fast' | 'tough' | 'contaminator' | 'groundshaker' | 'screecher';
export type EnemyIntentType = 'contaminate' | 'groundShock' | 'sonicPulse';

export type EnemyActionType = 'approach' | 'attack' | EnemyIntentType;

export interface EnemyIntentState {
  type: EnemyIntentType;
  name: string;
  description: string;
  countdown: number;
  cooldown: number;
}

export interface EnemyStatuses {
  burnTurns: number;
  slowTurns: number;
  shockTurns: number;
  corruptedShots: number;
  buildup: Record<StatusType, number>;
}

export interface EnemyState {
  type: EnemyType;
  hp: number;
  maxHp: number;
  armor: number;
  maxArmor: number;
  distance: number;
  advancePerTurn: number;
  shockResistance: number;
  actionShock: number;
  special: boolean;
  turnsElapsed: number;
  intent?: EnemyIntentState;
  statuses: EnemyStatuses;
}

export interface PlayerCombatState {
  heavyKickPenaltyBonus: number;
  heavyKickPenaltyTurns: number;
  rangePenaltySteps: number;
  rangePenaltyTurns: number;
  disabledSlots: Partial<Record<AttachmentSlot, number>>;
}

export interface ShotBreakdown {
  weaponFirepower: number;
  ammoFirepower: number;
  attachmentFirepower: number;
  /** 탄약/장착물/상태/인접 탄 효과를 모두 반영하되 거리 화력 감소 전인 탄별 유효 화력. */
  effectiveFirepower: number;
  rangeBand: RangeBand;
  effectiveRangeBand: RangeBand;
  statusFirepowerBonus: number;
  specialFirepowerBonus: number;
  armorBlocked: number;
  armorBroken: number;
  heavyKickPenalty: number;
  stabilized: boolean;
  shockSaturationPenalty: number;
  projectedShock: number;
  finalFirepower: number;
  finalDamage: number;
}

export interface ShotResult {
  ammoType: AmmoType;
  index: number;
  damage: number;
  hpDamage: number;
  armorDamage: number;
  burnApplied: number;
  actionShockApplied: number;
  statusTriggered?: StatusType;
  conserved: boolean;
  killed: boolean;
  description: string;
  breakdown: ShotBreakdown;
  before: EnemyState;
  after: EnemyState;
}

/** 실제 사망 시점과 무관하게 장전된 각 탄이 순서 효과까지 반영해 갖는 전투 수치. */
export interface RoundPreview {
  ammoType: AmmoType;
  index: number;
  effectiveFirepower: number;
  armorBreak: number;
  effectiveActionShock: number;
  heavyKickPenalty: number;
  shockSaturationPenalty: number;
}

export interface SequenceResult {
  shots: ShotResult[];
  roundPreviews: RoundPreview[];
  finalState: EnemyState;
  rawVolleyFirepower: number;
  baseRangePenaltyPercent: number;
  matchAmmoCount: number;
  matchRangePenaltyReductionPercent: number;
  finalRangePenaltyPercent: number;
  finalVolleyFirepower: number;
  totalHpDamage: number;
  /** 탄약 고유 방어 파괴로 실제 제거한 방어의 합계. 일반 화력에 흡수된 방어는 포함하지 않는다. */
  totalArmorBreak: number;
  totalActionShockApplied: number;
  conservedRounds: AmmoType[];
  unfiredRounds: AmmoType[];
  returnedRounds: AmmoType[];
  killed: boolean;
}

export interface EnemyActionPreview {
  selectedAction: EnemyActionType;
  threshold: number;
  movement: number;
}

export interface EnemyActionResult {
  selectedAction: EnemyActionType;
  threshold: number;
  interrupted: boolean;
  /** 휴면 원소 전하의 특수 행동 교란. 행동 충격 소비와 구분한다. */
  elementalInterruption: boolean;
  shockConsumed: number;
  shockRemaining: number;
  playerKilled: boolean;
  before: EnemyState;
  after: EnemyState;
  playerBefore: PlayerCombatState;
  playerAfter: PlayerCombatState;
  burnDamage: number;
  movement: number;
  intentResolved?: EnemyIntentType;
  intentDetail?: string;
  killedByBurn: boolean;
}
