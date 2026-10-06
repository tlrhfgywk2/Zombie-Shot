import { WEAPON_DEFINITIONS } from './weaponDefinitions';
import type { AmmoFamily, AmmoLayer, AmmoRule, MechanicalCategory, PrimaryPayload, AmmoRarity, AmmoType, BuildTag, RangeBand } from '../combat/types';

export interface AmmoDefinition {
  englishName: string;
  family: AmmoFamily;
  /** 기존 권총 특성의 단일 강화 대상. 복합 복사·주효과 증폭 대상은 primaryEffects에 명시한다. */
  primaryPayload: PrimaryPayload;
  primaryEffects: readonly PrimaryPayload[];
  category: MechanicalCategory; layers: readonly AmmoLayer[]; rules: readonly AmmoRule[];
  id: AmmoType; name: string; shortName: string; role: string; rarity: AmmoRarity;
  tags: readonly BuildTag[]; color: number; cssColor: string; supply?: 'infinite';
  firepower: number; wound: number; explosive: number; actionShock: number; recoil: number; recoilRecovery?: number;
  burn: number; burnDamage: number; burnScalePercent?: number; ignitedBonus?: number;
  shockScale?: { divisor: number; cap: number };
  healthScale?: { divisor: number; cap: number };
  recoilScale?: { cap: number };
  vulnerableBonus?: number; vulnerableDamagePercentBonus?: number; suppressedBonus?: number;
  vulnerableTriggerDamage?: number; vulnerableExtraTurns?: number; vulnerableWoundBonus?: number; woundRetention?: number;
  execution?: { percent: number; bonus: number }; moveBefore?: number; moveAfter?: number;
}
export const AMMO_ENGLISH_NAMES: Record<AmmoType, string> = {
  ball: 'Ball Round', hollowPoint: 'Hollow Point', lowRecoil: 'Low-Recoil Round', plusP: '+P Round', relay: 'Relay Round',
  frangible: 'Frangible Round', suppression: 'Suppression Round', execution: 'Execution Round', kickback: 'Kickback Round',
  laceration: 'Laceration Round', retreat: 'Retreat Round', advance: 'Advance Round', mimic: 'Mimic Round',
  explosive: 'Explosive Round', highExplosive: 'High-Explosive Round', stickyCharge: 'Sticky Charge Round',
  incendiary: 'Incendiary Round', highHeat: 'High-Heat Round', lowHeat: 'Low-Heat Round', accelerant: 'Accelerant Round', ignition: 'Ignition Round', kindling: 'Kindling Round',
  wounding: 'Wounding Round', serrated: 'Serrated Round', retreatCutter: 'Retreat Cutter', rupture: 'Rupture Round', deepCut: 'Deep-Cut Round', reopening: 'Reopening Round', scar: 'Scar Round',
  flatNose: 'Flat Nose', heavy: 'Heavy Round', reducedImpact: 'Reduced-Impact Round', hammer: 'Hammer Round', impactRelay: 'Impact Relay Round', resonance: 'Resonance Round',
  alternator: 'Alternator Round', bridge: 'Bridge Round', afterimage: 'Afterimage Round', opening: 'Opening Round', finisher: 'Finisher Round', core: 'Core Round', crosslink: 'Crosslink Round', mosaic: 'Mosaic Round', focus: 'Focus Round', lightLoad: 'Light-Load Round', mirror: 'Mirror Round',
};
export const DRAFT_AMMO = [{ id: 'knockback', name: '넉백탄(?)', englishName: 'Knockback Round', role: '사격 후 표적 후퇴 · 이동량·피해·반동 미정' }] as const;
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
  rupture: { family: 'WOUND', primaryPayload: 'wound' },
  deepCut: { family: 'WOUND', primaryPayload: 'wound' },
  reopening: { family: 'WOUND', primaryPayload: 'wound' },
  scar: { family: 'WOUND', primaryPayload: 'wound' },
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
  mimic: { family: 'HEALTH', primaryPayload: 'firepower' },
  alternator: { family: 'HEALTH', primaryPayload: 'firepower' },
  bridge: { family: 'HEALTH', primaryPayload: 'firepower' },
  afterimage: { family: 'HEALTH', primaryPayload: 'firepower' },
  opening: { family: 'HEALTH', primaryPayload: 'firepower' },
  finisher: { family: 'HEALTH', primaryPayload: 'firepower' },
  core: { family: 'HEALTH', primaryPayload: 'firepower' },
  crosslink: { family: 'HEALTH', primaryPayload: 'firepower' },
  mosaic: { family: 'HEALTH', primaryPayload: 'firepower' },
  focus: { family: 'HEALTH', primaryPayload: 'firepower' },
  lightLoad: { family: 'HEALTH', primaryPayload: 'firepower' },
  mirror: { family: 'HEALTH', primaryPayload: 'firepower' },
};
const ammo = (id: AmmoType, name: string, shortName: string, role: string, tags: readonly BuildTag[], color: number,
  firepower: number, wound = 0, actionShock = 0, recoil = 1, extra: Partial<AmmoDefinition> = {}): AmmoDefinition => ({
  ...AMMO_FAMILIES[id], primaryEffects: [AMMO_FAMILIES[id].primaryPayload],
  category: extra.rules?.some(rule => rule.layer === 'magazine') ? 'layout' : extra.rules?.length ? 'sequence' : 'direct',
  layers: ['enemy', ...new Set(extra.rules?.map(rule => rule.layer) ?? [])], rules: [],
  id, name, englishName: AMMO_ENGLISH_NAMES[id], shortName, role, rarity: 'common', tags, color, cssColor: `#${color.toString(16).padStart(6, '0')}`,
  firepower, wound, explosive: 0, burn: 0, burnDamage: 0, actionShock, recoil, ...extra,
});
export const AMMO_DEFINITIONS: Record<AmmoType, AmmoDefinition> = {
  ball: ammo('ball', '표준탄', '표준탄', '기준 체력 피해', ['health'], 0xd8c6a2, 5, 0, 0, 1, { supply: 'infinite' }),
  hollowPoint: ammo('hollowPoint', '중공탄', '중공탄', '현재 체력 10당 피해 +1, 최대 +3', ['health'], 0xff8ca1, 3, 0, 0, 1, { healthScale: { divisor: 10, cap: 3 } }),
  lowRecoil: ammo('lowRecoil', '저반동탄', '저반동', '낮은 피해 · 반동 없음 · 사격 전 누적 반동 2 회복', ['health'], 0xa3c6ce, 3, 0, 0, 0, { recoilRecovery: 2 }),
  plusP: ammo('plusP', '고압탄', '고압탄', '높은 피해 · 반동 3', ['health'], 0xe9a065, 8, 0, 0, 3),
  relay: ammo('relay', '연계탄', '연계탄', '바로 다음 탄 화력 +4', ['health'], 0xcfb9ee, 2, 0, 0, 0, { rules: [{ layer: 'ammo', condition: { type: 'always' }, action: { type: 'next', target: 'firepower', mode: 'add', amount: 4 } }] }),
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
  rupture: ammo('rupture', '파열탄', '파열탄', '이 탄으로 취약 발동 시 추가 피해 4', ['wound'], 0xd4698d, 2, 3, 0, 1, { vulnerableTriggerDamage: 4 }),
  deepCut: ammo('deepCut', '심부 절개탄', '심부 절개', '이 탄으로 취약 발동 시 지속시간 +1턴', ['wound'], 0xb46a9c, 2, 3, 0, 1, { vulnerableExtraTurns: 1 }),
  reopening: ammo('reopening', '재개방탄', '재개방탄', '사격 시작 시 취약 상태인 표적에게 상처 +3', ['wound'], 0xf198bb, 2, 3, 0, 1, { vulnerableWoundBonus: 3 }),
  scar: ammo('scar', '흉터탄', '흉터탄', '이 탄으로 취약 발동 시 초과분에 더해 상처 최대 2 보존 · 임계치 미만 유지', ['wound'], 0xba8e9e, 2, 3, 0, 1, { woundRetention: 2 }),
  explosive: ammo('explosive', '폭발탄', '폭발탄', '폭발 +2 · 충격 탄약 명중 시 전량 기폭', ['explosive'], 0xffa34d, 3, 0, 0, 1, { explosive: 2 }),
  highExplosive: ammo('highExplosive', '고폭탄', '고폭탄', '폭발 +3 · 높은 화력과 반동 · 충격 탄약으로 기폭', ['explosive'], 0xff713d, 4, 0, 0, 3, { explosive: 3 }),
  stickyCharge: ammo('stickyCharge', '접착폭약탄', '접착폭약탄', '폭발 +4 · 낮은 화력 · 충격 탄약으로 기폭', ['explosive'], 0xffcd63, 1, 0, 0, 2, { explosive: 4 }),
  flatNose: ammo('flatNose', '평두탄', '평두', '충격 +4', ['impact'], 0x70e6d2, 1, 0, 4),
  reducedImpact: ammo('reducedImpact', '저충격탄', '저충격탄', '충격 +2 · 반동 없음', ['impact'], 0xa7d8cf, 1, 0, 2, 0),
  hammer: ammo('hammer', '강타탄', '강타탄', '충격 +6 · 반동 3', ['impact'], 0x49c4b3, 1, 0, 6, 3),
  impactRelay: ammo('impactRelay', '연쇄충격탄', '연쇄충격', '바로 다음 탄 충격 +3 · 충격 없는 탄도 적용', ['impact'], 0x83c5ff, 1, 0, 1, 1, { rules: [{ layer: 'ammo', condition: { type: 'always' }, action: { type: 'next', target: 'actionShock', mode: 'add', amount: 3 } }] }),
  resonance: ammo('resonance', '충격증폭탄', '충격증폭탄', '충격 +2 · 현재 충격 2당 추가 +1, 추가 최대 +4', ['impact'], 0xacb7ff, 1, 0, 2, 1, { shockScale: { divisor: 2, cap: 4 } }),
  heavy: ammo('heavy', '중량탄', '중량', '피해 3 · 충격 +2 · 반동 2', ['impact', 'health'], 0xc895ff, 3, 0, 2, 2, { primaryEffects: ['firepower', 'actionShock'] }),
  incendiary: ammo('incendiary', '소이탄', '소이탄', '일반 화상 피해', ['burn'], 0xff994f, 3, 0, 0, 1, { burn: 8, burnDamage: 2 }),
  highHeat: ammo('highHeat', '고열탄', '고열탄', '고반동 강한 화상 피해', ['burn'], 0xff633e, 2, 0, 0, 3, { rarity: 'uncommon', burn: 12, burnDamage: 3 }),
  lowHeat: ammo('lowHeat', '저열탄', '저열탄', '저반동 약한 화상 피해', ['burn'], 0xffc47d, 2, 0, 0, 0, { burn: 4, burnDamage: 1, recoilRecovery: 1 }),
  accelerant: ammo('accelerant', '연소촉진탄', '연소촉진', '바로 다음 탄 화상 축적 +50% · 소수점 버림', ['burn'], 0xeab85e, 1, 0, 0, 1, { rarity: 'uncommon', burn: 2, burnDamage: 1, rules: [{ layer: 'ammo', condition: { type: 'always' }, action: { type: 'next', target: 'burn', mode: 'percent', amount: 50 } }] }),
  ignition: ammo('ignition', '점화탄', '점화탄', '낮은 피해, 누적 화상이 높을수록 강한 화상 피해', ['burn'], 0xf58857, 1, 0, 0, 1, { rarity: 'uncommon', burn: 2, burnDamage: 1, burnScalePercent: 50 }),
  kindling: ammo('kindling', '발화탄', '발화탄', '점화 상태 추가 피해', ['burn'], 0xffd078, 3, 0, 0, 1, { rarity: 'uncommon', burn: 2, burnDamage: 1, ignitedBonus: 3 }),
  mimic: ammo('mimic', '복사탄', '복사탄', '직전 탄의 계산된 주효과를 100% 복사 · 첫 발은 효과 없음', ['health'], 0xc7b1ee, 0, 0, 0, 1, { rarity: 'uncommon', rules: [{ layer: 'ammo', condition: { type: 'previousExists' }, action: { type: 'copyPrevious', percent: 100 } }] }),
  alternator: ammo('alternator', '교차탄', '교차탄', '직전 탄과 다른 계열이면 화력 +4', ['health'], 0x91bfdc, 2, 0, 0, 1, { rules: [{ layer: 'ammo', condition: { type: 'previousFamily', relation: 'different' }, action: { type: 'self', target: 'primary', mode: 'add', amount: 4 } }] }),
  bridge: ammo('bridge', '매개탄', '매개탄', '직전·다음 탄의 계열이 다르면 다음 탄 주효과 +50% · 소수점 버림', ['health'], 0xadbbd9, 1, 0, 0, 0, { rules: [{ layer: 'ammo', condition: { type: 'bridgeDifferent' }, action: { type: 'next', target: 'primary', mode: 'percent', amount: 50 } }] }),
  afterimage: ammo('afterimage', '잔향탄', '잔향탄', '화력 1 + 직전 탄 주효과 50% 재발동 · 소수점 버림', ['health'], 0xb5a6c9, 1, 0, 0, 0, { rules: [{ layer: 'ammo', condition: { type: 'previousExists' }, action: { type: 'replayPrevious', percent: 50 } }] }),
  opening: ammo('opening', '초탄', '초탄', '첫 장전 칸이면 화력 +3', ['health'], 0xebcf95, 3, 0, 0, 1, { rules: [{ layer: 'magazine', condition: { type: 'first' }, action: { type: 'self', target: 'primary', mode: 'add', amount: 3 } }] }),
  finisher: ammo('finisher', '종결탄', '종결탄', '마지막 장전 칸이면 화력 +4', ['health'], 0xe9ae8e, 3, 0, 0, 1, { rules: [{ layer: 'magazine', condition: { type: 'last' }, action: { type: 'self', target: 'primary', mode: 'add', amount: 4 } }] }),
  core: ammo('core', '중심탄', '중심탄', '첫·마지막 장전 칸이 아니면 화력 +2', ['health'], 0xcec8a5, 4, 0, 0, 1, { rules: [{ layer: 'magazine', condition: { type: 'interior' }, action: { type: 'self', target: 'primary', mode: 'add', amount: 2 } }] }),
  crosslink: ammo('crosslink', '교차배열탄', '교차배열', '양옆 장전 탄의 계열이 다르면 화력 +4', ['health'], 0x8ed2bf, 3, 0, 0, 1, { rules: [{ layer: 'magazine', condition: { type: 'adjacentDifferent' }, action: { type: 'self', target: 'primary', mode: 'add', amount: 4 } }] }),
  mosaic: ammo('mosaic', '혼합탄', '혼합탄', '장전 계열 수 −1만큼 화력 증가 · 최대 +4', ['health'], 0xd0a4d3, 3, 0, 0, 1, { rules: [{ layer: 'magazine', condition: { type: 'familyDiversity' }, scaleBy: 'extraFamilies', action: { type: 'self', target: 'primary', mode: 'add', amount: 1 } }] }),
  focus: ammo('focus', '집중탄', '집중탄', '모든 장전 탄이 같은 계열이면 화력 +4', ['health'], 0xaebee1, 2, 0, 0, 1, { rules: [{ layer: 'magazine', condition: { type: 'monoFamily' }, action: { type: 'self', target: 'primary', mode: 'add', amount: 4 } }] }),
  lightLoad: ammo('lightLoad', '경량장전탄', '경량장전', '빈 칸마다 화력 +2 · 장탄수를 줄일수록 강화', ['health'], 0xb8d3bc, 4, 0, 0, 0, { rules: [{ layer: 'magazine', condition: { type: 'emptySlots' }, scaleBy: 'emptySlots', action: { type: 'self', target: 'primary', mode: 'add', amount: 2 } }] }),
  mirror: ammo('mirror', '대칭탄', '대칭탄', '장전 순서 반대편 탄이 같은 계열이면 화력 +3 · 자기 자신 제외', ['health'], 0xaaceda, 3, 0, 0, 1, { rules: [{ layer: 'magazine', condition: { type: 'symmetricSame' }, action: { type: 'self', target: 'primary', mode: 'add', amount: 3 } }] }),
};
export const AMMO_ORDER = Object.keys(AMMO_DEFINITIONS) as AmmoType[];
export type SpecialAmmoType = Exclude<AmmoType, 'ball'>;
export type AmmoBuild = Record<SpecialAmmoType, number>;
export type AmmoStock = AmmoBuild & { ball: 'infinite' };
export const AMMO_BUILD_BALANCE = {
  specialCapacity: 14, initialAllocations: {} as Partial<AmmoBuild>,
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
