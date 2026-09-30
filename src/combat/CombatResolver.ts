import { ATTACHMENT_DEFINITIONS, ATTACHMENT_SLOT_NAMES, ATTACHMENT_SLOT_ORDER, SERVICE_45,
  type AttachmentModifier, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS, COMBAT_BALANCE, RANGE_NAMES } from '../data/ammoDefinitions';
import { getEnabledAttachmentIds, createPlayerCombatState } from './AttachmentLoadout';
import { recoilFirepowerPenalty } from './RecoilPenalty';
import type { AmmoType, EnemyActionPreview, EnemyActionType, EnemyActionResult, EnemyState,
  FirepowerBreakdown, PlayerCombatState, RangeBand, RoundPreview, SequenceResult, ShotResult } from './types';

export interface CombatContext {
  loadout?: LoadoutSnapshot;
  playerState?: PlayerCombatState;
  targets?: readonly EnemyState[];
}
interface SequenceCursor { recoil: number; followUp: number; distanceLossHundredths: number }
const cloneState = (state: EnemyState): EnemyState => ({ ...state, intent: state.intent ? { ...state.intent } : undefined });
const clonePlayerState = (state: PlayerCombatState): PlayerCombatState => ({ ...state, disabledSlots: { ...state.disabledSlots } });
const rangeOrder: readonly RangeBand[] = ['near', 'mid', 'far'];
export const roundPositiveFirepower = (value: number): number => {
  if (!Number.isFinite(value) || value < 0) throw new Error('화력은 0 이상의 유한한 값이어야 합니다.');
  return Math.floor(value + 0.5 + Number.EPSILON);
};
export const calculateFinalVolleyFirepower = (raw: number, penalty: number, minimum = COMBAT_BALANCE.minimumFirepower,
  previousLossHundredths = 0): number => {
  if (!Number.isInteger(raw) || raw < 0 || !Number.isInteger(penalty) || penalty < 0 || penalty > 100
    || !Number.isInteger(previousLossHundredths) || previousLossHundredths < 0) throw new Error('잘못된 화력 또는 거리 감소입니다.');
  if (raw === 0) return 0;
  const totalLoss = roundPositiveFirepower((previousLossHundredths + raw * penalty) / 100);
  const previousLoss = roundPositiveFirepower(previousLossHundredths / 100);
  return Math.max(minimum, raw - (totalLoss - previousLoss));
};
export const getRangeBand = (distance: number): RangeBand => distance <= COMBAT_BALANCE.rangeThresholds.near
  ? 'near' : distance <= COMBAT_BALANCE.rangeThresholds.mid ? 'mid' : 'far';
export const getEffectiveRangeBand = (band: RangeBand, steps: number): RangeBand =>
  rangeOrder[Math.max(0, Math.min(2, rangeOrder.indexOf(band) + steps))] ?? 'far';
export const formatRangePenalty = (percent: number): string => percent === 0 ? '거리 감소 없음' : `화력 -${percent}%`;
export const isNearestValidTarget = (target: EnemyState, targets: readonly EnemyState[] = [target]): boolean =>
  target.hp > 0 && !targets.some(other => other.hp > 0 && other.distance < target.distance);
export const isVulnerable = (enemy: EnemyState): boolean => enemy.vulnerableTurns > 0;

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
  getRecoilThreshold(context: CombatContext = {}): number {
    return COMBAT_BALANCE.recoilThreshold + this.modifier(context, 'recoilThreshold');
  }
  private rangePenalty(distance: number, context: CombatContext): { band: RangeBand; effective: RangeBand; percent: number } {
    const band = getRangeBand(distance);
    const effective = getEffectiveRangeBand(band, context.playerState?.rangePenaltySteps ?? 0);
    return { band, effective, percent: Math.max(0, SERVICE_45.rangePenaltyPercentages[effective]
      - this.modifier(context, 'rangePenaltyReductionPercent', effective)) };
  }
  resolveShot(ammoType: AmmoType, index: number, enemyState: EnemyState, context: CombatContext = {}): ShotResult {
    return this.resolveRound(ammoType, index, enemyState, context, { recoil: 0, followUp: 0, distanceLossHundredths: 0 }).shot;
  }
  resolveSequence(rounds: readonly AmmoType[], enemyState: EnemyState, context: CombatContext = {}): SequenceResult {
    let current = cloneState(enemyState);
    let cursor: SequenceCursor = { recoil: 0, followUp: 0, distanceLossHundredths: 0 };
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
    let previewCursor: SequenceCursor = { recoil: 0, followUp: 0, distanceLossHundredths: 0 };
    const roundPreviews: RoundPreview[] = rounds.map((ammoType, index) => {
      const resolved = this.resolveRound(ammoType, index, previewState, context, previewCursor);
      const shot = resolved.shot;
      previewState = cloneState({ ...shot.after, hp: Math.max(1, shot.after.hp) });
      previewCursor = resolved.next;
      return { ammoType, index, effectiveFirepower: shot.breakdown.effectiveFirepower,
        recoilFirepowerReduction: shot.breakdown.recoilFirepowerReduction,
        playerDebuffFirepowerReduction: shot.breakdown.playerDebuffFirepowerReduction,
        // 미발사 슬롯도 폭발탄의 누적 능력은 표시한다. 실제 잔량과 기폭 피해는 shots에서만 합산한다.
        wound: shot.woundApplied, explosive: AMMO_DEFINITIONS[ammoType].explosive, effectiveActionShock: shot.breakdown.projectedShock,
        recoil: shot.breakdown.recoilAfter, followUpBonus: shot.breakdown.followUpBonus,
        vulnerableDamageBonus: shot.breakdown.vulnerableDamageBonus, movement: shot.movement };
    });
    const unfiredRounds = rounds.slice(shots.length);
    const firepowerBreakdown: FirepowerBreakdown = {
      prePenaltyFirepower: shots.reduce((sum, shot) => sum + shot.breakdown.prePenaltyFirepower, 0),
      recoilReduction: shots.reduce((sum, shot) => sum + shot.breakdown.recoilFirepowerReduction, 0),
      playerDebuffReduction: shots.reduce((sum, shot) => sum + shot.breakdown.playerDebuffFirepowerReduction, 0),
      distanceReduction: shots.reduce((sum, shot) => sum + shot.breakdown.distanceFirepowerReduction, 0),
      distancePenaltyPercents: [...new Set(shots.map(shot => shot.breakdown.rangePenaltyPercent)
        .filter(percent => percent > 0))],
      detonationDamage: shots.reduce((sum, shot) => sum + shot.breakdown.detonationDamage, 0),
      finalFirepower: shots.reduce((sum, shot) => sum + shot.breakdown.finalFirepower, 0),
    };
    return { shots, roundPreviews, finalState: current,
      firepowerBreakdown,
      totalHpDamage: shots.reduce((sum, shot) => sum + shot.hpDamage, 0),
      totalWoundApplied: shots.reduce((sum, shot) => sum + shot.woundApplied, 0),
      totalExplosiveApplied: shots.reduce((sum, shot) => sum + shot.explosiveApplied, 0),
      totalActionShockApplied: shots.reduce((sum, shot) => sum + shot.actionShockApplied, 0),
      unfiredRounds: [...unfiredRounds], killed: current.hp <= 0 };
  }
  previewAppendedAmmo(rounds: readonly AmmoType[], candidates: readonly AmmoType[], enemyState: EnemyState,
    context: CombatContext = {}): Partial<Record<AmmoType, RoundPreview>> {
    return Object.fromEntries(candidates.map((ammo): [AmmoType, RoundPreview | undefined] => {
      const preview = this.resolveSequence([...rounds, ammo], enemyState, context).roundPreviews.at(-1);
      return [ammo, preview];
    }).filter((entry): entry is [AmmoType, RoundPreview] => entry[1] !== undefined));
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
    const recoilBefore = cursor.recoil;
    const reducedRecoil = Math.max(0, definition.recoil - this.modifier(context, 'recoilReduction')
      - (definition.recoil >= 3 ? this.modifier(context, 'highRecoilReduction') : 0));
    const recoilAfter = (definition.recoilScale ? 0
      : Math.max(0, recoilBefore - (definition.recoilRecovery ?? 0))) + reducedRecoil;
    const threshold = this.getRecoilThreshold(context);
    // 반동탄은 쌓인 반동을 피해로 바꾸면서 전부 소비한다.
    // 이번 탄으로 누적 반동이 임계치를 넘으면 같은 탄의 화력부터 감소한다.
    const recoilPenalty = definition.recoilScale ? 0 : recoilFirepowerPenalty(recoilAfter, threshold);
    const playerDebuffFirepowerPenalty = definition.recoilScale || recoilBefore === 0
      ? 0 : context.playerState?.heavyKickPenaltyBonus ?? 0;
    const followUpBonus = cursor.followUp;
    const vulnerableBonus = isVulnerable(before) && definition.vulnerableBonus
      ? definition.vulnerableBonus + this.modifier(context, 'vulnerableEffect') : 0;
    const suppressedBonus = before.actionShock >= getActionShockThreshold(before) ? definition.suppressedBonus ?? 0 : 0;
    const executionBonus = definition.execution && before.hp * 100 <= before.maxHp * definition.execution.percent
      ? definition.execution.bonus : 0;
    const healthBonus = definition.healthScale ? Math.min(definition.healthScale.cap, Math.floor(before.hp / definition.healthScale.divisor)) : 0;
    const kickbackBonus = definition.recoilScale ? Math.min(definition.recoilScale.cap, cursor.recoil) : 0;
    const conditionalBonus = vulnerableBonus + suppressedBonus + executionBonus + healthBonus + kickbackBonus;
    const preRecoilFirepower = Math.max(0, definition.firepower + conditionalBonus + followUpBonus);
    const afterRecoilFirepower = Math.max(0, preRecoilFirepower - recoilPenalty);
    const baseFirepower = Math.max(0, afterRecoilFirepower - playerDebuffFirepowerPenalty);
    // 취약은 사격 시작 시 상태로 HP 화력에만 적용한다. 이번 탄의 상처 발동은 후속 탄부터 유효하다.
    const applyVulnerability = (firepower: number): number => firepower + (isVulnerable(before)
      ? roundPositiveFirepower(firepower * (COMBAT_BALANCE.vulnerableDamagePercent + (definition.vulnerableDamagePercentBonus ?? 0)) / 100) : 0);
    const directPrePenaltyFirepower = applyVulnerability(preRecoilFirepower);
    const vulnerableDamageBonus = applyVulnerability(baseFirepower) - baseFirepower;
    const effectiveFirepower = baseFirepower + vulnerableDamageBonus;
    const recoilFirepowerReduction = directPrePenaltyFirepower - applyVulnerability(afterRecoilFirepower);
    const playerDebuffFirepowerReduction = applyVulnerability(afterRecoilFirepower) - effectiveFirepower;
    // 거리 손실의 소수 부분은 탄창 안에서 이월해 작은 탄의 손실이 모두 반올림으로 사라지지 않게 한다.
    const directFirepower = calculateFinalVolleyFirepower(effectiveFirepower, range.percent,
      COMBAT_BALANCE.minimumFirepower, cursor.distanceLossHundredths);
    const distanceFirepowerReduction = effectiveFirepower - directFirepower;
    const projectedShock = definition.actionShock > 0
      ? definition.actionShock + this.modifier(context, 'impact', range.band) : 0;
    // 폭발은 턴/거리/반동/취약과 무관하게 유지된다. 이번 명중의 충격만 기폭하며 기존 충격은 기폭하지 않는다.
    const explosiveApplied = after.hp > directFirepower ? definition.explosive : 0;
    after.explosive += explosiveApplied;
    const explosiveConsumed = before.hp > 0 && projectedShock > 0 ? after.explosive : 0;
    const detonationDamage = explosiveConsumed * COMBAT_BALANCE.explosionDamagePerStack;
    after.explosive -= explosiveConsumed;
    const explosionDamage = Math.min(Math.max(0, after.hp - directFirepower), detonationDamage);
    const prePenaltyFirepower = directPrePenaltyFirepower + detonationDamage;
    const finalFirepower = directFirepower + detonationDamage;
    const hpDamage = Math.min(after.hp, finalFirepower);
    after.hp -= hpDamage;
    const woundApplied = after.hp > 0 ? definition.wound : 0;
    after.wound += woundApplied;
    const vulnerableTriggered = woundApplied > 0 && after.wound >= after.woundThreshold;
    if (vulnerableTriggered) {
      // 임계치 단위로 소비하고 초과분 보존. 재발동은 지속 시간을 갱신하며 중첩하지 않는다.
      after.wound %= after.woundThreshold;
      after.vulnerableTurns = COMBAT_BALANCE.vulnerableTurns;
    }
    const actionShockApplied = after.hp > 0 ? projectedShock : 0;
    after.actionShock += actionShockApplied;
    if (definition.moveAfter) after.distance = this.clampDistance(after.distance + definition.moveAfter);
    const movement = after.distance - before.distance;
    const next = { recoil: recoilAfter, followUp: definition.followUp
      ? definition.followUp + this.modifier(context, 'followUpEffect') : 0,
    distanceLossHundredths: cursor.distanceLossHundredths + effectiveFirepower * range.percent };
    const detail = [`${definition.name}`, `${RANGE_NAMES[range.effective]} ${formatRangePenalty(range.percent)}`];
    if (definition.moveBefore) detail.push(`사격 전 ${Math.abs(movement)}m 전진`);
    if (hpDamage) detail.push(`체력 -${hpDamage}`);
    if (woundApplied) detail.push(`상처 +${woundApplied}`);
    if (explosiveApplied) detail.push(`폭발 +${explosiveApplied}`);
    if (explosiveConsumed) detail.push(`기폭 ${explosiveConsumed} · 폭발 피해 ${explosionDamage}`);
    if (vulnerableTriggered) detail.push(`취약 ${after.vulnerableTurns}턴 발동`);
    if (actionShockApplied) detail.push(`충격 +${actionShockApplied}`);
    if (followUpBonus) detail.push(`후속 강화 +${followUpBonus}`);
    if (definition.moveAfter) detail.push(`사격 후 ${movement}m 후퇴`);
    const breakdown = { ammoFirepower: definition.firepower, prePenaltyFirepower, effectiveFirepower,
      rangeBand: range.band, effectiveRangeBand: range.effective, recoilBefore,
      recoilGenerated: reducedRecoil, recoilAfter, recoilPenalty, recoilFirepowerReduction,
      playerDebuffFirepowerPenalty, playerDebuffFirepowerReduction,
      followUpBonus, conditionalBonus, vulnerableDamageBonus,
      rangePenaltyPercent: range.percent, distanceFirepowerReduction, projectedShock, detonationDamage, finalFirepower };
    return { shot: { ammoType, index, damage: hpDamage, hpDamage, woundApplied, explosiveApplied, explosiveConsumed, explosionDamage, vulnerableTriggered, actionShockApplied,
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
    // 한 탄창이 한 플레이어 턴이다. 발동 턴을 포함하며, 행동이 중단되어도 턴은 끝난다.
    after.vulnerableTurns = Math.max(0, after.vulnerableTurns - 1);
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
