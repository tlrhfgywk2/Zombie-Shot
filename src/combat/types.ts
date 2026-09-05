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
  staggerTurns: number;
  shockTurns: number;
  exposedShots: number;
  corruptedShots: number;
  impact: number;
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
  staggerThreshold: number;
  special: boolean;
  turnsElapsed: number;
  intent?: EnemyIntentState;
  statuses: EnemyStatuses;
}

export interface PlayerCombatState {
  accuracyPenalty: number;
  accuracyPenaltyTurns: number;
  rangePenaltySteps: number;
  rangePenaltyTurns: number;
  disabledSlots: Partial<Record<AttachmentSlot, number>>;
}

export interface ShotBreakdown {
  baseDamage: number;
  accuracy: number;
  rangeBand: RangeBand;
  effectiveRangeBand: RangeBand;
  rangeMultiplier: number;
  attachmentMultiplier: number;
  statusMultiplier: number;
  armorBlocked: number;
  armorBroken: number;
  cumulativeRecoil: number;
  recoilGenerated: number;
  finalDamage: number;
}

export interface ShotResult {
  ammoType: AmmoType;
  index: number;
  damage: number;
  hpDamage: number;
  armorDamage: number;
  burnApplied: number;
  staggerApplied: number;
  impactApplied: number;
  statusTriggered?: StatusType;
  vulnerabilityMultiplier: number;
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
  averageAccuracy: number;
  conservedRounds: AmmoType[];
  unfiredRounds: AmmoType[];
  returnedRounds: AmmoType[];
  killed: boolean;
}

export interface EnemyActionResult {
  before: EnemyState;
  after: EnemyState;
  playerBefore: PlayerCombatState;
  playerAfter: PlayerCombatState;
  burnDamage: number;
  movement: number;
  staggerConsumed: boolean;
  intentResolved?: EnemyIntentType;
  intentDelayed: boolean;
  intentDetail?: string;
  killedByBurn: boolean;
}
