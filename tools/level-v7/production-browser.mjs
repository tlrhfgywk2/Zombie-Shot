/* global window */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { production, root } from './runtime.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const p = await production(), resolver = new p.CombatResolver(() => .5);
const base = process.env.VALIDATION_BASE ?? 'http://127.0.0.1:5173/Zombie-Shot/';
const output = new URL('experiments/level-v7/results/production-browser/', root); await mkdir(output, { recursive: true });
const scenarios = [
  { id: 'damage-range', rounds: ['ball', 'ball', 'ball', 'ball'], enemy: 'tough', distance: 6 },
  { id: 'recoil', rounds: ['plusP', 'plusP', 'lowRecoil', 'kickback'], enemy: 'groundshaker', distance: 6.5 },
  { id: 'wound', rounds: ['wounding', 'wounding', 'laceration', 'ball'], enemy: 'contaminator', distance: 6 },
  { id: 'heat', rounds: ['incendiary', 'accelerant', 'ignition', 'ball'], enemy: 'tough', distance: 6 },
  { id: 'explosion', rounds: ['stickyCharge', 'flatNose', 'ball', 'ball'], enemy: 'tough', distance: 10 },
  { id: 'movement', rounds: ['advance', 'retreat', 'ball', 'ball'], enemy: 'groundshaker', distance: 6 },
  { id: 'shock-survival', rounds: ['flatNose', 'flatNose', 'ball', 'ball'], enemy: 'normal', distance: .5 },
  { id: 'attachments', rounds: ['plusP', 'lowRecoil', 'ball', 'ball', 'ball', 'ball'], enemy: 'groundshaker', distance: 6,
    loadout: { magazine: 'highCapacityMagazine', muzzle: 'muzzleBrake', optic: 'reflexSight' } },
  { id: 'early-kill-unused', rounds: ['ball', 'plusP', 'flatNose', 'ball'], enemy: 'normal', distance: 3, hp: 1 },
];
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', headless: true });
const results = [], errors = [];
try {
  for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['portrait', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 }), page = await context.newPage();
    page.on('pageerror', error => errors.push({ label, message: error.message }));
    await page.route('**/src/main.ts', route => route.fulfill({ contentType: 'application/javascript', body: `
      import '${new URL('src/style.css', base).pathname}';
      import { Game } from '${new URL('src/core/Game.ts', base).pathname}';
      import { Zombie } from '${new URL('src/entities/Zombie.ts', base).pathname}';
      window.makeEnemy = id => new Zombie(id);
      const game = window.validationGame = new Game(document.querySelector('#app'));
      game.presentation.setPlaybackSpeed(2);
      const fire = game.player.fireRound.bind(game.player);
      window.productionShots = [];
      game.player.fireRound = shot => { const before = game.player.getStock(); fire(shot); window.productionShots.push({ shot, before, after: game.player.getStock() }); };
    ` }));
    await page.goto(base);
    await page.locator('[data-choose-mode="free"]').click(); await page.locator('[data-choose-weapon="p220"]').click();
    for (const scenario of scenarios) {
      const state = { ...p.createEnemyState(scenario.enemy), distance: scenario.distance, ...(scenario.hp ? { hp: scenario.hp } : {}) };
      await page.evaluate(({ scenario, state }) => {
        const game = window.validationGame;
        game.player.startRun('free', 'p220');
        for (const id of scenario.rounds) if (id !== 'ball') game.player.supplyAmmo(id);
        for (const id of Object.values(scenario.loadout ?? {})) { game.player.claimAttachment(id); game.player.equipAttachment(id); }
        game.zombie = window.makeEnemy(scenario.enemy); game.zombie.applyState(state);
        game.state.reset('AMMO_SELECTION'); game.ui.showEndState('', false); game.ui.setLocked(false);
        game.presentation.resetZombie(state.distance); game.busy = false; window.productionShots = []; game.sync();
      }, { scenario, state });
      for (const id of scenario.rounds) await page.locator(`[data-ammo="${id}"]`).click();
      if (scenario.id === 'early-kill-unused') await page.screenshot({ path: fileURLToPath(new URL(`consumption-${label}.png`, output)) });
      const expected = resolver.resolveSequence(scenario.rounds, state, { weaponId: 'p220', loadout: scenario.loadout });
      await page.locator('#load-button').click();
      await page.waitForFunction(() => !window.validationGame.busy && ['AMMO_SELECTION', 'GAME_OVER', 'VICTORY', 'ATTACHMENT_REWARD'].includes(window.validationGame.state.phase), null, { timeout: 30000 });
      const actual = await page.evaluate(() => ({ shots: window.productionShots, enemy: window.validationGame.zombie.snapshot(), player: window.validationGame.player.getCombatState(), phase: window.validationGame.state.phase }));
      assert.deepEqual(actual.shots.map(x => x.shot), expected.shots, `${label}/${scenario.id}: 실제 Game.fireRound와 계산기 동치`);
      for (const { shot, before, after } of actual.shots) if (shot.ammoType !== 'ball') assert.equal(before[shot.ammoType] - after[shot.ammoType], 1);
      if (!expected.killed) {
        const action = resolver.resolveEnemyAction(expected.finalState, p.createPlayerCombatState(), scenario.loadout);
        assert.deepEqual(actual.enemy, action.after, `${label}/${scenario.id}: 실제 적 행동 동치`);
        assert.deepEqual(actual.player, action.playerAfter);
      }
      results.push({ label, scenario, expected, actual });
    }
    await context.close();
    console.log(`${label}: 현행 Game 실제 입력 계산/반동/거리/상태/행동/소모/부착물/미발사 9개 동치`);
  }
  assert.deepEqual(errors, []);
  await writeFile(new URL('parity-results.json', output), JSON.stringify({ scenarios: results.length, errors, results }));
} finally { await browser.close(); }
