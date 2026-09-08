import type { AmmoDefinition } from './ammoDefinitions';

/** 기존 상태/표현 회귀 검증용. 일반 진행·시작 배분·보상에는 사용하지 않는다. */
export const DORMANT_AMMO_DEFINITIONS = {
  incendiary: { id: 'incendiary', name: '열화탄', shortName: '열화', role: '열기 축적 후 화상', rarity: 'rare', tags: ['elemental'], color: 0xffba3a, cssColor: '#ffba3a', firepower: 3, recoil: 0, armorBreak: 0, impact: 0, buildup: { type: 'burn', amount: 2 } },
  stagger: { id: 'stagger', name: '압력탄', shortName: '압력', role: '충격 축적과 이동 차단', rarity: 'uncommon', tags: ['ballistic'], color: 0x70e6d2, cssColor: '#70e6d2', firepower: 3, recoil: 1, armorBreak: 0, impact: 3 },
  magnum: { id: 'magnum', name: '중량탄', shortName: '중량', role: '강한 피해와 충격, 큰 반동', rarity: 'rare', tags: ['ballistic'], color: 0xc895ff, cssColor: '#c895ff', firepower: 8, recoil: 2, armorBreak: 0, impact: 2 },
  cryo: { id: 'cryo', name: '빙결탄', shortName: '빙결', role: '냉기 축적 후 접근 둔화', rarity: 'rare', tags: ['elemental'], color: 0x80e8ff, cssColor: '#80e8ff', firepower: 3, recoil: 0, armorBreak: 0, impact: 0, buildup: { type: 'chill', amount: 2 } },
  arc: { id: 'arc', name: '전도탄', shortName: '전도', role: '전하 축적 후 특수 의도 지연', rarity: 'rare', tags: ['elemental'], color: 0x9fa8ff, cssColor: '#9fa8ff', firepower: 3, recoil: 0, armorBreak: 0, impact: 0, buildup: { type: 'shock', amount: 2 } },
  sanctified: { id: 'sanctified', name: '새벽서약탄', shortName: '서약', role: '특수 감염체 심판', rarity: 'mythic', tags: ['sacred'], color: 0xfff2a8, cssColor: '#fff2a8', firepower: 5, recoil: 1, armorBreak: 0, impact: 1, specialEnemyFirepowerBonus: 3 },
  bloodHex: { id: 'bloodHex', name: '핏빛각인탄', shortName: '각인', role: '침식 축적 · 처치 시 회수', rarity: 'mythic', tags: ['occult'], color: 0xff5d83, cssColor: '#ff5d83', firepower: 2, recoil: 0, armorBreak: 0, impact: 0, buildup: { type: 'corruption', amount: 2 }, recoverOnKill: true },
} satisfies Record<string, AmmoDefinition>;
