import { CombatResolver } from '../combat/CombatResolver';
import type { AmmoType, EnemyType } from '../combat/types';
import { createEnemyState } from '../data/enemyDefinitions';
import { Player } from '../entities/Player';

/** 체력을 크게 둔 표적에 최대 휴대량을 모두 충격탄으로 투자한다. 재보급 없는 봉쇄 지속 시간을 측정한다. */
export function auditFiniteShockLock(type: EnemyType, ammo: 'flatPoint' | 'wadcutter', spacing: 'single' | 'consecutive' | 'spaced') {
  const player = new Player();
  for (let index = 0; index < 14; index += 1) {
    player.applyAmmoReward(ammo, index < 3 ? ['armorPiercing'] : index < 6 ? ['hollowPoint'] : []);
  }
  player.startStage();
  const resolver = new CombatResolver();
  let enemy = { ...createEnemyState(type), hp: 100000, maxHp: 100000 };
  let interruptions = 0, consumed = 0;
  for (let turn = 1; turn <= 100; turn += 1) {
    const pattern: AmmoType[] = spacing === 'single' ? [ammo] : spacing === 'consecutive'
      ? [ammo, ammo, ammo, ammo] : [ammo, 'standard', ammo, 'standard'];
    for (const round of pattern) player.addAmmo(round);
    if (!player.magazine.size) player.addAmmo('standard');
    const sequence = resolver.resolveSequence(player.magazine.getRounds(), enemy, { playerState: player.getCombatState() });
    for (const shot of sequence.shots) { player.fireRound(shot); if (shot.ammoType === ammo) consumed += 1; }
    player.magazine.clear();
    const action = resolver.resolveEnemyAction(sequence.finalState, player.getCombatState());
    enemy = action.after;
    player.applyCombatState(action.playerAfter);
    interruptions += Number(action.interrupted);
    if (action.playerKilled) return { type, ammo, spacing, turns: turn, interruptions, consumed, escapedLock: true };
  }
  return { type, ammo, spacing, turns: 100, interruptions, consumed, escapedLock: false };
}
