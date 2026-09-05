import { CombatResolver } from '../combat/CombatResolver';
import type { AmmoType, EnemyType } from '../combat/types';
import { DEFAULT_LOADOUT, ATTACHMENT_SLOT_ORDER, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { AMMO_ORDER, countAllocations, rewardAmount, type SpecialAmmoType } from '../data/ammoDefinitions';
import { ENCOUNTER_STAGES } from '../data/encounterDefinitions';
import { ENEMY_DEFINITIONS, createEnemyState } from '../data/enemyDefinitions';
import { Player } from '../entities/Player';
import { generateAmmoRewards } from '../progression/AmmoRewards';

export const SIMULATION_PLANS: readonly { name: string; priority: readonly AmmoType[] }[] = [
  { name: '표준탄 기준', priority: ['standard'] },
  { name: '방어 준비', priority: ['armorPiercing', 'bonded', 'hollowPoint', 'standard'] },
  { name: '화력 우선', priority: ['hollowPoint', 'overpressure', 'standard'] },
  { name: '안정 선행', priority: ['wadcutter', 'subsonic', 'overpressure', 'hollowPoint', 'standard'] },
  { name: '정밀 사격', priority: ['match', 'hollowPoint', 'standard'] },
  { name: '충격 연계', priority: ['flatPoint', 'flatPoint', 'hollowPoint', 'standard'] },
];
export const createAllLoadouts = (): LoadoutSnapshot[] => [
  DEFAULT_LOADOUT, { muzzle: 'compactCompensator', magazine: 'extendedBasePad', optic: 'highVisibilitySight', rail: 'compactLaserSight', grip: 'rubberGrip' },
  { optic: 'compactReflexSight', magazine: 'extendedMagazine', rail: 'laserLightModule' },
  { muzzle: 'dualPortCompensator', grip: 'g10Grip', magazine: 'extendedBasePad', optic: 'highVisibilitySight', rail: 'compactLaserSight' },
];
export const seededRandom = (seed: number): (() => number) => () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const configure = (player: Player, loadout: LoadoutSnapshot): void => {
  for (const slot of ATTACHMENT_SLOT_ORDER) player.unequipAttachment(slot);
  for (const id of Object.values(loadout)) if (id) { player.claimAttachment(id); player.equipAttachment(id); }
};
export function simulateEncounter(priority: readonly AmmoType[], type: EnemyType, player: Player) {
  const resolver = new CombatResolver();
  let enemy = createEnemyState(type);
  player.clearCombatDisruptions();
  let shots = 0, armorBroken = 0, staggerTriggers = 0, accuracyAbove100 = 0;
  for (let turn = 0; turn < 12 && enemy.hp > 0 && enemy.distance > 0; turn += 1) {
    // 소유 탄약에 직접 접근하는 결정론적 전략. 무작위 드로우가 아니다.
    while (player.magazine.size < player.magazine.capacity) {
      for (const ammo of priority) {
        if (player.magazine.size >= player.magazine.capacity) break;
        player.addAmmo(ammo);
      }
      if (player.magazine.size < player.magazine.capacity) player.addAmmo('standard');
    }
    const sequence = resolver.resolveSequence(player.magazine.getRounds(), enemy, { loadout: player.loadout.getSnapshot(), playerState: player.getCombatState() });
    for (const shot of sequence.shots) {
      player.fireRound(shot);
      shots += 1;
      armorBroken += shot.breakdown.armorBroken;
      staggerTriggers += shot.staggerApplied;
      accuracyAbove100 += Number(shot.breakdown.accuracy > 100);
    }
    player.magazine.clear();
    enemy = sequence.finalState;
    if (enemy.hp > 0) {
      const action = resolver.resolveEnemyAction(enemy, player.getCombatState(), player.loadout.getSnapshot());
      enemy = action.after;
      player.applyCombatState(action.playerAfter);
    }
  }
  return { won: enemy.hp <= 0, shots, armorBroken, staggerTriggers, accuracyAbove100 };
}
export function runBalanceSimulation() {
  const loadouts = createAllLoadouts();
  const encounters = SIMULATION_PLANS.flatMap(plan => loadouts.flatMap(loadout => (Object.keys(ENEMY_DEFINITIONS) as EnemyType[]).map(type => {
    const player = new Player();
    configure(player, loadout);
    // 탄종 역할 비교에는 해당 전략의 6발 배분을 구성한다.
    player.setSpecialCapacity(countAllocations(player.getBuild()));
    const special = plan.priority.filter((ammo): ammo is SpecialAmmoType => ammo !== 'standard');
    if (special.length) for (let i = 0; i < 6; i += 1) {
      const removed = i < 3 ? 'armorPiercing' : 'hollowPoint';
      player.applyAmmoReward(special[i % special.length]!, [removed]);
    }
    player.startStage();
    return { plan: plan.name, type, ...simulateEncounter(plan.priority, type, player) };
  })));
  const routes = SIMULATION_PLANS.flatMap(plan => loadouts.flatMap(loadout => Array.from({ length: 16 }, (_, mask) => {
    const player = new Player();
    configure(player, loadout);
    const random = seededRandom(1234 + mask);
    let cleared = 0, shots = 0;
    for (let i = 0; i < ENCOUNTER_STAGES.length; i += 1) {
      player.startStage();
      const stage = ENCOUNTER_STAGES[i]!;
      const route = stage.special && (mask & (1 << (i - 1))) ? stage.special : stage.normal;
      for (const type of route.roster) {
        const result = simulateEncounter(plan.priority, type, player);
        shots += result.shots;
        if (!result.won) return { plan: plan.name, mask, cleared, shots, completed: false };
      }
      cleared += 1;
      const options = generateAmmoRewards(random);
      const selected = options.find(ammo => plan.priority.includes(ammo)) ?? options[0]!;
      const replace = AMMO_ORDER.find((ammo): ammo is SpecialAmmoType => ammo !== 'standard' && player.getBuild()[ammo] > 0 && !plan.priority.includes(ammo))
        ?? AMMO_ORDER.find((ammo): ammo is SpecialAmmoType => ammo !== 'standard' && player.getBuild()[ammo] > 0)!;
      const needsReplacement = countAllocations(player.getBuild()) + rewardAmount(selected) > player.getSpecialCapacity();
      player.applyAmmoReward(selected, needsReplacement ? [replace] : []);
    }
    return { plan: plan.name, mask, cleared, shots, completed: true };
  })));
  return { loadoutCount: loadouts.length, encounters, routes };
}
export const formatBalanceReport = (report: ReturnType<typeof runBalanceSimulation>): string => JSON.stringify({
  '단일 조우 표본': report.encounters.length,
  '전체 경로 표본': report.routes.length,
  '적별 승률': Object.fromEntries(Object.keys(ENEMY_DEFINITIONS).map(type => {
    const samples = report.encounters.filter(row => row.type === type);
    return [ENEMY_DEFINITIONS[type as EnemyType].name, samples.filter(row => row.won).length / samples.length];
  })),
  '전략별 완주율': Object.fromEntries(SIMULATION_PLANS.map(plan => {
    const samples = report.routes.filter(row => row.plan === plan.name);
    return [plan.name, samples.filter(row => row.completed).length / samples.length];
  })),
}, null, 2);
