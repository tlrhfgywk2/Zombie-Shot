/* global window, document, innerWidth */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const base = process.env.VALIDATION_BASE || 'http://127.0.0.1:5178/Zombie-Shot/';
const output = new URL('../docs/validation/special-infected/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'msedge', args: ['--enable-unsafe-swiftshader'] });
const results = [];
try {
  for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['portrait', { width: 390, height: 844 }]]) {
    if (process.argv.includes('--portrait') && label !== 'portrait') continue;
    const context = await browser.newContext({ viewport, hasTouch: label === 'portrait', deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/src/main.ts', route => route.fulfill({ contentType: 'application/javascript', body: `
      import '${new URL('src/style.css', base).pathname}';
      import { Game } from '${new URL('src/core/Game.ts', base).pathname}';
      window.validationGame = new Game(document.querySelector('#app'));
    ` }));
    await page.goto(base);
    await page.locator('[data-choose-mode="free"]').click();
    await page.locator('[data-choose-weapon="p220"]').click();
    const reset = async (roster, equipment = []) => page.evaluate(async ({ roster, equipment }) => {
      const game = window.validationGame;
      game.returnToMenu(); game.chooseMode('free'); game.chooseWeapon('p220');
      const { Encounter } = await import('/Zombie-Shot/src/combat/Encounter.ts');
      game.encounter = new Encounter(roster);
      for (const id of equipment) { game.player.claimAttachment(id); game.player.equipAttachment(id); }
      game.presentation.setPlaybackSpeed(3);
      game.sync();
    }, { roster, equipment });
    const rounds = async values => page.evaluate(values => {
      const game = window.validationGame;
      game.player.magazine.clear();
      for (const ammo of values) {
        if (ammo !== 'ball') game.player.supplyAmmo(ammo);
        if (!game.player.addAmmo(ammo)) throw new Error('검증 탄창 준비 실패');
      }
      game.sync();
    }, values);
    const fire = async () => {
      await page.locator('#load-button').click();
      await page.waitForFunction(() => !window.validationGame.busy);
    };
    const audit = async name => {
      await page.waitForTimeout(220);
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        debug: Boolean(document.querySelector('.presentation-debug')),
        cards: [...document.querySelectorAll('.target-card, .enemy-card, .behavior-state, .mag-slot')]
          .filter(element => element.getBoundingClientRect().width && element.getBoundingClientRect().height)
          .map(element => { const r = element.getBoundingClientRect(); return { name: element.className, x: r.x, y: r.y,
            // 단독 적 카드는 화면 너비 툴팁을 소유한다. 실제 단계 표시와 수치 경계는 별도 검사한다.
            right: r.right, bottom: r.bottom, overflow: !element.matches('.enemy-card') && element.scrollWidth > element.clientWidth + 1 }; }),
        phases: [...document.querySelectorAll('[data-behavior-phase]')].filter(element => element.getBoundingClientRect().width).map(element => element.textContent),
        build: document.querySelector('.build-marker')?.textContent,
      }));
      await page.screenshot({ path: fileURLToPath(new URL(`${label}-${name}.png`, output)) });
      assert.equal(layout.overflow, false, `${label}/${name}: 화면 넘침`);
      assert.equal(layout.debug, false);
      assert.ok(layout.cards.every(card => !card.overflow && card.x >= 0 && card.right <= viewport.width + 1 && card.bottom <= viewport.height + 1), `${label}/${name}: ${JSON.stringify(layout.cards)}`);
      results.push({ label, name, ...layout });
    };

    await reset(['shieldCharger']);
    await audit('guard-empty');
    await rounds(['ball', 'ball', 'ball', 'ball']);
    await audit('guard-full');
    await fire();
    assert.equal(await page.evaluate(() => window.validationGame.zombie.snapshot().behavior.phase), 'recovery');
    await audit('guard-break');

    await reset(['shieldCharger']); await rounds(['ball']); await fire();
    await rounds(['plusP', 'plusP', 'kickback', 'ball']);
    await audit('windup-burst');
    await fire();
    assert.equal(await page.evaluate(() => window.validationGame.encounter.complete), true);

    await reset(['shieldCharger']); await rounds(['ball']); await fire();
    await rounds(['hammer']); await fire();
    await audit('shock-recovery');
    assert.equal(await page.evaluate(() => window.validationGame.zombie.snapshot().behavior.transition), 'shock');

    await reset(['shieldCharger']); await rounds(['ball']); await fire();
    await rounds(['retreat']); await fire();
    await audit('charge-retreat');
    assert.equal(await page.evaluate(() => window.validationGame.zombie.distance), 2.5);

    await reset(['frenzied']); await rounds(['plusP', 'plusP', 'kickback', 'ball']);
    await audit('frenzy-predicted-kill');
    assert.equal(await page.locator('.will-not-fire').count(), 1);
    await fire();
    assert.equal(await page.evaluate(() => window.validationGame.encounter.complete), true);

    await reset(['disruptor'], ['compensator', 'highCapacityMagazine']);
    await audit('disrupt-prepare'); await rounds(['ball']); await fire();
    await audit('disrupt-telegraph'); await rounds(['ball']); await fire();
    assert.equal(await page.evaluate(() => window.validationGame.player.getCombatState().disabledSlots.muzzle), 1);
    await audit('disrupt-active'); await rounds(['ball']); await fire();
    assert.equal(await page.evaluate(() => window.validationGame.player.getCombatState().disabledSlots.muzzle), undefined);
    await audit('disrupt-restored');

    await reset(['shieldCharger', 'disruptor'], ['highCapacityMagazine', 'laserLightModule']);
    await audit('pair-empty');
    await rounds(['retreatCutter', 'highExplosive', 'accelerant', 'mimic', 'mirror', 'finisher']);
    await page.evaluate(() => {
      const game = window.validationGame;
      const enemy = game.zombie.snapshot();
      game.zombie.applyState({ ...enemy, wound: 4, burn: 19, actionShock: 3, explosive: 12, vulnerableTurns: 2, ignitedActions: 1 });
      game.sync();
    });
    await audit('pair-full-long-status');
    await reset(['shieldCharger', 'disruptor']); await rounds(['ball']); await fire();
    await fire();
    assert.deepEqual(await page.evaluate(() => window.validationGame.encounter.living.map(enemy => enemy.zombie.snapshot().behavior.phase)), ['windup', 'prepare']);
    await audit('pair-independent');
    await page.evaluate(() => {
      const game = window.validationGame;
      for (const enemy of game.encounter.living) enemy.zombie.applyState({ ...enemy.zombie.snapshot(), distance: .5, telegraphedAction: 'attack' });
      game.sync();
    });
    await audit('pair-lethal');
    assert.deepEqual(errors, []);
    await context.close();
  }
  await writeFile(new URL('browser.json', output), JSON.stringify(results, null, 2) + '\n');
  console.log(`데스크톱·세로 화면 ${results.length}개 상태와 실제 사격·중단·후퇴·교란 복원 검증 완료`);
} finally { await browser.close(); }
