/* global window, document, innerWidth, innerHeight */
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');

const base = process.env.VALIDATION_BASE || 'http://127.0.0.1:5173/Zombie-Shot/';
const output = new URL('../docs/validation/exploration/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
const findings = [];
const eventsOnly = process.argv.includes('--events-only');

for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['portrait', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // 진입점만 테스트용 참조를 보관한다. 전투·UI·애니메이션 코드는 그대로 사용한다.
  await page.route('**/src/main.ts', route => route.fulfill({ contentType: 'application/javascript', body: `
    import '${new URL('src/style.css', base).pathname}';
    import { Game } from '${new URL('src/core/Game.ts', base).pathname}';
    window.validationGame = new Game(document.querySelector('#app'));
    window.validationGame.presentation.setPlaybackSpeed(4);
  ` }));
  const shot = async name => page.screenshot({ path: fileURLToPath(new URL(`${name}-${label}.png`, output)) });
  const audit = async name => {
    const result = await page.evaluate(() => {
      const card = document.querySelector('#exploration:not([hidden]) .cave-card');
      if (!card) return {};
      const rect = card.getBoundingClientRect();
      const choices = [...card.querySelectorAll('.cave-choice')];
      return { card: [rect.left, rect.top, rect.right, rect.bottom], width: innerWidth, height: innerHeight,
        overflow: card.scrollWidth > card.clientWidth + 1,
        badChoices: choices.filter(button => button.scrollWidth > button.clientWidth + 1).map(button => button.textContent),
        scrolls: card.scrollHeight > card.clientHeight };
    });
    assert.equal(result.overflow, false, `${label}/${name}: 카드 가로 넘침`);
    assert.deepEqual(result.badChoices, [], `${label}/${name}: 선택지 가로 넘침`);
    assert.ok(result.card[0] >= 0 && result.card[2] <= viewport.width && result.card[1] >= 0 && result.card[3] <= viewport.height, `${label}/${name}: 화면 경계`);
    findings.push({ label, name, ...result });
  };
  const action = async value => {
    const button = page.locator(`[data-cave-action="${value}"]`);
    await button.click();
  };
  await page.goto(`${base}?seed=browser-101`);
  await page.locator('[data-choose-mode="exploration"]').waitFor();
  await shot('menu');
  assert.equal(await page.locator('[data-choose-mode]').count(), 2);
  await page.locator('[data-choose-mode="exploration"]').click();
  await shot('weapons');
  await page.locator('[data-choose-weapon="p220"]').click();
  await audit('entry'); await shot('entry');
  await action('tool:echo');
  if (eventsOnly) {
    for (const event of ['cache', 'survey', 'shrine', 'nest']) {
      await page.evaluate(event => {
        const game = window.validationGame;
        game.exploration.active = { id: `fixture-${event}`, kind: 'event', event, rewards: [] };
        game.caveScreen = 'encounter'; game.renderExploration();
      }, event);
      await audit(`event-${event}`); await shot(`event-${event}`);
      assert.equal(await page.locator('[data-cave-payment]').count(), event === 'survey' || event === 'shrine' ? 1 : 0);
      const entryEvent = await page.evaluate(() => window.validationGame.exploration.layers[1][0].event);
      if (event === entryEvent) await shot('event');
      await action('leave');
    }
    assert.deepEqual(errors, []); await context.close(); continue;
  }
  await audit('junction'); await shot('junction');
  await action('route:0'); await audit('encounter');
  await action('fight');
  await page.waitForFunction(() => document.body.dataset.phase === 'AMMO_SELECTION');
  await shot('combat-empty');
  let battles = 0;
  while (await page.evaluate(() => window.validationGame.state.phase !== 'VICTORY')) {
    const state = await page.evaluate(() => ({ phase: window.validationGame.state.phase, cave: window.validationGame.caveScreen,
      kind: window.validationGame.exploration.active?.kind, depth: window.validationGame.exploration.depth }));
    if (state.phase === 'AMMO_SELECTION') {
      const capacity = await page.evaluate(() => window.validationGame.player.magazine.capacity);
      for (let slot = 0; slot < capacity; slot++) await page.locator('[data-ammo="ball"]').click();
      if (state.depth === 1) await shot('combat-full');
      await page.locator('#load-button').click();
      await page.waitForFunction(() => ['AMMO_SELECTION', 'EXPLORATION', 'GAME_OVER'].includes(window.validationGame.state.phase) && !window.validationGame.busy, null, { timeout: 30000 });
      assert.notEqual(await page.evaluate(() => window.validationGame.state.phase), 'GAME_OVER');
    } else if (state.cave === 'reward') {
      battles++;
      await audit('reward');
      if (state.depth === 1) await shot('reward');
      await action('reward:0');
    } else if (state.cave === 'junction') {
      if (state.depth === 4) {
        await audit('informed-junction'); await shot('informed-junction');
        await action('inspect:0'); await audit('map-revealed'); await shot('map-revealed');
        await action('inspect:1'); await audit('map-empty'); await shot('map-empty');
        assert.equal(await page.evaluate(() => window.validationGame.exploration.mapCharges), 0);
        assert.equal(await page.locator('[data-cave-action^="inspect:"]').count(), 0);
      }
      await action('route:0');
    } else if (state.kind === 'combat') {
      if (state.depth === 8) { await audit('dangerous'); await shot('dangerous'); assert.ok(await page.locator('[data-cave-action="avoid"]').isDisabled()); }
      await action('fight');
      await page.waitForFunction(() => document.body.dataset.phase === 'AMMO_SELECTION');
    } else if (state.kind === 'event') {
      await audit('event'); if (state.depth === 2) await shot('event');
      await action('leave');
    } else if (state.kind === 'merchant') {
      await audit('merchant'); await shot('merchant');
      if (!await page.locator('[data-cave-action="buy:map"]').isDisabled()) await action('buy:map');
      if (!await page.locator('[data-cave-action="buy:uv"]').isDisabled()) await action('buy:uv');
      await action('leave');
    } else throw new Error(`Unexpected state ${JSON.stringify(state)}`);
  }
  assert.ok(battles >= 4);
  await shot('victory');
  await page.locator('#restart-button').click();
  await page.locator('[data-cave-action="tool:echo"]').waitFor();
  assert.equal(await page.evaluate(() => window.validationGame.exploration.depth), 0);
  // 자원이 없는 상인, 최대 휴대량 보상, 지도 0회, 회피 가능/불가, 즉사와 재시작.
  await action('tool:echo');
  await page.evaluate(() => { const game = window.validationGame; game.exploration.depth = 3;
    const build = game.player.getBuild(); const payment = Object.entries(build).flatMap(([ammo, count]) => Array(count).fill(ammo));
    game.player.exchangeAmmo(payment); });
  await action('route:0'); await audit('merchant-empty'); await shot('merchant-empty');
  assert.ok(await page.locator('[data-cave-action="buy:ammo"]').isDisabled());
  assert.ok(await page.locator('[data-cave-payment]').isDisabled());
  await action('leave');
  await page.evaluate(() => { const game = window.validationGame; game.exploration.depth = 0; game.exploration.awareness = 2; });
  await action('route:0'); await audit('avoidable'); await shot('avoidable');
  await action('avoid');
  assert.equal(await page.evaluate(() => window.validationGame.exploration.avoided), 1);
  await page.evaluate(() => { const game = window.validationGame; game.exploration.depth = 0; });
  await action('route:0'); await action('fight');
  await page.waitForFunction(() => document.body.dataset.phase === 'AMMO_SELECTION');
  await page.evaluate(() => { const game = window.validationGame; game.zombie.applyState({ ...game.zombie.snapshot(), hp: 1, distance: 3 }); game.sync(); });
  for (let i = 0; i < 4; i++) await page.locator('[data-ammo="ball"]').click();
  await shot('unfired');
  await page.locator('#load-button').click();
  await page.waitForFunction(() => window.validationGame.caveScreen === 'reward' && !window.validationGame.busy);
  await page.evaluate(() => { const game = window.validationGame; for (let i = 0; i < 14; i++) game.player.exchangeAmmo([], ['lightLoad']); game.renderExploration(); });
  await audit('reward-full'); await shot('reward-full');
  assert.ok(await page.locator('[data-cave-action="reward:0"]').isDisabled());
  await action('leave');
  await page.evaluate(() => { const game = window.validationGame; game.exploration.depth = 7; });
  await action('route:0'); await action('fight');
  await page.waitForFunction(() => document.body.dataset.phase === 'AMMO_SELECTION');
  await page.evaluate(() => { const game = window.validationGame; game.zombie.applyState({ ...game.zombie.snapshot(), distance: 0 }); game.sync(); });
  await page.locator('#load-button').click();
  await page.waitForFunction(() => document.body.dataset.phase === 'GAME_OVER');
  await shot('failure');
  await page.locator('#restart-button').click();
  await action('tool:echo');
  for (const event of ['cache', 'survey', 'shrine', 'nest']) {
    await page.evaluate(event => {
      const game = window.validationGame;
      game.exploration.active = { id: `fixture-${event}`, kind: 'event', event, rewards: [] };
      game.caveScreen = 'encounter'; game.renderExploration();
    }, event);
    await audit(`event-${event}`); await shot(`event-${event}`);
    await action('leave');
  }
  await action('menu');
  await page.locator('[data-choose-mode="free"]').click();
  await page.locator('[data-choose-weapon="m500"]').click();
  assert.ok(await page.locator('#ammo-supply-button').isVisible());
  assert.equal(await page.evaluate(() => window.validationGame.player.getStock().lightLoad), 1);
  await page.locator('[data-ammo="lightLoad"]').click();
  await page.locator('[data-ammo="relay"]').click();
  await shot('free-m500');
  assert.deepEqual(errors, [], `${label}: 브라우저 오류`);
  await context.close();
}
await browser.close();
await writeFile(new URL(eventsOnly ? 'event-results.json' : 'results.json', output), JSON.stringify(findings, null, 2));
console.log(JSON.stringify({ checks: findings.length, viewports: ['1440x900', '390x844'], loopsCompleted: eventsOnly ? 0 : 2 }));
