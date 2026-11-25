/* global document, MutationObserver, innerWidth */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { preview } from 'vite';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const dir = process.env.COMBAT_VALIDATION_DIR
  ? new URL('.', pathToFileURL(join(process.env.COMBAT_VALIDATION_DIR, '화면검증.json')))
  : new URL('../docs/validation/combat-core/', import.meta.url);
await mkdir(dir, { recursive: true });
const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
const url = `http://127.0.0.1:${server.httpServer.address().port}/Zombie-Shot/`;
let browser;
try {
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', args: ['--enable-unsafe-swiftshader'] });
  const results = [];
  for (const [name, width, height] of [['데스크톱', 1440, 900], ['세로', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: width < 500 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.location().url + " " + msg.text()); });
    await page.addInitScript(() => {
      localStorage.setItem('zombie-shot.presentation', '{"speed":2,"firingStance":"aimed"}');
      localStorage.setItem('zombie-shot.save', '{"weapon":"m500","capacity":6,"upgrades":[99],"difficulty":10}');
    });
    await page.goto(url);
    const loc = selector => page.locator(selector);
    const click = selector => loc(selector).click();
    const wait = phase => loc(`main[data-phase="${phase}"]`).waitFor();
    const read = selector => loc(selector).innerText();
    const magazine = () => loc('[data-slot]').evaluateAll(els => els.map(e => e.dataset.roundId));
    const capture = async state => {
      await page.screenshot({ type: 'jpeg', quality: 85, path: fileURLToPath(new URL(`${name}-${state}.jpg`, dir)) });
    };
    const scenario = async (hp, distance = 1, approach = 1) => {
      const details = loc('.lab-settings');
      if (!(await details.evaluate(el => el.open))) await click('.lab-settings summary');
      for (const [key, value] of Object.entries({ maxHp: hp, distance, approach })) await loc(`[name="${key}"]`).fill(String(value));
      await click('form button');
      await click('.lab-settings summary');
      await loc('.lab-head').scrollIntoViewIfNeeded();
    };
    await wait('planning');
    assert.equal(await loc('[data-slot]').count(), 4);
    assert.equal(await loc('[data-round]').count(), 15);
    assert.equal(await read('[data-hp]'), '∞');
    assert.deepEqual(await loc('.lab-ammo-heat b').allTextContents(), ['+16', '+3', '+5', '+12', '+9', '+5', '+7', '+4', '+6', '+0', '+5', '+5', '+5', '+5', '+5']);
    assert.equal(await read('[data-weapon-heat]'), '0');
    assert.equal(await read('[data-heat-multiplier]'), '×1.00');
    assert.equal(await loc('.presentation-debug').count(), 0);
    assert.ok(await loc('canvas').isVisible());
    await capture('준비');
    await click('[data-slot="3"]');
    assert.deepEqual(await magazine(), ['standard', 'standard', 'standard', '']);
    await click('[data-round="standard"]');
    for (const index of [0, 1, 2, 3]) {
      await page.keyboard.press(String(index + 1));
      assert.deepEqual(await magazine(), Array.from({ length: 4 }, (_, i) => i === index ? '' : 'standard'));
      assert.equal(await page.evaluate(() => document.activeElement.dataset.slot), String(index));
      await click('[data-round="standard"]');
    }
    await page.keyboard.press('Space');
    assert.deepEqual(await magazine(), ['', '', '', '']);
    assert.equal(await loc('[data-slot="0"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.slot), '0');
    assert.ok(await loc('[data-fire]').isDisabled());
    await page.keyboard.press('r');
    assert.equal(await read('[data-turns]'), '0');
    assert.equal(await loc('[data-log] li').count(), 0);
    await capture('빈탄창');
    for (const round of ['reinforced', 'vulnerability', 'follow_up', 'finisher']) await click(`[data-round="${round}"]`);
    await click('[data-shift="1"]');
    const loaded = ['vulnerability', 'reinforced', 'follow_up', 'finisher'];
    assert.deepEqual(await magazine(), loaded);
    await page.keyboard.press('r');
    await loc('[data-log] li').first().waitFor();
    await page.keyboard.press('3');
    await page.keyboard.press('Space');
    assert.deepEqual(await magazine(), loaded);
    await wait('planning');
    assert.deepEqual(await loc('[data-base-damage]').allTextContents(), ['0', '20', '8', '8']);
    assert.deepEqual(await loc('[data-pre-heat-damage]').allTextContents(), ['0', '25', '26.25', '20']);
    const damage = (await loc('[data-final-damage]').allTextContents()).map(Number);
    assert.deepEqual(damage, [0, 26, 28, 23]);
    assert.equal(await read('[data-hp]'), '∞');
    assert.equal(await read('[data-weapon-heat]'), '12.5');
    assert.equal(await read('[data-heat-multiplier]'), '×1.13');
    assert.equal(await read('[data-distance]'), '2');
    assert.equal(await read('[data-actions]'), '1');
    assert.equal(await read('[data-status]'), '25% · 1턴');
    await loc('.lab-head').scrollIntoViewIfNeeded();
    await capture('취약');
    await loc('[data-log]').scrollIntoViewIfNeeded();
    await capture('기록');
    await click('[data-reset]');
    const resetDuring = async phase => {
      await page.evaluate(target => new Promise(resolve => {
        const lab = document.querySelector('main');
        const observer = new MutationObserver(() => {
          if (lab.dataset.phase === target) {
            observer.disconnect();
            document.querySelector('[data-reset]').click();
            resolve();
          }
        });
        observer.observe(lab, { attributes: true });
        document.querySelector('[data-fire]').click();
      }), phase);
      await page.waitForTimeout(1500);
      await wait('planning');
      assert.equal(await read('[data-hp]'), '∞');
      assert.equal(await read('[data-distance]'), '3');
      assert.equal(await read('[data-turns]'), '0');
      assert.equal(await read('[data-actions]'), '0');
      assert.equal(await read('[data-weapon-heat]'), '0');
      assert.equal(await loc('[data-log] li').count(), 0);
    };
    await resetDuring('firing');
    await resetDuring('approach');
    await scenario(15);
    await page.keyboard.press('Space');
    for (const round of ['standard','finisher','standard','standard']) await click(`[data-round="${round}"]`);
    await click('[data-fire]');
    await wait('victory');
    assert.equal(await read('[data-turns]'), '1');
    assert.equal(await read('[data-actions]'), '0');
    assert.equal(await loc('[data-slot]').filter({ hasText: '미발사' }).count(), 2);
    assert.match(await read('[data-log]'), /실제 감소 5/);
    assert.equal(await read('[data-weapon-heat]'), '0');
    await loc('.lab-head').scrollIntoViewIfNeeded();
    await capture('조기승리');
    await scenario(51);
    await click('[data-slot="1"]');
    await click('[data-round="standard"]');
    await click('[data-fire]');
    await wait('defeat');
    assert.equal(await read('[data-hp]'), '1 / 51');
    assert.equal(await read('[data-distance]'), '0');
    assert.equal(await read('[data-turns]'), '1');
    assert.equal(await read('[data-actions]'), '1');
    assert.equal(await read('[data-weapon-heat]'), '0');
    assert.ok(await loc('[data-fire]').isDisabled());
    const overflow = await page.evaluate(() => [...document.querySelectorAll('.combat-lab, .lab-slots button, .lab-choices button, .lab-meters, .lab-record')].some(el => el.scrollWidth > el.clientWidth + 1 || el.getBoundingClientRect().right > innerWidth + 1));
    assert.equal(overflow, false);
    await loc('.lab-head').scrollIntoViewIfNeeded();
    await capture('접촉패배');
    await scenario('', 5);
    assert.equal(await read('[data-hp]'), '∞');
    for (const [turn, heat, multiplier] of [[1, '32', '×1.32'], [2, '48', '×1.48']]) {
      await click('[data-fire]');
      await wait('planning');
      assert.equal(await read('[data-turns]'), String(turn));
      assert.equal(await read('[data-weapon-heat]'), heat);
      assert.equal(await read('[data-heat-multiplier]'), multiplier);
      await loc('.lab-head').scrollIntoViewIfNeeded();
      await capture(`열-${heat}`);
    }
    await click('[data-reset]');
    assert.equal(await read('[data-weapon-heat]'), '0');
    await capture('열-초기화');

    await scenario(500, 4);
    await page.keyboard.press('Space');
    for (const round of ['echo_round', 'serrated_round', 'pursuit_round', 'split_round']) await click(`[data-round="${round}"]`);
    await loc('.planner-head').scrollIntoViewIfNeeded();
    await capture('상처탄창');
    assert.ok(await loc('.lab-wound').isHidden());
    await click('[data-fire]');
    await loc('[data-echo]').waitFor();
    assert.equal(await read('[data-echo] [data-hit-damage]'), '11');
    assert.deepEqual(await loc('[data-log] li:nth-child(3) [data-hit-damage]').allTextContents(), ['14', '12']);
    assert.deepEqual(await loc('[data-log] li:nth-child(4) [data-hit-damage]').allTextContents(), ['9', '9', '9']);
    await wait('planning');
    assert.equal(await read('[data-wound]'), '3');
    assert.equal(await read('[data-hp]'), '428 / 500');
    assert.equal(await read('[data-weapon-heat]'), '10');
    await loc('.lab-wound').scrollIntoViewIfNeeded();
    await capture('상처감쇠');
    await loc('[data-log]').scrollIntoViewIfNeeded();
    await capture('독립타격');

    await scenario(14, 4);
    await page.keyboard.press('Space');
    for (const round of ['wounding_round', 'split_round', 'echo_round', 'pursuit_round']) await click(`[data-round="${round}"]`);
    await click('[data-fire]');
    await wait('victory');
    assert.deepEqual(await loc('[data-log] li:nth-child(2) [data-hit-damage]').allTextContents(), ['6', '6']);
    assert.equal(await loc('[data-slot]').filter({ hasText: '미발사' }).count(), 2);
    assert.equal(await loc('[data-echo]').count(), 0);
    assert.ok(await loc('.lab-wound').isHidden());
    await loc('.lab-slots').scrollIntoViewIfNeeded();
    await capture('분열탄처치');

    await page.goto(url + '?presentationDebug=1');
    await loc('.presentation-debug').waitFor();
    const debug = loc('.presentation-debug');
    const beforeDepth = await debug.getAttribute('data-enemy-depth');
    await page.evaluate(() => document.querySelector('[data-fire]').click());
    await loc('[data-log] li:nth-child(2)').waitFor();
    assert.equal(await read('[data-distance]'), '3');
    assert.equal(await debug.getAttribute('data-enemy-depth'), beforeDepth);
    await wait('planning');
    await page.waitForFunction(z => Number(document.querySelector('.presentation-debug').dataset.enemyDepth) > Number(z), beforeDepth);
    assert.equal(await read('[data-distance]'), '2');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('zombie-shot.save')).weapon), 'm500');
    assert.deepEqual(errors, []);
    results.push({ 화면: name, 너비: width, 높이: height, 취약탄창피해: damage, 턴냉각후열: [32, 48], 조기승리발사수: 2, 접촉패배잔여체력: 1, 가로넘침: overflow, 실행오류: errors });
    await page.close();
  }
  await writeFile(new URL('화면검증.json', dir), JSON.stringify(results, null, 2) + '\n');
  console.log(results);
} finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
