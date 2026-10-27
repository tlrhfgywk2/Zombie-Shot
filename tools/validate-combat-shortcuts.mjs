/* global window, document, innerWidth */
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const base = process.env.VALIDATION_BASE || 'http://127.0.0.1:5176/Zombie-Shot/';
const output = new URL('../shortcut-validation.local/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['portrait', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport });
    await page.route('**/src/main.ts', route => route.fulfill({ contentType: 'application/javascript', body: `
      import '${new URL('src/style.css', base).pathname}';
      import { Game } from '${new URL('src/core/Game.ts', base).pathname}';
      window.validationGame = new Game(document.querySelector('#app'));
    ` }));
    await page.goto(base);
    await page.locator('[data-choose-mode="free"]').click();
    await page.locator('[data-choose-weapon="p220"]').click();
    const rounds = () => page.evaluate(() => window.validationGame.player.magazine.getRounds());
    await page.keyboard.press('1');
    assert.deepEqual(await rounds(), ['ball']);
    await page.keyboard.press('Space');
    assert.equal(await page.locator('.game-shell').getAttribute('data-shortcut-focus'), 'order');
    await page.keyboard.press('1');
    assert.deepEqual(await rounds(), []);
    await page.screenshot({ path: new URL(`${name}-order-empty.png`, output).pathname.replace(/^\/(.:)/, '$1') });
    await page.keyboard.press('Space');
    // 콜백만 관찰해 실제 전투 연출 없이 R/E 키의 단계별 매핑을 검증한다.
    await page.evaluate(() => {
      const game = window.validationGame;
      window.shortcutActions = [];
      game.ui.callbacks.onLoad = () => window.shortcutActions.push('load');
      game.ui.callbacks.onCylinderDecision = spin => window.shortcutActions.push(spin ? 'spin' : 'keep');
      game.ui.callbacks.onFireCylinder = () => window.shortcutActions.push('fire');
      const types = [...game.ui.shell.querySelectorAll('.ammo-token')].map(button => button.dataset.ammo).filter(ammo => ammo !== 'ball').slice(0, 10);
      window.shortcutTypes = types;
      const build = Object.fromEntries(types.map(ammo => [ammo, 1]));
      const stock = { ...game.player.getStock(), ...build };
      game.ui.renderMagazine([], stock, 6, { ...game.player.getBuild(), ...build });
    });
    const visibleKeys = () => page.locator('.ammo-shortcut:not([hidden])').allTextContents();
    assert.deepEqual(await visibleKeys(), ['1','2','3','4','5','6','7','8','9']);
    // UI 내 예약 수량 소진 후 번호는 빈틈 없이 다시 배정된다.
    await page.evaluate(() => {
      const ui = window.validationGame.ui;
      ui.renderMagazine([window.shortcutTypes[0]], ui.stock, 6, ui.build);
    });
    assert.equal(await page.locator(`[data-ammo]`).filter({has:page.locator('.ammo-shortcut:not([hidden])')}).count(), 9);
    assert.equal(await page.evaluate(() => window.validationGame.ui.shortcutAmmoButtons()[1].dataset.ammo), await page.evaluate(() => window.shortcutTypes[1]));
    await page.keyboard.press('r');
    assert.deepEqual(await page.evaluate(() => window.shortcutActions), ['load']);
    await page.locator('#inventory-button').click();
    await page.keyboard.press('r');
    assert.deepEqual(await page.evaluate(() => window.shortcutActions), ['load']);
    await page.keyboard.press('Escape');
    await page.evaluate(() => { const input = document.createElement('input'); input.id = 'shortcut-input-fixture'; document.body.append(input); input.focus(); });
    await page.keyboard.press('r');
    assert.deepEqual(await page.evaluate(() => window.shortcutActions), ['load']);
    await page.evaluate(() => document.querySelector('#shortcut-input-fixture').remove());
    await page.locator('.ammo-rack').focus();
    await page.evaluate(() => {
      const ui = window.validationGame.ui;
      const ammo = window.shortcutTypes[1];
      ui.renderMagazine([ammo, ammo, ammo, ammo, ammo, ammo], ui.stock, 6, ui.build);
    });
    await page.screenshot({ path: new URL(`${name}-ammo-full.png`, output).pathname.replace(/^\/(.:)/, '$1') });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.evaluate(() => {
      window.removedSlots = [];
      window.validationGame.ui.callbacks.onRemoveAmmo = index => window.removedSlots.push(index);
    });
    await page.keyboard.press('Space');
    await page.keyboard.press('6');
    await page.keyboard.press('5');
    await page.keyboard.press('7');
    assert.deepEqual(await page.evaluate(() => window.removedSlots), [5, 4]);
    await page.keyboard.press('Space');
    const beforeZero = await rounds();
    await page.keyboard.press('0');
    assert.deepEqual(await rounds(), beforeZero);

    await page.evaluate(() => {
      const ui = window.validationGame.ui;
      ui.setLocked(true); ui.setPhase('CYLINDER_CHOICE'); ui.renderCylinderChoice(2, false, false);
    });
    await page.keyboard.press('e');
    await page.keyboard.press('r');
    await page.evaluate(() => window.validationGame.ui.renderCylinderChoice(2, true, true));
    await page.keyboard.press('r');
    assert.deepEqual(await page.evaluate(() => window.shortcutActions), ['load', 'keep', 'spin', 'fire']);
    await page.evaluate(() => window.validationGame.ui.renderCylinderChoice(1, false, false));
    await page.keyboard.press('r');
    assert.deepEqual(await page.evaluate(() => window.shortcutActions), ['load', 'keep', 'spin', 'fire']);
    console.log(`${name}: 단축키 매핑·번호 재배정·창/입력란 차단 통과`);
    await page.close();
  }
} finally { await browser.close(); }

