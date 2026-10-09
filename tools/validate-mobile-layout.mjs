/* global window, document, innerWidth, innerHeight */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const base = process.env.VALIDATION_BASE || 'http://127.0.0.1:5175/Zombie-Shot/';
const output = new URL('../docs/validation/mobile/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
const findings = [];
try {
  for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['portrait', { width: 390, height: 844 }], ['short', { width: 360, height: 640 }]]) {
    const context = await browser.newContext({ viewport, hasTouch: label !== 'desktop', deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/src/main.ts', route => route.fulfill({ contentType: 'application/javascript', body: `
      import '${new URL('src/style.css', base).pathname}';
      import { Game } from '${new URL('src/core/Game.ts', base).pathname}';
      window.validationGame = new Game(document.querySelector('#app'));
    ` }));
    const shot = name => page.screenshot({ path: fileURLToPath(new URL(`${label}-${name}.png`, output)) });
    const audit = async name => {
      const result = await page.evaluate(() => {
        const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom }; };
        const bad = [...document.querySelectorAll('.mag-slot:not([hidden]) .slot-content, .forecast-stat:not([hidden]), .mobile-panel:not([hidden]) .attachment-option')]
          .filter(element => element.getClientRects().length && (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)).map(element => element.textContent);
        return { width: innerWidth, height: innerHeight, stage: rect('.game-stage'), dock: rect('.tactical-console'), hud: rect('.top-hud'), phase: rect('.phase-panel'), bad, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      assert.equal(result.overflow, false, `${label}/${name}: 페이지 가로 넘침`);
      assert.deepEqual(result.bad, [], `${label}/${name}: 내용 넘침`);
      assert.ok(result.dock.bottom <= result.height + 1);
      findings.push({ label, name, ...result });
    };
    await page.goto(base);
    await page.locator('[data-choose-mode="free"]').click();
    await page.locator('[data-choose-weapon="p220"]').click();
    await audit('empty'); await shot('empty');
    if (label !== 'desktop') {
      assert.equal(await page.locator('#attachment-bay').isVisible(), false);
      await page.locator('[data-mobile-panel="attachments"]').click();
      await page.locator('#attachment-supply-button').click();
      await page.locator('[data-supply-attachment="highCapacityMagazine"]').click();
      await page.locator('[data-close-attachment-inventory]').click();
      assert.equal(await page.locator('.tactical-console').evaluate(e => e.inert), false);
      await page.locator('[data-mobile-panel="attachments"]').click();
      await page.locator('[data-attachment-slot="magazine"]').click();
      await page.locator('[data-attachment="highCapacityMagazine"]').click();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('[data-mobile-attachment-count]').textContent(), '1');
      assert.equal(await page.locator('[data-mobile-panel="attachments"]').evaluate(e => e === document.activeElement), true);
      await page.locator('[data-mobile-panel="settings"]').click();
      await page.locator('#audio-mute').click();
      assert.equal(await page.locator('#audio-mute').getAttribute('aria-pressed'), 'true');
      await shot('settings');
      await page.locator('[data-close-mobile-panel]').click();
    }
    await page.evaluate(async () => {
      const game = window.validationGame;
      const { AMMO_ORDER } = await import('/Zombie-Shot/src/data/ammoDefinitions.ts');
      const { ATTACHMENT_ORDER } = await import('/Zombie-Shot/src/data/attachmentDefinitions.ts');
      for (const ammo of AMMO_ORDER.filter(ammo => ammo !== 'ball')) game.player.supplyAmmo(ammo);
      for (const id of ATTACHMENT_ORDER) game.player.claimAttachment(id);
      game.player.equipAttachment('highCapacityMagazine');
      game.player.equipAttachment('pistolScope');
      game.player.equipAttachment('laserLightModule');
      game.player.magazine.setRounds(['accelerant', 'highHeat', 'retreatCutter', 'explosive', 'heavy', 'ball']);
      game.zombie.state.hp = 200;
      game.zombie.state.maxHp = 200;
      game.sync();
    });
    await audit('full'); await shot('full');
    if (label !== 'desktop') {
      const touch = await context.newCDPSession(page);
      const rack = await page.locator('.ammo-options').boundingBox();
      await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: rack.x + rack.width - 20, y: rack.y + 22 }] });
      for (let step = 1; step <= 8; step++) await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: rack.x + rack.width - 20 - step * 25, y: rack.y + 22 }] });
      await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      assert.ok(await page.locator('.ammo-options').evaluate(e => e.scrollLeft > 0), '손가락으로 탄약 줄 스크롤');
      assert.equal(await page.locator('.is-dragging').count(), 0);
      await page.locator('.ammo-options').evaluate(e => { e.scrollLeft = 0; });
      const ammoButton = await page.locator('[data-ammo="ball"]').boundingBox();
      await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: ammoButton.x + 30, y: ammoButton.y + 20 }] });
      await page.locator('#ammo-tooltip').waitFor({ state: 'visible' });
      await shot('tooltip');
      const tooltip = await page.locator('#ammo-tooltip').boundingBox();
      assert.ok(tooltip.y >= 0 && tooltip.y + tooltip.height <= viewport.height);
      await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.keyboard.press('Escape');
      const dockHeight = await page.locator('.tactical-console').evaluate(e => e.getBoundingClientRect().height);
      assert.ok(dockHeight < 300);
      await page.locator('[data-mobile-panel="attachments"]').click();
      await page.locator('[data-attachment-slot="optic"]').click();
      await audit('attachments'); await shot('attachments');
      // 폰 회전 및 데스크톱 전환 후 원래 노드와 이벤트가 유지되어야 한다.
      await page.setViewportSize({ width: 844, height: 390 });
      await page.waitForFunction(() => document.querySelector('.game-shell').dataset.layout === 'compact-landscape');
      await shot('landscape-panel');
      await page.keyboard.press('Escape');
      await shot('landscape');
      await page.locator('[data-mobile-panel="attachments"]').click();
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForFunction(() => document.querySelector('.game-shell').dataset.layout === 'desktop');
      assert.equal(await page.locator('#mobile-panel').isVisible(), false);
      assert.equal(await page.locator('.tactical-console').evaluate(e => e.inert), false);
      assert.equal(await page.locator('.loadout > #attachment-bay').count(), 1);
      await page.setViewportSize(viewport);
      await page.waitForFunction(() => document.querySelector('.game-shell').dataset.layout === 'portrait');
      await page.locator('[data-mobile-panel="settings"]').click();
      assert.equal(await page.locator('#audio-mute').getAttribute('aria-pressed'), 'true');
      await page.keyboard.press('Escape');
    }
    await page.evaluate(() => {
      const game = window.validationGame;
      game.zombie.state.hp = 1;
      game.player.magazine.setRounds(['ball', 'accelerant', 'highHeat', 'rupture', 'explosive', 'relay']);
      game.sync();
    });
    await audit('unfired'); await shot('unfired');
    assert.equal(await page.locator('.will-not-fire').count(), 5);
    if (label !== 'desktop') {
      await page.locator('[data-mobile-panel="settings"]').click();
      await page.locator('#mobile-panel').click({ position: { x: 2, y: 2 } });
      assert.equal(await page.locator('#mobile-panel').isVisible(), false);
      await page.locator('[data-mobile-panel="attachments"]').click();
      await page.evaluate(() => window.validationGame.ui.setLocked(true));
      assert.equal(await page.locator('#mobile-panel').isVisible(), false);
      assert.equal(await page.locator('[data-mobile-panel="attachments"]').isDisabled(), true);
      await page.evaluate(() => { window.validationGame.ui.setLocked(false); window.validationGame.sync(); });
      await page.locator('[data-mobile-panel="settings"]').click();
      await page.locator('#mobile-panel [data-return-to-menu]').click();
      await page.locator('[data-choose-mode="exploration"]').click();
      await page.locator('[data-choose-weapon="p220"]').click();
      await page.locator('[data-cave-action="tool:echo"]').click();
      await page.locator('[data-cave-action="route:0"]').click();
      await page.locator('[data-cave-action="fight"]').click();
      await page.locator('[data-mobile-panel="attachments"]').click();
      assert.equal(await page.locator('#attachment-supply-button').isVisible(), false);
      await page.keyboard.press('Escape');
      await shot('exploration');
    }
    assert.deepEqual(errors, [], `${label}: 실행 오류`);
    await context.close();
  }
  await writeFile(new URL('metrics.json', output), JSON.stringify(findings, null, 2));
  process.stdout.write(`${JSON.stringify(findings, null, 2)}\n`);
} finally { await browser.close(); }
