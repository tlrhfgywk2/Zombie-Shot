import { describe, expect, it } from 'vitest';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_ORDER, type AttachmentId } from '../data/attachmentDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { createPlayerCombatState } from './AttachmentLoadout';
import { CombatResolver, getVisualKickScale, isNearestValidTarget } from './CombatResolver';

const resolver = new CombatResolver();
const target = (distance = 3) => ({ ...createEnemyState('tough'), hp: 1000, maxHp: 1000, armor: 0, distance });
const loadout = (id: AttachmentId) => ({ [ATTACHMENT_DEFINITIONS[id].slot]: id });

describe('서비스 .45 장착물 효과', () => {
  it('총구와 손잡이는 총기 흔들림 연출을 완전히 지우지 않는 비율로 제어한다', () => {
    expect(getVisualKickScale(target())).toBe(1);
    expect(getVisualKickScale(target(), { loadout: loadout('compactCompensator') })).toBe(0.8);
    expect(getVisualKickScale(target(), { loadout: loadout('dualPortCompensator') })).toBe(0.65);
    expect(getVisualKickScale(target(), { loadout: loadout('rubberGrip') })).toBe(0.85);
    expect(getVisualKickScale(target(), { loadout: loadout('g10Grip') })).toBe(0.75);
  });

  it('서로 다른 슬롯의 총기 흔들림 연출 감소는 곱연산되어 총기 흔들림 연출을 0으로 만들지 않는다', () => {
    const scale = getVisualKickScale(target(), { loadout: { muzzle: 'dualPortCompensator', grip: 'g10Grip' } });
    expect(scale).toBeCloseTo(0.4875);
    expect(scale).toBeGreaterThan(0);
  });

  it('가늠쇠와 반사 조준기는 명시된 거리 손실만 완화한다', () => {
    const sight = [3, 7, 11].map(distance => resolver.resolveSequence(['standard'], target(distance), { loadout: loadout('highVisibilitySight') }).finalRangePenaltyPercent);
    const reflex = [3, 7, 11].map(distance => resolver.resolveSequence(['standard'], target(distance), { loadout: loadout('compactReflexSight') }).finalRangePenaltyPercent);
    expect(sight).toEqual([0, 0, 25]);
    expect(reflex).toEqual([0, 0, 15]);
  });

  it('반사 조준기는 초음파로 악화된 실제 원거리 손실을 완화한다', () => {
    const playerState = createPlayerCombatState();
    playerState.rangePenaltySteps = 1;
    const sequence = resolver.resolveSequence(['standard'], target(7), { playerState, loadout: loadout('compactReflexSight') });
    expect(sequence.shots[0]?.breakdown.effectiveRangeBand).toBe('far');
    expect(sequence.finalRangePenaltyPercent).toBe(15);
  });

  it('매치탄은 반사 조준기가 만든 기본 감소에서 발사 순서 전체 3%p를 추가 완화한다', () => {
    const sequence = resolver.resolveSequence(['match'], target(11), { loadout: loadout('compactReflexSight') });
    expect(sequence.baseRangePenaltyPercent).toBe(15);
    expect(sequence.finalRangePenaltyPercent).toBe(12);
    expect(sequence.rawVolleyFirepower).toBe(3);
    expect(sequence.finalVolleyFirepower).toBe(3);
  });

  it('레이저는 범위와 가장 가까운 유효 표적 조건에서만 총기 흔들림 연출을 줄인다', () => {
    const near = target(3), mid = target(7), dead = { ...target(1), hp: 0 };
    expect(isNearestValidTarget(near, [near, mid, dead])).toBe(true);
    expect(isNearestValidTarget(mid, [near, mid])).toBe(false);
    expect(isNearestValidTarget(dead, [dead])).toBe(false);
    expect(getVisualKickScale(near, { loadout: loadout('compactLaserSight') })).toBe(0.85);
    expect(getVisualKickScale(mid, { loadout: loadout('compactLaserSight') })).toBe(1);
    expect(getVisualKickScale(near, { loadout: loadout('laserLightModule') })).toBeCloseTo(0.72);
    expect(getVisualKickScale(mid, { loadout: loadout('laserLightModule') })).toBe(0.9);
    expect(getVisualKickScale(mid, { targets: [near, mid], loadout: loadout('laserLightModule') })).toBe(1);
  });

  it.each(ATTACHMENT_ORDER)('%s는 봉쇄 시 효과가 없고 허용된 명시 효과만 가진다', id => {
    const playerState = createPlayerCombatState();
    playerState.disabledSlots[ATTACHMENT_DEFINITIONS[id].slot] = 2;
    const baseline = resolver.resolveShot('overpressure', 0, target());
    const blocked = resolver.resolveShot('overpressure', 0, target(), { playerState, loadout: loadout(id) });
    expect(blocked.breakdown).toEqual(baseline.breakdown);
    expect(ATTACHMENT_DEFINITIONS[id].modifiers.every(modifier => ['firepower', 'capacity', 'visualKickReductionPercent', 'rangePenaltyReductionPercent'].includes(modifier.kind))).toBe(true);
  });
});
