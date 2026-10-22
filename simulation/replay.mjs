/* global console, process, URL */
import { readFile } from 'node:fs/promises';
import { production, rng } from './common.mjs';
import { acquired, createModel, combat } from './model.mjs';
const [seed = '11001', stage = '9', archetype = 'wound', enemyId = 'groundshaker', distance = '3'] = process.argv.slice(2);
const config = JSON.parse(await readFile(new URL('./candidates.json', import.meta.url))).v6;
const p = await production(), model = createModel(p, config), run = acquired(+seed, +stage, archetype, config, p);
const enemy = { ...p.createEnemyState(enemyId), distance: +distance };
const utility = combat(run.stock, run, enemy, model, p, 'search', rng(+seed ^ 9999), { trace: true });
const theoretical = combat(run.stock, run, enemy, model, p, 'search', rng(+seed ^ 9999), { damageOnly: true, trace: true });
console.log(JSON.stringify({ seed, stage, archetype, enemy, run, utility, theoretical }, null, 2));
