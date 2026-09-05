import { ATTACHMENT_DEFINITIONS, ATTACHMENT_ORDER, ATTACHMENT_RARITIES, ATTACHMENT_REWARD_WEIGHTS, isAttachmentCompatible, type AttachmentId, type AttachmentRarity, type WeaponId } from '../data/attachmentDefinitions';

/** 먼저 미소유 호환 풀을 만들고 등급 추첨 후 빈 등급만 대체한다. */
export function generateAttachmentReward(
  owned: readonly AttachmentId[], weapon: WeaponId = 'service45', random: () => number = Math.random,
  weights: Record<AttachmentRarity, number> = ATTACHMENT_REWARD_WEIGHTS,
): AttachmentId | undefined {
  const pool = ATTACHMENT_ORDER.filter(id => !owned.includes(id) && isAttachmentCompatible(id, weapon));
  if (!pool.length) return undefined;
  const total = ATTACHMENT_RARITIES.reduce((sum, rarity) => sum + weights[rarity], 0);
  let roll = random() * total;
  const rarity = ATTACHMENT_RARITIES.find(value => { roll -= weights[value]; return roll < 0; });
  const preferred = pool.filter(id => ATTACHMENT_DEFINITIONS[id].rarity === rarity);
  const eligible = preferred.length ? preferred : pool;
  return eligible[Math.min(eligible.length - 1, Math.floor(random() * eligible.length))];
}
