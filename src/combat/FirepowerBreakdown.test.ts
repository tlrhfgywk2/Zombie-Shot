import { describe, expect, it } from 'vitest';
import { CombatResolver } from './CombatResolver';
import { createPlayerCombatState } from './AttachmentLoadout';
import { createEnemyState } from '../data/enemyDefinitions';
import type { EnemyState } from './types';

const resolver = new CombatResolver();
const target = (changes: Partial<EnemyState> = {}): EnemyState =>
  ({ ...createEnemyState('normal'), hp: 100, maxHp: 100, distance: 3, ...changes });

describe('화력 계산 내역', () => {
  it('감쇠가 없으면 최종 화력과 감쇠 전 화력이 같다', () => {
    const breakdown = resolver.resolveSequence(['ball'], target()).firepowerBreakdown;
    expect(breakdown).toEqual({ prePenaltyFirepower: 5, recoilReduction: 0, playerDebuffReduction: 0,
      distanceReduction: 0, distancePenaltyPercents: [], detonationDamage: 0, ruptureDamage: 0, finalFirepower: 5 });
    expect(resolver.resolveSequence(['ball'], target({ distance: 8 })).firepowerBreakdown).toEqual({
      prePenaltyFirepower: 5, recoilReduction: 0, playerDebuffReduction: 0, distanceReduction: 1,
      distancePenaltyPercents: [20], detonationDamage: 0, ruptureDamage: 0, finalFirepower: 4,
    });
  });

  it('같은 거리의 작은 손실을 탄창 안에서 누적해 8m가 6m보다 유리해지지 않는다', () => {
    const rounds = ['ball', 'ball', 'ball', 'ball'] as const;
    const near = resolver.resolveSequence(rounds, target({ distance: 3.999 }));
    const mid = resolver.resolveSequence(rounds, target({ distance: 6 }));
    const midEdge = resolver.resolveSequence(rounds, target({ distance: 7.999 }));
    const far = resolver.resolveSequence(rounds, target({ distance: 9 }));
    expect(near.firepowerBreakdown).toMatchObject({ recoilReduction: 0, distanceReduction: 0, finalFirepower: 20 });
    expect(mid.firepowerBreakdown).toMatchObject({ recoilReduction: 0,
      distanceReduction: 2, distancePenaltyPercents: [10], detonationDamage: 0, ruptureDamage: 0, finalFirepower: 18 });
    expect(midEdge.firepowerBreakdown).toEqual(mid.firepowerBreakdown);
    expect(far.firepowerBreakdown.finalFirepower).toBeLessThan(midEdge.firepowerBreakdown.finalFirepower);
    expect(midEdge.shots.map(shot => shot.breakdown.distanceFirepowerReduction)).toEqual([1, 0, 1, 0]);
  });

  it('거리와 반동 감쇠를 실제 탄별 계산에서 합산한다', () => {
    const distanceOnly = resolver.resolveSequence(['plusP'], target({ distance: 11 })).firepowerBreakdown;
    expect(distanceOnly).toEqual({ prePenaltyFirepower: 8, recoilReduction: 0, playerDebuffReduction: 0,
      distanceReduction: 2, distancePenaltyPercents: [20], detonationDamage: 0, ruptureDamage: 0, finalFirepower: 6 });

    const recoilOnly = resolver.resolveSequence(['plusP', 'plusP', 'ball'], target()).shots[2]!.breakdown;
    expect(recoilOnly).toMatchObject({ prePenaltyFirepower: 5, recoilPenalty: 1,
      recoilFirepowerReduction: 1, distanceFirepowerReduction: 0, finalFirepower: 4 });

    const both = resolver.resolveSequence(['plusP', 'plusP', 'plusP'], target({ distance: 11 }));
    expect(both.shots[1]?.breakdown).toMatchObject({ prePenaltyFirepower: 8,
      recoilFirepowerReduction: 1, rangePenaltyPercent: 20, distanceFirepowerReduction: 1, finalFirepower: 6 });
    const total = both.firepowerBreakdown;
    expect(total.prePenaltyFirepower - total.recoilReduction - total.distanceReduction).toBe(total.finalFirepower);
    expect(total.finalFirepower).toBe(both.shots.reduce((sum, shot) => sum + shot.breakdown.finalFirepower, 0));
  });

  it('반동 전환 뒤 감쇠가 사라지고 취약 시 반동의 실제 손실도 일치한다', () => {
    const reset = resolver.resolveSequence(['plusP', 'plusP', 'kickback', 'ball'], target());
    expect(reset.shots[3]?.breakdown.recoilFirepowerReduction).toBe(0);
    const vulnerable = resolver.resolveSequence(['plusP', 'plusP', 'laceration'], target({ vulnerableTurns: 1 }));
    expect(vulnerable.shots[2]?.breakdown).toMatchObject({ prePenaltyFirepower: 10,
      recoilPenalty: 2, recoilFirepowerReduction: 4, finalFirepower: 6 });
  });

  it('탄별 이동 거리와 활성 부착물의 감쇠율을 사용한다', () => {
    const moved = resolver.resolveSequence(['retreat', 'ball'], target({ distance: 7 }));
    expect(moved.firepowerBreakdown.distancePenaltyPercents).toEqual([10, 20]);
    expect(moved.shots.map(shot => shot.shotDistance)).toEqual([7, 9]);
    expect(resolver.resolveSequence(['plusP'], target({ distance: 11 }),
      { loadout: { barrel: 'extendedBarrel' } }).firepowerBreakdown.distancePenaltyPercents).toEqual([10]);
    expect(resolver.resolveSequence(['plusP'], target({ distance: 7 }),
      { loadout: { optic: 'reflexSight' } }).firepowerBreakdown.distancePenaltyPercents).toEqual([]);
    expect(resolver.resolveSequence(['plusP'], target({ distance: 7 }),
      { loadout: { optic: 'reflexSight' }, playerState: { ...createPlayerCombatState(), rangePenaltySteps: 1 } })
      .firepowerBreakdown.distancePenaltyPercents).toEqual([20]);
    expect(resolver.resolveSequence(['plusP', 'plusP', 'plusP'], target(),
      { loadout: { muzzle: 'compensator' } }).shots[2]?.breakdown.recoilFirepowerReduction).toBe(2);
  });

  it('P220 표준탄은 반동 없이 거리 손실만 누적한다', () => {
    const sequence = resolver.resolveSequence(['ball', 'ball', 'ball', 'ball'], target({ distance: 8 }));
    expect(sequence.shots.map(shot => shot.breakdown.recoilAfter)).toEqual([0, 0, 0, 0]);
    expect(sequence.shots.map(shot => shot.breakdown.recoilPenalty)).toEqual([0, 0, 0, 0]);
    expect(sequence.shots[3]?.breakdown).toMatchObject({ prePenaltyFirepower: 5,
      recoilFirepowerReduction: 0, rangePenaltyPercent: 20 });
    expect(sequence.firepowerBreakdown).toEqual({ prePenaltyFirepower: 20, recoilReduction: 0,
      playerDebuffReduction: 0, distanceReduction: 4, distancePenaltyPercents: [20], detonationDamage: 0, ruptureDamage: 0, finalFirepower: 16 });
  });

  it('탄약 패널 후보는 현재 발사 순서 맨 뒤에 추가한 화력을 미리 계산한다', () => {
    const rounds = ['serrated', 'wounding', 'laceration'] as const;
    const previews = resolver.previewAppendedAmmo(rounds, ['laceration', 'ball'], target(),
      { loadout: { muzzle: 'muzzleBrake' } });
    expect(previews.laceration).toMatchObject({ effectiveFirepower: 8, recoilFirepowerReduction: 2 });
    expect(previews.ball).toMatchObject({ effectiveFirepower: 8, recoilFirepowerReduction: 0 });
  });
});
