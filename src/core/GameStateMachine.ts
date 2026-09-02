export type GamePhase = 'AMMO_SELECTION' | 'LOADING' | 'FIRING' | 'ENEMY_ACTION' | 'ROUTE_SELECTION' | 'GAME_OVER' | 'VICTORY';

const ALLOWED_TRANSITIONS: Record<GamePhase, readonly GamePhase[]> = {
  AMMO_SELECTION: ['LOADING', 'GAME_OVER'],
  LOADING: ['FIRING', 'GAME_OVER'],
  FIRING: ['ENEMY_ACTION', 'GAME_OVER'],
  ENEMY_ACTION: ['AMMO_SELECTION', 'ROUTE_SELECTION', 'GAME_OVER', 'VICTORY'],
  ROUTE_SELECTION: ['AMMO_SELECTION', 'GAME_OVER'],
  GAME_OVER: ['AMMO_SELECTION'],
  VICTORY: ['AMMO_SELECTION'],
};

export class GameStateMachine {
  private current: GamePhase = 'AMMO_SELECTION';

  get phase(): GamePhase {
    return this.current;
  }

  canTransition(next: GamePhase): boolean {
    return ALLOWED_TRANSITIONS[this.current].includes(next);
  }

  transition(next: GamePhase): void {
    if (!this.canTransition(next)) {
      throw new Error(`허용되지 않은 상태 전환: ${this.current} → ${next}`);
    }
    this.current = next;
  }

  reset(): void {
    this.current = 'AMMO_SELECTION';
  }
}
