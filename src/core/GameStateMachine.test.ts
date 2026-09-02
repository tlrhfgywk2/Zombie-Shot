import { describe, expect, it } from 'vitest';
import { GameStateMachine } from './GameStateMachine';

describe('GameStateMachine', () => {
  it('정상 전투 사이클을 명시적인 순서로 전환한다', () => {
    const state = new GameStateMachine();
    state.transition('LOADING');
    state.transition('FIRING');
    state.transition('ENEMY_ACTION');
    state.transition('AMMO_SELECTION');
    expect(state.phase).toBe('AMMO_SELECTION');
  });

  it('허용되지 않은 상태 전환을 거부한다', () => {
    const state = new GameStateMachine();
    expect(() => state.transition('FIRING')).toThrow('허용되지 않은 상태 전환');
  });

  it('게임 오버에서 재시작할 수 있다', () => {
    const state = new GameStateMachine();
    state.transition('GAME_OVER');
    state.transition('AMMO_SELECTION');
    expect(state.phase).toBe('AMMO_SELECTION');
  });

  it('마지막 웨이브 완료 후 다시 시작할 수 있다', () => {
    const state = new GameStateMachine();
    state.transition('LOADING');
    state.transition('FIRING');
    state.transition('ENEMY_ACTION');
    state.transition('VICTORY');
    state.transition('AMMO_SELECTION');
    expect(state.phase).toBe('AMMO_SELECTION');
  });

  it('조우 종료 후 경로를 선택해 다음 준비 단계로 이동한다', () => {
    const state = new GameStateMachine();
    state.transition('LOADING');
    state.transition('FIRING');
    state.transition('ENEMY_ACTION');
    state.transition('ROUTE_SELECTION');
    state.transition('AMMO_SELECTION');
    expect(state.phase).toBe('AMMO_SELECTION');
  });
});
