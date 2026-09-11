import { describe, expect, it } from 'vitest';
import { formatSequenceAudit, runSequenceAudit } from './SequenceAudit';

describe('순서·거리 체계 밸런스 감사', () => {
  const audit = runSequenceAudit();

  it('저반동·고반동, 4/6발, 일반·장갑·강적을 체계적으로 기록한다', () => {
    expect(audit.movement).toHaveLength(6 * 3);
    expect(audit.damage).toHaveLength(9 * 3);
    expect(audit.rounding).toHaveLength(2 * 7);
  });

  it('보통 초반 4발과 6발 표준탄은 일반 감염체의 접근 행동 수를 줄이지 않는다', () => {
    for (const name of ['표준탄 4발', '표준탄 6발']) {
      const row = audit.movement.find(item => item.configuration === name && item.enemy === 'normal')!;
      expect(row.baselineTurnsToContact).toBe(4);
      expect(row.effectiveTurnsToContact).toBe(4);
      expect(row.movementPerCycle).toBe(row.normalMovement);
    }
  });





  it('10%는 완만하고 25%는 작은 화력에서도 의미 있게 작동한다', () => {
    const standard = audit.damage.filter(item => item.ammo === 'standard');
    expect(standard.map(item => item.finalVolleyFirepower)).toEqual([4, 4, 3]);
    const overpressure = audit.damage.filter(item => item.ammo === 'overpressure');
    expect(overpressure.map(item => item.finalVolleyFirepower)).toEqual([8, 7, 6]);
  });

  it('재현 가능한 상세 감사 보고서를 출력한다', () => {
    const report = formatSequenceAudit(audit);
    expect(report).toContain('baselineTurnsToContact');
    console.info(report);
  });
});
