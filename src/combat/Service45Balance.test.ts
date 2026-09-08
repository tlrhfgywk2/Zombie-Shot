import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS } from '../data/ammoDefinitions';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_ORDER, type AttachmentId } from '../data/attachmentDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { createPlayerCombatState } from './AttachmentLoadout';
import { CombatResolver, isNearestValidTarget } from './CombatResolver';

const resolver = new CombatResolver();
const target = (distance = 3) => ({ ...createEnemyState('tough'), hp: 1000, maxHp: 1000, armor: 0, distance });
const loadout = (id: AttachmentId) => ({ [ATTACHMENT_DEFINITIONS[id].slot]: id });

describe('서비스 .45 확정 v1 효과', () => {
  it.each(['compactCompensator', 'highVisibilitySight', 'rubberGrip', 'compactReflexSight'] as const)('%s는 정확도에 정수 1을 더한다', id => {
    expect(resolver.resolveShot('standard', 0, target(), { loadout: loadout(id) }).breakdown.accuracyModifier).toBe(1);
  });
  it('탄약 페널티 감소는 음수 정확도를 0까지만 정수 단위로 줄인다', () => {
    const original = AMMO_DEFINITIONS.overpressure.accuracyModifier;
    AMMO_DEFINITIONS.overpressure.accuracyModifier = -2;
    try {
      const playerState = createPlayerCombatState(); playerState.accuracyPenalty = -2;
      const shot = resolver.resolveShot('overpressure', 0, target(), { playerState, loadout: { muzzle: 'dualPortCompensator', grip: 'g10Grip' } });
      expect(shot.breakdown.accuracyModifier).toBe(-1);
    } finally { AMMO_DEFINITIONS.overpressure.accuracyModifier = original; }
    const boosted = resolver.resolveShot('match', 0, target(), { loadout: { muzzle: 'dualPortCompensator', grip: 'g10Grip' } });
    expect(boosted.breakdown.accuracyModifier).toBe(3);
  });
  it('탄약 반동 감소는 작은 정수로 중첩되고 0 아래로 내려가지 않는다', () => {
    expect(resolver.resolveShot('overpressure', 0, target()).breakdown.recoilGenerated).toBe(2);
    expect(resolver.resolveShot('overpressure', 0, target(), { loadout: { muzzle: 'dualPortCompensator' } }).breakdown.recoilGenerated).toBe(1);
    expect(resolver.resolveShot('overpressure', 0, target(), { loadout: { muzzle: 'dualPortCompensator', grip: 'g10Grip' } }).breakdown.recoilGenerated).toBe(0);
  });
  it('반사 조준기는 중거리 페널티만 1 줄이고 초음파 거리 악화를 보존한다', () => {
    for (const [distance, penalty] of [[3, 0], [7, 0], [11, 2]]) {
      expect(resolver.resolveShot('standard', 0, target(distance), { loadout: { optic: 'compactReflexSight' } }).breakdown.rangePenalty).toBe(penalty);
    }
    const playerState = createPlayerCombatState(); playerState.rangePenaltySteps = 1;
    const shot = resolver.resolveShot('standard', 0, target(7), { playerState, loadout: { optic: 'compactReflexSight' } });
    expect(shot.breakdown.rangePenalty).toBe(1);
  });
  it('레이저는 근거리만 +1이고 모듈은 가장 가까운 살아 있는 표적에만 +1을 더한다', () => {
    const near = target(3), mid = target(7), dead = { ...target(1), hp: 0 };
    expect(isNearestValidTarget(near, [near, mid, dead])).toBe(true);
    expect(isNearestValidTarget(mid, [near, mid])).toBe(false);
    expect(isNearestValidTarget(dead, [dead])).toBe(false);
    expect(resolver.resolveShot('standard', 0, near, { loadout: loadout('compactLaserSight') }).breakdown.accuracyModifier).toBe(1);
    expect(resolver.resolveShot('standard', 0, mid, { loadout: loadout('compactLaserSight') }).breakdown.accuracyModifier).toBe(0);
    expect(resolver.resolveShot('standard', 0, near, { loadout: loadout('laserLightModule') }).breakdown.accuracyModifier).toBe(2);
    expect(resolver.resolveShot('standard', 0, mid, { loadout: loadout('laserLightModule') }).breakdown.accuracyModifier).toBe(1);
    expect(resolver.resolveShot('standard', 0, mid, { targets: [near, mid], loadout: loadout('laserLightModule') }).breakdown.accuracyModifier).toBe(0);
  });
  it.each(ATTACHMENT_ORDER)('%s는 봉쇄 시 효과가 없고 피해·축적 배율을 직접 올리지 않는다', id => {
    const playerState = createPlayerCombatState(); playerState.disabledSlots[ATTACHMENT_DEFINITIONS[id].slot] = 2;
    const baseline = resolver.resolveShot('overpressure', 0, target());
    const blocked = resolver.resolveShot('overpressure', 0, target(), { playerState, loadout: loadout(id) });
    expect(blocked.breakdown).toEqual(baseline.breakdown);
    expect(ATTACHMENT_DEFINITIONS[id].modifiers.every(m => ['accuracy', 'firepower', 'capacity', 'ammoPenaltyReduction', 'rangePenaltyReduction'].includes(m.kind))).toBe(true);
  });

  it('서로 다른 슬롯의 정확도 장착물은 정수로 가산 중첩된다', () => {
    const shot = resolver.resolveShot('standard', 0, target(), { loadout: { muzzle: 'compactCompensator', optic: 'highVisibilitySight', grip: 'rubberGrip' } });
    expect(shot.breakdown.accuracyModifier).toBe(3);
    expect(shot.breakdown.finalFirepower).toBe(7);
  });
});
