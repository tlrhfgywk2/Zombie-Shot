import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameUICallbacks } from '../ui/GameUI';
import { Zombie } from '../entities/Zombie';
import { ATTACHMENT_ORDER } from '../data/attachmentDefinitions';
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
    expect(internals.player.getStock().armorPiercing).toBe(2);
    expect(harness.ui.showAmmoRewards).not.toHaveBeenCalled();
    for (let i = 0; i < 4; i += 1) harness.callbacks.onAddAmmo('standard');
    harness.callbacks.onLoad();
    await vi.waitFor(() => expect(internals.busy).toBe(false));
    harness.callbacks.onAddAmmo('standard'); harness.callbacks.onLoad();
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
  it.each(['contaminator', 'groundshaker', 'screecher'] as const)('%s 처치 후 수령 전 소유하지 않고 받기 한 번만 처리한다', async type => {
    const game = new Game({} as HTMLElement);
    const state = game as unknown as { player: Player; zombie: Zombie; currentRoster: string[]; enemyIndex: number; state: GameStateMachine; busy: boolean };
    state.zombie = new Zombie(type); state.zombie.applyState({ ...state.zombie.snapshot(), hp: 1, armor: 0 });
    state.currentRoster = [type, 'normal']; state.enemyIndex = 0;
    harness.callbacks.onAddAmmo('standard'); harness.callbacks.onLoad();
    await vi.waitFor(() => { expect(state.state.phase).toBe('ATTACHMENT_REWARD'); expect(state.busy).toBe(false); });
    expect(state.player.magazine.size).toBe(0); // 1발만 장전해도 발사된다.
    expect(state.player.getOwnedAttachments()).toEqual([]);
    expect(harness.ui.showAttachmentReward).toHaveBeenCalledTimes(1);
    const reward = harness.ui.showAttachmentReward.mock.calls[0][0];
    expect(ATTACHMENT_ORDER).toContain(reward);
    harness.callbacks.onAddAmmo('standard');
    expect(state.player.magazine.size).toBe(0);
    harness.callbacks.onClaimAttachment(true); harness.callbacks.onClaimAttachment(true);
    await vi.waitFor(() => expect(state.state.phase).toBe('AMMO_SELECTION'));
    expect(state.player.getOwnedAttachments()).toEqual([reward]);
    expect(Object.values(state.player.loadout.getSnapshot())).toEqual([reward]);
    expect(state.enemyIndex).toBe(1);
  });
  it('화상 처치도 보상하며 마지막 표적의 보관 수령 후 탄약 배분으로 진행한다', async () => {
    const game = new Game({} as HTMLElement);
    const state = game as unknown as { player: Player; zombie: Zombie; currentRoster: string[]; enemyIndex: number; state: GameStateMachine; busy: boolean };
    state.zombie = new Zombie('contaminator');
    const zombie = state.zombie.snapshot();
    state.zombie.applyState({ ...zombie, hp: 1, armor: 100, statuses: { ...zombie.statuses, burnTurns: 1 } });
    state.currentRoster = ['contaminator']; state.enemyIndex = 0;
    harness.callbacks.onAddAmmo('standard'); harness.callbacks.onLoad();
    await vi.waitFor(() => { expect(state.state.phase).toBe('ATTACHMENT_REWARD'); expect(state.busy).toBe(false); });
    harness.callbacks.onClaimAttachment(false);
    await vi.waitFor(() => expect(state.state.phase).toBe('AMMO_REWARD'));
    expect(state.player.getOwnedAttachments()).toHaveLength(1);
    expect(state.player.loadout.getSnapshot()).toEqual({});
    expect(harness.ui.showAmmoRewards).toHaveBeenCalled();
  });
  it('카탈로그 소진 뒤에도 중복 없이 보상 화면에서 정상 진행한다', async () => {
    const game = new Game({} as HTMLElement);
    const state = game as unknown as { player: Player; zombie: Zombie; currentRoster: string[]; state: GameStateMachine; busy: boolean };
    ATTACHMENT_ORDER.forEach(id => state.player.claimAttachment(id));
    state.zombie = new Zombie('screecher'); state.zombie.applyState({ ...state.zombie.snapshot(), hp: 1 }); state.currentRoster = ['screecher'];
    harness.callbacks.onAddAmmo('standard'); harness.callbacks.onLoad();
    await vi.waitFor(() => { expect(state.state.phase).toBe('ATTACHMENT_REWARD'); expect(state.busy).toBe(false); });
    expect(harness.ui.showAttachmentReward.mock.calls[0][0]).toBeUndefined();
    harness.callbacks.onClaimAttachment(false);
    await vi.waitFor(() => expect(state.state.phase).toBe('AMMO_REWARD'));
    expect(state.player.getOwnedAttachments()).toHaveLength(10);
  });

});
