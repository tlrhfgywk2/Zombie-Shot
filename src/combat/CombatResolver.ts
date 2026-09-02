import { ATTACHMENT_DEFINITIONS, ATTACHMENT_SLOT_NAMES, ATTACHMENT_SLOT_ORDER, type AttachmentModifier, type LoadoutSnapshot, type ModifierCondition } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS, COMBAT_BALANCE, RANGE_NAMES } from '../data/ammoDefinitions';
import { getEnabledAttachmentIds, createPlayerCombatState } from './AttachmentLoadout';
import type { AmmoType, EnemyActionResult, EnemyState, PlayerCombatState, RangeBand, SequenceResult, ShotResult, StatusType } from './types';

export interface CombatContext {
  loadout?: LoadoutSnapshot;
  playerState?: PlayerCombatState;
}

interface ShotContext extends CombatContext {
  previousAmmo?: AmmoType;
  totalRounds?: number;
  rareConservationUsed?: boolean;
}

const cloneState = (state: EnemyState): EnemyState => ({
  ...state,
  intent: state.intent ? { ...state.intent } : undefined,
  statuses: { ...state.statuses, buildup: { ...state.statuses.buildup } },
});

const clonePlayerState = (state: PlayerCombatState): PlayerCombatState => ({ ...state, disabledSlots: { ...state.disabledSlots } });

const rarityRank = { common: 0, uncommon: 1, rare: 2, mythic: 3 } as const;
const rangeOrder: readonly RangeBand[] = ['near', 'mid', 'far'];

export const getRangeBand = (distance: number): RangeBand => {
  if (distance <= COMBAT_BALANCE.rangeThresholds.near) return 'near';
  if (distance <= COMBAT_BALANCE.rangeThresholds.mid) return 'mid';
  return 'far';
};

const getEffectiveRangeBand = (band: RangeBand, penaltySteps: number): RangeBand => rangeOrder[Math.min(rangeOrder.length - 1, rangeOrder.indexOf(band) + penaltySteps)] ?? 'far';

const conditionMatches = (
  condition: ModifierCondition | undefined,
  range: RangeBand,
  ammoType: AmmoType,
  index: number,
  previousAmmo: AmmoType | undefined,
  specialEnemy: boolean,
): boolean => {
  if (!condition) return true;
  const definition = AMMO_DEFINITIONS[ammoType];
  if (condition.range && condition.range !== range) return false;
  if (condition.ammoTag && !definition.tags.includes(condition.ammoTag)) return false;
  if (condition.firstShot !== undefined && condition.firstShot !== (index === 0)) return false;
  if (condition.afterAmmoSwitch !== undefined && condition.afterAmmoSwitch !== (previousAmmo !== undefined && previousAmmo !== ammoType)) return false;
  if (condition.specialEnemy !== undefined && condition.specialEnemy !== specialEnemy) return false;
  return true;
};

const tickPlayerEffects = (state: PlayerCombatState): PlayerCombatState => {
  const next = clonePlayerState(state);
  if (next.accuracyPenaltyTurns > 0) next.accuracyPenaltyTurns -= 1;
  if (next.accuracyPenaltyTurns === 0) next.accuracyPenalty = 0;
  if (next.rangePenaltyTurns > 0) next.rangePenaltyTurns -= 1;
  if (next.rangePenaltyTurns === 0) next.rangePenaltySteps = 0;
  for (const slot of ATTACHMENT_SLOT_ORDER) {
    const turns = next.disabledSlots[slot] ?? 0;
    if (turns <= 1) delete next.disabledSlots[slot];
    else next.disabledSlots[slot] = turns - 1;
  }
  return next;
};

export class CombatResolver {
  resolveShot(ammoType: AmmoType, index: number, enemyState: EnemyState, context: ShotContext = {}): ShotResult {
    const before = cloneState(enemyState);
    const after = cloneState(enemyState);
    const playerState = context.playerState ?? createPlayerCombatState();
    const definition = AMMO_DEFINITIONS[ammoType];
    const rangeBand = getRangeBand(before.distance);
    const effectiveRangeBand = getEffectiveRangeBand(rangeBand, playerState.rangePenaltySteps);
    const activeModifiers = getEnabledAttachmentIds(context.loadout ?? {}, playerState)
      .flatMap((id) => ATTACHMENT_DEFINITIONS[id].modifiers)
      .filter((modifier) => !('condition' in modifier) || conditionMatches(modifier.condition, rangeBand, ammoType, index, context.previousAmmo, before.special));

    const recoilStep = Math.max(0, COMBAT_BALANCE.recoilPerShot + definition.recoil + this.sumModifiers(activeModifiers, 'recoilStep'));
    const accuracy = Math.max(COMBAT_BALANCE.minimumAccuracy, COMBAT_BALANCE.baseAccuracy + playerState.accuracyPenalty + definition.accuracy + this.sumModifiers(activeModifiers, 'accuracy') - recoilStep * index);
    const attachmentMultiplier = Math.max(0.4, 1 + this.sumModifiers(activeModifiers, 'damageMultiplier'));
    let statusMultiplier = definition.specialEnemyMultiplier && before.special ? definition.specialEnemyMultiplier : 1;
    if (after.statuses.exposedShots > 0) {
      statusMultiplier *= COMBAT_BALANCE.exposedDamageMultiplier;
      after.statuses.exposedShots -= 1;
    }
    const isSpecialAmmo = rarityRank[definition.rarity] >= rarityRank.rare;
    if (isSpecialAmmo && after.statuses.corruptedShots > 0) {
      statusMultiplier *= COMBAT_BALANCE.corruptedSpecialMultiplier;
      after.statuses.corruptedShots -= 1;
    }

    const baseDamage = definition.armoredDirectDamage !== undefined && before.armor > 0 ? definition.armoredDirectDamage : definition.directDamage;
    const sonicMultiplier = Math.max(0.55, 1 - playerState.rangePenaltySteps * 0.12);
    const rangeMultiplier = COMBAT_BALANCE.handgunRangeMultiplier[effectiveRangeBand] * sonicMultiplier;
    const scaledDamage = Math.max(0, Math.round(baseDamage * (accuracy / 100) * rangeMultiplier * attachmentMultiplier * statusMultiplier));

    let armorDamage = 0;
    if (definition.armorShred > 0) {
      const shredded = Math.min(after.armor, definition.armorShred);
      after.armor -= shredded;
      armorDamage += shredded;
    }
    const blockableDamage = Math.max(0, scaledDamage - definition.penetration);
    const armorBlocked = Math.min(after.armor, blockableDamage);
    after.armor -= armorBlocked;
    armorDamage += armorBlocked;
    const hpDamage = Math.min(after.hp, scaledDamage - armorBlocked);
    after.hp -= hpDamage;

    let burnApplied = 0;
    let staggerApplied = 0;
    let statusTriggered: StatusType | undefined;
    const buildupMultiplier = Math.max(0.25, 1 + this.sumModifiers(activeModifiers, 'buildupMultiplier'));
    if (after.hp > 0 && definition.buildup) {
      const buildup = definition.buildup;
      after.statuses.buildup[buildup.type] += Math.round(buildup.amount * buildupMultiplier);
      if (after.statuses.buildup[buildup.type] >= COMBAT_BALANCE.statusThreshold) {
        after.statuses.buildup[buildup.type] -= COMBAT_BALANCE.statusThreshold;
        statusTriggered = buildup.type;
        if (buildup.type === 'burn') {
          burnApplied = Math.max(0, COMBAT_BALANCE.burnTurnsApplied - after.statuses.burnTurns);
          after.statuses.burnTurns = Math.max(after.statuses.burnTurns, COMBAT_BALANCE.burnTurnsApplied);
        } else if (buildup.type === 'chill') after.statuses.slowTurns = Math.max(after.statuses.slowTurns, COMBAT_BALANCE.slowTurnsApplied);
        else if (buildup.type === 'shock') after.statuses.shockTurns = Math.max(after.statuses.shockTurns, 1);
        else after.statuses.corruptedShots = Math.max(after.statuses.corruptedShots, 2);
      }
    }

    const impactApplied = Math.max(0, definition.impact + this.sumModifiers(activeModifiers, 'impact'));
    if (after.hp > 0) {
      after.statuses.impact += impactApplied;
      if (after.statuses.impact >= after.staggerThreshold) {
        after.statuses.impact -= after.staggerThreshold;
        staggerApplied = COMBAT_BALANCE.staggerTurnsApplied;
        after.statuses.staggerTurns = Math.max(after.statuses.staggerTurns, staggerApplied);
        after.statuses.exposedShots = Math.max(after.statuses.exposedShots, 1);
      }
    }

    const preservation = activeModifiers.find((modifier): modifier is Extract<AttachmentModifier, { kind: 'preserveFirstRare' }> => modifier.kind === 'preserveFirstRare');
    const conserved = Boolean(
      (definition.recoverOnKill && after.hp <= 0)
      || (preservation && !context.rareConservationUsed && isSpecialAmmo && accuracy >= preservation.minimumAccuracy),
    );
    const parts = [`${definition.name} 명중`, `정확도 ${Math.round(accuracy)}%`, `${RANGE_NAMES[effectiveRangeBand]} ×${rangeMultiplier.toFixed(2)}`];
    if (definition.armorShred && armorDamage) parts.push(`장갑 ${armorDamage} 파괴`);
    if (statusTriggered) parts.push(`${this.statusName(statusTriggered)} 발동`);
    if (staggerApplied) parts.push('충격 임계 · 의도/이동 지연');
    if (conserved) parts.push('탄환 보존');

    return {
      ammoType, index, damage: hpDamage + armorDamage, hpDamage, armorDamage, burnApplied, staggerApplied, impactApplied,
      statusTriggered, vulnerabilityMultiplier: statusMultiplier, conserved, killed: after.hp <= 0, description: parts.join(' · '),
      breakdown: { baseDamage, accuracy, rangeBand, effectiveRangeBand, rangeMultiplier, attachmentMultiplier, statusMultiplier, armorBlocked, penetration: definition.penetration, finalDamage: hpDamage },
      before, after,
    };
  }

  resolveSequence(rounds: readonly AmmoType[], enemyState: EnemyState, context: CombatContext = {}): SequenceResult {
    let current = cloneState(enemyState);
    const shots: ShotResult[] = [];
    let rareConservationUsed = false;
    for (let index = 0; index < rounds.length; index += 1) {
      const ammo = rounds[index];
      if (!ammo || current.hp <= 0) break;
      const shot = this.resolveShot(ammo, index, current, { ...context, previousAmmo: rounds[index - 1], totalRounds: rounds.length, rareConservationUsed });
      shots.push(shot);
      current = cloneState(shot.after);
      if (shot.conserved && rarityRank[AMMO_DEFINITIONS[ammo].rarity] >= rarityRank.rare) rareConservationUsed = true;
    }
    const conservedRounds = shots.filter((shot) => shot.conserved).map((shot) => shot.ammoType);
    const unfiredRounds = rounds.slice(shots.length);
    return {
      shots, finalState: current,
      totalHpDamage: shots.reduce((sum, shot) => sum + shot.hpDamage, 0),
      totalArmorDamage: shots.reduce((sum, shot) => sum + shot.armorDamage, 0),
      averageAccuracy: shots.length ? shots.reduce((sum, shot) => sum + shot.breakdown.accuracy, 0) / shots.length : 0,
      conservedRounds, unfiredRounds: [...unfiredRounds], returnedRounds: [...conservedRounds, ...unfiredRounds], killed: current.hp <= 0,
    };
  }

  resolveEnemyAction(enemyState: EnemyState, playerState: PlayerCombatState = createPlayerCombatState(), loadout: LoadoutSnapshot = {}): EnemyActionResult {
    const before = cloneState(enemyState);
    const after = cloneState(enemyState);
    const playerBefore = clonePlayerState(playerState);
    const playerAfter = tickPlayerEffects(playerState);
    let burnDamage = 0;
    if (after.statuses.burnTurns > 0) {
      burnDamage = Math.min(after.hp, COMBAT_BALANCE.burnDamagePerTurn);
      after.hp -= burnDamage;
      after.statuses.burnTurns -= 1;
    }
    const killedByBurn = after.hp <= 0;
    const staggerConsumed = after.statuses.staggerTurns > 0;
    const intentDue = Boolean(after.intent && after.intent.countdown <= 1);
    const intentDelayed = Boolean(intentDue && (staggerConsumed || after.statuses.shockTurns > 0));
    let intentResolved: EnemyActionResult['intentResolved'];
    let intentDetail: string | undefined;

    if (!killedByBurn && after.intent) {
      if (intentDelayed) {
        after.intent.countdown = 1;
        intentDetail = `${after.intent.name}이 충격/전하로 지연되었습니다.`;
        if (after.statuses.shockTurns > 0) after.statuses.shockTurns -= 1;
      } else if (intentDue) {
        intentResolved = after.intent.type;
        after.intent.countdown = after.intent.cooldown;
        intentDetail = this.applyIntent(after.intent.type, after, playerAfter, loadout);
      } else after.intent.countdown -= 1;
    }

    let movement = 0;
    if (!killedByBurn) {
      const staggerMultiplier = staggerConsumed ? COMBAT_BALANCE.staggerMovementMultiplier : 1;
      const slowMultiplier = after.statuses.slowTurns > 0 ? COMBAT_BALANCE.slowMovementMultiplier : 1;
      const actionMultiplier = intentResolved ? 0.65 : 1;
      movement = Number((after.advancePerTurn * staggerMultiplier * slowMultiplier * actionMultiplier).toFixed(2));
      after.distance = Math.max(0, Number((after.distance - movement).toFixed(2)));
    }
    if (staggerConsumed) after.statuses.staggerTurns -= 1;
    if (after.statuses.slowTurns > 0) after.statuses.slowTurns -= 1;
    after.statuses.exposedShots = 0;
    after.turnsElapsed += 1;

    return { before, after, playerBefore, playerAfter, burnDamage, movement, staggerConsumed, intentResolved, intentDelayed, intentDetail, killedByBurn };
  }

  private applyIntent(type: NonNullable<EnemyState['intent']>['type'], enemy: EnemyState, player: PlayerCombatState, loadout: LoadoutSnapshot): string {
    if (type === 'groundShock') {
      player.accuracyPenalty = -22;
      player.accuracyPenaltyTurns = 2;
      return '지반 충격: 정확도 -22%가 2턴 적용됩니다.';
    }
    if (type === 'sonicPulse') {
      player.rangePenaltySteps = 1;
      player.rangePenaltyTurns = 2;
      return '초음파 공명: 유효 거리와 거리 피해가 2턴 감소합니다.';
    }
    const equippedSlots = ATTACHMENT_SLOT_ORDER.filter((slot) => loadout[slot]);
    const slot = equippedSlots[enemy.turnsElapsed % Math.max(1, equippedSlots.length)];
    if (!slot) return '오염 투척: 봉쇄할 장착물이 없습니다.';
    player.disabledSlots[slot] = 2;
    return `오염 투척: ${ATTACHMENT_SLOT_NAMES[slot]} 슬롯이 2턴 봉쇄됩니다.`;
  }

  private sumModifiers(modifiers: readonly AttachmentModifier[], kind: 'accuracy' | 'recoilStep' | 'damageMultiplier' | 'buildupMultiplier' | 'impact'): number {
    return modifiers.filter((modifier): modifier is Extract<AttachmentModifier, { kind: typeof kind }> => modifier.kind === kind).reduce((sum, modifier) => sum + modifier.value, 0);
  }

  private statusName(type: StatusType): string {
    return { burn: '화상', chill: '빙결 둔화', shock: '전하 교란', corruption: '침식 표식' }[type];
  }
}
