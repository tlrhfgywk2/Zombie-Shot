import { AMMO_DEFINITIONS, COMBAT_BALANCE } from '../data/ammoDefinitions';
import type { AmmoType, CombatContext, ShotResult } from './types';

export class CombatResolver {
  createContext(): CombatContext {
    return { nextDamageMultiplier: 1 };
  }

  resolveShot(ammoType: AmmoType, index: number, distance: number, context: CombatContext): ShotResult {
    const definition = AMMO_DEFINITIONS[ammoType];
    let baseDamage = definition.directDamage;
    let description = `${definition.name} 명중`;
    let burnApplied = 0;

    if (ammoType === 'fragmenting' && distance > COMBAT_BALANCE.fragmentingCloseDistance) {
      baseDamage = COMBAT_BALANCE.fragmentingFarDamage;
      description = '파편탄 원거리 감쇠';
    } else if (ammoType === 'fragmenting') {
      description = '파편탄 근거리 폭발';
    }

    if (ammoType === 'incendiary') {
      burnApplied = COMBAT_BALANCE.burnTicks;
      description = '소이탄 화상 부여';
    }

    const multiplier = context.nextDamageMultiplier;
    const damage = Math.round(baseDamage * multiplier);
    const bonusDamage = damage - baseDamage;
    context.nextDamageMultiplier = ammoType === 'tracer' ? COMBAT_BALANCE.tracerNextMultiplier : 1;

    if (bonusDamage > 0) description += ` · 예광 증폭 +${bonusDamage}`;

    return { ammoType, index, damage, bonusDamage, burnApplied, description };
  }

  resolveSequence(rounds: readonly AmmoType[], distance: number): ShotResult[] {
    const context = this.createContext();
    return rounds.map((ammo, index) => this.resolveShot(ammo, index, distance, context));
  }
}
