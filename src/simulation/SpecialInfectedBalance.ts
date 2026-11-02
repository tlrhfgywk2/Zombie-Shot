import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import { simulateEncounterBalance, summarizeEncounter, type EncounterBalanceOptions } from './EncounterBalance';

export const SPECIAL_BEHAVIOR_SCENARIOS: readonly (EncounterBalanceOptions & { label: string })[] = [
  { label: '일반 · 강한 초탄', scenario: { id: '일반', roster: ['normal'] }, weapon: 'p220', magazines: [['plusP', 'plusP', 'kickback', 'ball']] },
  { label: '방패 · 즉시 연사', scenario: { id: '방패', roster: ['shieldCharger'] }, weapon: 'p220', magazines: [['plusP', 'plusP', 'kickback', 'ball']] },
  { label: '방패 · 노출 활용', scenario: { id: '방패', roster: ['shieldCharger'] }, weapon: 'p220', magazines: [['ball'], ['plusP', 'plusP', 'kickback', 'ball']] },
  { label: '방패 · 강한 폭발 빌드', scenario: { id: '방패', roster: ['shieldCharger'] }, weapon: 'p220', attachments: ['extendedMagazine'], magazines: [['stickyCharge', 'stickyCharge', 'stickyCharge', 'stickyCharge', 'flatNose']] },
  { label: '방패 · 돌진 충격 중단', scenario: { id: '방패', roster: ['shieldCharger'] }, weapon: 'p220', magazines: [['ball'], ['hammer']] },
  { label: '방패 · 돌진 후퇴', scenario: { id: '방패', roster: ['shieldCharger'] }, weapon: 'p220', magazines: [['ball'], ['retreat']] },
  { label: '광란 · 노출 처치', scenario: { id: '광란', roster: ['frenzied'] }, weapon: 'p220', magazines: [['plusP', 'plusP', 'kickback', 'ball']] },
  { label: '광란 · 돌격 중단', scenario: { id: '광란', roster: ['frenzied'] }, weapon: 'p220', magazines: [['hammer', 'flatNose']] },
  { label: '교란 · 예고 중단', scenario: { id: '교란', roster: ['disruptor'] }, weapon: 'p220', attachments: ['compensator'], magazines: [['ball'], ['hammer']] },
  { label: '교란 · 수용 후 복원', scenario: { id: '교란', roster: ['disruptor'] }, weapon: 'p220', attachments: ['compensator'], magazines: [['ball'], ['ball']] },
  { label: '다수 · 방패와 광란', scenario: { id: '다수', roster: ['shieldCharger', 'frenzied'] }, weapon: 'p220' },
  { label: '다수 · 방패와 교란', scenario: { id: '다수', roster: ['shieldCharger', 'disruptor'] }, weapon: 'p220' },
];

export function specialBehaviorReport() {
  const resolver = new CombatResolver(() => 0);
  const guard = { ...createEnemyState('shieldCharger'), hp: 1000, maxHp: 1000 };
  const windup = resolver.resolveEnemyAction(guard).after;
  windup.distance = guard.distance;
  const rounds = ['plusP', 'plusP', 'kickback', 'ball'] as const;
  return {
    sameDistance: { distance: guard.distance, guard: resolver.resolveSequence(rounds, guard).totalHpDamage,
      windup: resolver.resolveSequence(rounds, windup).totalHpDamage },
    scenarios: SPECIAL_BEHAVIOR_SCENARIOS.map(({ label, ...options }) => {
      const result = simulateEncounterBalance(options);
      const hp = options.scenario.roster.reduce((sum, type) => sum + createEnemyState(type).hp, 0);
      return { label, ...summarizeEncounter(result), hpPerShot: Number(((hp - result.remainingHp) / result.shots).toFixed(2)),
        actions: result.trace.map(turn => turn.action) };
    }),
  };
}
