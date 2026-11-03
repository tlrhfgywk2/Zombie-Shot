import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, writeFile } from 'node:fs/promises';
import { production, root } from './runtime.mjs';
import * as original from '../../simulation/model.mjs';
import * as portable from '../../experiments/level-v7/model-portable.mjs';
import { createModel as createAblated } from '../../experiments/level-v7/model-ablation.mjs';
import { LevelSession, observe, chooseRounds } from '../../experiments/level-v7/engine.mjs';
import { rng } from '../../experiments/level-v7/random.mjs';
import { DEFAULT_SETTINGS } from '../../experiments/level-v7/design.mjs';
const p = await production(), config = JSON.parse(await readFile(new URL('experiments/level-v7/v7-config.json', root)));
const model = portable.createModel(p, config), reference = original.createModel(p, config), ablation = createAblated(p, config);
const target = patch => ({ ...p.createEnemyState('groundshaker'), hp: 1000, maxHp: 1000, distance: 6, ...patch });

test('브라우저 이식은 원본 가져오기 경로만 바꾸며 원본 v7과 완전히 동치', async () => {
  const originalSource = (await readFile(new URL('simulation/model.mjs', root), 'utf8')).replace(/\r\n/g, '\n');
  const portableSource = (await readFile(new URL('experiments/level-v7/model-portable.mjs', root), 'utf8')).replace(/\r\n/g, '\n').split('\n').slice(1).join('\n');
  assert.equal(portableSource, originalSource.replace("'./common.mjs'", "'./random.mjs'"));
  let cases = 0;
  for (const weapon of Object.keys(p.WEAPON_DEFINITIONS)) for (const distance of [.5, 1, 3, 4, 6, 8, 10]) for (const build of Object.keys(original.ARCHETYPES)) {
    const run = original.acquired(21001, 9, build, config, p); run.weapon = weapon;
    const rounds = original.heuristicOrder(original.expand(run.stock).slice(0, 4));
    const options = { trace: true, player: { ...p.createPlayerCombatState(), rangePenaltySteps: 1, heavyKickPenaltyBonus: 1 } };
    assert.deepEqual(model.resolve(rounds, target({ distance }), run, options), reference.resolve(rounds, target({ distance }), run, options));
    cases++;
  }
  assert.equal(cases, 168);
});
test('연속 적 사이 재보급과 플레이어 방해 상태 초기화가 발생하지 않음', () => {
  const s = new LevelSession(p, model, config, 21001, 'heat');
  s.node = { kind: 'combat', waves: [{ enemy: 'normal', distance: 3 }, { enemy: 'groundshaker', distance: 3 }], offers: [] };
  s.run.stock = { plusP: 2 }; s.available = { plusP: 2 }; s.wave = 0; s.turn = 1; s.spawn(); s.enemy.hp = 1;
  s.player.rangePenaltySteps = 1; s.player.rangePenaltyTurns = 2;
  s.fire(['plusP', 'plusP']);
  assert.equal(s.wave, 1); assert.equal(s.available.plusP, 1); assert.equal(s.player.rangePenaltyTurns, 2);
  assert.equal(s.logs[0].unused.length, 1);
  s.phase = 'advance'; s.plan = [{ kind: 'combat', waves: [{ enemy: 'normal', distance: 8 }], offers: [] }]; s.depth = 0;
  s.advance(); assert.equal(s.available.plusP, 2); assert.equal(s.player.rangePenaltySteps, 0);
});
test('미래 보상·적·시드 변경이 숙련 정책의 관측과 결정에 들어가지 않음', () => {
  const s = new LevelSession(p, model, config, 21001, 'heat'); s.advance();
  const before = observe(s), rounds = chooseRounds(before, 'competent', model, p, rng(2));
  s.plan = [{ kind: 'combat', waves: [{ enemy: 'fast' }] }]; s.seed = 99999;
  assert.deepEqual(observe(s), before);
  assert.deepEqual(chooseRounds(observe(s), 'competent', model, p, rng(2)), rounds);
  assert.deepEqual(Object.keys(before).sort(), ['archetype', 'enemy', 'loadout', 'owned', 'player', 'ranks', 'stock', 'weapon']);
});
test('부족한 특수탄과 부착물 호환 용량을 검증하며 8발은 제공하지 않음', () => {
  const s = new LevelSession(p, model, config, 21001, 'heat'); s.advance();
  assert.throws(() => s.fire(['ignition']), /탄약 부족/);
  assert.throws(() => s.fire(Array(8).fill('ball')), /발사 불가/);
  s.run.loadout.magazine = 'highCapacityMagazine';
  assert.equal(portable.capacity(s.run, p, s.player), 6);
  s.player.disabledSlots.magazine = 2; assert.equal(portable.capacity(s.run, p, s.player), 4);
});
test('후반 추가 배분은 보유 탄종 하나만 한 번 획득하고 휴대 한도를 보존', () => {
  const s = new LevelSession(p, model, config, 21001, 'recoil', 'nine-linked', { ...DEFAULT_SETTINGS, reinforcement: 1 });
  s.phase = 'workshop'; s.depth = 4; s.run.stock = { plusP: 2, kickback: 1 };
  assert.equal(s.reinforce('plusP'), false);
  s.depth = 7; assert.equal(s.reinforce('ignition'), false);
  assert.equal(s.reinforce('plusP'), true); assert.equal(s.run.stock.plusP, 3);
  assert.equal(s.reinforce('plusP'), false); assert.equal(s.run.stock.plusP, 3);
  const full = new LevelSession(p, model, config, 21001, 'recoil', 'nine-linked', { ...DEFAULT_SETTINGS, reinforcement: 1 });
  full.phase = 'workshop'; full.depth = 7; full.run.stock = { plusP: 14 };
  assert.equal(full.reinforce('plusP'), false);
});
test('반사실에서 지정 교차 효과만 제거하고 다른 빌드는 그대로 계산', () => {
  const run = { ...portable.initialRun('cauterize'), ranks: { cauterize: 2 } }, enemy = target({ wound: 3, burn: 8 });
  const actual = model.resolve(['cauterize'], enemy, run, { trace: true });
  const without = ablation.resolve(['cauterize'], enemy, run, { trace: true, ablateEngine: 'cauterize' });
  assert.equal(actual.trace[0].direct, without.trace[0].direct); assert.ok(actual.damage > without.damage);
  assert.deepEqual(ablation.resolve(['cauterize'], enemy, run, { trace: true, ablateEngine: 'recoil' }), actual);
});
test('적 원래 HP/이동/저항과 v7 탄약 계수를 실험 설정에서 변경하지 않음', () => {
  for (let seed = 21001; seed < 21081; seed++) {
    const s = new LevelSession(p, model, config, seed, 'heat', 'nine-linked', DEFAULT_SETTINGS);
    for (const node of s.plan) for (const wave of node.waves ?? []) {
      const actual = p.createEnemyState(wave.enemy), base = p.ENEMY_DEFINITIONS[wave.enemy];
      assert.equal(actual.hp, base.hp); assert.equal(actual.shockResistance, base.shockResistance); assert.equal(actual.advancePerTurn, base.advancePerTurn);
    }
  }
  assert.deepEqual(portable.AMMO, original.AMMO);
});

// 실게임과 v7이 유지한다고 명시한 제어 규칙의 동치와 발견된 경계 차이를 함께 저장한다.
const resolver = new p.CombatResolver(() => .5), parity = [], mismatches = [];
for (const weapon of Object.keys(p.WEAPON_DEFINITIONS)) for (const distance of [.5, 1, 3, 4, 6, 8, 10]) {
  const enemy = target({ distance }), run = { ...portable.initialRun('recoil', weapon), loadout: { muzzle: 'muzzleBrake', optic: 'reflexSight', rail: 'tacticalLight' } };
  for (const rounds of [['ball', 'ball', 'ball', 'ball'], ['plusP', 'lowRecoil', 'ball', 'ball'], ['advance', 'retreat', 'ball', 'ball']]) {
    const actual = model.resolve(rounds, enemy, run), productionResult = resolver.resolveSequence(rounds, enemy, { weaponId: weapon, loadout: run.loadout });
    const match = actual.damage === productionResult.totalHpDamage && actual.after.distance === productionResult.finalState.distance;
    parity.push({ weapon, distance, rounds, match });
    assert.ok(match, JSON.stringify(parity.at(-1)));
  }
}
for (const distance of [1 - 1e-12, 4 - 1e-12, 8 - 1e-12]) {
  const enemy = target({ distance }), run = portable.initialRun('recoil');
  const candidate = model.resolve(['ball'], enemy, run, { trace: true }), actual = resolver.resolveSequence(['ball'], enemy);
  if (candidate.damage !== actual.totalHpDamage) mismatches.push({ kind: '수치 경계 모델 불일치', distance, v7: candidate.damage, production: actual.totalHpDamage, reason: '실게임은 거리 비교를 1e-9로 정규화하지만 v7은 원시 부동소수점 비교. 원본 수정하지 않음.' });
}
await writeFile(new URL('experiments/level-v7/results/consistency.json', root), JSON.stringify({ unchangedCases: parity.length, matched: parity.filter(r => r.match).length, mismatches,
  intendedDifferences: ['평두 직접 화력 1→4', '열 저장/소비', '폭약 배율 3→4', '반동 회수 계수/상한', '열상 상처와 제작 등급', '소작 신규', '공명 충격 투자', '취약 레이저 연결'], cases: parity }, null, 2));
