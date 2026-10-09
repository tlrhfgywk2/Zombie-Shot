import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameUICallbacks } from '../ui/GameUI';
import type { Player } from '../entities/Player';
import type { Zombie } from '../entities/Zombie';
import type { GameStateMachine } from './GameStateMachine';
import { createAmmoBuild } from '../data/ammoDefinitions';
import { createRunAmmoBuild } from '../data/gameModes';
import { WEAPON_ORDER } from '../data/weaponDefinitions';

const view = vi.hoisted(() => ({ callbacks: undefined as GameUICallbacks | undefined }));
const animations = vi.hoisted(() => ({ animateLoading: vi.fn(), animateShot: vi.fn(), animateMagazineDiscard: vi.fn() }));
// 데이터·Player·전투·상태 전환은 실제 구현을 쓰고 렌더링·애니메이션만 대체한다.
vi.mock('../ui/GameUI', () => ({ GameUI: class {
  constructor(_root: HTMLElement, callbacks: GameUICallbacks) {
    view.callbacks = callbacks;
    return new Proxy({ canvasHost: {} }, { get: (target, key) => key === 'canvasHost' ? target.canvasHost : vi.fn() });
  }
} }));
vi.mock('../presentation/GamePresentation', () => ({ GamePresentation: class {
  constructor() { return new Proxy({}, { get: (_target, key) => key === 'isDestroyed' ? () => false : animations[key as keyof typeof animations] ?? vi.fn() }); }
} }));
vi.mock('../data/encounterDefinitions', () => ({ ENCOUNTER_STAGES: [
  { normal: { kind: 'normal', roster: ['normal', 'normal'] } },
  { normal: { kind: 'normal', roster: ['normal'] } },
] }));

import { Game } from './Game';

type GameInternals = {
  player: Player; zombie: Zombie; state: GameStateMachine; busy: boolean;
  beginCombat: () => Promise<void>; fireLoadedMagazine: () => Promise<void>;
  chooseRoute: (kind: 'normal') => Promise<void>; sync: () => void;
};
const newGame = () => new Game({} as HTMLElement) as unknown as GameInternals;
const callbacks = () => view.callbacks!;
const killWithOpening = async (game: GameInternals) => {
  game.zombie.applyState({ ...game.zombie.snapshot(), hp: 1, distance: 3 });
  callbacks().onAddAmmo('opening');
  await game.beginCombat();
};

beforeEach(() => { view.callbacks = undefined; Object.values(animations).forEach(animation => animation.mockClear()); });

describe('빈 탄창 턴 넘김', () => {
  for (const mode of ['free', 'startingAmmo'] as const) {
    it.each(WEAPON_ORDER)(`${mode}의 %s는 장전·사격·실린더 선택 없이 적 행동만 진행한다`, async weapon => {
      const game = newGame();
      callbacks().onChooseMode(mode); callbacks().onChooseWeapon(weapon);
      game.zombie.applyState({ ...game.zombie.snapshot(), trainingActions: ['approach'] });
      const stock = game.player.getStock();
      const hp = game.zombie.hp;
      await game.beginCombat();
      expect(game.state.phase).toBe('AMMO_SELECTION');
      expect(game.zombie.distance).toBe(10);
      expect(game.zombie.snapshot().turnsElapsed).toBe(1);
      expect(game.zombie.hp).toBe(hp);
      expect(game.player.magazine.size).toBe(0);
      expect(game.player.getStock()).toEqual(stock);
      for (const animation of Object.values(animations)) expect(animation).not.toHaveBeenCalled();
      expect(game.busy).toBe(false);
    });
  }

  it('연속 입력으로 적 행동이 중복 실행되지 않으며 턴 효과는 한 번 경과한다', async () => {
    const game = newGame();
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('p220');
    game.zombie.applyState({ ...game.zombie.snapshot(), trainingActions: ['approach'], vulnerableTurns: 2 });
    game.player.applyCombatState({ ...game.player.getCombatState(), heavyKickPenaltyBonus: 1, heavyKickPenaltyTurns: 2 });
    await Promise.all([game.beginCombat(), game.beginCombat()]);
    expect(game.zombie.snapshot()).toMatchObject({ turnsElapsed: 1, distance: 10, vulnerableTurns: 1 });
    expect(game.player.getCombatState().heavyKickPenaltyTurns).toBe(1);
  });

  it('M500도 근접에서 빈 턴을 넘기면 실린더 선택 없이 패배를 처리한다', async () => {
    const game = newGame();
    callbacks().onChooseMode('startingAmmo'); callbacks().onChooseWeapon('m500');
    game.zombie.applyState({ ...game.zombie.snapshot(), distance: 0 });
    await game.beginCombat();
    expect(game.state.phase).toBe('GAME_OVER');
    expect(game.player.isAlive).toBe(false);
    expect(animations.animateLoading).not.toHaveBeenCalled();
    expect(animations.animateShot).not.toHaveBeenCalled();
  });
});

describe('모드 선택과 실제 런 제어', () => {
  it.each(WEAPON_ORDER)('%s는 모드·무기 선택 후 올바른 재고로 진입하고 같은 설정으로 재시작한다', weapon => {
    const game = newGame();
    expect(game.state.phase).toBe('MODE_SELECTION');
    callbacks().onChooseWeapon(weapon);
    callbacks().onAddAmmo('ball');
    expect(game.player.magazine.size).toBe(0);
    callbacks().onChooseMode('startingAmmo');
    expect(game.state.phase).toBe('WEAPON_SELECTION');
    callbacks().onChooseWeapon(weapon);
    expect(game.state.phase).toBe('AMMO_SELECTION');
    expect(game.player.getBuild()).toEqual(createRunAmmoBuild('startingAmmo', weapon));
    callbacks().onSupplyAmmo('mimic'); callbacks().onAddAmmo('ball');
    callbacks().onRestart();
    expect(game.player.weapon.id).toBe(weapon);
    expect(game.player.gameMode).toBe('startingAmmo');
    expect(game.player.getBuild()).toEqual(createRunAmmoBuild('startingAmmo', weapon));
    expect(game.player.magazine.size).toBe(0);
    expect(game.state.phase).toBe('AMMO_SELECTION');
  });

  it('무기 선택의 뒤로 가기와 전투의 메뉴 복귀에서 모드 재고가 섞이지 않는다', () => {
    const game = newGame();
    callbacks().onChooseMode('startingAmmo'); callbacks().onReturnToMenu();
    expect(game.state.phase).toBe('MODE_SELECTION');
    callbacks().onChooseMode('startingAmmo'); callbacks().onChooseWeapon('p220');
    callbacks().onSupplyAmmo('mimic'); callbacks().onAddAmmo('opening');
    callbacks().onReturnToMenu();
    expect(game.player.magazine.size).toBe(0);
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('m1911');
    expect(game.player.getBuild()).toEqual(createAmmoBuild());
    callbacks().onSupplyAmmo('highHeat');
    callbacks().onReturnToMenu();
    callbacks().onChooseMode('startingAmmo'); callbacks().onChooseWeapon('m500');
    expect(game.player.getBuild()).toEqual(createAmmoBuild({ lightLoad: 1, relay: 1 }));
  });

  it('같은 조우의 다음 탄창에서는 소진 상태를 유지하고 적 처치·구간 전환·승리에서 보유량을 복구한다', async () => {
    const game = newGame();
    callbacks().onChooseMode('startingAmmo'); callbacks().onChooseWeapon('p220');
    callbacks().onSupplyAmmo('opening'); callbacks().onRemoveSupplyAmmo('flatNose');
    callbacks().onSupplyAmmo('mimic');
    callbacks().onAddAmmo('opening'); callbacks().onAddAmmo('flatNose');
    callbacks().onMoveAmmo(1, 0); callbacks().onSwapAmmo(0, 1);
    expect(game.player.magazine.getRounds()).toEqual(['opening', 'flatNose']);
    await game.beginCombat();
    expect(game.state.phase).toBe('AMMO_SELECTION');
    expect(game.player.getStock()).toMatchObject({ opening: 1, flatNose: 0, mimic: 1 });
    callbacks().onAddAmmo('flatNose');
    expect(game.player.magazine.size).toBe(0);
    await killWithOpening(game);
    expect(game.state.phase).toBe('AMMO_SELECTION');
    const persistent = createAmmoBuild({ opening: 2, flatNose: 1, mimic: 1 });
    expect(game.player.getStock()).toEqual({ ...persistent, ball: 'infinite' });
    await killWithOpening(game);
    expect(game.state.phase).toBe('ROUTE_SELECTION');
    expect(game.player.getBuild()).toEqual(persistent);
    await game.chooseRoute('normal');
    expect(game.player.getStock()).toEqual({ ...persistent, ball: 'infinite' });
    await killWithOpening(game);
    expect(game.state.phase).toBe('VICTORY');
    expect(game.player.getStock()).toEqual({ ...persistent, ball: 'infinite' });
    callbacks().onRestart();
    expect(game.state.phase).toBe('AMMO_SELECTION');
    expect(game.player.getBuild()).toEqual(createRunAmmoBuild('startingAmmo', 'p220'));
  });

  it('프리 모드는 조우 간 소모 상태와 수동 보급을 유지한다', async () => {
    const game = newGame();
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('p220');
    callbacks().onSupplyAmmo('opening');
    await killWithOpening(game);
    expect(game.player.getBuild().opening).toBe(1);
    expect(game.player.getStock().opening).toBe(0);
    callbacks().onSupplyAmmo('opening');
    expect(game.player.getStock().opening).toBe(1);
  });

  it('실린더 선택 중에는 초기화할 수 없고 미발사 탄은 소모하지 않는다', async () => {
    const game = newGame();
    callbacks().onChooseMode('startingAmmo'); callbacks().onChooseWeapon('m500');
    game.zombie.applyState({ ...game.zombie.snapshot(), hp: 1, distance: 3 });
    callbacks().onAddAmmo('lightLoad'); callbacks().onAddAmmo('relay');
    await game.beginCombat();
    expect(game.state.phase).toBe('CYLINDER_CHOICE');
    callbacks().onReturnToMenu(); callbacks().onRestart();
    expect(game.state.phase).toBe('CYLINDER_CHOICE');
    callbacks().onCylinderDecision(false);
    await game.fireLoadedMagazine();
    expect(game.state.phase).toBe('AMMO_SELECTION');
    expect(game.player.getStock()).toMatchObject({ lightLoad: 1, relay: 1 });
  });

  it('실행 중인 애니메이션은 재시작과 메뉴 전환으로 끊지 않는다', () => {
    const game = newGame();
    callbacks().onChooseMode('startingAmmo'); callbacks().onChooseWeapon('p220');
    callbacks().onAddAmmo('opening'); game.busy = true;
    callbacks().onRestart(); callbacks().onReturnToMenu();
    expect(game.player.magazine.getRounds()).toEqual(['opening']);
    expect(game.state.phase).toBe('AMMO_SELECTION');
  });

  it('패배로 끝난 조우도 소모만 복구하고 재시작은 최초 지급량으로 돌아간다', async () => {
    const game = newGame();
    callbacks().onChooseMode('startingAmmo'); callbacks().onChooseWeapon('p220');
    callbacks().onSupplyAmmo('opening'); callbacks().onRemoveSupplyAmmo('flatNose');
    game.zombie.applyState({ ...game.zombie.snapshot(), distance: 0 });
    callbacks().onAddAmmo('opening');
    await game.beginCombat();
    expect(game.state.phase).toBe('GAME_OVER');
    expect(game.player.isAlive).toBe(false);
    expect(game.player.getStock()).toMatchObject({ opening: 2, flatNose: 1 });
    callbacks().onRestart();
    expect(game.player.getBuild()).toEqual(createRunAmmoBuild('startingAmmo', 'p220'));
    expect(game.player.isAlive).toBe(true);
    expect(game.state.phase).toBe('AMMO_SELECTION');
  });
});
