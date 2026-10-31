import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { production, root } from './runtime.mjs';
import { fingerprint } from './provenance.mjs';
const output = new URL('tools/hp-balance/results/checks/', root); await mkdir(output, { recursive: true });
const commands = {
  tests: ['node_modules/vitest/vitest.mjs', 'run'], lint: ['node_modules/eslint/bin/eslint.js', '.'],
  typecheck: ['node_modules/typescript/bin/tsc', '-b'], build: ['node_modules/vite/bin/vite.js', 'build'],
  ammo: ['tools/check-ammo-spec.mjs'], v7: ['--test', 'simulation/model.check.mjs'], contracts: ['--test', 'tools/hp-balance/contracts.check.mjs'],
};
const results = {};
for (const [label, args] of Object.entries(commands)) {
  const result = spawnSync(process.execPath, args, { cwd: fileURLToPath(root), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  results[label] = { status: result.status, command: [process.execPath, ...args] };
  await writeFile(new URL(`${label}.txt`, output), result.stdout + '\n' + result.stderr);
  console.log(`${label}: ${result.status === 0 ? 'PASS' : 'FAIL'}`); if (result.status !== 0) process.exitCode = 1;
}
const p = await production();
const windows = [];
for (const type of Object.keys(p.ENEMY_DEFINITIONS)) {
  const resolver = new p.CombatResolver(() => .5); let enemy = { ...p.createEnemyState(type), hp: 1e9, maxHp: 1e9 }, player = p.createPlayerCombatState(), damage = 0;
  const turns = [];
  for (let turn = 1; turn <= 12; turn++) {
    const shot = resolver.resolveSequence(['ball', 'ball', 'ball', 'ball'], enemy, { playerState: player }); damage += shot.totalHpDamage;
    const action = resolver.resolveEnemyAction(shot.finalState, player); enemy = action.after; player = action.playerAfter;
    turns.push({ turn, damage: shot.totalHpDamage, action: action.executedAction, distance: enemy.distance });
    if (action.playerKilled) break;
  }
  windows.push({ type, distance: p.ENEMY_DEFINITIONS[type].distance, lethalTurn: turns.length, standardDamageBeforeAttack: damage, turns });
}
await writeFile(new URL('tools/hp-balance/results/instant-death-windows.json', root), JSON.stringify(windows, null, 2));
const candidate = JSON.parse(await readFile(new URL('tools/hp-balance/candidates/hp5.json', root)));
const actual = await fingerprint(candidate), frozen = JSON.parse(await readFile(new URL('tools/hp-balance/results/hp5-holdout.json', root)));
results.frozenEvaluation = { status: actual.hash === frozen.hash ? 0 : 1, hash: actual.hash };
if (results.frozenEvaluation.status !== 0) process.exitCode = 1;
const unchanged = spawnSync('git', ['diff', 'origin/develop', '--name-only', '--', 'src/data/ammoDefinitions.ts', 'src/data/weaponDefinitions.ts', 'src/data/attachmentDefinitions.ts', 'src/progression', 'src/combat', 'src/presentation', 'src/exploration/ExplorationRun.ts', 'src/entities/Player.ts', '.github'], { cwd: fileURLToPath(root), encoding: 'utf8' });
results.hpOnlyRules = { status: unchanged.status === 0 && unchanged.stdout.trim() === '' ? 0 : 1, changed: unchanged.stdout.trim() };
if (results.hpOnlyRules.status !== 0) process.exitCode = 1;
await writeFile(new URL('results.json', output), JSON.stringify({ node: process.version, results }, null, 2));
