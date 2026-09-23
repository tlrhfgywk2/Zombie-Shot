import type { EnemyState, EnemyType } from '../combat/types';
import { createEnemyState } from '../data/enemyDefinitions';

export class Zombie {
  private state: EnemyState;

  constructor(type: EnemyType = 'normal') { this.state = createEnemyState(type); }

  get type(): EnemyType { return this.state.type; }
  get hp(): number { return this.state.hp; }
  get maxHp(): number { return this.state.maxHp; }
  get wound(): number { return this.state.wound; }
  get distance(): number { return this.state.distance; }

  get isDead(): boolean {
    return this.state.hp <= 0;
  }

  snapshot(): EnemyState {
    return {
      ...this.state,
      intent: this.state.intent ? { ...this.state.intent } : undefined,
    };
  }
  applyState(state: EnemyState): void {
    this.state = {
      ...state,
      intent: state.intent ? { ...state.intent } : undefined,
    };
  }
}
