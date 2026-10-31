import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { root } from './runtime.mjs';
const output = new URL('tools/hp-balance/results/executions/', root); await mkdir(output, { recursive: true });
for (const id of ['baseline', 'hp1', 'hp2', 'hp3', 'hp4', 'hp5']) {
  for (const script of ['evaluate', 'campaign']) {
    const result = spawnSync(process.execPath, [`tools/hp-balance/${script}.mjs`, id, 'exploratory'], { cwd: fileURLToPath(root), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    await writeFile(new URL(`${id}-${script}.txt`, output), result.stdout + '\n' + result.stderr);
    console.log(`${id}/${script}: ${result.status === 0 ? 'PASS' : 'FAIL'}`);
    if (result.status !== 0) { process.exitCode = 1; break; }
  }
}
