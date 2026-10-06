import { createServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });
let data;
try {
  const spec = await server.ssrLoadModule('/src/data/ammoSpec.ts');
  data = { headers: spec.SPEC_HEADERS, rows: spec.ammoSpecRows() };
} finally { await server.close(); }
const index = process.argv.indexOf('--python');
const python = index >= 0 ? process.argv[index + 1] : process.platform === 'win32' ? 'python' : 'python3';
const result = spawnSync(python, [path.join(root, 'tools/verify-ammo-spec.py'), path.join(root, 'docs/ZombieShot_Ammo_Spec.xlsx')], {
  input: JSON.stringify(data), encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
});
if (result.error) throw result.error;
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);
process.exitCode = result.status ?? 1;
