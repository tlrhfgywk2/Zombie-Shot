import type { AmmoType } from '../combat/types';

export interface AmmoDefinition {
  id: AmmoType;
  name: string;
  shortName: string;
  role: string;
  color: number;
  cssColor: string;
  directDamage: number;
}

export const AMMO_DEFINITIONS: Record<AmmoType, AmmoDefinition> = {
  standard: { id: 'standard', name: '표준탄', shortName: '표준', role: '조건 없이 22 피해', color: 0xd8c6a2, cssColor: '#d8c6a2', directDamage: 22 },
  armorPiercing: { id: 'armorPiercing', name: '철갑탄', shortName: '철갑', role: '방어력 24 파괴 후 피해', color: 0x78b7ff, cssColor: '#78b7ff', directDamage: 13 },
  hollowPoint: { id: 'hollowPoint', name: '확장탄', shortName: '확장', role: '노출된 적에게 30 피해', color: 0xff8ca1, cssColor: '#ff8ca1', directDamage: 30 },
  incendiary: { id: 'incendiary', name: '소이탄', shortName: '소이', role: '2턴 동안 화상 피해', color: 0xffba3a, cssColor: '#ffba3a', directDamage: 11 },
  stagger: { id: 'stagger', name: '충격탄', shortName: '충격', role: '이동 억제 · 다음 탄 노출', color: 0x70e6d2, cssColor: '#70e6d2', directDamage: 9 },
  magnum: { id: 'magnum', name: '매그넘탄', shortName: '매그넘', role: '희귀한 고화력 31 피해', color: 0xc895ff, cssColor: '#c895ff', directDamage: 31 },
};

export const AMMO_ORDER: AmmoType[] = ['standard', 'armorPiercing', 'hollowPoint', 'incendiary', 'stagger', 'magnum'];

export type AmmoStock = Record<AmmoType, number>;

export const STARTING_AMMO_STOCK: AmmoStock = { standard: 8, armorPiercing: 2, hollowPoint: 2, incendiary: 2, stagger: 2, magnum: 1 };
export const WAVE_AMMO_SUPPLY: AmmoStock = { standard: 5, armorPiercing: 1, hollowPoint: 1, incendiary: 1, stagger: 1, magnum: 0 };

export const COMBAT_BALANCE = {
  magazineCapacity: 4,
  armorPiercingArmorDamage: 24,
  hollowPointArmoredDamage: 12,
  burnDamagePerTurn: 7,
  burnTurnsApplied: 2,
  staggerTurnsApplied: 1,
  staggerMovementMultiplier: 0.35,
  exposedDamageMultiplier: 1.4,
} as const;
