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
  directFirepower: number;
  rangeBand: RangeBand;
  effectiveRangeBand: RangeBand;
  rangePenaltyPercent: number;
  distanceAdjustedFirepower: number;
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

export interface SequenceResult {
  shots: ShotResult[];
  finalState: EnemyState;
  totalHpDamage: number;
  totalArmorDamage: number;
  totalActionShockApplied: number;
  effectiveRangePenaltyPercent: number;
  conservedRounds: AmmoType[];
  unfiredRounds: AmmoType[];
  returnedRounds: AmmoType[];
  killed: boolean;
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
