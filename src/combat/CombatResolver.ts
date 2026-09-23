import { ATTACHMENT_DEFINITIONS, ATTACHMENT_SLOT_NAMES, ATTACHMENT_SLOT_ORDER, SERVICE_45,
  type AttachmentModifier, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS, COMBAT_BALANCE, RANGE_NAMES } from '../data/ammoDefinitions';
import { getEnabledAttachmentIds, createPlayerCombatState } from './AttachmentLoadout';
import type { AmmoType, EnemyActionPreview, EnemyActionType, EnemyActionResult, EnemyState,
  PlayerCombatState, RangeBand, RoundPreview, SequenceResult, ShotResult } from './types';

export interface CombatContext {
  loadout?: LoadoutSnapshot;
  playerState?: PlayerCombatState;
  targets?: readonly EnemyState[];
}
interface SequenceCursor { recoil: number; followUp: number }
const cloneState = (state: EnemyState): EnemyState => ({ ...state, intent: state.intent ? { ...state.intent } : undefined });
const clonePlayerState = (state: PlayerCombatState): PlayerCombatState => ({ ...state, disabledSlots: { ...state.disabledSlots } });
const rangeOrder: readonly RangeBand[] = ['near', 'mid', 'far'];
export const roundPositiveFirepower = (value: number): number => {
  if (!Number.isFinite(value) || value < 0) throw new Error('화력은 0 이상의 유한한 값이어야 합니다.');
  return Math.floor(value + 0.5 + Number.EPSILON);
};
export const calculateFinalVolleyFirepower = (raw: number, penalty: number, minimum = COMBAT_BALANCE.minimumFirepower): number => {
  if (!Number.isInteger(raw) || raw < 0 || !Number.isInteger(penalty) || penalty < 0 || penalty > 100) throw new Error('잘못된 화력 또는 거리 감소입니다.');
  return raw === 0 ? 0 : Math.max(minimum, roundPositiveFirepower(raw * (100 - penalty) / 100));
};
export const getRangeBand = (distance: number): RangeBand => distance <= COMBAT_BALANCE.rangeThresholds.near
  ? 'near' : distance <= COMBAT_BALANCE.rangeThresholds.mid ? 'mid' : 'far';
export const getEffectiveRangeBand = (band: RangeBand, steps: number): RangeBand =>
  rangeOrder[Math.max(0, Math.min(2, rangeOrder.indexOf(band) + steps))] ?? 'far';
export const formatRangePenalty = (percent: number): string => percent === 0 ? '거리 감소 없음' : `화력 -${percent}%`;
export const isNearestValidTarget = (target: EnemyState, targets: readonly EnemyState[] = [target]): boolean =>
  target.hp > 0 && !targets.some(other => other.hp > 0 && other.distance < target.distance);
export const isVulnerable = (enemy: EnemyState): boolean => enemy.wound > 0;

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
export const previewEnemyAction = (enemy: EnemyState): EnemyActionPreview => {
  const selectedAction = selectEnemyAction(enemy);
  const movement = selectedAction === 'approach' ? Math.min(enemy.distance, enemy.advancePerTurn) : 0;
  return { selectedAction, threshold: getActionShockThreshold(enemy, selectedAction), movement };
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
  private modifiers(context: CombatContext): AttachmentModifier[] {
    return getEnabledAttachmentIds(context.loadout ?? {}, context.playerState ?? createPlayerCombatState())
      .flatMap(id => ATTACHMENT_DEFINITIONS[id].modifiers);
  }
  private modifier(context: CombatContext, kind: AttachmentModifier['kind'], band?: RangeBand): number {
    return this.modifiers(context).filter(mod => mod.kind === kind && (!mod.condition?.range || mod.condition.range === band))
      .reduce((sum, mod) => sum + mod.value, 0);
  }
  private rangePenalty(distance: number, context: CombatContext): { band: RangeBand; effective: RangeBand; percent: number } {
    const band = getRangeBand(distance);
    const effective = getEffectiveRangeBand(band, context.playerState?.rangePenaltySteps ?? 0);
    return { band, effective, percent: Math.max(0, SERVICE_45.rangePenaltyPercentages[effective]
      - this.modifier(context, 'rangePenaltyReductionPercent', effective)) };
  }
  resolveShot(ammoType: AmmoType, index: number, enemyState: EnemyState, context: CombatContext = {}): ShotResult {
    return this.resolveRound(ammoType, index, enemyState, context, { recoil: 0, followUp: 0 }).shot;
  }
  resolveSequence(rounds: readonly AmmoType[], enemyState: EnemyState, context: CombatContext = {}): SequenceResult {
    let current = cloneState(enemyState);
    let cursor: SequenceCursor = { recoil: 0, followUp: 0 };
    const shots: ShotResult[] = [];
    for (const [index, ammoType] of rounds.entries()) {
      if (current.hp <= 0) break;
      const resolved = this.resolveRound(ammoType, index, current, context, cursor);
      shots.push(resolved.shot);
      current = cloneState(resolved.shot.after);
      cursor = resolved.next;
    }
    // 사망 뒤의 슬롯도 배치를 읽을 수 있도록, 높은 체력의 동일 상태에서 순서 수치를 생성한다.
    let previewState = cloneState(enemyState);
    let previewCursor: SequenceCursor = { recoil: 0, followUp: 0 };
    const roundPreviews: RoundPreview[] = rounds.map((ammoType, index) => {
      const resolved = this.resolveRound(ammoType, index, previewState, context, previewCursor);
      const shot = resolved.shot;
      previewState = cloneState({ ...shot.after, hp: Math.max(1, shot.after.hp) });
      previewCursor = resolved.next;
      return { ammoType, index, effectiveFirepower: shot.breakdown.effectiveFirepower,
        wound: shot.woundApplied, effectiveActionShock: shot.breakdown.projectedShock,
        recoil: shot.breakdown.recoilAfter, followUpBonus: shot.breakdown.followUpBonus, movement: shot.movement };
    });
    const unfiredRounds = rounds.slice(shots.length);
    return { shots, roundPreviews, finalState: current,
      finalRangePenaltyPercent: this.rangePenalty(current.distance, context).percent,
      finalVolleyFirepower: shots.reduce((sum, shot) => sum + shot.breakdown.finalFirepower, 0),
      totalHpDamage: shots.reduce((sum, shot) => sum + shot.hpDamage, 0),
      totalWoundApplied: shots.reduce((sum, shot) => sum + shot.woundApplied, 0),
      totalActionShockApplied: shots.reduce((sum, shot) => sum + shot.actionShockApplied, 0),
      unfiredRounds: [...unfiredRounds], killed: current.hp <= 0 };
  }
  private resolveRound(ammoType: AmmoType, index: number, enemy: EnemyState, context: CombatContext,
    cursor: SequenceCursor): { shot: ShotResult; next: SequenceCursor } {
    const definition = AMMO_DEFINITIONS[ammoType];
    if (!definition) throw new Error('존재하지 않는 탄약입니다.');
    const before = cloneState(enemy);
    const after = cloneState(enemy);
    if (definition.moveBefore) after.distance = this.clampDistance(after.distance + definition.moveBefore);
    const shotDistance = after.distance;
    const range = this.rangePenalty(shotDistance, context);
    const effectiveRecoil = Math.max(0, cursor.recoil - (definition.recoilRecovery ?? 0));
    const threshold = COMBAT_BALANCE.recoilThreshold + this.modifier(context, 'recoilThreshold');
    // 반동 전환탄은 쌓인 반동을 피해로 바꾸면서 전부 소비한다.
    const recoilPenalty = definition.recoilScale ? 0 : Math.max(0, effectiveRecoil - threshold)
      + (effectiveRecoil > 0 ? context.playerState?.heavyKickPenaltyBonus ?? 0 : 0);
    const followUpBonus = cursor.followUp;
    const vulnerableBonus = isVulnerable(before) && definition.vulnerableBonus
      ? definition.vulnerableBonus + this.modifier(context, 'vulnerableEffect') : 0;
    const suppressedBonus = before.actionShock >= getActionShockThreshold(before) ? definition.suppressedBonus ?? 0 : 0;
    const executionBonus = definition.execution && before.hp * 100 <= before.maxHp * definition.execution.percent
      ? definition.execution.bonus : 0;
    const healthBonus = definition.healthScale ? Math.min(definition.healthScale.cap, Math.floor(before.hp / definition.healthScale.divisor)) : 0;
    const woundBonus = definition.woundScale ? Math.min(definition.woundScale.cap, Math.floor(before.wound / definition.woundScale.divisor)) : 0;
    const kickbackBonus = definition.recoilScale ? Math.min(definition.recoilScale.cap, cursor.recoil) : 0;
    const conditionalBonus = vulnerableBonus + suppressedBonus + executionBonus + healthBonus + woundBonus + kickbackBonus;
    const effectiveFirepower = Math.max(0, definition.firepower + conditionalBonus + followUpBonus - recoilPenalty);
    const finalFirepower = calculateFinalVolleyFirepower(effectiveFirepower, range.percent);
    const hpDamage = Math.min(after.hp, finalFirepower);
    after.hp -= hpDamage;
    const woundApplied = after.hp > 0 ? definition.wound : 0;
    after.wound += woundApplied;
    const projectedShock = definition.actionShock > 0
      ? definition.actionShock + this.modifier(context, 'impact', range.band) : 0;
    const actionShockApplied = after.hp > 0 ? projectedShock : 0;
    after.actionShock += actionShockApplied;
    if (definition.moveAfter) after.distance = this.clampDistance(after.distance + definition.moveAfter);
    const movement = after.distance - before.distance;
    const reducedRecoil = Math.max(0, definition.recoil - this.modifier(context, 'recoilReduction')
      - (definition.recoil >= 3 ? this.modifier(context, 'highRecoilReduction') : 0));
    const recoilBefore = definition.recoilScale ? 0 : effectiveRecoil;
    const recoilAfter = recoilBefore + reducedRecoil;
    const next = { recoil: recoilAfter, followUp: definition.followUp
      ? definition.followUp + this.modifier(context, 'followUpEffect') : 0 };
    const detail = [`${definition.name}`, `${RANGE_NAMES[range.effective]} ${formatRangePenalty(range.percent)}`];
    if (definition.moveBefore) detail.push(`사격 전 ${Math.abs(movement)}m 전진`);
    if (hpDamage) detail.push(`체력 -${hpDamage}`);
    if (woundApplied) detail.push(`상처 +${woundApplied}`);
    if (actionShockApplied) detail.push(`충격 +${actionShockApplied}`);
    if (followUpBonus) detail.push(`후속 강화 +${followUpBonus}`);
    if (definition.moveAfter) detail.push(`사격 후 ${movement}m 후퇴`);
    const breakdown = { ammoFirepower: definition.firepower, effectiveFirepower,
      rangeBand: range.band, effectiveRangeBand: range.effective, recoilBefore: cursor.recoil,
      recoilGenerated: reducedRecoil, recoilAfter, recoilPenalty, followUpBonus, conditionalBonus,
      rangePenaltyPercent: range.percent, projectedShock, finalFirepower };
    return { shot: { ammoType, index, damage: hpDamage, hpDamage, woundApplied, actionShockApplied,
      killed: after.hp <= 0, description: detail.join(' · '), breakdown,
      before, after, shotDistance, movement }, next };
  }
  private clampDistance(distance: number): number { return Math.max(0, Math.min(COMBAT_BALANCE.maxDistance, distance)); }
  resolveEnemyAction(enemyState: EnemyState, playerState: PlayerCombatState = createPlayerCombatState(), loadout: LoadoutSnapshot = {}): EnemyActionResult {
    const before = cloneState(enemyState);
    const after = cloneState(enemyState);
    const playerBefore = clonePlayerState(playerState);
    const playerAfter = tickPlayerEffects(playerState);
    const action = previewEnemyAction(after);
    const interrupted = after.actionShock >= action.threshold;
    const shockConsumed = interrupted ? action.threshold : 0;
    after.actionShock -= shockConsumed;
    let movement = 0;
    let playerKilled = false;
    let intentResolved: EnemyActionResult['intentResolved'];
    let intentDetail: string | undefined;
    if (action.selectedAction !== 'approach' && action.selectedAction !== 'attack') {
      if (!interrupted) {
        intentResolved = action.selectedAction;
        intentDetail = this.applyIntent(action.selectedAction, after, playerAfter, loadout);
      }
      if (after.intent) after.intent.countdown = after.intent.cooldown;
    } else {
      if (after.intent) after.intent.countdown = Math.max(1, after.intent.countdown - 1);
      if (!interrupted && action.selectedAction === 'attack') playerKilled = true;
      if (!interrupted && action.selectedAction === 'approach') {
        movement = action.movement;
        after.distance = this.clampDistance(after.distance - movement);
      }
    }
    after.turnsElapsed += 1;
    return { before, after, playerBefore, playerAfter, movement,
      selectedAction: action.selectedAction, threshold: action.threshold, interrupted,
      shockConsumed, shockRemaining: after.actionShock,
      playerKilled, intentResolved, intentDetail };
  }
  private applyIntent(type: Exclude<EnemyActionType, 'approach' | 'attack'>, enemy: EnemyState,
    player: PlayerCombatState, loadout: LoadoutSnapshot): string {
    if (type === 'groundShock') {
      player.heavyKickPenaltyBonus = 1; player.heavyKickPenaltyTurns = 2;
      return '지반 충격: 반동에 따른 화력 감소가 2턴 악화됩니다.';
    }
    if (type === 'sonicPulse') {
      player.rangePenaltySteps = 1; player.rangePenaltyTurns = 2;
      return '초음파 공명: 유효 거리 단계가 2턴 악화됩니다.';
    }
    const slots = ATTACHMENT_SLOT_ORDER.filter(slot => loadout[slot]);
    const slot = slots[enemy.turnsElapsed % Math.max(1, slots.length)];
    if (!slot) return '오염 투척: 봉쇄할 장착물이 없습니다.';
    player.disabledSlots[slot] = 2;
    return `오염 투척: ${ATTACHMENT_SLOT_NAMES[slot]} 슬롯이 2턴 봉쇄됩니다.`;
  }
}

export const getVisualKickScale = (enemy: EnemyState, context: CombatContext = {}): number => {
  const ids = getEnabledAttachmentIds(context.loadout ?? {}, context.playerState ?? createPlayerCombatState());
  const reduction = ids.flatMap(id => ATTACHMENT_DEFINITIONS[id].modifiers)
    .filter(mod => mod.kind === 'recoilReduction').reduce((sum, mod) => sum + mod.value, 0);
  void enemy;
  return Math.max(0.5, 1 - reduction * 0.15);
};
