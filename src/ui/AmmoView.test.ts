import { describe, expect, it } from 'vitest';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import type { EnemyState } from '../combat/types';
import { ammoStatsMarkup, ammoTooltipFirepower, firingOrderStatEntries } from './AmmoView';

const resolver = new CombatResolver();
const target = (): EnemyState => ({ ...createEnemyState('normal'), hp: 100, maxHp: 100, distance: 3 });

describe('탄약 전투 수치 표시', () => {
  it('발사 순서에는 화력을 제외하고 상처·충격·누적 반동만 표시한다', () => {
    const round = resolver.resolveSequence(['wounding'], target()).roundPreviews[0]!;
    expect(firingOrderStatEntries(round)).toEqual([
      { kind: 'wound', label: '상처', value: 3, modified: false },
      { kind: 'recoil', label: '누적 반동', value: 1, modified: false },
    ]);
  });

  it('탄창 순서의 반동 감소를 반영하고 강화보다 감소 색상을 우선한다', () => {
    const previews = resolver.resolveSequence(
      ['serrated', 'wounding', 'laceration', 'laceration'],
      target(),
      { loadout: { muzzle: 'muzzleBrake' } },
    ).roundPreviews;

    expect(ammoTooltipFirepower('laceration', previews[2])).toEqual({ value: 10, change: 'strengthened' });
    expect(ammoTooltipFirepower('laceration', previews[3])).toEqual({ value: 8, change: 'weakened' });
    expect(ammoTooltipFirepower('laceration')).toEqual({ value: 5, change: 'neutral' });
  });

  it('연쇄·증폭·장착물로 바뀐 실제 충격을 슬롯 수치와 강화 표시로 전달한다', () => {
    const rounds = resolver.resolveSequence(['impactRelay', 'ball', 'resonance'], target(),
      { loadout: { rail: 'tacticalLight' } }).roundPreviews;
    expect(firingOrderStatEntries(rounds[1]!).find(entry => entry.kind === 'shock')).toEqual({
      kind: 'shock', label: '충격', value: 5, modified: true,
    });
    expect(firingOrderStatEntries(rounds[2]!).find(entry => entry.kind === 'shock')?.value).toBe(8);
  });

  it('보급·보유·상세 카드에 선택에 필요한 충격 특수 효과와 반동 0을 표시한다', () => {
    expect(ammoStatsMarkup('impactRelay')).toContain('다음 탄 충격 +3');
    expect(ammoStatsMarkup('resonance')).toContain('현재 충격 2당 +1 · 추가 최대 +4');
    expect(ammoStatsMarkup('reducedImpact')).toContain('반동<b>0</b>');
  });
});
