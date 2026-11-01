import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
export const root = new URL('../../', import.meta.url);
export async function production() {
  const output = await build({ entryPoints: [fileURLToPath(new URL('tools/hp-balance/bridge.ts', root))], bundle: true, write: false, platform: 'node', format: 'esm' });
  const directory = new URL('tools/hp-runtime.local/', root); await mkdir(directory, { recursive: true });
  const target = new URL(`production-${process.pid}.mjs`, directory); await writeFile(target, output.outputFiles[0].text);
  return import(target.href);
}
