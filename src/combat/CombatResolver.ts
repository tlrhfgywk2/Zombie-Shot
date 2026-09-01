import { AMMO_DEFINITIONS, COMBAT_BALANCE } from '../data/ammoDefinitions';
import type { AmmoType, EnemyActionResult, EnemyState, SequenceResult, ShotResult } from './types';

const cloneState = (state: EnemyState): EnemyState => ({ ...state, statuses: { ...state.statuses } });

export class CombatResolver {
  resolveShot(ammoType: AmmoType, index: number, enemyState: EnemyState): ShotResult {
    const before = cloneState(enemyState);
    const after = cloneState(enemyState);
    const definition = AMMO_DEFINITIONS[ammoType];
    const vulnerabilityMultiplier = after.statuses.exposedShots > 0 ? COMBAT_BALANCE.exposedDamageMultiplier : 1;
    if (after.statuses.exposedShots > 0) after.statuses.exposedShots -= 1;

    let directDamage = definition.directDamage;
    if (ammoType === 'hollowPoint' && before.armor > 0) directDamage = COMBAT_BALANCE.hollowPointArmoredDamage;

    let armorDamage = 0;
    if (ammoType === 'armorPiercing') {
      const shredded = Math.min(after.armor, COMBAT_BALANCE.armorPiercingArmorDamage);
      after.armor -= shredded;
      armorDamage += shredded;
    }

    const scaledDamage = Math.round(directDamage * vulnerabilityMultiplier);
    const absorbed = Math.min(after.armor, scaledDamage);
    after.armor -= absorbed;
    armorDamage += absorbed;
    const hpDamage = Math.min(after.hp, scaledDamage - absorbed);
    after.hp -= hpDamage;

    let burnApplied = 0;
    let staggerApplied = 0;
    if (after.hp > 0 && ammoType === 'incendiary') {
      burnApplied = Math.max(0, COMBAT_BALANCE.burnTurnsApplied - after.statuses.burnTurns);
      after.statuses.burnTurns = Math.max(after.statuses.burnTurns, COMBAT_BALANCE.burnTurnsApplied);
    }
    if (after.hp > 0 && ammoType === 'stagger') {
      staggerApplied = COMBAT_BALANCE.staggerTurnsApplied;
      after.statuses.staggerTurns = Math.max(after.statuses.staggerTurns, staggerApplied);
      after.statuses.exposedShots = 1;
    }

    const descriptionParts = [`${definition.name} 명중`];
    if (ammoType === 'armorPiercing' && armorDamage > 0) descriptionParts.push(`방어 ${armorDamage} 파괴`);
    if (ammoType === 'hollowPoint') descriptionParts.push(before.armor === 0 ? '노출 확장' : '장갑에 감쇠');
    if (vulnerabilityMultiplier > 1) descriptionParts.push(`노출 ×${vulnerabilityMultiplier.toFixed(1)}`);
    if (burnApplied > 0) descriptionParts.push(`화상 ${burnApplied}턴`);
    if (staggerApplied > 0) descriptionParts.push('이동 억제 · 다음 탄 노출');

    return {
      ammoType,
      index,
      damage: hpDamage + armorDamage,
      hpDamage,
      armorDamage,
      burnApplied,
      staggerApplied,
      vulnerabilityMultiplier,
      killed: after.hp <= 0,
      description: descriptionParts.join(' · '),
      before,
      after,
    };
  }

  resolveSequence(rounds: readonly AmmoType[], enemyState: EnemyState): SequenceResult {
    let current = cloneState(enemyState);
    const shots: ShotResult[] = [];
    for (let index = 0; index < rounds.length; index += 1) {
      const ammo = rounds[index];
      if (!ammo || current.hp <= 0) break;
      const shot = this.resolveShot(ammo, index, current);
      shots.push(shot);
      current = cloneState(shot.after);
    }
    return {
      shots,
      finalState: current,
      totalHpDamage: shots.reduce((sum, shot) => sum + shot.hpDamage, 0),
      totalArmorDamage: shots.reduce((sum, shot) => sum + shot.armorDamage, 0),
      killed: current.hp <= 0,
    };
  }

  resolveEnemyAction(enemyState: EnemyState): EnemyActionResult {
    const before = cloneState(enemyState);
    const after = cloneState(enemyState);
    let burnDamage = 0;
    if (after.statuses.burnTurns > 0) {
      burnDamage = Math.min(after.hp, COMBAT_BALANCE.burnDamagePerTurn);
      after.hp -= burnDamage;
      after.statuses.burnTurns -= 1;
    }

    const killedByBurn = after.hp <= 0;
    const staggerConsumed = after.statuses.staggerTurns > 0;
    let movement = 0;
    if (!killedByBurn) {
      const multiplier = staggerConsumed ? COMBAT_BALANCE.staggerMovementMultiplier : 1;
      movement = Number((after.advancePerTurn * multiplier).toFixed(2));
      after.distance = Math.max(0, Number((after.distance - movement).toFixed(2)));
    }
    if (staggerConsumed) after.statuses.staggerTurns -= 1;
    after.statuses.exposedShots = 0;

    return { before, after, burnDamage, movement, staggerConsumed, killedByBurn };
  }
}
