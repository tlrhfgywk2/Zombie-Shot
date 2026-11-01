import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { root } from './runtime.mjs';
export async function fingerprint(candidate) {
  const output = await build({ absWorkingDir: fileURLToPath(root), entryPoints: ['tools/hp-balance/evaluate.mjs', 'tools/hp-balance/campaign.mjs', 'tools/hp-balance/bridge.ts'], outdir: 'unused', bundle: true, write: false, platform: 'node', packages: 'external', format: 'esm', metafile: true });
  const sources = [...new Set([...Object.keys(output.metafile.inputs), 'tools/hp-balance/PROTOCOL.md', 'package-lock.json', 'simulation/candidates.json', 'experiments/level-v7/candidate-6.json', 'src/core/Game.ts', 'src/entities/Zombie.ts'])].sort();
  const hash = createHash('sha256');
  for (const source of sources) hash.update(source).update((await readFile(new URL(source, root), 'utf8')).replace(/\r\n/g, '\n'));
  return { hash: hash.update(JSON.stringify(candidate)).digest('hex'), sources };
}
