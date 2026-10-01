export type GamePhase = 'WEAPON_SELECTION' | 'CYLINDER_CHOICE' | 'AMMO_SELECTION' | 'LOADING' | 'FIRING' | 'ENEMY_ACTION' | 'ATTACHMENT_REWARD' | 'AMMO_REWARD' | 'ROUTE_SELECTION' | 'GAME_OVER' | 'VICTORY';

const ALLOWED_TRANSITIONS: Record<GamePhase, readonly GamePhase[]> = {
  WEAPON_SELECTION: ['AMMO_SELECTION'],
  CYLINDER_CHOICE: ['FIRING', 'AMMO_SELECTION'],
  AMMO_SELECTION: ['LOADING', 'GAME_OVER'],
  LOADING: ['CYLINDER_CHOICE', 'FIRING', 'GAME_OVER'],
  FIRING: ['ENEMY_ACTION', 'GAME_OVER'],
  ATTACHMENT_REWARD: ['AMMO_SELECTION', 'AMMO_REWARD'],
  ENEMY_ACTION: ['ATTACHMENT_REWARD', 'AMMO_SELECTION', 'AMMO_REWARD', 'GAME_OVER'],
  AMMO_REWARD: ['ROUTE_SELECTION', 'VICTORY'],
  ROUTE_SELECTION: ['AMMO_SELECTION', 'GAME_OVER'],
  GAME_OVER: ['WEAPON_SELECTION'],
  VICTORY: ['WEAPON_SELECTION'],
};

export class GameStateMachine {
  private current: GamePhase = 'WEAPON_SELECTION';

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
    this.current = 'WEAPON_SELECTION';
  }
}
