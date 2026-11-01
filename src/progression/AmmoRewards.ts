import { AMMO_BUILD_BALANCE, AMMO_DEFINITIONS, AMMO_ORDER, type SpecialAmmoType } from '../data/ammoDefinitions';
import { ammoSynergyScores, type SynergyContext } from './AmmoSynergy';

export const AMMO_SYNERGY_GUIDANCE = { chance: .5, strength: 3 } as const;
export interface AmmoRewardOptions {
  context?: SynergyContext;
  pool?: readonly SpecialAmmoType[];
  choices?: number;
  guidance?: { chance: number; strength: number };
  rarityFirst?: boolean;
}
const unit = (value: number) => Number.isFinite(value) ? Math.min(.999999999, Math.max(0, value)) : 0;

/** 등급을 먼저 추첨하고 중복 없이 고른다. 소유 탄약도 후보에 남긴다. */
export function generateAmmoRewards(random: () => number = Math.random, options: AmmoRewardOptions = {}): SpecialAmmoType[] {
  const pool = [...new Set(options.pool ?? AMMO_ORDER.filter((ammo): ammo is SpecialAmmoType => ammo !== 'ball'))]
    .filter(ammo => ammo !== ('ball' as string) && Object.hasOwn(AMMO_DEFINITIONS, ammo));
  const choices = Math.max(0, Math.min(pool.length, Math.floor(options.choices ?? AMMO_BUILD_BALANCE.rewardChoices)));
  const guidance = options.guidance ?? AMMO_SYNERGY_GUIDANCE;
  const scores = options.context && guidance.chance > 0 ? ammoSynergyScores(options.context, pool) : new Map<SpecialAmmoType, number>();
  const guided = guidance.chance > 0 && [...scores.values()].some(score => score > 0) && unit(random()) < guidance.chance;
  const guidedSlot = guided ? Math.floor(unit(random()) * choices) : -1;
  const result: SpecialAmmoType[] = [];
  while (result.length < choices && pool.length) {
    const rarities = (['common', 'uncommon'] as const).filter(rarity => pool.some(ammo => AMMO_DEFINITIONS[ammo].rarity === rarity));
    const total = rarities.reduce((sum, rarity) => sum + AMMO_BUILD_BALANCE.rarityWeights[rarity], 0);
    let pick = options.rarityFirst === false ? 0 : unit(random()) * total;
    const rarity = rarities.find(value => { pick -= AMMO_BUILD_BALANCE.rarityWeights[value]; return pick < 0; })!;
    const candidates = options.rarityFirst === false ? pool : pool.filter(ammo => AMMO_DEFINITIONS[ammo].rarity === rarity);
    const weights = candidates.map(ammo => 1 + (result.length === guidedSlot ? Math.max(0, guidance.strength) * (scores.get(ammo) ?? 0) : 0));
    let roll = unit(random()) * weights.reduce((sum, weight) => sum + weight, 0);
    const ammo = candidates[weights.findIndex(weight => { roll -= weight; return roll < 0; })] ?? candidates[candidates.length - 1]!;
    result.push(ammo);
    pool.splice(pool.indexOf(ammo), 1);
  }
  return result;
}
