import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { closeSync, openSync, writeFileSync } from 'node:fs';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual, parseArgs } from 'node:util';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('../', import.meta.url));
const help = `전투 시험장 분석
  npm run combat -- <명령> [--config 설정.json] [--out 결과.json]
  catalog     현재 시험장의 무기·탄약 목록
  single      탄약별 첫 발과 준비된 마지막 발 측정
  ordered     지정한 탄창의 발사·타격·턴별 결과
  compare     순서 비교와 한 칸 교체 대조 실험
  search      재고·고정 칸을 지키는 중복 없는 조합 검색
  stress      고정 회귀 검사와 시드 기반 무작위 조우
  replay      --config로 지정한 스트레스 결과에서 실패 재현
  trace       생산 판정 단계별 피해와 전투 이벤트 기록
  --sequence 탄ID,탄ID,탄ID,탄ID    사용할 순서
  --against 탄ID,탄ID,탄ID,탄ID     비교 기준 순서
  --limit 정수                      검색 또는 무작위 검사 상한
  --index 정수                      재현할 실패 번호 (0부터 시작)
  --stream 경로                     trace 전체 이벤트를 NDJSON으로 저장
  --seed 정수                       재현 시드
  --out 경로                        결과 저장 (생략하면 표준 출력)`;

async function loadModule(path) {
  const result = await build({ entryPoints: [resolve(root, path)], platform: 'node', format: 'esm', bundle: true,
    write: false, logLevel: 'silent' });
  const code = result.outputFiles[0].text + '\n//# sourceURL=' + path + '.bundle.js';
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
}

function git(...args) {
  try { return execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim(); }
  catch { return null; }
}

function encode(_key, value) {
  if (value === Infinity) return 'infinite';
  if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('결과에 유효하지 않은 수치가 있습니다.');
  return value;
}

function checkFields(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label}에는 JSON 객체를 지정하세요.`);
  const unknown = Object.keys(value).find(key => !keys.includes(key));
  if (unknown !== undefined) throw new Error(`${label}에서 지원하지 않는 항목: ${unknown}`);
}

async function traceCombat(scenario, options, streamPath, metadata, rules, simulator) {
  const { CombatTraceBuffer } = await loadModule('src/prototype/analysis/trace.ts');
  const buffer = new CombatTraceBuffer(options.capacity);
  const sink = buffer.sink('combat-1');
  const normalized = simulator.normalizeScenario(scenario);
  const temporary = streamPath && resolve(streamPath) + '.' + randomUUID() + '.tmp';
  if (temporary) await mkdir(dirname(temporary), { recursive: true });
  const fd = temporary ? openSync(temporary, 'wx') : undefined;
  const line = row => writeFileSync(fd, JSON.stringify(row, encode) + '\n');
  try {
    let run;
    try {
      if (fd !== undefined) {
        line({ kind: 'metadata', ...metadata, scenario: normalized });
        const remember = sink.emit;
        sink.emit = event => { remember(event); line(event); };
      }
      run = simulator.simulate(normalized, { resolve: (state, slots) => rules.resolveVolley(state, slots, sink) });
      if (fd !== undefined) line({ kind: 'summary', outcome: run.outcome, metrics: run.metrics });
    } finally {
      if (fd !== undefined) closeSync(fd);
    }
    if (temporary) await rename(temporary, resolve(streamPath));
    return { scenario: normalized, metrics: run.metrics, outcome: run.outcome, trace: buffer.export(options.filter),
      filter: options.filter ?? {}, stream: streamPath ?? null };
  } catch (error) {
    if (temporary) await rm(temporary, { force: true });
    throw error;
  }
}

async function main() {
  const { positionals, values } = parseArgs({ allowPositionals: true, options: {
    config: { type: 'string' }, out: { type: 'string' }, sequence: { type: 'string' }, against: { type: 'string' },
    seed: { type: 'string' }, limit: { type: 'string' }, index: { type: 'string' }, stream: { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  } });
  const [command] = positionals;
  if (!command || values.help) { console.log(help); return; }
  if (positionals.length !== 1) throw new Error('명령은 한 번에 하나만 지정하세요.');
  if (values.stream && command !== 'trace') throw new Error('--stream은 trace에서 사용하세요.');
  if (values.out && values.stream && relative(resolve(values.out), resolve(values.stream)) === '') throw new Error('요약과 전체 이벤트의 출력 경로를 다르게 지정하세요.');
  if (values.config && [values.out, values.stream].some(path => path && relative(resolve(path), resolve(values.config)) === '')) {
    throw new Error('설정 파일과 출력 파일은 서로 다른 경로를 지정하세요.');
  }
  const input = values.config ? JSON.parse((await readFile(values.config, 'utf8')).replace(/^\uFEFF/, '')) : {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('설정은 JSON 객체여야 합니다.');
  if (command !== 'replay') {
    checkFields(input, ['scenario', 'search', 'trace', 'stress', 'against', 'repetitions'], '최상위 설정');
    if ('search' in input) checkFields(input.search, ['pool', 'fixed', 'keep', 'maxScenarios', 'maxMs'], '검색 설정');
    if ('stress' in input) checkFields(input.stress, ['seed', 'iterations', 'maxFailures'], '스트레스 설정');
    if ('trace' in input) {
      checkFields(input.trace, ['capacity', 'filter'], '추적 설정');
      if ('filter' in input.trace) checkFields(input.trace.filter, ['combatId', 'targetId', 'turn', 'ammo', 'source'], '추적 필터');
    }
  }
  const scenario = input.scenario === undefined ? {} : input.scenario;
  if (!scenario || typeof scenario !== 'object' || Array.isArray(scenario)) throw new Error('scenario에는 객체를 지정하세요.');
  if (values.sequence !== undefined) scenario.sequence = values.sequence.split(',').map(r => r.trim());
  if (values.seed !== undefined) scenario.seed = Number(values.seed);
  const rules = await loadModule('src/prototype/rules.ts');
  const simulator = await loadModule('src/prototype/analysis/simulator.ts');
  const sourceStatus = git('status', '--porcelain', '--', 'src/prototype', 'tools/combat-analysis.mjs', 'src/exploration/ExplorationRun.ts');
  const metadata = { schemaVersion: 1, revision: git('rev-parse', 'HEAD'),
    sourceDirty: sourceStatus === null ? null : Boolean(sourceStatus), command };
  let result;
  switch (command) {
    case 'catalog':
      result = { weapon: rules.P220, ammo: rules.ammo, target: '시험장 단일 감염체', attachments: [], recoil: null };
      break;
    case 'ordered': {
      const repetitions = input.repetitions ?? 1;
      if (!Number.isSafeInteger(repetitions) || repetitions < 1 || repetitions > 1000) throw new Error('반복 횟수는 1~1000입니다.');
      const run = simulator.simulate(scenario, { detail: true });
      const totals = [run.metrics.totalDamage];
      for (let i = 1; i < repetitions; i++) totals.push(simulator.simulate(scenario).metrics.totalDamage);
      result = { ...run, repetitions, totals };
      break;
    }
    case 'single':
      result = (await loadModule('src/prototype/analysis/benchmarks.ts')).benchmark(scenario);
      break;
    case 'compare':
      result = (await loadModule('src/prototype/analysis/benchmarks.ts')).compare(scenario,
        values.against === undefined ? input.against : values.against.split(',').map(r => r.trim()));
      break;
    case 'search': {
      const options = { ...input.search };
      if (values.limit !== undefined) options.maxScenarios = Number(values.limit);
      result = (await loadModule('src/prototype/analysis/search.ts')).search(scenario, options);
      break;
    }
    case 'stress': {
      const options = { ...input.stress };
      if (values.seed !== undefined) options.seed = Number(values.seed);
      if (values.limit !== undefined) options.iterations = Number(values.limit);
      result = (await loadModule('src/prototype/analysis/stress.ts')).runStress(options);
      if (result.failures.length) process.exitCode = 1;
      break;
    }
    case 'replay': {
      const index = Number(values.index ?? 0);
      if (!Number.isSafeInteger(index) || index < 0) throw new Error('실패 번호는 0 이상의 정수여야 합니다.');
      const failure = (input.result ?? input).failures?.[index] ?? (input.caseId && input);
      if (!failure) throw new Error('지정한 실패가 없습니다. 실패를 기록한 JSON과 번호를 지정하세요.');
      const replay = (await loadModule('src/prototype/analysis/stress.ts')).replayStress(failure);
      result = { original: failure, replay, reproduced: Boolean(replay.failure && replay.failure.invariant === failure.invariant &&
        replay.failure?.location.turn === failure.location.turn && replay.failure?.location.shot === failure.location.shot &&
        replay.failure.location.hit === failure.location.hit && replay.failure.location.event === failure.location.event &&
        replay.failure.location.target === failure.location.target && isDeepStrictEqual(replay.failure.expected, failure.expected) &&
        isDeepStrictEqual(replay.failure.actual, failure.actual)) };
      if (replay.failure) process.exitCode = 1;
      break;
    }
    case 'trace':
      result = await traceCombat(scenario, input.trace ?? {}, values.stream, metadata, rules, simulator);
      break;
    default: throw new Error(`알 수 없는 명령입니다.\n${help}`);
  }
  const content = JSON.stringify({ ...metadata, result }, encode, 2) + '\n';
  if (values.out) {
    await mkdir(dirname(resolve(values.out)), { recursive: true });
    await writeFile(values.out, content);
    console.error(`결과 저장: ${resolve(values.out)}`);
  } else process.stdout.write(content);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
