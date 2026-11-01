import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const bundled = await build({ entryPoints: [fileURLToPath(new URL('src/simulation/EncounterBalance.ts', root))], bundle: true, write: false, platform: 'node', format: 'esm' });
const { simulateEncounterBalance, compareEncounterOpening, summarizeEncounter, baselineEncounterDistances, ENCOUNTER_BALANCE_BAGS } = await import('data:text/javascript;base64,' + Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const weapons = ['p220', 'm1911', 'desertEagle', 'm500'];
const policies = ['focus-first', 'focus-second', 'nearest', 'actor', 'alternate'];
const scenarios = [
  { id: '일반 둘', roster: ['normal', 'normal'] },
  { id: '질주와 거체', roster: ['fast', 'tough'] },
  { id: '위험', roster: ['contaminator', 'screecher'], reinforcements: ['normal'] },
  ...['fast', 'tough', 'contaminator', 'groundshaker', 'screecher'].flatMap(type => [0, 2].map(distancePenalty => ({
    id: `탐험 ${type} 거리감소 ${distancePenalty}`, roster: type === 'fast' ? ['fast', 'brute'] : type === 'tough' ? ['normal', 'tough'] : [type, 'normal'],
    reinforcements: ['contaminator', 'groundshaker', 'screecher'].includes(type) ? ['normal'] : [], distancePenalty,
  }))),
].map(scenario => process.argv.includes('--baseline') ? { ...scenario, distances: baselineEncounterDistances(scenario.roster) } : scenario);
const variants = process.argv.includes('--candidates') ? [
  ...scenarios,
  ...[3, 3.5, 4].map(distance => ({ id: `후보 질주 ${distance}`, roster: ['fast', 'tough'], distances: [distance, 10] })),
  ...[3, 3.5, 4].map(distance => ({ id: `후보 위험 ${distance}`, roster: ['contaminator', 'screecher'], reinforcements: ['normal'], distances: [distance, 7] })),
  { id: '후보 위험 후열압박', roster: ['contaminator', 'screecher'], reinforcements: ['normal'], distances: [6, 3.5] },
  ...['contaminator', 'groundshaker', 'screecher'].flatMap(type => [0, 2].map(distancePenalty => ({ id: `후보 동행 ${type} 감소 ${distancePenalty}`, roster: [type, 'normal'], reinforcements: ['normal'], distances: [type === 'groundshaker' ? 4 : type === 'contaminator' ? 6 : 7, 4], distancePenalty }))),
] : scenarios;
const policiesReport = variants.flatMap(scenario => weapons.flatMap(weapon => policies.map(policy => ({
  scenario: scenario.id, weapon, policy, ...summarizeEncounter(simulateEncounterBalance({ scenario, weapon, policy })),
}))));
const full = process.argv.includes('--full');
const openings = full ? scenarios.filter(scenario => ['일반 둘', '질주와 거체', '위험', '탐험 groundshaker 거리감소 2'].includes(scenario.id))
  .flatMap(scenario => weapons.flatMap(weapon => Object.entries(ENCOUNTER_BALANCE_BAGS).map(([name, bag]) => ({ name, ...compareEncounterOpening(scenario, weapon, bag) })))) : [];
const attachmentSets = [[], ['texturedGrip'], ['highCapacityMagazine'], ['reflexSight'], ['pistolScope'], ['compensator', 'texturedGrip', 'highCapacityMagazine', 'laserLightModule']];
const equipment = scenarios.flatMap(scenario => weapons.flatMap(weapon => attachmentSets.map(attachments => ({ scenario: scenario.id, weapon, attachments,
  ...summarizeEncounter(simulateEncounterBalance({ scenario, weapon, attachments, policy: 'nearest' })),
}))));
const timing = scenarios.filter(scenario => ['질주와 거체', '위험', '탐험 groundshaker 거리감소 2'].includes(scenario.id))
  .flatMap(scenario => weapons.flatMap(weapon => Object.entries(ENCOUNTER_BALANCE_BAGS).flatMap(([bagName, rounds]) => [0, 1, 2].map(delay => ({ scenario: scenario.id, weapon, bagName, delay,
    ...summarizeEncounter(simulateEncounterBalance({ scenario, weapon, magazines: [...Array.from({ length: delay }, () => ['ball', 'ball', 'ball', 'ball']), rounds], policy: 'nearest' })),
  })))));
const source = Object.fromEntries(await Promise.all([
  'src/combat/Encounter.ts', 'src/combat/CombatResolver.ts', 'src/combat/AmmoRules.ts', 'src/combat/AttachmentLoadout.ts',
  'src/combat/WeaponTraits.ts', 'src/combat/RecoilPenalty.ts', 'src/entities/Player.ts', 'src/entities/Zombie.ts',
  'src/data/encounterDefinitions.ts', 'src/data/enemyDefinitions.ts', 'src/data/enemyActionDefinitions.ts', 'src/data/trainingEnemy.ts',
  'src/data/ammoDefinitions.ts', 'src/data/weaponDefinitions.ts', 'src/data/attachmentDefinitions.ts',
  'src/core/Game.ts', 'src/simulation/EncounterBalance.ts', 'tools/analyze-encounters.mjs',
].map(async file => [file, createHash('sha256').update((await readFile(new URL(file, root), 'utf8')).replace(/\r\n/g, '\n')).digest('hex')])));
const result = { revision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: fileURLToPath(root), encoding: 'utf8' }).trim(),
  dirty: Boolean(execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: fileURLToPath(root), encoding: 'utf8' }).trim()),
  baselineDistances: process.argv.includes('--baseline'), sourceHashFormat: 'sha256-utf8-lf', source, scenarios: variants, policies: policiesReport, openings, equipment, timing };
const reportName = process.argv.includes('--candidates') ? 'candidates' : process.argv.includes('--baseline') ? 'baseline' : 'adjusted';
const destination = new URL(process.env.ENCOUNTER_REPORT || `../docs/validation/encounter-balance/${reportName}.json`, import.meta.url);
await mkdir(new URL('./', destination), { recursive: true }); await writeFile(destination, JSON.stringify(result, null, 2) + '\n');
console.table(policiesReport.filter(row => row.policy === 'focus-first' || row.policy === 'focus-second').map(({ scenario, weapon, policy, won, turns, enemyActions, intents }) => ({ scenario, weapon, policy, won, turns, enemyActions, intents })));
console.log(`정책 ${policiesReport.length}건, 첫 탄창 비교 ${openings.length}건, 장착물 ${equipment.length}건, 사용 시점 ${timing.length}건 저장: ${fileURLToPath(destination)}`);
