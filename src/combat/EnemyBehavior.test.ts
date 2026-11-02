import { describe, expect, it } from 'vitest';
import { CombatResolver, getActionShockThreshold, previewEnemyAction } from './CombatResolver';
import { createPlayerCombatState, getEnabledAttachmentIds, getMagazineCapacity } from './AttachmentLoadout';
import { advanceBehavior, behaviorPhase, disruptionTarget, guardBreakReady, transitionBehavior } from './EnemyBehavior';
import { Encounter } from './Encounter';
import { commitMagazine } from './AmmoRules';
import { ENEMY_BEHAVIORS } from '../data/enemyBehaviorDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { AMMO_ORDER } from '../data/ammoDefinitions';
import type { BehaviorArchetype } from './types';
import type { LoadoutSnapshot } from '../data/attachmentDefinitions';
import { behaviorView, disruptionText } from '../ui/EnemyBehaviorView';

const resolver = new CombatResolver(() => 0);
const prepared = (type: BehaviorArchetype) => resolver.resolveEnemyAction(createEnemyState(type)).after;

describe('행동 단계와 강한 초탄', () => {
  it('일반 감염체는 기존 강한 연계로 첫 탄창에 쓰러진다', () => {
    expect(resolver.resolveSequence(['plusP', 'plusP', 'kickback', 'ball'], createEnemyState('normal')).killed).toBe(true);
  });
  it('방패는 파괴를 요구하지 않으며 강한 폭발 빌드는 첫 탄창에 처치한다', () => {
    const result = resolver.resolveSequence(['stickyCharge', 'stickyCharge', 'stickyCharge', 'stickyCharge', 'flatNose'], createEnemyState('shieldCharger'),
      { loadout: { magazine: 'extendedMagazine' } });
    expect(result.killed).toBe(true);
    expect(result.shots).toHaveLength(5);
    expect(result.finalState.behavior?.phase).toBe('guard');
    expect(resolver.resolveEnemyAction(result.finalState).resolution).toBe('dead');
  });
  it('광란은 준비 노출 중 강한 연계로 적 행동 전에 처치할 수 있다', () => {
    const result = resolver.resolveSequence(['plusP', 'plusP', 'kickback', 'ball'], createEnemyState('frenzied'));
    expect(result.killed).toBe(true);
    expect(result.shots).toHaveLength(3);
    expect(result.unfiredRounds).toEqual(['ball']);
  });
  it('방어 중 직접 화력은 감소하되 피해와 상태를 차단하지 않는다', () => {
    const enemy = createEnemyState('shieldCharger');
    expect(resolver.resolveShot('ball', 0, enemy).hpDamage).toBeGreaterThan(0);
    for (const ammo of ['wounding', 'incendiary', 'flatNose', 'explosive'] as const) {
      const guarded = resolver.resolveShot(ammo, 0, enemy);
      const ordinary = resolver.resolveShot(ammo, 0, { ...enemy, behavior: undefined });
      expect([guarded.woundApplied, guarded.burnApplied, guarded.actionShockApplied, guarded.explosiveApplied])
        .toEqual([ordinary.woundApplied, ordinary.burnApplied, ordinary.actionShockApplied, ordinary.explosiveApplied]);
    }
  });
  it.each(AMMO_ORDER)('%s의 피해 내역에 단계 보정을 별도로 합산하고 예측과 실제 사격이 같다', ammo => {
    const enemy = { ...createEnemyState('shieldCharger'), hp: 1000, maxHp: 1000 };
    const result = resolver.resolveSequence(['relay', ammo, 'ball'], enemy);
    const volley = resolver.createVolley(commitMagazine(['relay', ammo, 'ball'], 4));
    let current = enemy;
    for (const expected of result.shots) {
      const shot = resolver.resolveVolleyShot(volley, current);
      expect(shot).toEqual(expected);
      const b = shot.breakdown;
      expect(b.prePenaltyFirepower - b.recoilFirepowerReduction - b.playerDebuffFirepowerReduction
        - b.distanceFirepowerReduction + b.behaviorDamageAdjustment).toBe(b.finalFirepower);
      current = shot.after;
    }
  });
  it('방어는 큰 피해 또는 세 번의 명중으로 무너지고 사격 중 배율은 바뀌지 않는다', () => {
    const enemy = createEnemyState('shieldCharger');
    const sequence = resolver.resolveSequence(['ball', 'ball', 'ball', 'ball'], enemy);
    expect(guardBreakReady(sequence.shots[1]!.after)).toBe(false);
    expect(guardBreakReady(sequence.shots[2]!.after)).toBe(true);
    expect(previewEnemyAction(sequence.shots[2]!.after).guardBroken).toBe(true);
    expect(sequence.shots.every(shot => shot.after.behavior?.phase === 'guard' && shot.breakdown.behaviorDamagePercent === 60)).toBe(true);
    expect(resolver.resolveEnemyAction(sequence.finalState)).toMatchObject({ resolution: 'guard-broken', movement: 0,
      after: { behavior: { phase: 'recovery', transition: 'guardBreak' } } });
    const heavyHit = resolver.resolveShot('ball', 0, { ...enemy, behavior: { ...enemy.behavior!, guardPressure: 17 } });
    expect(guardBreakReady(heavyHit.after)).toBe(true);
    expect(enemy.behavior?.guardHits).toBe(0);
  });
  it('직접 화력이 적어도 강한 폭발 피해는 방어를 무너뜨린다', () => {
    const sequence = resolver.resolveSequence(['stickyCharge', 'stickyCharge', 'stickyCharge', 'flatNose'], createEnemyState('shieldCharger'));
    expect(sequence.killed).toBe(false);
    expect(guardBreakReady(sequence.finalState)).toBe(true);
    expect(resolver.resolveEnemyAction(sequence.finalState).resolution).toBe('guard-broken');
  });
  it('같은 거리·같은 탄창은 돌진 준비 노출에서 더 효율적이다', () => {
    const guard = { ...createEnemyState('shieldCharger'), hp: 1000, maxHp: 1000 };
    const windup = { ...prepared('shieldCharger'), hp: 1000, maxHp: 1000, distance: guard.distance };
    const rounds = ['plusP', 'plusP', 'kickback', 'ball'] as const;
    expect(resolver.resolveSequence(rounds, windup).totalHpDamage).toBeGreaterThan(resolver.resolveSequence(rounds, guard).totalHpDamage * 2);
  });
  it('단계 지속시간은 데이터의 자기 행동 기회 수로만 센다', () => {
    const enemy = createEnemyState('shieldCharger');
    const original = ENEMY_BEHAVIORS.shieldCharger.phases.guard!.opportunities;
    try {
      ENEMY_BEHAVIORS.shieldCharger.phases.guard!.opportunities = 2;
      transitionBehavior(enemy, 'guard', 'cycle');
      advanceBehavior(enemy);
      expect(enemy.behavior).toMatchObject({ phase: 'guard', remaining: 1 });
      advanceBehavior(enemy);
      expect(enemy.behavior?.phase).toBe('windup');
    } finally { ENEMY_BEHAVIORS.shieldCharger.phases.guard!.opportunities = original; }
  });
});

describe('중단·후퇴·치명 공격의 공정성', () => {
  it('돌진을 강타탄 하나로 중단하고 초과 충격과 취약 수명을 보존한다', () => {
    const enemy = { ...prepared('shieldCharger'), vulnerableTurns: 2 };
    const shot = resolver.resolveShot('hammer', 0, enemy);
    const action = resolver.resolveEnemyAction({ ...shot.after, actionShock: shot.after.actionShock + 2 });
    expect(action).toMatchObject({ selectedAction: 'charge', interrupted: true, movement: 0, playerKilled: false,
      shockConsumed: 6, shockRemaining: 2, after: { vulnerableTurns: 1, behavior: { phase: 'recovery', transition: 'shock' } } });
    expect(action.after.distance).toBe(enemy.distance);
  });
  it('후퇴탄 하나는 돌진 후 거리를 늘리며 충격 없이 살아남는다', () => {
    const enemy = prepared('shieldCharger');
    const noRetreat = resolver.resolveEnemyAction(enemy);
    const shot = resolver.resolveShot('retreat', 0, enemy);
    const retreat = resolver.resolveEnemyAction(shot.after);
    expect(noRetreat).toMatchObject({ movement: 5, playerKilled: false });
    expect(noRetreat.after.distance).toBe(.5);
    expect(retreat).toMatchObject({ movement: 5, interrupted: false, playerKilled: false });
    expect(retreat.after.distance).toBe(2.5);
    expect(retreat.after.actionShock).toBe(0);
  });
  it('광란의 예고된 근접 치명 공격을 기존 임계치로 중단한다', () => {
    const enemy = { ...createEnemyState('frenzied'), distance: .5 };
    expect(previewEnemyAction(enemy).selectedAction).toBe('attack');
    expect(resolver.resolveEnemyAction(enemy).playerKilled).toBe(true);
    const shot = resolver.resolveSequence(['hammer', 'flatNose'], enemy);
    const action = resolver.resolveEnemyAction(shot.finalState);
    expect(action).toMatchObject({ selectedAction: 'attack', interrupted: true, shockConsumed: 8, playerKilled: false,
      after: { behavior: { phase: 'recovery' } } });
  });
  it.each(['shieldCharger', 'frenzied'] as const)('%s의 돌격으로 근접에 도달해도 같은 기회에는 죽이지 않는다', type => {
    const enemy = type === 'shieldCharger' ? prepared(type) : createEnemyState(type);
    enemy.distance = 2;
    const action = resolver.resolveEnemyAction(enemy);
    expect(action.playerKilled).toBe(false);
    expect(action.after.distance).toBe(0);
    expect(action.after.behavior?.phase).toBe('recovery');
    const recovery = resolver.resolveEnemyAction(action.after);
    expect(recovery).toMatchObject({ executedAction: 'recover', playerKilled: false });
    expect(previewEnemyAction(recovery.after).selectedAction).toBe('attack');
    expect(resolver.resolveEnemyAction(recovery.after).playerKilled).toBe(true);
  });
  it('예고된 치명 공격은 후퇴로 사거리를 벗어나면 접근만 하고 단계를 보류한다', () => {
    const enemy = { ...createEnemyState('frenzied'), distance: .5 };
    const shot = resolver.resolveShot('retreat', 0, enemy);
    const action = resolver.resolveEnemyAction(shot.after);
    expect(action).toMatchObject({ selectedAction: 'attack', executedAction: 'approach', resolution: 'retreat-delayed', playerKilled: false });
    expect(action.after.behavior?.phase).toBe('windup');
  });
  it.each(['shieldCharger', 'frenzied', 'disruptor'] as const)('%s는 빈 탄창을 반복해도 유리한 단계를 공짜로 유지할 수 없다', type => {
    let enemy = createEnemyState(type);
    let died = false;
    for (let turn = 0; turn < 30 && !died; turn++) {
      const before = previewEnemyAction(enemy);
      const action = resolver.resolveEnemyAction(enemy);
      if (action.playerKilled) expect(before.selectedAction).toBe('attack');
      enemy = action.after;
      died = action.playerKilled;
    }
    expect(died).toBe(true);
  });
  it.each(['shieldCharger', 'frenzied', 'disruptor'] as const)('%s의 점화는 공격 능력을 일반 접근으로 바꾸며 충격 중단 때는 남는다', type => {
    const enemy = type === 'frenzied' ? createEnemyState(type) : prepared(type);
    enemy.ignitedActions = 1;
    const preview = previewEnemyAction(enemy);
    expect(preview.suppressedIntent).toBeDefined();
    expect(preview.selectedAction).toBe('approach');
    const interrupted = resolver.resolveEnemyAction({ ...enemy, actionShock: getActionShockThreshold(enemy) });
    expect(interrupted.after.ignitedActions).toBe(1);
    const action = resolver.resolveEnemyAction(enemy);
    expect(action).toMatchObject({ executedAction: 'approach', playerKilled: false, after: { ignitedActions: 0, behavior: { phase: 'recovery' } } });
  });
});

describe('장착물 교란과 복원', () => {
  const loadout: LoadoutSnapshot = { muzzle: 'compensator', magazine: 'highCapacityMagazine', rail: 'tacticalLight' };
  it('최초 예고부터 실제 장착물과 1턴 지속시간을 알려 주며 준비 뒤에만 발동한다', () => {
    const enemy = createEnemyState('disruptor');
    expect(behaviorView(enemy, loadout)?.detail).toBe('총구 봉쇄 1턴');
    expect(behaviorView(enemy, loadout, undefined, 'p220', 2, 2)?.timing).toBe('교란 4턴 뒤');
    expect(behaviorView({ ...enemy, telegraphedAction: 'attack', distance: .5 }, loadout)?.timing).toBe('');
    const prepare = resolver.resolveEnemyAction(enemy, undefined, loadout);
    expect(prepare.executedAction).toBe('prepareDisruption');
    expect(prepare.playerAfter.disabledSlots).toEqual({});
    expect(previewEnemyAction(prepare.after).selectedAction).toBe('disrupt');
    const stopped = resolver.resolveEnemyAction(resolver.resolveShot('hammer', 0, prepare.after).after, undefined, loadout);
    expect(stopped.interrupted).toBe(true);
    expect(stopped.playerAfter.disabledSlots).toEqual({});
  });
  it('실제 장착물 하나만 비활성화하고 다음 전역 기회에 복구하며 용량과 소유권을 보존한다', () => {
    const action = resolver.resolveEnemyAction(prepared('disruptor'), undefined, loadout);
    expect(action.playerAfter.disabledSlots).toEqual({ muzzle: 1 });
    expect(getEnabledAttachmentIds(loadout, action.playerAfter)).not.toContain('compensator');
    expect(getMagazineCapacity(loadout, action.playerAfter)).toBe(6);
    const restored = resolver.resolveEnemyAction(action.after, action.playerAfter, loadout);
    expect(restored.playerAfter.disabledSlots).toEqual({});
    expect(getEnabledAttachmentIds(loadout, restored.playerAfter)).toContain('compensator');
    expect(loadout.muzzle).toBe('compensator');
  });
  it('빈 장비·용량 장착물만 있음·호환되지 않음에서는 예고한 거리 교란으로 대체한다', () => {
    for (const [equipment, weapon] of [[{}, 'p220'], [{ magazine: 'highCapacityMagazine' }, 'p220'], [{ magazine: 'extendedMagazine' }, 'm500']] as const) {
      expect(disruptionText(equipment, undefined, weapon)).toBe('거리 교란 1턴');
      const action = resolver.resolveEnemyAction(prepared('disruptor'), undefined, equipment, weapon);
      expect(action.playerAfter).toMatchObject({ disabledSlots: {}, rangePenaltySteps: 1, rangePenaltyTurns: 1 });
      expect(resolver.resolveEnemyAction(action.after, action.playerAfter).playerAfter.rangePenaltySteps).toBe(0);
    }
  });
  it('이미 봉쇄된 장착물은 반복 봉쇄하지 않고 더 긴 기존 약화도 줄이지 않는다', () => {
    const player = { ...createPlayerCombatState(), disabledSlots: { muzzle: 2 }, rangePenaltySteps: 2, rangePenaltyTurns: 4 };
    expect(disruptionTarget(loadout, player)).toBe('rail');
    const action = resolver.resolveEnemyAction(prepared('disruptor'), player, {});
    expect(action.playerAfter).toMatchObject({ disabledSlots: { muzzle: 1 }, rangePenaltySteps: 2, rangePenaltyTurns: 3 });
  });
  it('후퇴로 교란 사거리를 벗어나면 접근하고 준비 완료 단계는 유지한다', () => {
    const enemy = prepared('disruptor');
    const shots = resolver.resolveSequence(['retreat', 'retreat'], enemy);
    const action = resolver.resolveEnemyAction(shots.finalState, undefined, loadout);
    expect(action).toMatchObject({ selectedAction: 'disrupt', executedAction: 'approach', resolution: 'retreat-delayed', playerAfter: { disabledSlots: {} } });
    expect(action.after.behavior?.phase).toBe('disruption');
  });
});

describe('독립 상태와 교대 행동', () => {
  it('스냅샷·피해·예측·행동 전환이 다른 감염체나 원본에 전파되지 않는다', () => {
    const encounter = new Encounter(['shieldCharger', 'shieldCharger']);
    const [first, second] = encounter.living;
    const untouched = second!.zombie.snapshot();
    const copy = first!.zombie.snapshot();
    copy.behavior!.remaining = 99;
    expect(first!.zombie.snapshot().behavior!.remaining).toBe(1);
    const shot = resolver.resolveShot('ball', 0, first!.zombie.snapshot());
    encounter.applyShot(first!.id, shot);
    expect(second!.zombie.snapshot()).toEqual(untouched);
    first!.zombie.applyState(resolver.resolveEnemyAction(first!.zombie.snapshot()).after);
    encounter.finishOpportunity(first!.id);
    expect(first!.zombie.snapshot().behavior?.phase).toBe('windup');
    expect(second!.zombie.snapshot()).toEqual(untouched);
    expect(encounter.nextActorId).toBe(second!.id);
    expect(createEnemyState('shieldCharger').behavior?.guardHits).toBe(0);
  });
  it('두 적이 근접 치명 공격을 예고해도 예정된 한 마리만 행동하고 중단 뒤 다른 차례가 된다', () => {
    const encounter = new Encounter(['frenzied', 'shieldCharger']);
    for (const enemy of encounter.living) enemy.zombie.applyState({ ...enemy.zombie.snapshot(), distance: .5, actionShock: 8 });
    encounter.announceActions();
    const actor = encounter.living.find(enemy => enemy.id === encounter.nextActorId)!;
    const waiting = encounter.living.find(enemy => enemy !== actor)!;
    const before = waiting.zombie.snapshot();
    const action = resolver.resolveEnemyAction(actor.zombie.snapshot());
    actor.zombie.applyState(action.after);
    encounter.finishOpportunity(actor.id);
    expect(action.interrupted).toBe(true);
    expect(waiting.zombie.snapshot()).toEqual(before);
    expect(encounter.nextActorId).toBe(waiting.id);
    expect(behaviorPhase(actor.zombie.snapshot())?.action).toBe('recover');
  });
});
