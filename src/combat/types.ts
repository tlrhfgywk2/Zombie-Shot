export type AmmoType = 'ball' | 'hollowPoint' | 'lowRecoil' | 'plusP' | 'relay' | 'frangible'
  | 'suppression' | 'execution' | 'kickback' | 'laceration' | 'retreat' | 'advance'
  | 'explosive' | 'highExplosive' | 'stickyCharge'
  | 'wounding' | 'serrated' | 'retreatCutter' | 'advanceCutter' | 'flatNose' | 'heavy'
  | 'reducedImpact' | 'hammer' | 'impactRelay' | 'resonance';
export type AmmoRarity = 'common' | 'uncommon';
export type BuildTag = 'health' | 'wound' | 'explosive' | 'impact';
export type RangeBand = 'near' | 'mid' | 'far';
export type AttachmentSlot = 'barrel' | 'muzzle' | 'magazine' | 'optic' | 'rail' | 'grip';
export type EnemyType = 'normal' | 'brute' | 'fast' | 'tough' | 'contaminator' | 'groundshaker' | 'screecher';
export type EnemyIntentType = 'contaminate' | 'groundShock' | 'sonicPulse';
export type EnemyActionType = 'approach' | 'attack' | EnemyIntentType;

export interface EnemyIntentState {
  type: EnemyIntentType;
  name: string;
  description: string;
  countdown: number;
  cooldown: number;
}
export interface EnemyState {
  type: EnemyType;
  hp: number;
  maxHp: number;
  wound: number;
  explosive: number;
  woundThreshold: number;
  vulnerableTurns: number;
  distance: number;
  advancePerTurn: number;
  shockResistance: number;
  actionShock: number;
  special: boolean;
  turnsElapsed: number;
  intent?: EnemyIntentState;
}
export interface PlayerCombatState {
  heavyKickPenaltyBonus: number;
  heavyKickPenaltyTurns: number;
  rangePenaltySteps: number;
  rangePenaltyTurns: number;
  disabledSlots: Partial<Record<AttachmentSlot, number>>;
}
export interface ShotBreakdown {
  ammoFirepower: number;
  prePenaltyFirepower: number;
  effectiveFirepower: number;
  rangeBand: RangeBand;
  effectiveRangeBand: RangeBand;
  recoilBefore: number;
  recoilGenerated: number;
  recoilAfter: number;
  recoilPenalty: number;
  recoilFirepowerReduction: number;
  playerDebuffFirepowerPenalty: number;
  playerDebuffFirepowerReduction: number;
  followUpBonus: number;
  conditionalBonus: number;
  vulnerableDamageBonus: number;
  rangePenaltyPercent: number;
  distanceFirepowerReduction: number;
  shockFollowUpBonus: number;
  shockScaleBonus: number;
  projectedShock: number;
  detonationDamage: number;
  finalFirepower: number;
}
export interface FirepowerBreakdown {
  prePenaltyFirepower: number;
  recoilReduction: number;
  playerDebuffReduction: number;
  distanceReduction: number;
  distancePenaltyPercents: number[];
  detonationDamage: number;
  finalFirepower: number;
}
export interface ShotResult {
  ammoType: AmmoType;
  index: number;
  damage: number;
  hpDamage: number;
  woundApplied: number;
  explosiveApplied: number;
  explosiveConsumed: number;
  explosionDamage: number;
  vulnerableTriggered: boolean;
  actionShockApplied: number;
  killed: boolean;
  description: string;
  breakdown: ShotBreakdown;
  before: EnemyState;
  after: EnemyState;
  shotDistance: number;
  movement: number;
}
export interface RoundPreview {
  ammoType: AmmoType;
  index: number;
  effectiveFirepower: number;
  recoilFirepowerReduction: number;
  playerDebuffFirepowerReduction: number;
  wound: number;
  explosive: number;
  effectiveActionShock: number;
  shockBonus: number;
  recoil: number;
  followUpBonus: number;
  vulnerableDamageBonus: number;
  movement: number;
}
export interface SequenceResult {
  shots: ShotResult[];
  roundPreviews: RoundPreview[];
  finalState: EnemyState;
  firepowerBreakdown: FirepowerBreakdown;
  totalHpDamage: number;
  totalWoundApplied: number;
  totalExplosiveApplied: number;
  totalActionShockApplied: number;
  unfiredRounds: AmmoType[];
  killed: boolean;
}
export interface EnemyActionPreview { selectedAction: EnemyActionType; threshold: number; movement: number }
export interface EnemyActionResult {
  selectedAction: EnemyActionType;
  threshold: number;
  interrupted: boolean;
  shockConsumed: number;
  shockRemaining: number;
  playerKilled: boolean;
  before: EnemyState;
  after: EnemyState;
  playerBefore: PlayerCombatState;
  playerAfter: PlayerCombatState;
  movement: number;
  intentResolved?: EnemyIntentType;
  intentDetail?: string;
}
