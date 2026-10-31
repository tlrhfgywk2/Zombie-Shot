// 실험 진입점. production 디렉터리를 읽기만 하며 일반 게임은 이 모듈을 가져오지 않는다.
export { CombatResolver, previewEnemyAction } from '../../src/combat/CombatResolver';
export { createEnemyState, ENEMY_DEFINITIONS } from '../../src/data/enemyDefinitions';
export { WEAPON_DEFINITIONS } from '../../src/data/weaponDefinitions';
export { ATTACHMENT_DEFINITIONS } from '../../src/data/attachmentDefinitions';
export { createPlayerCombatState } from '../../src/combat/AttachmentLoadout';
export { generateAttachmentReward } from '../../src/progression/AttachmentRewards';
export { AMMO_DEFINITIONS } from '../../src/data/ammoDefinitions';
export { Player } from '../../src/entities/Player';
export { ExplorationRun } from '../../src/exploration/ExplorationRun';
