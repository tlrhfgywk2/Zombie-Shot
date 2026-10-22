/* global console, process, URL */
import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { fingerprint } from './provenance.mjs';
import { AMMO } from './model.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = async file => {
  try { return JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8')); }
  catch (e) { if (e.code !== 'ENOENT') throw e; return JSON.parse(gunzipSync(await readFile(new URL(file + '.gz', import.meta.url)))); }
};
const explore = await read('./results/v7-exploratory-all.json'), holdout = await read('./results/v7-holdout-all.json');
const registry = await read('./results/holdout-registry.json'), protocol = await read('./protocol.json');
const niches = await read('./results/niche-validation.json'), growth = await read('./results/survival-growth.json');
const confirmation = await read('./results/niche-confirmation.json');
const current = await fingerprint(explore.candidate, protocol);
const registered = registry.find(row => row.version === 'v7' && (row.hash === current || row.portableHash === current));
const documents = {};
for (const name of ['ammo_redesign.md', 'design_rationale.md', 'build_archetypes.md', 'balance_report.md', 'iteration_log.md']) documents[name] = (await readFile(new URL(`../${name}`, import.meta.url), 'utf8')).length > 100;
const spec = await readFile(new URL('../ammo_redesign.md', import.meta.url), 'utf8');
const rulesDocumented = Object.keys(AMMO).every(id => spec.includes('`' + id + '`'));
const tests = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'simulation/model.check.mjs'], { cwd: root, encoding: 'utf8' });
await writeFile(new URL('./results/model-check.txt', import.meta.url), tests.stdout + (tests.stderr ?? ''));
const passedTests = Number(tests.stdout.match(/# pass (\d+)/)?.[1] ?? 0);
const productionDiff = spawnSync('git', ['diff', '--name-only', '4850a01', '--', 'src', 'public', 'index.html', 'package.json', 'package-lock.json', '.github'], { cwd: root, encoding: 'utf8' });
const result = {
  candidate: 'v7', portableFingerprint: current, legacyFingerprint: explore.hash,
  provenanceMatches: Boolean(registered) && [registered.hash, registered.portableHash].includes(explore.hash) && [registered.hash, registered.portableHash].includes(holdout.hash),
  candidateMatches: JSON.stringify(explore.candidate) === JSON.stringify(holdout.candidate),
  sampleSizes: { exploratory: explore.count, holdout: holdout.count },
  independentHoldout: explore.firstSeed + explore.count <= holdout.firstSeed,
  sourceProductionUnchanged: productionDiff.status === 0 && productionDiff.stdout.trim() === '',
  tests: { status: tests.status, passed: passedTests }, documents, rulesDocumented,
  gates: { exploratory: { ...explore.gates }, holdout: { ...holdout.gates } },
  additionalChecks: { survivalAccountedGrowth: Object.values(growth).every(row => row.pass), fourDistinctScenarioAdvantagesConfirmed: Object.values(niches).length >= 4 && Object.values(niches).every(row => row.confirmed), expandedNicheConfirmation: confirmation.count >= 1000 && Object.values(confirmation.cases).every(row => row.pointAdvantage && Object.values(row.comparisons).every(pair => pair.ci95[0] > 0)) },
  humanGameplayReview: 'required; automated validation does not establish fun',
};
const g = { pass: tests.status === 0 && passedTests >= 20 && Object.values(documents).every(Boolean) && rulesDocumented, description: '20 independent checks and all 20 documented ammo effects; human comprehensibility remains for review.' };
result.gates.exploratory.G = g; result.gates.holdout.G = g;
result.pass = result.provenanceMatches && result.candidateMatches && result.independentHoldout && result.sampleSizes.exploratory >= 200 && result.sampleSizes.holdout >= 100 && result.sourceProductionUnchanged && Object.values(result.additionalChecks).every(Boolean) && Object.values(result.gates).every(split => Object.values(split).every(gate => gate.pass));
await writeFile(new URL('./results/final-validation.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (!result.pass) process.exitCode = 1;
