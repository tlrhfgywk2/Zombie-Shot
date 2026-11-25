import { describe, expect, it } from 'vitest';
import { benchmark, compare } from './benchmarks';
import { magazineSpace, search } from './search';
import { registeredRounds, simulate } from './simulator';
import type { Round } from '../rules';

describe('생산 탄약 분석과 검색', () => {
  it('고정 칸에 필요한 재고를 먼저 예약하고 중복 없는 모든 순서를 센다', () => {
    const space = magazineSpace({ inventory: { standard: 2, echo_round: 2 } },
      { pool: ['standard', 'echo_round'], fixed: [null, null, 'standard', null] });
    const all = Array.from({ length: space.size }, (_, i) => space.at(i));
    expect(all).toHaveLength(3);
    expect(new Set(all.map(s => s.join())).size).toBe(3);
    for (const s of all) {
      expect(s[2]).toBe('standard');
      expect(s.filter(r => r === 'echo_round')).toHaveLength(2);
    }
    expect(() => space.at(3)).toThrow();
    expect(() => search({ inventory: {} })).toThrow();
  });
  it('전수 통계와 표본 추출을 실제 탄창 결과로 재현한다', () => {
    const pool: Round[] = ['standard', 'serrated_round'];
    const all = search({}, { pool, maxScenarios: 16, keep: 16 });
    const observed = all.lowest.map(row => simulate({ sequence: row.sequence }).metrics.totalDamage);
    expect(all).toMatchObject({ spaceSize: 16, evaluated: 16, exhaustive: true, min: observed[0], max: observed[15] });
    expect(all.median).toBe((observed[7]! + observed[8]!) / 2);
    const options = { pool, maxScenarios: 14, keep: 14 };
    const sample = search({ seed: 42 }, options);
    expect(sample).toEqual(search({ seed: 42 }, options));
    expect(sample).toMatchObject({ evaluated: 14, exhaustive: false, strategy: 'seeded-sample' });
    expect(new Set(sample.highest.map(s => s.sequence.join())).size).toBe(14);
  });
  it('단탄 측정에 후속 표준탄을 넣지 않고 해당 반향만 귀속한다', () => {
    const result = benchmark();
    expect(result.rows.map(r => r.round)).toEqual(registeredRounds);
    expect(result.rows.find(r => r.round === 'echo_round')?.cold).toMatchObject({
      shots: 1, hits: 2, directDamage: 5, delayedDamage: 5, totalDamage: 10,
    });
    expect(result.rows.find(r => r.round === 'copy')?.cold).toMatchObject({ shots: 1, hits: 0, totalDamage: 0 });
    expect(result.rows.find(r => r.round === 'pursuit_round')?.prepared.hits).toBe(2);
  });
  it('한 칸 교체만으로는 잔여 상호작용이 생기지 않는다', () => {
    const result = compare({ sequence: ['serrated_round', 'standard', 'standard', 'standard'] });
    expect(result.substitutions).toHaveLength(1);
    expect(result.interactionDelta).toBe(0);
    expect(compare({ sequence: ['standard', 'standard', 'standard', 'serrated_round'] },
      ['serrated_round', 'standard', 'standard', 'standard']).orderOnly).toBe(true);
  });
});
