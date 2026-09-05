import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameUICallbacks } from '../ui/GameUI';
import type { Player } from '../entities/Player';
import { Game } from './Game';
import type { GameStateMachine } from './GameStateMachine';
import type { SpecialAmmoType } from '../data/ammoDefinitions';

const harness = vi.hoisted(() => {
  const methods: Record<string, any> = { canvasHost: {} };
  return {
    callbacks: {} as GameUICallbacks,
    ui: new Proxy(methods, { get(target, name: string) { return target[name] ??= vi.fn(); } }),
  };
});
vi.mock('../ui/GameUI', () => ({ GameUI: class {
  constructor(root: HTMLElement, callbacks: GameUICallbacks) { void root; harness.callbacks = callbacks; return harness.ui; }
} }));
vi.mock('../presentation/GamePresentation', () => ({ GamePresentation: class {
  constructor() { return new Proxy({}, { get: () => vi.fn().mockResolvedValue(undefined) }); }
} }));
vi.mock('../presentation/AudioPreferences', () => ({
  loadAudioPreferences: () => ({ muted: true, volume: 0 }), saveAudioPreferences: () => undefined,
}));
vi.mock('../progression/AmmoRewards', () => ({ generateAmmoRewards: () => ['match', 'hollowPoint', 'wadcutter'] }));

describe('실제 게임의 구간/보상 연결', () => {
  beforeEach(() => vi.clearAllMocks());
  it('적 사이 소비를 유지하고 보상 교체 후 구간 진입에서만 회복한다', async () => {
    const game = new Game({} as HTMLElement);
    const internals = game as unknown as { player: Player; state: GameStateMachine; busy: boolean };
    // 기존 교체 경로 회귀 검증은 시작 배분으로 용량을 채운 상태에서 수행한다.
    internals.player.setSpecialCapacity(6);
    for (let i = 0; i < 3; i += 1) harness.callbacks.onAddAmmo('hollowPoint');
    harness.callbacks.onAddAmmo('armorPiercing');
    harness.callbacks.onLoad();
    await vi.waitFor(() => expect(internals.busy).toBe(false));
    expect(internals.player.getStock().hollowPoint).toBe(0);
    expect(internals.player.getStock().armorPiercing).toBe(3);
    expect(harness.ui.showAmmoRewards).not.toHaveBeenCalled();
    for (let i = 0; i < 4; i += 1) harness.callbacks.onAddAmmo('standard');
    harness.callbacks.onLoad();
    await vi.waitFor(() => expect(internals.state.phase).toBe('AMMO_REWARD'));
    expect(internals.player.getStock().hollowPoint).toBe(0);
    harness.callbacks.onChooseAmmoReward('match');
    expect(internals.state.phase).toBe('AMMO_REWARD');
    expect(internals.player.getBuild().match).toBe(0);
    harness.callbacks.onChooseRoute('normal');
    expect(internals.state.phase).toBe('AMMO_REWARD');
    harness.callbacks.onCancelReward();
    expect(internals.player.getBuild().match).toBe(0);
    harness.callbacks.onChooseAmmoReward('overpressure');
    expect(internals.player.getBuild().overpressure).toBe(0);
    harness.callbacks.onChooseAmmoReward('match');
    harness.callbacks.onReplaceReward('armorPiercing');
    expect(internals.state.phase).toBe('ROUTE_SELECTION');
    expect(internals.player.getBuild().match).toBe(1);
    expect(internals.player.getStock().match).toBe(0);
    expect(internals.player.getStock().hollowPoint).toBe(0);
    harness.callbacks.onChooseAmmoReward('match');
    expect(internals.player.getBuild().match).toBe(1);
    harness.callbacks.onChooseRoute('normal');
    harness.callbacks.onChooseRoute('special');
    await vi.waitFor(() => expect(internals.state.phase).toBe('AMMO_SELECTION'));
    expect(internals.player.getStock().match).toBe(1);
    expect(internals.player.getStock().armorPiercing).toBe(2);
    expect(internals.player.getStock().hollowPoint).toBe(3);
    expect(internals.player.getStock().standard).toBe('infinite');
    expect(internals.player.getBuild().match).toBe(1);
  });
  it('보상 API에 표준탄을 전달해도 특수 배분을 오염시키지 않는다', () => {
    const game = new Game({} as HTMLElement);
    const { player } = game as unknown as { player: Player };
    const before = player.getBuild();
    expect(player.applyAmmoReward('standard' as SpecialAmmoType, ['armorPiercing'])).toBe(false);
    expect(player.getBuild()).toEqual(before);
  });
});
