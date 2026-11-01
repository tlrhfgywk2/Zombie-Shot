import { build } from 'esbuild';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { rng, mean, wilson } from '../simulation/common.mjs';
import { AMMO, initialRun, rewardTape, reward, oriented } from '../simulation/model.mjs';

const bundle = await build({ stdin: { contents: `export * from './src/progression/AttachmentRewards'; export * from './src/data/attachmentDefinitions'; export * from './src/progression/AmmoRewards'; export * from './src/progression/AmmoSynergy'; export * from './src/exploration/ExplorationRun'; export * from './src/data/ammoDefinitions'; export * from './src/data/weaponDefinitions'; export { Player } from './src/entities/Player'; export * from './src/combat/CombatResolver'; export * from './src/data/enemyDefinitions';`, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, write: false, platform: 'node', format: 'esm' });
const p = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const pool = p.EXPLORATION_REWARD_POOL;
const modes = { original: { chance: 0, strength: 0 }, weak40: { chance: .4, strength: 3 }, weak: p.AMMO_SYNERGY_GUIDANCE, weak60: { chance: .6, strength: 3 }, strong: { chance: 1, strength: 12 } };
const count = Number(process.argv[3] ?? 2000), phase = process.argv[2] ?? 'exploratory';
if (!['exploratory', 'holdout'].includes(phase) || !Number.isInteger(count) || count < 1) throw new Error('실행 구간과 양의 정수 실행 수가 필요합니다.');
const firstSeed = phase === 'holdout' ? 2700001 : 1700001;
const activeModes = phase === 'holdout' ? ['original', 'weak', 'strong'] : Object.keys(modes);
const ready = inventory => {
  // 가중치 함수와 독립인 현행 11종의 조합 판정. 표준탄 후속 한 발 포함 최대 4칸.
  const paths = [];
  if ((inventory.wounding ?? 0) >= 2) paths.push('wound');
  if ((inventory.plusP ?? 0) > 0 && (inventory.lowRecoil ?? 0) > 0) paths.push('recoil');
  if ((inventory.relay ?? 0) > 0 && (inventory.plusP > 0 || inventory.advance > 0)) paths.push('follow-up');
  return paths;
};
const confidence = (yes, n) => ({ rate: yes / n, ci95: wilson(yes, n) });
function summarize(runs, offers) {
  const frequencies = {};
  for (const run of runs) for (const path of run.paths) frequencies[path] = (frequencies[path] ?? 0) + 1 / run.paths.length;
  const total = Object.values(frequencies).reduce((a, b) => a + b, 0);
  const shares = Object.fromEntries(Object.entries(frequencies).map(([id, value]) => [id, value / total]));
  return {
    runs: runs.length, coherent: confidence(runs.filter(run => run.paths.length).length, runs.length),
    statusBuild: confidence(runs.filter(run => run.paths.includes('wound')).length, runs.length),
    firstSynergyOpportunityAmongAcquired: mean(runs.filter(run => run.first !== null).map(run => run.first)),
    meanRewardOpportunities: mean(runs.map(run => run.opportunities)),
    orphanedWoundOrPayoff: confidence(runs.filter(run => !run.paths.includes('wound') && (run.inventory.wounding > 0 || run.inventory.laceration > 0)).length, runs.length),
    directOnly: confidence(runs.filter(run => !run.paths.includes('wound')).length, runs.length),
    alternativeDiscovery: confidence(runs.filter(run => run.paths.length >= 2).length, runs.length),
    earlyWoundAbandoned: confidence(runs.filter(run => run.earlyWound && !run.paths.includes('wound')).length, runs.filter(run => run.earlyWound).length || 1),
    earlyWoundPivot: confidence(runs.filter(run => run.earlyWound && !run.paths.includes('wound') && run.paths.length).length, runs.filter(run => run.earlyWound).length || 1),
    completedDirectionSwitched: confidence(runs.filter(run => run.firstPaths.length && run.paths.length && !run.firstPaths.some(path => run.paths.includes(path))).length, runs.length),
    completedDirectionLost: confidence(runs.filter(run => run.firstPaths.length && !run.paths.length).length, runs.length),
    shares, effectiveDirections: Math.exp(-Object.values(shares).reduce((sum, share) => sum + share * Math.log(share), 0)),
    offers, meanSpecialCount: mean(runs.map(run => Object.values(run.inventory).reduce((a, b) => a + b, 0))),
  };
}
function exploration(mode, policy, shopPolicy) {
  const runs = [], offers = {};
  for (let i = 0; i < count; i++) {
    const seed = firstSeed + i, random = rng(seed ^ 0x12345);
    const player = new p.Player(), weapon = p.WEAPON_ORDER[i % 4]; player.startRun('exploration', weapon);
    const run = new p.ExplorationRun(`reward-study-${seed}`);
    let firstPaths = ready(player.getBuild());
    let opportunities = 0, first = firstPaths.length ? 0 : null, earlyWound = false;
    for (let depth = 0; depth < p.RUN_LENGTH; depth++) {
      const encounter = run.enter(Math.floor(random() * run.routes.length));
      if (encounter.kind === 'combat') {
        // 전투 생존 조건부 획득 실험. 실제 전투 규칙이나 소모를 바꾸지 않는다.
        run.settleCombat(); opportunities++;
        const inventory = player.getBuild();
        const choices = mode === 'original' ? encounter.rewards : run.combatRewards({ inventory, magazineCapacity: player.magazine.capacity }, modes[mode]);
        for (const id of choices) offers[id] = (offers[id] ?? 0) + 1;
        const value = id => {
          const next = { ...inventory, [id]: inventory[id] + 1 };
          return ready(next).length * 10 + (next.wounding > 0 && next.wounding < 2 ? 2 : 0) - next[id] * .15;
        };
        const chosen = policy === 'random' ? choices[Math.floor(random() * choices.length)] : [...choices].sort((a, b) => value(b) - value(a))[0];
        player.exchangeAmmo([], [chosen]);
        if (opportunities === 1) earlyWound = player.getBuild().wounding > 0;
        if (first === null && ready(player.getBuild()).length) first = opportunities;
      } else if (encounter.kind === 'merchant' && shopPolicy === 'buy') {
        // 실제 1발 영구 지불, 3발 수령, 14발 한도. 같은 품목은 한 번만 구매.
        const offer = p.merchantOffers(encounter).find(offer => offer.id === 'ammo');
        const inventory = player.getBuild();
        const payment = pool.filter(id => inventory[id] > 0).sort((a, b) => p.AMMO_DEFINITIONS[a].firepower - p.AMMO_DEFINITIONS[b].firepower)[0];
        if (payment) player.exchangeAmmo([payment], Array(offer.amount).fill(offer.ammo));
      } else if (encounter.kind === 'event' && shopPolicy === 'buy') {
        if (encounter.event === 'cache') player.exchangeAmmo([], ['flatNose', 'flatNose']);
        if (encounter.event === 'shrine') {
          const payment = pool.find(id => player.getBuild()[id] > 0);
          if (payment) player.exchangeAmmo([payment], ['hollowPoint', 'hollowPoint']);
        }
      }
      if (!firstPaths.length) firstPaths = ready(player.getBuild());
      run.leave();
    }
    const inventory = player.getBuild(); runs.push({ weapon, inventory, paths: ready(inventory), first, firstPaths, opportunities, earlyWound });
  }
  return { ...summarize(runs, offers), byWeapon: Object.fromEntries(p.WEAPON_ORDER.map(weapon => [weapon, summarize(runs.filter(run => run.weapon === weapon), {})])) };
}

function isolated(mode) {
  const result = {};
  for (const [name, inventory, candidates] of [
    ['wound', { wounding: 1 }, pool], ['heat', { incendiary: 1 }, undefined],
    ['blast', { explosive: 1 }, undefined], ['recoil', { plusP: 1 }, undefined],
  ]) {
    const times = [], offers = {};
    for (let i = 0; i < count; i++) {
      let first = null;
      for (let opportunity = 1; opportunity <= 5; opportunity++) {
        const choices = p.generateAmmoRewards(rng(firstSeed + i + opportunity * 10000000), {
          context: { inventory, magazineCapacity: 4 }, pool: candidates, choices: candidates ? 2 : 3,
          rarityFirst: !candidates, guidance: modes[mode],
        });
        const scores = p.ammoSynergyScores({ inventory, magazineCapacity: 4 }, choices);
        if (first === null && choices.some(id => scores.get(id) > 0)) first = opportunity;
        if (opportunity === 1) for (const id of choices) offers[id] = (offers[id] ?? 0) + 1;
      }
      times.push(first);
    }
    result[name] = { firstOpportunity: confidence(times.filter(time => time === 1).length, count), byFive: confidence(times.filter(time => time !== null).length, count), conditionalMean: mean(times.filter(time => time !== null)), offers };
  }
  return result;
}

// v7는 별도 실험이다. 기존 18전투·제작·최초 연결 초안과 고유 탄약 정의를 그대로 사용한다.
function longerV7(mode, linkedDraft = true) {
  const config = { ...JSON.parse(readFileSync(new URL('../simulation/candidates.json', import.meta.url))).v7, linkedDraft };
  let coherent = 0, middle = 0;
  for (let i = 0; i < count; i++) {
    const seed = firstSeed + i, run = initialRun('wound'), tape = rewardTape(seed, p, config);
    const random = rng(seed ^ 0x7777);
    for (let stage = 0; stage < 18; stage++) {
      const entry = { ...tape[stage], offers: [...tape[stage].offers] };
      if ((!linkedDraft || stage >= 2) && mode !== 'original' && random() < modes[mode].chance) {
        const slot = Math.floor(random() * 3), rarity = AMMO[entry.offers[slot]][5];
        const candidates = Object.keys(AMMO).filter(id => id !== 'ball' && AMMO[id][5] === rarity && !entry.offers.some((other, index) => index !== slot && other === id));
        const weights = candidates.map(id => 1 + (!oriented(Object.entries(run.stock).flatMap(([id, n]) => Array(n).fill(id))) && oriented([...Object.entries(run.stock).flatMap(([id, n]) => Array(n).fill(id)), id]) ? modes[mode].strength / (1 + (run.stock[id] ?? 0) * .5) : 0));
        let roll = random() * weights.reduce((a, b) => a + b, 0);
        entry.offers[slot] = candidates[weights.findIndex(weight => { roll -= weight; return roll < 0; })];
      }
      reward(run, entry, config, p, 'heuristic', random);
      if (stage === 8 && oriented(Object.entries(run.stock).flatMap(([id, n]) => Array(n).fill(id)))) middle++;
    }
    if (oriented(Object.entries(run.stock).flatMap(([id, n]) => Array(n).fill(id)))) coherent++;
  }
  return { note: `v7 획득 전용 비교: P220 상처 선호, 연결 초안 ${linkedDraft ? '유지' : '제외'}, 제작 유지. 생존율 아님. 현행 보정과 정의가 다른 별도 어댑터.`, middle: confidence(middle, count), final: confidence(coherent, count) };
}

const v7Only = process.argv.includes('--v7-only');
const explorationOnly = process.argv.includes('--exploration-only');
const result = v7Only || explorationOnly ? JSON.parse(readFileSync(`docs/validation/rewards/${phase}.json`)) : { phase, count, firstSeed, parameters: modes, exploration: {}, isolated: {}, v7: {} };
for (const mode of activeModes) {
  if (v7Only) {
    result.v7[mode].randomDraft = longerV7(mode, false);
    continue;
  }
  result.exploration[mode] = {};
  for (const policy of ['random', 'adaptive']) for (const economy of ['skip', 'buy']) result.exploration[mode][`${policy}-${economy}`] = exploration(mode, policy, economy);
  if (!explorationOnly) {
    result.isolated[mode] = isolated(mode);
    result.v7[mode] = longerV7(mode);
    result.v7[mode].randomDraft = longerV7(mode, false);
  }
  console.log(`${phase}/${mode}: ${JSON.stringify({ coherent: result.exploration[mode]['adaptive-skip'].coherent, alternative: result.exploration[mode]['adaptive-skip'].alternativeDiscovery })}`);
}
mkdirSync('docs/validation/rewards', { recursive: true });
result.provenance = {
  runtimeBundleSha256: createHash('sha256').update(bundle.outputFiles[0].text).digest('hex'),
  simulatorSha256: createHash('sha256').update(readFileSync(new URL(import.meta.url))).digest('hex'),
  note: '부분 재실행 옵션은 동일 조건의 지표 추가·재현에만 사용한다. 운영 가중치나 확인 시드는 재조정하지 않는다.',
};
writeFileSync(`docs/validation/rewards/${phase}.json`, JSON.stringify(result, null, 2) + '\n');
