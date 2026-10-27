import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { root } from './runtime.mjs';
export async function levelFingerprint(settings) {
  const built = await build({ absWorkingDir: fileURLToPath(root), entryPoints: ['tools/level-v7/evaluate.mjs'], outdir: 'unused', bundle: true, write: false, platform: 'node', packages: 'external', format: 'esm', metafile: true });
  // 브리지의 동적 import는 runtime에서 메모리 번들하므로 해당 원본 그래프도 포함한다.
  const bridge = await build({ absWorkingDir: fileURLToPath(root), entryPoints: ['experiments/level-v7/bridge.ts'], bundle: true, write: false, platform: 'node', format: 'esm', metafile: true });
  const files = [...new Set([...Object.keys(built.metafile.inputs), ...Object.keys(bridge.metafile.inputs), 'package-lock.json',
    'experiments/level-v7/protocol.json', 'experiments/level-v7/v7-config.json'])].map(path => path.replaceAll('\\', '/')).sort();
  const hash = createHash('sha256');
  for (const file of files) hash.update(file + '\0').update((await readFile(new URL(file, root), 'utf8')).replace(/\r\n/g, '\n')).update('\0');
  return { hash: hash.update(JSON.stringify(settings)).digest('hex'), files };
}
