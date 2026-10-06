import { WEAPON_DEFINITIONS, type WeaponId } from '../data/weaponDefinitions';
import { weaponPayload } from './WeaponTraits';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_SLOT_NAMES, ATTACHMENT_SLOT_ORDER,
  type AttachmentModifier, type LoadoutSnapshot } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS, COMBAT_BALANCE, RANGE_NAMES } from '../data/ammoDefinitions';
import { getEnabledAttachmentIds, getMagazineCapacity, createPlayerCombatState } from './AttachmentLoadout';
import { commitMagazine, resolveAmmoRules } from './AmmoRules';
import { recoilFirepowerPenalty } from './RecoilPenalty';
import { createTrainingActions } from '../data/trainingEnemy';
import type { AmmoFamily, AmmoType, CommittedMagazine, PayloadModifier, PrimaryEffectValues, EnemyActionPreview, EnemyActionType, EnemyActionResult, EnemyState,
  FirepowerBreakdown, PlayerCombatState, RangeBand, RoundPreview, SequenceResult, ShotResult } from './types';

export interface CombatContext {
  magazineCapacity?: number;
  committedMagazine?: CommittedMagazine;
  weaponId?: WeaponId;
  boostedOpening?: boolean;
  loadout?: LoadoutSnapshot;
  playerState?: PlayerCombatState;
  targets?: readonly EnemyState[];
}
interface SequenceCursor { previousFamily?: AmmoFamily; previousPrimary?: PrimaryEffectValues; incoming: readonly PayloadModifier[]; recoil: number; distanceLossHundredths: number }
const freshCursor = (): SequenceCursor => ({ recoil: 0, incoming: [], distanceLossHundredths: 0 });
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
export const isIgnited = (enemy: EnemyState): boolean => enemy.ignitedActions > 0;

export const ACTION_SHOCK_THRESHOLDS: Record<EnemyActionType, number> = {
  approach: 4, attack: 8, contaminate: 6, groundShock: 7, sonicPulse: 6,
};
export const ACTION_NAMES: Record<EnemyActionType, string> = {
  approach: '접근', attack: '치명 공격', contaminate: '오염 투척', groundShock: '지반 충격', sonicPulse: '초음파 공명',
};
const scheduledEnemyAction = (enemy: EnemyState): EnemyActionType =>
  enemy.distance <= 0 ? 'attack' : enemy.trainingActions?.[0] ?? (enemy.intent && enemy.intent.countdown <= 1 ? enemy.intent.type : 'approach');
export const isSpecialAction = (action: EnemyActionType): action is Exclude<EnemyActionType, 'approach' | 'attack'> =>
  action !== 'approach' && action !== 'attack';
export const selectEnemyAction = (enemy: EnemyState): EnemyActionType => {
  const scheduled = scheduledEnemyAction(enemy);
  return isIgnited(enemy) && isSpecialAction(scheduled) ? 'approach' : scheduled;
};
export const getActionShockThreshold = (enemy: EnemyState, action = selectEnemyAction(enemy)): number =>
  Math.max(1, ACTION_SHOCK_THRESHOLDS[action] + enemy.shockResistance);
export const previewEnemyAction = (enemy: EnemyState): EnemyActionPreview => {
  const selectedAction = selectEnemyAction(enemy);
  const movement = selectedAction === 'approach' ? Math.min(enemy.distance, enemy.advancePerTurn) : 0;
  const scheduled = scheduledEnemyAction(enemy);
  return { selectedAction, threshold: getActionShockThreshold(enemy, selectedAction), movement,
    suppressedIntent: isIgnited(enemy) && isSpecialAction(scheduled) ? scheduled : undefined };
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
    return getEnabledAttachmentIds(context.loadout ?? {}, context.playerState ?? createPlayerCombatState(), context.weaponId)
      .flatMap(id => ATTACHMENT_DEFINITIONS[id].modifiers);
  }
  private modifier(context: CombatContext, kind: AttachmentModifier['kind'], band?: RangeBand): number {
    return this.modifiers(context).filter(mod => mod.kind === kind && (!mod.condition?.range || mod.condition.range === band))
      .reduce((sum, mod) => sum + mod.value, 0);
  }
  getRecoilThreshold(context: CombatContext = {}): number {
    return WEAPON_DEFINITIONS[context.weaponId ?? 'p220'].recoilThreshold + this.modifier(context, 'recoilThreshold');
  }
  private rangePenalty(distance: number, context: CombatContext): { band: RangeBand; effective: RangeBand; percent: number } {
    const band = getRangeBand(distance);
    const effective = getEffectiveRangeBand(band, context.playerState?.rangePenaltySteps ?? 0);
    return { band, effective, percent: Math.max(0, WEAPON_DEFINITIONS[context.weaponId ?? 'p220'].rangePenaltyPercentages[effective]
      - this.modifier(context, 'rangePenaltyReductionPercent', effective)) };
  }
  resolveShot(ammoType: AmmoType, index: number, enemyState: EnemyState, context: CombatContext = {}): ShotResult {
    const magazine = commitMagazine([ammoType], context.magazineCapacity ?? getMagazineCapacity(context.loadout ?? {}, context.playerState, context.weaponId));
    return this.resolveRound(ammoType, index, enemyState, context, freshCursor(), magazine).shot;
  }
  resolveSequence(rounds: readonly AmmoType[], enemyState: EnemyState, context: CombatContext = {}): SequenceResult {
    let current = cloneState(enemyState);
    const magazine = context.committedMagazine ?? commitMagazine(rounds, context.magazineCapacity
      ?? Math.max(rounds.length, getMagazineCapacity(context.loadout ?? {}, context.playerState, context.weaponId)));
    if (magazine.rounds.length !== rounds.length || rounds.some((round, index) => round !== magazine.rounds[index]))
      throw new Error('확정 탄창과 사격 순서가 일치하지 않습니다.');
    let cursor = freshCursor();
    const shots: ShotResult[] = [];
    for (const [index, ammoType] of rounds.entries()) {
      if (current.hp <= 0) break;
      const resolved = this.resolveRound(ammoType, index, current, context, cursor, magazine);
      shots.push(resolved.shot);
      current = cloneState(resolved.shot.after);
      cursor = resolved.next;
    }
    // 사망 뒤의 슬롯도 배치를 읽을 수 있도록, 높은 체력의 동일 상태에서 순서 수치를 생성한다.
    let previewState = cloneState(enemyState);
    let previewCursor = freshCursor();
    const roundPreviews: RoundPreview[] = rounds.map((ammoType, index) => {
      const resolved = this.resolveRound(ammoType, index, previewState, context, previewCursor, magazine);
      const shot = resolved.shot;
      previewState = cloneState({ ...shot.after, hp: Math.max(1, shot.after.hp) });
      previewCursor = resolved.next;
      return { ammoType, index, layerActivations: shot.breakdown.layerActivations, effectiveFirepower: shot.breakdown.effectiveFirepower,
        recoilFirepowerReduction: shot.breakdown.recoilFirepowerReduction,
        playerDebuffFirepowerReduction: shot.breakdown.playerDebuffFirepowerReduction,
        // 미발사 슬롯도 폭발탄의 누적 능력은 표시한다. 실제 잔량과 기폭 피해는 shots에서만 합산한다.
        traitBonus: shot.breakdown.traitBonus, recoilGenerated: shot.breakdown.recoilGenerated, finalFirepower: shot.breakdown.finalFirepower,
        wound: shot.breakdown.resolvedPayload.wound, explosive: shot.breakdown.resolvedPayload.explosive, effectiveActionShock: shot.breakdown.projectedShock,
        burn: shot.breakdown.burnBuildup, burnDamage: shot.breakdown.burnDamage, directFirepower: shot.breakdown.directFirepower,
        burnBefore: shot.before.burn, burnAfter: shot.after.burn, burnThreshold: shot.after.burnThreshold,
        rangePenaltyPercent: shot.breakdown.rangePenaltyPercent, recoilPenalty: shot.breakdown.recoilPenalty,
        ignitionTriggered: shot.ignitionTriggered, ignited: isIgnited(shot.after),
        nextBurnPercent: AMMO_DEFINITIONS[ammoType].rules.reduce((sum, rule) => sum + (rule.action.type === 'next' && rule.action.target === 'burn' && rule.action.mode === 'percent' ? rule.action.amount : 0), 0), ignitedBonus: shot.breakdown.ignitedBonus,
        shockBonus: shot.breakdown.projectedShock - AMMO_DEFINITIONS[ammoType].actionShock,
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
      ruptureDamage: shots.reduce((sum, shot) => sum + shot.breakdown.ruptureDamage, 0),
      finalFirepower: shots.reduce((sum, shot) => sum + shot.breakdown.finalFirepower, 0),
    };
    return { shots, roundPreviews, finalState: current,
      firepowerBreakdown,
      totalHpDamage: shots.reduce((sum, shot) => sum + shot.hpDamage, 0),
      totalWoundApplied: shots.reduce((sum, shot) => sum + shot.woundApplied, 0),
      totalBurnApplied: shots.reduce((sum, shot) => sum + shot.burnApplied, 0),
      totalBurnDamage: shots.reduce((sum, shot) => sum + shot.burnDamage, 0),
      totalExplosiveApplied: shots.reduce((sum, shot) => sum + shot.explosiveApplied, 0),
      totalActionShockApplied: shots.reduce((sum, shot) => sum + shot.actionShockApplied, 0),
      unfiredRounds: [...unfiredRounds], killed: current.hp <= 0 };
  }
  previewAppendedAmmo(rounds: readonly AmmoType[], candidates: readonly AmmoType[], enemyState: EnemyState,
    context: CombatContext = {}): Partial<Record<AmmoType, RoundPreview>> {
    if (rounds.length >= (context.magazineCapacity ?? getMagazineCapacity(context.loadout ?? {}, context.playerState, context.weaponId))) return {};
    return Object.fromEntries(candidates.map((ammo): [AmmoType, RoundPreview | undefined] => {
      const preview = this.resolveSequence([...rounds, ammo], enemyState, context).roundPreviews.at(-1);
      return [ammo, preview];
    }).filter((entry): entry is [AmmoType, RoundPreview] => entry[1] !== undefined));
  }
  private resolveRound(ammoType: AmmoType, index: number, enemy: EnemyState, context: CombatContext,
    cursor: SequenceCursor, magazine: CommittedMagazine): { shot: ShotResult; next: SequenceCursor } {
    const definition = AMMO_DEFINITIONS[ammoType];
    if (!definition) throw new Error('존재하지 않는 탄약입니다.');
    const weapon = WEAPON_DEFINITIONS[context.weaponId ?? 'p220'];
    const weaponEffect = weaponPayload(definition, weapon, cursor.previousFamily, Boolean(context.boostedOpening && index === 0));
    const before = cloneState(enemy);
    const after = cloneState(enemy);
    if (definition.moveBefore) after.distance = this.clampDistance(after.distance + definition.moveBefore);
    const shotDistance = after.distance;
    const range = this.rangePenalty(shotDistance, context);
    const recoilBefore = cursor.recoil;
    const reducedRecoil = Math.max(0, (weapon.trait === 'standardBall' && ammoType === 'ball' ? 0 : definition.recoil + (definition.recoil > 0 ? weapon.recoilAdjustment : 0)) - this.modifier(context, 'recoilReduction')
      - (definition.recoil >= 3 ? this.modifier(context, 'highRecoilReduction') : 0));
    const recoveredRecoil = definition.recoilScale ? 0 : Math.max(0, recoilBefore - (definition.recoilRecovery ?? 0));
    const recoilAfter = recoveredRecoil + reducedRecoil;
    const threshold = this.getRecoilThreshold(context);
    // 반동탄은 쌓인 반동을 피해로 바꾸면서 전부 소비한다.
    // 일반 권총은 이번 탄 반동도 포함하고, 지연 반동 특성은 회복 후 기존 반동만 사용한다.
    const recoilPenalty = definition.recoilScale ? 0 : recoilFirepowerPenalty(weapon.trait === 'deferredRecoil' ? recoveredRecoil : recoilAfter, threshold);
    const playerDebuffFirepowerPenalty = definition.recoilScale || recoilBefore === 0
      ? 0 : context.playerState?.heavyKickPenaltyBonus ?? 0;
    const followUpBonus = cursor.incoming.filter(mod => mod.target === 'firepower' && mod.mode === 'add').reduce((sum, mod) => sum + mod.amount, 0);
    const vulnerableBonus = isVulnerable(before) && definition.vulnerableBonus
      ? definition.vulnerableBonus + this.modifier(context, 'vulnerableEffect') : 0;
    const suppressedBonus = before.actionShock >= getActionShockThreshold(before) ? definition.suppressedBonus ?? 0 : 0;
    const executionBonus = definition.execution && before.hp * 100 <= before.maxHp * definition.execution.percent
      ? definition.execution.bonus : 0;
    const healthBonus = definition.healthScale ? Math.min(definition.healthScale.cap, Math.floor(before.hp / definition.healthScale.divisor)) : 0;
    const kickbackBonus = definition.recoilScale ? Math.min(definition.recoilScale.cap, cursor.recoil) : 0;
    const ignitedBonus = isIgnited(before) ? definition.ignitedBonus ?? 0 : 0;
    const conditionalBonus = vulnerableBonus + suppressedBonus + executionBonus + healthBonus + kickbackBonus + ignitedBonus;
    const burnScaleBonus = Math.floor(before.burn * (definition.burnScalePercent ?? 0) / 100);
    const shockScaleBonus = definition.shockScale
      ? Math.min(definition.shockScale.cap, Math.floor(before.actionShock / definition.shockScale.divisor)) : 0;
    const rules = resolveAmmoRules(definition, { firepower: weaponEffect.firepower + conditionalBonus,
      wound: weaponEffect.wound + (isVulnerable(before) ? definition.vulnerableWoundBonus ?? 0 : 0),
      explosive: weaponEffect.explosive, burn: weaponEffect.burn + burnScaleBonus, actionShock: weaponEffect.actionShock + shockScaleBonus },
    { magazine, index, previousFamily: cursor.previousFamily, previousPrimary: cursor.previousPrimary },
    cursor.incoming, this.modifier(context, 'followUpEffect'));
    const payload = rules.payload;
    const preRecoilFirepower = Math.max(0, payload.firepower);
    const afterRecoilFirepower = Math.max(0, preRecoilFirepower - recoilPenalty);
    const baseFirepower = Math.max(0, afterRecoilFirepower - playerDebuffFirepowerPenalty);
    // 취약은 사격 시작 시 상태로 HP 화력에만 적용한다. 이번 탄의 상처 발동은 후속 탄부터 유효하다.
    const applyVulnerability = (firepower: number): number => firepower + (isVulnerable(before)
      ? roundPositiveFirepower(firepower * (COMBAT_BALANCE.vulnerableDamagePercent + (definition.vulnerableDamagePercentBonus ?? 0)) / 100) : 0);
    const directPrePenaltyFirepower = applyVulnerability(preRecoilFirepower);
    const vulnerableDamageBonus = applyVulnerability(baseFirepower) - baseFirepower;
    const effectiveFirepower = baseFirepower + vulnerableDamageBonus;
    // 반동·교란 감소는 한 발에 한 번만 차감한다. 직접 화력에서 남은 감소만 화상 피해에 적용한다.
    // 화상 피해는 취약·후속 화력·무기 화력 조정으로 증폭하지 않는다.
    const burnRecoilReduction = Math.min(definition.burnDamage, Math.max(0, recoilPenalty - preRecoilFirepower));
    const burnAfterRecoil = definition.burnDamage - burnRecoilReduction;
    const burnDebuffReduction = Math.min(burnAfterRecoil, Math.max(0, playerDebuffFirepowerPenalty - afterRecoilFirepower));
    const effectiveBurnDamage = burnAfterRecoil - burnDebuffReduction;
    const recoilFirepowerReduction = directPrePenaltyFirepower - applyVulnerability(afterRecoilFirepower) + burnRecoilReduction;
    const playerDebuffFirepowerReduction = applyVulnerability(afterRecoilFirepower) - effectiveFirepower + burnDebuffReduction;
    // 거리 손실의 소수 부분은 탄창 안에서 이월해 작은 탄의 손실이 모두 반올림으로 사라지지 않게 한다.
    const directFirepower = calculateFinalVolleyFirepower(effectiveFirepower, range.percent,
      COMBAT_BALANCE.minimumFirepower, cursor.distanceLossHundredths);
    const burnDamage = calculateFinalVolleyFirepower(effectiveBurnDamage, range.percent,
      COMBAT_BALANCE.minimumFirepower, cursor.distanceLossHundredths + effectiveFirepower * range.percent);
    const distanceFirepowerReduction = effectiveFirepower + effectiveBurnDamage - directFirepower - burnDamage;
    const burnBuildup = payload.burn;
    const burnFollowUpPercent = cursor.incoming.filter(mod => mod.target === 'burn' && mod.mode === 'percent').reduce((sum, mod) => sum + mod.amount, 0);
    const shockFollowUpBonus = cursor.incoming.filter(mod => mod.target === 'actionShock' && mod.mode === 'add').reduce((sum, mod) => sum + mod.amount, 0);
    const baseShock = payload.actionShock;
    // 연쇄는 바로 다음 한 발만 강화한다. 강화로 충격을 얻은 일반탄도 조명과 폭발 기폭을 적용한다.
    const projectedShock = baseShock > 0 ? baseShock + this.modifier(context, 'impact', range.band) : 0;
    // 폭발은 턴/거리/반동/취약과 무관하게 유지된다. 이번 명중의 충격만 기폭하며 기존 충격은 기폭하지 않는다.
    const explosiveApplied = after.hp > directFirepower + burnDamage ? payload.explosive : 0;
    after.explosive += explosiveApplied;
    const explosiveConsumed = before.hp > 0 && projectedShock > 0 ? after.explosive : 0;
    const detonationDamage = explosiveConsumed * COMBAT_BALANCE.explosionDamagePerStack;
    after.explosive -= explosiveConsumed;
    const explosionDamage = Math.min(Math.max(0, after.hp - directFirepower - burnDamage), detonationDamage);
    const actualBurnDamage = Math.min(Math.max(0, after.hp - directFirepower), burnDamage);
    let prePenaltyFirepower = directPrePenaltyFirepower + definition.burnDamage + detonationDamage;
    let finalFirepower = directFirepower + burnDamage + detonationDamage;
    let hpDamage = Math.min(after.hp, finalFirepower);
    after.hp -= hpDamage;
    const burnApplied = after.hp > 0 ? burnBuildup : 0;
    after.burn += burnApplied;
    const ignitionTriggered = burnApplied > 0 && after.burn >= after.burnThreshold;
    if (ignitionTriggered) {
      after.burn -= after.burnThreshold;
      after.ignitedActions = COMBAT_BALANCE.ignitedActions;
    }
    if (after.hp <= 0) { after.burn = 0; after.ignitedActions = 0; }
    // 재개방은 사격 시작 시 이미 취약한 표적에만 추가 상처를 준다.
    const woundApplied = after.hp > 0 ? payload.wound : 0;
    after.wound += woundApplied;
    const vulnerableTriggered = woundApplied > 0 && after.wound >= after.woundThreshold;
    if (vulnerableTriggered) {
      // 임계치 단위로 소비하고 초과분 보존. 흉터는 다음 발동이 준비되는 임계치 미만까지 남긴다.
      after.wound %= after.woundThreshold;
      after.wound += Math.min(definition.woundRetention ?? 0, after.woundThreshold - 1 - after.wound);
      // 재발동으로 심부 절개의 남은 지속시간을 줄이지 않으며, 반복 발동으로 합산하지 않는다.
      after.vulnerableTurns = Math.max(before.vulnerableTurns, COMBAT_BALANCE.vulnerableTurns + (definition.vulnerableExtraTurns ?? 0));
    }
    // 파열은 취약을 발동시킨 한 발에 한 번만 적용하고, 거리·반동·취약 배율과 독립된 피해다.
    const rupturePower = vulnerableTriggered ? definition.vulnerableTriggerDamage ?? 0 : 0;
    const ruptureDamage = Math.min(after.hp, rupturePower);
    after.hp -= ruptureDamage;
    hpDamage += ruptureDamage;
    prePenaltyFirepower += rupturePower;
    finalFirepower += rupturePower;
    if (ruptureDamage > 0 && after.hp <= 0) { after.burn = 0; after.ignitedActions = 0; after.vulnerableTurns = 0; }
    const actionShockApplied = after.hp > 0 ? projectedShock : 0;
    after.actionShock += actionShockApplied;
    if (definition.moveAfter) after.distance = this.clampDistance(after.distance + definition.moveAfter);
    const movement = after.distance - before.distance;
    const next: SequenceCursor = { previousFamily: definition.family, previousPrimary: rules.primary, recoil: recoilAfter, incoming: rules.outgoing,
    distanceLossHundredths: cursor.distanceLossHundredths + (effectiveFirepower + effectiveBurnDamage) * range.percent };
    const detail = [`${definition.name}`, `${RANGE_NAMES[range.effective]} ${formatRangePenalty(range.percent)}`];
    if (definition.moveBefore) detail.push(`사격 전 ${Math.abs(movement)}m 전진`);
    if (hpDamage) detail.push(`체력 -${hpDamage}`);
    if (woundApplied) detail.push(`상처 +${woundApplied}`);
    if (actualBurnDamage) detail.push(`즉시 화상 피해 ${actualBurnDamage}`);
    if (burnApplied) detail.push(`화상 +${burnApplied}`);
    if (ignitionTriggered) detail.push(`점화 · 화상 잔량 ${after.burn}`);
    if (explosiveApplied) detail.push(`폭발 +${explosiveApplied}`);
    if (explosiveConsumed) detail.push(`기폭 ${explosiveConsumed} · 폭발 피해 ${explosionDamage}`);
    if (vulnerableTriggered) detail.push(after.hp > 0 ? `취약 ${after.vulnerableTurns}턴 발동` : '취약 발동');
    if (ruptureDamage) detail.push(`파열 피해 ${ruptureDamage}`);
    if (actionShockApplied) detail.push(`충격 +${actionShockApplied}`);
    if (shockFollowUpBonus) detail.push(`후속 충격 강화 +${shockFollowUpBonus}`);
    if (shockScaleBonus) detail.push(`누적 충격 증폭 +${shockScaleBonus}`);
    if (followUpBonus) detail.push(`후속 강화 +${followUpBonus}`);
    if (definition.moveAfter) detail.push(`사격 후 ${movement}m 후퇴`);
    const breakdown = { resolvedPrimary: rules.primary, resolvedPayload: payload, layerActivations: rules.activations,
      weaponFirepowerAdjustment: weapon.firepowerAdjustment, traitBonus: weaponEffect.traitBonus,
      primaryPayload: definition.primaryPayload, primaryPayloadValue: weaponEffect[definition.primaryPayload], ammoFirepower: definition.firepower, prePenaltyFirepower, effectiveFirepower,
      rangeBand: range.band, effectiveRangeBand: range.effective, recoilBefore,
      recoilGenerated: reducedRecoil, recoilAfter, recoilPenalty, recoilFirepowerReduction,
      playerDebuffFirepowerPenalty, playerDebuffFirepowerReduction,
      followUpBonus, conditionalBonus, vulnerableDamageBonus,
      rangePenaltyPercent: range.percent, distanceFirepowerReduction, shockFollowUpBonus, shockScaleBonus, projectedShock, detonationDamage, ruptureDamage: rupturePower, finalFirepower,
      burnBuildup, burnFollowUpPercent, burnScaleBonus, burnDamage, effectiveBurnDamage, ignitedBonus, directFirepower };
    return { shot: { ammoType, index, damage: hpDamage, hpDamage, woundApplied, explosiveApplied, explosiveConsumed, explosionDamage, vulnerableTriggered, ruptureDamage, actionShockApplied,
      burnApplied, burnDamage: actualBurnDamage, ignitionTriggered,
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
      if (after.intent) after.intent.countdown = action.suppressedIntent && !interrupted
        ? after.intent.cooldown : Math.max(1, after.intent.countdown - 1);
      if (!interrupted && action.selectedAction === 'attack') playerKilled = true;
      if (!interrupted && action.selectedAction === 'approach') {
        movement = action.movement;
        after.distance = this.clampDistance(after.distance - movement);
      }
    }
    // 한 탄창이 한 플레이어 턴이다. 발동 턴을 포함하며, 행동이 중단되어도 턴은 끝난다.
    after.vulnerableTurns = Math.max(0, after.vulnerableTurns - 1);
    // 충격으로 행동 자체가 중단되면 아직 다음 행동을 수행하지 않았으므로 점화를 보존한다.
    if (!interrupted) after.ignitedActions = Math.max(0, after.ignitedActions - 1);
    after.turnsElapsed += 1;
    if (after.trainingActions) {
      const remaining = after.trainingActions.slice(1);
      after.trainingActions = remaining.length ? remaining : createTrainingActions();
    }
    return { before, after, playerBefore, playerAfter, movement,
      selectedAction: action.selectedAction, threshold: action.threshold, interrupted,
      shockConsumed, shockRemaining: after.actionShock,
      playerKilled, intentResolved, intentDetail, suppressedIntent: action.suppressedIntent };
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
  const ids = getEnabledAttachmentIds(context.loadout ?? {}, context.playerState ?? createPlayerCombatState(), context.weaponId);
  const reduction = ids.flatMap(id => ATTACHMENT_DEFINITIONS[id].modifiers)
    .filter(mod => mod.kind === 'recoilReduction').reduce((sum, mod) => sum + mod.value, 0);
  void enemy;
  return Math.max(0.5, 1 - reduction * 0.15);
};
