import { CombatResolver } from '../combat/CombatResolver';
import type { AmmoType, EnemyType, RangeBand } from '../combat/types';
import { AMMO_DEFINITIONS, AMMO_ORDER } from '../data/ammoDefinitions';
import type { LoadoutSnapshot } from '../data/attachmentDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';

const resolver = new CombatResolver();
const bands: readonly { band: RangeBand; distance: number }[] = [
  { band: 'near', distance: 3 }, { band: 'mid', distance: 7 }, { band: 'far', distance: 11 },
];

export const SEQUENCE_AUDIT_CONFIGURATIONS: readonly { name: string; rounds: readonly AmmoType[]; loadout?: LoadoutSnapshot }[] = [
  { name: '안정탄 4발', rounds: ['subsonic', 'subsonic', 'subsonic', 'subsonic'] },
  { name: '표준탄 4발', rounds: ['standard', 'standard', 'standard', 'standard'] },
  { name: '표준탄 6발', rounds: ['standard', 'standard', 'standard', 'standard', 'standard', 'standard'] },
  { name: '고압 4발', rounds: ['overpressure', 'overpressure', 'overpressure', 'overpressure'] },
  { name: '고압 연출 감소 4발', rounds: ['overpressure', 'overpressure', 'overpressure', 'overpressure'], loadout: { muzzle: 'dualPortCompensator', grip: 'g10Grip' } },
  { name: '고압 6발', rounds: ['overpressure', 'overpressure', 'overpressure', 'overpressure', 'overpressure', 'overpressure'] },
];

const durableEnemy = (type: EnemyType) => ({ ...createEnemyState(type), hp: 10000, maxHp: 10000 });

const turnsToContact = (type: EnemyType, rounds?: readonly AmmoType[], loadout: LoadoutSnapshot = {}): number => {
  let enemy = durableEnemy(type);
  let turns = 0;
  while (enemy.distance > 0 && turns < 20) {
    if (rounds) enemy = resolver.resolveSequence(rounds, enemy, { loadout }).finalState;
    if (enemy.distance > 0) enemy = resolver.resolveEnemyAction(enemy).after;
    turns += 1;
  }
  return turns;
};

export function runSequenceAudit() {
  const movement = SEQUENCE_AUDIT_CONFIGURATIONS.flatMap(configuration => (['normal', 'armored', 'tough'] as const).map(type => {
    const enemy = durableEnemy(type);
    const sequence = resolver.resolveSequence(configuration.rounds, enemy, { loadout: configuration.loadout });
    const action = resolver.resolveEnemyAction(sequence.finalState);
    return {
      configuration: configuration.name,
      enemy: type,
      normalMovement: enemy.advancePerTurn,
      movementPerCycle: Number(((action?.movement ?? 0)).toFixed(2)),
      distanceAfterMagazine: sequence.finalState.distance,
      baselineTurnsToContact: turnsToContact(type),
      effectiveTurnsToContact: turnsToContact(type, configuration.rounds, configuration.loadout),
    };
  }));

  const damage = AMMO_ORDER.flatMap(ammo => bands.map(({ band, distance }) => {
    const sequence = resolver.resolveSequence([ammo], { ...durableEnemy('tough'), armor: 0, maxArmor: 0, distance });
    const shot = sequence.shots[0]!;
    return {
      ammo,
      name: AMMO_DEFINITIONS[ammo].name,
      band,
      effectiveFirepower: shot.breakdown.effectiveFirepower,
      penaltyPercent: sequence.finalRangePenaltyPercent,
      finalVolleyFirepower: sequence.finalVolleyFirepower,
    };
  }));

  const rounding = [10, 25].flatMap(penaltyPercent => Array.from({ length: 7 }, (_, index) => index + 2).map(firepower => {
    const beforeRounding = firepower * (1 - penaltyPercent / 100);
    return {
      firepower, penaltyPercent, beforeRounding: Number(beforeRounding.toFixed(2)),
      floor: Math.floor(beforeRounding), ceiling: Math.ceil(beforeRounding), nearest: Math.floor(beforeRounding + 0.5 + Number.EPSILON),
    };
  }));

  return { movement, damage, rounding };
}

export const formatSequenceAudit = (audit: ReturnType<typeof runSequenceAudit>): string => JSON.stringify(audit, null, 2);
