import { DORMANT_AMMO_DEFINITIONS } from './dormantAmmoDefinitions';
import type { AmmoRarity, AmmoType, BuildTag, RangeBand, StatusType } from '../combat/types';

export interface AmmoDefinition {
  id: AmmoType;
  name: string;
  shortName: string;
  role: string;
  rarity: AmmoRarity;
  tags: readonly BuildTag[];
  color: number;
  cssColor: string;
  supply?: 'infinite';
  directDamage: number;
  accuracy: number;
  recoil: number;
  armorBreak: number;
  impact: number;
  buildup?: { type: StatusType; amount: number };
  specialEnemyMultiplier?: number;
  recoverOnKill?: boolean;
}

export const AMMO_DEFINITIONS: Record<AmmoType, AmmoDefinition> = {
  ...DORMANT_AMMO_DEFINITIONS,
  wadcutter: { id: 'wadcutter', name: '와드커터탄', shortName: '와드', role: '정확도와 후속 탄 안정성', rarity: 'common', tags: ['ballistic'], color: 0xa9d9ae, cssColor: '#a9d9ae', directDamage: 16, accuracy: 12, recoil: 1, armorBreak: 0, impact: 0 },
  flatPoint: { id: 'flatPoint', name: '평두탄', shortName: '평두', role: '충격 임계와 다음 탄 노출', rarity: 'common', tags: ['ballistic'], color: 0x70e6d2, cssColor: '#70e6d2', directDamage: 20, accuracy: 0, recoil: 7, armorBreak: 0, impact: 70 },
  overpressure: { id: 'overpressure', name: '고압탄', shortName: '고압', role: '강한 화력 · 후속 탄 반동 주의', rarity: 'uncommon', tags: ['ballistic'], color: 0xe9a065, cssColor: '#e9a065', directDamage: 40, accuracy: -4, recoil: 22, armorBreak: 0, impact: 0 },
  subsonic: { id: 'subsonic', name: '저소음탄', shortName: '저소음', role: '반동 없는 연속 사격', rarity: 'uncommon', tags: ['ballistic'], color: 0xa3c6ce, cssColor: '#a3c6ce', directDamage: 19, accuracy: 3, recoil: 0, armorBreak: 0, impact: 0 },
  bonded: { id: 'bonded', name: '본디드탄', shortName: '본디드', role: '강화된 방어 제거와 화력', rarity: 'uncommon', tags: ['ballistic'], color: 0x7eb5df, cssColor: '#7eb5df', directDamage: 24, accuracy: 1, recoil: 8, armorBreak: 18, impact: 0 },
  match: { id: 'match', name: '매치탄', shortName: '매치', role: '높은 명중 보정과 낮은 반동', rarity: 'uncommon', tags: ['ballistic'], color: 0xcfb9ee, cssColor: '#cfb9ee', directDamage: 22, accuracy: 16, recoil: 3, armorBreak: 0, impact: 0 },
  standard: { id: 'standard', name: '표준탄', shortName: '표준', role: '안정적인 기준 탄약', rarity: 'common', tags: ['ballistic'], color: 0xd8c6a2, cssColor: '#d8c6a2', directDamage: 22, accuracy: 0, recoil: 7, armorBreak: 0, impact: 0, supply: 'infinite' },
  armorPiercing: { id: 'armorPiercing', name: '철갑탄', shortName: '철갑', role: '방어를 먼저 제거하는 준비탄', rarity: 'common', tags: ['ballistic'], color: 0x78b7ff, cssColor: '#78b7ff', directDamage: 18, accuracy: 0, recoil: 7, armorBreak: 12, impact: 0 },
  hollowPoint: { id: 'hollowPoint', name: '확장탄', shortName: '확장', role: '무장갑 표적 고화력', rarity: 'common', tags: ['ballistic'], color: 0xff8ca1, cssColor: '#ff8ca1', directDamage: 30, accuracy: 0, recoil: 9, armorBreak: 0, impact: 0 },
};

// 이 목록만 일반 플레이와 보상에 노출한다. 기존 원소/신화 정의는 실험용으로만 보존한다.
export const AMMO_ORDER: AmmoType[] = ['standard', 'hollowPoint', 'armorPiercing', 'wadcutter', 'flatPoint', 'overpressure', 'subsonic', 'bonded', 'match'];
export type SpecialAmmoType = Exclude<AmmoType, 'standard'>;
export type AmmoBuild = Record<SpecialAmmoType, number>;
export type AmmoStock = AmmoBuild & { standard: 'infinite' };
export const AMMO_BUILD_BALANCE = {
  specialCapacity: 14,
  initialAllocations: { hollowPoint: 3, armorPiercing: 3 } as Partial<AmmoBuild>,
  rewardAmount: 1,
  rewardAmounts: {} as Partial<AmmoBuild>,
  rewardChoices: 3,
  rarityWeights: { common: 75, uncommon: 25 },
};
export const createAmmoBuild = (allocations: Partial<AmmoBuild> = AMMO_BUILD_BALANCE.initialAllocations): AmmoBuild =>
  Object.fromEntries(Object.keys(AMMO_DEFINITIONS).filter(id => id !== 'standard').map(id => [id, allocations[id as SpecialAmmoType] ?? 0])) as AmmoBuild;
export const createStageStock = (build: AmmoBuild): AmmoStock => ({ ...build, standard: 'infinite' });
export const countAllocations = (build: AmmoBuild): number => Object.values(build).reduce((sum, value) => sum + value, 0);
export const rewardAmount = (ammo: SpecialAmmoType): number => AMMO_BUILD_BALANCE.rewardAmounts[ammo] ?? AMMO_BUILD_BALANCE.rewardAmount;

export const RARITY_NAMES: Record<AmmoRarity, string> = { common: '일반', uncommon: '고급', rare: '희귀', mythic: '신화' };
export const BUILD_TAG_NAMES: Record<BuildTag, string> = { ballistic: '탄도', elemental: '원소', sacred: '신성', occult: '오컬트' };
export const RANGE_NAMES: Record<RangeBand, string> = { near: '근거리', mid: '중거리', far: '원거리' };

export const COMBAT_BALANCE = {
  baseMagazineCapacity: 4,
  magazineCapacity: 4,
  minimumMagazineCapacity: 3,
  maximumMagazineCapacity: 5,
  baseAccuracy: 100,
  weaponRecoil: 0,
  minimumRecoil: 0,
  minimumAccuracy: 25,
  exposedDamageMultiplier: 1.4,
  corruptedSpecialMultiplier: 1.25,
  burnDamagePerTurn: 8,
  burnTurnsApplied: 2,
  slowTurnsApplied: 2,
  slowMovementMultiplier: 0.55,
  staggerTurnsApplied: 1,
  staggerMovementMultiplier: 0.3,
  statusThreshold: 100,
  rangeThresholds: { near: 4, mid: 8 },
  handgunRangeMultiplier: { near: 1, mid: 0.9, far: 0.72 } as Record<RangeBand, number>,
} as const;
