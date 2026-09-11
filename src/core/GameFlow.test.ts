import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameUICallbacks } from '../ui/GameUI';
import { Zombie } from '../entities/Zombie';
import { ATTACHMENT_ORDER } from '../data/attachmentDefinitions';
import type { Player } from '../entities/Player';
import { Game } from './Game';
import type { GameStateMachine } from './GameStateMachine';
import type { SpecialAmmoType } from '../data/ammoDefinitions';
import { CombatResolver } from '../combat/CombatResolver';

const harness = vi.hoisted(() => {
  const methods: Record<string, any> = { canvasHost: {} };
  const presentationMethods: Record<string, any> = {};
  return {
    callbacks: {} as GameUICallbacks,
    ui: new Proxy(methods, { get(target, name: string) { return target[name] ??= vi.fn(); } }),
    presentation: new Proxy(presentationMethods, { get(target, name: string) { return target[name] ??= vi.fn().mockResolvedValue(undefined); } }),
  };
});
vi.mock('../ui/GameUI', () => ({ GameUI: class {
  constructor(root: HTMLElement, callbacks: GameUICallbacks) { void root; harness.callbacks = callbacks; return harness.ui; }
} }));
vi.mock('../presentation/GamePresentation', () => ({ GamePresentation: class {
  constructor() { return harness.presentation; }
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
    for (let volley = 0; volley < 6 && internals.state.phase === 'AMMO_SELECTION'; volley += 1) {
      for (let i = 0; i < 4; i += 1) harness.callbacks.onAddAmmo('standard');
      harness.callbacks.onLoad();
      await vi.waitFor(() => expect(internals.busy).toBe(false));
    }
    await vi.waitFor(() => expect(internals.state.phase).toBe('AMMO_REWARD'));
    expect(internals.player.getStock().hollowPoint).toBe(0);
    expect(harness.ui.showAmmoRewards).toHaveBeenLastCalledWith(
      ['match', 'hollowPoint', 'wadcutter'],
      internals.player.getBuild(),
      internals.player.getSpecialCapacity(),
      undefined,
      [],
    );
    harness.callbacks.onChooseAmmoReward('match');
    expect(internals.state.phase).toBe('AMMO_REWARD');
    expect(internals.player.getBuild().match).toBe(0);
    harness.callbacks.onChooseRoute('normal');
    expect(internals.state.phase).toBe('AMMO_REWARD');
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
  it('처치 프리뷰도 실제 적 정보와 다음 행동을 바꾸지 않고 전용 예상 피해만 표시한다', () => {
    const game = new Game({} as HTMLElement);
    const internals = game as unknown as { zombie: Zombie; sync: () => void };
    const enemy = internals.zombie.snapshot();
    internals.zombie.applyState({ ...enemy, hp: 5, armor: 0 });
    internals.sync();
    const actualEnemyPanel = harness.ui.updateEnemy.mock.calls.at(-1)!;

    harness.callbacks.onAddAmmo('standard');
    const [nonLethalSequence] = harness.ui.renderPreview.mock.calls.at(-1)!;
    expect(nonLethalSequence.killed).toBe(false);
    expect(harness.ui.updateEnemy.mock.calls.at(-1)).toEqual(actualEnemyPanel);

    harness.callbacks.onAddAmmo('standard');

    const [sequence] = harness.ui.renderPreview.mock.calls.at(-1)!;
    expect(sequence.killed).toBe(true);
    expect(sequence.finalState.distance).toBe(enemy.distance);
    expect(sequence.totalHpDamage).toBe(5);
    expect(sequence.rawVolleyFirepower).toBe(8);
    expect(sequence.finalVolleyFirepower).toBe(7);
    expect(harness.ui.renderPreview.mock.calls.at(-1)).toHaveLength(1);
    expect(harness.ui.updateEnemy.mock.calls.at(-1)).toEqual(actualEnemyPanel);
  });
  it('탄약 배급을 넘기면 보유 배분을 바꾸지 않고 경로 선택으로 진행한다', () => {
    const game = new Game({} as HTMLElement);
    const internals = game as unknown as { player: Player; state: GameStateMachine };
    const before = internals.player.getBuild();
    internals.state.transition('LOADING');
    internals.state.transition('FIRING');
    internals.state.transition('ENEMY_ACTION');
    internals.state.transition('AMMO_REWARD');
    harness.callbacks.onSkipAmmoReward();
    expect(internals.state.phase).toBe('ROUTE_SELECTION');
    expect(internals.player.getBuild()).toEqual(before);
    expect(harness.ui.hideAmmoRewards).toHaveBeenCalled();
    expect(harness.ui.showRouteChoice).toHaveBeenCalled();
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

  it('접근 도착 후 선택 턴을 주며 충격 중단 뒤 공격이 해결될 때만 패배한다', async () => {
    const game = new Game({} as HTMLElement);
    const state = game as unknown as { zombie: Zombie; state: GameStateMachine; busy: boolean };
    state.zombie.applyState({ ...state.zombie.snapshot(), hp: 100, maxHp: 100, distance: 1 });
    harness.callbacks.onAddAmmo('standard'); harness.callbacks.onLoad();
    await vi.waitFor(() => expect(state.busy).toBe(false));
    expect(state.zombie.distance).toBe(0);
    expect(state.state.phase).toBe('AMMO_SELECTION');
    state.zombie.applyState({ ...state.zombie.snapshot(), actionShock: 8 });
    harness.callbacks.onAddAmmo('standard'); harness.callbacks.onLoad();
    await vi.waitFor(() => expect(state.busy).toBe(false));
    expect(state.state.phase).toBe('AMMO_SELECTION');
    expect(state.zombie.snapshot().actionShock).toBe(0);
    harness.callbacks.onAddAmmo('standard'); harness.callbacks.onLoad();
    await vi.waitFor(() => expect(state.busy).toBe(false));
    expect(state.state.phase).toBe('GAME_OVER');
  });
  it('감염체 특수 행동으로 갱신된 플레이어 약화 상태를 UI에 전달한다', async () => {
    const game = new Game({} as HTMLElement);
    const state = game as unknown as { player: Player; zombie: Zombie; currentRoster: string[]; state: GameStateMachine; busy: boolean; sync: () => void };
    state.zombie = new Zombie('groundshaker');
    const enemy = state.zombie.snapshot();
    state.zombie.applyState({ ...enemy, hp: 100, maxHp: 100, armor: 100, maxArmor: 100 });
    state.currentRoster = ['groundshaker'];
    state.sync();

    harness.callbacks.onAddAmmo('standard');
    harness.callbacks.onLoad();

    await vi.waitFor(() => expect(state.busy).toBe(false));
    expect(state.state.phase).toBe('AMMO_SELECTION');
    expect(harness.ui.renderPlayerDebuffs).toHaveBeenLastCalledWith(expect.objectContaining({
      heavyKickPenaltyBonus: 1,
      heavyKickPenaltyTurns: 2,
    }));
  });
  it('실제 사격 상태는 공용 시퀀스 계산과 일치한다', async () => {
    const game = new Game({} as HTMLElement);
    const state = game as unknown as { player: Player; zombie: Zombie; busy: boolean; sync: () => void };
    state.zombie.applyState({ ...state.zombie.snapshot(), hp: 100, maxHp: 100, distance: 8 });
    for (const ammo of ['overpressure', 'flatPoint', 'wadcutter'] as const) state.player.applyAmmoReward(ammo);
    state.player.startStage(); state.sync();
    for (const ammo of ['overpressure', 'flatPoint', 'wadcutter', 'standard'] as const) harness.callbacks.onAddAmmo(ammo);
    const [sequence] = harness.ui.renderPreview.mock.calls.at(-1)!;
    expect(sequence.shots[1].breakdown.heavyKickPenalty).toBe(2);
    expect(sequence.shots[2].actionShockApplied).toBe(0);
    const expectedAction = new CombatResolver().resolveEnemyAction(
      sequence.finalState, state.player.getCombatState(), state.player.loadout.getSnapshot(),
    );
    harness.callbacks.onLoad();
    await vi.waitFor(() => expect(state.busy).toBe(false));
    expect(harness.ui.showShot.mock.calls.map((call: any[]) => call[0])).toEqual(sequence.shots);
    expect(state.zombie.snapshot()).toEqual(expectedAction.after);
  });

  it('장전 시작으로 슬롯을 잠가도 사전 계산한 발사 순서 수치를 즉시 다시 표시한다', () => {
    new Game({} as HTMLElement);
    harness.callbacks.onAddAmmo('standard');
    const [sequence] = harness.ui.renderPreview.mock.calls.at(-1)!;
    const previewCallCount = harness.ui.renderPreview.mock.calls.length;

    harness.callbacks.onLoad();

    expect(harness.ui.setLocked).toHaveBeenCalledWith(true);
    expect(harness.ui.renderPreview.mock.calls.slice(previewCallCount)).toContainEqual([sequence]);
  });

  it('탄창은 모든 예정 사격이 끝난 뒤 한 번만 폐기한다', async () => {
    const game = new Game({} as HTMLElement);
    const state = game as unknown as { busy: boolean };
    harness.callbacks.onAddAmmo('standard');
    harness.callbacks.onAddAmmo('standard');

    harness.callbacks.onLoad();
    await vi.waitFor(() => expect(state.busy).toBe(false));

    expect(harness.presentation.animateShot).toHaveBeenCalledTimes(2);
    expect(harness.presentation.animateMagazineDiscard).toHaveBeenCalledTimes(1);
    expect(harness.presentation.animateMagazineDiscard.mock.invocationCallOrder[0]).toBeGreaterThan(
      harness.presentation.animateShot.mock.invocationCallOrder.at(-1),
    );
  });

});
