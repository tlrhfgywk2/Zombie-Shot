import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { root } from './runtime.mjs';
const output = new URL('experiments/level-v7/results/checks/', root); await mkdir(output, { recursive: true });
// npm 실행 파일이 없는 호스트에서도 package.json에 정의된 동일 진입점을 실행한다.
const commands = {
  tests: ['node_modules/vitest/vitest.mjs', 'run'],
  lint: ['node_modules/eslint/bin/eslint.js', '.'],
  typecheck: ['node_modules/typescript/bin/tsc', '-b'],
  build: ['node_modules/vite/bin/vite.js', 'build'],
  'ammo-spec': ['tools/check-ammo-spec.mjs'],
  'original-v7': ['--test', 'simulation/model.check.mjs'],
  invariants: ['--test', 'tools/level-v7/invariants.check.mjs'],
};
const results = {};
for (const [id, args] of Object.entries(commands)) {
  const start = Date.now(), result = spawnSync(process.execPath, args, { cwd: fileURLToPath(root), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  results[id] = { command: [process.execPath, ...args], status: result.status, milliseconds: Date.now() - start };
  await writeFile(new URL(`${id}.txt`, output), result.stdout + '\n' + result.stderr);
  console.log(`${id}: ${result.status === 0 ? 'PASS' : 'FAIL'}`);
  if (result.status !== 0) process.exitCode = 1;
}
const diff = spawnSync('git', ['diff', '85e6d22', '--name-only', '--', 'src', 'simulation', 'public', 'index.html', 'package.json', 'package-lock.json', '.github'], { cwd: fileURLToPath(root), encoding: 'utf8' });
results.productionSourcesUnchanged = { pass: diff.status === 0 && diff.stdout.trim() === '', files: diff.stdout.trim().split('\n').filter(Boolean) };
if (!results.productionSourcesUnchanged.pass) process.exitCode = 1;
await writeFile(new URL('results.json', output), JSON.stringify({ node: process.version, results }, null, 2));
