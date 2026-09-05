import type { AttachmentSlot, RangeBand } from '../combat/types';

export type WeaponId = 'service45';
export const SERVICE_45 = {
  id: 'service45' as WeaponId, internalName: 'Service .45', name: '서비스 .45',
  baseMagazineCapacity: 4, maximumMagazineCapacity: 6,
};
export type AttachmentRarity = 'common' | 'advanced' | 'rare' | 'epic';
export const ATTACHMENT_RARITIES: readonly AttachmentRarity[] = ['common', 'advanced', 'rare', 'epic'];
export const ATTACHMENT_RARITY_NAMES: Record<AttachmentRarity, string> = {
  common: '일반', advanced: '고급', rare: '희귀', epic: '영웅',
};
export const ATTACHMENT_REWARD_WEIGHTS: Record<AttachmentRarity, number> = { common: 70, advanced: 30, rare: 0, epic: 0 };
export type AttachmentId = 'compactCompensator' | 'dualPortCompensator' | 'extendedBasePad' | 'extendedMagazine'
  | 'highVisibilitySight' | 'compactReflexSight' | 'compactLaserSight' | 'laserLightModule' | 'rubberGrip' | 'g10Grip';
export interface ModifierCondition { range?: RangeBand; nearestTarget?: boolean }
export type AttachmentModifier =
  | { kind: 'accuracy'; value: number; condition?: ModifierCondition }
  | { kind: 'capacity'; value: number }
  | { kind: 'ammoPenaltyMultiplier'; value: number }
  | { kind: 'midRangePenaltyMultiplier'; value: number };
export interface AttachmentDefinition {
  id: AttachmentId;
  name: string;
  slot: AttachmentSlot;
  rarity: AttachmentRarity;
  compatibleWeapons: readonly WeaponId[];
  summary: string;
  modifiers: readonly AttachmentModifier[];
}
export const ATTACHMENT_SLOT_ORDER: readonly AttachmentSlot[] = ['muzzle', 'magazine', 'optic', 'rail', 'grip'];
export const ATTACHMENT_SLOT_NAMES: Record<AttachmentSlot, string> = {
  muzzle: '총구', magazine: '탄창', optic: '조준 장치', rail: '전술 레일', grip: '손잡이',
};
export const ATTACHMENT_DEFINITIONS: Record<AttachmentId, AttachmentDefinition> = {
  compactCompensator: {
    id: 'compactCompensator', name: '소형 보정기', slot: 'muzzle', rarity: 'common', compatibleWeapons: ['service45'],
    summary: '정확도 +5%p', modifiers: [{ kind: 'accuracy', value: 5 }],
  },
  dualPortCompensator: {
    id: 'dualPortCompensator', name: '이중 포트 보정기', slot: 'muzzle', rarity: 'advanced', compatibleWeapons: ['service45'],
    summary: '정확도 +5%p · 탄약 정확도 페널티 ×0.70',
    modifiers: [{ kind: 'accuracy', value: 5 }, { kind: 'ammoPenaltyMultiplier', value: 0.7 }],
  },
  extendedBasePad: {
    id: 'extendedBasePad', name: '확장 바닥판', slot: 'magazine', rarity: 'common', compatibleWeapons: ['service45'],
    summary: '탄창 용량 +1 (4 → 5발) · 탄약 휴대 용량은 그대로', modifiers: [{ kind: 'capacity', value: 1 }],
  },
  extendedMagazine: {
    id: 'extendedMagazine', name: '확장 탄창', slot: 'magazine', rarity: 'advanced', compatibleWeapons: ['service45'],
    summary: '탄창 용량 +2 (4 → 6발) · 탄약 휴대 용량은 그대로', modifiers: [{ kind: 'capacity', value: 2 }],
  },
  highVisibilitySight: {
    id: 'highVisibilitySight', name: '고시인성 가늠쇠', slot: 'optic', rarity: 'common', compatibleWeapons: ['service45'],
    summary: '정확도 +5%p', modifiers: [{ kind: 'accuracy', value: 5 }],
  },
  compactReflexSight: {
    id: 'compactReflexSight', name: '소형 반사 조준기', slot: 'optic', rarity: 'advanced', compatibleWeapons: ['service45'],
    summary: '정확도 +5%p · 중거리 피해 효율 손실 ×0.50',
    modifiers: [{ kind: 'accuracy', value: 5 }, { kind: 'midRangePenaltyMultiplier', value: 0.5 }],
  },
  compactLaserSight: {
    id: 'compactLaserSight', name: '소형 레이저 조준기', slot: 'rail', rarity: 'common', compatibleWeapons: ['service45'],
    summary: '근거리 정확도 +10%p', modifiers: [{ kind: 'accuracy', value: 10, condition: { range: 'near' } }],
  },
  laserLightModule: {
    id: 'laserLightModule', name: '레이저·라이트 모듈', slot: 'rail', rarity: 'advanced', compatibleWeapons: ['service45'],
    summary: '근거리 정확도 +10%p · 가장 가까운 유효 표적에 +5%p',
    modifiers: [{ kind: 'accuracy', value: 10, condition: { range: 'near' } }, { kind: 'accuracy', value: 5, condition: { nearestTarget: true } }],
  },
  rubberGrip: {
    id: 'rubberGrip', name: '고무 손잡이', slot: 'grip', rarity: 'common', compatibleWeapons: ['service45'],
    summary: '정확도 +5%p', modifiers: [{ kind: 'accuracy', value: 5 }],
  },
  g10Grip: {
    id: 'g10Grip', name: '격자형 G10 손잡이', slot: 'grip', rarity: 'advanced', compatibleWeapons: ['service45'],
    summary: '탄약 정확도 페널티 ×0.80', modifiers: [{ kind: 'ammoPenaltyMultiplier', value: 0.8 }],
  },
};
export const ATTACHMENT_ORDER = Object.keys(ATTACHMENT_DEFINITIONS) as AttachmentId[];
export const isAttachmentCompatible = (id: AttachmentId, weapon: WeaponId, slot = ATTACHMENT_DEFINITIONS[id].slot): boolean => {
  const item = ATTACHMENT_DEFINITIONS[id];
  return item.slot === slot && item.compatibleWeapons.includes(weapon);
};
export type LoadoutSnapshot = Partial<Record<AttachmentSlot, AttachmentId>>;
export const DEFAULT_LOADOUT: LoadoutSnapshot = {};
