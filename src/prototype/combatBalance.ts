export const WEAPON_HEAT_BALANCE = {
  initial: 0,
  damageMultiplierPerPoint: 0.01,
  turnCoolingRate: 0.5,
};

export function heatDamagePercent(heat: number): number {
  return 100 + heat * (WEAPON_HEAT_BALANCE.damageMultiplierPerPoint * 100);
}

export function heatDamageMultiplier(heat: number): number {
  return heatDamagePercent(heat) / 100;
}
