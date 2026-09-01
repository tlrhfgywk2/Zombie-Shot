export type AmmoType = 'standard' | 'armorPiercing' | 'hollowPoint' | 'incendiary' | 'stagger' | 'magnum';

export type EnemyType = 'normal' | 'armored' | 'fast' | 'tough';

export interface EnemyStatuses {
  burnTurns: number;
  staggerTurns: number;
  exposedShots: number;
}

export interface EnemyState {
  type: EnemyType;
  hp: number;
  maxHp: number;
  armor: number;
  maxArmor: number;
  distance: number;
  advancePerTurn: number;
  statuses: EnemyStatuses;
}

export interface ShotResult {
  ammoType: AmmoType;
  index: number;
  damage: number;
  hpDamage: number;
  armorDamage: number;
  burnApplied: number;
  staggerApplied: number;
  vulnerabilityMultiplier: number;
  killed: boolean;
  description: string;
  before: EnemyState;
  after: EnemyState;
}

export interface SequenceResult {
  shots: ShotResult[];
  finalState: EnemyState;
  totalHpDamage: number;
  totalArmorDamage: number;
  killed: boolean;
}

export interface EnemyActionResult {
  before: EnemyState;
  after: EnemyState;
  burnDamage: number;
  movement: number;
  staggerConsumed: boolean;
  killedByBurn: boolean;
}
