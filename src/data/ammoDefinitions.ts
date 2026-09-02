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
  directDamage: number;
  armoredDirectDamage?: number;
  accuracy: number;
  recoil: number;
  penetration: number;
  armorShred: number;
  impact: number;
  buildup?: { type: StatusType; amount: number };
  specialEnemyMultiplier?: number;
  recoverOnKill?: boolean;
}

export const AMMO_DEFINITIONS: Record<AmmoType, AmmoDefinition> = {
  standard: { id: 'standard', name: '표준탄', shortName: '표준', role: '안정적인 기준 탄약', rarity: 'common', tags: ['ballistic'], color: 0xd8c6a2, cssColor: '#d8c6a2', directDamage: 22, accuracy: 0, recoil: 0, penetration: 0, armorShred: 0, impact: 12 },
  armorPiercing: { id: 'armorPiercing', name: '관통탄', shortName: '관통', role: '장갑 파괴와 관통', rarity: 'uncommon', tags: ['ballistic'], color: 0x78b7ff, cssColor: '#78b7ff', directDamage: 15, accuracy: -3, recoil: 1, penetration: 12, armorShred: 30, impact: 16 },
  hollowPoint: { id: 'hollowPoint', name: '확장탄', shortName: '확장', role: '무장갑 표적 고피해', rarity: 'uncommon', tags: ['ballistic'], color: 0xff8ca1, cssColor: '#ff8ca1', directDamage: 30, armoredDirectDamage: 13, accuracy: 2, recoil: 1, penetration: 0, armorShred: 0, impact: 18 },
  incendiary: { id: 'incendiary', name: '열화탄', shortName: '열화', role: '열기 축적 후 화상', rarity: 'rare', tags: ['elemental'], color: 0xffba3a, cssColor: '#ffba3a', directDamage: 12, accuracy: 0, recoil: 0, penetration: 2, armorShred: 0, impact: 8, buildup: { type: 'burn', amount: 60 } },
  stagger: { id: 'stagger', name: '압력탄', shortName: '압력', role: '충격 축적과 이동 차단', rarity: 'uncommon', tags: ['ballistic'], color: 0x70e6d2, cssColor: '#70e6d2', directDamage: 10, accuracy: -2, recoil: 3, penetration: 3, armorShred: 0, impact: 66 },
  magnum: { id: 'magnum', name: '중량탄', shortName: '중량', role: '강한 피해와 충격, 큰 반동', rarity: 'rare', tags: ['ballistic'], color: 0xc895ff, cssColor: '#c895ff', directDamage: 34, accuracy: -5, recoil: 7, penetration: 5, armorShred: 0, impact: 38 },
  cryo: { id: 'cryo', name: '빙결탄', shortName: '빙결', role: '냉기 축적 후 접근 둔화', rarity: 'rare', tags: ['elemental'], color: 0x80e8ff, cssColor: '#80e8ff', directDamage: 11, accuracy: 4, recoil: 0, penetration: 1, armorShred: 0, impact: 10, buildup: { type: 'chill', amount: 60 } },
  arc: { id: 'arc', name: '전도탄', shortName: '전도', role: '전하 축적 후 특수 의도 지연', rarity: 'rare', tags: ['elemental'], color: 0x9fa8ff, cssColor: '#9fa8ff', directDamage: 13, accuracy: -1, recoil: 1, penetration: 4, armorShred: 0, impact: 8, buildup: { type: 'shock', amount: 60 } },
  sanctified: { id: 'sanctified', name: '새벽서약탄', shortName: '서약', role: '특수 감염체 심판', rarity: 'mythic', tags: ['sacred'], color: 0xfff2a8, cssColor: '#fff2a8', directDamage: 25, accuracy: 8, recoil: 2, penetration: 8, armorShred: 0, impact: 20, specialEnemyMultiplier: 1.35 },
  bloodHex: { id: 'bloodHex', name: '핏빛각인탄', shortName: '각인', role: '침식 축적 · 처치 시 회수', rarity: 'mythic', tags: ['occult'], color: 0xff5d83, cssColor: '#ff5d83', directDamage: 9, accuracy: 5, recoil: 0, penetration: 3, armorShred: 0, impact: 8, buildup: { type: 'corruption', amount: 60 }, recoverOnKill: true },
};

export const AMMO_ORDER: AmmoType[] = ['standard', 'armorPiercing', 'hollowPoint', 'stagger', 'incendiary', 'cryo', 'arc', 'magnum', 'sanctified', 'bloodHex'];
export type AmmoStock = Record<AmmoType, number>;

export const STARTING_AMMO_STOCK: AmmoStock = { standard: 10, armorPiercing: 3, hollowPoint: 3, incendiary: 2, stagger: 3, magnum: 1, cryo: 2, arc: 2, sanctified: 1, bloodHex: 1 };
export const NORMAL_AMMO_SUPPLY: AmmoStock = { standard: 6, armorPiercing: 1, hollowPoint: 1, incendiary: 1, stagger: 1, magnum: 0, cryo: 0, arc: 0, sanctified: 0, bloodHex: 0 };
export const SPECIAL_AMMO_SUPPLY: AmmoStock = { standard: 4, armorPiercing: 1, hollowPoint: 1, incendiary: 1, stagger: 1, magnum: 1, cryo: 1, arc: 1, sanctified: 1, bloodHex: 1 };
export const WAVE_AMMO_SUPPLY = NORMAL_AMMO_SUPPLY;

export const RARITY_NAMES: Record<AmmoRarity, string> = { common: '일반', uncommon: '고급', rare: '희귀', mythic: '신화' };
export const BUILD_TAG_NAMES: Record<BuildTag, string> = { ballistic: '탄도', elemental: '원소', sacred: '신성', occult: '오컬트' };
export const RANGE_NAMES: Record<RangeBand, string> = { near: '근거리', mid: '중거리', far: '원거리' };

export const COMBAT_BALANCE = {
  baseMagazineCapacity: 4,
  magazineCapacity: 4,
  minimumMagazineCapacity: 3,
  maximumMagazineCapacity: 5,
  baseAccuracy: 100,
  recoilPerShot: 7,
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
