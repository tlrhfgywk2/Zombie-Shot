import { AMMO_DEFINITIONS, type AmmoBuild, type SpecialAmmoType } from '../data/ammoDefinitions';
import type { AmmoType, RoundPreview } from '../combat/types';

export function ammoRewardOwnedCount(ammo: SpecialAmmoType, build: AmmoBuild, replacements: readonly SpecialAmmoType[] = []): number {
  return Math.max(0, build[ammo] - replacements.filter(value => value === ammo).length);
}
export function ammoStatsMarkup(ammo: AmmoType): string {
  const item = AMMO_DEFINITIONS[ammo];
  const values: [string, number][] = [['화력', item.firepower], ['상처', item.wound], ['충격', item.actionShock], ['반동', item.recoil]];
  return `<span class="ammo-stats">${values.filter(([, value]) => value > 0).map(([name, value]) => `<span>${name}<b>${value}</b></span>`).join('')}</span>`;
}
export interface FiringOrderStatEntry {
  kind: 'firepower' | 'wound' | 'shock' | 'recoil'; label: string; value: number; modified: boolean;
}
export function firingOrderStatEntries(round: RoundPreview): FiringOrderStatEntry[] {
  const entries: FiringOrderStatEntry[] = [
    { kind: 'firepower', label: '화력', value: round.effectiveFirepower, modified: round.followUpBonus > 0 },
    { kind: 'wound', label: '상처', value: round.wound, modified: false },
    { kind: 'shock', label: '충격', value: round.effectiveActionShock, modified: false },
    { kind: 'recoil', label: '누적 반동', value: round.recoil, modified: false },
  ];
  return entries.filter(row => row.value > 0);
}
