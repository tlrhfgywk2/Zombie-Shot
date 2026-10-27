/* global window, document, innerWidth */
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { production, root } from './runtime.mjs';
import { createModel, UPGRADE_PRIORITY } from '../../experiments/level-v7/model-portable.mjs';
import { chooseRounds, rewardChoice } from '../../experiments/level-v7/engine.mjs';
import { rng } from '../../experiments/level-v7/random.mjs';
import { PACKS } from '../../experiments/level-v7/design.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const p = await production(), config = JSON.parse(await readFile(new URL('experiments/level-v7/v7-config.json', root)));
const model = createModel(p, config), output = new URL('experiments/level-v7/results/browser/', root); await mkdir(output, { recursive: true });
const base = process.env.VALIDATION_BASE ?? 'http://127.0.0.1:5173/Zombie-Shot/';
const raw = JSON.parse(gunzipSync(await readFile(new URL('experiments/level-v7/results/candidate-6-exploratory-raw.json.gz', root))));
const commonSeed = [...new Set(raw.map(r => r.seed))].find(seed => raw.filter(r => r.variant === 'nine-linked' && r.seed === seed && r.strategy === 'competent' && r.phase === 'victory').length === 6);
assert.ok(commonSeed, '여섯 빌드의 같은 자연 획득 시드');
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', headless: true });
const findings = [], errors = [];
async function audit(page, label, name) {
  const state = await page.evaluate(() => ({
    width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth + 1,
    bad: [...document.querySelectorAll('button:not(:disabled),.slot strong,#enemy,#status')].filter(e => {
      const r = e.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1 || e.scrollWidth > e.clientWidth + 1);
    }).map(e => e.textContent),
  }));
  assert.equal(state.overflow, false, `${label}/${name} 화면 가로 넘침`);
  assert.deepEqual(state.bad, [], `${label}/${name} 컨테이너 넘침`);
  await page.screenshot({ path: fileURLToPath(new URL(`${label}-${name}.png`, output)), fullPage: true });
  findings.push({ label, name, ...state });
}
async function loadAndFire(page, rounds) {
  for (const id of rounds) await page.locator(`[data-ammo="${id}"]`).click();
  await page.locator('#fire').click();
  await page.waitForFunction(() => !window.levelValidation.snapshot().busy, null, { timeout: 30000 });
}
try {
  for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['portrait', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await context.newPage(); page.on('pageerror', e => errors.push({ label, message: e.message }));
    const traces = [];
    for (const archetype of Object.keys(PACKS)) {
      await page.goto(`${base}experiments/level-v7/?seed=${commonSeed}&build=${archetype}&validation=1`);
      await page.locator('[data-action="advance"]').waitFor();
      let steps = 0;
      while (steps++ < 160) {
        const s = await page.evaluate(() => window.levelValidation.snapshot());
        if (['victory', 'defeat', 'timeout'].includes(s.phase)) { assert.equal(s.phase, 'victory', `${label}/${archetype} 자연 진행`); await audit(page, label, `${archetype}-victory`); break; }
        if (['ready', 'advance'].includes(s.phase)) { await page.locator('[data-action="advance"]').click(); continue; }
        if (s.phase === 'combat') {
          if (s.depth === 1 && archetype === 'wound' && s.observation.enemy.turnsElapsed === 0) await audit(page, label, 'early-empty');
          const rounds = chooseRounds(s.observation, 'competent', model, p, rng(commonSeed ^ s.depth ^ s.wave));
          const expected = model.resolve(rounds, s.observation.enemy, s.observation, { player: s.observation.player, trace: true });
          for (const id of rounds) await page.locator(`[data-ammo="${id}"]`).click();
          if (s.depth === 1 && archetype === 'wound' && s.observation.enemy.turnsElapsed === 0) await audit(page, label, 'early-full');
          if (s.depth === 8 && s.wave === 1 && s.observation.enemy.turnsElapsed === 0) await audit(page, label, `${archetype}-late-combination`);
          if (s.depth === 8 && s.wave === 2 && s.observation.enemy.turnsElapsed === 0) await audit(page, label, `${archetype}-final-resource`);
          await page.locator('#fire').click();
          await page.waitForFunction(() => !window.levelValidation.snapshot().busy, null, { timeout: 30000 });
          const after = await page.evaluate(() => window.levelValidation.snapshot());
          assert.deepEqual(after.lastTrace.shot, expected, `${label}/${archetype}/${s.depth} 브라우저-Node 샷 동치`);
          traces.push({ archetype, depth: s.depth, wave: s.wave, rounds, trace: after.lastTrace });
        } else if (s.phase === 'discovery') {
          if (archetype === 'wound') await audit(page, label, 'build-discovery');
          await page.locator(`[data-build="${archetype}"]`).click();
        } else if (s.phase === 'reward') {
          const id = rewardChoice(s.node.offers, s.run, 'competent', rng(commonSeed));
          await page.locator(`[data-reward="${id}"]`).click();
        } else if (s.phase === 'workshop') {
          const priority = archetype === 'recoil' ? ['plusP', 'kickback', 'relay'] : UPGRADE_PRIORITY[archetype];
          const id = priority.find(id => s.run.stock[id] > 0 && (s.run.ranks[id] ?? 0) < 3);
          if (id) await page.locator(`[data-upgrade="${id}"]`).click();
          if (s.depth === 7) {
            const reinforce = priority.find(id => s.run.stock[id] > 0);
            await page.locator(`[data-reinforce="${reinforce}"]`).click();
          }
          const payment = Object.keys(s.run.stock).find(id => s.run.stock[id] > 0 && !PACKS[archetype].includes(id));
          if (payment) {
            const order = [...s.node.attachments].sort((a, b) => {
              const score = key => key.includes('Magazine') ? 5 : key === 'texturedGrip' && archetype === 'recoil' ? -1 : key === 'reflexSight' ? 3 : 1;
              return score(b) - score(a);
            });
            await page.locator('#payment').selectOption(payment); await page.locator(`[data-attachment="${order[0]}"]`).click();
          }
          if (archetype === 'wound') await audit(page, label, `workshop-${s.depth}`);
          await page.locator('[data-action="leave"]').click();
        } else throw new Error(`처리되지 않은 상태 ${s.phase}`);
      }
      assert.ok(steps < 160);
    }
    // 아래는 조우 경계 fixture다. 자연 획득 런 성공률과 합산하지 않는다.
    const setup = async (archetype, stock, ranks, enemy, loadout = {}) => {
      await page.evaluate(({ archetype, stock, ranks, enemy, loadout }) => window.levelValidation.fixture({
        phase: 'combat', depth: 8, wave: 0, turn: 1, available: stock, enemy,
        player: { heavyKickPenaltyBonus: 0, heavyKickPenaltyTurns: 0, rangePenaltySteps: 0, rangePenaltyTurns: 0, disabledSlots: {} },
        run: { archetype, weapon: 'p220', stock, ranks, loadout, owned: Object.values(loadout), victories: 0 },
        node: { kind: 'combat', title: '전투 경계 검증', waves: [{ enemy: enemy.type, distance: enemy.distance, role: 'boss' }], offers: ['ball'] },
      }), { archetype, stock, ranks, enemy, loadout });
    };
    const enemy = { ...p.createEnemyState('groundshaker'), distance: .5 };
    for (const [scenario, sequence, expected] of [
      ['good-order', ['accelerant', 'incendiary', 'ignition', 'ball'], 'reward'],
      ['poor-order', ['ignition', 'incendiary', 'accelerant', 'ball'], 'defeat'],
    ]) {
      await setup('heat', { incendiary: 1, accelerant: 1, ignition: 1 }, { incendiary: 1 }, enemy);
      await loadAndFire(page, sequence);
      const after = await page.evaluate(() => window.levelValidation.snapshot()); assert.equal(after.phase, expected);
      await audit(page, label, scenario); traces.push({ scenario, trace: after.lastTrace });
    }
    await setup('heat', {}, {}, enemy); await loadAndFire(page, ['ball', 'ball', 'ball', 'ball']);
    assert.equal(await page.locator('[data-action="restart"]').innerText(), '다시 시작'); await audit(page, label, 'scarcity-defeat');
    await setup('recoil', { retreat: 1, flatNose: 2 }, {}, { ...p.createEnemyState('normal'), distance: .5 });
    await loadAndFire(page, ['retreat', 'flatNose', 'flatNose', 'ball']);
    let after = await page.evaluate(() => window.levelValidation.snapshot());
    assert.equal(after.phase, 'combat'); assert.ok(after.lastTrace.action.interrupted || after.lastTrace.action.resolution === 'retreat-delayed');
    await audit(page, label, 'position-shock-survival'); traces.push({ scenario: 'position-shock-survival', trace: after.lastTrace });
    await loadAndFire(page, ['ball', 'ball']);
    await setup('concussion', { resonance: 6 }, { resonance: 2 }, { ...enemy, hp: 1 }, { magazine: 'highCapacityMagazine' });
    for (let i = 0; i < 6; i++) await page.locator('[data-ammo="resonance"]').click();
    await audit(page, label, 'six-long-name-unused');
    assert.equal(await page.locator('.slot.unused').count(), 5);
    await page.locator('#fire').click(); await page.waitForFunction(() => !window.levelValidation.snapshot().busy);
    after = await page.evaluate(() => window.levelValidation.snapshot());
    assert.equal(after.lastTrace.shot.fired, 1); assert.equal(after.lastTrace.unused.length, 5);
    await writeFile(new URL(`${label}-traces.json`, output), JSON.stringify(traces));
    await context.close();
    console.log(`${label}: 자연 진행6빌드 + 순서/희소성/위치/미발사 경계 완료`);
  }
  assert.deepEqual(errors, []);
  await writeFile(new URL('results.json', output), JSON.stringify({ commonSeed, findings, errors, browser: await browser.version(), naturalRuns: 12, fixtureScenarios: 10 }, null, 2));
} finally { await browser.close(); }
