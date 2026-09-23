import type { AttachmentSlot, RangeBand } from '../combat/types';

export type WeaponId = 'service45';
export const SERVICE_45 = {
  id: 'service45' as WeaponId, internalName: 'Service .45', name: '서비스 .45',
  baseFirepower: 0, rangePenaltyPercentages: { near: 0, mid: 10, far: 25 } as Record<RangeBand, number>,
  baseMagazineCapacity: 4, maximumMagazineCapacity: 6,
};
export type AttachmentRarity = 'common' | 'advanced' | 'rare' | 'epic';
export const ATTACHMENT_RARITIES: readonly AttachmentRarity[] = ['common', 'advanced', 'rare', 'epic'];
export const ATTACHMENT_RARITY_NAMES: Record<AttachmentRarity, string> = {
  common: '일반', advanced: '고급', rare: '희귀', epic: '영웅',
};
export const ATTACHMENT_REWARD_WEIGHTS: Record<AttachmentRarity, number> = { common: 65, advanced: 35, rare: 0, epic: 0 };
export type AttachmentId = 'extendedBarrel' | 'compensator' | 'muzzleBrake' | 'extendedMagazine'
  | 'reflexSight' | 'pistolScope' | 'laserSight' | 'tacticalLight' | 'laserLightModule'
  | 'texturedGrip' | 'ergonomicGrip';
export interface ModifierCondition { range?: RangeBand }
export type AttachmentModifier =
  | { kind: 'capacity' | 'recoilThreshold' | 'recoilReduction' | 'highRecoilReduction'
      | 'vulnerableEffect' | 'followUpEffect' | 'impact'; value: number; condition?: ModifierCondition }
  | { kind: 'rangePenaltyReductionPercent'; value: number; condition?: ModifierCondition };
export interface AttachmentDefinition {
  id: AttachmentId; name: string; slot: AttachmentSlot; rarity: AttachmentRarity;
  compatibleWeapons: readonly WeaponId[]; summary: string; modifiers: readonly AttachmentModifier[];
}
const item = (id: AttachmentId, name: string, slot: AttachmentSlot, rarity: AttachmentRarity,
  summary: string, modifiers: readonly AttachmentModifier[]): AttachmentDefinition =>
  ({ id, name, slot, rarity, compatibleWeapons: ['service45'], summary, modifiers });
export const ATTACHMENT_SLOT_ORDER: readonly AttachmentSlot[] = ['barrel', 'muzzle', 'magazine', 'optic', 'rail', 'grip'];
export const ATTACHMENT_SLOT_NAMES: Record<AttachmentSlot, string> = {
  barrel: '총열', muzzle: '총구', magazine: '탄창', optic: '조준 장치', rail: '전술 레일', grip: '손잡이',
};
export const ATTACHMENT_DEFINITIONS: Record<AttachmentId, AttachmentDefinition> = {
  extendedBarrel: item('extendedBarrel', '연장 총열', 'barrel', 'advanced', '원거리 화력 감소 10%p 완화',
    [{ kind: 'rangePenaltyReductionPercent', value: 10, condition: { range: 'far' } }]),
  compensator: item('compensator', '보정기', 'muzzle', 'common', '반동 허용치 +2',
    [{ kind: 'recoilThreshold', value: 2 }]),
  muzzleBrake: item('muzzleBrake', '총구 제퇴기', 'muzzle', 'advanced', '원래 반동 3 이상인 탄의 반동 -1',
    [{ kind: 'highRecoilReduction', value: 1 }]),
  extendedMagazine: item('extendedMagazine', '확장 탄창', 'magazine', 'advanced', '탄창 +2발 · 휴대 탄약 그대로',
    [{ kind: 'capacity', value: 2 }]),
  reflexSight: item('reflexSight', '반사 조준기', 'optic', 'common', '중거리 화력 감소 제거',
    [{ kind: 'rangePenaltyReductionPercent', value: 10, condition: { range: 'mid' } }]),
  pistolScope: item('pistolScope', '저배율 권총 조준경', 'optic', 'advanced', '근거리 화력 -10% · 중거리 감소 제거 · 원거리 감소 10%p 완화',
    [{ kind: 'rangePenaltyReductionPercent', value: -10, condition: { range: 'near' } },
      { kind: 'rangePenaltyReductionPercent', value: 10, condition: { range: 'mid' } },
      { kind: 'rangePenaltyReductionPercent', value: 10, condition: { range: 'far' } }]),
  laserSight: item('laserSight', '레이저 조준기', 'rail', 'common', '취약 대상 추가 효과 +2',
    [{ kind: 'vulnerableEffect', value: 2 }]),
  tacticalLight: item('tacticalLight', '전술 조명', 'rail', 'common', '근거리 충격 +2',
    [{ kind: 'impact', value: 2, condition: { range: 'near' } }]),
  laserLightModule: item('laserLightModule', '레이저·라이트 모듈', 'rail', 'advanced', '취약 효과 +1 · 근거리 충격 +1',
    [{ kind: 'vulnerableEffect', value: 1 }, { kind: 'impact', value: 1, condition: { range: 'near' } }]),
  texturedGrip: item('texturedGrip', '텍스처 손잡이', 'grip', 'common', '모든 탄 반동 -1',
    [{ kind: 'recoilReduction', value: 1 }]),
  ergonomicGrip: item('ergonomicGrip', '인체공학 손잡이', 'grip', 'advanced', '다음 탄 강화 효과 +1',
    [{ kind: 'followUpEffect', value: 1 }]),
};
export const ATTACHMENT_ORDER = Object.keys(ATTACHMENT_DEFINITIONS) as AttachmentId[];
export const isAttachmentCompatible = (id: AttachmentId, weapon: WeaponId, slot?: AttachmentSlot): boolean => {
  const entry = ATTACHMENT_DEFINITIONS[id];
  return Boolean(entry && entry.compatibleWeapons.includes(weapon) && (!slot || entry.slot === slot));
};
export type LoadoutSnapshot = Partial<Record<AttachmentSlot, AttachmentId>>;
export const DEFAULT_LOADOUT: LoadoutSnapshot = {};
