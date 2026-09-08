import { CombatResolver } from '../combat/CombatResolver';
import type { AmmoType, EnemyType, RangeBand } from '../combat/types';
import { AMMO_DEFINITIONS, AMMO_ORDER } from '../data/ammoDefinitions';
import type { LoadoutSnapshot } from '../data/attachmentDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';

const resolver = new CombatResolver();
const bands: readonly { band: RangeBand; distance: number }[] = [
  { band: 'near', distance: 3 }, { band: 'mid', distance: 7 }, { band: 'far', distance: 11 },
];

export const RECOIL_AUDIT_CONFIGURATIONS: readonly { name: string; rounds: readonly AmmoType[]; loadout?: LoadoutSnapshot }[] = [
  { name: '저반동 4발', rounds: ['subsonic', 'subsonic', 'subsonic', 'subsonic'] },
  { name: '표준탄 4발', rounds: ['standard', 'standard', 'standard', 'standard'] },
  { name: '표준탄 6발', rounds: ['standard', 'standard', 'standard', 'standard', 'standard', 'standard'] },
  { name: '고반동 4발', rounds: ['overpressure', 'overpressure', 'overpressure', 'overpressure'] },
  { name: '고반동 제어 4발', rounds: ['overpressure', 'overpressure', 'overpressure', 'overpressure'], loadout: { muzzle: 'dualPortCompensator', grip: 'g10Grip' } },
  { name: '고반동 6발', rounds: ['overpressure', 'overpressure', 'overpressure', 'overpressure', 'overpressure', 'overpressure'] },
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

export function runRecoilDistanceAudit() {
  const movement = RECOIL_AUDIT_CONFIGURATIONS.flatMap(configuration => (['normal', 'armored', 'tough'] as const).map(type => {
    const enemy = durableEnemy(type);
    const sequence = resolver.resolveSequence(configuration.rounds, enemy, { loadout: configuration.loadout });
    const action = sequence.breached ? undefined : resolver.resolveEnemyAction(sequence.finalState);
    return {
      configuration: configuration.name,
      enemy: type,
      normalMovement: enemy.advancePerTurn,
      recoilMovement: sequence.totalRecoilMovement,
      movementPerCycle: Number((sequence.totalRecoilMovement + (action?.movement ?? 0)).toFixed(2)),
      distanceAfterMagazine: sequence.finalState.distance,
      baselineTurnsToContact: turnsToContact(type),
      effectiveTurnsToContact: turnsToContact(type, configuration.rounds, configuration.loadout),
    };
  }));

  const damage = AMMO_ORDER.flatMap(ammo => bands.map(({ band, distance }) => {
    const shot = resolver.resolveShot(ammo, 0, { ...durableEnemy('tough'), armor: 0, maxArmor: 0, distance });
    return {
      ammo,
      name: AMMO_DEFINITIONS[ammo].name,
      band,
      directFirepower: shot.breakdown.directFirepower,
      penaltyPercent: shot.breakdown.rangePenaltyPercent,
      beforeRounding: shot.breakdown.distanceAdjustedFirepower,
      finalFirepower: shot.breakdown.finalFirepower,
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

export const formatRecoilDistanceAudit = (audit: ReturnType<typeof runRecoilDistanceAudit>): string => JSON.stringify(audit, null, 2);
