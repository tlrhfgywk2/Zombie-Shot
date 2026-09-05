import { describe, expect, it } from 'vitest';
import { AMMO_DEFINITIONS, COMBAT_BALANCE } from '../data/ammoDefinitions';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_ORDER, type AttachmentId } from '../data/attachmentDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { createPlayerCombatState } from './AttachmentLoadout';
import { CombatResolver, isNearestValidTarget } from './CombatResolver';

const resolver = new CombatResolver();
const target = (distance = 3) => ({ ...createEnemyState('tough'), hp: 1000, maxHp: 1000, armor: 0, distance });
const loadout = (id: AttachmentId) => ({ [ATTACHMENT_DEFINITIONS[id].slot]: id });

describe('서비스 .45 확정 v1 효과', () => {
  it.each(['compactCompensator', 'highVisibilitySight', 'rubberGrip', 'compactReflexSight'] as const)('%s는 정확도에 정확히 5%%p를 더한다', id => {
    expect(resolver.resolveShot('standard', 0, target(), { loadout: loadout(id) }).breakdown.accuracy).toBe(105);
  });
  it('음수 탄약 보정만 곱하고 중첩 시 -30%p가 -16.8%p가 된다', () => {
    const original = AMMO_DEFINITIONS.overpressure.accuracy;
    AMMO_DEFINITIONS.overpressure.accuracy = -30;
    try {
      const playerState = createPlayerCombatState(); playerState.accuracyPenalty = -22;
      const shot = resolver.resolveShot('overpressure', 0, target(), { playerState, loadout: { muzzle: 'dualPortCompensator', grip: 'g10Grip' } });
      expect(shot.breakdown.accuracy).toBeCloseTo(100 + 5 - 22 - 16.8);
    } finally { AMMO_DEFINITIONS.overpressure.accuracy = original; }
    const boosted = resolver.resolveShot('match', 0, target(), { loadout: { muzzle: 'dualPortCompensator', grip: 'g10Grip' } });
    expect(boosted.breakdown.accuracy).toBe(121);
  });
  it('탄약 반동은 곱셈 중첩하지만 무기 반동과 적 방해는 경감하지 않는다', () => {
    const original = COMBAT_BALANCE.weaponRecoil;
    Object.assign(COMBAT_BALANCE, { weaponRecoil: 10 });
    try {
      const shot = resolver.resolveShot('overpressure', 0, target(), { loadout: { muzzle: 'dualPortCompensator', grip: 'g10Grip' } });
      expect(shot.breakdown.recoilGenerated).toBeCloseTo(10 + 22 * 0.7 * 0.8);
    } finally { Object.assign(COMBAT_BALANCE, { weaponRecoil: original }); }
  });
  it('반사 조준기는 중거리 손실만 절반으로 줄이고 초음파 방해는 보존한다', () => {
    for (const [distance, multiplier] of [[3, 1], [7, 0.95], [11, 0.72]]) {
      expect(resolver.resolveShot('standard', 0, target(distance), { loadout: { optic: 'compactReflexSight' } }).breakdown.rangeMultiplier).toBeCloseTo(multiplier!);
    }
    const playerState = createPlayerCombatState(); playerState.rangePenaltySteps = 1;
    const shot = resolver.resolveShot('standard', 0, target(7), { playerState, loadout: { optic: 'compactReflexSight' } });
    expect(shot.breakdown.rangeMultiplier).toBeCloseTo((0.72 + 0.05) * 0.88);
  });
  it('레이저는 근거리만 +10%p이고 모듈은 가장 가까운 살아 있는 표적에만 추가 +5%p이다', () => {
    const near = target(3), mid = target(7), dead = { ...target(1), hp: 0 };
    expect(isNearestValidTarget(near, [near, mid, dead])).toBe(true);
    expect(isNearestValidTarget(mid, [near, mid])).toBe(false);
    expect(isNearestValidTarget(dead, [dead])).toBe(false);
    expect(resolver.resolveShot('standard', 0, near, { loadout: loadout('compactLaserSight') }).breakdown.accuracy).toBe(110);
    expect(resolver.resolveShot('standard', 0, mid, { loadout: loadout('compactLaserSight') }).breakdown.accuracy).toBe(100);
    expect(resolver.resolveShot('standard', 0, near, { loadout: loadout('laserLightModule') }).breakdown.accuracy).toBe(115);
    expect(resolver.resolveShot('standard', 0, mid, { loadout: loadout('laserLightModule') }).breakdown.accuracy).toBe(105);
    expect(resolver.resolveShot('standard', 0, mid, { targets: [near, mid], loadout: loadout('laserLightModule') }).breakdown.accuracy).toBe(100);
  });
  it.each(ATTACHMENT_ORDER)('%s는 봉쇄 시 효과가 없고 피해·축적 배율을 직접 올리지 않는다', id => {
    const playerState = createPlayerCombatState(); playerState.disabledSlots[ATTACHMENT_DEFINITIONS[id].slot] = 2;
    const baseline = resolver.resolveShot('overpressure', 0, target());
    const blocked = resolver.resolveShot('overpressure', 0, target(), { playerState, loadout: loadout(id) });
    expect(blocked.breakdown).toEqual(baseline.breakdown);
    expect(ATTACHMENT_DEFINITIONS[id].modifiers.every(m => ['accuracy', 'capacity', 'ammoPenaltyMultiplier', 'midRangePenaltyMultiplier'].includes(m.kind))).toBe(true);
  });
});
