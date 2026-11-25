import { afterEach, describe, expect, it, vi } from 'vitest';
import { CombatController } from '../CombatController';
import { ammo, P220 } from '../rules';
import type { Frame, Round } from '../rules';
import { normalizeScenario, registeredRounds, simulate } from './simulator';
import type { SimulationConfig } from './simulator';

afterEach(() => vi.useRealTimers());

describe('실제 게임과 동기 실행의 동등성', () => {
  it.each([
    { sequence: ['echo_round', 'serrated_round', 'pulse_round', 'copy'], maxHp: 2000, distance: 2 },
    { sequence: ['echo_round', 'vulnerability', 'split_round', 'convergence_round'], maxHp: 12, distance: 5 },
    { sequence: ['wedge_round', 'reinforced', 'conduit_round', 'pursuit_round'], maxHp: 500, distance: 4 },
  ] satisfies { sequence: Round[]; maxHp: number; distance: number }[])('조우 $maxHp/$distance의 발사, 반향, 적 행동과 종료', config => {
    vi.useFakeTimers();
    const gameFrames: Frame[] = [];
    const game = new CombatController(kind => {
      if (!kind || kind === 'reset') return;
      if (kind === 'shot') gameFrames.push({ kind, state: game.state, shot: game.shots.at(-1)! });
      else if (kind === 'echo') gameFrames.push({ kind, state: game.state, echo: game.echoes.at(-1)! });
      else gameFrames.push({ kind, state: game.state });
    });
    expect(game.reset({ maxHp: config.maxHp, distance: config.distance, approach: 1 })).toBe(true);
    config.sequence.forEach((round, index) => expect(game.edit(index, round)).toBe(true));
    for (let i = 0; i < 2 && game.state.phase === 'planning'; i++) {
      expect(game.fire()).toBe(true);
      vi.runAllTimers();
    }
    const result = simulate({ ...config, turns: 2, mode: 'encounter', inventory: 'unlimited' }, { detail: true });
    expect(result.frames).toEqual(gameFrames);
    expect(result.state).toEqual(game.state);
  });
});

describe('분석 설정, 재고와 집계', () => {
  it('등록부 전체를 읽고 기본 4칸 탄창을 한 번 쏜다', () => {
    expect(registeredRounds).toEqual(Object.keys(ammo));
    const result = simulate();
    expect(result.frames).toBeUndefined();
    expect(result.metrics).toMatchObject({ shots: P220.capacity, totalDamage: 50, heatGenerated: 64, consumed: { standard: 4 } });
    expect(result.turns).toHaveLength(1);
    expect(result.turns[0]).toMatchObject({ turn: 1, damage: 50, peakHeat: 64, end: { actions: 1, weaponHeat: 32 } });
  });
  it('다음 턴의 완전한 탄창이 부족하면 사격·이동 전 중지한다', () => {
    const result = simulate({ turns: 3, inventory: { standard: 7 } });
    expect(result.outcome).toBe('inventory-exhausted');
    expect(result.turns).toHaveLength(1);
    expect(result.inventory).toEqual({ standard: 3 });
    expect(simulate({ inventory: {} }).metrics.damagePerTurn).toBe(0);
    expect(simulate({ turns: 3 }).turns).toHaveLength(1);
    expect(simulate({ turns: 5, distance: 2, inventory: 'unlimited' }).outcome).toBe('defeat');
  });
  it('처치 시 실제 나간 탄만 소비하고 초과 피해를 실제 체력 감소와 구분한다', () => {
    const config: SimulationConfig = { maxHp: 6, inventory: { split_round: 4 }, sequence: Array<Round>(4).fill('split_round') };
    const result = simulate(config);
    expect(result.outcome).toBe('victory');
    expect(result.metrics).toMatchObject({ totalDamage: 6, effectiveDamage: 6, hits: 2, shots: 1 });
    expect(result.inventory).toEqual({ split_round: 3 });
    expect(simulate({ ...config, maxHp: 5 }).metrics).toMatchObject({ totalDamage: 6, effectiveDamage: 5, hits: 2, shots: 1 });
    expect(config.inventory).toEqual({ split_round: 4 });
  });
  it('합산 성분과 반향·직접 분류를 각각 실제 결과에 맞춘다', () => {
    const config: SimulationConfig = { sequence: ['echo_round', 'copy', 'serrated_round', 'conduit_round'],
      wound: 2, heat: 10, vulnerable: { percent: ammo.vulnerability.percent, remaining: 1 } };
    const result = simulate(config, { detail: true });
    const m = result.metrics;
    const hits = result.frames!.flatMap(f => f.kind === 'shot' ? f.shot.hits : f.kind === 'echo' ? [f.echo.hit] : []);
    expect(m.totalDamage).toBe(hits.reduce((sum, hit) => sum + hit.damage, 0));
    expect(m.totalDamage).toBe(m.modifiedDamage + m.impactDamage + m.woundDamage);
    expect(m.totalDamage).toBe(m.rawBaseDamage + m.conditionalBaseDamage + m.modifierDelta + m.impactDamage + m.woundDamage);
    expect(m.totalDamage).toBe(m.delayedDamage + m.directDamage);
    expect(m.totalDamage).toBe(Object.values(m.damageBySource).reduce((a, b) => a + b, 0));
    expect(m.rawBaseDamage).toBe(27);
    expect(m.delayedDamage).toBeGreaterThan(0);
    expect(m.hits).toBe(6);
    expect(simulate(config, { detail: true })).toEqual(result);
  });
  it('무한 표적은 체력이 감소하지 않고 설정을 재사용할 수 있다', () => {
    const config = { mode: 'encounter', maxHp: 'infinite' } as const;
    const result = simulate(config);
    expect(result.metrics.effectiveDamage).toBe(0);
    expect(result.state.hp).toBe(Infinity);
    expect(simulate(result.scenario)).toEqual(result);
  });
  it.each([
    { weapon: 'other' }, { capacity: 3 }, { sequence: ['standard'] }, { sequence: Array(4).fill('other') },
    { inventory: { standard: -1 } }, { inventory: [] }, { inventory: { other: 2 } },
    { hp: 101, maxHp: 100 }, { maxHp: 'infinite', hp: 10 }, { maxHp: null }, { wound: -1 },
    { seed: -1 }, { turns: 0 }, { heat: Infinity }, { distance: 0 }, { approach: '1' },
    { vulnerable: { percent: 25, remaining: 3 } }, { vulnerable: 0 }, { attachments: [] }, { recoil: 1 },
  ])('잘못된 설정을 거부한다 %j', config => {
    expect(() => normalizeScenario(config as SimulationConfig)).toThrow();
  });
});
