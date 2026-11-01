import { describe, expect, it } from 'vitest';
import { Encounter } from './Encounter';
import { CombatResolver, previewEnemyAction } from './CombatResolver';
import { commitMagazine } from './AmmoRules';
import { createEnemyState } from '../data/enemyDefinitions';
import { AMMO_ORDER } from '../data/ammoDefinitions';
import type { AmmoType } from './types';

const resolver = new CombatResolver(() => 0);
describe('동시 조우와 탄창 연계', () => {
  it('적마다 독립 상태를 만들고 최대 두 마리만 활성화한다', () => {
    expect(() => new Encounter([])).toThrow();
    expect(() => new Encounter(['normal', 'normal', 'normal'])).toThrow();
    const encounter = new Encounter(['normal', 'normal'], ['fast', 'tough']);
    expect(encounter.total).toBe(4);
    expect(encounter.living).toHaveLength(2);
    expect(encounter.living[0]!.id).not.toBe(encounter.living[1]!.id);
    const first = encounter.living[0]!;
    const second = encounter.living[1]!;
    const untouched = second.zombie.snapshot();
    const shot = resolver.resolveShot('wounding', 0, first.zombie.snapshot());
    encounter.applyShot(first.id, shot);
    expect(first.zombie.wound).toBeGreaterThan(0);
    expect(second.zombie.snapshot()).toEqual(untouched);
  });

  it.each(['wounding', 'flatNose', 'incendiary', 'explosive', 'deepCut', 'ignition'] as const)('%s의 누적·지속시간·피해가 다른 적에게 전파되지 않는다', ammo => {
    const encounter = new Encounter(['tough', 'brute']);
    const [first, second] = encounter.living;
    first!.zombie.applyState({ ...first!.zombie.snapshot(), wound: 4, burn: 27 });
    const before = second!.zombie.snapshot();
    encounter.applyShot(first!.id, resolver.resolveShot(ammo, 0, first!.zombie.snapshot()));
    expect(second!.zombie.snapshot()).toEqual(before);
  });

  it('플레이어 이동은 모든 적에게 각자 경계를 적용한다', () => {
    const encounter = new Encounter(['normal', 'fast']);
    const [first, second] = encounter.living;
    first!.zombie.applyState({ ...first!.zombie.snapshot(), distance: 12 });
    second!.zombie.applyState({ ...second!.zombie.snapshot(), distance: 3 });
    encounter.applyShot(first!.id, resolver.resolveShot('retreat', 0, first!.zombie.snapshot()));
    expect(first!.zombie.distance).toBe(12);
    expect(second!.zombie.distance).toBe(5);
    first!.zombie.applyState({ ...first!.zombie.snapshot(), distance: .5 });
    encounter.applyShot(first!.id, resolver.resolveShot('advance', 0, first!.zombie.snapshot()));
    expect(first!.zombie.distance).toBe(0);
    expect(second!.zombie.distance).toBe(3);
  });

  it('빠른 적과 튼튼한 적은 속도가 다르며 두 특수 적은 서로 다른 의도를 예고한다', () => {
    const pair = new Encounter(['fast', 'tough']);
    expect(pair.living[0]!.zombie.snapshot().advancePerTurn).toBeGreaterThan(pair.living[1]!.zombie.snapshot().advancePerTurn);
    const special = new Encounter(['contaminator', 'screecher']);
    special.announceActions();
    expect(special.living.map(enemy => previewEnemyAction(enemy.zombie.snapshot()).selectedAction)).toEqual(['contaminate', 'sonicPulse']);
  });

  it('처치한 차선에만 증원하며 표적을 자동 선택하고 마지막 적까지 조우를 유지한다', () => {
    const encounter = new Encounter(['normal', 'normal'], ['fast', 'tough']);
    const killed = encounter.selected;
    killed.zombie.applyState({ ...killed.zombie.snapshot(), hp: 0 });
    const arrivals = encounter.settleDeaths();
    expect(arrivals).toHaveLength(1);
    expect(arrivals[0]!.lane).toBe(killed.lane);
    expect(encounter.selected.zombie.isDead).toBe(false);
    expect(encounter.select(killed.id)).toBe(false);
    expect(encounter.complete).toBe(false);
    while (!encounter.complete) {
      for (const enemy of encounter.living) enemy.zombie.applyState({ ...enemy.zombie.snapshot(), hp: 0 });
      encounter.settleDeaths();
      expect(encounter.living.length).toBeLessThanOrEqual(2);
    }
    expect(encounter.defeated).toBe(4);
  });

  it('중단한 행동도 한 기회만 소비하고 차례가 교대한다', () => {
    const encounter = new Encounter(['normal', 'normal']);
    const [first, second] = encounter.living;
    first!.zombie.applyState({ ...first!.zombie.snapshot(), actionShock: 4 });
    const action = resolver.resolveEnemyAction(first!.zombie.snapshot());
    expect(action.interrupted).toBe(true);
    first!.zombie.applyState(action.after);
    encounter.finishOpportunity(first!.id);
    expect(encounter.nextActorId).toBe(second!.id);
    expect(second!.zombie.distance).toBe(8);
    encounter.finishOpportunity(second!.id);
    expect(encounter.nextActorId).toBe(first!.id);
  });

  it.each(AMMO_ORDER)('%s를 포함한 탄창을 한 발씩 계산해도 기존 연속 계산과 동일하다', ammo => {
    const enemy = { ...createEnemyState('tough'), hp: 10000, maxHp: 10000, distance: 7 };
    const rounds: AmmoType[] = ['relay', ammo, 'mimic', 'mirror'];
    const context = { weaponId: 'm1911' as const };
    const sequence = resolver.resolveSequence(rounds, enemy, context);
    const volley = resolver.createVolley(commitMagazine(rounds, 4));
    let current = enemy;
    for (const expected of sequence.shots) {
      const remaining = rounds.slice(volley.index);
      const preview = resolver.resolveSequence(remaining, current, context, volley);
      const before = structuredClone(volley);
      const shot = resolver.resolveVolleyShot(volley, current, context);
      expect(shot).toEqual(expected);
      expect(preview.shots[0]).toEqual(shot);
      expect(before.index + 1).toBe(volley.index);
      current = shot.after;
    }
  });

  it('재조준 후에도 직전 탄의 연계와 플레이어 반동은 유지한다', () => {
    const encounter = new Encounter(['normal', 'normal']);
    const first = encounter.selected;
    const second = encounter.living[1]!;
    const volley = resolver.createVolley(commitMagazine(['relay', 'plusP', 'mimic'], 4));
    const shot1 = resolver.resolveVolleyShot(volley, first.zombie.snapshot());
    encounter.applyShot(first.id, shot1);
    encounter.select(second.id);
    const shot2 = resolver.resolveVolleyShot(volley, second.zombie.snapshot());
    expect(shot2.breakdown.recoilBefore).toBe(shot1.breakdown.recoilAfter);
    expect(shot2.breakdown.followUpBonus).toBeGreaterThan(0);
    expect(shot2.before.wound).toBe(0);
    expect(volley.magazine.rounds).toEqual(['relay', 'plusP', 'mimic']);
  });
});
