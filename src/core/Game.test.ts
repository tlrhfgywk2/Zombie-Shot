import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameUICallbacks } from '../ui/GameUI';
import type { Player } from '../entities/Player';
import type { Zombie } from '../entities/Zombie';
import type { GameStateMachine } from './GameStateMachine';
import { createAmmoBuild } from '../data/ammoDefinitions';
import { createRunAmmoBuild } from '../data/gameModes';
import { WEAPON_ORDER } from '../data/weaponDefinitions';
import { ExplorationRun, RUN_LENGTH } from '../exploration/ExplorationRun';
import type { CaveEvent } from '../exploration/ExplorationRun';

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
  exploration: ExplorationRun; caveScreen: 'entry' | 'junction' | 'encounter' | 'reward';
  explorationAction: (action: string, payment?: Parameters<Player['supplyAmmo']>[0]) => Promise<void>;
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
  for (const mode of ['free'] as const) {
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
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('m500');
    game.zombie.applyState({ ...game.zombie.snapshot(), distance: 0 });
    await game.beginCombat();
    expect(game.state.phase).toBe('GAME_OVER');
    expect(game.player.isAlive).toBe(false);
    expect(animations.animateLoading).not.toHaveBeenCalled();
    expect(animations.animateShot).not.toHaveBeenCalled();
  });
});

describe('탐험 런 통합', () => {
  const caveGame = async (seed: string, weapon: typeof WEAPON_ORDER[number] = 'p220') => {
    const game = newGame(); callbacks().onChooseMode('exploration'); callbacks().onChooseWeapon(weapon);
    game.exploration = new ExplorationRun(seed);
    await game.explorationAction('tool:echo');
    return game;
  };

  it.each(WEAPON_ORDER)('%s는 실제 전투와 보상·이벤트·상인·최종 조우를 거쳐 탈출하고 재시작한다', async weapon => {
    for (let seed = 0; seed < 4; seed++) {
      const game = await caveGame(`loop-${seed}`, weapon);
      expect(game.state.phase).toBe('EXPLORATION');
      for (let depth = 0; depth < RUN_LENGTH; depth++) {
        await game.explorationAction(`route:${seed % game.exploration.routes.length}`);
        const encounter = game.exploration.active!;
        if (encounter.kind === 'combat') {
          await game.explorationAction('fight');
          expect(game.zombie.snapshot().trainingActions).toBeUndefined();
          for (let turn = 0; turn < 12 && game.state.phase === 'AMMO_SELECTION'; turn++) {
            for (let slot = 0; slot < game.player.magazine.capacity; slot++) callbacks().onAddAmmo('ball');
            await game.beginCombat();
            if (String(game.state.phase) === 'CYLINDER_CHOICE') {
              callbacks().onCylinderDecision(false); await game.fireLoadedMagazine();
            }
          }
          expect(game.state.phase).toBe('EXPLORATION');
          expect(game.caveScreen).toBe('reward');
          await game.explorationAction('reward:0');
          expect(game.player.getStock()).toMatchObject(game.player.getBuild());
        } else if (encounter.kind === 'event') {
          await game.explorationAction('leave');
        } else if (encounter.kind === 'merchant') {
          await game.explorationAction('buy:map');
          expect(game.exploration.mapCharges).toBe(2);
          await game.explorationAction('leave');
        }
      }
      expect(game.state.phase).toBe('VICTORY');
      expect(game.exploration.victories).toBe(4);
      expect(game.player.getOwnedAttachments()).toContain('texturedGrip');
      callbacks().onRestart();
      expect(game.state.phase).toBe('EXPLORATION');
      expect(game.caveScreen).toBe('entry');
      expect(game.player.getBuild()).toEqual(createRunAmmoBuild('exploration', weapon));
      expect(game.exploration.depth).toBe(0);
      callbacks().onReturnToMenu(); expect(game.state.phase).toBe('MODE_SELECTION');
    }
  });

  it('탐험의 수동 보급을 막고 단일 상인 품목의 이중 구매와 이벤트 재실행을 막는다', async () => {
    const game = await caveGame('거래');
    const initial = game.player.getBuild();
    callbacks().onSupplyAmmo('mimic'); callbacks().onRemoveSupplyAmmo('flatNose'); callbacks().onSupplyAttachment('compensator');
    expect(game.player.getBuild()).toEqual(initial); expect(game.player.getOwnedAttachments()).toEqual([]);
    game.exploration.depth = 3;
    await game.explorationAction('route:0');
    await game.explorationAction('payment', 'flatNose');
    await game.explorationAction('buy:ammo');
    expect(game.player.getBuild().flatNose).toBe(1);
    const paid = game.player.getBuild();
    await game.explorationAction('buy:ammo'); expect(game.player.getBuild()).toEqual(paid);
    game.player.endEncounter(); expect(game.player.getStock()).toMatchObject(paid);
    await game.explorationAction('leave');
    game.exploration.depth = 5;
    const index = game.exploration.routes.findIndex(route => route.event === 'cache' || route.event === 'nest');
    if (index >= 0) {
      await game.explorationAction(`route:${index}`);
      await game.explorationAction('event:listen');
      const awareness = game.exploration.awareness;
      await game.explorationAction('event:listen'); expect(game.exploration.awareness).toBe(awareness);
    }
  });

  it('회피는 보상 없이 갈림길로 돌아가며 실패한 런도 탐험 입구에서 재시작한다', async () => {
    const game = await caveGame('우회');
    game.exploration.awareness = 2;
    const initial = game.player.getBuild();
    await game.explorationAction('route:0'); await game.explorationAction('avoid');
    expect(game.exploration.avoided).toBe(1); expect(game.exploration.victories).toBe(0);
    expect(game.player.getBuild()).toEqual(initial); expect(game.caveScreen).toBe('junction');
    game.exploration.depth = 6; await game.explorationAction('route:0');
    await game.explorationAction('avoid'); expect(game.caveScreen).toBe('encounter');
    await game.explorationAction('fight');
    game.zombie.applyState({ ...game.zombie.snapshot(), distance: 0 });
    await game.beginCombat();
    expect(game.state.phase).toBe('GAME_OVER'); expect(game.player.isAlive).toBe(false);
    callbacks().onRestart(); expect(game.state.phase).toBe('EXPLORATION');
    expect(game.exploration.tools.size).toBe(0); expect(game.exploration.depth).toBe(0);
  });

  it.each([
    ['cache', 'risk'], ['cache', 'listen'], ['survey', 'map'], ['survey', 'tool'],
    ['shrine', 'exchange'], ['shrine', 'capacity'], ['nest', 'listen'], ['nest', 'grip'],
  ] as const)('%s의 %s 선택은 한 번만 적용되고 계속 탐험으로 이어진다', async (event, choice) => {
    const game = await caveGame(`이벤트-${event}`);
    game.exploration.active = { id: 'event-fixture', kind: 'event', event: event as CaveEvent, rewards: [] };
    game.caveScreen = 'encounter';
    await game.explorationAction('payment', 'flatNose');
    await game.explorationAction(`event:${choice}`);
    expect(game.caveScreen).toBe('junction'); expect(game.exploration.active).toBeUndefined();
    if (choice === 'risk') { expect(game.player.getBuild().flatNose).toBe(4); expect(game.exploration.nextDistancePenalty).toBe(2); }
    if (choice === 'listen') expect(game.exploration.awareness).toBe(2);
    if (choice === 'map') { expect(game.exploration.mapCharges).toBe(2); expect(game.player.getBuild().flatNose).toBe(1); }
    if (choice === 'tool') { expect(game.exploration.tools.has('uv')).toBe(true); expect(game.player.getBuild().flatNose).toBe(1); }
    if (choice === 'exchange') { expect(game.player.getBuild().hollowPoint).toBe(2); expect(game.player.getBuild().flatNose).toBe(1); }
    if (choice === 'capacity') { expect(game.player.getSpecialCapacity()).toBe(16); expect(game.player.getBuild().flatNose).toBe(1); }
    if (choice === 'grip') { expect(game.player.getOwnedAttachments()).toContain('texturedGrip'); expect(game.exploration.nextDistancePenalty).toBe(2); }
    const after = game.player.getBuild(); const awareness = game.exploration.awareness;
    await game.explorationAction(`event:${choice}`);
    expect(game.player.getBuild()).toEqual(after); expect(game.exploration.awareness).toBe(awareness);
  });
});

describe('모드 선택과 실제 런 제어', () => {
  it.each(WEAPON_ORDER)('%s는 모드·무기 선택 후 올바른 재고로 진입하고 같은 설정으로 재시작한다', weapon => {
    const game = newGame();
    expect(game.state.phase).toBe('MODE_SELECTION');
    callbacks().onChooseWeapon(weapon);
    callbacks().onAddAmmo('ball');
    expect(game.player.magazine.size).toBe(0);
    callbacks().onChooseMode('free');
    expect(game.state.phase).toBe('WEAPON_SELECTION');
    callbacks().onChooseWeapon(weapon);
    expect(game.state.phase).toBe('AMMO_SELECTION');
    expect(game.player.getBuild()).toEqual(createRunAmmoBuild('free', weapon));
    callbacks().onSupplyAmmo('mimic'); callbacks().onAddAmmo('ball');
    callbacks().onRestart();
    expect(game.player.weapon.id).toBe(weapon);
    expect(game.player.gameMode).toBe('free');
    expect(game.player.getBuild()).toEqual(createRunAmmoBuild('free', weapon));
    expect(game.player.magazine.size).toBe(0);
    expect(game.state.phase).toBe('AMMO_SELECTION');
  });

  it('무기 선택의 뒤로 가기와 전투의 메뉴 복귀에서 모드 재고가 섞이지 않는다', () => {
    const game = newGame();
    callbacks().onChooseMode('free'); callbacks().onReturnToMenu();
    expect(game.state.phase).toBe('MODE_SELECTION');
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('p220');
    callbacks().onSupplyAmmo('mimic'); callbacks().onAddAmmo('opening');
    callbacks().onReturnToMenu();
    expect(game.player.magazine.size).toBe(0);
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('m1911');
    expect(game.player.getBuild()).toEqual(createRunAmmoBuild('free', 'm1911'));
    callbacks().onSupplyAmmo('highHeat');
    callbacks().onReturnToMenu();
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('m500');
    expect(game.player.getBuild()).toEqual(createAmmoBuild({ lightLoad: 1, relay: 1 }));
  });

  it('같은 조우의 다음 탄창에서는 소진 상태를 유지하고 적 처치·구간 전환·승리에서 보유량을 복구한다', async () => {
    const game = newGame();
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('p220');
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
    expect(game.player.getBuild()).toEqual(createRunAmmoBuild('free', 'p220'));
  });

  it('통합 프리 모드는 초기 지급·자유 보급·조우 종료 복구를 함께 지원한다', async () => {
    const game = newGame();
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('p220');
    callbacks().onSupplyAmmo('opening');
    await killWithOpening(game);
    expect(game.player.getBuild().opening).toBe(2);
    expect(game.player.getStock().opening).toBe(2);
    callbacks().onSupplyAmmo('opening');
    expect(game.player.getStock().opening).toBe(3);
  });

  it('실린더 선택 중에는 초기화할 수 없고 미발사 탄은 소모하지 않는다', async () => {
    const game = newGame();
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('m500');
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
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('p220');
    callbacks().onAddAmmo('opening'); game.busy = true;
    callbacks().onRestart(); callbacks().onReturnToMenu();
    expect(game.player.magazine.getRounds()).toEqual(['opening']);
    expect(game.state.phase).toBe('AMMO_SELECTION');
  });

  it('패배로 끝난 조우도 소모만 복구하고 재시작은 최초 지급량으로 돌아간다', async () => {
    const game = newGame();
    callbacks().onChooseMode('free'); callbacks().onChooseWeapon('p220');
    callbacks().onSupplyAmmo('opening'); callbacks().onRemoveSupplyAmmo('flatNose');
    game.zombie.applyState({ ...game.zombie.snapshot(), distance: 0 });
    callbacks().onAddAmmo('opening');
    await game.beginCombat();
    expect(game.state.phase).toBe('GAME_OVER');
    expect(game.player.isAlive).toBe(false);
    expect(game.player.getStock()).toMatchObject({ opening: 2, flatNose: 1 });
    callbacks().onRestart();
    expect(game.player.getBuild()).toEqual(createRunAmmoBuild('free', 'p220'));
    expect(game.player.isAlive).toBe(true);
    expect(game.state.phase).toBe('AMMO_SELECTION');
  });
});
