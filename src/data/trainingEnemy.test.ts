import { describe, expect, it } from 'vitest';
import { CombatResolver, previewEnemyAction } from '../combat/CombatResolver';
import { createTrainingActions, createTrainingEnemy } from './trainingEnemy';
import { ENCOUNTER_STAGES } from './encounterDefinitions';

describe('단일 훈련 표적', () => {
  it('체력 10000인 표적 하나와 모든 원거리 행동을 섞는다', () => {
    expect(ENCOUNTER_STAGES).toHaveLength(1);
    expect(ENCOUNTER_STAGES[0]?.normal.roster).toEqual(['normal']);
    expect(createTrainingEnemy()).toMatchObject({ hp: 10000, maxHp: 10000 });
    const actions = createTrainingActions(() => 0);
    expect(new Set(actions)).toEqual(new Set(['approach', 'contaminate', 'groundShock', 'sonicPulse']));
    expect(actions[0]).not.toBe('approach');
  });

  it('예고와 실제 행동이 일치하고 한 묶음을 마치면 새 순서를 만든다', () => {
    const resolver = new CombatResolver();
    let enemy = { ...createTrainingEnemy(), trainingActions: createTrainingActions(() => 0) };
    for (const expected of enemy.trainingActions) {
      const original = enemy.trainingActions;
      expect(previewEnemyAction(enemy).selectedAction).toBe(expected);
      const result = resolver.resolveEnemyAction(enemy);
      expect(result.selectedAction).toBe(expected);
      expect(enemy.trainingActions).toBe(original);
      enemy = { ...result.after, trainingActions: [...result.after.trainingActions!] };
    }
    expect(enemy.trainingActions).toHaveLength(4);
    expect(resolver.resolveEnemyAction({ ...enemy, distance: 0 })).toMatchObject({ selectedAction: 'attack', playerKilled: true });
  });
});
