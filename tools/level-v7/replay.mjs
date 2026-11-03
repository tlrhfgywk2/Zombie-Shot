import { readFile, writeFile } from 'node:fs/promises';
import { production, root } from './runtime.mjs';
import { createModel } from '../../experiments/level-v7/model-portable.mjs';
import { LevelSession, observe, chooseRounds, autoNoncombat } from '../../experiments/level-v7/engine.mjs';
const [seed = '21002', build = 'wound', strategy = 'competent', filename] = process.argv.slice(2);
const p = await production(), config = JSON.parse(await readFile(new URL('experiments/level-v7/v7-config.json', root)));
const settings = JSON.parse(await readFile(new URL('experiments/level-v7/candidate-6.json', root)));
const session = new LevelSession(p, createModel(p, config), config, Number(seed), build, 'nine-linked', settings);
let steps = 0;
while (!['victory', 'defeat', 'timeout'].includes(session.phase) && steps++ < 300) {
  if (session.phase === 'combat') session.fire(chooseRounds(observe(session), strategy, session.model, p, session.random));
  else autoNoncombat(session, strategy);
}
const result = { seed, build, strategy, phase: session.phase, run: session.run, rewards: session.rewards, trace: session.logs };
if (filename) await writeFile(filename, JSON.stringify(result, null, 2));
else console.log(JSON.stringify(result, null, 2));
