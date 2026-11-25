import { afterEach, describe, expect, it, vi } from 'vitest';
import { CombatController } from '../CombatController';
import * as rules from '../rules';
import { replayStress, runStress } from './stress';

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

describe('전투 스트레스 검사', () => {
  it('고정 회귀 시나리오와 재현 가능한 무작위 조우를 모두 실행한다', () => {
    const options = { iterations: 250, seed: 42 };
    const first = runStress(options);
    expect(first.failures).toEqual([]);
    expect(first.deterministicScenarios).toBeGreaterThan(0);
    expect(first.randomScenarios).toBe(250);
    expect(first.shots).toBeGreaterThan(0);
    expect(runStress(options)).toEqual(first);
    expect(runStress({ ...options, seed: 0 }).shots).not.toBe(first.shots);
  });

  it('관측 기록에 주입한 오류의 슬롯·직전 상태를 JSON으로 복원하고 같은 위치에서 재현한다', () => {
    const real = rules.resolveVolley;
    vi.spyOn(rules, 'resolveVolley').mockImplementation(function* (...args: Parameters<typeof real>) {
      for (const frame of real(...args)) {
        if (frame.kind === 'shot' && frame.shot.index === 1) {
          const hits = frame.shot.hits.map((hit, index) => index === 1 ? { ...hit, impactBonus: hit.impactBonus + 1 } : hit);
          yield { ...frame, shot: { ...frame.shot, hits } };
        } else yield frame;
      }
    });
    const report = runStress({ seed: 7, iterations: 5, maxFailures: 1 });
    expect(report.randomScenarios).toBe(0);
    expect(report.failures).toHaveLength(1);
    const serialized = JSON.parse(JSON.stringify(report.failures[0]));
    expect(serialized).toMatchObject({
      seed: 7, invariant: '독립 기여 합계', expected: 10, actual: 9,
      location: { turn: 1, shot: 2, hit: 2, before: { wound: 6, hp: 988, qualifyingHitCount: 2 } },
    });
    expect(replayStress(serialized).failure).toMatchObject({
      invariant: serialized.invariant, location: serialized.location, actual: 9,
    });
    vi.restoreAllMocks();
    expect(replayStress(serialized).failure).toBeUndefined();
  });

  it('사용자 반복과 오류 수집 한도를 검사한다', () => {
    expect(runStress({ iterations: 0 }).randomScenarios).toBe(0);
    for (const options of [{ iterations: -1 }, { iterations: 1.5 }, { seed: -1 }, { maxFailures: 0 }])
      expect(() => runStress(options)).toThrow(RangeError);
  });

  it('같은 예약 콜백을 여러 번 호출해도 지연 피해·감쇠·이동은 한 번만 해결한다', () => {
    vi.useFakeTimers();
    const timer = vi.spyOn(globalThis, 'setTimeout');
    const events: string[] = [];
    const controller = new CombatController(kind => { if (kind) events.push(kind); });
    controller.reset({ maxHp: 500, distance: 3, approach: 1 });
    const magazine = ['echo_round', 'copy', 'serrated_round', 'conduit_round'] as const;
    magazine.forEach((round, index) => controller.edit(index, round));
    controller.fire();
    const callback = timer.mock.calls.at(-1)![0] as () => void;
    callback();
    callback();
    vi.runAllTimers();
    callback();
    expect(controller.echoes.map(({ shotIndex }) => shotIndex)).toEqual([0, 1]);
    expect(events.filter(kind => kind === 'turn')).toHaveLength(1);
    expect(events.filter(kind => kind === 'approach')).toHaveLength(1);
    expect(controller.state).toMatchObject({ phase: 'planning', wound: 3, turns: 1, actions: 1, distance: 2 });
  });
});
