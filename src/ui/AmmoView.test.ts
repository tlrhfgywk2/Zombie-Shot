import { describe, expect, it } from 'vitest';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import type { EnemyState } from '../combat/types';
import { ammoTooltipFirepower, firingOrderStatEntries } from './AmmoView';

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

    expect(ammoTooltipFirepower('laceration', previews[2])).toEqual({ value: 8, change: 'weakened' });
    expect(ammoTooltipFirepower('laceration', previews[3])).toEqual({ value: 8, change: 'weakened' });
    expect(ammoTooltipFirepower('laceration')).toEqual({ value: 5, change: 'neutral' });
  });
});
