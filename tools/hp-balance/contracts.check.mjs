import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { production, root } from './runtime.mjs';
import { combat, choose, productionModel } from './combat.mjs';
import { createModel, initialRun } from '../../simulation/model.mjs';
import { observe, LevelSession } from '../../experiments/level-v7/engine.mjs';
import { rng } from '../../simulation/common.mjs';
const p = await production(), config = JSON.parse(await readFile(new URL('simulation/candidates.json', root))).v7;
test('v7 브라우저 계산은 기존 탄약 계약을 그대로 보존', async () => {
  const source = (await readFile(new URL('simulation/model.mjs', root), 'utf8')).replace(/\r\n/g, '\n');
  const copy = (await readFile(new URL('experiments/level-v7/model-portable.mjs', root), 'utf8')).replace(/\r\n/g, '\n').split('\n').slice(1).join('\n');
  assert.equal(copy, source.replace("'./common.mjs'", "'./random.mjs'"));
  assert.deepEqual(config, JSON.parse(await readFile(new URL('experiments/level-v7/v7-config.json', root))));
});
test('실제 HP 후보와 실행 함수는 깊이/후속 경비를 포함해 동일', async () => {
  const selected = JSON.parse(await readFile(new URL('tools/hp-balance/candidates/hp5.json', root)));
  assert.deepEqual(p.ENEMY_HP_CURVES, selected);
  for (const profile of ['exploration', 'v7']) for (const type of Object.keys(p.ENEMY_DEFINITIONS)) for (const depth of [1, 2, 3, 5, 6, 7, 8]) for (const reserve of [false, true]) {
    const expected = reserve && depth >= 8 && selected[profile].reserveHp?.[type] || p.interpolateEnemyHp(type, depth, selected[profile]);
    assert.equal(p.createProgressionEnemyState(type, depth, profile, reserve).hp, expected);
  }
});
test('숙련 정책의 관측에 다음 적/보상/시드가 포함되지 않음', () => {
  const model = createModel(p, config), s = new LevelSession(p, model, config, 5110001, 'heat'); s.advance();
  const visible = observe(s), selected = choose(visible, 'competent', model, p, rng(1));
  s.plan = []; s.seed = 99999999;
  assert.deepEqual(observe(s), visible); assert.deepEqual(choose(observe(s), 'competent', model, p, rng(1)), selected);
  assert.deepEqual(Object.keys(visible).sort(), ['archetype', 'enemy', 'loadout', 'owned', 'player', 'ranks', 'stock', 'weapon']);
});
test('재고0·미발사·새 탄창에서 무료 특수탄이 만들어지지 않음', () => {
  const model = createModel(p, config), inventory = { ...initialRun('heat'), stock: {} };
  for (const strategy of ['heuristic', 'competent', 'search']) {
    const enemy = { ...p.createEnemyState('normal'), hp: 1 };
    assert.deepEqual(choose({ ...inventory, enemy, player: p.createPlayerCombatState() }, strategy, model, p), ['ball', 'ball', 'ball', 'ball']);
    const result = combat(inventory, enemy, model, p, strategy, 1);
    assert.equal(result.shots, 1); assert.equal(result.special, 0);
  }
});
test('현행 계산기 래퍼의 피해/거리/소모/조기 사망이 실제 계산기와 일치', () => {
  const resolver = new p.CombatResolver(() => .5), model = productionModel(p), run = { ...initialRun('wound'), ranks: {} };
  for (const distance of [.5, 1, 3, 4, 6, 8, 10]) for (const rounds of [['ball', 'ball', 'ball', 'ball'], ['wounding', 'wounding', 'laceration', 'ball'], ['retreat', 'flatNose', 'ball', 'ball']]) {
    const enemy = { ...p.createProgressionEnemyState('groundshaker', 8), distance };
    const actual = resolver.resolveSequence(rounds, enemy), result = model.resolve(rounds, enemy, run);
    assert.equal(result.damage, actual.totalHpDamage); assert.equal(result.potential, actual.firepowerBreakdown.finalFirepower);
    assert.deepEqual(result.after, actual.finalState); assert.deepEqual(result.rounds, actual.shots.map(s => s.ammoType));
  }
});
