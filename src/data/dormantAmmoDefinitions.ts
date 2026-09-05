import type { AmmoDefinition } from './ammoDefinitions';

/** 기존 상태/표현 회귀 검증용. 일반 진행·시작 배분·보상에는 사용하지 않는다. */
export const DORMANT_AMMO_DEFINITIONS = {
  incendiary: { id: 'incendiary', name: '열화탄', shortName: '열화', role: '열기 축적 후 화상', rarity: 'rare', tags: ['elemental'], color: 0xffba3a, cssColor: '#ffba3a', directDamage: 12, accuracy: 0, recoil: 0, armorBreak: 0, impact: 8, buildup: { type: 'burn', amount: 60 } },
  stagger: { id: 'stagger', name: '압력탄', shortName: '압력', role: '충격 축적과 이동 차단', rarity: 'uncommon', tags: ['ballistic'], color: 0x70e6d2, cssColor: '#70e6d2', directDamage: 10, accuracy: -2, recoil: 3, armorBreak: 0, impact: 66 },
  magnum: { id: 'magnum', name: '중량탄', shortName: '중량', role: '강한 피해와 충격, 큰 반동', rarity: 'rare', tags: ['ballistic'], color: 0xc895ff, cssColor: '#c895ff', directDamage: 34, accuracy: -5, recoil: 7, armorBreak: 0, impact: 38 },
  cryo: { id: 'cryo', name: '빙결탄', shortName: '빙결', role: '냉기 축적 후 접근 둔화', rarity: 'rare', tags: ['elemental'], color: 0x80e8ff, cssColor: '#80e8ff', directDamage: 11, accuracy: 4, recoil: 0, armorBreak: 0, impact: 10, buildup: { type: 'chill', amount: 60 } },
  arc: { id: 'arc', name: '전도탄', shortName: '전도', role: '전하 축적 후 특수 의도 지연', rarity: 'rare', tags: ['elemental'], color: 0x9fa8ff, cssColor: '#9fa8ff', directDamage: 13, accuracy: -1, recoil: 1, armorBreak: 0, impact: 8, buildup: { type: 'shock', amount: 60 } },
  sanctified: { id: 'sanctified', name: '새벽서약탄', shortName: '서약', role: '특수 감염체 심판', rarity: 'mythic', tags: ['sacred'], color: 0xfff2a8, cssColor: '#fff2a8', directDamage: 25, accuracy: 8, recoil: 2, armorBreak: 0, impact: 20, specialEnemyMultiplier: 1.35 },
  bloodHex: { id: 'bloodHex', name: '핏빛각인탄', shortName: '각인', role: '침식 축적 · 처치 시 회수', rarity: 'mythic', tags: ['occult'], color: 0xff5d83, cssColor: '#ff5d83', directDamage: 9, accuracy: 5, recoil: 0, armorBreak: 0, impact: 8, buildup: { type: 'corruption', amount: 60 }, recoverOnKill: true },
} satisfies Record<string, AmmoDefinition>;
