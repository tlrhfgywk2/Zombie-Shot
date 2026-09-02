import { describe, expect, it } from 'vitest';
import { ATTACHMENT_ORDER } from '../data/attachmentDefinitions';
import { formatBalanceReport, runBalanceSimulation } from './BalanceSimulator';

describe('빌드 밸런스 시뮬레이션', () => {
  const report = runBalanceSimulation();

  it('108개 장착 조합과 6개 전략, 7종 적을 모두 교차 검증한다', () => {
    expect(report.loadoutCount).toBe(108);
    expect(report.totalEncounters).toBe(108 * 6 * 7);
    expect(report.attachmentMetrics).toHaveLength(ATTACHMENT_ORDER.length);
  });

  it('정확도 100% 초과와 탄약 보존이 실제 표본에서 발생한다', () => {
    expect(report.accuracyAbove100Rate).toBeGreaterThan(0.05);
    expect(report.conservationRate).toBeGreaterThan(0);
  });

  it('일반 및 특수 조우와 여섯 운용군에 생존 가능한 결과가 있다', () => {
    expect(report.normalWinRate).toBeGreaterThan(0.5);
    expect(report.specialWinRate).toBeGreaterThan(0.25);
    for (const winRate of Object.values(report.familyWinRates)) expect(winRate).toBeGreaterThan(0.2);
  });

  it('16개 경로 조합을 전체 빌드·전략과 교차해 자원 지속성을 비교한다', () => {
    expect(report.routeMetrics.reduce((sum, metric) => sum + metric.samples, 0)).toBe(108 * 6 * 16);
    expect(report.routeMetrics).toHaveLength(5);
    for (const metric of report.routeMetrics) {
      expect(metric.completionRate).toBeGreaterThan(0.1);
      expect(metric.averageRoundsSpent).toBeGreaterThan(0);
    }
  });

  it('거리·관통·충격·의도 지연 축이 실제 표본에서 작동한다', () => {
    expect(report.rangeMetrics.near.shots).toBeGreaterThan(0);
    expect(report.rangeMetrics.mid.shots).toBeGreaterThan(0);
    expect(report.rangeMetrics.far.shots).toBeGreaterThan(0);
    expect(report.armorDamage).toBeGreaterThan(0);
    expect(report.penetrationDamage).toBeGreaterThan(0);
    expect(report.staggerTriggers).toBeGreaterThan(0);
    expect(report.intentDelays).toBeGreaterThan(0);
  });

  it('최종 조정 뒤 전역 지배 또는 사장된 장착물이 남지 않는다', () => {
    expect(report.attachmentMetrics.filter((metric) => metric.classification === 'dominant')).toEqual([]);
    expect(report.attachmentMetrics.filter((metric) => metric.classification === 'dead')).toEqual([]);
  });

  it('수동 검토를 위한 재현 가능한 요약을 출력한다', () => {
    const summary = formatBalanceReport(report);
    expect(summary).toContain('accuracyAbove100Rate');
    console.info(summary);
  });
});
