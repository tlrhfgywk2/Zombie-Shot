import { describe, expect, it } from 'vitest';
import { simulateEncounterBalance } from './EncounterBalance';
import { specialBehaviorReport } from './SpecialInfectedBalance';
import { WEAPON_ORDER } from '../data/weaponDefinitions';
import type { EnemyType } from '../combat/types';

describe('실제 탄약·행동 기회의 단계 밸런스', () => {
  it('동일 특수탄 3발의 노출 활용은 적은 발수로 같은 2턴에 끝난다', () => {
    const report = specialBehaviorReport();
    const immediate = report.scenarios.find(row => row.label === '방패 · 즉시 연사')!;
    const timed = report.scenarios.find(row => row.label === '방패 · 노출 활용')!;
    expect(immediate).toMatchObject({ won: true, shots: 7, turns: 2, specialSpent: 3 });
    expect(timed).toMatchObject({ won: true, shots: 5, turns: 2, specialSpent: 3 });
    expect(timed.hpPerShot).toBeGreaterThan(immediate.hpPerShot);
    expect(report.sameDistance.windup).toBeGreaterThan(report.sameDistance.guard * 2);
  });
  it('강한 빌드의 초탄 처치와 미완성 빌드의 충격·후퇴·교란 수용이 공존한다', () => {
    const report = specialBehaviorReport();
    expect(report.scenarios.every(row => row.won && !row.breached)).toBe(true);
    expect(report.scenarios.find(row => row.label === '방패 · 강한 폭발 빌드')).toMatchObject({ turns: 1, shots: 5 });
    expect(report.scenarios.find(row => row.label === '광란 · 노출 처치')).toMatchObject({ turns: 1, shots: 3 });
    expect(report.scenarios.find(row => row.label === '방패 · 돌진 충격 중단')?.actions).toContain('shock-nullified');
    expect(report.scenarios.find(row => row.label === '방패 · 돌진 후퇴')?.actions).toContain('charge');
    expect(report.scenarios.find(row => row.label === '교란 · 수용 후 복원')?.actions).toContain('disrupt');
  });
  it.each(WEAPON_ORDER)('%s는 무부착물 표준탄만으로 세 단독·세 다수 조우와 2m 거리 불이익을 통과한다', weapon => {
    const rosters: readonly (readonly EnemyType[])[] = [['shieldCharger'], ['frenzied'], ['disruptor'],
      ['shieldCharger', 'frenzied'], ['shieldCharger', 'disruptor'], ['frenzied', 'disruptor']];
    for (const roster of rosters) for (const distancePenalty of [0, 2]) {
      const result = simulateEncounterBalance({ scenario: { id: '무부착물 검증', roster, distancePenalty }, weapon });
      expect(result.won, `${roster.join('/')} · 거리 -${distancePenalty} m`).toBe(true);
      expect(result.breached).toBe(false);
      expect(result.turns).toBeLessThanOrEqual(8);
    }
  });
});
