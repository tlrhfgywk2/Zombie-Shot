/* global window, document, innerWidth */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const base = process.env.VALIDATION_BASE || 'http://127.0.0.1:5177/Zombie-Shot/';
const output = new URL('../docs/validation/encounter-balance/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'msedge', args: ['--enable-unsafe-swiftshader'] });
const cases = [
  { id: 'mixed', roster: ['fast', 'tough'], rounds: ['wounding', 'wounding', 'laceration', 'ball'], targets: [1, 1, 1, 0], weapon: 'p220', expectedTurns: 3 },
  { id: 'dangerous', roster: ['contaminator', 'screecher'], reinforcements: ['normal'], rounds: ['ball', 'ball', 'ball', 'ball'], weapon: 'p220', expectedTurns: 7 },
  { id: 'ground', roster: ['groundshaker', 'normal'], reinforcements: ['normal'], rounds: ['ball', 'ball', 'ball', 'ball'], weapon: 'p220', expectedAction: '지반 충격' },
  { id: 'scope-counter', roster: ['groundshaker', 'normal'], reinforcements: ['normal'], rounds: ['wounding', 'wounding', 'ball', 'finisher'], weapon: 'm1911', scope: true, penalty: 2 },
];
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
      window.balanceGame = new Game(document.querySelector('#app'));
    ` }));
    const tap = async selector => label === 'portrait' ? page.locator(selector).tap() : page.locator(selector).click();
    const snapshot = async name => {
      await page.screenshot({ path: fileURLToPath(new URL(`${label}-${name}.png`, output)) });
      const audit = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth,
        badCards: [...document.querySelectorAll('.target-card')].filter(card => card.scrollWidth > card.clientWidth + 1).length,
        debug: Boolean(document.querySelector('.presentation-debug')),
      }));
      assert.deepEqual(audit, { overflow: false, badCards: 0, debug: false });
    };
    for (const scenario of cases) {
      await page.goto(base);
      await tap('[data-choose-mode="free"]'); await tap(`[data-choose-weapon="${scenario.weapon}"]`);
      await page.evaluate(async scenario => {
        const game = window.balanceGame;
        const { Encounter } = await import('/Zombie-Shot/src/combat/Encounter.ts');
        game.encounter = new Encounter(scenario.roster, scenario.reinforcements);
        game.waveIndex = scenario.id === 'mixed' ? 1 : 2;
        for (const { zombie } of game.encounter.living) zombie.applyState({ ...zombie.snapshot(), distance: Math.max(3, zombie.distance - (scenario.penalty ?? 0)) });
        if (scenario.scope) { game.player.claimAttachment('pistolScope'); game.player.equipAttachment('pistolScope'); }
        const counts = {};
        for (const ammo of scenario.rounds) if (ammo !== 'ball') counts[ammo] = (counts[ammo] ?? 0) + 1;
        for (const [ammo, count] of Object.entries(counts)) while (game.player.getStock()[ammo] < count) game.player.supplyAmmo(ammo);
        for (const ammo of scenario.rounds) if (!game.player.addAmmo(ammo)) throw new Error('검증 탄창 준비 실패');
        game.presentation.setPlaybackSpeed(3);
        game.sync();
      }, scenario);
      await page.waitForTimeout(400);
      await snapshot(`${scenario.id}-opening`);
      if (scenario.expectedAction) assert.ok((await page.locator('.target-action').first().innerText()).includes(scenario.expectedAction));
      await tap('#load-button');
      await page.waitForFunction(() => window.balanceGame.state.phase === 'AIMING');
      for (let shot = 0; shot < scenario.rounds.length; shot += 1) {
        const lane = scenario.targets?.[shot] ?? await page.evaluate(() => [...window.balanceGame.encounter.living].sort((a, b) => a.zombie.distance - b.zombie.distance || a.lane - b.lane)[0].lane);
        await tap(`[data-target-lane="${lane}"]`); await tap('#load-button');
        await page.waitForFunction(() => ['AIMING', 'AMMO_SELECTION', 'ATTACHMENT_REWARD', 'ROUTE_SELECTION'].includes(window.balanceGame.state.phase));
        if (scenario.id === 'mixed' && shot === 2) await snapshot('mixed-vulnerable');
      }
      if (scenario.id === 'ground') {
        assert.equal(await page.locator('#player-debuffs').isVisible(), true);
        await snapshot('ground-effect');
      }
      const result = await page.evaluate(async () => {
        const game = window.balanceGame;
        let turns = 1;
        while (!game.encounter.complete && game.player.isAlive && turns < 12) {
          for (let index = 0; index < game.player.magazine.capacity; index += 1) game.player.addAmmo('ball');
          await game.beginCombat();
          while (game.state.phase === 'AIMING') {
            const nearest = [...game.encounter.living].sort((a, b) => a.zombie.distance - b.zombie.distance || a.lane - b.lane)[0];
            game.selectTarget(nearest.id); await game.fireNextShot();
          }
          turns += 1;
        }
        return { won: game.encounter.complete && game.player.isAlive, turns, stockRestored: JSON.stringify(game.player.getStock()) === JSON.stringify({ ...game.player.getBuild(), ball: 'infinite' }) };
      });
      assert.equal(result.won, true, `${label}/${scenario.id}`);
      assert.equal(result.stockRestored, true);
      if (scenario.expectedTurns) assert.equal(result.turns, scenario.expectedTurns);
      results.push({ label, scenario: scenario.id, ...result });
    }
    assert.deepEqual(errors, []); await context.close();
  }
  await writeFile(new URL('browser.json', output), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results));
} finally { await browser.close(); }
