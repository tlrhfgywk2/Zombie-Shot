import type { AmmoType } from '../combat/types';
import { AMMO_DEFINITIONS, type AmmoBuild, type SpecialAmmoType } from '../data/ammoDefinitions';

export function ammoRewardOwnedCount(ammo: SpecialAmmoType, build: AmmoBuild, replacements: readonly SpecialAmmoType[] = []): number {
  const pendingReplacements = replacements.filter(value => value === ammo).length;
  return Math.max(0, build[ammo] - pendingReplacements);
}

export function ammoStatsMarkup(ammo: AmmoType): string {
  const item = AMMO_DEFINITIONS[ammo];
  const values: (string | number)[][] = [['화력', item.firepower], ['방어 파괴', item.armorBreak], ['충격', item.actionShock]];
  if (item.rangePenaltyReduction) values.push(['거리 손실', `-${item.rangePenaltyReduction}%p`]);
  if (item.sequenceTrait) values.push(['특성', { heavyKick: '강한 반동', stable: '안정', shockSaturation: '충격 포화' }[item.sequenceTrait]]);
  if (item.unarmoredFirepowerModifier) values.push(['무장갑', `${item.unarmoredFirepowerModifier > 0 ? '+' : ''}${item.unarmoredFirepowerModifier}`]);
  return `<span class="ammo-stats">${values.map(([name, value]) => `<span>${name}<b>${value}</b></span>`).join('')}</span>`;
}
