import { describe, expect, it } from 'vitest';
import { Player } from '../entities/Player';
import { formatBalanceReport, runBalanceSimulation, simulateEncounter } from './BalanceSimulator';

describe('현실 탄약 밸런스 표본', () => {
  const report = runBalanceSimulation();
  it('6개 전략과 4개 장착 구성, 7종 적, 16개 경로를 비교한다', () => {
    expect(report.encounters).toHaveLength(6 * 4 * 7);
    expect(report.routes).toHaveLength(6 * 4 * 16);
    expect(report.encounters.some(row => row.armorBroken > 0)).toBe(true);
    expect(report.encounters.some(row => row.staggerTriggers > 0)).toBe(true);
    expect(report.encounters.some(row => row.accuracyAbove100 > 0)).toBe(true);
  });
  it('표준탄만으로 장갑 적을 처치할 수 있다', () => {
    expect(simulateEncounter(['standard'], 'armored', new Player()).won).toBe(true);
  });
  it('모든 경로 조합에 실제 완주 가능한 구성이 있다', () => {
    for (let mask = 0; mask < 16; mask += 1) expect(report.routes.some(row => row.mask === mask && row.completed)).toBe(true);
  });
  it('현재 규칙의 재현 가능한 보고서를 출력한다', () => {
    expect(formatBalanceReport(report)).toContain('전략별 완주율');
    console.info(formatBalanceReport(report));
  });
});
