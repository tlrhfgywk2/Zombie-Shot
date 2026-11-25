import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as balance from './combatBalance';
import { CombatController } from './CombatController';
import { ammo, defaultScenario, resolveDamage, resolveVolley, startEncounter } from './rules';
import type { DamageInstance, Encounter, Frame, Round } from './rules';

const C = 'conduit_round', P = 'pulse_round', Wg = 'wedge_round', Cv = 'convergence_round';
const split = 'split_round';
const target = (wound = 0) => ({ ...startEncounter({ ...defaultScenario, maxHp: 500 }), wound });
const events = (frame: Frame) => frame.kind === 'shot' ? frame.shot.hits : frame.kind === 'echo' ? [frame.echo.hit] : [];
const noHistory = { previousQualifyingHit: null, qualifyingHitCount: 0 };

// 수치 예시는 발열에 의한 기본 피해 증폭만 끈다. 발열·냉각과 타격 처리는 실제 경로를 따른다.
beforeEach(() => { vi.spyOn(balance, 'heatDamagePercent').mockReturnValue(100); });
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

type Step = Round | 'N40' | 'R';
function nextHitOrShot(state: Encounter, step: Step) {
  if (step === 'N40' || step === 'R') {
    const ref = resolveDamage(state, 'playerEffect', step === 'R' ? 10 : 40, step === 'R' ? 2000 : 0)!;
    return { state: ref.state, hits: [ref.hit] };
  }
  const frame = resolveVolley({ ...state, phase: 'planning' }, [step]).next().value;
  if (!frame || frame.kind !== 'shot') throw new Error('발사 결과가 없습니다.');
  return { state: frame.state, hits: frame.shot.hits };
}

describe('충격 연결과 표적별 타격 수', () => {
  const cases: [number, Step[], number[]][] = [
    [0, ['reinforced', C, 'standard', 'standard'], [20, 12, 14, 10]],
    [0, ['N40', C, 'standard'], [40, 20, 18]],
    [0, ['reinforced', C, 'R', 'standard'], [20, 12, 14, 12]],
    [0, ['reinforced', C, P, 'standard'], [20, 12, 8, 5, 11]],
    [0, [P], [4, 4]],
    [5, [P, 'standard'], [9, 10, 17]],
    [0, ['R', Wg, C], [10, 4, 8, 7]],
    [5, [Wg, C], [7, 13, 14]],
    [0, [Cv], [4]],
    [0, [split, Cv, C], [3, 3, 3, 10, 8]],
    [5, [split, Cv, C], [8, 8, 8, 15, 15]],
    [0, ['R', Cv, 'standard'], [10, 8, 10]],
    [0, [split, split, Cv, Cv], [3, 3, 3, 3, 3, 3, 16, 18]],
  ];
  it.each(cases)('상처 %i, %j의 순차 피해', (wound, steps, expected) => {
    let state = target(wound);
    const hits: DamageInstance[] = [];
    for (const step of steps) {
      const result = nextHitOrShot(state, step);
      state = result.state;
      hits.push(...result.hits);
      const last = hits.at(-1)!;
      expect(state).toMatchObject({ qualifyingHitCount: hits.length,
        previousQualifyingHit: { finalDamage: last.damage, ownTransferBps: last.ownTransferBps } });
    }
    expect(hits.map(hit => hit.damage)).toEqual(expected);
  });

  it('한 탄창에서 매 타격은 고유 전이율을 기록한다', () => {
    const frames = [...resolveVolley(target(), ['reinforced', C, P, 'standard'])];
    expect(frames.flatMap(events).map(hit => [hit.damage, hit.ownTransferBps])).toEqual([
      [20, 0], [12, 4000], [8, 2000], [5, 2000], [11, 0],
    ]);
    expect(frames.slice(0, 4).map(f => f.state.qualifyingHitCount)).toEqual([1, 2, 4, 5]);
  });

  it('맥동탄을 복제해도 타격마다 20%이고 다음 매개탄과는 40%로 연결한다', () => {
    const frames = [...resolveVolley(target(5), [P, 'copy', C])];
    expect(frames.flatMap(events).map(h => [h.impactBonus, h.ownTransferBps])).toEqual([
      [0, 2000], [1, 2000], [2, 2000], [2, 2000], [4, 4000],
    ]);
  });

  it('표적을 번갈아 맞혀도 각자의 직전 타격과 횟수를 쓴다', () => {
    const a1 = nextHitOrShot(target(), 'reinforced');
    const b1 = nextHitOrShot(target(), C);
    const a2 = nextHitOrShot(a1.state, C);
    const b2 = nextHitOrShot(b1.state, Cv);
    expect([a1, b1, a2, b2].flatMap(result => result.hits.map(h => h.damage))).toEqual([20, 4, 12, 7]);
    expect([a2, b2].map(result => result.state.qualifyingHitCount)).toEqual([2, 2]);
  });

  it.each([0, 5])('상처 %i에서 무피해·환경·상태 부여는 기록을 보존한다', wound => {
    const first = nextHitOrShot(target(wound), C);
    expect(resolveDamage(first.state, 'playerEffect', 0, 6000)).toBeUndefined();
    const status = nextHitOrShot(first.state, 'vulnerability');
    expect(status.hits).toEqual([]);
    expect(status.state).toMatchObject({ previousQualifyingHit: first.state.previousQualifyingHit, qualifyingHitCount: 1 });
    const environment = resolveDamage(first.state, 'environment', 2)!;
    expect(environment.hit).toMatchObject({ damage: 2 + wound, woundDamage: wound, impactBonus: 0 });
    expect(environment.state).toMatchObject({ previousQualifyingHit: first.state.previousQualifyingHit, qualifyingHitCount: 1 });
    const convergence = nextHitOrShot(environment.state, Cv);
    expect(convergence.hits[0]?.damage).toBe(wound ? 14 : 7);
    expect(nextHitOrShot(convergence.state, 'standard').hits[0]?.damage).toBe(10 + wound);
  });

  it('작은 독립 후속 피해도 직전 피해가 되고 100% 초과 전이율도 적용된다', () => {
    const parent = nextHitOrShot(target(), 'reinforced');
    const child = resolveDamage(parent.state, 'playerEffect', 1)!;
    expect(child.state).toMatchObject({ qualifyingHitCount: 2, previousQualifyingHit: { finalDamage: 1, ownTransferBps: 0 } });
    expect(nextHitOrShot(child.state, C).hits[0]?.damage).toBe(4);
    const high = resolveDamage(parent.state, 'playerEffect', 1, 12500)!;
    expect(high.hit.impactBonus).toBe(25);
    expect(resolveDamage(high.state, 'standard', 10)?.hit).toMatchObject({ impactBonus: 32, ownTransferBps: 0 });
    for (const invalid of [NaN, Infinity, -1]) expect(() => resolveDamage(parent.state, 'standard', 10, invalid)).toThrow();
  });

  it('취약은 일반 피해에 적용되고 절개·톱니의 상처는 해당 타격 뒤에 붙는다', () => {
    const first = nextHitOrShot({ ...target(), vulnerable: { percent: 50, remaining: 1 } }, 'reinforced');
    const reference = resolveDamage(first.state, 'playerEffect', 15, 2000)!;
    const last = nextHitOrShot(reference.state, 'standard');
    expect([first.hits[0]?.damage, reference.hit.damage, last.hits[0]?.damage]).toEqual([30, 21, 19]);
    const frames = [...resolveVolley(target(), ['wounding_round', 'serrated_round', P])];
    expect(frames.flatMap(events).map(h => h.damage)).toEqual([5, 6, 14, 15]);
    expect(frames[2]?.state).toMatchObject({ wound: 9, qualifyingHitCount: 4 });
  });

  it('큰 정수 피해에서도 전이 보너스를 올림하지 않는다', () => {
    const previous = resolveDamage(startEncounter(defaultScenario), 'playerEffect', 9_007_199_254_740_987)!;
    expect(nextHitOrShot(previous.state, C).hits[0]?.impactBonus).toBe(3_602_879_701_896_394);
  });
});

describe('반향, 처치, 발사 경계', () => {
  it.each<[number, Round[], number[], number]>([
    [2, ['echo_round', 'serrated_round', C], [7, 5, 14, 18], 4],
    [5, ['echo_round', 'echo_round', C], [10, 10, 13, 15, 10], 2],
  ])('상처 %i, %j의 반향을 모두 처리한 뒤 한 번 정리한다', (wound, rounds, expected, remaining) => {
    const frames = [...resolveVolley(target(wound), rounds)];
    expect(frames.flatMap(events).map(h => h.damage)).toEqual(expected);
    expect(frames.filter(f => f.kind === 'echo').map(f => f.state.qualifyingHitCount))
      .toEqual(expected.slice(rounds.length).map((_, i) => rounds.length + i + 1));
    expect(frames.filter(f => f.kind === 'turn')).toHaveLength(1);
    const next = frames.at(-1)!.state;
    expect(next).toMatchObject({ ...noHistory, wound: remaining });
    for (const round of [Cv, C] as const) expect(nextHitOrShot(next, round).hits[0]?.damage).toBe(4 + remaining);
  });

  it('대기 중인 반향은 집속탄에 포함되지 않고 복제한 조건 보너스는 보존된다', () => {
    const frames = [...resolveVolley(target(), ['echo_round', Cv, 'copy', C])];
    expect(frames.flatMap(events).map(h => h.damage)).toEqual([5, 6, 6, 6, 7]);
  });

  it('치명타는 잔여 체력과 관계없이 계산하고 표적의 타격 기록과 반향을 폐기한다', () => {
    const opening = [...resolveVolley({ ...target(), hp: 3 }, [P])];
    expect(opening.flatMap(events).map(h => [h.damage, h.removed])).toEqual([[4, 3]]);
    expect(opening[0]?.state).toMatchObject(noHistory);
    const frames = [...resolveVolley({ ...target(), hp: 8 }, ['echo_round', P, C])];
    expect(frames.map(f => f.kind)).toEqual(['shot', 'shot', 'turn', 'victory']);
    expect(frames.flatMap(events).map(h => [h.damage, h.removed])).toEqual([[5, 5], [5, 3]]);
    expect(frames[1]?.state).toMatchObject({ ...noHistory, hp: 0 });
    const dead = resolveDamage(frames[0]!.state, 'environment', 3)!.state;
    expect(dead).toMatchObject({ ...noHistory, hp: 0 });
    expect(resolveDamage(dead, 'echo', 5)).toBeUndefined();
  });

  it.each([C, P, Wg, Cv] as const)('%s 한 칸은 한 번 발사·발열하고 추격탄은 원래 계열을 비교한다', round => {
    vi.useFakeTimers();
    const changed = vi.fn();
    const controller = new CombatController(changed);
    const magazine: Round[] = [round, 'pursuit_round', 'pursuit_round', Cv];
    magazine.forEach((r, i) => controller.edit(i, r));
    expect(controller.fire()).toBe(true);
    expect(controller.fire()).toBe(false);
    vi.runAllTimers();
    expect(controller.shots.map(s => s.index)).toEqual([0, 1, 2, 3]);
    expect(changed.mock.calls.filter(([kind]) => kind === 'shot')).toHaveLength(4);
    expect(controller.shots[0]).toMatchObject({ round, heatBefore: 0, heatAfter: ammo[round].heat });
    expect(controller.shots.map(s => s.hits.length)).toEqual([
      round === P || round === Wg ? 2 : 1, round === C || round === P ? 2 : 1, 1, 1,
    ]);
    expect(controller.state).toMatchObject({ ...noHistory, turns: 1 });
  });
});
