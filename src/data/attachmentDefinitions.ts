import type { AttachmentSlot, BuildTag, RangeBand } from '../combat/types';

export type AttachmentId =
  | 'returnBrake'
  | 'quietBore'
  | 'elementCatalyst'
  | 'extendedFeed'
  | 'reserveFeed'
  | 'crossFeed'
  | 'reflexSight'
  | 'rangeSight'
  | 'closeLaser'
  | 'responseScanner'
  | 'weightedGrip'
  | 'etchedGrip'
  | 'vowGrip';

export interface ModifierCondition {
  range?: RangeBand;
  ammoTag?: BuildTag;
  firstShot?: boolean;
  afterAmmoSwitch?: boolean;
  specialEnemy?: boolean;
}

export type AttachmentModifier =
  | { kind: 'accuracy'; value: number; condition?: ModifierCondition }
  | { kind: 'recoilStep'; value: number }
  | { kind: 'capacity'; value: number }
  | { kind: 'damageMultiplier'; value: number; condition?: ModifierCondition }
  | { kind: 'buildupMultiplier'; value: number; condition?: ModifierCondition }
  | { kind: 'impact'; value: number; condition?: ModifierCondition }
  | { kind: 'preserveFirstRare'; minimumAccuracy: number };

export interface AttachmentDefinition {
  id: AttachmentId;
  name: string;
  slot: AttachmentSlot;
  summary: string;
  tradeoff: string;
  electronic?: boolean;
  modifiers: readonly AttachmentModifier[];
}

export const ATTACHMENT_SLOT_ORDER: readonly AttachmentSlot[] = ['muzzle', 'magazine', 'optic', 'rail', 'grip'];

export const ATTACHMENT_SLOT_NAMES: Record<AttachmentSlot, string> = {
  muzzle: '총구', magazine: '탄창', optic: '조준경', rail: '전술 레일', grip: '손잡이',
};

export const ATTACHMENT_DEFINITIONS: Record<AttachmentId, AttachmentDefinition> = {
  returnBrake: {
    id: 'returnBrake', name: '회귀 제동기', slot: 'muzzle', summary: '탄당 반동 손실 -3%', tradeoff: '원거리 정확도 -10%',
    modifiers: [{ kind: 'recoilStep', value: -3 }, { kind: 'accuracy', value: -10, condition: { range: 'far' } }],
  },
  quietBore: {
    id: 'quietBore', name: '정적 소음기', slot: 'muzzle', summary: '첫 탄 정확도 +18%', tradeoff: '첫 탄 이후 피해 -8%',
    modifiers: [{ kind: 'accuracy', value: 18, condition: { firstShot: true } }, { kind: 'damageMultiplier', value: -0.08, condition: { firstShot: false } }],
  },
  elementCatalyst: {
    id: 'elementCatalyst', name: '원소 촉매관', slot: 'muzzle', summary: '원소 축적 +45%', tradeoff: '탄도 피해 -8%',
    modifiers: [{ kind: 'buildupMultiplier', value: 0.45, condition: { ammoTag: 'elemental' } }, { kind: 'damageMultiplier', value: -0.08, condition: { ammoTag: 'ballistic' } }],
  },
  extendedFeed: {
    id: 'extendedFeed', name: '확장 급탄기', slot: 'magazine', summary: '탄창 용량 +1', tradeoff: '탄당 반동 손실 +3%',
    modifiers: [{ kind: 'capacity', value: 1 }, { kind: 'recoilStep', value: 3 }],
  },
  reserveFeed: {
    id: 'reserveFeed', name: '회수 급탄기', slot: 'magazine', summary: '정확도 110% 이상인 첫 희귀탄 보존', tradeoff: '탄창 용량 -1',
    modifiers: [{ kind: 'capacity', value: -1 }, { kind: 'preserveFirstRare', minimumAccuracy: 110 }],
  },
  crossFeed: {
    id: 'crossFeed', name: '교차 급탄기', slot: 'magazine', summary: '탄종 전환 직후 정확도 +12%', tradeoff: '같은 탄 반복 정확도 -4%',
    modifiers: [{ kind: 'accuracy', value: 12, condition: { afterAmmoSwitch: true } }, { kind: 'accuracy', value: -4, condition: { afterAmmoSwitch: false, firstShot: false } }],
  },
  reflexSight: {
    id: 'reflexSight', name: '반사 조준기', slot: 'optic', summary: '근거리 +8% · 중거리 +3%', tradeoff: '원거리 정확도 -10%',
    modifiers: [{ kind: 'accuracy', value: 8, condition: { range: 'near' } }, { kind: 'accuracy', value: 3, condition: { range: 'mid' } }, { kind: 'accuracy', value: -10, condition: { range: 'far' } }],
  },
  rangeSight: {
    id: 'rangeSight', name: '거리계 조준경', slot: 'optic', summary: '원거리 정확도 +18%', tradeoff: '중거리 -2% · 근거리 -14%',
    modifiers: [{ kind: 'accuracy', value: 18, condition: { range: 'far' } }, { kind: 'accuracy', value: -2, condition: { range: 'mid' } }, { kind: 'accuracy', value: -14, condition: { range: 'near' } }],
  },
  closeLaser: {
    id: 'closeLaser', name: '근접 유도기', slot: 'rail', summary: '근거리 +18%, 중거리 +6% 정확도', tradeoff: '원거리 보너스 없음 · 전자식', electronic: true,
    modifiers: [{ kind: 'accuracy', value: 18, condition: { range: 'near' } }, { kind: 'accuracy', value: 6, condition: { range: 'mid' } }],
  },
  responseScanner: {
    id: 'responseScanner', name: '반응 분석기', slot: 'rail', summary: '특수 적 정확도 +10%', tradeoff: '일반 적 탄도전에는 효과 없음 · 전자식', electronic: true,
    modifiers: [{ kind: 'accuracy', value: 10, condition: { specialEnemy: true } }, { kind: 'buildupMultiplier', value: 0.25, condition: { ammoTag: 'elemental' } }],
  },
  weightedGrip: {
    id: 'weightedGrip', name: '중량 손잡이', slot: 'grip', summary: '탄당 반동 손실 -4%', tradeoff: '첫 탄 정확도 -6%',
    modifiers: [{ kind: 'recoilStep', value: -4 }, { kind: 'accuracy', value: -6, condition: { firstShot: true } }],
  },
  etchedGrip: {
    id: 'etchedGrip', name: '심연 각인 손잡이', slot: 'grip', summary: '오컬트 피해 +22%', tradeoff: '탄도탄 정확도 -10%',
    modifiers: [{ kind: 'damageMultiplier', value: 0.22, condition: { ammoTag: 'occult' } }, { kind: 'accuracy', value: -10, condition: { ammoTag: 'ballistic' } }],
  },
  vowGrip: {
    id: 'vowGrip', name: '백묵 서약 손잡이', slot: 'grip', summary: '신성탄 피해 +20% · 특수 적 정확도 +8%', tradeoff: '표준 탄도탄 피해 -8%',
    modifiers: [{ kind: 'damageMultiplier', value: 0.2, condition: { ammoTag: 'sacred' } }, { kind: 'accuracy', value: 8, condition: { specialEnemy: true } }, { kind: 'damageMultiplier', value: -0.08, condition: { ammoTag: 'ballistic' } }],
  },
};

export const ATTACHMENT_ORDER = Object.keys(ATTACHMENT_DEFINITIONS) as AttachmentId[];
// 비활성 탄약 전용 장착물은 정의와 회귀 검증만 보존한다.
export const ACTIVE_ATTACHMENT_ORDER = ATTACHMENT_ORDER.filter(id => !['elementCatalyst', 'reserveFeed', 'etchedGrip', 'vowGrip'].includes(id));
export type LoadoutSnapshot = Partial<Record<AttachmentSlot, AttachmentId>>;
export const DEFAULT_LOADOUT: LoadoutSnapshot = { muzzle: 'returnBrake', magazine: 'crossFeed', optic: 'reflexSight', rail: 'closeLaser', grip: 'weightedGrip' };
