/* global URL */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { production, rng } from './common.mjs';
import { AMMO, createModel, acquired, rewardTape, initialRun, capacity, combat, total, optimizeOrder } from './model.mjs';
const p = await production();
const configs = JSON.parse(await readFile(new URL('./candidates.json', import.meta.url)));
const config = configs.v6, model = createModel(p, config);
const run = (ranks = {}, loadout = {}, weapon = 'p220') => ({ ...initialRun('wound', weapon), ranks, loadout });
const enemy = overrides => ({ ...p.createEnemyState('normal'), hp: 10000, maxHp: 10000, distance: 3, ...overrides });

test('unchanged ball, recoil, range and weapon traits match the production resolver', () => {
  const resolver = new p.CombatResolver(() => .5);
  for (const weapon of Object.keys(p.WEAPON_DEFINITIONS)) for (const distance of [.5, 3, 6, 10]) {
    const target = enemy({ distance });
    for (const rounds of [['ball', 'ball', 'ball', 'ball'], ['plusP', 'lowRecoil', 'ball', 'ball']]) {
      // Rank-zero +P and recoil recovery retain production's values.
      const actual = model.resolve(rounds, target, run({}, {}, weapon));
      const baseline = resolver.resolveSequence(rounds, target, { weaponId: weapon });
      assert.equal(actual.damage, baseline.totalHpDamage, `${weapon}/${distance}/${rounds}`);
    }
  }
});
test('wound threshold affects subsequent shots, expires once per enemy action', () => {
  const result = model.resolve(['wounding', 'wounding', 'ball'], enemy(), run(), { trace: true });
  assert.equal(result.trace[0].after.wound, 3);
  assert.equal(result.trace[1].after.wound, 0);
  assert.equal(result.trace[1].vulnerableFactor, 1);
  assert.equal(result.trace[2].power, 8);
  assert.equal(model.action(result.after).after.vulnerableTurns, 1);
});
test('laceration secondary wound cannot be copied as a primary effect', () => {
  const result = model.resolve(['laceration', 'mimic'], enemy(), run(), { trace: true });
  assert.equal(result.trace[0].raw.wound, 2);
  assert.equal(result.trace[1].raw.wound, 0);
  assert.equal(result.after.wound, 2);
});
test('thermal build conserves heat and consumes it only once, with range loss', () => {
  const result = model.resolve(['accelerant', 'incendiary', 'ignition', 'mimic'], enemy({ distance: 6 }), run(), { trace: true });
  assert.equal(result.trace[1].raw.heat, 16);
  assert.equal(result.trace[2].heatConsumed, 18);
  assert.equal(result.trace[2].thermal, 36);
  assert.equal(result.trace[3].thermal, 0);
  assert.equal(result.after.burn, 0);
  assert.equal(result.trace[2].rangePercent, 10);
});
test('banked heat cannot create free repeated ignition from standard rounds', () => {
  const result = model.resolve(['ball'], enemy({ burn: 25, ignitedActions: 0 }), run());
  assert.equal(result.after.ignitedActions, 0);
});
test('thermal-wound hybrid ablation preserves direct power and removes only cross-trigger', () => {
  const rounds = ['wounding', 'incendiary', 'cauterize'];
  const normal = model.resolve(rounds, enemy(), run(), { trace: true });
  const ablated = model.resolve(rounds, enemy(), run(), { trace: true, ablate: true });
  assert.equal(normal.trace[2].thermal, 24);
  assert.equal(ablated.trace[2].thermal, 0);
  assert.equal(normal.trace[2].direct, ablated.trace[2].direct);
  assert.equal(ablated.after.burn, 8);
});
test('concussion converts banked control into one bounded charge burst', () => {
  const result = model.resolve(['flatNose', 'stickyCharge', 'resonance'], enemy(), run(), { trace: true });
  assert.equal(result.trace[2].shockConsumed, 4);
  assert.equal(result.trace[2].chargeConsumed, 8);
  assert.equal(result.trace[2].explosion, 8 * config.explosionFactor);
  assert.equal(result.after.actionShock, 2);
});
test('explosion ignores recoil, range, and vulnerable; only new impact detonates', () => {
  const near = model.resolve(['stickyCharge', 'flatNose'], enemy({ vulnerableTurns: 2 }), run(), { trace: true });
  const far = model.resolve(['stickyCharge', 'flatNose'], enemy({ distance: 10 }), run(), { trace: true });
  assert.equal(near.trace[1].explosion, 4 * config.explosionFactor);
  assert.equal(far.trace[1].explosion, 4 * config.explosionFactor);
  const banked = model.resolve(['stickyCharge', 'ball'], enemy({ actionShock: 50 }), run());
  assert.equal(banked.after.explosive, 4);
});
test('kickback consumes actual accumulated recoil and cannot repeat consumption via mimic', () => {
  const result = model.resolve(['plusP', 'plusP', 'kickback', 'mimic'], enemy(), run(), { trace: true });
  assert.equal(result.trace[2].converted, 12);
  assert.equal(result.trace[2].recoil, 0);
  assert.equal(result.trace[3].converted, 0);
  assert.equal(result.trace[3].raw.power, 14);
});
test('relay is consumed by next round and never amplifies another relay rule', () => {
  const result = model.resolve(['relay', 'relay', 'ball', 'ball'], enemy(), run(), { trace: true });
  assert.deepEqual(result.trace.map(x => x.raw.power), [2, 6, 9, 5]);
});
test('laser has an explicit useful vulnerable interaction after redundant ammo removal', () => {
  const noLaser = model.resolve(['ball'], enemy({ vulnerableTurns: 2 }), run());
  const laser = model.resolve(['ball'], enemy({ vulnerableTurns: 2 }), run({}, { rail: 'laserSight' }));
  assert.equal(noLaser.damage, 8);
  assert.equal(laser.damage, 11);
});
test('kill stops firing and does not spend later inventory', () => {
  const result = model.resolve(['ball', 'plusP', 'mimic'], enemy({ hp: 1 }), run());
  assert.equal(result.fired, 1);
  assert.equal(result.damage, 1);
  assert.equal(result.special, 0);
});
test('turn, magazine and inventory boundaries do not generate free resources', () => {
  const state = acquired(11005, 18, 'recoil', config, p);
  assert.ok(total(state.stock) <= 14);
  assert.ok(state.upgrades <= 5);
  const copy = JSON.stringify(state);
  const result = combat(state.stock, state, enemy({ hp: 1000000 }), model, p, 'search', rng(20));
  assert.ok(result.specialFired <= total(state.stock));
  assert.ok(result.turns <= 12);
  assert.equal(JSON.stringify(state), copy);
  const fresh = model.resolve(['kickback'], enemy(), run(), { trace: true });
  assert.equal(fresh.trace[0].converted, 0);
});
test('reward tape is deterministic, policy-independent, finite and does not alter encounter seeds', () => {
  const a = rewardTape(11005, p, config), b = rewardTape(11005, p, config), old = rewardTape(11005, p, configs.v1);
  assert.deepEqual(a, b);
  assert.equal(new Set(a[0].offers).size, 3);
  assert.deepEqual(a.map(x => [x.enemy, x.distance]), old.map(x => [x.enemy, x.distance]));
  assert.ok(a.every(x => x.offers.every(id => Object.hasOwn(AMMO, id))));
});
test('attachment compatibility, slot exclusions, and contaminated capacity apply', () => {
  assert.equal(capacity(run({}, { magazine: 'highCapacityMagazine' }), p), 6);
  const player = p.createPlayerCombatState(); player.disabledSlots.magazine = 2;
  assert.equal(capacity(run({}, { magazine: 'highCapacityMagazine' }), p, player), 4);
  assert.equal(capacity(run({}, {}, 'm500'), p), 4);
  assert.ok(!p.ATTACHMENT_DEFINITIONS.highCapacityMagazine.compatibleWeapons.includes('m500'));
});
test('firing order uses a real permutation and changes a staged burst', () => {
  const rounds = ['ignition', 'accelerant', 'incendiary', 'ball'];
  const best = optimizeOrder(rounds, x => model.resolve(x, enemy(), run()).damage);
  assert.deepEqual([...best].sort(), [...rounds].sort());
  assert.ok(model.resolve(best, enemy(), run()).damage > model.resolve(rounds, enemy(), run()).damage * 1.25);
});
test('instant melee death, interrupted attack, and special enemy actions are preserved', () => {
  const melee = enemy({ distance: .5 });
  assert.equal(model.action(melee).playerKilled, true);
  assert.equal(model.action({ ...melee, actionShock: 8 }).playerKilled, false);
  assert.equal(model.action({ ...melee, actionShock: 8 }).after.actionShock, 0);
  const ground = { ...p.createEnemyState('groundshaker'), distance: 4 };
  const action = model.action(ground);
  assert.equal(action.playerAfter.heavyKickPenaltyTurns, 2);
});
