/* global document */
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const output = 'docs/validation/enemy-guide';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'msedge', args: ['--enable-unsafe-swiftshader'] });
const results = [];
try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['portrait', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    const open = async state => {
      const host = state === 'menu' || state === 'weapon' ? '#weapon-selection' : state === 'exploration' ? '#exploration' : name === 'portrait' ? '.mobile-tools' : '.brand';
      const button = page.locator(`${host} [data-open-enemy-guide]`);
      await button.click();
      await page.locator('.enemy-guide[open]').waitFor();
      assert.equal(await page.locator('.enemy-guide tbody tr').count(), 10);
      assert.equal(await page.locator('.enemy-guide tbody tr td:nth-child(3)').allTextContents().then(v => v.every(x => x === '+0')), true);
      const rect = await page.locator('.enemy-guide').boundingBox();
      assert.ok(rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= viewport.width && rect.y + rect.height <= viewport.height);
      await page.screenshot({ path: `${output}/${name}-${state}.png` });
      await page.locator('.enemy-guide-scroll').evaluate(el => { el.scrollLeft = el.scrollWidth; el.scrollTop = el.scrollHeight; });
      await page.screenshot({ path: `${output}/${name}-${state}-patterns.png` });
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.enemy-guide').evaluate(el => el.open), false);
      assert.equal(await button.evaluate(el => el === document.activeElement), true);
      results.push({ name, state, rows: 10, growth: 0 });
    };
    await page.goto(process.env.VALIDATION_BASE || 'http://127.0.0.1:5180/Zombie-Shot/');
    await open('menu');
    await page.locator('[data-choose-mode="free"]').click();
    await open('weapon');
    await page.locator('[data-choose-weapon="p220"]').click();
    await page.locator('.ammo-token[data-ammo="ball"]').click();
    const before = await page.locator('#hp-text').textContent();
    await open('free');
    assert.equal(await page.locator('#hp-text').textContent(), before);
    assert.equal(await page.locator('.mag-slot .slot-content').filter({ hasText: '표준탄' }).count(), 1);
    // 공개 메뉴 이동은 기존 조작을 그대로 사용한다.
    await page.locator('[data-mobile-panel="settings"]:visible').count() && await page.locator('[data-mobile-panel="settings"]:visible').click();
    const menu = page.locator('[data-return-to-menu]:visible').first();
    if (!await menu.count()) await page.locator('#weapon-panel summary').click();
    await page.locator('[data-return-to-menu]:visible').first().click();
    await page.locator('[data-choose-mode="exploration"]').click();
    await page.locator('[data-choose-weapon="p220"]').click();
    await open('exploration');
    assert.deepEqual(errors, []);
    await page.close();
  }
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  console.log(`도감 ${results.length}개 화면 상태 및 표 양 끝·닫기·포커스·읽기 전용 확인`);
} finally { await browser.close(); }
