import { describe, expect, it } from 'vitest';
import { AMMO_BUILD_BALANCE, AMMO_DEFINITIONS } from '../data/ammoDefinitions';
import { seededRandom } from '../simulation/BalanceSimulator';
import { generateAmmoRewards } from './AmmoRewards';

describe('스테이지 탄약 보상', () => {
  it('3개 고유 선택지는 표준/실험 탄약을 제외한다', () => {
    const random = seededRandom(74);
    for (let i = 0; i < 1000; i += 1) {
      const options = generateAmmoRewards(random);
      expect(new Set(options).size).toBe(3);
      for (const ammo of options) {
        expect(['common', 'uncommon']).toContain(AMMO_DEFINITIONS[ammo].rarity);
        expect(AMMO_DEFINITIONS[ammo].tags).toEqual(['ballistic']);
        expect(['standard', 'stagger', 'magnum']).not.toContain(ammo);
      }
    }
  });
  it('일반 75/고급 25 가중치를 재현하며 소유 탄도 후보에 둔다', () => {
    const random = seededRandom(581);
    let common = 0;
    const seen = new Set<string>();
    for (let i = 0; i < 10000; i += 1) {
      const options = generateAmmoRewards(random);
      common += Number(AMMO_DEFINITIONS[options[0]!].rarity === 'common');
      options.forEach(ammo => seen.add(ammo));
    }
    expect(common / 10000).toBeGreaterThan(0.73);
    expect(common / 10000).toBeLessThan(0.77);
    expect(seen.size).toBe(8);
    expect(seen.has('hollowPoint')).toBe(true);
    expect(AMMO_BUILD_BALANCE.rarityWeights).toEqual({ common: 75, uncommon: 25 });
  });
});
