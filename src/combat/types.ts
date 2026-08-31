export type AmmoType = 'standard' | 'tracer' | 'fragmenting' | 'incendiary';

export interface ShotResult {
  ammoType: AmmoType;
  index: number;
  damage: number;
  bonusDamage: number;
  burnApplied: number;
  description: string;
}

export interface CombatContext {
  nextDamageMultiplier: number;
}
