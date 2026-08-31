import type { AmmoType } from '../combat/types';

export interface AmmoDefinition {
  id: AmmoType;
  name: string;
  shortName: string;
  role: string;
  color: number;
  cssColor: string;
  directDamage: number;
}

export const AMMO_DEFINITIONS: Record<AmmoType, AmmoDefinition> = {
  standard: {
    id: 'standard',
    name: '표준탄',
    shortName: '표준',
    role: '어떤 거리에서도 안정적인 피해',
    color: 0xd8c6a2,
    cssColor: '#d8c6a2',
    directDamage: 22,
  },
  tracer: {
    id: 'tracer',
    name: '예광탄',
    shortName: '예광',
    role: '다음 탄환의 피해를 증폭',
    color: 0xff6b35,
    cssColor: '#ff6b35',
    directDamage: 11,
  },
  fragmenting: {
    id: 'fragmenting',
    name: '파편탄',
    shortName: '파편',
    role: '가까울수록 강력한 피해',
    color: 0x70d67b,
    cssColor: '#70d67b',
    directDamage: 34,
  },
  incendiary: {
    id: 'incendiary',
    name: '소이탄',
    shortName: '소이',
    role: '적 행동 전에 화상 피해',
    color: 0xffba3a,
    cssColor: '#ffba3a',
    directDamage: 12,
  },
};

export const AMMO_ORDER: AmmoType[] = ['standard', 'tracer', 'fragmenting', 'incendiary'];

export const COMBAT_BALANCE = {
  magazineCapacity: 4,
  tracerNextMultiplier: 1.65,
  fragmentingCloseDistance: 5,
  fragmentingFarDamage: 14,
  burnDamagePerStack: 8,
  burnTicks: 2,
  zombieInitialHp: 74,
  zombieHpGrowth: 18,
  zombieInitialDistance: 10,
  zombieAdvancePerCycle: 2,
} as const;
