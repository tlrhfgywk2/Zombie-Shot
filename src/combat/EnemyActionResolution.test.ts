import { describe, expect, it } from 'vitest';
import { CombatResolver, getActionShockThreshold, previewEnemyAction, isEnemyActionInRange } from './CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import { createTrainingActions } from '../data/trainingEnemy';
import { ENEMY_RANGED_ACTIONS } from '../data/enemyActionDefinitions';
import { Zombie } from '../entities/Zombie';
import { Player } from '../entities/Player';
import type { EnemyIntentType, EnemyState } from './types';

const resolver = new CombatResolver(() => 0);
const target = (extra: Partial<EnemyState> = {}): EnemyState => ({ ...createEnemyState('normal'), hp: 500, maxHp: 500, ...extra });
const ranged = (action: EnemyIntentType, distance = ENEMY_RANGED_ACTIONS[action].maxRange): EnemyState =>
  target({ distance, trainingActions: [action, 'sonicPulse', 'approach', 'contaminate', 'groundShock'] });

describe('근접 공격의 지연과 충격 회복', () => {
  it.each(['normal', 'brute', 'tough'] as const)('%s도 후퇴 후 접근하고 같은 치명 공격을 예고한다', type => {
    const enemy = { ...createEnemyState(type), hp: 500, distance: 0 };
    const volley = resolver.resolveSequence(['retreat'], enemy);
    expect(previewEnemyAction(volley.finalState)).toMatchObject({ selectedAction: 'attack', rangeDelayed: true });
    const delayed = resolver.resolveEnemyAction(volley.finalState);
    expect(delayed).toMatchObject({ selectedAction: 'attack', executedAction: 'approach', resolution: 'retreat-delayed', playerKilled: false });
    let next = delayed.after;
    while (next.distance >= 1) {
      expect(next.delayedAction).toBe('attack');
      next = resolver.resolveEnemyAction(next).after;
    }
    expect(previewEnemyAction(next).selectedAction).toBe('attack');
    expect(resolver.resolveEnemyAction(next).playerKilled).toBe(true);
  });
  it.each(['normal', 'brute', 'tough'] as const)('%s의 높은 임계치도 보존하며 충격 뒤 근접이면 다시 치명 공격을 예고한다', type => {
    const enemy = { ...createEnemyState(type), distance: 0.5 };
    const threshold = 8 + enemy.shockResistance;
    expect(getActionShockThreshold(enemy)).toBe(threshold);
    expect(resolver.resolveEnemyAction({ ...enemy, actionShock: threshold - 1 }).playerKilled).toBe(true);
    const stopped = resolver.resolveEnemyAction({ ...enemy, actionShock: threshold });
    expect(stopped).toMatchObject({ interrupted: true, resolution: 'shock-nullified', movement: 0, playerKilled: false });
    expect(stopped.executedAction).toBeUndefined();
    expect(previewEnemyAction(stopped.after)).toMatchObject({ selectedAction: 'attack' });
    expect(resolver.resolveEnemyAction(stopped.after)).toMatchObject({ executedAction: 'attack', playerKilled: true });
  });
  it('충격 중단 뒤 후퇴하면 접근하고 근접에 도달할 때 치명 공격을 예고한다', () => {
    const stopped = resolver.resolveEnemyAction(target({ distance: 0, actionShock: 8 }));
    const moved = resolver.resolveSequence(['retreat', 'retreat', 'retreat'], stopped.after).finalState;
    const recovered = resolver.resolveEnemyAction(moved);
    expect(recovered).toMatchObject({ resolution: 'retreat-delayed', movement: 2 });
    let enemy = recovered.after;
    for (let index = 0; index < 2; index++) {
      expect(previewEnemyAction(enemy).selectedAction).toBe('approach');
      expect(enemy.delayedAction).toBe('attack');
      enemy = resolver.resolveEnemyAction(enemy).after;
    }
    expect(previewEnemyAction(enemy).selectedAction).toBe('attack');
  });
  it('충격으로 다시 중단해도 근접이면 치명 공격 예고를 유지한다', () => {
    const stopped = resolver.resolveEnemyAction(target({ distance: 0.5, actionShock: 16 }));
    const stoppedAgain = resolver.resolveEnemyAction(stopped.after);
    expect(stoppedAgain).toMatchObject({ interrupted: true, after: { delayedAction: 'attack', telegraphedAction: 'attack' } });
    expect(resolver.resolveEnemyAction(stoppedAgain.after).playerKilled).toBe(true);
  });
});

describe('능력별 사거리와 원거리 행동', () => {
  it('능력별 설정값을 바꾸면 예고와 사거리 판정이 함께 바뀐다', () => {
    const original = ENEMY_RANGED_ACTIONS.contaminate.maxRange;
    try {
      ENEMY_RANGED_ACTIONS.contaminate.maxRange = 10;
      expect(previewEnemyAction(ranged('contaminate', 10)).selectedAction).toBe('contaminate');
      expect(isEnemyActionInRange(ranged('contaminate', 10.1), 'contaminate')).toBe(false);
      expect(isEnemyActionInRange(ranged('contaminate', 0), 'contaminate')).toBe(false);
    } finally { ENEMY_RANGED_ACTIONS.contaminate.maxRange = original; }
  });
  it('전용 능력의 후퇴 지연은 재사용 대기를 소비하지 않고 실행 뒤에만 갱신한다', () => {
    const volley = resolver.resolveSequence(['retreat', 'retreat'], { ...createEnemyState('contaminator'), hp: 500 });
    const delayed = resolver.resolveEnemyAction(volley.finalState);
    expect(delayed.after.intent?.countdown).toBe(1);
    expect(delayed.after.telegraphedAction).toBe('contaminate');
    const retried = resolver.resolveEnemyAction(delayed.after);
    expect(retried.intentResolved).toBe('contaminate');
    expect(retried.after.intent?.countdown).toBe(3);
  });
  it.each(['contaminate', 'groundShock', 'sonicPulse'] as const)('%s는 사거리 안에서 후퇴해도 원래 능력을 실행한다', type => {
    const enemy = { ...ranged(type, ENEMY_RANGED_ACTIONS[type].maxRange - 2), advancePerTurn: 0.5 };
    const volley = resolver.resolveSequence(['retreat'], enemy);
    const action = resolver.resolveEnemyAction(volley.finalState);
    expect(action).toMatchObject({ resolution: 'normal', selectedAction: type, executedAction: type, intentResolved: type, movement: 0 });
  });
  it.each(['contaminate', 'groundShock'] as const)('%s는 사거리 밖 후퇴 시 접근하고 같은 능력을 재시도한다', type => {
    const volley = resolver.resolveSequence(['retreat'], ranged(type));
    const delayed = resolver.resolveEnemyAction(volley.finalState);
    expect(delayed).toMatchObject({ resolution: 'retreat-delayed', selectedAction: type, executedAction: 'approach', movement: 2 });
    expect(delayed.intentResolved).toBeUndefined();
    expect(delayed.after.delayedAction).toBe(type);
    expect(previewEnemyAction(delayed.after).selectedAction).toBe(type);
    expect(resolver.resolveEnemyAction(delayed.after).intentResolved).toBe(type);
  });
  it.each(['contaminate', 'groundShock', 'sonicPulse'] as const)('%s 충격 중단 뒤 즉시 동일 능력을 재선택하지 않고 다음 기회 후 제한을 해제한다', type => {
    const enemy = ranged(type, 4);
    const stopped = resolver.resolveEnemyAction({ ...enemy, actionShock: getActionShockThreshold(enemy) });
    expect(stopped).toMatchObject({ resolution: 'shock-nullified', interrupted: true, movement: 0, after: { excludedAction: type } });
    expect(stopped.executedAction).toBeUndefined();
    expect(stopped.after.delayedAction).toBeUndefined();
    expect(previewEnemyAction(stopped.after).selectedAction).not.toBe(type);
    const next = resolver.resolveEnemyAction(stopped.after);
    expect(next.after.excludedAction).toBeUndefined();
    expect(next.selectedAction).not.toBe(type);
  });
  it('새 무작위 묶음 첫 능력이 같은 경우에도 한 번 제외하며 이후 다시 사용한다', () => {
    const action = createTrainingActions(() => 0)[0]!;
    const enemy = target({ distance: 4, trainingActions: [action] });
    const stopped = resolver.resolveEnemyAction({ ...enemy, actionShock: getActionShockThreshold(enemy) });
    expect(stopped.after.trainingActions?.[0]).toBe(action);
    expect(stopped.after.telegraphedAction).not.toBe(action);
    const next = resolver.resolveEnemyAction(stopped.after);
    expect(next.after.telegraphedAction).toBe(action);
  });
  it('적 전용 능력을 중단해도 다른 적의 능력을 새로 부여하지 않는다', () => {
    const enemy = createEnemyState('contaminator');
    const stopped = resolver.resolveEnemyAction({ ...enemy, actionShock: getActionShockThreshold(enemy) });
    expect(previewEnemyAction(stopped.after).selectedAction).toBe('approach');
    expect(stopped.after.intent?.type).toBe('contaminate');
  });
  it('보류된 능력이 아직 사거리 밖이면 유효한 접근만 예고하며 원래 능력을 보존한다', () => {
    const volley = resolver.resolveSequence(['retreat', 'retreat', 'retreat'], ranged('groundShock'));
    let enemy = resolver.resolveEnemyAction(volley.finalState).after;
    expect(enemy).toMatchObject({ distance: 8, delayedAction: 'groundShock', telegraphedAction: 'approach' });
    for (let index = 0; index < 2; index++) {
      expect(previewEnemyAction(enemy).selectedAction).toBe('approach');
      enemy = resolver.resolveEnemyAction(enemy).after;
      expect(enemy.delayedAction).toBe('groundShock');
    }
    expect(enemy.telegraphedAction).toBe('groundShock');
  });
  it('최초 예고는 현재 거리에서 유효한 능력만 선택하고 장거리 공명은 유지한다', () => {
    for (const distance of [2, 4, 6, 8, 10, 12]) {
      const enemy = ranged('groundShock', distance);
      expect(isEnemyActionInRange(enemy, previewEnemyAction(enemy).selectedAction)).toBe(true);
    }
    expect(previewEnemyAction(ranged('sonicPulse', 12)).selectedAction).toBe('sonicPulse');
    expect(previewEnemyAction(createEnemyState('groundshaker')).selectedAction).toBe('approach');
  });
  it('미지원 보류 능력은 폐기하고 근접 도달 시 원거리 보류도 정리한다', () => {
    const unsupported = target({ delayedAction: 'contaminate', distance: 6 });
    const cleaned = resolver.resolveEnemyAction(unsupported).after;
    expect(cleaned.delayedAction).toBeUndefined();
    const melee = resolver.resolveEnemyAction(ranged('groundShock', 0));
    expect(melee).toMatchObject({ selectedAction: 'attack', playerKilled: true });
    const delayed = target({ distance: 1, delayedAction: 'groundShock', trainingActions: ['groundShock'], telegraphedAction: 'approach' });
    const reached = resolver.resolveEnemyAction(delayed).after;
    expect(reached).toMatchObject({ distance: 0, telegraphedAction: 'attack' });
    expect(reached.delayedAction).toBeUndefined();
  });
});

describe('사격 순서·우선순위·상태 수명', () => {
  it.each([target({ distance: 0 }), ranged('contaminate')])('후퇴와 충격 동시 발생 시 이동은 유지하고 충격이 접근을 차단한다', enemy => {
    const volley = resolver.resolveSequence(['retreat', 'hammer', 'hammer'], enemy);
    const result = resolver.resolveEnemyAction(volley.finalState);
    expect(result).toMatchObject({ resolution: 'shock-nullified', interrupted: true, movement: 0, playerKilled: false });
    expect(result.after.distance).toBe(volley.finalState.distance);
    expect(result.intentResolved).toBeUndefined();
  });
  it('후퇴와 전진을 여러 번 적용해도 최종 거리에서만 판정한다', () => {
    const enemy = ranged('contaminate');
    const volley = resolver.resolveSequence(['retreat', 'retreat', 'advance', 'advance'], enemy);
    expect(volley.shots.map(shot => shot.after.distance)).toEqual([10, 12, 10, 8]);
    expect(resolver.resolveEnemyAction(volley.finalState).intentResolved).toBe('contaminate');
    const melee = resolver.resolveSequence(['retreat', 'advance'], target({ distance: 0 }));
    expect(resolver.resolveEnemyAction(melee.finalState).playerKilled).toBe(true);
  });
  it('일반 피해탄은 예고와 선택 순서를 변경하지 않고 탄약은 실제 발사만 소비한다', () => {
    const enemy = ranged('contaminate', 4);
    const player = new Player();
    player.addAmmo('ball'); player.addAmmo('ball');
    const volley = resolver.resolveSequence(player.magazine.getRounds(), enemy);
    for (const shot of volley.shots) {
      expect(shot.after.telegraphedAction).toBe('contaminate');
      expect(shot.after.trainingActions).toEqual(enemy.trainingActions);
      player.fireRound(shot);
    }
    expect(player.magazine.size).toBe(0);
    expect(resolver.resolveEnemyAction(volley.finalState)).toMatchObject({ intentResolved: 'contaminate', movement: 0 });
  });
  it('전진으로 근접에 들어가도 기존 예고와 별도 공격을 같은 기회에 실행하지 않는다', () => {
    const volley = resolver.resolveSequence(['advance'], ranged('groundShock', 2));
    const result = resolver.resolveEnemyAction(volley.finalState);
    expect(result).toMatchObject({ executedAction: 'approach', movement: 0, playerKilled: false, after: { telegraphedAction: 'attack' } });
    expect(result.after.delayedAction).toBeUndefined();
  });
  it('초과 충격과 취약·점화의 기존 턴 소비를 보존한다', () => {
    const enemy = ranged('contaminate', 4);
    const result = resolver.resolveEnemyAction({ ...enemy, actionShock: 8, vulnerableTurns: 2 });
    expect(result).toMatchObject({ shockConsumed: 6, shockRemaining: 2, after: { vulnerableTurns: 1, turnsElapsed: 1 } });
  });
  it('사망 시 능력·이동·플레이어 효과 갱신 없이 보류 상태를 정리한다', () => {
    const dead = resolver.resolveEnemyAction(target({ hp: 0, distance: 0, actionShock: 20, delayedAction: 'attack', excludedAction: 'contaminate' }));
    expect(dead).toMatchObject({ resolution: 'dead', movement: 0, interrupted: false, playerKilled: false, after: { turnsElapsed: 0 } });
    expect(dead.playerAfter).toEqual(dead.playerBefore);
    expect(dead.after.delayedAction).toBeUndefined();
    const volley = resolver.resolveSequence(['ball', 'hammer'], target({ hp: 1, distance: 0 }));
    expect(volley.unfiredRounds).toEqual(['hammer']);
    expect(resolver.resolveEnemyAction(volley.finalState).resolution).toBe('dead');
  });
  it('재시작과 새 조우에서 사용하는 새 표적은 보류·회복·제외 상태를 상속하지 않는다', () => {
    const old = new Zombie();
    old.applyState(resolver.resolveEnemyAction(target({ distance: 0, actionShock: 8 })).after);
    expect(old.snapshot().delayedAction).toBe('attack');
    for (const enemy of [new Zombie(), new Zombie('groundshaker'), new Zombie('normal', true)]) {
      expect(enemy.snapshot().delayedAction).toBeUndefined();
      expect(enemy.snapshot().excludedAction).toBeUndefined();
      expect(enemy.snapshot().telegraphedAction).toBeUndefined();
    }
  });
});
