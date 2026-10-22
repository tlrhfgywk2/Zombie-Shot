/* global URL */
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url);
export async function productionInputs() {
  const output = await build({ absWorkingDir: fileURLToPath(root), entryPoints: ['simulation/production-entry.mjs'], bundle: true, write: false, platform: 'node', format: 'esm', metafile: true });
  return Object.keys(output.metafile.inputs).map(path => path.replaceAll('\\', '/')).sort();
}

// Hash complete evaluator sources, lockfile and the actual production dependency
// graph. Normalize checkout line endings; never guess transitive dependencies.
// The optional source reader permits in-memory mutation tests without editing game files.
export async function fingerprint(config, protocol, readSource = readFile) {
  const files = new Set([
    'simulation/model.mjs', 'simulation/evaluate.mjs', 'simulation/common.mjs',
    'simulation/provenance.mjs', 'simulation/exposure.mjs', 'package-lock.json',
    ...await productionInputs(),
  ]);
  const hasher = createHash('sha256');
  for (const file of [...files].sort()) {
    const source = (await readSource(new URL(file, root), 'utf8')).replace(/\r\n/g, '\n');
    hasher.update(file + '\0').update(source).update('\0');
  }
  return hasher.update(JSON.stringify(config)).update(JSON.stringify(protocol)).digest('hex');
}
