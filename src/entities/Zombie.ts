import type { EnemyState, EnemyType } from '../combat/types';
import { createEnemyState } from '../data/enemyDefinitions';

export class Zombie {
  private state: EnemyState;

  constructor(type: EnemyType = 'normal') { this.state = createEnemyState(type); }

  get type(): EnemyType { return this.state.type; }
  get hp(): number { return this.state.hp; }
  get maxHp(): number { return this.state.maxHp; }
  get armor(): number { return this.state.armor; }
  get maxArmor(): number { return this.state.maxArmor; }
  get distance(): number { return this.state.distance; }
  get statuses(): Readonly<EnemyState['statuses']> { return this.state.statuses; }

  get isDead(): boolean {
    return this.state.hp <= 0;
  }

  snapshot(): EnemyState {
    return {
      ...this.state,
      intent: this.state.intent ? { ...this.state.intent } : undefined,
      statuses: { ...this.state.statuses, buildup: { ...this.state.statuses.buildup } },
    };
  }
  applyState(state: EnemyState): void {
    this.state = {
      ...state,
      intent: state.intent ? { ...state.intent } : undefined,
      statuses: { ...state.statuses, buildup: { ...state.statuses.buildup } },
    };
  }
}
