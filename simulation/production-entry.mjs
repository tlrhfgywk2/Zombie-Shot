// Read-only bridge. Bundled in memory; never included in the browser game.
export { CombatResolver, previewEnemyAction } from '../src/combat/CombatResolver.ts';
export { createEnemyState, ENEMY_DEFINITIONS } from '../src/data/enemyDefinitions.ts';
export { AMMO_DEFINITIONS, AMMO_ORDER } from '../src/data/ammoDefinitions.ts';
export { WEAPON_DEFINITIONS } from '../src/data/weaponDefinitions.ts';
export { ATTACHMENT_DEFINITIONS } from '../src/data/attachmentDefinitions.ts';
export { createPlayerCombatState } from '../src/combat/AttachmentLoadout.ts';
export { generateAmmoRewards } from '../src/progression/AmmoRewards.ts';
export { generateAttachmentReward } from '../src/progression/AttachmentRewards.ts';
export { ExplorationRun } from '../src/exploration/ExplorationRun.ts';
