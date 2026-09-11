import type { AmmoType } from '../combat/types';
import { AMMO_DEFINITIONS, type AmmoBuild, type SpecialAmmoType } from '../data/ammoDefinitions';

export function ammoRewardOwnedCount(ammo: SpecialAmmoType, build: AmmoBuild, replacements: readonly SpecialAmmoType[] = []): number {
  const pendingReplacements = replacements.filter(value => value === ammo).length;
  return Math.max(0, build[ammo] - pendingReplacements);
}

export function ammoStatsMarkup(ammo: AmmoType): string {
  const item = AMMO_DEFINITIONS[ammo];
  const values: (string | number)[][] = [['화력', item.firepower], ['반동', item.recoil], ['방어 파괴', item.armorBreak], ['충격', item.impact]];
  if (item.rangePenaltyReduction) values.push(['거리 손실', `-${item.rangePenaltyReduction}%p`]);
  return `<span class="ammo-stats">${values.map(([name, value]) => `<span>${name}<b>${value}</b></span>`).join('')}</span>`;
}
