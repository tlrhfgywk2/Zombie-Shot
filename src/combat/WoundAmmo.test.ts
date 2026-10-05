import { describe, expect, it } from 'vitest';
import { CombatResolver } from './CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import { AMMO_DEFINITIONS, AMMO_ORDER, createAmmoBuild } from '../data/ammoDefinitions';
import { Player } from '../entities/Player';
import type { EnemyState } from './types';

const resolver = new CombatResolver();
const target = (changes: Partial<EnemyState> = {}): EnemyState =>
  ({ ...createEnemyState('normal'), hp: 100, maxHp: 100, distance: 3, ...changes });

describe('상처계열 특수탄', () => {
  it('돌진 절개탄을 제거하고 새 네 탄을 보급·장전에 포함한다', () => {
    expect(AMMO_ORDER).not.toContain('advanceCutter');
    expect(createAmmoBuild()).not.toHaveProperty('advanceCutter');
    const player = new Player();
    for (const ammo of ['rupture', 'deepCut', 'reopening', 'scar'] as const) {
      expect(AMMO_DEFINITIONS[ammo]).toMatchObject({ family: 'WOUND', primaryPayload: 'wound' });
      expect(player.supplyAmmo(ammo)).toBe(true);
      expect(player.addAmmo(ammo)).toBe(true);
    }
    expect(player.magazine.getRounds()).toEqual(['rupture', 'deepCut', 'reopening', 'scar']);
  });

  it('파열탄은 자신이 임계치를 채울 때만 추가 피해를 한 번 준다', () => {
    expect(resolver.resolveShot('rupture', 0, target())).toMatchObject({ hpDamage: 2, ruptureDamage: 0, vulnerableTriggered: false });
    expect(resolver.resolveShot('rupture', 0, target({ vulnerableTurns: 1 })))
      .toMatchObject({ hpDamage: 3, ruptureDamage: 0 });
    const shot = resolver.resolveShot('rupture', 0, target({ wound: 3 }));
    expect(shot).toMatchObject({ hpDamage: 6, ruptureDamage: 4, vulnerableTriggered: true,
      after: { wound: 0, vulnerableTurns: 2 }, breakdown: { finalFirepower: 6, ruptureDamage: 4 } });
    expect(resolver.resolveShot('rupture', 0, target({ woundThreshold: 1 })).ruptureDamage).toBe(4);
  });

  it('파열 피해는 거리·취약 배율·반동 감점과 독립되며 계산 내역이 일치한다', () => {
    const sequence = resolver.resolveSequence(['plusP', 'plusP', 'rupture'], target({ wound: 3, distance: 11, vulnerableTurns: 1 }));
    const shot = sequence.shots[2]!;
    expect(shot.ruptureDamage).toBe(4);
    expect(shot.breakdown.recoilFirepowerReduction).toBeGreaterThan(0);
    const total = sequence.firepowerBreakdown;
    expect(total.ruptureDamage).toBe(4);
    expect(total.prePenaltyFirepower - total.recoilReduction - total.playerDebuffReduction - total.distanceReduction).toBe(total.finalFirepower);
    expect(total.finalFirepower).toBe(sequence.totalHpDamage);
  });

  it('파열로 처치하면 추가 피해를 남은 체력으로 제한하고 뒤 탄을 발사하지 않는다', () => {
    const sequence = resolver.resolveSequence(['rupture', 'reopening', 'scar'], target({ hp: 5, wound: 3, burn: 7, ignitedActions: 1 }));
    expect(sequence.shots[0]).toMatchObject({ hpDamage: 5, ruptureDamage: 3, killed: true,
      after: { hp: 0, burn: 0, ignitedActions: 0, vulnerableTurns: 0 } });
    expect(sequence.unfiredRounds).toEqual(['reopening', 'scar']);
    expect(resolver.resolveShot('rupture', 0, target({ hp: 2, wound: 3 })))
      .toMatchObject({ vulnerableTriggered: false, ruptureDamage: 0, woundApplied: 0 });
  });

  it('심부 절개는 발동 시 3턴으로 갱신하며 매 턴 감소하고 반복 발동을 합산하지 않는다', () => {
    const triggered = resolver.resolveShot('deepCut', 0, target({ wound: 3 })).after;
    expect(triggered.vulnerableTurns).toBe(3);
    const refreshed = resolver.resolveSequence(['deepCut', 'deepCut'], triggered).finalState;
    expect(refreshed.vulnerableTurns).toBe(3);
    expect(resolver.resolveSequence(['wounding', 'wounding'], triggered).finalState.vulnerableTurns).toBe(3);
    let state = triggered;
    for (const remaining of [2, 1, 0]) {
      state = resolver.resolveEnemyAction(state).after;
      expect(state.vulnerableTurns).toBe(remaining);
    }
    expect(resolver.resolveShot('deepCut', 0, target({ vulnerableTurns: 1 })).after.vulnerableTurns).toBe(1);
  });

  it('재개방은 이미 취약한 표적에 상처 6을 주고 자신의 발동을 소급 적용하지 않는다', () => {
    expect(resolver.resolveShot('reopening', 0, target({ wound: 3 })))
      .toMatchObject({ woundApplied: 3, vulnerableTriggered: true, after: { wound: 0 } });
    expect(resolver.resolveShot('reopening', 0, target({ vulnerableTurns: 1 })))
      .toMatchObject({ woundApplied: 6, vulnerableTriggered: true, after: { wound: 0, vulnerableTurns: 2 } });
    const sequence = resolver.resolveSequence(['wounding', 'reopening', 'reopening'], target());
    expect(sequence.shots.map(shot => shot.woundApplied)).toEqual([3, 3, 6]);
    expect(sequence.roundPreviews.map(round => round.wound)).toEqual([3, 3, 6]);
    expect(resolver.resolveShot('reopening', 0, target({ vulnerableTurns: 0 })).woundApplied).toBe(3);
  });

  it('흉터는 발동 후 초과분과 상처 2를 남겨 다음 발동을 앞당긴다', () => {
    expect(resolver.resolveShot('scar', 0, target()).after.wound).toBe(3);
    const scarred = resolver.resolveShot('scar', 0, target({ wound: 3 })).after;
    expect(scarred).toMatchObject({ wound: 2, vulnerableTurns: 2 });
    expect(resolver.resolveEnemyAction(scarred).after.wound).toBe(2);
    const sequence = resolver.resolveSequence(['scar', 'scar'], target({ wound: 5 }));
    expect(sequence.shots.map(shot => shot.vulnerableTriggered)).toEqual([true, true]);
    expect(sequence.shots.map(shot => shot.after.wound)).toEqual([4, 3]);
  });

  it('흉터는 무기 강화·작은 임계치에서도 초과분을 보존하되 발동 준비 상태를 남기지 않는다', () => {
    expect(resolver.resolveShot('scar', 0, target({ wound: 5 }), { weaponId: 'm500', boostedOpening: true }).after.wound).toBe(5);
    expect(resolver.resolveShot('scar', 0, target({ woundThreshold: 2 })).after.wound).toBe(1);
    expect(resolver.resolveShot('scar', 0, target({ woundThreshold: 1 })).after.wound).toBe(0);
  });

  it('무기 특성은 주효과 상처만 강화하고 네 탄의 특수 효과 수치는 유지한다', () => {
    for (const ammo of ['rupture', 'deepCut', 'reopening', 'scar'] as const) {
      const shot = resolver.resolveShot(ammo, 0, target({ wound: 3, vulnerableTurns: 1 }), { weaponId: 'm500', boostedOpening: true });
      expect(shot.woundApplied).toBe(ammo === 'reopening' ? 8 : 5);
      expect(shot.breakdown.traitBonus).toBe(2);
      expect(shot.ruptureDamage).toBe(ammo === 'rupture' ? 4 : 0);
      expect(shot.after.vulnerableTurns).toBe(ammo === 'deepCut' ? 3 : 2);
      expect(shot.after.wound).toBe(ammo === 'scar' ? 4 : ammo === 'reopening' ? 5 : 2);
    }
  });
});
