import { SERVICE_45 } from './attachmentDefinitions';
import type { AmmoRarity, AmmoType, BuildTag, RangeBand } from '../combat/types';

export interface AmmoDefinition {
  id: AmmoType; name: string; shortName: string; role: string; rarity: AmmoRarity;
  tags: readonly BuildTag[]; color: number; cssColor: string; supply?: 'infinite';
  firepower: number; wound: number; actionShock: number; recoil: number; recoilRecovery?: number;
  followUp?: number; healthScale?: { divisor: number; cap: number };
  recoilScale?: { cap: number };
  vulnerableBonus?: number; vulnerableDamagePercentBonus?: number; suppressedBonus?: number;
  execution?: { percent: number; bonus: number }; moveBefore?: number; moveAfter?: number;
}
const ammo = (id: AmmoType, name: string, shortName: string, role: string, tags: readonly BuildTag[], color: number,
  firepower: number, wound = 0, actionShock = 0, recoil = 1, extra: Partial<AmmoDefinition> = {}): AmmoDefinition => ({
  id, name, shortName, role, rarity: 'common', tags, color, cssColor: `#${color.toString(16).padStart(6, '0')}`,
  firepower, wound, actionShock, recoil, ...extra,
});
export const AMMO_DEFINITIONS: Record<AmmoType, AmmoDefinition> = {
  ball: ammo('ball', '볼탄', '볼탄', '기준 체력 피해', ['health'], 0xd8c6a2, 5, 0, 0, 1, { supply: 'infinite' }),
  hollowPoint: ammo('hollowPoint', '할로 포인트', '할로', '현재 체력 10당 피해 +1, 최대 +3', ['health'], 0xff8ca1, 3, 0, 0, 1, { healthScale: { divisor: 10, cap: 3 } }),
  lowRecoil: ammo('lowRecoil', '저반동탄', '저반동', '낮은 피해 · 반동 없음 · 기존 반동 2 회복', ['health'], 0xa3c6ce, 3, 0, 0, 0, { recoilRecovery: 2 }),
  plusP: ammo('plusP', '+P탄', '+P', '높은 피해 · 반동 3', ['health'], 0xe9a065, 8, 0, 0, 3),
  relay: ammo('relay', '릴레이탄', '릴레이', '낮은 피해 · 바로 다음 탄 피해 +4', ['health'], 0xcfb9ee, 2, 0, 0, 1, { followUp: 4 }),
  frangible: ammo('frangible', '파쇄탄', '파쇄', '취약한 적에게 피해 +2', ['health'], 0xf19aad, 4, 0, 0, 1, { vulnerableBonus: 2 }),
  suppression: ammo('suppression', '제압탄', '제압', '충격으로 다음 행동이 중단될 적에게 피해 +3', ['health'], 0x8cb4cc, 3, 0, 0, 1, { suppressedBonus: 3 }),
  execution: ammo('execution', '처형탄', '처형', '체력 30% 이하 적에게 피해 +4', ['health'], 0xe67877, 3, 0, 0, 1, { execution: { percent: 30, bonus: 4 } }),
  kickback: ammo('kickback', '반동 전환탄', '전환', '누적 반동만큼 피해 증가, 반동 전부 소모', ['health'], 0xf6b76d, 2, 0, 0, 0, { recoilScale: { cap: 6 } }),
  laceration: ammo('laceration', '열상탄', '열상', '기본 화력 5 · 취약 대상 체력 피해 +100%', ['health'], 0xe5799a, 5, 0, 0, 1, { vulnerableDamagePercentBonus: 50 }),
  retreat: ammo('retreat', '후퇴탄', '후퇴', '현재 거리에서 사격 후 2m 후퇴', ['health'], 0x9cc8a2, 3, 0, 0, 1, { moveAfter: 2 }),
  advance: ammo('advance', '전진탄', '전진', '2m 전진한 거리에서 강한 사격', ['health'], 0xe49b73, 6, 0, 0, 2, { moveBefore: -2 }),
  wounding: ammo('wounding', '상처탄', '상처', '피해 2 · 상처 +3 · 임계치 도달 시 취약', ['wound'], 0xe48ba9, 2, 3),
  serrated: ammo('serrated', '톱니탄', '톱니', '피해 2 · 상처 +5 · 반동 3', ['wound'], 0xcf6a8d, 2, 5, 0, 3),
  retreatCutter: ammo('retreatCutter', '후퇴 절단탄', '후절', '피해 1 · 상처 +2 · 사격 후 2m 후퇴', ['wound'], 0xa37b9c, 1, 2, 0, 1, { moveAfter: 2 }),
  advanceCutter: ammo('advanceCutter', '전진 절단탄', '전절', '2m 전진한 거리에서 피해 2 · 상처 +4', ['wound'], 0xd4698d, 2, 4, 0, 2, { moveBefore: -2 }),
  flatNose: ammo('flatNose', '평두탄', '평두', '충격 +4', ['impact'], 0x70e6d2, 1, 0, 4),
  heavy: ammo('heavy', '중량탄', '중량', '피해 3 · 충격 +2 · 반동 2', ['impact', 'health'], 0xc895ff, 3, 0, 2, 2),
};
export const AMMO_ORDER = Object.keys(AMMO_DEFINITIONS) as AmmoType[];
export type SpecialAmmoType = Exclude<AmmoType, 'ball'>;
export type AmmoBuild = Record<SpecialAmmoType, number>;
export type AmmoStock = AmmoBuild & { ball: 'infinite' };
export const AMMO_BUILD_BALANCE = {
  specialCapacity: 14, initialAllocations: { wounding: 3, laceration: 3 } as Partial<AmmoBuild>,
  rewardAmount: 1, rewardChoices: 3, rarityWeights: { common: 75, uncommon: 25 },
};
export const createAmmoBuild = (allocations: Partial<AmmoBuild> = AMMO_BUILD_BALANCE.initialAllocations): AmmoBuild =>
  Object.fromEntries(AMMO_ORDER.filter(id => id !== 'ball').map(id => [id, allocations[id as SpecialAmmoType] ?? 0])) as AmmoBuild;
export const createStageStock = (build: AmmoBuild): AmmoStock => ({ ...build, ball: 'infinite' });
export const countAllocations = (build: AmmoBuild): number => Object.values(build).reduce((sum, value) => sum + value, 0);
export const rewardAmount = (ammo: SpecialAmmoType): number => { void ammo; return AMMO_BUILD_BALANCE.rewardAmount; };
export const RARITY_NAMES: Record<AmmoRarity, string> = { common: '일반', uncommon: '고급' };
export const BUILD_TAG_NAMES: Record<BuildTag, string> = { health: '체력', wound: '상처', impact: '충격' };
export const RANGE_NAMES: Record<RangeBand, string> = { near: '근거리', mid: '중거리', far: '원거리' };
export const COMBAT_BALANCE = {
  baseMagazineCapacity: SERVICE_45.baseMagazineCapacity,
  maximumMagazineCapacity: SERVICE_45.maximumMagazineCapacity,
  minimumMagazineCapacity: SERVICE_45.baseMagazineCapacity,
  minimumFirepower: 0, recoilThreshold: 3, maxDistance: 12,
  woundThreshold: 6, vulnerableTurns: 2, vulnerableDamagePercent: 50,
  rangeThresholds: { near: 4, mid: 8 },
} as const;
