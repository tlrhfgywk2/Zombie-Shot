/* global URL */
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
// Normalize checkout line endings. Ignore only evaluator bookkeeping between
// provenance initialization and the first numerical/statistical function.
// Imports, seed initialization, all numerical loops and all game rules are hashed.
export async function fingerprint(config, protocol) {
  const hasher = createHash('sha256');
  for (const file of ['./model.mjs', './evaluate.mjs', './common.mjs', '../src/combat/CombatResolver.ts', '../src/data/attachmentDefinitions.ts', '../src/data/enemyDefinitions.ts', '../src/data/weaponDefinitions.ts']) {
    let source = (await readFile(new URL(file, import.meta.url), 'utf8')).replace(/\r\n/g, '\n');
    if (file === './evaluate.mjs') source = source.slice(0, source.indexOf('const hash =')) + source.slice(source.indexOf('function bootstrap'));
    hasher.update(source);
  }
  return hasher.update(JSON.stringify(config)).update(JSON.stringify(protocol)).digest('hex');
}
