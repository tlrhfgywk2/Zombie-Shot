import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('../', import.meta.url));
const help = `전투 시험장 분석
  npm run combat -- <명령> [--config 설정.json] [--out 결과.json]
  catalog     현재 시험장의 무기·탄약 목록
  single      탄약별 첫 발과 준비된 마지막 발 측정
  ordered     지정한 탄창의 발사·타격·턴별 결과
  compare     순서 비교와 한 칸 교체 대조 실험
  search      재고·고정 칸을 지키는 중복 없는 조합 검색
  --sequence 탄ID,탄ID,탄ID,탄ID    사용할 순서
  --against 탄ID,탄ID,탄ID,탄ID     비교 기준 순서
  --limit 정수                      검색 상한
  --seed 정수                       재현 시드
  --out 경로                        결과 저장 (생략하면 표준 출력)`;

async function loadModule(path) {
  const result = await build({ entryPoints: [resolve(root, path)], platform: 'node', format: 'esm', bundle: true,
    write: false, logLevel: 'silent' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
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

async function main() {
  const { positionals, values } = parseArgs({ allowPositionals: true, options: {
    config: { type: 'string' }, out: { type: 'string' }, sequence: { type: 'string' }, against: { type: 'string' },
    seed: { type: 'string' }, limit: { type: 'string' }, help: { type: 'boolean', short: 'h' },
  } });
  const [command] = positionals;
  if (!command || values.help) { console.log(help); return; }
  if (positionals.length !== 1) throw new Error('명령은 한 번에 하나만 지정하세요.');
  const input = values.config ? JSON.parse((await readFile(values.config, 'utf8')).replace(/^\uFEFF/, '')) : {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('설정은 JSON 객체여야 합니다.');
  const scenario = input.scenario ?? {};
  if (!scenario || typeof scenario !== 'object' || Array.isArray(scenario)) throw new Error('scenario에는 객체를 지정하세요.');
  if (values.sequence !== undefined) scenario.sequence = values.sequence.split(',').map(r => r.trim());
  if (values.seed !== undefined) scenario.seed = Number(values.seed);
  const rules = await loadModule('src/prototype/rules.ts');
  const simulator = await loadModule('src/prototype/analysis/simulator.ts');
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
    default: throw new Error(`알 수 없는 명령입니다.\n${help}`);
  }
  const sourceStatus = git('status', '--porcelain', '--', 'src/prototype', 'tools/combat-analysis.mjs', 'src/exploration/ExplorationRun.ts');
  const content = JSON.stringify({ schemaVersion: 1, revision: git('rev-parse', 'HEAD'),
    sourceDirty: sourceStatus === null ? null : Boolean(sourceStatus), command, result }, encode, 2) + '\n';
  if (values.out) {
    await mkdir(dirname(resolve(values.out)), { recursive: true });
    await writeFile(values.out, content);
    console.error(`결과 저장: ${resolve(values.out)}`);
  } else process.stdout.write(content);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
