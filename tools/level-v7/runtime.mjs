import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
export const root = new URL('../../', import.meta.url);
export async function production() {
  const result = await build({ entryPoints: [fileURLToPath(new URL('experiments/level-v7/bridge.ts', root))], bundle: true, write: false, platform: 'node', format: 'esm' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
}
