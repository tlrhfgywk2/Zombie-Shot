import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS, createAmmoBuild } from './ammoDefinitions';
import { createRunAmmoBuild } from './gameModes';
import { WEAPON_ORDER } from './weaponDefinitions';

describe('권총별 초기 탄약 정의', () => {
  it.each([
    ['p220', { opening: 1, flatNose: 2 }],
    ['m1911', { finisher: 1, wounding: 2 }],
    ['desertEagle', { plusP: 1, lowRecoil: 2 }],
    ['m500', { lightLoad: 1, relay: 1 }],
  ] as const)('%s는 지정 탄약만 정확히 지급한다', (weapon, allocations) => {
    expect(createRunAmmoBuild('startingAmmo', weapon)).toEqual(createAmmoBuild(allocations));
  });
  it.each(WEAPON_ORDER)('프리 모드 %s는 기존 초기 배분을 유지한다', weapon => {
    expect(createRunAmmoBuild('free', weapon)).toEqual(createAmmoBuild());
  });
  it.each([
    ['opening', '초탄', 'Opening Round', 'first'],
    ['finisher', '종결탄', 'Finisher Round', 'last'],
    ['lightLoad', '경량장전탄', 'Light-Load Round', 'emptySlots'],
  ] as const)('%s는 지정된 한국어·영어 이름과 기존 배열 효과를 사용한다', (id, name, englishName, condition) => {
    expect(AMMO_DEFINITIONS[id]).toMatchObject({ name, englishName, rules: [{ layer: 'magazine', condition: { type: condition } }] });
  });
});
