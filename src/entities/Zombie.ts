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

  snapshot(): EnemyState { return { ...this.state, statuses: { ...this.state.statuses } }; }
  applyState(state: EnemyState): void { this.state = { ...state, statuses: { ...state.statuses } }; }
}
