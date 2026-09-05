import { AMMO_BUILD_BALANCE, AMMO_DEFINITIONS, AMMO_ORDER, type SpecialAmmoType } from '../data/ammoDefinitions';

/** 등급을 먼저 추첨하고 중복 없이 고른다. 소유 탄약도 후보에 남긴다. */
export function generateAmmoRewards(random: () => number = Math.random): SpecialAmmoType[] {
  const pool = AMMO_ORDER.filter((ammo): ammo is SpecialAmmoType => ammo !== 'standard');
  const result: SpecialAmmoType[] = [];
  while (result.length < AMMO_BUILD_BALANCE.rewardChoices && pool.length) {
    const rarities = (['common', 'uncommon'] as const).filter(rarity => pool.some(ammo => AMMO_DEFINITIONS[ammo].rarity === rarity));
    const total = rarities.reduce((sum, rarity) => sum + AMMO_BUILD_BALANCE.rarityWeights[rarity], 0);
    let pick = Math.min(0.999999999, Math.max(0, random())) * total;
    const rarity = rarities.find(value => { pick -= AMMO_BUILD_BALANCE.rarityWeights[value]; return pick < 0; })!;
    const candidates = pool.filter(ammo => AMMO_DEFINITIONS[ammo].rarity === rarity);
    const ammo = candidates[Math.min(candidates.length - 1, Math.floor(Math.max(0, random()) * candidates.length))]!;
    result.push(ammo);
    pool.splice(pool.indexOf(ammo), 1);
  }
  return result;
}
