import { afterEach, describe, expect, it, vi } from 'vitest';
import { CombatController } from '../CombatController';
import { ammo, defaultScenario, resolveDamage, resolveVolley, startEncounter } from '../rules';
import type { Round } from '../rules';
import { CombatTraceBuffer, traceTurn } from './trace';

const target = (maxHp = 500) => startEncounter({ ...defaultScenario, maxHp });
afterEach(() => vi.useRealTimers());

describe('실제 판정의 선택적 전투 추적', () => {
  it('실제 발사와 반향의 계산값을 기록하며 사격 결과를 보존한다', () => {
    const start = { ...target(), wound: 3 };
    const magazine: Round[] = ['echo_round', 'vulnerability', 'pulse_round', 'convergence_round'];
    const buffer = new CombatTraceBuffer();
    const frames = [...resolveVolley(start, magazine, buffer.sink('검사'))];
    expect(frames).toEqual([...resolveVolley(start, magazine)]);
    const events = buffer.export().events;
    const hits = events.filter(event => event.kind === 'hit');
    const actual = frames.flatMap(f => f.kind === 'shot' ? f.shot.hits : f.kind === 'echo' ? [f.echo.hit] : []);
    expect(hits.map(h => [h.modifiedDamage, h.woundBonus, h.impactBonus, h.finalDamage, h.effectiveHpDamage, h.hpAfter]))
      .toEqual(actual.map(h => [h.modifiedDamage, h.woundDamage, h.impactBonus, h.damage, h.removed, h.after]));
    expect(hits.map(h => [h.countBefore, h.countAfter])).toEqual([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);
    expect(hits[2]).toMatchObject({ previousHit: hits[1]!.storedHit, appliedTransferBps: ammo.pulse_round.transferBps });
    expect(hits[3]).toMatchObject({ conditionalBaseDamage: 6, appliedTransferBps: ammo.pulse_round.transferBps,
      storedHit: { finalDamage: hits[3]!.finalDamage, ownTransferBps: 0 } });
    expect(hits[4]).toMatchObject({ source: 'echo', shot: 1, effectId: 'echo-1', heat: 0,
      vulnerabilityPercent: ammo.vulnerability.percent, rawBaseDamage: ammo.echo_round.echoDamage });
    expect(events.filter(e => e.kind === 'pending').map(e => e.action)).toEqual(['created', 'resolved']);
    const transitions = events.filter(e => e.kind === 'lifecycle');
    expect(transitions.map(e => e.stage)).toEqual(['turn-start', 'action-complete', 'delayed-start', 'turn-end', 'enemy-action', 'turn-ready']);
    expect(transitions[3]).toMatchObject({ before: { wound: 3, qualifyingHits: 5 }, after: { wound: 1, previousHit: null, qualifyingHits: 0 } });
    expect(events.filter(e => e.kind === 'shot').map(e => [e.remainingRounds, e.expectedHits, e.resolvedHits]))
      .toEqual([[3, 1, 1], [2, 0, 0], [1, 2, 2], [0, 1, 1]]);
  });

  it('치명타는 잔여 타격과 대기 반향을 구분하고 초과 피해를 보존한다', () => {
    const buffer = new CombatTraceBuffer();
    const frames = [...resolveVolley(target(6), ['echo_round', 'split_round', 'copy', 'standard'], buffer.sink('처치'))];
    expect(frames.at(-1)?.kind).toBe('victory');
    const events = buffer.export().events;
    expect(events.find(e => e.kind === 'shot' && e.shot === 2)).toMatchObject({ expectedHits: 3, resolvedHits: 1 });
    expect(events.find(e => e.kind === 'hit' && e.shot === 2)).toMatchObject({ hpBefore: 1, hpAfter: 0,
      overkill: 2, effectiveHpDamage: 1, storedHit: null, countAfter: 0 });
    expect(events.filter(e => e.kind === 'pending').map(e => e.action)).toEqual(['created', 'cancelled']);
    const delayed = new CombatTraceBuffer();
    Array.from(resolveVolley(target(14), ['echo_round', 'echo_round', 'vulnerability', 'vulnerability'], delayed.sink('지연 처치')));
    expect(delayed.recent({ source: 'echo' }).filter(e => e.kind === 'pending').map(e => [e.shot, e.action]))
      .toEqual([[1, 'created'], [2, 'created'], [1, 'resolved'], [2, 'cancelled']]);
  });

  it('최근 기록과 필터가 순서를 유지하고 버려진 수를 명시한다', () => {
    const buffer = new CombatTraceBuffer(16);
    const start = target(Infinity);
    const first = [...resolveVolley(start, ['standard', 'standard'], buffer.sink('전투', '가'))].at(-1)!;
    const last = [...resolveVolley(first.state, ['pulse_round'], buffer.sink('전투', '가'))].at(-1)!;
    expect(last.state.turns).toBe(2);
    expect(buffer.export().events).toHaveLength(16);
    expect(buffer.export().dropped).toBeGreaterThan(0);
    expect(buffer.recent({ targetId: '나' })).toHaveLength(0);
    expect(buffer.recent({ combatId: '다른 전투' })).toHaveLength(0);
    const hits = buffer.recent({ turn: 2, ammo: 'pulse_round', source: 'pulse_round', targetId: '가' });
    expect(hits).toHaveLength(2);
    expect(hits[0]).toMatchObject({ kind: 'hit', hpAfter: 'infinite', effectiveHpDamage: 0, overkill: 0 });
    expect(buffer.recent({ source: 'pulse_round' }, 1)[0]).toEqual(hits[1]);
    expect(buffer.recent({}, 0)).toEqual([]);
  });

  it('독립 효과는 탄약 없이 추적하며 진단 코드가 상태의 참조를 받지 않는다', () => {
    const start = resolveDamage(target(), 'standard', 12)!.state;
    const buffer = new CombatTraceBuffer();
    const write = traceTurn(buffer.sink('시나리오'), 2)!;
    const next = resolveDamage(start, 'environment', 3, 0, { write, origin: {
      hit: 1, effectId: '효과-1', rawBaseDamage: 3, conditionalBaseDamage: 0, vulnerabilityPercent: 0, heat: 0, heatPercent: 100,
    } })!.state;
    const [event] = buffer.recent({ source: 'environment' });
    if (event?.kind !== 'hit' || !event.storedHit) throw new Error('타격 기록이 없습니다.');
    expect(event).toMatchObject({ previousHit: start.previousQualifyingHit, appliedTransferBps: 0, qualifies: false, countAfter: 1 });
    event.storedHit.finalDamage = 100;
    expect(next.previousQualifyingHit?.finalDamage).toBe(12);
  });

  it('실시간 리셋으로 폐기한 일제사격이 후속 타격을 기록하지 않는다', () => {
    vi.useFakeTimers();
    const buffer = new CombatTraceBuffer();
    let serial = 0;
    const game = new CombatController(() => {}, () => buffer.sink(String(++serial)));
    game.edit(0, 'echo_round');
    game.fire();
    game.reset();
    game.fire();
    vi.runAllTimers();
    expect(buffer.recent({ combatId: '1' }).at(-1)).toMatchObject({ kind: 'lifecycle', stage: 'reset' });
    expect(buffer.recent({ combatId: '1', source: 'echo' }).filter(e => e.kind === 'pending').map(e => e.action))
      .toEqual(['created', 'cancelled']);
    expect(buffer.recent({ combatId: '2', source: 'echo' })).toHaveLength(3);
    expect(game.shots.map(s => s.damage)).toEqual(buffer.recent({ combatId: '2' }).filter(e => e.kind === 'hit' && !e.effectId)
      .map(e => e.kind === 'hit' ? e.finalDamage : undefined));
  });
});
