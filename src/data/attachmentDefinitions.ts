import type { AttachmentSlot, RangeBand } from '../combat/types';

export type WeaponId = 'service45';
export const SERVICE_45 = {
  id: 'service45' as WeaponId, internalName: 'Service .45', name: '서비스 .45',
  baseFirepower: 0,
  rangePenaltyPercentages: { near: 0, mid: 10, far: 25 } as Record<RangeBand, number>,
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
  | { kind: 'firepower'; value: number; condition?: ModifierCondition }
  | { kind: 'capacity'; value: number }
  | { kind: 'visualKickReductionPercent'; value: number; condition?: ModifierCondition }
  | { kind: 'rangePenaltyReductionPercent'; value: number; condition?: ModifierCondition };
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
    summary: '총기 흔들림 연출 20% 감소', modifiers: [{ kind: 'visualKickReductionPercent', value: 20 }],
  },
  dualPortCompensator: {
    id: 'dualPortCompensator', name: '이중 포트 보정기', slot: 'muzzle', rarity: 'advanced', compatibleWeapons: ['service45'],
    summary: '총기 흔들림 연출 35% 감소',
    modifiers: [{ kind: 'visualKickReductionPercent', value: 35 }],
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
    summary: '중거리 화력 감소 제거', modifiers: [{ kind: 'rangePenaltyReductionPercent', value: 10, condition: { range: 'mid' } }],
  },
  compactReflexSight: {
    id: 'compactReflexSight', name: '소형 반사 조준기', slot: 'optic', rarity: 'advanced', compatibleWeapons: ['service45'],
    summary: '중거리 화력 감소 제거 · 원거리 10%p 완화',
    modifiers: [
      { kind: 'rangePenaltyReductionPercent', value: 10, condition: { range: 'mid' } },
      { kind: 'rangePenaltyReductionPercent', value: 10, condition: { range: 'far' } },
    ],
  },
  compactLaserSight: {
    id: 'compactLaserSight', name: '소형 레이저 조준기', slot: 'rail', rarity: 'common', compatibleWeapons: ['service45'],
    summary: '근거리 총기 흔들림 연출 15% 감소', modifiers: [{ kind: 'visualKickReductionPercent', value: 15, condition: { range: 'near' } }],
  },
  laserLightModule: {
    id: 'laserLightModule', name: '레이저·라이트 모듈', slot: 'rail', rarity: 'advanced', compatibleWeapons: ['service45'],
    summary: '근거리 총기 흔들림 연출 20% 감소 · 가장 가까운 표적 10% 감소',
    modifiers: [
      { kind: 'visualKickReductionPercent', value: 20, condition: { range: 'near' } },
      { kind: 'visualKickReductionPercent', value: 10, condition: { nearestTarget: true } },
    ],
  },
  rubberGrip: {
    id: 'rubberGrip', name: '고무 손잡이', slot: 'grip', rarity: 'common', compatibleWeapons: ['service45'],
    summary: '총기 흔들림 연출 15% 감소', modifiers: [{ kind: 'visualKickReductionPercent', value: 15 }],
  },
  g10Grip: {
    id: 'g10Grip', name: '격자형 G10 손잡이', slot: 'grip', rarity: 'advanced', compatibleWeapons: ['service45'],
    summary: '총기 흔들림 연출 25% 감소', modifiers: [{ kind: 'visualKickReductionPercent', value: 25 }],
  },
};
export const ATTACHMENT_ORDER = Object.keys(ATTACHMENT_DEFINITIONS) as AttachmentId[];
export const isAttachmentCompatible = (id: AttachmentId, weapon: WeaponId, slot = ATTACHMENT_DEFINITIONS[id].slot): boolean => {
  const item = ATTACHMENT_DEFINITIONS[id];
  return item.slot === slot && item.compatibleWeapons.includes(weapon);
};
export type LoadoutSnapshot = Partial<Record<AttachmentSlot, AttachmentId>>;
export const DEFAULT_LOADOUT: LoadoutSnapshot = {};
