import { afterEach, describe, expect, it, vi } from 'vitest';
import { heatDamageMultiplier } from './combatBalance';
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
    [['standard', 'reinforced', 'follow_up', 'finisher'], [10, 23, 23, 20]],
    [['standard', 'follow_up', 'follow_up', 'follow_up'], [10, 15, 19, 22]],
    [['vulnerability', 'reinforced', 'follow_up', 'finisher'], [0, 26, 28, 23]],
    [['vulnerability', 'standard', 'follow_up', 'reinforced'], [0, 13, 22, 32]],
    [['vulnerability', 'pain', 'follow_up', 'finisher'], [0, 16, 22, 23]],
    [['reinforced', 'vulnerability', 'follow_up', 'standard'], [20, 0, 11, 14]],
    [['resonance', 'standard', 'standard', 'standard'], [18, 10, 12, 14]],
    [['mixed', 'resonance', 'resonance', 'mixed'], [12, 15, 15, 14]],
    [['mixed', 'mixed', 'mixed', 'mixed'], [10, 11, 11, 12]],
    [['resonance', 'mixed', 'copy', 'follow_up'], [10, 17, 18, 19]],
    [['vulnerability', 'pain', 'copy', 'copy'], [0, 16, 17, 17]],
    [['reinforced', 'follow_up', 'copy', 'follow_up'], [20, 19, 19, 19]],
    [['standard', 'standard', 'finisher', 'copy'], [10, 12, 11, 12]],
  ];
  it.each(cases)('%j 순서의 피해', (slots, expected) => {
    expect(volley(slots).damage).toEqual(expected);
  });
  it('다음 탄창의 첫 후속탄은 직전 탄창의 피해를 이어받지 않는다', () => {
    for (const [start, damage] of [[volley(ordinary).end, 11], [volley(['standard', 'vulnerability', 'standard', 'standard']).end, 13]] as const) {
      expect(volley(['follow_up', 'standard', 'standard', 'standard'], start).shots[0]).toMatchObject({ damage, bonus: 0 });
    }
  });
  it('처형 직전 체력 31과 30, 취약 조합', () => {
    for (const [hp, status, expected] of [[31, null, 6], [30, null, 21], [31, vulnerable, 8], [30, vulnerable, 26]] as const) {
      expect(volley(['execution'], { ...healthy, maxHp: 100, hp, vulnerable: status }).shots[0])
        .toMatchObject({ damage: expected, after: hp - expected });
    }
  });
  it('취약탄의 상태 부여도 복제하며 다음 탄의 피해에 반영한다', () => {
    const result = volley(['vulnerability', 'copy', 'resonance', 'mixed']);
    expect(result.damage).toEqual([0, 0, 13, 22]);
    expect(result.shots[1]).toMatchObject({ round: 'copy', source: 'vulnerability', applied: true });
    expect(result.end.vulnerable).toEqual(vulnerable);
  });
  it('첫 칸과 그 직후의 복제탄에는 이전 탄창의 피해나 효과가 남지 않는다', () => {
    const start = volley(['standard', 'standard', 'standard', 'vulnerability']).end;
    const result = volley(['copy', 'copy', 'standard', 'copy'], start);
    expect(result.damage).toEqual([0, 0, 16, 18]);
    expect(result.shots[1]).toMatchObject({ source: null, applied: false });
    expect(result.end.vulnerable).toBeNull();
  });
  it('첫 동조탄으로 처치해도 뒤의 미발사 탄까지 구성에 포함한다', () => {
    const result = volley(['resonance', 'resonance', 'resonance', 'resonance'], { ...healthy, hp: 18 });
    expect(result.damage).toEqual([22]);
    expect(result.shots[0]?.removed).toBe(18);
  });
  it('앞선 강화탄이 최대 체력 200의 처형 조건을 연다', () => {
    const result = volley(['reinforced', 'execution', 'standard', 'standard'], { ...healthy, maxHp: 200, hp: 80 });
    expect(result.damage).toEqual([20, 22, 11, 13]);
    expect(result.end.hp).toBe(14);
  });
  it('종결탄은 잠긴 다섯 칸 중 마지막에서만 발동한다', () => {
    expect(P220.capacity).toBe(4);
    expect(volley(['standard', 'standard', 'standard', 'finisher', 'finisher']).damage).toEqual([10, 12, 13, 12, 26]);
  });
  it('두 번째 칸에서 처치하면 미발사 슬롯을 건너뛰고 턴만 한 번 기록한다', () => {
    const result = volley(['standard', 'finisher', 'standard', 'standard'], { ...healthy, hp: 15 });
    expect(result.damage).toEqual([10, 9]);
    expect(result.shots[1]?.removed).toBe(5);
    expect(result.frames.map(frame => frame.kind)).toEqual(['shot', 'shot', 'turn', 'victory']);
    expect(result.frames[2]?.state.weaponHeat).toBe(14);
    expect(result.end).toMatchObject({ hp: 0, turns: 1, actions: 0, weaponHeat: 0 });
  });
});

describe('취약과 접근 순서', () => {
  it('적용 턴과 다음 턴에만 취약이 남는다', () => {
    const first = volley(['vulnerability', 'standard', 'standard', 'standard']);
    const second = volley(ordinary, first.end);
    expect(first.damage).toEqual([0, 13, 15, 17]);
    expect(first.end.vulnerable).toEqual(vulnerable);
    expect(second.shots.map(shot => shot.percent)).toEqual([25, 25, 25, 25]);
    expect(second.end.vulnerable).toBeNull();
    expect(volley(ordinary, second.end).shots.map(shot => shot.percent)).toEqual([0, 0, 0, 0]);
  });
  it('마지막 칸의 취약은 다음 탄창에 적용된다', () => {
    const first = volley(['standard', 'standard', 'standard', 'vulnerability']);
    expect(first.damage).toEqual([10, 12, 13, 0]);
    const next = volley(ordinary, first.end);
    expect(next.shots.map(shot => shot.percent)).toEqual([25, 25, 25, 25]);
    expect(next.end.vulnerable).toBeNull();
  });
  it('취약 재적용은 두 턴으로 갱신하고 강도를 유지한다', () => {
    const result = volley(['vulnerability', 'vulnerability', 'standard', 'standard'], { ...healthy, vulnerable });
    expect(result.damage).toEqual([0, 0, 14, 16]);
    for (const frame of result.frames.slice(0, 2)) expect(frame.state.vulnerable).toEqual({ percent: 25, remaining: 2 });
    expect(result.end.vulnerable).toEqual(vulnerable);
  });
  it('접촉 직전 체력 50은 승리, 51은 즉시 패배한다', () => {
    expect(volley(ordinary, { ...healthy, distance: 1, hp: 50 }).end).toMatchObject({ phase: 'victory', distance: 1, actions: 0, turns: 1 });
    for (const approach of [1, 3]) {
      expect(volley(ordinary, { ...healthy, distance: 1, hp: 51, approach }).end)
        .toMatchObject({ phase: 'defeat', hp: 1, distance: 0, actions: 1, turns: 1, weaponHeat: 0 });
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
    controller.reset({ maxHp: 51, distance: 1, approach: 1 });
    const initial = controller.state;
    controller.edit(0, null);
    expect(controller.fire()).toBe(false);
    expect(controller.state.weaponHeat).toBe(0);
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
    expect(state).toMatchObject({ hp: 100, distance: 3, phase: 'planning', vulnerable: null, actions: 0, turns: 0, weaponHeat: 0 });
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

describe('무기 열', () => {
  it('발사 직전 열을 사용하고 표준탄 네 발의 열을 합산한 뒤 냉각한다', () => {
    const result = volley(ordinary);
    expect(result.shots.map(shot => shot.heatBefore)).toEqual([0, 16, 32, 48]);
    expect(result.shots.map(shot => shot.heatAfter)).toEqual([16, 32, 48, 64]);
    expect(result.damage).toEqual([10, 12, 13, 15]);
    expect(result.frames.slice(4).map(frame => [frame.kind, frame.state.weaponHeat]))
      .toEqual([['turn', 32], ['approach', 32], ['cleanup', 32]]);
    expect(healthy.weaponHeat).toBe(0);
  });

  it('네 턴 동안 냉각 후 남은 열을 다음 턴으로 전달한다', () => {
    let state = { ...healthy, distance: 6 };
    for (const [start, peak, cooled] of [[0, 64, 32], [32, 96, 48], [48, 112, 56], [56, 120, 60]]) {
      expect(state.weaponHeat).toBe(start);
      const result = volley(ordinary, state);
      expect(result.shots[0]?.heatBefore).toBe(start);
      expect(result.shots[3]?.heatAfter).toBe(peak);
      expect(result.end.weaponHeat).toBe(cooled);
      state = result.end;
    }
  });

  it('표준탄으로 쌓은 열이 뒤의 강화탄을 증폭하고 무사격 턴도 냉각한다', () => {
    const mixed = volley(['standard', 'standard', 'reinforced', 'reinforced']);
    expect(mixed.shots.map(shot => shot.heatBefore)).toEqual([0, 16, 32, 35]);
    expect(mixed.damage).toEqual([10, 12, 26, 27]);
    expect(mixed.shots.at(-1)?.heatAfter).toBe(38);
    expect(mixed.end.weaponHeat).toBe(19);
    const idle = [...resolveVolley(mixed.end, [])];
    expect(idle.map(frame => [frame.kind, frame.state.weaponHeat]))
      .toEqual([['turn', 9.5], ['approach', 9.5], ['cleanup', 9.5]]);
    expect(mixed.end.weaponHeat).toBe(19);
  });

  it('취약과 열을 곱한 37.5를 마지막에 반올림하고 피해가 없는 취약탄도 열을 얻는다', () => {
    const result = volley(['reinforced', 'vulnerability'], { ...healthy, vulnerable, weaponHeat: 50 });
    expect(result.shots[0]).toMatchObject({ percent: 25, heatBefore: 50, damage: 38 });
    expect(result.shots[1]).toMatchObject({ damage: 0, heatBefore: 53, heatAfter: 58 });
    expect(result.end.vulnerable).toEqual(vulnerable);
  });

  it('취약과 열의 곱이 14.5인 경우 최종 피해는 15다', () => {
    expect(volley(['standard'], { ...healthy, vulnerable, weaponHeat: 16 }).damage).toEqual([15]);
  });

  it('연속 복제는 취약과 현재 열을 한 번씩 적용하고 원본 탄의 열은 복제하지 않는다', () => {
    const basic = volley(['standard', 'copy']);
    expect(basic.damage).toEqual([10, 12]);
    expect(basic.shots.map(shot => shot.heatAfter)).toEqual([16, 16]);
    const boosted = volley(['standard', 'copy', 'copy'], { ...healthy, vulnerable, weaponHeat: 50 });
    expect(boosted.damage).toEqual([19, 21, 21]);
    expect(boosted.shots.map(shot => shot.heatAfter)).toEqual([66, 66, 66]);
  });

  it.each([[100, 2], [150, 2.5], [200, 3], [250, 3.5]])('열 %i에서 배율 ×%s를 적용한다', (weaponHeat, multiplier) => {
    expect(heatDamageMultiplier(weaponHeat)).toBe(multiplier);
    const result = volley(['reinforced'], { ...healthy, weaponHeat });
    expect(result.shots[0]).toMatchObject({ damage: 20 * multiplier, heatAfter: weaponHeat + 3 });
  });

  it('잘못된 탄창과 종결된 전투의 발사를 처리하지 않는다', () => {
    expect([...resolveVolley(healthy, ['standard', 'invalid' as Round])]).toEqual([]);
    expect([...resolveVolley({ ...healthy, phase: 'victory' }, ordinary)]).toEqual([]);
  });

  it('턴 사이 탄창을 비우고 다시 채워도 열이 유지되며 새 전투에서는 초기화된다', () => {
    vi.useFakeTimers();
    try {
      const controller = new CombatController(() => {});
      controller.fire();
      vi.runAllTimers();
      expect(controller.state.weaponHeat).toBe(32);
      for (let i = 0; i < P220.capacity; i++) controller.edit(i, null);
      expect(controller.fire()).toBe(false);
      for (let i = 0; i < P220.capacity; i++) controller.edit(i, 'standard');
      expect(controller.state.weaponHeat).toBe(32);
      controller.fire();
      expect(controller.shots[0]?.heatBefore).toBe(32);
      vi.runAllTimers();
      expect(controller.state).toMatchObject({ phase: 'victory', weaponHeat: 0 });
      controller.reset();
      expect(controller.state).toMatchObject({ phase: 'planning', weaponHeat: 0 });
    } finally {
      vi.useRealTimers();
    }
  });
});
