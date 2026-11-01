/* global window, document, innerWidth */
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { production, root } from './runtime.mjs';
import { choose, productionModel, PACKS } from './combat.mjs';
import { createModel, UPGRADE_PRIORITY } from '../../simulation/model.mjs';
import { rng } from '../../simulation/common.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const p = await production(), productionEngine = productionModel(p), config = JSON.parse(await readFile(new URL('simulation/candidates.json', root))).v7;
const model = createModel(p, config), base = process.env.VALIDATION_BASE ?? 'http://127.0.0.1:5173/Zombie-Shot/';
const output = new URL('tools/hp-balance/results/browser/', root); await mkdir(output, { recursive: true });
const runs = JSON.parse(gunzipSync(await readFile(new URL('tools/hp-balance/results/hp5-exploratory-campaign.json.gz', root))));
const buildIds = Object.keys(PACKS).filter(id => id !== 'basic');
const v7Seed = [...new Set(runs.map(r => r.seed))].find(seed => runs.filter(r => r.profile === 'v7' && r.seed === seed && r.strategy === 'competent' && buildIds.includes(r.archetype) && r.won).length === 6);
const productionSeed = runs.find(r => r.profile === 'exploration' && r.strategy === 'competent' && r.archetype === 'wound' && r.won && r.logs.some(l => l.type === 'tough' && l.maxHp >= 100))?.seed
  ?? runs.find(r => r.profile === 'exploration' && r.strategy === 'competent' && r.archetype === 'wound' && r.won).seed;
assert.ok(v7Seed);
const findings = [], errors = [], traces = [];
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', headless: true });
async function shot(page, name, viewport) {
  const bounds = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1,
    clippedHp: [...document.querySelectorAll('#hp-text,#enemy>b')].filter(el => {
      const r = el.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1 || el.scrollWidth > el.clientWidth + 1);
    }).map(el => el.textContent) }));
  assert.equal(bounds.overflow, false, name); assert.deepEqual(bounds.clippedHp, []);
  await page.screenshot({ path: fileURLToPath(new URL(`${name}-${viewport}.png`, output)), fullPage: true });
  findings.push({ name, viewport, ...bounds });
}
try {
  for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['portrait', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 }), page = await context.newPage();
    page.on('pageerror', error => errors.push({ label, message: error.message }));
    await page.route('**/src/main.ts', route => route.fulfill({ contentType: 'application/javascript', body: `
      import '${new URL('src/style.css', base).pathname}';
      import { Game } from '${new URL('src/core/Game.ts', base).pathname}';
      const game = window.hpGame = new Game(document.querySelector('#app'));
      game.presentation.setPlaybackSpeed(2);
      const fire = game.player.fireRound.bind(game.player);
      window.hpShots = [];
      game.player.fireRound = shot => { fire(shot); window.hpShots.push(shot); };
    ` }));
    // 현행 게임 자연 획득 성공 경로: 실제 상인 비용과 보상 선택을 그대로 입력한다.
    await page.goto(`${base}?seed=hp-${productionSeed}`);
    await page.locator('[data-choose-mode="exploration"]').click(); await page.locator('[data-choose-weapon="p220"]').click();
    await page.locator('[data-cave-action="tool:echo"]').click();
    let steps = 0;
    while (steps++ < 180) {
      await page.waitForFunction(() => !window.hpGame.busy);
      const s = await page.evaluate(() => {
        const g = window.hpGame;
        return { phase: g.state.phase, screen: g.caveScreen, depth: g.exploration.depth, active: g.exploration.active, routeCount: g.exploration.routes.length,
          observation: { archetype: 'wound', weapon: g.player.weapon.id, stock: g.player.getStock(), ranks: {}, owned: g.player.getOwnedAttachments(), loadout: g.player.loadout.getSnapshot(), player: g.player.getCombatState(), enemy: g.zombie.snapshot() } };
      });
      if (s.phase === 'VICTORY') { await shot(page, 'production-victory', label); break; }
      assert.notEqual(s.phase, 'GAME_OVER', `${label}: 현행 자연 획득 성공 시드`);
      const action = async id => page.locator(`[data-cave-action="${id}"]`).click();
      if (s.phase === 'AMMO_SELECTION') {
        const expectedHp = p.getEnemyHp(s.observation.enemy.type, s.depth, 'exploration');
        assert.equal(s.observation.enemy.maxHp, expectedHp);
        assert.equal(await page.locator('#hp-text').innerText(), `${s.observation.enemy.hp} / ${expectedHp}`);
        if (s.observation.enemy.turnsElapsed === 0) await shot(page, `production-${s.depth}-${s.observation.enemy.type}-${expectedHp}`, label);
        const rounds = choose(s.observation, 'competent', productionEngine, p, rng(productionSeed ^ steps));
        const expected = productionEngine.resolve(rounds, s.observation.enemy, s.observation, { player: s.observation.player });
        await page.evaluate(() => { window.hpShots = []; });
        for (const id of rounds) await page.locator(`[data-ammo="${id}"]`).click();
        await page.locator('#load-button').click();
        await page.waitForFunction(() => !window.hpGame.busy, null, { timeout: 30000 });
        const actual = await page.evaluate(() => window.hpShots);
        assert.deepEqual(actual, expected.result.shots); traces.push({ label, profile: 'exploration', depth: s.depth, expected, actual });
      } else if (s.screen === 'junction') await action(`route:${productionSeed % s.routeCount}`);
      else if (s.screen === 'reward') {
        const preference = ['wounding', 'laceration', 'retreat', 'hammer', 'plusP', 'relay'];
        const selected = [...s.active.rewards].sort((a, b) => (preference.indexOf(a) < 0 ? 99 : preference.indexOf(a)) - (preference.indexOf(b) < 0 ? 99 : preference.indexOf(b)))[0];
        await action(`reward:${s.active.rewards.indexOf(selected)}`);
      } else if (s.active?.kind === 'combat') await action('fight');
      else if (s.active?.kind === 'merchant') {
        const desired = ['wounding', 'laceration', 'plusP', 'retreat', 'hammer'];
        if (desired.includes(s.active.rewards[0])) {
          const build = await page.evaluate(() => window.hpGame.player.getBuild());
          const payment = build.flatNose > 0 ? 'flatNose' : build.opening > 0 ? 'opening' : Object.keys(build).find(id => build[id] > 0 && !desired.includes(id));
          if (payment) { await page.locator('[data-cave-payment]').selectOption(payment); await action('buy:ammo'); }
        }
        await action('leave');
      } else if (s.active?.kind === 'event') await action('leave');
      else throw new Error(`알 수 없는 현행 상태 ${JSON.stringify(s)}`);
    }
    assert.ok(steps < 180);
    await page.locator('#restart-button').click(); await page.locator('[data-cave-action="tool:echo"]').waitFor();
    assert.equal(await page.evaluate(() => window.hpGame.exploration.depth), 0);
    // 사망/재시작 경계: 같은 실제 스폰 HP의 적에게 빈 탄창을 넘기며 패배를 유발한다.
    await page.locator('[data-cave-action="tool:echo"]').click();
    await page.locator('[data-cave-action="route:0"]').click(); await page.locator('[data-cave-action="fight"]').click();
    for (let turn = 0; turn < 8; turn++) {
      if (await page.evaluate(() => window.hpGame.state.phase === 'GAME_OVER')) break;
      await page.locator('#load-button').click(); await page.waitForFunction(() => !window.hpGame.busy);
    }
    assert.equal(await page.evaluate(() => window.hpGame.state.phase), 'GAME_OVER'); await shot(page, 'production-defeat', label);
    await page.unroute('**/src/main.ts');
    // v7 여섯 빌드: 원래 상자/강화/부착물/추가 배분을 실제 UI로 획득한다.
    for (const archetype of buildIds) {
      await page.goto(`${base}experiments/level-v7/?seed=${v7Seed}&build=${archetype}&validation=1`);
      await page.locator('[data-action="advance"]').waitFor(); let n = 0;
      while (n++ < 180) {
        await page.waitForFunction(() => !window.levelValidation.snapshot().busy);
        const s = await page.evaluate(() => window.levelValidation.snapshot());
        if (s.phase === 'victory') { await shot(page, `v7-${archetype}-victory`, label); break; }
        assert.notEqual(s.phase, 'defeat', `${label}/${archetype} 자연 획득`);
        if (['ready', 'advance'].includes(s.phase)) await page.locator('[data-action="advance"]').click();
        else if (s.phase === 'combat') {
          const o = s.observation, expectedHp = p.getEnemyHp(o.enemy.type, s.depth, 'v7', s.depth === 8 && s.wave >= 2);
          assert.equal(o.enemy.maxHp, expectedHp); assert.match(await page.locator('#enemy').innerText(), new RegExp(`/${expectedHp}`));
          if (o.enemy.turnsElapsed === 0 && (s.depth === 5 || s.depth === 8)) await shot(page, `v7-${archetype}-${s.depth}-${s.wave}-${expectedHp}`, label);
          const rounds = choose(o, 'competent', model, p, rng(v7Seed ^ n));
          const expected = model.resolve(rounds, o.enemy, o, { player: o.player, trace: true });
          for (const id of rounds) await page.locator(`[data-ammo="${id}"]`).click();
          await page.locator('#fire').click(); await page.waitForFunction(() => !window.levelValidation.snapshot().busy, null, { timeout: 30000 });
          const actual = await page.evaluate(() => window.levelValidation.snapshot().lastTrace.shot);
          assert.deepEqual(actual, expected); traces.push({ label, profile: 'v7', archetype, depth: s.depth, wave: s.wave, expected, actual });
        } else if (s.phase === 'discovery') await page.locator(`[data-build="${archetype}"]`).click();
        else if (s.phase === 'reward') {
          const { rewardChoice } = await import('../../experiments/level-v7/engine.mjs');
          await page.locator(`[data-reward="${rewardChoice(s.node.offers, s.run, 'competent', rng(v7Seed))}"]`).click();
        } else if (s.phase === 'workshop') {
          const priorities = archetype === 'recoil' ? ['plusP', 'kickback', 'relay'] : UPGRADE_PRIORITY[archetype];
          const id = priorities.find(id => s.run.stock[id] > 0 && (s.run.ranks[id] ?? 0) < 3);
          if (id) await page.locator(`[data-upgrade="${id}"]`).click();
          if (s.depth === 7) await page.locator(`[data-reinforce="${priorities.find(id => s.run.stock[id] > 0)}"]`).click();
          const payment = Object.keys(s.run.stock).find(id => s.run.stock[id] > 0 && !PACKS[archetype].includes(id));
          if (payment) {
            const score = key => key.includes('Magazine') ? 5 : key === 'texturedGrip' && archetype === 'recoil' ? -1 : key === 'reflexSight' ? 3 : 1;
            const id = [...s.node.attachments].sort((a, b) => score(b) - score(a))[0];
            await page.locator('#payment').selectOption(payment); await page.locator(`[data-attachment="${id}"]`).click();
          }
          await page.locator('[data-action="leave"]').click();
        } else throw new Error(`알 수 없는 v7 상태 ${s.phase}`);
      }
      assert.ok(n < 180);
    }
    await context.close(); console.log(`${label}: 현행 자연 진행/패배/재시작 + v7 여섯 빌드 HP·발별 동치 통과`);
  }
  assert.deepEqual(errors, []);
  await writeFile(new URL('results.json', output), JSON.stringify({ status: 'PASS', v7Seed, productionSeed, viewports: ['1440x900', '390x844'], productionRuns: 2, v7Runs: 12, volleysCompared: traces.length, shotsCompared: traces.reduce((count, row) => count + (Array.isArray(row.actual) ? row.actual.length : row.actual.fired), 0), findings, errors, browser: await browser.version() }, null, 2));
  await writeFile(new URL('traces.json.gz', output), (await import('node:zlib')).gzipSync(JSON.stringify(traces)));
} catch (error) {
  await writeFile(new URL('failure.json', output), JSON.stringify({ message: error.message, findings, errors }, null, 2)); throw error;
} finally { await browser.close(); }
