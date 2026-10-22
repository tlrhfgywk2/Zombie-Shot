/* global console, URL */
import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';
const directory = fileURLToPath(new URL('./results/', import.meta.url));
const names = await readdir(directory);
async function load(name) { return JSON.parse(await readFile(resolve(directory, name), 'utf8')); }
async function archive(name, data) { await writeFile(resolve(directory, name + '.json.gz'), gzipSync(JSON.stringify(data), { level: 9 })); }
async function remove(name) {
  const path = resolve(directory, name);
  if (!path.startsWith(resolve(directory) + sep)) throw new Error('Refusing to remove a file outside simulation/results');
  await unlink(path);
}
for (const version of ['v1', 'v2', 'v3', 'v4', 'v5', 'v6']) {
  const files = names.filter(name => name.startsWith(version + '-') && name.endsWith('.json'));
  if (!files.length) continue;
  const complete = files.find(name => name.endsWith('-all.json'));
  const source = complete ? { complete: true, results: {} } : { complete: false, sections: {} };
  if (complete) for (const file of files.filter(name => name.endsWith('-all.json'))) source.results[file] = await load(file);
  if (!complete) for (const suffix of ['potential', 'combat', 'acquisition', 'acquisition-progress']) {
    const file = files.find(name => name.endsWith('-' + suffix + '.json'));
    if (file) source.sections[suffix] = await load(file);
  }
  if (version === 'v3') source.note = 'Interrupted by Windows file write UNKNOWN error; not a passing complete evaluation.';
  if (version === 'v6') source.note = 'Superseded after pre-volley enemy-action commitment model parity fix; final validation uses v7 and fresh holdout seeds.';
  await archive('historical-' + version, source);
  for (const file of files) await remove(file);
  if (version === 'v6') for (const file of names.filter(name => name.startsWith('v6-') && name.endsWith('.gz'))) await remove(file);
}
for (const split of ['exploratory', 'holdout']) {
  for (const kind of ['potential-raw', 'combat-pairs']) {
    const name = `v7-${split}-${kind}.json`;
    if (names.includes(name)) { await archive(name.slice(0, -5), await load(name)); await remove(name); }
  }
  for (const kind of ['potential', 'combat', 'acquisition']) {
    const name = `v7-${split}-${kind}.json`;
    if (names.includes(name)) await remove(name);
  }
  const complete = `v7-${split}-all.json`;
  if (names.includes(complete)) { await archive(complete.slice(0, -5), await load(complete)); await remove(complete); }
}
console.log('Archived historical candidates and raw rows; retained final full results and traces.');
