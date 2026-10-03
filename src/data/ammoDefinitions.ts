import { WEAPON_DEFINITIONS } from './weaponDefinitions';
import type { AmmoFamily, PrimaryPayload, AmmoRarity, AmmoType, BuildTag, RangeBand } from '../combat/types';

export interface AmmoDefinition {
  family: AmmoFamily; primaryPayload: PrimaryPayload;
  id: AmmoType; name: string; shortName: string; role: string; rarity: AmmoRarity;
  tags: readonly BuildTag[]; color: number; cssColor: string; supply?: 'infinite';
  firepower: number; wound: number; explosive: number; actionShock: number; recoil: number; recoilRecovery?: number;
  burn: number; burnDamage: number; burnFollowUpPercent?: number; burnScalePercent?: number; ignitedBonus?: number;
  shockFollowUp?: number; shockScale?: { divisor: number; cap: number };
  followUp?: number; healthScale?: { divisor: number; cap: number };
  recoilScale?: { cap: number };
  vulnerableBonus?: number; vulnerableDamagePercentBonus?: number; suppressedBonus?: number;
  execution?: { percent: number; bonus: number }; moveBefore?: number; moveAfter?: number;
}
export const AMMO_FAMILIES: Record<AmmoType, { family: AmmoFamily; primaryPayload: PrimaryPayload }> = {
  ball: { family: 'HEALTH', primaryPayload: 'firepower' },
  hollowPoint: { family: 'HEALTH', primaryPayload: 'firepower' },
  lowRecoil: { family: 'HEALTH', primaryPayload: 'firepower' },
  plusP: { family: 'HEALTH', primaryPayload: 'firepower' },
  relay: { family: 'HEALTH', primaryPayload: 'firepower' },
  frangible: { family: 'HEALTH', primaryPayload: 'firepower' },
  suppression: { family: 'HEALTH', primaryPayload: 'firepower' },
  execution: { family: 'HEALTH', primaryPayload: 'firepower' },
  kickback: { family: 'HEALTH', primaryPayload: 'firepower' },
  laceration: { family: 'HEALTH', primaryPayload: 'firepower' },
  retreat: { family: 'HEALTH', primaryPayload: 'firepower' },
  advance: { family: 'HEALTH', primaryPayload: 'firepower' },
  wounding: { family: 'WOUND', primaryPayload: 'wound' },
  serrated: { family: 'WOUND', primaryPayload: 'wound' },
  retreatCutter: { family: 'WOUND', primaryPayload: 'wound' },
  advanceCutter: { family: 'WOUND', primaryPayload: 'wound' },
  explosive: { family: 'EXPLOSION', primaryPayload: 'explosive' },
  highExplosive: { family: 'EXPLOSION', primaryPayload: 'explosive' },
  stickyCharge: { family: 'EXPLOSION', primaryPayload: 'explosive' },
  flatNose: { family: 'IMPACT', primaryPayload: 'actionShock' },
  reducedImpact: { family: 'IMPACT', primaryPayload: 'actionShock' },
  hammer: { family: 'IMPACT', primaryPayload: 'actionShock' },
  impactRelay: { family: 'IMPACT', primaryPayload: 'actionShock' },
  resonance: { family: 'IMPACT', primaryPayload: 'actionShock' },
  heavy: { family: 'IMPACT', primaryPayload: 'actionShock' },
  incendiary: { family: 'BURN', primaryPayload: 'burn' },
  highHeat: { family: 'BURN', primaryPayload: 'burn' },
  lowHeat: { family: 'BURN', primaryPayload: 'burn' },
  accelerant: { family: 'BURN', primaryPayload: 'burn' },
  ignition: { family: 'BURN', primaryPayload: 'burn' },
  kindling: { family: 'BURN', primaryPayload: 'firepower' },
};
const ammo = (id: AmmoType, name: string, shortName: string, role: string, tags: readonly BuildTag[], color: number,
  firepower: number, wound = 0, actionShock = 0, recoil = 1, extra: Partial<AmmoDefinition> = {}): AmmoDefinition => ({
  ...AMMO_FAMILIES[id], id, name, shortName, role, rarity: 'common', tags, color, cssColor: `#${color.toString(16).padStart(6, '0')}`,
  firepower, wound, explosive: 0, burn: 0, burnDamage: 0, actionShock, recoil, ...extra,
});
export const AMMO_DEFINITIONS: Record<AmmoType, AmmoDefinition> = {
  ball: ammo('ball', '표준탄', '표준탄', '기준 체력 피해', ['health'], 0xd8c6a2, 5, 0, 0, 1, { supply: 'infinite' }),
  hollowPoint: ammo('hollowPoint', '중공탄', '중공탄', '현재 체력 10당 피해 +1, 최대 +3', ['health'], 0xff8ca1, 3, 0, 0, 1, { healthScale: { divisor: 10, cap: 3 } }),
  lowRecoil: ammo('lowRecoil', '저반동탄', '저반동', '낮은 피해 · 반동 없음 · 사격 후 누적 반동 2 회복', ['health'], 0xa3c6ce, 3, 0, 0, 0, { recoilRecovery: 2 }),
  plusP: ammo('plusP', '고압탄', '고압탄', '높은 피해 · 반동 3', ['health'], 0xe9a065, 8, 0, 0, 3),
  relay: ammo('relay', '연계탄', '연계탄', '낮은 피해 · 바로 다음 탄 피해 +4', ['health'], 0xcfb9ee, 2, 0, 0, 1, { followUp: 4 }),
  frangible: ammo('frangible', '파쇄탄', '파쇄', '취약한 적에게 피해 +2', ['health'], 0xf19aad, 4, 0, 0, 1, { vulnerableBonus: 2 }),
  suppression: ammo('suppression', '제압탄', '제압', '충격으로 다음 행동이 중단될 적에게 피해 +3', ['health'], 0x8cb4cc, 3, 0, 0, 1, { suppressedBonus: 3 }),
  execution: ammo('execution', '처형탄', '처형', '체력 30% 이하 적에게 피해 +4', ['health'], 0xe67877, 3, 0, 0, 1, { execution: { percent: 30, bonus: 4 } }),
  kickback: ammo('kickback', '반동탄', '반동탄', '누적 반동만큼 피해 증가, 반동 전부 소모', ['health'], 0xf6b76d, 2, 0, 0, 0, { recoilScale: { cap: 6 } }),
  laceration: ammo('laceration', '열상탄', '열상', '기본 화력 5 · 취약 대상 체력 피해 +100%', ['health'], 0xe5799a, 5, 0, 0, 1, { vulnerableDamagePercentBonus: 50 }),
  retreat: ammo('retreat', '후퇴탄', '후퇴', '현재 거리에서 사격 후 2m 후퇴', ['health'], 0x9cc8a2, 3, 0, 0, 1, { moveAfter: 2 }),
  advance: ammo('advance', '돌진탄', '돌진탄', '2m 전진한 거리에서 강한 사격', ['health'], 0xe49b73, 6, 0, 0, 2, { moveBefore: -2 }),
  wounding: ammo('wounding', '절개탄', '절개탄', '피해 2 · 상처 +3 · 임계치 도달 시 취약', ['wound'], 0xe48ba9, 2, 3),
  serrated: ammo('serrated', '톱니탄', '톱니', '피해 2 · 상처 +5 · 반동 3', ['wound'], 0xcf6a8d, 2, 5, 0, 3),
  retreatCutter: ammo('retreatCutter', '후퇴 절개탄', '후퇴 절개', '피해 1 · 상처 +2 · 사격 후 2m 후퇴', ['wound'], 0xa37b9c, 1, 2, 0, 1, { moveAfter: 2 }),
  advanceCutter: ammo('advanceCutter', '돌진 절개탄', '돌진 절개', '2m 전진한 거리에서 피해 2 · 상처 +4', ['wound'], 0xd4698d, 2, 4, 0, 2, { moveBefore: -2 }),
  explosive: ammo('explosive', '폭발탄', '폭발탄', '폭발 +2 · 충격 탄약 명중 시 전량 기폭', ['explosive'], 0xffa34d, 3, 0, 0, 1, { explosive: 2 }),
  highExplosive: ammo('highExplosive', '고폭탄', '고폭탄', '폭발 +3 · 높은 화력과 반동 · 충격 탄약으로 기폭', ['explosive'], 0xff713d, 4, 0, 0, 3, { explosive: 3 }),
  stickyCharge: ammo('stickyCharge', '접착폭약탄', '접착폭약탄', '폭발 +4 · 낮은 화력 · 충격 탄약으로 기폭', ['explosive'], 0xffcd63, 1, 0, 0, 2, { explosive: 4 }),
  flatNose: ammo('flatNose', '평두탄', '평두', '충격 +4', ['impact'], 0x70e6d2, 1, 0, 4),
  reducedImpact: ammo('reducedImpact', '저충격탄', '저충격탄', '충격 +2 · 반동 없음', ['impact'], 0xa7d8cf, 1, 0, 2, 0),
  hammer: ammo('hammer', '강타탄', '강타탄', '충격 +6 · 반동 3', ['impact'], 0x49c4b3, 1, 0, 6, 3),
  impactRelay: ammo('impactRelay', '연쇄충격탄', '연쇄충격탄', '충격 +1 · 바로 다음 탄 충격 +3 (일반탄도 적용)', ['impact'], 0x83c5ff, 1, 0, 1, 1, { shockFollowUp: 3 }),
  resonance: ammo('resonance', '충격증폭탄', '충격증폭탄', '충격 +2 · 현재 충격 2당 추가 +1, 추가 최대 +4', ['impact'], 0xacb7ff, 1, 0, 2, 1, { shockScale: { divisor: 2, cap: 4 } }),
  heavy: ammo('heavy', '중량탄', '중량', '피해 3 · 충격 +2 · 반동 2', ['impact', 'health'], 0xc895ff, 3, 0, 2, 2),
  incendiary: ammo('incendiary', '소이탄', '소이탄', '일반 화상 피해', ['burn'], 0xff994f, 3, 0, 0, 1, { burn: 8, burnDamage: 2 }),
  highHeat: ammo('highHeat', '고열탄', '고열탄', '고반동 강한 화상 피해', ['burn'], 0xff633e, 2, 0, 0, 3, { rarity: 'uncommon', burn: 12, burnDamage: 3 }),
  lowHeat: ammo('lowHeat', '저열탄', '저열탄', '저반동 약한 화상 피해', ['burn'], 0xffc47d, 2, 0, 0, 0, { burn: 4, burnDamage: 1, recoilRecovery: 1 }),
  accelerant: ammo('accelerant', '연소촉진탄', '연소촉진탄', '낮은 피해, 후속탄 화상 증가', ['burn'], 0xeab85e, 1, 0, 0, 1, { rarity: 'uncommon', burn: 2, burnDamage: 1, burnFollowUpPercent: 50 }),
  ignition: ammo('ignition', '점화탄', '점화탄', '낮은 피해, 누적 화상이 높을수록 강한 화상 피해', ['burn'], 0xf58857, 1, 0, 0, 1, { rarity: 'uncommon', burn: 2, burnDamage: 1, burnScalePercent: 50 }),
  kindling: ammo('kindling', '발화탄', '발화탄', '점화 상태 추가 피해', ['burn'], 0xffd078, 3, 0, 0, 1, { rarity: 'uncommon', burn: 2, burnDamage: 1, ignitedBonus: 3 }),
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
export const BUILD_TAG_NAMES: Record<BuildTag, string> = { health: '체력', wound: '상처', explosive: '폭발', impact: '충격', burn: '화상' };
export const RANGE_NAMES: Record<RangeBand, string> = { near: '근거리', mid: '중거리', far: '원거리' };
export const COMBAT_BALANCE = {
  baseMagazineCapacity: WEAPON_DEFINITIONS.p220.baseMagazineCapacity,
  maximumMagazineCapacity: WEAPON_DEFINITIONS.p220.maximumMagazineCapacity,
  minimumFirepower: 0, recoilThreshold: WEAPON_DEFINITIONS.p220.recoilThreshold, maxDistance: 12,
  explosionDamagePerStack: 2,
  woundThreshold: 6, vulnerableTurns: 2, vulnerableDamagePercent: 50,
  burnThreshold: 20, ignitedActions: 1,
  rangeThresholds: { near: 4, mid: 8 },
} as const;
