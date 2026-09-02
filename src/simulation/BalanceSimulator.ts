import { createPlayerCombatState, getMagazineCapacity } from '../combat/AttachmentLoadout';
import { CombatResolver } from '../combat/CombatResolver';
import type { AmmoType, BuildTag, EnemyType, PlayerCombatState, RangeBand, StatusType } from '../combat/types';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_SLOT_ORDER, type AttachmentId, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { AMMO_ORDER, NORMAL_AMMO_SUPPLY, SPECIAL_AMMO_SUPPLY, STARTING_AMMO_STOCK, type AmmoStock } from '../data/ammoDefinitions';
import { ENCOUNTER_STAGES } from '../data/encounterDefinitions';
import { ENEMY_DEFINITIONS, createEnemyState } from '../data/enemyDefinitions';

export type SimulationFamily = BuildTag | 'mixed' | 'control';
export type BalanceClassification = 'dominant' | 'dead' | 'niche' | 'healthy';

export interface SimulationPlan {
  id: string;
  name: string;
  family: SimulationFamily;
  priority: readonly AmmoType[];
}

export interface SimulatedEncounter {
  plan: SimulationPlan;
  enemyType: EnemyType;
  loadout: LoadoutSnapshot;
  won: boolean;
  turns: number;
  damage: number;
  averageAccuracy: number;
  accuracyAbove100: number;
  shots: number;
  conserved: number;
  remainingAmmo: number;
  armorDamage: number;
  penetrationDamage: number;
  staggerTriggers: number;
  intentDelays: number;
  statusTriggers: Record<StatusType, number>;
  ammoUsed: Record<AmmoType, number>;
  rangeShots: Record<RangeBand, number>;
  rangeDamage: Record<RangeBand, number>;
}

export interface AttachmentBalanceMetric {
  id: AttachmentId;
  name: string;
  slot: string;
  winRate: number;
  averageDamage: number;
  topBuildShare: number;
  classification: BalanceClassification;
}

export interface BalanceReport {
  totalEncounters: number;
  loadoutCount: number;
  normalWinRate: number;
  specialWinRate: number;
  averageDamage: number;
  averageRemainingAmmo: number;
  averageAccuracy: number;
  accuracyAbove100Rate: number;
  conservationRate: number;
  armorDamage: number;
  penetrationDamage: number;
  staggerTriggers: number;
  intentDelays: number;
  statusTriggers: Record<StatusType, number>;
  ammoUsage: Record<AmmoType, number>;
  rangeMetrics: Record<RangeBand, { shots: number; averageDamage: number }>;
  familyWinRates: Record<SimulationFamily, number>;
  enemyWinRates: Record<EnemyType, number>;
  attachmentMetrics: AttachmentBalanceMetric[];
  routeMetrics: RouteBalanceMetric[];
}

export interface RouteBalanceMetric {
  specialChoices: number;
  samples: number;
  completionRate: number;
  averageRoundsSpent: number;
  averageRemainingAmmo: number;
}

export const SIMULATION_PLANS: readonly SimulationPlan[] = [
  { id: 'ballistic', name: '장갑 해체 탄도', family: 'ballistic', priority: ['armorPiercing', 'hollowPoint', 'magnum', 'standard'] },
  { id: 'elemental', name: '원소 임계 연쇄', family: 'elemental', priority: ['incendiary', 'cryo', 'arc', 'standard'] },
  { id: 'sacred', name: '서약 정밀 사격', family: 'sacred', priority: ['sanctified', 'armorPiercing', 'hollowPoint', 'standard'] },
  { id: 'occult', name: '침식 회수 연쇄', family: 'occult', priority: ['bloodHex', 'incendiary', 'magnum', 'standard'] },
  { id: 'control', name: '접근·의도 제어', family: 'control', priority: ['stagger', 'cryo', 'arc', 'standard'] },
  { id: 'mixed', name: '범용 혼합 구성', family: 'mixed', priority: ['stagger', 'armorPiercing', 'hollowPoint', 'standard'] },
];

const emptyAmmoCounter = (): Record<AmmoType, number> => Object.fromEntries(AMMO_ORDER.map((ammo) => [ammo, 0])) as Record<AmmoType, number>;
const emptyStatusCounter = (): Record<StatusType, number> => ({ burn: 0, chill: 0, shock: 0, corruption: 0 });
const emptyRangeCounter = (): Record<RangeBand, number> => ({ near: 0, mid: 0, far: 0 });
const sumStock = (stock: AmmoStock): number => AMMO_ORDER.reduce((sum, ammo) => sum + stock[ammo], 0);
const addSupply = (stock: AmmoStock, supply: AmmoStock): void => {
  for (const ammo of AMMO_ORDER) stock[ammo] += supply[ammo];
};

export const createAllLoadouts = (): LoadoutSnapshot[] => {
  const bySlot = ATTACHMENT_SLOT_ORDER.map((slot) => (Object.keys(ATTACHMENT_DEFINITIONS) as AttachmentId[]).filter((id) => ATTACHMENT_DEFINITIONS[id].slot === slot));
  let combinations: LoadoutSnapshot[] = [{}];
  for (let index = 0; index < ATTACHMENT_SLOT_ORDER.length; index += 1) {
    const slot = ATTACHMENT_SLOT_ORDER[index]!;
    combinations = combinations.flatMap((loadout) => bySlot[index]!.map((id) => ({ ...loadout, [slot]: id })));
  }
  return combinations;
};

const drawMagazine = (plan: SimulationPlan, stock: AmmoStock, capacity: number): AmmoType[] => {
  const rounds: AmmoType[] = [];
  const priority = [...plan.priority, ...AMMO_ORDER.filter((ammo) => !plan.priority.includes(ammo))];
  while (rounds.length < capacity) {
    let loaded = false;
    for (const ammo of priority) {
      if (rounds.length >= capacity) break;
      if (stock[ammo] <= 0) continue;
      stock[ammo] -= 1;
      rounds.push(ammo);
      loaded = true;
    }
    if (!loaded) break;
  }
  return rounds;
};

const simulateEnemyWithStock = (plan: SimulationPlan, enemyType: EnemyType, loadout: LoadoutSnapshot, stock: AmmoStock): SimulatedEncounter => {
  const resolver = new CombatResolver();
  let enemy = createEnemyState(enemyType);
  let player: PlayerCombatState = createPlayerCombatState();
  const ammoUsed = emptyAmmoCounter();
  const statusTriggers = emptyStatusCounter();
  const rangeShots = emptyRangeCounter();
  const rangeDamage = emptyRangeCounter();
  let turns = 0;
  let damage = 0;
  let armorDamage = 0;
  let penetrationDamage = 0;
  let accuracyTotal = 0;
  let accuracyAbove100 = 0;
  let shots = 0;
  let conserved = 0;
  let staggerTriggers = 0;
  let intentDelays = 0;

  while (enemy.hp > 0 && enemy.distance > 0 && turns < 7) {
    turns += 1;
    const rounds = drawMagazine(plan, stock, getMagazineCapacity(loadout, player));
    if (rounds.length === 0) break;
    const sequence = resolver.resolveSequence(rounds, enemy, { loadout, playerState: player });
    enemy = sequence.finalState;
    damage += sequence.totalHpDamage + sequence.totalArmorDamage;
    armorDamage += sequence.totalArmorDamage;
    for (const shot of sequence.shots) {
      shots += 1;
      accuracyTotal += shot.breakdown.accuracy;
      rangeShots[shot.breakdown.rangeBand] += 1;
      rangeDamage[shot.breakdown.rangeBand] += shot.damage;
      if (shot.breakdown.accuracy > 100) accuracyAbove100 += 1;
      if (shot.statusTriggered) statusTriggers[shot.statusTriggered] += 1;
      if (shot.staggerApplied > 0) staggerTriggers += 1;
      if (shot.before.armor > 0) penetrationDamage += Math.min(shot.hpDamage, shot.breakdown.penetration);
      if (shot.conserved) conserved += 1;
      else ammoUsed[shot.ammoType] += 1;
    }
    for (const ammo of sequence.returnedRounds) stock[ammo] += 1;
    if (enemy.hp <= 0) break;
    const action = resolver.resolveEnemyAction(enemy, player, loadout);
    enemy = action.after;
    player = action.playerAfter;
    if (action.intentDelayed) intentDelays += 1;
  }

  return {
    plan, enemyType, loadout, won: enemy.hp <= 0, turns, damage,
    averageAccuracy: shots ? accuracyTotal / shots : 0,
    accuracyAbove100, shots, conserved, remainingAmmo: sumStock(stock), armorDamage, penetrationDamage,
    staggerTriggers, intentDelays, statusTriggers, ammoUsed, rangeShots, rangeDamage,
  };
};

export const simulateEncounter = (plan: SimulationPlan, enemyType: EnemyType, loadout: LoadoutSnapshot): SimulatedEncounter =>
  simulateEnemyWithStock(plan, enemyType, loadout, { ...STARTING_AMMO_STOCK });

interface SimulatedRun {
  specialChoices: number;
  completed: boolean;
  roundsSpent: number;
  remainingAmmo: number;
}

const simulateRun = (plan: SimulationPlan, loadout: LoadoutSnapshot, routeMask: number): SimulatedRun => {
  const stock: AmmoStock = { ...STARTING_AMMO_STOCK };
  let suppliedRounds = 0;
  const specialChoices = routeMask.toString(2).replaceAll('0', '').length;
  for (let stageIndex = 0; stageIndex < ENCOUNTER_STAGES.length; stageIndex += 1) {
    const stage = ENCOUNTER_STAGES[stageIndex]!;
    const chooseSpecial = stage.special !== undefined && (routeMask & (1 << (stageIndex - 1))) !== 0;
    const route = chooseSpecial ? stage.special! : stage.normal;
    for (const enemyType of route.roster) {
      const result = simulateEnemyWithStock(plan, enemyType, loadout, stock);
      if (!result.won) {
        return { specialChoices, completed: false, roundsSpent: sumStock(STARTING_AMMO_STOCK) + suppliedRounds - sumStock(stock), remainingAmmo: sumStock(stock) };
      }
    }
    if (stageIndex < ENCOUNTER_STAGES.length - 1) {
      const supply = route.kind === 'special' ? SPECIAL_AMMO_SUPPLY : NORMAL_AMMO_SUPPLY;
      addSupply(stock, supply);
      suppliedRounds += sumStock(supply);
    }
  }
  return { specialChoices, completed: true, roundsSpent: sumStock(STARTING_AMMO_STOCK) + suppliedRounds - sumStock(stock), remainingAmmo: sumStock(stock) };
};

const rate = <T>(items: readonly T[], predicate: (item: T) => boolean): number => items.length ? items.filter(predicate).length / items.length : 0;
const average = <T>(items: readonly T[], value: (item: T) => number): number => items.length ? items.reduce((sum, item) => sum + value(item), 0) / items.length : 0;

export const runBalanceSimulation = (): BalanceReport => {
  const loadouts = createAllLoadouts();
  const enemyTypes = Object.keys(ENEMY_DEFINITIONS) as EnemyType[];
  const encounters = SIMULATION_PLANS.flatMap((plan) => enemyTypes.flatMap((enemyType) => loadouts.map((loadout) => simulateEncounter(plan, enemyType, loadout))));
  const routeRuns = SIMULATION_PLANS.flatMap((plan) => loadouts.flatMap((loadout) => Array.from({ length: 16 }, (_, routeMask) => simulateRun(plan, loadout, routeMask))));
  const topAppearances = new Map<AttachmentId, number>();
  let totalTopPerSlot = 0;
  for (const plan of SIMULATION_PLANS) {
    for (const enemyType of enemyTypes) {
      const scenario = encounters.filter((item) => item.plan.id === plan.id && item.enemyType === enemyType);
      const topCount = Math.max(1, Math.ceil(scenario.length * 0.1));
      const top = [...scenario].sort((a, b) => Number(b.won) - Number(a.won) || a.turns - b.turns || b.remainingAmmo - a.remainingAmmo || b.damage - a.damage).slice(0, topCount);
      totalTopPerSlot += top.length;
      for (const result of top) for (const id of Object.values(result.loadout)) topAppearances.set(id, (topAppearances.get(id) ?? 0) + 1);
    }
  }

  const attachmentMetrics = (Object.keys(ATTACHMENT_DEFINITIONS) as AttachmentId[]).map((id): AttachmentBalanceMetric => {
    const subset = encounters.filter((item) => Object.values(item.loadout).includes(id));
    const topBuildShare = (topAppearances.get(id) ?? 0) / Math.max(1, totalTopPerSlot);
    const classification: BalanceClassification = topBuildShare > 0.65 ? 'dominant' : topBuildShare < 0.04 ? 'dead' : topBuildShare < 0.14 ? 'niche' : 'healthy';
    return { id, name: ATTACHMENT_DEFINITIONS[id].name, slot: ATTACHMENT_DEFINITIONS[id].slot, winRate: rate(subset, (item) => item.won), averageDamage: average(subset, (item) => item.damage), topBuildShare, classification };
  });

  const shots = encounters.reduce((sum, item) => sum + item.shots, 0);
  const ammoUsage = emptyAmmoCounter();
  const statusTriggers = emptyStatusCounter();
  const rangeShots = emptyRangeCounter();
  const rangeDamage = emptyRangeCounter();
  for (const result of encounters) {
    for (const ammo of AMMO_ORDER) ammoUsage[ammo] += result.ammoUsed[ammo];
    for (const status of Object.keys(statusTriggers) as StatusType[]) statusTriggers[status] += result.statusTriggers[status];
    for (const range of Object.keys(rangeShots) as RangeBand[]) {
      rangeShots[range] += result.rangeShots[range];
      rangeDamage[range] += result.rangeDamage[range];
    }
  }
  const rangeMetrics = Object.fromEntries((Object.keys(rangeShots) as RangeBand[]).map((range) => [range, {
    shots: rangeShots[range], averageDamage: rangeShots[range] ? rangeDamage[range] / rangeShots[range] : 0,
  }])) as BalanceReport['rangeMetrics'];
  const routeMetrics = Array.from({ length: 5 }, (_, specialChoices): RouteBalanceMetric => {
    const subset = routeRuns.filter((run) => run.specialChoices === specialChoices);
    return {
      specialChoices,
      samples: subset.length,
      completionRate: rate(subset, (run) => run.completed),
      averageRoundsSpent: average(subset, (run) => run.roundsSpent),
      averageRemainingAmmo: average(subset, (run) => run.remainingAmmo),
    };
  });
  const familyWinRates = Object.fromEntries(SIMULATION_PLANS.map((plan) => [plan.family, rate(encounters.filter((item) => item.plan.family === plan.family), (item) => item.won)])) as Record<SimulationFamily, number>;
  const enemyWinRates = Object.fromEntries(enemyTypes.map((enemyType) => [enemyType, rate(encounters.filter((item) => item.enemyType === enemyType), (item) => item.won)])) as Record<EnemyType, number>;
  const normal = encounters.filter((item) => !ENEMY_DEFINITIONS[item.enemyType].special);
  const special = encounters.filter((item) => ENEMY_DEFINITIONS[item.enemyType].special);

  return {
    totalEncounters: encounters.length,
    loadoutCount: loadouts.length,
    normalWinRate: rate(normal, (item) => item.won),
    specialWinRate: rate(special, (item) => item.won),
    averageDamage: average(encounters, (item) => item.damage),
    averageRemainingAmmo: average(encounters, (item) => item.remainingAmmo),
    averageAccuracy: shots ? encounters.reduce((sum, item) => sum + item.averageAccuracy * item.shots, 0) / shots : 0,
    accuracyAbove100Rate: shots ? encounters.reduce((sum, item) => sum + item.accuracyAbove100, 0) / shots : 0,
    conservationRate: shots ? encounters.reduce((sum, item) => sum + item.conserved, 0) / shots : 0,
    armorDamage: encounters.reduce((sum, item) => sum + item.armorDamage, 0),
    penetrationDamage: encounters.reduce((sum, item) => sum + item.penetrationDamage, 0),
    staggerTriggers: encounters.reduce((sum, item) => sum + item.staggerTriggers, 0),
    intentDelays: encounters.reduce((sum, item) => sum + item.intentDelays, 0),
    statusTriggers, ammoUsage, rangeMetrics, familyWinRates, enemyWinRates, attachmentMetrics, routeMetrics,
  };
};

export const formatBalanceReport = (report: BalanceReport): string => JSON.stringify({
  encounters: report.totalEncounters,
  loadouts: report.loadoutCount,
  normalWinRate: Number(report.normalWinRate.toFixed(3)),
  specialWinRate: Number(report.specialWinRate.toFixed(3)),
  averageDamage: Number(report.averageDamage.toFixed(1)),
  averageRemainingAmmo: Number(report.averageRemainingAmmo.toFixed(1)),
  averageAccuracy: Number(report.averageAccuracy.toFixed(1)),
  accuracyAbove100Rate: Number(report.accuracyAbove100Rate.toFixed(3)),
  conservationRate: Number(report.conservationRate.toFixed(3)),
  armorDamage: report.armorDamage,
  penetrationDamage: report.penetrationDamage,
  staggerTriggers: report.staggerTriggers,
  intentDelays: report.intentDelays,
  familyWinRates: Object.fromEntries(Object.entries(report.familyWinRates).map(([key, value]) => [key, Number(value.toFixed(3))])),
  enemyWinRates: Object.fromEntries(Object.entries(report.enemyWinRates).map(([key, value]) => [key, Number(value.toFixed(3))])),
  statusTriggers: report.statusTriggers,
  ammoUsage: report.ammoUsage,
  rangeMetrics: Object.fromEntries(Object.entries(report.rangeMetrics).map(([key, value]) => [key, { shots: value.shots, averageDamage: Number(value.averageDamage.toFixed(1)) }])),
  routeMetrics: report.routeMetrics.map((item) => ({
    specialChoices: item.specialChoices, samples: item.samples, completionRate: Number(item.completionRate.toFixed(3)),
    averageRoundsSpent: Number(item.averageRoundsSpent.toFixed(1)), averageRemainingAmmo: Number(item.averageRemainingAmmo.toFixed(1)),
  })),
  attachments: report.attachmentMetrics.map((item) => ({ id: item.id, topShare: Number(item.topBuildShare.toFixed(3)), winRate: Number(item.winRate.toFixed(3)), classification: item.classification })),
}, null, 2);
