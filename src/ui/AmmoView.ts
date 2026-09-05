import type { AmmoType } from '../combat/types';
import { AMMO_DEFINITIONS } from '../data/ammoDefinitions';

export function ammoStatsMarkup(ammo: AmmoType): string {
  const item = AMMO_DEFINITIONS[ammo];
  const values = [['화력', item.directDamage], ['명중 보정', `${item.accuracy >= 0 ? '+' : ''}${item.accuracy}%`], ['반동', item.recoil], ['방어 파괴', item.armorBreak], ['충격', item.impact]];
  return `<span class="ammo-stats">${values.map(([name, value]) => `<span>${name}<b>${value}</b></span>`).join('')}</span>`;
}
