import { describe, expect, it } from 'vitest';
import { ExplorationRun, RUN_LENGTH } from './ExplorationRun';
import { Player } from '../entities/Player';
import type { SpecialAmmoType } from '../data/ammoDefinitions';
import { WEAPON_ORDER } from '../data/weaponDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { CombatResolver } from '../combat/CombatResolver';

describe('숨겨진 경로와 정보 도구', () => {
  it('시드가 같으면 모든 갈림길 결과와 보상이 같으며 선택으로 결과가 바뀌지 않는다', () => {
    const first = new ExplorationRun('동굴-101');
    const second = new ExplorationRun('동굴-101');
    expect(first.layers).toEqual(second.layers);
    expect(new ExplorationRun('동굴-102').layers).not.toEqual(first.layers);
    const predetermined = first.routes[1];
    expect(first.routeClues(predetermined!)).toEqual(['목적지 미확인']);
    expect(first.enter(1)).toBe(predetermined);
    expect(first.enter(0)).toBeUndefined();
    expect(first.layers).toEqual(second.layers);
  });
  it('청음·자외선·측량도의 정보는 다르고 측량 횟수는 재사용할 수 없다', () => {
    const run = new ExplorationRun('장비');
    const combat = run.layers[0]![0]!;
    const merchant = run.layers[3]![0]!;
    run.acquire('echo');
    expect(run.routeClues(combat)).toEqual(['생체 반응']);
    expect(run.routeClues(merchant)).toEqual(['고른 호흡']);
    run.acquire('uv');
    expect(run.routeClues(merchant)).toEqual(['고른 호흡', '거래 표식']);
    run.acquire('map');
    expect(run.inspect(0)).toBe(true);
    expect(run.routeClues(combat)).toEqual(['일반 감염체']);
    expect(run.inspect(0)).toBe(false);
    expect(run.inspect(1)).toBe(true);
    expect(run.mapCharges).toBe(0);
    expect(run.acquire('map')).toBe(false);
    expect(run.inspect(1)).toBe(false);
  });
  it('회피는 인지를 지불하며 처치 수와 보상을 늘리지 않고 교란 감염체에는 막힌다', () => {
    const run = new ExplorationRun('회피');
    run.acquire('echo'); run.enter(0);
    expect(run.canAvoid()).toBe(false);
    run.settleCombat(); run.leave();
    run.enter(0); run.leave(); run.enter(0);
    expect(run.canAvoid()).toBe(true);
    expect(run.settleCombat(true)).toBe(true);
    expect(run.awareness).toBe(1);
    expect(run.victories).toBe(1);
    expect(run.avoided).toBe(1);
    expect(run.settleCombat()).toBe(false);
    run.leave(); run.depth = RUN_LENGTH - 2; run.enter(0); run.awareness = 3;
    expect(run.isDisruptor()).toBe(true);
    expect(run.canAvoid()).toBe(false);
    expect(run.settleCombat(true)).toBe(false);
  });
  it('혼합 갈림길의 전투·비전투를 단서로 구분하고 청음기는 생체 반응의 빠르기와 무게를 구분한다', () => {
    const run = new ExplorationRun('갈림길');
    const mixed = run.layers[4]!;
    expect(mixed.filter(route => route.kind === 'combat')).toHaveLength(1);
    expect(mixed.filter(route => route.kind !== 'combat')).toHaveLength(1);
    run.acquire('uv');
    expect(run.routeClues(mixed[0]!)).not.toEqual(run.routeClues(mixed[1]!));
    run.acquire('echo');
    const ordinary = { id: 'fixture', kind: 'combat' as const, rewards: [] };
    expect(run.routeClues({ ...ordinary, enemy: 'normal' })[0]).toBe('생체 반응');
    expect(run.routeClues({ ...ordinary, enemy: 'fast' })[0]).toBe('빠른 생체 반응');
    expect(run.routeClues({ ...ordinary, enemy: 'brute' })[0]).toBe('무거운 생체 반응');
  });
});

describe('영구 탄약 거래의 원자성', () => {
  it('지불한 탄은 발사 소모 복구와 구간 이동으로 되돌아오지 않는다', () => {
    const player = new Player(); player.startRun('exploration', 'p220');
    expect(player.exchangeAmmo(['flatNose'], ['hollowPoint', 'hollowPoint'])).toBe(true);
    player.addAmmo('hollowPoint'); player.fireRound({ ammoType: 'hollowPoint' });
    expect(player.getStock().hollowPoint).toBe(1);
    player.endEncounter(); player.startStage();
    expect(player.getBuild().flatNose).toBe(1);
    expect(player.getStock().flatNose).toBe(1);
    expect(player.getStock().hollowPoint).toBe(2);
  });
  it('표준탄·과다 지불·예약 탄·휴대 한도 초과 거래는 잔량과 소유량을 바꾸지 않는다', () => {
    const player = new Player(); player.startRun('exploration', 'p220');
    const initial = player.getBuild(); const stock = player.getStock();
    expect(player.exchangeAmmo(['ball' as SpecialAmmoType], ['plusP'])).toBe(false);
    expect(player.exchangeAmmo(['opening', 'opening'], ['plusP'])).toBe(false);
    player.setSpecialCapacity(3);
    expect(player.exchangeAmmo([], ['plusP'])).toBe(false);
    player.addAmmo('opening');
    expect(player.exchangeAmmo(['flatNose'])).toBe(false);
    expect(player.getBuild()).toEqual(initial); expect(player.getStock()).toEqual(stock);
  });
});

describe('탐험 기본 생존 밸런스', () => {
  it.each(WEAPON_ORDER)('%s는 40개 시드의 필수 조우를 표준탄만으로 완료할 수 있다', weaponId => {
    const resolver = new CombatResolver();
    for (let seed = 0; seed < 40; seed++) {
      const run = new ExplorationRun(`balance-${seed}`);
      const player = new Player(); player.startRun('exploration', weaponId);
      run.acquire('echo');
      for (let depth = 0; depth < RUN_LENGTH; depth++) {
        const encounter = run.enter(seed % run.routes.length)!;
        if (encounter.kind === 'combat') {
          let enemy = createEnemyState(encounter.enemy!);
          let alive = true;
          for (let turn = 0; turn < 12 && enemy.hp > 0 && alive; turn++) {
            const rounds = Array.from({ length: player.magazine.capacity }, () => 'ball' as const);
            const result = resolver.resolveSequence(rounds, enemy, { weaponId, playerState: player.getCombatState() });
            enemy = result.finalState;
            if (enemy.hp <= 0) break;
            const action = resolver.resolveEnemyAction(enemy, player.getCombatState());
            enemy = action.after; player.applyCombatState(action.playerAfter); alive = !action.playerKilled;
          }
          expect(alive, `${weaponId}/${seed}/${encounter.enemy}`).toBe(true);
          expect(enemy.hp, `${weaponId}/${seed}/${encounter.enemy}`).toBeLessThanOrEqual(0);
          player.endEncounter(); run.settleCombat();
        }
        run.leave();
      }
      expect(run.depth).toBe(RUN_LENGTH); expect(run.victories).toBeGreaterThanOrEqual(4);
    }
  });
});
