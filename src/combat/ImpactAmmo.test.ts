import { describe, expect, it } from 'vitest';
import { CombatResolver, getActionShockThreshold } from './CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import { createPlayerCombatState } from './AttachmentLoadout';
import { AMMO_DEFINITIONS } from '../data/ammoDefinitions';
import { generateAmmoRewards } from '../progression/AmmoRewards';
import { Player } from '../entities/Player';
import type { EnemyState } from './types';

const resolver = new CombatResolver();
const target = (changes: Partial<EnemyState> = {}): EnemyState =>
  ({ ...createEnemyState('normal'), hp: 1000, maxHp: 1000, distance: 3, ...changes });

describe('신규 충격 탄약', () => {
  it('저충격탄은 반동 부담 없이 약한 충격을 주고 강타탄은 한 발로 더 큰 충격을 준다', () => {
    const reduced = resolver.resolveShot('reducedImpact', 0, target());
    const flat = resolver.resolveShot('flatNose', 0, target());
    const hammer = resolver.resolveShot('hammer', 0, target());
    expect(reduced.actionShockApplied).toBe(2);
    expect(reduced.breakdown.recoilAfter).toBe(0);
    expect(reduced.actionShockApplied).toBeLessThan(flat.actionShockApplied);
    expect(hammer.actionShockApplied).toBe(6);
    expect(hammer.breakdown.recoilAfter).toBe(3);
    expect(hammer.actionShockApplied).toBeGreaterThan(flat.actionShockApplied);
  });

  it('연쇄 충격은 바로 다음 한 발에만 적용하며 순서를 바꾸면 결과가 달라진다', () => {
    const forward = resolver.resolveSequence(['impactRelay', 'ball', 'ball'], target());
    expect(forward.shots.map(shot => shot.actionShockApplied)).toEqual([1, 3, 0]);
    expect(forward.shots[1]!.breakdown.shockFollowUpBonus).toBe(3);
    expect(resolver.resolveSequence(['ball', 'impactRelay'], target()).totalActionShockApplied).toBe(1);
  });

  it.each([
    [{}, [1, 4, 3]],
    [{ grip: 'ergonomicGrip' as const }, [1, 5, 4]],
    [{ rail: 'tacticalLight' as const }, [3, 6, 5]],
    [{ rail: 'tacticalLight' as const, grip: 'ergonomicGrip' as const }, [3, 7, 6]],
  ])('연쇄→연쇄→일반탄과 장착물 조합 %j', (loadout, expected) => {
    const result = resolver.resolveSequence(['impactRelay', 'impactRelay', 'ball'], target(), { loadout });
    expect(result.shots.map(shot => shot.actionShockApplied)).toEqual(expected);
  });

  it('화력 연계와 충격 연계는 독립적으로 다음 한 발을 강화한다', () => {
    const result = resolver.resolveSequence(['relay', 'impactRelay', 'ball'], target());
    expect(result.shots[1]!.breakdown.followUpBonus).toBe(4);
    expect(result.shots[2]!.breakdown.followUpBonus).toBe(0);
    expect(result.shots[2]!.breakdown.shockFollowUpBonus).toBe(3);
    const reverse = resolver.resolveSequence(['impactRelay', 'relay', 'ball'], target());
    expect(reverse.shots[1]!.actionShockApplied).toBe(3);
    expect(reverse.shots[2]!.actionShockApplied).toBe(0);
    expect(reverse.shots[2]!.breakdown.followUpBonus).toBe(4);
  });

  it('연쇄 충격은 다음 탄창·표적에 이월하지 않는다', () => {
    const primed = resolver.resolveSequence(['impactRelay'], target()).finalState;
    const afterTurn = resolver.resolveEnemyAction(primed).after;
    expect(resolver.resolveShot('ball', 0, afterTurn).actionShockApplied).toBe(0);
    expect(resolver.resolveSequence(['ball'], createEnemyState('normal')).totalActionShockApplied).toBe(0);
  });

  it.each([[0, 2], [1, 2], [2, 3], [3, 3], [4, 4], [6, 5], [8, 6], [100000, 6]])(
    '충격증폭탄은 사격 직전 충격 %i에서 충격 %i를 적용하며 추가량을 제한한다', (current, expected) => {
      const shot = resolver.resolveShot('resonance', 0, target({ actionShock: current }));
      expect(shot.actionShockApplied).toBe(expected);
      expect(shot.after.actionShock).toBe(current + expected);
    });

  it('증폭 계산은 이번 연쇄·조명 충격을 재투입하지 않고 취약·거리·반동 감쇠와 분리한다', () => {
    const sequence = resolver.resolveSequence(['impactRelay', 'resonance'], target({ actionShock: 3, vulnerableTurns: 2 }),
      { loadout: { rail: 'tacticalLight' } });
    // 첫 발 충격 3으로 기존 3→6, 둘째 발은 기본 2 + 기존 충격 증폭 3 + 연쇄 3 + 조명 2.
    expect(sequence.shots[1]!.actionShockApplied).toBe(10);
    expect(sequence.shots[1]!.breakdown.shockScaleBonus).toBe(3);
    const far = resolver.resolveSequence(['plusP', 'plusP', 'resonance'], target({ distance: 11, actionShock: 4 }),
      { playerState: { ...createPlayerCombatState(), heavyKickPenaltyBonus: 1 } });
    expect(far.shots[2]!.breakdown.effectiveFirepower).toBe(0);
    expect(far.shots[2]!.actionShockApplied).toBe(4);
  });

  it('적 행동은 임계치만 소비하고 남은 충격을 다음 증폭 기준으로 사용한다', () => {
    const fired = resolver.resolveShot('hammer', 0, target()).after;
    const action = resolver.resolveEnemyAction(fired);
    expect(action.interrupted).toBe(true);
    expect(action.shockConsumed).toBe(4);
    expect(action.after.actionShock).toBe(2);
    expect(resolver.resolveShot('resonance', 0, action.after).actionShockApplied).toBe(3);
    const ground = createEnemyState('groundshaker');
    expect(getActionShockThreshold(ground)).toBe(9);
    const lit = resolver.resolveShot('hammer', 0, ground, { loadout: { rail: 'tacticalLight' } });
    expect(resolver.resolveEnemyAction(lit.after).interrupted).toBe(false);
  });

  it('충격 계열 모두 기존 폭발을 기폭하고 연쇄로 강화한 일반탄도 기폭한다', () => {
    for (const ammo of ['reducedImpact', 'hammer', 'impactRelay', 'resonance'] as const) {
      const shot = resolver.resolveShot(ammo, 0, target({ explosive: 4 }));
      expect(shot.explosiveConsumed).toBe(4);
      expect(shot.explosionDamage).toBe(8);
      expect(shot.after.explosive).toBe(0);
    }
    const result = resolver.resolveSequence(['impactRelay', 'explosive', 'ball'], target());
    expect(result.shots[1]!.explosiveApplied).toBe(2);
    expect(result.shots[1]!.explosionDamage).toBe(4);
    expect(result.shots[1]!.after.explosive).toBe(0);
    expect(result.shots[2]!.actionShockApplied).toBe(0);
  });

  it('예측 충격과 실제 충격이 일치하고 원본을 변경하지 않으며 처치 뒤 탄을 소모하지 않는다', () => {
    const enemy = target({ hp: 3, explosive: 4, actionShock: 2 });
    const saved = structuredClone(enemy);
    const result = resolver.resolveSequence(['reducedImpact', 'impactRelay', 'resonance'], enemy);
    expect(result.shots).toHaveLength(1);
    expect(result.shots[0]!.actionShockApplied).toBe(0);
    expect(result.roundPreviews[0]!.effectiveActionShock).toBe(2);
    expect(result.unfiredRounds).toEqual(['impactRelay', 'resonance']);
    expect(result.roundPreviews).toHaveLength(3);
    expect(enemy).toEqual(saved);
    const durable = resolver.resolveSequence(['impactRelay', 'hammer', 'resonance'], target());
    expect(durable.roundPreviews.map(round => round.effectiveActionShock)).toEqual(durable.shots.map(shot => shot.actionShockApplied));
  });

  it('보상으로 획득한 네 탄약은 다음 스테이지에서 장전·소모·재보급된다', () => {
    const seen = new Set<string>();
    for (let index = 0; index < 100; index++) {
      let roll = 0;
      generateAmmoRewards(() => roll++ % 2 === 0 ? 0 : index / 100).forEach(ammo => seen.add(ammo));
    }
    for (const ammo of ['reducedImpact', 'hammer', 'impactRelay', 'resonance'] as const) {
      expect(seen.has(ammo)).toBe(true);
      expect(AMMO_DEFINITIONS[ammo].name).toBeTruthy();
      const player = new Player();
      expect(player.applyAmmoReward(ammo)).toBe(true);
      player.startStage();
      expect(player.addAmmo(ammo)).toBe(true);
      player.fireRound({ ammoType: ammo });
      expect(player.getStock()[ammo]).toBe(0);
      player.startStage();
      expect(player.getStock()[ammo]).toBe(1);
    }
  });
});
