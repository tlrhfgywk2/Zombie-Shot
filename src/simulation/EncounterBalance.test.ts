import { describe, expect, it } from 'vitest';
import { simulateEncounterBalance, uniqueOrders } from './EncounterBalance';
import { WEAPON_ORDER } from '../data/weaponDefinitions';
import { encounterStartingDistances } from '../data/encounterDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { previewEnemyAction } from '../combat/CombatResolver';
import { Encounter } from '../combat/Encounter';
import type { EnemyType } from '../combat/types';

const mixed = { id: '질주와 거체', roster: ['fast', 'tough'] as const };
const dangerous = { id: '위험', roster: ['contaminator', 'screecher'] as const, reinforcements: ['normal'] as const };

describe('다수전의 선택 가치와 대응 가능성', () => {
  it.each(WEAPON_ORDER)('%s는 조우에 따라 반대쪽을 우선해야 하며 표준탄만으로 대응할 수 있다', weapon => {
    expect(simulateEncounterBalance({ scenario: mixed, weapon, policy: 'focus-first' }).won).toBe(true);
    expect(simulateEncounterBalance({ scenario: mixed, weapon, policy: 'focus-second' }).won).toBe(false);
    expect(simulateEncounterBalance({ scenario: dangerous, weapon, policy: 'focus-first' }).won).toBe(false);
    expect(simulateEncounterBalance({ scenario: dangerous, weapon, policy: 'focus-second' }).won).toBe(true);
  });

  it.each(WEAPON_ORDER)('%s는 탐험 거리 감소를 포함한 모든 구성에서 특정 특수탄 없이 생존한다', weapon => {
    for (const roster of [['normal', 'normal'], ['fast', 'tough'], ['fast', 'brute'], ['normal', 'tough'], ['contaminator', 'normal'], ['groundshaker', 'normal'], ['screecher', 'normal'], ['contaminator', 'screecher']] as EnemyType[][]) {
      for (const distancePenalty of [0, 2]) {
        const scenario = { id: '대응 가능성', roster, distancePenalty, reinforcements: roster.some(type => ['contaminator', 'groundshaker', 'screecher'].includes(type)) ? ['normal' as const] : [] };
        const result = simulateEncounterBalance({ scenario, weapon, policy: 'nearest' });
        expect(result.won, `${roster.join('/')} · 거리 감소 ${distancePenalty}`).toBe(true);
        expect(result.specialSpent).toBe(0);
        expect(result.turns).toBeLessThanOrEqual(8);
      }
    }
  });

  it('거체에 상처 연계를 집중하고 일반 피해를 질주체로 돌리면 같은 소모로 한 탄창을 줄인다', () => {
    const magazines = [['wounding', 'wounding', 'laceration', 'ball']] as const;
    const split = simulateEncounterBalance({ scenario: mixed, weapon: 'p220', magazines, openingTargets: [1, 1, 1, 0], policy: 'nearest' });
    const focused = simulateEncounterBalance({ scenario: mixed, weapon: 'p220', magazines, openingTargets: [0, 0, 0, 0], policy: 'nearest' });
    expect(split).toMatchObject({ won: true, turns: 3, shots: 12, specialSpent: 3 });
    expect(focused).toMatchObject({ won: true, turns: 4, specialSpent: 3 });
    expect(split.trace[0]!.after[1]!.vulnerableTurns).toBeGreaterThan(0);
    expect(split.trace[0]!.after[0]!.wound).toBe(0);
  });

  it('충격탄은 질주체를 멈추고 반동 연계는 거체에 쓰면 적의 실제 행동을 더 줄인다', () => {
    const magazines = [['hammer', 'plusP', 'kickback', 'ball']] as const;
    const controlled = simulateEncounterBalance({ scenario: mixed, weapon: 'p220', magazines, openingTargets: [0, 1, 1, 1], policy: 'nearest' });
    const focused = simulateEncounterBalance({ scenario: mixed, weapon: 'p220', magazines, openingTargets: [0, 0, 0, 0], policy: 'nearest' });
    expect(controlled).toMatchObject({ won: true, enemyActions: 1, specialSpent: 3 });
    expect(controlled.enemyActions).toBeLessThan(focused.enemyActions);
    expect(controlled.trace[0]!.action).toBe('shock-nullified');
  });

  it('같은 폭발탄 묶음도 기폭 순서를 지키면 3탄창, 뒤집으면 5탄창이 걸린다', () => {
    const correct = simulateEncounterBalance({ scenario: mixed, weapon: 'p220', magazines: [['stickyCharge', 'stickyCharge', 'stickyCharge', 'flatNose']], openingTargets: [1, 1, 1, 1], policy: 'nearest' });
    const reversed = simulateEncounterBalance({ scenario: mixed, weapon: 'p220', magazines: [['flatNose', 'stickyCharge', 'stickyCharge', 'stickyCharge']], openingTargets: [1, 1, 1, 1], policy: 'nearest' });
    expect(correct).toMatchObject({ won: true, turns: 3, shots: 11, specialSpent: 4 });
    expect(reversed).toMatchObject({ won: true, turns: 5, shots: 17, specialSpent: 4 });
  });

  it('상처 연계를 늦게 소비하면 같은 소모량으로도 위협 대응과 처치 시점이 늦어진다', () => {
    const scenario = { id: '상처 사용 시점', roster: ['groundshaker', 'normal'] as const, reinforcements: ['normal'] as const, distancePenalty: 2 };
    const combo = ['wounding', 'wounding', 'laceration', 'ball'] as const;
    const early = simulateEncounterBalance({ scenario, weapon: 'p220', magazines: [combo], policy: 'nearest' });
    const late = simulateEncounterBalance({ scenario, weapon: 'p220', magazines: [['ball', 'ball', 'ball', 'ball'], ['ball', 'ball', 'ball', 'ball'], combo], policy: 'nearest' });
    expect(early).toMatchObject({ won: true, turns: 5, shots: 18, specialSpent: 3, dangerTurns: 0 });
    expect(late).toMatchObject({ won: true, turns: 6, shots: 22, specialSpent: 3, dangerTurns: 1 });
  });

  it('일반 둘은 입문용 여유를 유지하고 단독 적과 증원은 기존 거리를 유지한다', () => {
    for (const policy of ['focus-first', 'focus-second'] as const) expect(simulateEncounterBalance({ scenario: { id: '일반 둘', roster: ['normal', 'normal'] }, weapon: 'p220', policy }).won).toBe(true);
    expect(encounterStartingDistances(['fast'])).toEqual([createEnemyState('fast').distance]);
    const encounter = new Encounter(['normal', 'normal'], ['fast']);
    encounter.selected.zombie.applyState({ ...encounter.selected.zombie.snapshot(), hp: 0 });
    expect(encounter.settleDeaths()[0]!.zombie.distance).toBe(5);
  });

  it('지반 파쇄체는 다수전에서 능력을 예고하며 처음부터 치명 공격하지 않는다', () => {
    const encounter = new Encounter(['groundshaker', 'normal']);
    expect(previewEnemyAction(encounter.selected.zombie.snapshot()).selectedAction).toBe('groundShock');
    for (const state of encounter.living.map(enemy => enemy.zombie.snapshot())) expect(previewEnemyAction(state).selectedAction).not.toBe('attack');
    expect(uniqueOrders(['wounding', 'wounding', 'ball', 'laceration'])).toHaveLength(12);
  });

  it('거리 감소와 근거리 약화 조준경의 불리한 조합에도 여러 대응책이 남는다', () => {
    const scenario = { id: '조준경의 근거리 대가', roster: ['groundshaker', 'normal'] as const, reinforcements: ['normal'] as const, distancePenalty: 2 };
    const options = { scenario, weapon: 'm1911' as const, attachments: ['pistolScope' as const], policy: 'nearest' as const };
    expect(simulateEncounterBalance(options).won).toBe(false);
    for (const magazines of [
      [['wounding', 'wounding', 'ball', 'finisher']],
      [['retreat', 'ball', 'ball', 'ball']],
      [['hammer', 'ball', 'ball', 'ball']],
    ] as const) expect(simulateEncounterBalance({ ...options, magazines }).won).toBe(true);
    expect(simulateEncounterBalance({ ...options, attachments: [] }).won).toBe(true);
  });
});
