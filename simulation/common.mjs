import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
export async function production() {
  const bundled = await build({ entryPoints: [fileURLToPath(new URL('./production-entry.mjs', import.meta.url))], bundle: true, write: false, platform: 'node', format: 'esm' });
  return import('data:text/javascript;base64,' + Buffer.from(bundled.outputFiles[0].text).toString('base64'));
}
export function rng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let mixed = Math.imul(value ^ value >>> 15, value | 1);
    mixed ^= mixed + Math.imul(mixed ^ mixed >>> 7, mixed | 61);
    return ((mixed ^ mixed >>> 14) >>> 0) / 4294967296;
  };
}
export const pick = (items, random) => items[Math.floor(random() * items.length)];
export function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function quantile(values, q) {
  const sorted = [...values].sort((a, b) => a - b);
  const at = (sorted.length - 1) * q;
  return sorted[Math.floor(at)] + (sorted[Math.ceil(at)] - sorted[Math.floor(at)]) * (at % 1);
}
export const mean = values => values.reduce((a, b) => a + b, 0) / values.length;
export function wilson(successes, n) {
  if (!n) return [0, 1];
  const z = 1.96, p = successes / n, d = 1 + z * z / n;
  const center = (p + z * z / (2 * n)) / d;
  const radius = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d;
  return [center - radius, center + radius];
}
export function summary(values) { return { n: values.length, median: quantile(values, .5), p10: quantile(values, .1), p90: quantile(values, .9), min: Math.min(...values), max: Math.max(...values), mean: mean(values) }; }
