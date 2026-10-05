import { describe, expect, it } from 'vitest';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import type { EnemyState } from '../combat/types';
import { AMMO_ORDER } from '../data/ammoDefinitions';
import { ammoStatsMarkup, ammoTooltipFirepower, ammoTooltipStatsMarkup, firingOrderStatEntries } from './AmmoView';

const resolver = new CombatResolver();
const target = (): EnemyState => ({ ...createEnemyState('normal'), hp: 100, maxHp: 100, distance: 3 });

describe('탄약 전투 수치 표시', () => {
  it('재개방의 조건부 상처를 실제 순서 수치와 강화 표시로 전달한다', () => {
    const round = resolver.resolveSequence(['wounding', 'wounding', 'reopening'], target()).roundPreviews[2]!;
    expect(firingOrderStatEntries(round).find(entry => entry.kind === 'wound')).toEqual({
      kind: 'wound', label: '상처', value: 6, modified: true,
    });
  });
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
  it('화상 보급 카드에는 별도 즉시 피해·정확한 공식·반동 0·충격 0을 표시한다', () => {
    expect(ammoStatsMarkup('incendiary')).toContain('화상<b>8</b>');
    expect(ammoStatsMarkup('incendiary')).toContain('즉시 화상 피해<b>2</b>');
    expect(ammoStatsMarkup('incendiary')).toContain('충격<b>0</b>');
    expect(ammoStatsMarkup('lowHeat')).toContain('반동<b>0</b>');
    expect(ammoStatsMarkup('accelerant')).toContain('바로 다음 탄 화상 ×1.5');
    expect(ammoStatsMarkup('ignition')).toContain('화상 2 + 현재 화상 ×0.5');
    expect(ammoStatsMarkup('kindling')).toContain('점화 대상 직접 화력 +3');
  });
  it('발사 순서에는 촉진·누적 공식으로 수정된 정확한 화상 축적을 전달한다', () => {
    const round = resolver.resolveSequence(['accelerant', 'highHeat', 'ignition'], target()).roundPreviews;
    expect(firingOrderStatEntries(round[1]!).find(entry => entry.kind === 'burn')).toEqual({ kind: 'burn', label: '화상 축적', value: 18, modified: true });
    expect(round[1]).toMatchObject({ ignitionTriggered: true, burnAfter: 0 });
    expect(round[2]).toMatchObject({ burn: 2, ignitionTriggered: false, burnAfter: 2 });
  });

  it.each(AMMO_ORDER)('%s 툴팁에서는 모든 0인 수치를 숨긴다', ammo => {
    expect(ammoTooltipStatsMarkup(ammo)).not.toMatch(/<b[^>]*>0<\/b>/);
    const round = resolver.resolveSequence(['highHeat', 'highHeat', ammo], { ...target(), distance: 12 }).roundPreviews[2]!;
    expect(ammoTooltipStatsMarkup(ammo, round)).not.toMatch(/<b[^>]*>0<\/b>/);
  });

  it('표준탄 툴팁에는 화력과 반동만 남긴다', () => {
    const markup = ammoTooltipStatsMarkup('ball');
    expect(markup).toMatch(/화력 <b[^>]*>5<\/b>/);
    expect(markup).toMatch(/반동 <b[^>]*>1<\/b>/);
    expect(markup).not.toMatch(/상처|폭발|충격|화상/);
  });

  it('화상 툴팁은 보정 후 화력과 즉시 화상 피해를 중복 합산 없이 따로 표시한다', () => {
    const sequence = resolver.resolveSequence(['highHeat', 'highHeat', 'incendiary'], { ...target(), distance: 12 });
    const round = sequence.roundPreviews[2]!;
    expect(ammoTooltipFirepower('incendiary', round)).toEqual({ value: sequence.shots[2]!.breakdown.directFirepower, change: 'weakened' });
    expect(ammoTooltipFirepower('incendiary')).toEqual({ value: 3, change: 'neutral' });
    const markup = ammoTooltipStatsMarkup('incendiary', round);
    expect(markup).toContain('화상 축적');
    expect(markup).toContain(`즉시 화상 피해 <b>${round.burnDamage}</b>`);
    expect(markup).not.toMatch(/최종 화력|거리 감소|반동 화력 감소|사격 후 화상|상처|폭발|충격/);
  });

  it('점화 보너스는 화력과 강화 색상에 반영하고 고유 효과 설명은 유지한다', () => {
    const round = resolver.resolveSequence(['kindling'], { ...target(), ignitedActions: 1 }).roundPreviews[0]!;
    expect(ammoTooltipFirepower('kindling', round)).toEqual({ value: 6, change: 'strengthened' });
    expect(ammoTooltipStatsMarkup('kindling', round)).toContain('점화 대상 직접 화력 +3');
  });
});
