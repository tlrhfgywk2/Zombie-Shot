import { seededRandom } from '../../exploration/ExplorationRun';
import { isRound, P220 } from '../rules';
import type { Round } from '../rules';
import { registeredRounds, simulate } from './simulator';
import type { SimulationConfig } from './simulator';

export interface SearchOptions {
  pool?: readonly Round[];
  fixed?: readonly (Round | null)[];
  maxScenarios?: number;
  maxMs?: number;
  keep?: number;
}

function positive(value: number, name: string) {
  if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`${name} 값은 양의 안전한 정수여야 합니다.`);
  return value;
}

// 고정 칸의 재고를 먼저 예약한다. 남은 수량이 허용하는 순서의 수로 각 순서에 고유 번호를 준다.
export function magazineSpace(config: SimulationConfig, options: SearchOptions) {
  const pool = options.pool ?? registeredRounds;
  if (!Array.isArray(pool) || !pool.every(isRound) || new Set(pool).size !== pool.length) {
    throw new Error('검색 탄약 목록에는 중복 없는 등록 탄약 ID를 지정하세요.');
  }
  const capacity = config.capacity ?? P220.capacity;
  if (capacity !== P220.capacity) throw new Error(`P220 탄창은 ${P220.capacity}칸입니다.`);
  const fixed = options.fixed ?? Array<Round | null>(capacity).fill(null);
  if (!Array.isArray(fixed) || fixed.length !== capacity || !fixed.every(r => r === null || pool.includes(r))) {
    throw new Error('고정 칸은 탄창과 같은 길이이며, 빈 칸(null) 또는 검색 목록의 탄약이어야 합니다.');
  }
  const inventory = config.inventory;
  if (inventory !== undefined && inventory !== 'unlimited' && (!inventory || typeof inventory !== 'object' || Array.isArray(inventory)
    || Object.entries(inventory).some(([r, n]) => !isRound(r) || !Number.isSafeInteger(n) || n < 0))) {
    throw new Error('재고에는 등록 탄약과 0 이상의 정수를 지정하세요.');
  }
  const stock = pool.map(r => inventory && inventory !== 'unlimited' ? inventory[r] ?? 0 : capacity);
  for (const r of fixed) if (r !== null) stock[pool.indexOf(r)]!--;
  const memo = new Map<string, number>();
  function count(left: number, available: number[]): number {
    if (!left) return 1;
    if (available.every(n => n >= left)) return available.length ** left;
    const key = left + '/' + available.map(n => Math.min(n, left)).sort().join(',');
    const cached = memo.get(key);
    if (cached !== undefined) return cached;
    let total = 0;
    for (const [i, n] of available.entries()) {
      if (n < 1) continue;
      available[i]!--;
      total += count(left - 1, available);
      available[i]!++;
    }
    memo.set(key, total);
    return total;
  }
  const blanks = fixed.filter(r => r === null).length;
  const size = stock.some(n => n < 0) ? 0 : count(blanks, stock);
  if (!Number.isSafeInteger(size)) throw new Error('검색 공간이 너무 큽니다. 탄약 목록이나 고정 칸을 지정하세요.');
  function at(rank: number): Round[] {
    if (!Number.isSafeInteger(rank) || rank < 0 || rank >= size) throw new RangeError('검색 번호가 범위를 벗어났습니다.');
    const available = [...stock];
    let left = blanks;
    return fixed.map(r => {
      if (r !== null) return r;
      left--;
      for (const [i, n] of available.entries()) {
        if (n < 1) continue;
        available[i]!--;
        const branch = count(left, available);
        if (rank < branch) return pool[i]!;
        rank -= branch;
        available[i]!++;
      }
      throw new Error('검색 번호에 대응하는 순서가 없습니다.');
    });
  }
  return { size, at };
}

function percentile(sorted: readonly number[], fraction: number) {
  const index = (sorted.length - 1) * fraction;
  const lower = sorted[Math.floor(index)]!;
  return lower + (sorted[Math.ceil(index)]! - lower) * (index % 1);
}

export function search(config: SimulationConfig = {}, options: SearchOptions = {}) {
  const budget = positive(options.maxScenarios ?? 500, '최대 시나리오 수');
  const keep = positive(options.keep ?? 5, '상하위 보관 수');
  const maxMs = options.maxMs === undefined ? Infinity : positive(options.maxMs, '시간 제한');
  const space = magazineSpace(config, options);
  if (!space.size) throw new Error('재고와 고정 칸을 만족하는 완전한 탄창이 없습니다.');
  const sampled = space.size > budget;
  const random = seededRandom(String(config.seed ?? 1));
  const swaps = new Map<number, number>();
  const rows: { rank: number; damage: number }[] = [];
  const started = performance.now();
  let example;
  for (let i = 0; i < Math.min(budget, space.size); i++) {
    if (i && performance.now() - started >= maxMs) break;
    let rank = i;
    if (sampled) {
      // 부분 피셔–예이츠 셔플. 이미 방문한 번호는 다시 뽑히지 않는다.
      const selected = i + Math.floor(random() * (space.size - i));
      rank = swaps.get(selected) ?? selected;
      swaps.set(selected, swaps.get(i) ?? i);
      swaps.delete(i);
    }
    const run = simulate({ ...config, sequence: space.at(rank) });
    example ??= run.scenario;
    rows.push({ rank, damage: run.metrics.totalDamage });
  }
  rows.sort((a, b) => a.damage - b.damage || a.rank - b.rank);
  const scores = rows.map(row => row.damage);
  const cutoff = scores[scores.length - Math.ceil(scores.length / 10)]!;
  const leaders = rows.filter(row => row.damage >= cutoff);
  const ammoCounts: Partial<Record<Round, number>> = {};
  for (const row of leaders) {
    for (const r of space.at(row.rank)) ammoCounts[r] = (ammoCounts[r] ?? 0) + 1;
  }
  const describe = (row: typeof rows[number]) => ({ sequence: space.at(row.rank), damage: row.damage });
  return {
    config, exampleScenario: example, options: { ...options, maxScenarios: budget, keep },
    seed: config.seed ?? 1, strategy: sampled ? 'seeded-sample' : 'enumeration',
    spaceSize: space.size, evaluated: rows.length, exhaustive: rows.length === space.size,
    stoppedByTime: rows.length < Math.min(budget, space.size),
    min: scores[0]!, max: scores.at(-1)!, mean: scores.reduce((a, b) => a + b, 0) / rows.length,
    p10: percentile(scores, .1), median: percentile(scores, .5), p90: percentile(scores, .9),
    highest: rows.slice(-keep).reverse().map(describe), lowest: rows.slice(0, keep).map(describe),
    upperDecile: { minimum: cutoff, sequencesIncludingTies: leaders.length, ammoCounts },
  };
}
