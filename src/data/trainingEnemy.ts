import type { EnemyActionType, EnemyState } from '../combat/types';
import { createEnemyState } from './enemyDefinitions';

export const createTrainingActions = (random = Math.random): EnemyActionType[] => {
  const actions: EnemyActionType[] = ['approach', 'contaminate', 'groundShock', 'sonicPulse'];
  for (let index = actions.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [actions[index], actions[other]] = [actions[other]!, actions[index]!];
  }
  return actions;
};

export const createTrainingEnemy = (): EnemyState => ({
  ...createEnemyState('normal'), hp: 10000, maxHp: 10000, distance: 12,
  trainingActions: createTrainingActions(),
});
