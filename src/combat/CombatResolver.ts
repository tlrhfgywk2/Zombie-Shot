import { ATTACHMENT_DEFINITIONS, ATTACHMENT_SLOT_NAMES, ATTACHMENT_SLOT_ORDER, SERVICE_45, type AttachmentModifier, type LoadoutSnapshot, type ModifierCondition } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS, COMBAT_BALANCE, RANGE_NAMES } from '../data/ammoDefinitions';
import { getEnabledAttachmentIds, createPlayerCombatState } from './AttachmentLoadout';
import type { AmmoType, EnemyActionType, EnemyActionResult, EnemyState, PlayerCombatState, RangeBand, SequenceResult, ShotResult, StatusType } from './types';

export interface CombatContext {
  loadout?: LoadoutSnapshot;
  playerState?: PlayerCombatState;
  /** 현재 동시 활성 표적. 생략하면 단일 표적 전투이다. */
  targets?: readonly EnemyState[];
}

interface ShotContext extends CombatContext {
  pendingHeavyKick?: boolean;
  pendingShockSaturation?: boolean;
}

export interface FirepowerInputs {
  weaponFirepower: number;
  ammoFirepower: number;
  attachmentFirepower: number;
  statusFirepowerBonus: number;
  specialFirepowerBonus: number;
  rangePenaltyPercent: number;
}

/** 양의 화력은 최근접 정수로 반올림하며 정확히 .5면 올린다. */
export const roundPositiveFirepower = (value: number): number => {
  if (!Number.isFinite(value) || value < 0) throw new Error('반올림할 화력은 0 이상의 유한한 값이어야 합니다.');
  return Math.floor(value + 0.5 + Number.EPSILON);
};

export const calculateDirectFirepower = (inputs: Omit<FirepowerInputs, 'rangePenaltyPercent'>): number => {
  if (!Object.values(inputs).every(Number.isInteger)) throw new Error('직접 화력 항에는 정수만 사용할 수 있습니다.');
  return inputs.weaponFirepower + inputs.ammoFirepower + inputs.attachmentFirepower
    + inputs.statusFirepowerBonus + inputs.specialFirepowerBonus;
};

/** 직접 화력을 합산한 뒤 거리 손실을 한 번 적용하고 전역 반올림 규칙으로 정수화한다. */
export const calculateFinalFirepower = (inputs: FirepowerInputs, minimum = COMBAT_BALANCE.minimumFirepower): number => {
  if (!Number.isInteger(inputs.rangePenaltyPercent) || inputs.rangePenaltyPercent < 0 || inputs.rangePenaltyPercent > 100) throw new Error('거리 화력 손실은 0~100의 정수 퍼센트여야 합니다.');
  if (!Number.isInteger(minimum)) throw new Error('최소 화력은 정수여야 합니다.');
  const directFirepower = calculateDirectFirepower(inputs);
  const distanceAdjusted = Math.max(0, directFirepower * (1 - inputs.rangePenaltyPercent / 100));
  return Math.max(minimum, roundPositiveFirepower(distanceAdjusted));
};

export const ACTION_SHOCK_THRESHOLDS: Record<EnemyActionType, number> = {
  approach: 4, attack: 8, contaminate: 6, groundShock: 7, sonicPulse: 6,
};
export const ACTION_NAMES: Record<EnemyActionType, string> = {
  approach: '접근', attack: '치명 공격', contaminate: '오염 투척', groundShock: '지반 충격', sonicPulse: '초음파 공명',
};
export const selectEnemyAction = (enemy: EnemyState): EnemyActionType =>
  enemy.distance <= 0 ? 'attack' : enemy.intent && enemy.intent.countdown <= 1 ? enemy.intent.type : 'approach';
export const getActionShockThreshold = (enemy: EnemyState, action = selectEnemyAction(enemy)): number =>
  Math.max(1, ACTION_SHOCK_THRESHOLDS[action] + enemy.shockResistance);

/** 탄별 최종 거리 손실을 직접 화력으로 가중해 발사 순서 전체의 실효 감소율을 구한다. */
export const calculateEffectiveRangePenaltyPercent = (shots: readonly ShotResult[]): number => {
  const directFirepower = shots.reduce((sum, shot) => sum + shot.breakdown.directFirepower, 0);
  if (directFirepower <= 0) return 0;
  const distanceAdjustedFirepower = shots.reduce((sum, shot) => sum + shot.breakdown.distanceAdjustedFirepower, 0);
  return Number((Math.max(0, 1 - distanceAdjustedFirepower / directFirepower) * 100).toFixed(1));
};

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

export const formatRangePenalty = (penaltyPercent: number): string => penaltyPercent === 0 ? '피해 감소 없음' : `화력 -${penaltyPercent}%`;

export const getEffectiveRangeBand = (band: RangeBand, penaltySteps: number): RangeBand => rangeOrder[Math.min(rangeOrder.length - 1, rangeOrder.indexOf(band) + penaltySteps)] ?? 'far';

export const isNearestValidTarget = (target: EnemyState, targets: readonly EnemyState[] = [target]): boolean =>
  target.hp > 0 && target.distance >= 0 && !targets.some(other => other.hp > 0 && other.distance >= 0 && other.distance < target.distance);

const conditionMatches = (condition: ModifierCondition | undefined, range: RangeBand, nearest: boolean): boolean =>
  !condition || ((!condition.range || condition.range === range) && (condition.nearestTarget === undefined || condition.nearestTarget === nearest));

/** 장착물의 흔들림 감소는 연출 전용이며 전투 결과를 변경하지 않는다. */
export const getVisualKickScale = (enemy: EnemyState, context: CombatContext = {}): number => {
  const player = context.playerState ?? createPlayerCombatState();
  const range = getEffectiveRangeBand(getRangeBand(enemy.distance), player.rangePenaltySteps);
  return getEnabledAttachmentIds(context.loadout ?? {}, player)
    .flatMap(id => ATTACHMENT_DEFINITIONS[id].modifiers)
    .filter(modifier => modifier.kind === 'visualKickReductionPercent'
      && conditionMatches(modifier.condition, range, isNearestValidTarget(enemy, context.targets)))
    .reduce((scale, modifier) => scale * (1 - modifier.value / 100), 1);
};

const tickPlayerEffects = (state: PlayerCombatState): PlayerCombatState => {
  const next = clonePlayerState(state);
  if (next.heavyKickPenaltyTurns > 0) next.heavyKickPenaltyTurns -= 1;
  if (next.heavyKickPenaltyTurns === 0) next.heavyKickPenaltyBonus = 0;
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
      .filter((modifier) => !('condition' in modifier) || conditionMatches(modifier.condition, effectiveRangeBand, isNearestValidTarget(before, context.targets)));

    const stabilized = Boolean(context.pendingHeavyKick && definition.sequenceTrait === 'stable');
    const heavyKickPenalty = context.pendingHeavyKick && !stabilized
      ? COMBAT_BALANCE.heavyKickPenalty + playerState.heavyKickPenaltyBonus : 0;
    const shockSaturationPenalty = context.pendingShockSaturation
      ? Math.min(definition.actionShock, COMBAT_BALANCE.shockSaturationPenalty) : 0;
    const projectedShock = definition.actionShock - shockSaturationPenalty;
    const attachmentFirepower = this.sumModifiers(activeModifiers, 'firepower');
    const specialFirepowerBonus = before.special ? definition.specialEnemyFirepowerBonus ?? 0 : 0;
    let statusFirepowerBonus = 0;
    const isSpecialAmmo = rarityRank[definition.rarity] >= rarityRank.rare;
    if (isSpecialAmmo && after.statuses.corruptedShots > 0) {
      statusFirepowerBonus += COMBAT_BALANCE.corruptedSpecialFirepowerBonus;
      after.statuses.corruptedShots -= 1;
    }

    const rangePenaltyReduction = this.sumModifiers(activeModifiers, 'rangePenaltyReductionPercent') + (heavyKickPenalty > 0 ? 0 : definition.rangePenaltyReduction ?? 0);
    const rangePenaltyPercent = Math.max(0, SERVICE_45.rangePenaltyPercentages[effectiveRangeBand] - rangePenaltyReduction);
    const firepowerInputs: FirepowerInputs = {
      weaponFirepower: SERVICE_45.baseFirepower,
      ammoFirepower: Math.max(0, definition.firepower + (before.armor === 0 ? definition.unarmoredFirepowerModifier ?? 0 : 0) - heavyKickPenalty),
      attachmentFirepower,
      statusFirepowerBonus,
      specialFirepowerBonus,
      rangePenaltyPercent,
    };
    const directFirepower = calculateDirectFirepower(firepowerInputs);
    const distanceAdjustedFirepower = Number((directFirepower * (1 - rangePenaltyPercent / 100)).toFixed(4));
    const finalFirepower = calculateFinalFirepower(firepowerInputs);

    const armorBroken = Math.min(after.armor, definition.armorBreak);
    after.armor -= armorBroken;
    const armorBlocked = Math.min(after.armor, finalFirepower);
    // 방어 파괴 탄은 고유 파괴량과 피해 흡수를 같은 한 발에서 중복 차감하지 않는다.
    const armorConsumedByAbsorption = definition.armorBreak > 0 ? 0 : armorBlocked;
    after.armor -= armorConsumedByAbsorption;
    const armorDamage = armorBroken + armorConsumedByAbsorption;
    const hpDamage = Math.min(after.hp, finalFirepower - armorBlocked);
    after.hp -= hpDamage;

    let burnApplied = 0;
    let statusTriggered: StatusType | undefined;
    if (after.hp > 0 && definition.buildup) {
      const buildup = definition.buildup;
      after.statuses.buildup[buildup.type] += buildup.amount;
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

    const actionShockApplied = after.hp > 0 ? projectedShock : 0;
    after.actionShock += actionShockApplied;
    const conserved = Boolean(definition.recoverOnKill && after.hp <= 0);
    const parts = [`${definition.name} 명중`, `${RANGE_NAMES[effectiveRangeBand]} ${formatRangePenalty(rangePenaltyPercent)}`, `최종 화력 ${finalFirepower}`];
    if (armorBroken) parts.push(`방어 파괴 ${armorBroken}`);
    if (armorBlocked) parts.push(`방어 흡수 ${armorBlocked}`);
    if (statusTriggered) parts.push(`${this.statusName(statusTriggered)} 발동`);
    if (conserved) parts.push('탄환 보존');

    return {
      ammoType, index, damage: hpDamage + armorDamage, hpDamage, armorDamage, burnApplied, actionShockApplied,
      statusTriggered, conserved, killed: after.hp <= 0, description: parts.join(' · '),
      breakdown: { ...firepowerInputs, directFirepower, distanceAdjustedFirepower, rangeBand, effectiveRangeBand, armorBlocked, armorBroken, heavyKickPenalty, stabilized, shockSaturationPenalty, projectedShock, finalFirepower, finalDamage: hpDamage },
      before, after,
    };
  }

  resolveSequence(rounds: readonly AmmoType[], enemyState: EnemyState, context: CombatContext = {}): SequenceResult {
    let current = cloneState(enemyState);
    const shots: ShotResult[] = [];
    let pendingHeavyKick = false;
    let pendingShockSaturation = false;
    for (let index = 0; index < rounds.length; index += 1) {
      const ammo = rounds[index];
      if (!ammo || current.hp <= 0) break;
      const shot = this.resolveShot(ammo, index, current, { ...context, pendingHeavyKick, pendingShockSaturation });
      shots.push(shot);
      pendingHeavyKick = AMMO_DEFINITIONS[ammo].sequenceTrait === 'heavyKick';
      pendingShockSaturation = AMMO_DEFINITIONS[ammo].sequenceTrait === 'shockSaturation';
      current = cloneState(shot.after);
    }
    const conservedRounds = shots.filter((shot) => shot.conserved).map((shot) => shot.ammoType);
    const unfiredRounds = rounds.slice(shots.length);
    return {
      shots, finalState: current,
      totalHpDamage: shots.reduce((sum, shot) => sum + shot.hpDamage, 0),
      totalArmorDamage: shots.reduce((sum, shot) => sum + shot.armorDamage, 0),
      totalActionShockApplied: shots.reduce((sum, shot) => sum + shot.actionShockApplied, 0),
      effectiveRangePenaltyPercent: calculateEffectiveRangePenaltyPercent(shots),
      conservedRounds, unfiredRounds: [...unfiredRounds], returnedRounds: [...conservedRounds, ...unfiredRounds], killed: current.hp <= 0,
    };
  }

  /** 적의 현재 체력이나 돌파 여부와 무관하게 탄창 전체가 명중했을 때의 체력 피해를 계산한다. */
  resolveFullMagazineDamage(rounds: readonly AmmoType[], enemyState: EnemyState, context: CombatContext = {}): number {
    return this.resolveSequence(rounds, { ...enemyState, hp: Number.MAX_SAFE_INTEGER, maxHp: Number.MAX_SAFE_INTEGER }, context).totalHpDamage;
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
    const selectedAction = selectEnemyAction(after);
    const threshold = getActionShockThreshold(after, selectedAction);
    const shockInterrupted = !killedByBurn && after.actionShock >= threshold;
    const elementalInterruption = !killedByBurn && !shockInterrupted && after.statuses.shockTurns > 0
      && selectedAction !== 'approach' && selectedAction !== 'attack';
    const interrupted = shockInterrupted || elementalInterruption;
    const shockConsumed = shockInterrupted ? threshold : 0;
    after.actionShock -= shockConsumed;
    let intentResolved: EnemyActionResult['intentResolved'];
    let intentDetail: string | undefined;
    let movement = 0;
    let playerKilled = false;
    if (!killedByBurn) {
      if (selectedAction !== 'approach' && selectedAction !== 'attack') {
        if (!interrupted) {
          intentResolved = selectedAction;
          intentDetail = this.applyIntent(selectedAction, after, playerAfter, loadout);
        }
        if (after.intent) after.intent.countdown = after.intent.cooldown;
      } else {
        if (after.intent) after.intent.countdown = Math.max(1, after.intent.countdown - 1);
        if (!interrupted && selectedAction === 'attack') playerKilled = true;
        if (!interrupted && selectedAction === 'approach') {
          const slowMultiplier = after.statuses.slowTurns > 0 ? COMBAT_BALANCE.slowMovementMultiplier : 1;
          movement = Math.min(after.distance, Number((after.advancePerTurn * slowMultiplier).toFixed(2)));
          after.distance = Math.max(0, Number((after.distance - movement).toFixed(2)));
        }
      }
      if (after.statuses.slowTurns > 0) after.statuses.slowTurns -= 1;
      if (after.statuses.shockTurns > 0) after.statuses.shockTurns -= 1;
      after.turnsElapsed += 1;
    }
    return { before, after, playerBefore, playerAfter, burnDamage, movement, selectedAction, threshold,
      interrupted, elementalInterruption, shockConsumed, shockRemaining: after.actionShock, playerKilled, intentResolved, intentDetail, killedByBurn };
  }

  private applyIntent(type: NonNullable<EnemyState['intent']>['type'], enemy: EnemyState, player: PlayerCombatState, loadout: LoadoutSnapshot): string {
    if (type === 'groundShock') {
      player.heavyKickPenaltyBonus = 1;
      player.heavyKickPenaltyTurns = 2;
      return '지반 충격: 강한 반동 후속 화력 -3이 2턴 적용됩니다.';
    }
    if (type === 'sonicPulse') {
      player.rangePenaltySteps = 1;
      player.rangePenaltyTurns = 2;
      return '초음파 공명: 유효 거리 단계가 2턴 악화됩니다.';
    }
    const equippedSlots = ATTACHMENT_SLOT_ORDER.filter((slot) => loadout[slot]);
    const slot = equippedSlots[enemy.turnsElapsed % Math.max(1, equippedSlots.length)];
    if (!slot) return '오염 투척: 봉쇄할 장착물이 없습니다.';
    player.disabledSlots[slot] = 2;
    return `오염 투척: ${ATTACHMENT_SLOT_NAMES[slot]} 슬롯이 2턴 봉쇄됩니다.`;
  }

  private sumModifiers(modifiers: readonly AttachmentModifier[], kind: AttachmentModifier['kind']): number {
    return modifiers.filter(modifier => modifier.kind === kind).reduce((sum, modifier) => sum + modifier.value, 0);
  }

  private statusName(type: StatusType): string {
    return { burn: '화상', chill: '빙결 둔화', shock: '전하 교란', corruption: '침식 표식' }[type];
  }
}
