export type GamePhase = 'MODE_SELECTION' | 'WEAPON_SELECTION' | 'CYLINDER_CHOICE' | 'AMMO_SELECTION' | 'LOADING' | 'FIRING' | 'ENEMY_ACTION' | 'ATTACHMENT_REWARD' | 'ROUTE_SELECTION' | 'GAME_OVER' | 'VICTORY';

const ALLOWED_TRANSITIONS: Record<GamePhase, readonly GamePhase[]> = {
  MODE_SELECTION: ['WEAPON_SELECTION'],
  WEAPON_SELECTION: ['AMMO_SELECTION', 'MODE_SELECTION'],
  CYLINDER_CHOICE: ['FIRING'],
  AMMO_SELECTION: ['LOADING', 'ENEMY_ACTION', 'GAME_OVER', 'MODE_SELECTION'],
  LOADING: ['CYLINDER_CHOICE', 'FIRING', 'GAME_OVER'],
  FIRING: ['ENEMY_ACTION', 'GAME_OVER'],
  ATTACHMENT_REWARD: ['AMMO_SELECTION', 'ROUTE_SELECTION', 'VICTORY', 'MODE_SELECTION'],
  ENEMY_ACTION: ['ATTACHMENT_REWARD', 'AMMO_SELECTION', 'ROUTE_SELECTION', 'VICTORY', 'GAME_OVER'],
  ROUTE_SELECTION: ['AMMO_SELECTION', 'GAME_OVER', 'MODE_SELECTION'],
  GAME_OVER: ['AMMO_SELECTION', 'MODE_SELECTION'],
  VICTORY: ['AMMO_SELECTION', 'MODE_SELECTION'],
};

export class GameStateMachine {
  private current: GamePhase = 'MODE_SELECTION';

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

  reset(phase: 'MODE_SELECTION' | 'AMMO_SELECTION' = 'MODE_SELECTION'): void {
    this.current = phase;
  }
}
