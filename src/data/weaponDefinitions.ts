import type { RangeBand } from '../combat/types';

export type WeaponId = 'p220' | 'm1911' | 'desertEagle' | 'm500';
export type WeaponTrait = 'standardBall' | 'familyChain' | 'deferredRecoil' | 'cylinder';
export interface WeaponDefinition {
  id: WeaponId; name: string; role: string; trait: WeaponTrait; traitLabel: string; traitDetail: string;
  baseMagazineCapacity: number; maximumMagazineCapacity: number; firepowerAdjustment: number;
  rangePenaltyPercentages: Record<RangeBand, number>; recoilThreshold: number; recoilAdjustment: number;
  ratings: { magazine: string; firepower: string; range: string; recoil: string; difficulty: string };
}
export const WEAPON_DEFINITIONS: Record<WeaponId, WeaponDefinition> = {
  p220: {
    id: 'p220', name: 'P220', role: '기본 탄약으로도 안정적인 범용 권총', trait: 'standardBall',
    traitLabel: '표준탄 반동 0', traitDetail: '무제한 표준탄만 반동을 생성하지 않습니다. 다른 탄약은 원래 반동을 유지합니다.',
    baseMagazineCapacity: 4, maximumMagazineCapacity: 6, firepowerAdjustment: 0,
    rangePenaltyPercentages: { melee: 0, near: 0, mid: 10, far: 20 }, recoilThreshold: 4, recoilAdjustment: 0,
    ratings: { magazine: '●●○', firepower: '●●●', range: '●●●', recoil: '●●○', difficulty: '●' },
  },
  m1911: {
    id: 'm1911', name: 'M1911 9mm', role: '4발 탄창과 같은 계열의 연속 사격', trait: 'familyChain',
    traitLabel: '같은 계열 연속 탄 · 주효과 +1', traitDetail: '직전 탄과 주계열이 같으면 이번 탄의 주효과만 +1. 계속 이어져도 +1이며 계열 변경·새 탄창에서 초기화됩니다.',
    baseMagazineCapacity: 4, maximumMagazineCapacity: 5, firepowerAdjustment: -1,
    rangePenaltyPercentages: { melee: 0, near: 0, mid: 10, far: 20 }, recoilThreshold: 5, recoilAdjustment: 0,
    ratings: { magazine: '●●●', firepower: '●●', range: '●●●', recoil: '●●', difficulty: '●●' },
  },
  desertEagle: {
    id: 'desertEagle', name: '데저트 이글', role: '강한 첫 사격과 후속 탄의 반동 부담', trait: 'deferredRecoil',
    traitLabel: '이번 탄 반동은 후속 탄부터', traitDetail: '회복·소모 후의 기존 반동으로 화력 감소를 계산하고, 이번 탄이 생성한 반동은 사격 뒤에 더합니다.',
    baseMagazineCapacity: 4, maximumMagazineCapacity: 5, firepowerAdjustment: 1,
    rangePenaltyPercentages: { melee: 0, near: 0, mid: 15, far: 25 }, recoilThreshold: 3, recoilAdjustment: 0,
    ratings: { magazine: '●●○', firepower: '●●●●', range: '●●', recoil: '●●●', difficulty: '●●●' },
  },
  m500: {
    id: 'm500', name: 'S&W M500', role: '4발 고정 · 강한 한 발과 실린더 도박', trait: 'cylinder',
    traitLabel: '실린더 회전 · 첫 탄 주효과 +50%', traitDetail: '장전 뒤 수정할 수 없으며 순서 유지 또는 회전을 한 번만 선택합니다. 회전은 다른 시작 칸을 고르고 원형 순서를 보존합니다. 결과를 확인한 뒤 발사하며 첫 탄 주효과만 1.5배 반올림합니다.',
    baseMagazineCapacity: 4, maximumMagazineCapacity: 4, firepowerAdjustment: 2,
    rangePenaltyPercentages: { melee: 0, near: 0, mid: 15, far: 25 }, recoilThreshold: 3, recoilAdjustment: 2,
    ratings: { magazine: '●●', firepower: '●●●●●', range: '●●○', recoil: '●●●●', difficulty: '●●●●' },
  },
};
export const WEAPON_ORDER = Object.keys(WEAPON_DEFINITIONS) as WeaponId[];
