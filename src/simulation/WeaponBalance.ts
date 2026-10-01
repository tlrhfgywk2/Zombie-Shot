import { CombatResolver } from '../combat/CombatResolver';
import { createPlayerCombatState, getMagazineCapacity } from '../combat/AttachmentLoadout';
import { spinCylinder } from '../combat/WeaponTraits';
import { WEAPON_ORDER, type WeaponId } from '../data/weaponDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import type { AmmoType, EnemyType } from '../combat/types';
import type { LoadoutSnapshot } from '../data/attachmentDefinitions';

export const WEAPON_BALANCE_PLANS: Record<string, readonly AmmoType[]> = {
  '표준탄': ['ball'], '고압 연사': ['plusP'], '저반동 연사': ['lowRecoil'],
  '상처 연계': ['wounding', 'wounding', 'laceration', 'laceration', 'laceration'],
  '고반동 상처': ['serrated', 'serrated', 'laceration', 'laceration', 'laceration'],
  '폭발 기폭': ['explosive', 'explosive', 'explosive', 'flatNose', 'flatNose'],
  '고폭 기폭': ['highExplosive', 'highExplosive', 'highExplosive', 'flatNose', 'flatNose'],
  '충격 제어': ['hammer', 'hammer', 'resonance', 'heavy', 'resonance'],
  '반동 전환': ['plusP', 'plusP', 'kickback', 'ball', 'ball'],
  '혼합': ['advance', 'wounding', 'laceration', 'retreat', 'ball'],
};
const resolver = new CombatResolver();
export function balanceRounds(id: WeaponId, plan: readonly AmmoType[], loadout: LoadoutSnapshot = {}): AmmoType[] {
  return Array.from({ length: getMagazineCapacity(loadout, undefined, id) }, (_, index) => plan[index % plan.length]!);
}
export function simulateWeaponBalance(loadout: LoadoutSnapshot = {}, spin = false) {
  return WEAPON_ORDER.flatMap(weaponId => Object.entries(WEAPON_BALANCE_PLANS).flatMap(([plan, source]) =>
    [3, 7, 11].map(distance => {
      const rounds = balanceRounds(weaponId, source, loadout);
      const variants = spin && weaponId === 'm500'
        ? rounds.slice(1).map((_, index) => spinCylinder(rounds, () => (index + .5) / (rounds.length - 1))) : [rounds];
      const results = variants.map(order => resolver.resolveSequence(order,
        { ...createEnemyState('normal'), hp: 1000, maxHp: 1000, distance },
        { weaponId, loadout, boostedOpening: spin && weaponId === 'm500' }));
      const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
      return { weaponId, plan, distance, capacity: rounds.length,
        directDamage: mean(results.map(result => result.shots.reduce((sum, shot) => sum + shot.hpDamage - shot.explosionDamage, 0))),
        effectiveDamage: mean(results.map(result => result.totalHpDamage)),
        wound: mean(results.map(result => result.totalWoundApplied)),
        explosion: mean(results.map(result => result.totalExplosiveApplied)),
        detonated: mean(results.map(result => result.shots.reduce((sum, shot) => sum + shot.explosiveConsumed, 0))),
        impact: mean(results.map(result => result.totalActionShockApplied)),
        penalizedShots: mean(results.map(result => result.shots.filter(shot => shot.breakdown.recoilPenalty > 0).length)),
        recoilLoss: mean(results.map(result => result.firepowerBreakdown.recoilReduction)),
        bestDamage: Math.max(...results.map(result => result.totalHpDamage)),
        worstDamage: Math.min(...results.map(result => result.totalHpDamage)) };
    })));
}

/** 재고 제한과 별개인 고정 빌드의 반복 탄창 비교. 적 행동·이동·교란·턴 종료는 실제 계산기 사용. */
export function simulateWeaponEncounter(weaponId: WeaponId, plan: readonly AmmoType[], type: EnemyType, distance: number) {
  let enemy = { ...createEnemyState(type), distance };
  let playerState = createPlayerCombatState();
  let shots = 0;
  let actions = 0;
  let killed = false;
  let breached = false;
  while (actions < 12 && !killed && !breached) {
    const result = resolver.resolveSequence(balanceRounds(weaponId, plan), enemy, { weaponId, playerState });
    actions += 1; shots += result.shots.length; killed = result.killed; enemy = result.finalState;
    if (!killed) {
      const action = resolver.resolveEnemyAction(enemy, playerState);
      enemy = action.after; playerState = action.playerAfter; breached = action.playerKilled;
    }
  }
  return { weaponId, type, distance, actions, shots, killed, breached, remainingHp: enemy.hp };
}
