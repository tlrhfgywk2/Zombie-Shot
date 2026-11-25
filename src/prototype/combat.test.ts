import { afterEach, describe, expect, it, vi } from 'vitest';
import { heatDamageMultiplier } from './combatBalance';
import { CombatController } from './CombatController';
import { ammo, defaultScenario, lockMagazine, P220, resolveVolley, startEncounter } from './rules';
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

describe('상처와 독립 타격', () => {
  it('절개탄과 톱니탄은 기존 상처가 적용된 뒤 상처를 부여하고 합산한다', () => {
    const first = volley(['wounding_round', 'serrated_round']);
    expect(first.shots[0]).toMatchObject({ damage: 5, woundApplied: 3, hits: [{ modifiedDamage: 5, woundDamage: 0 }] });
    expect(first.shots[1]).toMatchObject({ damage: 6, woundApplied: 6, hits: [{ modifiedDamage: 3, woundDamage: 3 }] });
    expect(first.frames.slice(0, 2).map(frame => frame.state.wound)).toEqual([3, 9]);
    expect(first.end.wound).toBe(4);
    expect(first.end.vulnerable).toBeNull();
    expect(volley(['serrated_round']).shots[0]).toMatchObject({ damage: 3, woundApplied: 6, hits: [{ damage: 3 }] });
  });

  it('상처는 기본 피해 배율을 받지 않고 양의 피해 한 건당 한 번만 발동한다', () => {
    const first = volley(['copy', 'vulnerability', 'standard'], { ...healthy, wound: 5 });
    expect(first.shots.slice(0, 2).map(shot => shot.hits)).toEqual([[], []]);
    expect(first.frames.slice(0, 3).map(frame => frame.state.wound)).toEqual([5, 5, 5]);
    expect(first.shots[2]).toMatchObject({ damage: 18, hits: [{ modifiedDamage: 13, woundDamage: 5, damage: 18 }] });
    const next = volley(['standard', 'follow_up'], { ...healthy, wound: 5 });
    expect(next.shots[1]).toMatchObject({ bonus: 5, hits: [{ damage: 20, woundDamage: 5 }] });
  });

  it('한 턴에 한 번씩 상처가 7 → 3 → 1 → 0으로 줄어든다', () => {
    let state = { ...healthy, wound: 7 };
    for (const value of [3, 1, 0]) {
      const frames = [...resolveVolley(state, [])];
      expect(frames[0]).toMatchObject({ kind: 'turn', state: { wound: value } });
      state = frames.at(-1)!.state;
      expect(state.wound).toBe(value);
    }
  });

  it.each([[0, 9, 3], [5, 24, 8]])('상처 %i에서 한 발의 분열탄 피해는 %i', (wound, damage, perHit) => {
    const result = volley(['split_round'], { ...healthy, wound });
    expect(result.shots).toHaveLength(1);
    expect(result.shots[0]).toMatchObject({ damage, heatBefore: 0, heatAfter: ammo.split_round.heat });
    expect(result.shots[0]!.hits.map(hit => hit.damage)).toEqual([perHit, perHit, perHit]);
    expect(result.shots[0]!.hits.map(hit => hit.after)).toEqual([500 - perHit, 500 - perHit * 2, 500 - damage]);
  });

  it('추격탄은 실제 직전 발사 탄의 계열을 비교하고 새 탄창에서 초기화한다', () => {
    const noPrevious = volley(['pursuit_round']);
    const sameFamily = volley(['reinforced', 'pursuit_round']);
    const differentFamily = volley(['wounding_round', 'pursuit_round']);
    const active = volley(['wounding_round', 'pursuit_round', 'pursuit_round'], { ...healthy, wound: 2 });
    const afterSplit = volley(['split_round', 'pursuit_round']);
    const afterCopy = volley(['wounding_round', 'copy', 'pursuit_round']);
    for (const result of [noPrevious, sameFamily, afterSplit, afterCopy]) {
      expect(result.shots.at(-1)!.hits.map(hit => hit.modifiedDamage)).toEqual([7]);
    }
    expect(differentFamily.shots[1]!.hits.map(hit => hit.modifiedDamage)).toEqual([7, 5]);
    expect(active.shots[1]).toMatchObject({ damage: 22, hits: [{ damage: 12 }, { damage: 10 }] });
    expect(active.shots[2]!.hits).toHaveLength(1);
    expect(volley(['pursuit_round'], volley(['wounding_round']).end).shots[0]!.hits).toHaveLength(1);
  });

  it('처형탄과 종결탄은 조건 발동 시에도 상처가 한 번만 추가된다', () => {
    const target = { ...healthy, hp: 30, maxHp: 100, wound: 5 };
    const execution = volley(['execution'], target).shots[0]!;
    const finisher = volley(['finisher'], target).shots[0]!;
    expect(execution.hits).toMatchObject([{ modifiedDamage: 21, woundDamage: 5, damage: 26 }]);
    expect(finisher.hits).toMatchObject([{ modifiedDamage: 16, woundDamage: 5, damage: 21 }]);
  });

  it.each([[0, 5], [5, 10]])('상처 %i에서 반향탄의 즉시·지연 피해는 각각 %i', (wound, damage) => {
    const result = volley(['echo_round'], { ...healthy, wound });
    expect(result.shots).toHaveLength(1);
    expect(result.shots[0]!.hits).toMatchObject([{ damage }]);
    expect(result.frames.slice(1, 3)).toMatchObject([
      { kind: 'echo', echo: { hit: { damage } }, state: { hp: 500 - damage * 2, wound, weaponHeat: ammo.echo_round.heat } },
      { kind: 'turn', state: { wound: Math.floor(wound / 2) } },
    ]);
  });

  it('반향은 현재 상처를 읽고 발사 순서대로 모두 해결한 뒤 상처를 감쇠한다', () => {
    const result = volley(['echo_round', 'serrated_round', 'echo_round'], { ...healthy, wound: 2 });
    expect(result.shots[0]!.damage).toBe(7);
    expect(result.frames.slice(3, 6)).toMatchObject([
      { kind: 'echo', echo: { shotIndex: 0, hit: { damage: 13, woundDamage: 8 } }, state: { wound: 8 } },
      { kind: 'echo', echo: { shotIndex: 2, hit: { damage: 14, woundDamage: 8 } }, state: { wound: 8 } },
      { kind: 'turn', state: { wound: 4 } },
    ]);
    expect(volley(['echo_round', 'vulnerability']).frames[2]).toMatchObject({ kind: 'echo', echo: { hit: { damage: 6 } } });
  });

  it('표적을 처치하면 남은 타격과 대기 중인 반향을 건너뛴다', () => {
    const direct = volley(['echo_round', 'split_round', 'standard'], { ...healthy, hp: 10 });
    expect(direct.shots.map(shot => shot.round)).toEqual(['echo_round', 'split_round']);
    expect(direct.shots[1]!.hits.map(hit => hit.removed)).toEqual([3, 2]);
    expect(direct.frames.map(frame => frame.kind)).toEqual(['shot', 'shot', 'turn', 'victory']);
    const delayed = volley(['echo_round', 'echo_round'], { ...healthy, hp: 12 });
    expect(delayed.frames.map(frame => frame.kind)).toEqual(['shot', 'shot', 'echo', 'turn', 'victory']);
    expect(delayed.end).toMatchObject({ hp: 0, actions: 0, turns: 1 });
  });

  it('복제탄은 직전 탄의 독립 타격과 상태 효과를 복제하며 자체 발열만 적용한다', () => {
    const result = volley(['wounding_round', 'copy', 'split_round', 'copy']);
    expect(result.shots[1]).toMatchObject({ woundApplied: 3, heatBefore: 5, heatAfter: 5 });
    expect(result.shots.slice(2).map(shot => shot.hits.length)).toEqual([3, 3]);
    const echoes = volley(['echo_round', 'copy']).frames.filter(frame => frame.kind === 'echo');
    expect(echoes.map(frame => frame.echo.shotIndex)).toEqual([0, 1]);
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
    expect(controller.clearMagazine()).toBe(false);
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
    expect(state).toMatchObject({ hp: Infinity, distance: 3, phase: 'planning', vulnerable: null, actions: 0, turns: 0, weaponHeat: 0 });
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
    expect(controller.reset({ maxHp: Infinity, distance: Infinity, approach: 1 })).toBe(false);
    expect(controller.state).toBe(initial);
  });

  it('독립 타격과 반향은 추가 탄창 칸이나 실제 발사 이벤트를 쓰지 않는다', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const controller = new CombatController(onChange);
    controller.edit(0, 'split_round');
    controller.edit(1, 'echo_round');
    controller.edit(2, 'echo_round');
    controller.edit(3, 'serrated_round');
    expect(controller.fire()).toBe(true);
    expect(controller.shots).toHaveLength(1);
    expect(controller.shots[0]!.hits).toHaveLength(3);
    expect(controller.echoes).toHaveLength(0);
    vi.runAllTimers();
    expect(onChange.mock.calls.flat().filter(kind => kind === 'shot')).toHaveLength(P220.capacity);
    expect(controller.shots.map(shot => shot.index)).toEqual([0, 1, 2, 3]);
    expect(controller.echoes.map(event => event.shotIndex)).toEqual([1, 2]);
    expect(controller.state).toMatchObject({ weaponHeat: 10, wound: 3, turns: 1 });
  });

  it('지연 타격의 타이머가 대기 중일 때 재시작하면 이전 전투의 반향을 처리하지 않는다', () => {
    vi.useFakeTimers();
    const timer = vi.spyOn(globalThis, 'setTimeout');
    try {
      const controller = new CombatController(() => {});
      controller.edit(0, 'echo_round');
      controller.edit(1, 'echo_round');
      controller.fire();
      vi.advanceTimersByTime(1200);
      expect(controller.echoes).toHaveLength(1);
      const pending = timer.mock.calls.at(-1)![0] as () => void;
      controller.reset();
      pending();
      vi.runAllTimers();
      expect(controller.state).toEqual(startEncounter(defaultScenario));
      expect(controller.echoes).toHaveLength(0);
    } finally {
      timer.mockRestore();
    }
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

  it('복제탄을 포함해 기록에 기본·발열 전·최종 피해를 따로 보존한다', () => {
    const result = volley(['reinforced', 'follow_up', 'copy'], { ...healthy, vulnerable, weaponHeat: 50 });
    expect(result.shots.map(({ baseDamage, preHeatDamage, damage }) => [baseDamage, preHeatDamage, damage]))
      .toEqual([[20, 25, 38], [8, 33.75, 52], [8, 33.75, 53]]);
  });

  it('기본 무한 체력에 피해를 기록해도 체력과 처형 조건은 바뀌지 않는다', () => {
    const first = volley(['execution', 'standard', 'standard', 'standard'], startEncounter(defaultScenario));
    expect(first.shots[0]).toMatchObject({ before: Infinity, after: Infinity, baseDamage: 6, damage: 6, bonus: 0, removed: 0 });
    expect(first.shots).toHaveLength(4);
    const second = volley(ordinary, first.end);
    expect(second.end).toMatchObject({ hp: Infinity, phase: 'planning', turns: 2 });
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
      const onChange = vi.fn();
      const controller = new CombatController(onChange);
      controller.reset({ ...defaultScenario, maxHp: 100 });
      controller.fire();
      vi.runAllTimers();
      expect(controller.state.weaponHeat).toBe(32);
      onChange.mockClear();
      expect(controller.clearMagazine()).toBe(true);
      expect(controller.slots).toEqual([null, null, null, null]);
      expect(onChange).toHaveBeenCalledTimes(1);
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
