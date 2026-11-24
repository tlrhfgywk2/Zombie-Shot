import { afterEach, describe, expect, it, vi } from 'vitest';
import { CombatController } from './CombatController';
import { lockMagazine, P220, resolveVolley, startEncounter } from './rules';
import type { Encounter, Round } from './rules';

const ordinary = ['standard', 'standard', 'standard', 'standard'] as const;
const healthy = startEncounter({ maxHp: 500, distance: 4, approach: 1 });
const vulnerable = { percent: 25, remaining: 1 };

function volley(slots: readonly Round[], start: Encounter = healthy) {
  const locked = lockMagazine(slots, slots.length)!;
  const frames = [...resolveVolley(start, locked)];
  const shots = frames.flatMap(frame => frame.kind === 'shot' ? [frame.shot] : []);
  return { frames, shots, damage: shots.map(s => s.damage), end: frames.at(-1)!.state };
}

describe('탄 순서와 한 번의 최종 반올림', () => {
  const cases: [Round[], number[]][] = [
    [['standard', 'reinforced', 'follow_up', 'finisher'], [10, 20, 18, 16]],
    [['standard', 'follow_up', 'follow_up', 'follow_up'], [10, 13, 15, 16]],
    [['vulnerability', 'reinforced', 'follow_up', 'finisher'], [0, 25, 26, 20]],
    [['vulnerability', 'standard', 'follow_up', 'reinforced'], [0, 13, 18, 25]],
    [['vulnerability', 'pain', 'follow_up', 'finisher'], [0, 15, 19, 20]],
    [['reinforced', 'vulnerability', 'follow_up', 'standard'], [20, 0, 10, 13]],
  ];
  it.each(cases)('%j 순서의 피해', (slots, expected) => {
    expect(volley(slots).damage).toEqual(expected);
  });
  it('다음 탄창의 첫 후속탄은 직전 탄창의 피해를 이어받지 않는다', () => {
    for (const [start, damage] of [[volley(ordinary).end, 8], [volley(['standard', 'vulnerability', 'standard', 'standard']).end, 10]] as const) {
      expect(volley(['follow_up', 'standard', 'standard', 'standard'], start).damage[0]).toBe(damage);
    }
  });
  it('처형 직전 체력 31과 30, 취약 조합', () => {
    for (const [hp, status, expected] of [[31, null, 6], [30, null, 21], [31, vulnerable, 8], [30, vulnerable, 26]] as const) {
      expect(volley(['execution'], { ...healthy, maxHp: 100, hp, vulnerable: status }).shots[0])
        .toMatchObject({ damage: expected, after: hp - expected });
    }
  });
  it('앞선 강화탄이 최대 체력 200의 처형 조건을 연다', () => {
    const result = volley(['reinforced', 'execution', 'standard', 'standard'], { ...healthy, maxHp: 200, hp: 80 });
    expect(result.damage).toEqual([20, 21, 10, 10]);
    expect(result.end.hp).toBe(19);
  });
  it('종결탄은 잠긴 다섯 칸 중 마지막에서만 발동한다', () => {
    expect(P220.capacity).toBe(4);
    expect(volley(['standard', 'standard', 'standard', 'finisher', 'finisher']).damage).toEqual([10, 10, 10, 8, 16]);
  });
  it('두 번째 칸에서 처치하면 미발사 슬롯을 건너뛰고 턴만 한 번 기록한다', () => {
    const result = volley(['standard', 'finisher', 'standard', 'standard'], { ...healthy, hp: 15 });
    expect(result.damage).toEqual([10, 8]);
    expect(result.shots[1]?.removed).toBe(5);
    expect(result.frames.map(frame => frame.kind)).toEqual(['shot', 'shot', 'turn', 'victory']);
    expect(result.end).toMatchObject({ hp: 0, turns: 1, actions: 0 });
  });
});

describe('취약과 접근 순서', () => {
  it('적용 턴과 다음 턴에만 취약이 남는다', () => {
    const first = volley(['vulnerability', 'standard', 'standard', 'standard']);
    const second = volley(ordinary, first.end);
    expect(first.damage).toEqual([0, 13, 13, 13]);
    expect(first.end.vulnerable).toEqual(vulnerable);
    expect(second.damage).toEqual([13, 13, 13, 13]);
    expect(second.end.vulnerable).toBeNull();
    expect(volley(ordinary, second.end).damage).toEqual([10, 10, 10, 10]);
  });
  it('마지막 칸의 취약은 다음 탄창에 적용된다', () => {
    const first = volley(['standard', 'standard', 'standard', 'vulnerability']);
    expect(first.damage).toEqual([10, 10, 10, 0]);
    const next = volley(ordinary, first.end);
    expect(next.damage).toEqual([13, 13, 13, 13]);
    expect(next.end.vulnerable).toBeNull();
  });
  it('취약 재적용은 두 턴으로 갱신하고 강도를 유지한다', () => {
    const result = volley(['vulnerability', 'vulnerability', 'standard', 'standard'], { ...healthy, vulnerable });
    expect(result.damage).toEqual([0, 0, 13, 13]);
    for (const frame of result.frames.slice(0, 2)) expect(frame.state.vulnerable).toEqual({ percent: 25, remaining: 2 });
    expect(result.end.vulnerable).toEqual(vulnerable);
  });
  it('접촉 직전 체력 40은 승리, 41은 즉시 패배한다', () => {
    expect(volley(ordinary, { ...healthy, distance: 1, hp: 40 }).end).toMatchObject({ phase: 'victory', distance: 1, actions: 0, turns: 1 });
    for (const approach of [1, 3]) {
      expect(volley(ordinary, { ...healthy, distance: 1, hp: 41, approach }).end)
        .toMatchObject({ phase: 'defeat', hp: 1, distance: 0, actions: 1, turns: 1 });
    }
  });
  it('발사 중 거리와 행동 횟수는 고정이고 일제사격 후 한 번만 접근한다', () => {
    const result = volley(ordinary);
    for (const frame of result.frames.slice(0, 5)) expect(frame.state).toMatchObject({ distance: 4, actions: 0 });
    expect(result.end).toMatchObject({ distance: 3, actions: 1, turns: 1 });
  });
  it('서로 다른 거리에서도 피해는 같다', () => {
    const slots = ['vulnerability', 'reinforced', 'follow_up', 'finisher'] as const;
    expect(volley(slots, { ...healthy, distance: 1 }).damage).toEqual(volley(slots, { ...healthy, distance: 10 }).damage);
  });
});

describe('발사 잠금과 초기화', () => {
  afterEach(() => vi.useRealTimers());
  it('불완전한 탄창, 중복 입력, 발사 중 편집, 종결 후 발사를 거부한다', () => {
    vi.useFakeTimers();
    const controller = new CombatController(() => {});
    controller.reset({ maxHp: 41, distance: 1, approach: 1 });
    const initial = controller.state;
    controller.edit(0, null);
    expect(controller.fire()).toBe(false);
    expect(controller.state).toBe(initial);
    controller.edit(0, 'standard');
    const slots = controller.slots;
    expect(controller.fire()).toBe(true);
    expect(controller.fire()).toBe(false);
    expect(controller.edit(0, 'pain')).toBe(false);
    vi.runAllTimers();
    expect(controller.shots).toHaveLength(4);
    expect(controller.slots).toBe(slots);
    expect(controller.state).toMatchObject({ phase: 'defeat', actions: 1, turns: 1 });
    expect(controller.fire()).toBe(false);
    controller.reset({ maxHp: 5, distance: 1, approach: 1 });
    controller.fire();
    expect(controller.state.phase).toBe('victory');
    expect(controller.fire()).toBe(false);
  });
  it.each(['firing', 'approach'])('%s 중 초기화 뒤 이미 대기 중이던 콜백을 직접 실행한다', phase => {
    vi.useFakeTimers();
    const timer = vi.spyOn(globalThis, 'setTimeout');
    const controller = new CombatController(() => {});
    controller.edit(0, 'vulnerability');
    controller.fire();
    if (phase === 'approach') vi.advanceTimersByTime(1200);
    expect(controller.state.phase).toBe(phase);
    const pending = timer.mock.calls.at(-1)![0] as () => void;
    controller.reset();
    const state = controller.state;
    const slots = controller.slots;
    pending();
    vi.runAllTimers();
    expect(controller.state).toBe(state);
    expect(state).toMatchObject({ hp: 100, distance: 3, phase: 'planning', vulnerable: null, actions: 0, turns: 0 });
    expect(controller.slots).toBe(slots);
    expect(slots[0]).toBe('vulnerability');
    expect(controller.shots).toEqual([]);
    timer.mockRestore();
  });
  it('탄창 복사본은 불변이고 잘못된 시나리오는 현재 전투를 유지한다', () => {
    const slots: Round[] = [...ordinary];
    const locked = lockMagazine(slots, P220.capacity)!;
    slots[0] = 'pain';
    expect(locked[0]).toBe('standard');
    expect(Object.isFrozen(locked)).toBe(true);
    const controller = new CombatController(() => {});
    const initial = controller.state;
    expect(controller.reset({ maxHp: 0, distance: 1, approach: 1 })).toBe(false);
    expect(controller.state).toBe(initial);
  });
});

