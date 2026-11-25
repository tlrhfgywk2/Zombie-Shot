import { seededRandom } from '../../exploration/ExplorationRun';
import { ammo, P220, resolveDamage, startEncounter } from '../rules';
import type { DamageInstance, Encounter, Frame, Round } from '../rules';
import { registeredRounds, simulate } from './simulator';
import type { SimulationConfig } from './simulator';
import { fixtures } from './stressFixtures';

interface StressCase {
  caseId: string;
  scenario: SimulationConfig;
}

interface Location {
  turn: number;
  shot: number | null;
  hit: number | null;
  event: string;
  target: string;
  before: Partial<Encounter>;
  observed?: DamageInstance | { power: number; ownTransferBps: number };
}

export interface StressFailure extends StressCase {
  seed: number;
  iteration: number | null;
  location: Omit<Location, 'before' | 'observed'> & { before: unknown; observed?: unknown };
  invariant: string;
  expected: unknown;
  actual: unknown;
  stack?: string;
}

class InvariantError extends Error {
  constructor(readonly invariant: string, readonly expected: unknown, readonly actual: unknown) {
    super(invariant);
  }
}

function equal(invariant: string, expected: unknown, actual: unknown) {
  if (expected !== actual) throw new InvariantError(invariant, expected, actual);
}

// JSON에는 NaN·무한대 표현이 없어 오류를 내보낼 때만 기호를 보존한다.
function evidence(value: unknown): unknown {
  if (value === undefined) return null;
  return JSON.parse(JSON.stringify(value, (_key, entry) =>
    typeof entry === 'number' && !Number.isFinite(entry) ? String(entry) : entry));
}

function sameHistory(expected: Encounter['previousQualifyingHit'], actual: Encounter['previousQualifyingHit']) {
  equal('직전 적격 타격의 최종 피해', expected?.finalDamage, actual?.finalDamage);
  equal('직전 적격 타격의 고유 전이율', expected?.ownTransferBps, actual?.ownTransferBps);
}

const transferProbeId = '표적 격리와 고전이율 시험';

// 실제 탄약 등록부에 없는 전이율은 독립 판정 입력으로만 공급한다.
function transferProbe(location: Location) {
  const initial = startEncounter({ maxHp: 1_000, distance: 4, approach: 1 });
  const targets = { A: { ...initial, wound: 3 }, B: initial };
  const steps = [
    ['A', 1, 0, 0, 4], ['B', 1, 1, 0, 1], ['A', 1, 12_500, 5, 9],
    ['B', 2, 0, 0, 2], ['A', 2, 4_000, 11, 16], ['A', 1, 0, 6, 10], ['A', 1, 0, 0, 4],
  ] as const;
  for (const [index, [id, power, rate, impact, final]] of steps.entries()) {
    const before = targets[id];
    Object.assign(location, { before, target: id, hit: index + 1, event: '독립 효과', observed: { power, ownTransferBps: rate } });
    const resolved = resolveDamage(before, 'playerEffect', power, rate);
    if (!resolved) throw new InvariantError('양의 독립 효과', '타격 한 건', null);
    equal('고유 전이율의 최댓값·내림', impact, resolved.hit.impactBonus);
    equal('상처와 전이 포함 최종 피해', final, resolved.hit.damage);
    equal('효과당 적격 타격 한 건', before.qualifyingHitCount + 1, resolved.state.qualifyingHitCount);
    sameHistory({ finalDamage: final, ownTransferBps: rate }, resolved.state.previousQualifyingHit);
    targets[id] = resolved.state;
  }
}

function randomCase(seed: number): StressCase {
  const random = seededRandom(String(seed));
  const integer = (count: number) => Math.floor(random() * count);
  const choose = <T>(values: readonly T[]) => values[integer(values.length)]!;
  const sequence = Array.from({ length: P220.capacity }, () => choose(registeredRounds));
  const turns = 1 + integer(8);
  const magazines = choose([0, 1, turns, 1 + integer(turns)]);
  const stock: Partial<Record<Round, number>> = {};
  for (const round of sequence) stock[round] = (stock[round] ?? 0) + magazines;
  const maxHp = choose([1, 10, 31, 1_000_000, 1 + integer(600)]);
  const scenario: SimulationConfig = {
    mode: 'encounter', seed, sequence, weapon: P220.name, capacity: P220.capacity, turns,
    maxHp, hp: choose([1, maxHp, maxHp, 1 + integer(maxHp)]),
    distance: choose([1, turns + 1, 1 + integer(12)]), approach: 1 + integer(3),
    wound: choose([0, 1, 6, 48, integer(12)]), heat: choose([0, 0.5, 16, 126, integer(64)]),
    vulnerable: choose([null, { percent: ammo.vulnerability.percent, remaining: 1 }, { percent: ammo.vulnerability.percent, remaining: 2 }]),
    inventory: integer(4) === 0 ? 'unlimited' : stock,
  };
  return { caseId: '무작위 조우', scenario };
}

function inspectCombat(test: StressCase, location: Location) {
  const { scenario } = test;
  const fixture = fixtures.find(row => row.id === test.caseId);
  if (!fixture && test.caseId !== '무작위 조우') throw new RangeError('등록되지 않은 회귀 시나리오입니다.');
  let lastKind: Frame['kind'] | undefined;
  let shotCount = 0;
  let echoCount = 0;
  let totalShots = 0;
  let totalHits = 0;
  let turns = 0;
  let totalDamage = 0;
  let effectiveDamage = 0;
  const pending: number[] = [];
  const used: Partial<Record<Round, number>> = {};
  const result = simulate(scenario, { onFrame(frame, before, turn) {
    Object.assign(location, { turn, event: frame.kind, shot: null, hit: null, observed: undefined, before });
    const { state, kind } = frame;
    equal('종결 직후 후속 이벤트 금지', false, lastKind === 'victory' || lastKind === 'defeat');
    const infiniteTarget = before.maxHp === Infinity;
    equal('시험장 표적의 체력 범위', true, infiniteTarget ? state.hp === Infinity
      : Number.isFinite(state.hp) && state.hp >= 0 && state.hp <= state.maxHp);
    equal('무기 열 범위', true, Number.isFinite(state.weaponHeat) && state.weaponHeat >= 0);
    equal('턴 카운터 증가 시점', before.turns + Number(kind === 'turn'), state.turns);
    if (kind === 'shot' || kind === 'echo') {
      const shot = frame.kind === 'shot' ? frame.shot : undefined;
      const echo = frame.kind === 'echo' ? frame.echo : undefined;
      const slot = shot?.index ?? echo!.shotIndex;
      location.shot = slot + 1;
      const hits = shot?.hits ?? [echo!.hit];
      if (shot) {
        equal('사격 단계 순서', true, lastKind === undefined || lastKind === 'shot' || lastKind === 'cleanup');
        equal('탄창 슬롯당 한 번 발사', shotCount++, slot);
        equal('계획한 슬롯 탄종', scenario.sequence![slot], shot.round);
        equal('사격 전 열', before.weaponHeat, shot.heatBefore);
        equal('발사당 한 번 발열', shot.heatBefore + ammo[shot.round].heat, shot.heatAfter);
        equal('사격 후 열', shot.heatAfter, state.weaponHeat);
        equal('총 피해와 독립 타격 합계', shot.damage, hits.reduce((sum, hit) => sum + hit.damage, 0));
        equal('표적 체력 감소와 발사 기록', infiniteTarget ? 0 : before.hp - state.hp, shot.removed);
        const definition = shot.source && ammo[shot.source];
        if (state.hp > 0 && definition && 'echoDamage' in definition) pending.push(slot);
        used[shot.round] = (used[shot.round] ?? 0) + 1;
        totalShots++;
      } else {
        equal('지연 타격 단계 순서', true, lastKind === 'shot' || lastKind === 'echo');
        equal('대기 중인 원래 슬롯당 한 번 해결', pending.shift(), slot);
        if (fixture?.echoes) {
          equal('지연 타격 원본 슬롯', fixture.echoes[echoCount]?.slot, slot);
          equal('지연 시점 최종 피해', fixture.echoes[echoCount]?.damage, echo!.hit.damage);
        }
        echoCount++;
      }

      const expectedShot = shot && fixture?.shots[slot];
      if (expectedShot) {
        equal('탄약별 독립 타격 수', expectedShot.hits, hits.length);
        if (expectedShot.woundApplied !== undefined) equal('사격 후 상처 부여', expectedShot.woundApplied, shot!.woundApplied);
        if (expectedShot.bonus !== undefined) equal('조건부 증폭', expectedShot.bonus, shot!.bonus);
      }
      let hp = before.hp;
      let count = before.qualifyingHitCount;
      let previous = before.previousQualifyingHit;
      for (const [index, hit] of hits.entries()) {
        location.hit = index + 1;
        location.observed = hit;
        location.before = { ...before, hp, previousQualifyingHit: previous, qualifyingHitCount: count };
        equal('살아 있는 표적만 타격', true, hp > 0);
        equal('직전 타격 뒤 체력 연결', hp, hit.before);
        for (const component of ['damage', 'modifiedDamage', 'impactBonus', 'woundDamage', 'removed', 'ownTransferBps'] as const satisfies readonly (keyof DamageInstance)[]) {
          equal(`유효한 비음수 정수 ${component}`, true, Number.isSafeInteger(hit[component]) && hit[component] >= 0);
        }
        equal('상처는 각 양의 타격에 한 번만 적용', before.wound, hit.woundDamage);
        equal('독립 기여 합계', hit.modifiedDamage + hit.woundDamage + hit.impactBonus, hit.damage);
        equal('표적의 실제 체력 감소', infiniteTarget ? 0 : Math.min(hp, hit.damage), hit.removed);
        equal('타격 직후 체력', hp - hit.removed, hit.after);
        if (expectedShot?.damages) equal('순서별 피해 기준', expectedShot.damages[index], hit.damage);
        if (expectedShot?.impacts) equal('순서별 충격 기준', expectedShot.impacts[index], hit.impactBonus);
        hp = hit.after;
        previous = hp ? { finalDamage: hit.damage, ownTransferBps: hit.ownTransferBps } : null;
        count = hp ? count + 1 : 0;
        totalHits++;
        totalDamage += hit.damage;
        effectiveDamage += hit.removed;
      }
      equal('사격 결과의 최종 체력', hp, state.hp);
      equal('독립 타격 수와 처치 초기화', count, state.qualifyingHitCount);
      sameHistory(previous, state.previousQualifyingHit);
      equal('타격 후 상처 유지·부여·처치 정리', hp ? before.wound + (shot?.woundApplied ?? 0) : 0, state.wound);
    } else if (kind === 'turn') {
      equal('사격 이후 턴 한 번 종료', true, lastKind === 'shot' || lastKind === 'echo');
      if (before.hp > 0) {
        equal('생존한 표적에 전체 탄창 발사', P220.capacity, shotCount);
        equal('턴 종료 전에 지연 피해 해결', 0, pending.length);
      }
      if (fixture) {
        equal('회귀 시나리오 발사 수', fixture.shots.length, shotCount);
        if (fixture.echoes) equal('회귀 시나리오 지연 타격 수', fixture.echoes.length, echoCount);
        if (fixture.turnWounds) equal('턴 경계 상처 감쇠', fixture.turnWounds[turn - 1], state.wound);
      }
      sameHistory(null, state.previousQualifyingHit);
      equal('턴 경계 타격 수 초기화', 0, state.qualifyingHitCount);
      turns++;
      shotCount = 0;
      echoCount = 0;
      pending.length = 0;
    } else if (kind === 'approach') {
      equal('턴 직후 적 행동', 'turn', lastKind);
      equal('살아 있는 표적의 접근', true, before.hp > 0);
      equal('턴당 적 행동 한 번', before.actions + 1, state.actions);
    } else if (kind === 'victory') {
      equal('처치 후 한 번 승리', 'turn', lastKind);
      equal('승리 시 체력', 0, state.hp);
    } else {
      equal('접근 후 종결·정리', 'approach', lastKind);
      equal('접촉 판정', kind === 'defeat', state.distance === 0);
    }
    lastKind = kind;
    location.before = state;
  } });
  location.event = '시뮬레이션 합산';
  location.hit = null;
  location.shot = null;
  location.observed = undefined;
  equal('발사된 탄약 소모', totalShots, result.metrics.shots);
  equal('실제 독립 타격 합산', totalHits, result.metrics.hits);
  equal('실제 최종 피해 합산', totalDamage, result.metrics.totalDamage);
  equal('실제 유효 피해 합산', effectiveDamage, result.metrics.effectiveDamage);
  equal('실제 종료 턴 수', turns, result.state.turns);
  if (fixture?.turnWounds) equal('회귀 시나리오 전체 턴 수', fixture.turnWounds.length, turns);
  if (result.state.phase === 'planning') equal('적 행동 후 준비 복귀', true, lastKind === undefined || lastKind === 'cleanup');
  else equal('종결된 시뮬레이션의 마지막 이벤트', result.state.phase, lastKind);
  if (result.inventory !== 'unlimited' && result.scenario.inventory !== 'unlimited') {
    for (const id of registeredRounds) {
      const remaining = result.inventory[id] ?? 0;
      equal('음수 재고 금지', true, remaining >= 0);
      equal(`실제 사격에만 재고 차감 ${id}`, (result.scenario.inventory[id] ?? 0) - (used[id] ?? 0), remaining);
    }
  }
  return result.metrics;
}

function execute(test: StressCase, seed: number, iteration: number | null) {
  const { scenario } = test;
  const hp = scenario.hp ?? scenario.maxHp;
  const location: Location = {
    before: { hp: hp === 'infinite' ? Infinity : hp, wound: scenario.wound ?? 0, weaponHeat: scenario.heat ?? 0 },
    turn: 1, shot: null, hit: null, event: '시작', target: '표적 1',
  };
  try {
    if (test.caseId === transferProbeId) {
      transferProbe(location);
      return {};
    }
    return { metrics: inspectCombat(test, location) };
  } catch (error) {
    const failed = error instanceof InvariantError;
    const failure: StressFailure = {
      ...test, seed, iteration,
      location: { ...location, before: evidence(location.before), observed: evidence(location.observed) },
      invariant: failed ? error.invariant : '전투 판정 중 예외',
      expected: failed ? evidence(error.expected) : '예외 없이 실행',
      actual: failed ? evidence(error.actual) : String(error),
      stack: error instanceof Error ? error.stack?.replace(/data:text\/javascript;base64,[\w+/=]+/g, 'combat-analysis.bundle') : undefined,
    };
    return { failure };
  }
}

/** 실패 하나의 전체 설정으로 같은 검사를 다시 실행한다. */
export function replayStress(failure: StressFailure) {
  return execute({ caseId: failure.caseId, scenario: failure.scenario }, failure.seed, failure.iteration);
}

export interface StressOptions {
  seed?: number;
  iterations?: number;
  maxFailures?: number;
}

export function runStress({ seed = 20261125, iterations = 1000, maxFailures = 1 }: StressOptions = {}) {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError('시드는 0~4294967295 정수여야 합니다.');
  if (!Number.isSafeInteger(iterations) || iterations < 0 || iterations > 1_000_000) throw new RangeError('반복 횟수는 0~100만 정수여야 합니다.');
  if (!Number.isSafeInteger(maxFailures) || maxFailures < 1 || maxFailures > 1_000) throw new RangeError('실패 수집 한도는 1~1000 정수여야 합니다.');
  const failures: StressFailure[] = [];
  const random = seededRandom(`stress:${seed}`);
  const cases = fixtures.map(({ id, sequence, setup }): StressCase => ({
    caseId: id, scenario: { mode: 'encounter', seed, weapon: P220.name, capacity: P220.capacity, maxHp: 1_000,
      distance: 8, approach: 1, sequence, ...setup },
  }));
  cases.push({ caseId: transferProbeId, scenario: { seed, maxHp: 1000, distance: 4, approach: 1, weapon: P220.name } });
  let deterministicScenarios = 0;
  let randomScenarios = 0;
  let hits = 0;
  let shots = 0;
  for (let index = 0; index < cases.length + iterations && failures.length < maxFailures; index++) {
    const fixed = index < cases.length;
    const caseSeed = fixed ? seed : Math.floor(random() * 0x1_0000_0000);
    const result = execute(fixed ? cases[index]! : randomCase(caseSeed), caseSeed, fixed ? null : index - cases.length);
    if (fixed) deterministicScenarios++;
    else randomScenarios++;
    if (result.failure) failures.push(result.failure);
    if (result.metrics) {
      hits += result.metrics.hits;
      shots += result.metrics.shots;
    }
  }
  return { seed, iterations, maxFailures, deterministicScenarios, randomScenarios, shots, hits, failures };
}
