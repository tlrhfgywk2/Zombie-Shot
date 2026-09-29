import { describe, expect, it } from 'vitest';
import { CombatResolver } from './CombatResolver';
import { recoilFirepowerPenalty } from './RecoilPenalty';
import { createPlayerCombatState } from './AttachmentLoadout';
import { createEnemyState } from '../data/enemyDefinitions';
import type { AmmoType, EnemyState } from './types';

const resolver = new CombatResolver();
const target = (distance = 3): EnemyState => ({ ...createEnemyState('normal'), hp: 100, maxHp: 100, distance });
const penalties = (rounds: readonly AmmoType[]) => resolver.resolveSequence(rounds, target()).shots
  .map(shot => shot.breakdown.recoilPenalty);

describe('누적 반동 단계', () => {
  it('초과량 두 칸마다 1씩 줄이고 최대 3에서 멈춘다', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 20].map(recoil => recoilFirepowerPenalty(recoil, 3)))
      .toEqual([0, 0, 0, 0, 1, 1, 2, 2, 3, 3]);
  });

  it('임계치를 넘긴 탄 자체는 감점하지 않고 다음 탄에 적용한다', () => {
    const byOne = resolver.resolveSequence(['ball', 'ball', 'ball', 'ball', 'ball'], target());
    expect(byOne.shots.map(shot => shot.breakdown.recoilAfter)).toEqual([1, 2, 3, 4, 5]);
    expect(byOne.shots.map(shot => shot.breakdown.recoilPenalty)).toEqual([0, 0, 0, 0, 1]);

    const byTwo = resolver.resolveSequence(['ball', 'ball', 'ball', 'heavy', 'ball'], target());
    expect(byTwo.shots[3]?.breakdown).toMatchObject({ recoilBefore: 3, recoilAfter: 5, recoilPenalty: 0 });
    expect(byTwo.shots[4]?.breakdown).toMatchObject({ recoilBefore: 5, recoilPenalty: 1 });
    expect(penalties(['plusP', 'plusP', 'plusP', 'plusP', 'plusP', 'plusP']))
      .toEqual([0, 0, 2, 3, 3, 3]);
  });

  it('보정기와 봉쇄는 유효 임계치를 사용하고 제퇴기와 손잡이는 저장할 반동을 줄인다', () => {
    const rounds: AmmoType[] = ['plusP', 'plusP', 'ball'];
    expect(resolver.resolveSequence(rounds, target(), { loadout: { muzzle: 'compensator' } })
      .shots[2]?.breakdown.recoilPenalty).toBe(1);
    expect(resolver.resolveSequence(rounds, target(), { loadout: { muzzle: 'compensator' },
      playerState: { ...createPlayerCombatState(), disabledSlots: { muzzle: 1 } } })
      .shots[2]?.breakdown.recoilPenalty).toBe(2);
    expect(resolver.resolveSequence(rounds, target(), { loadout: { muzzle: 'muzzleBrake' } })
      .shots[2]?.breakdown).toMatchObject({ recoilBefore: 4, recoilPenalty: 1 });
    expect(resolver.resolveSequence(rounds, target(), { loadout: { grip: 'texturedGrip' } })
      .shots[2]?.breakdown).toMatchObject({ recoilBefore: 4, recoilPenalty: 1 });
    expect(recoilFirepowerPenalty(4, 2)).toBe(1);
    expect(recoilFirepowerPenalty(5, 2)).toBe(2);
  });

  it('저반동탄 회복은 다음 탄부터 적용하고 반동 전환탄은 누적치를 소모한다', () => {
    const recovered = resolver.resolveSequence(['plusP', 'plusP', 'lowRecoil', 'ball'], target());
    expect(recovered.shots[2]?.breakdown).toMatchObject({ recoilBefore: 6, recoilPenalty: 2, recoilAfter: 4 });
    expect(recovered.shots[3]?.breakdown.recoilPenalty).toBe(1);
    const converted = resolver.resolveSequence(['plusP', 'plusP', 'kickback', 'ball'], target());
    expect(converted.shots[2]?.breakdown).toMatchObject({ recoilBefore: 6, recoilPenalty: 0, recoilAfter: 0 });
    expect(converted.shots[3]?.breakdown.recoilPenalty).toBe(0);
  });

  it('반동은 탄창이 끝나면 초기화되고 거리 및 적의 화력 교란과 별개로 계산한다', () => {
    const first = resolver.resolveSequence(['plusP', 'plusP', 'ball'], target(11), {
      playerState: { ...createPlayerCombatState(), heavyKickPenaltyBonus: 1, heavyKickPenaltyTurns: 2 },
    });
    expect(first.shots[2]?.breakdown).toMatchObject({ recoilPenalty: 2, playerDebuffFirepowerPenalty: 1,
      rangePenaltyPercent: 25, recoilFirepowerReduction: 2, playerDebuffFirepowerReduction: 1 });
    expect(first.firepowerBreakdown.prePenaltyFirepower - first.firepowerBreakdown.recoilReduction
      - first.firepowerBreakdown.playerDebuffReduction - first.firepowerBreakdown.distanceReduction)
      .toBe(first.firepowerBreakdown.finalFirepower);
    const nextTurn = resolver.resolveSequence(['ball'], first.finalState);
    expect(nextTurn.shots[0]?.breakdown).toMatchObject({ recoilBefore: 0, recoilPenalty: 0 });
  });

  it('같은 탄약도 발사 순서에 따라 뒤쪽 탄의 감점이 달라진다', () => {
    const lowFirst = penalties(['lowRecoil', 'lowRecoil', 'plusP', 'plusP']);
    const highFirst = penalties(['plusP', 'plusP', 'lowRecoil', 'lowRecoil']);
    expect(lowFirst).toEqual([0, 0, 0, 0]);
    expect(highFirst).toEqual([0, 0, 2, 1]);
  });
});
