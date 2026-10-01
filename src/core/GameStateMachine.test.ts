import { describe, expect, it } from 'vitest';
import { GameStateMachine } from './GameStateMachine';

describe('GameStateMachine', () => {
  it('정상 전투 사이클을 명시적인 순서로 전환한다', () => {
    const state = new GameStateMachine();
    state.transition('AMMO_SELECTION');
    state.transition('LOADING');
    state.transition('FIRING');
    state.transition('ENEMY_ACTION');
    state.transition('AMMO_SELECTION');
    expect(state.phase).toBe('AMMO_SELECTION');
  });

  it('허용되지 않은 상태 전환을 거부한다', () => {
    const state = new GameStateMachine();
    state.transition('AMMO_SELECTION');
    expect(() => state.transition('FIRING')).toThrow('허용되지 않은 상태 전환');
  });

  it('게임 오버에서 재시작할 수 있다', () => {
    const state = new GameStateMachine();
    state.transition('AMMO_SELECTION');
    state.transition('GAME_OVER');
    state.transition('WEAPON_SELECTION');
    state.transition('AMMO_SELECTION');
    expect(state.phase).toBe('AMMO_SELECTION');
  });

  it('마지막 웨이브 완료 후 다시 시작할 수 있다', () => {
    const state = new GameStateMachine();
    state.transition('AMMO_SELECTION');
    state.transition('LOADING');
    state.transition('FIRING');
    state.transition('ENEMY_ACTION');
    state.transition('AMMO_REWARD');
    state.transition('VICTORY');
    state.transition('WEAPON_SELECTION');
    state.transition('AMMO_SELECTION');
    expect(state.phase).toBe('AMMO_SELECTION');
  });

  it('조우 종료 후 경로를 선택해 다음 준비 단계로 이동한다', () => {
    const state = new GameStateMachine();
    state.transition('AMMO_SELECTION');
    state.transition('LOADING');
    state.transition('FIRING');
    state.transition('ENEMY_ACTION');
    expect(state.canTransition('ROUTE_SELECTION')).toBe(false);
    state.transition('AMMO_REWARD');
    state.transition('ROUTE_SELECTION');
    state.transition('AMMO_SELECTION');
    expect(state.phase).toBe('AMMO_SELECTION');
  });
  it('무기 선택 전에는 장전할 수 없고 재시작은 다시 무기를 고른다', () => {
    const state = new GameStateMachine();
    expect(state.phase).toBe('WEAPON_SELECTION');
    expect(state.canTransition('LOADING')).toBe(false);
    state.transition('AMMO_SELECTION');
    state.transition('GAME_OVER');
    state.transition('WEAPON_SELECTION');
    expect(state.canTransition('FIRING')).toBe(false);
  });
  it('실린더 장전 뒤에는 준비 단계로 돌아갈 수 없고 발사를 거쳐야 한다', () => {
    const state = new GameStateMachine();
    state.transition('AMMO_SELECTION'); state.transition('LOADING'); state.transition('CYLINDER_CHOICE');
    expect(state.canTransition('AMMO_SELECTION')).toBe(false);
    expect(state.canTransition('LOADING')).toBe(false);
    expect(() => state.transition('AMMO_SELECTION')).toThrow('허용되지 않은 상태 전환');
    expect(state.phase).toBe('CYLINDER_CHOICE');
    state.transition('FIRING');
    expect(state.phase).toBe('FIRING');
    state.transition('ENEMY_ACTION'); state.transition('AMMO_SELECTION'); state.transition('LOADING');
    state.transition('CYLINDER_CHOICE');
    expect(state.phase).toBe('CYLINDER_CHOICE');
  });

});
