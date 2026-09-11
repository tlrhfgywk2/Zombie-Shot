import type { AmmoType, ShotResult } from '../combat/types';
import { AMMO_DEFINITIONS, type AmmoBuild, type SpecialAmmoType } from '../data/ammoDefinitions';

export function ammoRewardOwnedCount(ammo: SpecialAmmoType, build: AmmoBuild, replacements: readonly SpecialAmmoType[] = []): number {
  const pendingReplacements = replacements.filter(value => value === ammo).length;
  return Math.max(0, build[ammo] - pendingReplacements);
}

export function ammoStatsMarkup(ammo: AmmoType): string {
  const item = AMMO_DEFINITIONS[ammo];
  const values: (string | number)[][] = [['화력', item.firepower], ['방어 파괴', item.armorBreak], ['충격', item.actionShock]];
  if (ammo === 'match') values.push(['거리 화력 감소', '-3%p']);
  if (item.sequenceTrait) values.push(['특성', { heavyKick: '강한 반동', stable: '안정', shockSaturation: '충격 포화' }[item.sequenceTrait]]);
  if (item.unarmoredFirepowerModifier) values.push(['무장갑', `${item.unarmoredFirepowerModifier > 0 ? '+' : ''}${item.unarmoredFirepowerModifier}`]);
  return `<span class="ammo-stats">${values.map(([name, value]) => `<span>${name}<b>${value}</b></span>`).join('')}</span>`;
}

export interface FiringOrderStatEntry {
  kind: 'firepower' | 'armor' | 'shock';
  label: string;
  value: number;
  modified: boolean;
}

export function firingOrderStatEntries(shot: ShotResult): FiringOrderStatEntry[] {
  const detail = shot.breakdown;
  const entries: FiringOrderStatEntry[] = [
    { kind: 'firepower', label: '화력', value: detail.effectiveFirepower, modified: detail.heavyKickPenalty > 0 },
    { kind: 'armor', label: '방어 파괴', value: detail.armorBroken, modified: false },
    { kind: 'shock', label: '충격', value: shot.actionShockApplied, modified: detail.shockSaturationPenalty > 0 },
  ];
  return entries.filter((stat) => stat.value > 0);
}
