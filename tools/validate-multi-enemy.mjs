/* global window, document, innerWidth */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const base = process.env.VALIDATION_BASE || 'http://127.0.0.1:5175/Zombie-Shot/';
const output = new URL('../docs/validation/multi-enemy/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'msedge', args: ['--enable-unsafe-swiftshader'] });
const results = [];
try {
  for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['portrait', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, hasTouch: label === 'portrait', deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/src/main.ts', route => route.fulfill({ contentType: 'application/javascript', body: `
      import '${new URL('src/style.css', base).pathname}';
      import { Game } from '${new URL('src/core/Game.ts', base).pathname}';
      window.validationGame = new Game(document.querySelector('#app'));
    ` }));
    const audit = async name => {
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        cards: [...document.querySelectorAll('.target-card')].map(element => {
          const r = element.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height, overflow: element.scrollWidth > element.clientWidth + 1 };
        }),
        diagnostics: Boolean(document.querySelector('.presentation-debug')),
      }));
      assert.equal(layout.overflow, false, `${label}/${name}: 페이지 넘침`);
      assert.equal(layout.diagnostics, false);
      await page.screenshot({ path: fileURLToPath(new URL(`${label}-${name}.png`, output)) });
      assert.ok(layout.cards.every(card => !card.overflow && card.x >= 0 && card.x + card.width <= viewport.width), `${label}/${name}: ${JSON.stringify(layout)}`);
      results.push({ label, name, ...layout });
    };
    const tap = async locator => label === 'portrait' ? locator.tap() : locator.click();
    await page.goto(base);
    await tap(page.locator('[data-choose-mode="free"]'));
    await tap(page.locator('[data-choose-weapon="p220"]'));
    await audit('single-empty');
    await page.evaluate(async () => {
      const game = window.validationGame;
      const { Encounter } = await import('/Zombie-Shot/src/combat/Encounter.ts');
      game.encounter = new Encounter(['normal', 'normal']); game.sync();
      game.presentation.setPlaybackSpeed(3);
    });
    await page.waitForTimeout(500);
    await audit('group-empty');
    await tap(page.locator('[data-select-target]').nth(1));
    assert.equal(await page.locator('[data-select-target]').nth(1).getAttribute('aria-pressed'), 'true');
    const bodyPoint = await page.evaluate(() => {
      const view = window.validationGame.presentation;
      const point = view.enemyActors[0].model.root.position.clone();
      point.y += 1.05; point.project(view.camera);
      const rect = view.renderer.domElement.getBoundingClientRect();
      return { x: rect.x + (point.x + 1) * rect.width / 2, y: rect.y + (1 - point.y) * rect.height / 2 };
    });
    if (label === 'portrait') await page.touchscreen.tap(bodyPoint.x, bodyPoint.y);
    else await page.mouse.click(bodyPoint.x, bodyPoint.y);
    assert.equal(await page.locator('[data-select-target]').nth(0).getAttribute('aria-pressed'), 'true');
    await tap(page.locator('[data-select-target]').nth(1));
    await page.evaluate(() => {
      const game = window.validationGame;
      game.player.supplyAmmo('relay'); game.player.supplyAmmo('plusP');
      game.player.magazine.setRounds(['relay', 'plusP', 'ball', 'ball']); game.sync();
    });
    await audit('group-full');
    await tap(page.locator('#load-button'));
    await page.waitForFunction(() => window.validationGame.state.phase === 'AIMING');
    await audit('aiming');
    await tap(page.locator('#load-button'));
    await page.waitForFunction(() => window.validationGame.state.phase === 'AIMING');
    await tap(page.locator('[data-select-target]').nth(0));
    const sequence = await page.evaluate(() => window.validationGame.player.magazine.getRounds());
    assert.deepEqual(sequence, ['plusP', 'ball', 'ball']);
    await audit('retarget');
    await page.evaluate(() => {
      const game = window.validationGame;
      const target = game.encounter.selected.zombie;
      target.applyState({ ...target.snapshot(), hp: 1 });
    });
    await tap(page.locator('#load-button'));
    await page.waitForFunction(() => window.validationGame.state.phase === 'AIMING');
    assert.equal(await page.locator('.target-card').count(), 1);
    const afterKill = await page.evaluate(() => ({ rounds: window.validationGame.player.magazine.getRounds(), stock: window.validationGame.player.getStock().plusP }));
    assert.deepEqual(afterKill.rounds, ['ball', 'ball']); assert.equal(afterKill.stock, 0);
    await audit('first-kill');
    await page.evaluate(() => {
      const game = window.validationGame;
      const target = game.encounter.selected.zombie;
      target.applyState({ ...target.snapshot(), hp: 1 }); game.sync();
    });
    assert.equal(await page.locator('.mag-slot.will-not-fire').count(), 1);
    await audit('last-target-unfired');
    await page.evaluate(async () => {
      const game = window.validationGame;
      game.returnToMenu(); game.chooseMode('free'); game.chooseWeapon('p220');
      const { Encounter } = await import('/Zombie-Shot/src/combat/Encounter.ts');
      game.encounter = new Encounter(['contaminator', 'screecher'], ['normal']);
      const first = game.encounter.living[0].zombie;
      first.applyState({ ...first.snapshot(), wound: 4, vulnerableTurns: 2, burn: 19, ignitedActions: 1, actionShock: 6, explosive: 12 });
      for (const id of ['highCapacityMagazine', 'laserLightModule']) game.player.claimAttachment(id);
      game.player.equipAttachment('highCapacityMagazine');
      for (const ammo of ['retreatCutter', 'highExplosive', 'accelerant', 'mimic', 'mirror', 'finisher']) game.player.supplyAmmo(ammo);
      game.player.magazine.setRounds(['retreatCutter', 'highExplosive', 'accelerant', 'mimic', 'mirror', 'finisher']);
      game.sync();
    });
    await page.waitForTimeout(500);
    await audit('dangerous-full');
    await page.evaluate(() => {
      const game = window.validationGame;
      game.player.magazine.setRounds(['ball', 'ball', 'ball', 'ball', 'ball', 'ball']);
      const target = game.encounter.selected.zombie;
      target.applyState({ ...target.snapshot(), hp: 1 }); game.sync();
    });
    await audit('predicted-kill');
    await tap(page.locator('#load-button'));
    await page.waitForFunction(() => window.validationGame.state.phase === 'AIMING');
    await tap(page.locator('#load-button'));
    await page.waitForFunction(() => window.validationGame.state.phase === 'AIMING');
    assert.equal(await page.locator('.target-card').count(), 2);
    await audit('reinforcement');
    await page.evaluate(() => {
      const game = window.validationGame;
      for (const enemy of game.encounter.living) enemy.zombie.applyState({ ...enemy.zombie.snapshot(), distance: .5, telegraphedAction: 'attack' });
      game.sync();
    });
    await page.waitForTimeout(600);
    await audit('melee');
    assert.deepEqual(errors, []);
    await context.close();
  }
  await writeFile(new URL('results.json', output), JSON.stringify(results, null, 2));
  console.log(`데스크톱·세로 화면 ${results.length}개 상태 검증 완료`);
} finally { await browser.close(); }
