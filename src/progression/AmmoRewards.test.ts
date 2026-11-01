import { describe, expect, it } from 'vitest';
import { generateAmmoRewards } from './AmmoRewards';
import { ammoSynergyScores, analyzeAmmoSynergies } from './AmmoSynergy';
import { AMMO_DEFINITIONS, createAmmoBuild, type SpecialAmmoType } from '../data/ammoDefinitions';
import { EXPLORATION_REWARD_POOL, ExplorationRun, seededRandom, merchantOffers } from '../exploration/ExplorationRun';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import type { AmmoType } from '../combat/types';

describe('소유 탄약의 실질 연결', () => {
  const scores = (inventory: NonNullable<Parameters<typeof createAmmoBuild>[0]>, capacity = 4) => ammoSynergyScores({ inventory, magazineCapacity: capacity }, ['wounding', 'laceration', 'retreatCutter', 'hollowPoint', 'explosive', 'flatNose', 'incendiary', 'ignition', 'plusP', 'kickback']);
  it('절개 1발은 미완성이며 2발과 후속 표준탄이 있어야 취약을 활용한다', () => {
    expect(analyzeAmmoSynergies({ inventory: { wounding: 1 }, magazineCapacity: 4 })[0]?.progress).toBe(.5);
    expect(scores({ wounding: 1 }).get('wounding')).toBeGreaterThan(scores({ wounding: 1 }).get('laceration')!);
    expect(scores({ wounding: 1 }).get('retreatCutter')).toBeGreaterThan(0);
    expect(scores({ wounding: 1 }).get('hollowPoint')).toBe(0);
    expect(scores({ wounding: 1 }, 2).get('wounding')).toBe(0);
    expect(scores({ wounding: 2 }).get('wounding')).toBe(0);
    expect(scores({ wounding: 2 }).get('laceration')).toBeGreaterThan(0);
  });
  it('발동 수단이 없는 같은 계열이나 비어 있는 재고에 보정을 만들지 않는다', () => {
    expect([...scores({}).values()].every(value => value === 0)).toBe(true);
    expect(scores({ laceration: 1 }).get('hollowPoint')).toBe(0);
    expect([...scores({ wounding: 1 }, 0).values()].every(value => value === 0)).toBe(true);
  });
  it('폭발·열·반동 연결을 양방향으로 발견한다', () => {
    expect(scores({ explosive: 1 }).get('flatNose')).toBeGreaterThan(0);
    expect(scores({ flatNose: 1 }).get('explosive')).toBeGreaterThan(0);
    expect(scores({ incendiary: 1 }).get('ignition')).toBeGreaterThan(0);
    expect(scores({ ignition: 1 }).get('incendiary')).toBeGreaterThan(0);
    expect(scores({ plusP: 1 }).get('kickback')).toBeGreaterThan(0);
  });
  it('대표 연결은 실제 전투 계산에서도 발동하며 절개 1발은 취약을 만들지 못한다', () => {
    const enemy = { ...createEnemyState('normal'), hp: 1000, maxHp: 1000, distance: 3 };
    const resolver = new CombatResolver();
    const fire = (rounds: AmmoType[]) => resolver.resolveSequence(rounds, enemy, { weaponId: 'p220' });
    expect(fire(['wounding', 'ball']).shots.some(shot => shot.vulnerableTriggered)).toBe(false);
    expect(fire(['wounding', 'wounding', 'ball']).shots.at(-1)!.breakdown.vulnerableDamageBonus).toBeGreaterThan(0);
    expect(fire(['explosive', 'flatNose']).shots.at(-1)!.explosionDamage).toBeGreaterThan(0);
    expect(fire(['incendiary', 'ignition']).shots.at(-1)!.breakdown.burnScaleBonus).toBeGreaterThan(0);
    expect(fire(['plusP', 'kickback']).shots.at(-1)!.breakdown.conditionalBonus).toBeGreaterThan(0);
    expect(fire(['relay', 'advance']).shots.at(-1)!.breakdown.followUpBonus).toBeGreaterThan(0);
  });
});

describe('약한 가중 추첨', () => {
  it('기존 무소유 호출은 기존 등급·탄종 난수 순서를 보존한다', () => {
    const rolls = [0, 0, .9, 0, 0, 0];
    const rewards = generateAmmoRewards(() => rolls.shift()!);
    expect(rewards).toHaveLength(3);
    expect(rewards.map(id => AMMO_DEFINITIONS[id].rarity)).toEqual(['common', 'uncommon', 'common']);
  });
  it('후보·중복·빈 풀·축소된 풀과 비정상 난수 경계를 처리한다', () => {
    for (const roll of [0, 1, -1, NaN, Infinity]) {
      expect(generateAmmoRewards(() => roll, { pool: ['wounding', 'wounding', 'laceration'], choices: 9 })).toHaveLength(2);
    }
    expect(generateAmmoRewards(() => 0, { pool: [] })).toEqual([]);
    expect(generateAmmoRewards(() => 0, { choices: 0 })).toEqual([]);
  });
  it('재현 가능하며 모든 선택지를 남기고 등급 추첨은 보정하지 않는다', () => {
    const options = { context: { inventory: { wounding: 1 }, magazineCapacity: 4 }, guidance: { chance: 1, strength: 9 } };
    expect(generateAmmoRewards(seededRandom('고정'), options)).toEqual(generateAmmoRewards(seededRandom('고정'), options));
    const seen = new Set<SpecialAmmoType>();
    for (let i = 0; i < 300; i++) {
      const rewards = generateAmmoRewards(seededRandom(String(i)), options);
      expect(new Set(rewards).size).toBe(3); rewards.forEach(id => seen.add(id));
    }
    expect(seen.size).toBe(Object.keys(AMMO_DEFINITIONS).length - 1);
    const common = generateAmmoRewards(() => 0, options);
    expect(common.every(id => AMMO_DEFINITIONS[id].rarity === 'common')).toBe(true);
  });
  it('보정을 끄면 동일 조건의 원래 균등 추첨으로 돌아간다', () => {
    const context = { inventory: { wounding: 1 }, magazineCapacity: 4 };
    expect(generateAmmoRewards(seededRandom('끄기'), { context, guidance: { chance: 0, strength: 99 } }))
      .toEqual(generateAmmoRewards(seededRandom('끄기')));
  });
  it('같은 추첨값에서 연결 탄의 상대 가중치를 높이고 무관한 재고는 원래 추첨으로 처리한다', () => {
    const options = { context: { inventory: { wounding: 1 }, magazineCapacity: 4 }, pool: ['wounding', 'laceration'] as const, choices: 1, rarityFirst: false };
    const rolls = [0, 0, .6];
    expect(generateAmmoRewards(() => rolls.shift()!, { ...options, guidance: { chance: 1, strength: 3 } })).toEqual(['wounding']);
    expect(generateAmmoRewards(() => .6, { ...options, guidance: { chance: 0, strength: 3 } })).toEqual(['laceration']);
    expect(generateAmmoRewards(seededRandom('빈 재고'), { context: { inventory: {}, magazineCapacity: 4 } }))
      .toEqual(generateAmmoRewards(seededRandom('빈 재고')));
  });
});

describe('탐험 보상 스냅샷', () => {
  it('처치 이후에만 2개를 고정하고 소유량·재렌더링으로 재추첨하지 않는다', () => {
    const run = new ExplorationRun('보상'); run.enter(0);
    const context = { inventory: createAmmoBuild({ wounding: 1 }), magazineCapacity: 4 };
    expect(run.combatRewards(context)).toEqual([]);
    run.settleCombat(); const rewards = run.combatRewards(context);
    expect(rewards).toHaveLength(2);
    expect(rewards.every(id => EXPLORATION_REWARD_POOL.includes(id))).toBe(true);
    expect(run.combatRewards({ inventory: {}, magazineCapacity: 6 })).toBe(rewards);
    const replay = new ExplorationRun('보상'); replay.enter(0); replay.settleCombat();
    expect(replay.combatRewards(context)).toEqual(rewards);
  });
  it('상점·경로 생성은 소유 탄약 보정과 독립이다', () => {
    const run = new ExplorationRun('상점'); const before = structuredClone(run.layers);
    run.enter(0); run.settleCombat(); run.combatRewards({ inventory: { wounding: 1 }, magazineCapacity: 4 });
    expect(run.layers).toEqual(before);
    const shop = merchantOffers(run.layers[3]![0]!);
    expect(shop.find(offer => offer.id === 'ammo')).toMatchObject({ price: 1, amount: 3, ammo: before[3]![0]!.rewards[0] });
  });
  it('회피한 전투에는 보상을 만들지 않는다', () => {
    const run = new ExplorationRun('회피 보상'); run.enter(0); run.awareness = 3;
    expect(run.settleCombat(true)).toBe(true);
    expect(run.combatRewards({ inventory: { wounding: 1 }, magazineCapacity: 4 })).toEqual([]);
  });
});
