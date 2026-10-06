import { describe, expect, it } from 'vitest';
import { CombatResolver } from './CombatResolver';
import { commitMagazine, conditionMatches, emptyPayload, resolveAmmoRules, symmetricSlot } from './AmmoRules';
import { AMMO_DEFINITIONS, AMMO_ORDER } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { Player } from '../entities/Player';
import { WEAPON_ORDER, WEAPON_DEFINITIONS } from '../data/weaponDefinitions';
import { generateAmmoRewards } from '../progression/AmmoRewards';
import type { AmmoType, EnemyState } from './types';

const resolver = new CombatResolver();
const enemy = (extra: Partial<EnemyState> = {}): EnemyState => ({ ...createEnemyState('normal'), hp: 500, maxHp: 500, distance: 3, ...extra });
const volley = (rounds: readonly AmmoType[], capacity = Math.max(4, rounds.length), extra: Partial<EnemyState> = {}) =>
  resolver.resolveSequence(rounds, enemy(extra), { magazineCapacity: capacity });
const primary = (rounds: readonly AmmoType[], index: number, capacity = Math.max(4, rounds.length)) => volley(rounds, capacity).shots[index]!.breakdown.resolvedPrimary;

describe('독립 계열·계층과 공용 조건', () => {
  it('연계와 배열이 체력 계열을 바꾸거나 새 적 상태를 만들지 않는다', () => {
    expect(AMMO_DEFINITIONS.mosaic).toMatchObject({ family: 'HEALTH', category: 'layout', layers: ['enemy', 'magazine'] });
    expect(AMMO_DEFINITIONS.relay).toMatchObject({ family: 'HEALTH', category: 'sequence', layers: ['enemy', 'ammo'] });
    expect(new Set(AMMO_ORDER.map(ammo => AMMO_DEFINITIONS[ammo].family))).toEqual(new Set(['HEALTH', 'EXPLOSION', 'BURN', 'WOUND', 'IMPACT']));
  });
  it('직전·다음 계열 같음/다름 조건은 없는 이웃을 성공시키지 않는다', () => {
    const magazine = commitMagazine(['ball', 'wounding', 'explosive'], 4);
    for (const type of ['previousFamily', 'nextFamily'] as const) {
      expect(conditionMatches({ type, relation: 'different' }, { magazine, index: 1, previousFamily: 'HEALTH' })).toBe(true);
      expect(conditionMatches({ type, relation: 'same' }, { magazine, index: 1, previousFamily: 'WOUND' })).toBe(type === 'previousFamily');
    }
    expect(conditionMatches({ type: 'previousFamily', relation: 'different' }, { magazine, index: 0 })).toBe(false);
    expect(conditionMatches({ type: 'nextFamily', relation: 'different' }, { magazine, index: 2 })).toBe(false);
    const definition = { ...AMMO_DEFINITIONS.ball, rules: [{ layer: 'ammo' as const, condition: { type: 'nextFamily' as const, relation: 'different' as const }, action: { type: 'self' as const, target: 'primary' as const, mode: 'add' as const, amount: 2 } }] };
    expect(resolveAmmoRules(definition, { ...emptyPayload(), firepower: 5 }, { magazine, index: 0 }).payload.firepower).toBe(7);
  });
  it('교차탄은 실제 직전 탄과 다른 계열에서만 강화된다', () => {
    expect(primary(['wounding', 'alternator'], 1).firepower).toBe(6);
    expect(primary(['ball', 'alternator'], 1).firepower).toBe(2);
    expect(primary(['alternator'], 0).firepower).toBe(2);
  });
  it.each([
    ['wounding', 'bridge', 'explosive', 'ball'], ['explosive', 'bridge', 'wounding', 'ball'],
    ['ball', 'bridge', 'heavy', 'ball'],
  ] as const)('매개탄 %s → %s → %s는 다음 주효과만 한 번 강화한다', (...rounds) => {
    const result = volley(rounds);
    const next = AMMO_DEFINITIONS[rounds[2]];
    for (const key of next.primaryEffects) expect(result.shots[2]!.breakdown.resolvedPrimary[key]).toBe(next[key] + Math.floor(next[key] / 2));
    expect(result.shots[3]!.breakdown.resolvedPrimary.firepower).toBe(5);
  });
  it.each([['bridge', 'explosive'], ['wounding', 'bridge'], ['wounding', 'bridge', 'wounding']] as const)('매개탄은 빠진 이웃·같은 계열에서 비활성이다: %s', (...rounds) => {
    const shot = volley(rounds).shots.find(shot => shot.ammoType === 'bridge')!;
    expect(shot.breakdown.layerActivations[0]?.active).toBe(false);
  });
  it('이전 배열 강화 뒤 다음 매개 강화는 현재 주효과에만 적용한다', () => {
    expect(primary(['wounding', 'bridge', 'finisher'], 2).firepower).toBe(10);
    expect(primary(['relay', 'finisher'], 1).firepower).toBe(11);
    expect(primary(['impactRelay', 'opening'], 1)).toMatchObject({ firepower: 3, actionShock: 0 });
    expect(volley(['impactRelay', 'opening']).shots[1]!.actionShockApplied).toBe(3);
  });
});

describe('주효과 복사·재발동의 값 경계', () => {
  it.each(['ball', 'wounding', 'explosive', 'incendiary', 'flatNose', 'heavy', 'ignition'] as const)('%s의 명시적 주효과만 복사한다', ammo => {
    const shots = volley([ammo, 'mimic']).shots;
    expect(shots[1]!.breakdown.resolvedPrimary).toEqual(shots[0]!.breakdown.resolvedPrimary);
    expect(shots[1]!.burnDamage).toBe(0);
    if (ammo === 'incendiary') expect(shots[1]!.breakdown.resolvedPrimary).toMatchObject({ firepower: 0, burn: 8 });
    if (ammo === 'heavy') expect(shots[1]!.breakdown.resolvedPrimary).toMatchObject({ firepower: 3, actionShock: 2 });
  });
  it('상처 임계치로 취약을 발동하며 같은 탄의 체력 피해를 새 취약으로 키우지 않는다', () => {
    const result = volley(['wounding', 'mimic', 'ball']);
    expect(result.shots[1]).toMatchObject({ vulnerableTriggered: true, hpDamage: 0, after: { wound: 0, vulnerableTurns: 2 } });
    expect(result.shots[2]!.hpDamage).toBe(8);
  });
  it('복사 충격은 기폭하며 행동 단계에 임계치만 소비한다', () => {
    const result = volley(['explosive', 'reducedImpact', 'mimic']);
    expect(result.shots[1]!.explosionDamage).toBe(4);
    expect(result.totalActionShockApplied).toBe(4);
    expect(resolver.resolveEnemyAction(result.finalState)).toMatchObject({ interrupted: true, shockConsumed: 4, shockRemaining: 0 });
  });
  it('복사한 화상 축적은 기존 점화 규칙을 따른다', () => {
    expect(volley(['highHeat', 'mimic']).shots[1]).toMatchObject({ burnApplied: 12, burnDamage: 0, ignitionTriggered: true, after: { burn: 4 } });
  });
  it('취약·거리·반동은 복사 수치에 들어가지 않고 현재 탄에서 다시 평가한다', () => {
    const result = volley(['ball', 'mimic'], 4, { distance: 12, vulnerableTurns: 2 });
    expect(result.shots.map(shot => shot.breakdown.resolvedPrimary.firepower)).toEqual([5, 5]);
    expect(result.shots.map(shot => shot.hpDamage)).toEqual([6, 7]);
  });
  it('후퇴·취약 발동 부가효과·전달 규칙은 복사하지 않는다', () => {
    expect(volley(['retreat', 'mimic']).shots.map(shot => shot.movement)).toEqual([2, 0]);
    const rupture = volley(['rupture', 'mimic'], 4, { wound: 3 }).shots;
    expect(rupture[0]!.ruptureDamage).toBe(4);
    expect(rupture[1]!.ruptureDamage).toBe(0);
    expect(primary(['relay', 'mimic', 'ball'], 2).firepower).toBe(5);
    expect(volley(['scar', 'mimic'], 4, { wound: 3 }).shots[1]!.after.wound).toBe(5);
  });
  it('잔향탄은 자신의 화력과 직전 주효과의 절반을 합산하며 각 수치는 버림한다', () => {
    expect(primary(['plusP', 'afterimage'], 1).firepower).toBe(5);
    expect(primary(['wounding', 'afterimage'], 1)).toMatchObject({ firepower: 1, wound: 1 });
    expect(primary(['heavy', 'afterimage'], 1)).toMatchObject({ firepower: 2, actionShock: 1 });
  });
  it('첫 복사탄은 빈 효과, 첫 잔향탄은 기본 화력만 가진다', () => {
    expect(primary(['mimic'], 0)).toEqual(emptyPayload());
    expect(primary(['afterimage'], 0).firepower).toBe(1);
  });
  it.each(WEAPON_ORDER)('%s 무기 조정과 회전도 첫 복사탄에 피해를 생성하거나 복사값을 다시 배증하지 않는다', weaponId => {
    const context = { weaponId, boostedOpening: true };
    expect(resolver.resolveSequence(['mimic'], enemy(), context).shots[0]!.breakdown.resolvedPrimary).toEqual(emptyPayload());
    const shots = resolver.resolveSequence(['plusP', 'mimic'], enemy(), context).shots;
    expect(shots[1]!.breakdown.resolvedPrimary).toEqual(shots[0]!.breakdown.resolvedPrimary);
  });
  it('배열 증폭은 복사되지만 배열 검사 자체는 복사하지 않는다', () => {
    expect(volley(['opening', 'mimic', 'afterimage', 'mimic']).shots.map(shot => shot.breakdown.resolvedPrimary.firepower)).toEqual([6, 6, 4, 4]);
  });
  it('다른 복사·재발동 옆에서도 재귀·배증이 없다', () => {
    expect(volley(['plusP', 'mimic', 'mimic', 'mimic', 'mimic', 'mimic'], 6).shots.map(shot => shot.breakdown.resolvedPrimary.firepower)).toEqual([8, 8, 8, 8, 8, 8]);
    expect(volley(['plusP', 'afterimage', 'afterimage', 'afterimage', 'afterimage', 'afterimage'], 6).shots.map(shot => shot.breakdown.resolvedPrimary.firepower)).toEqual([8, 5, 3, 2, 2, 2]);
    expect(volley(['mimic', 'mimic', 'afterimage', 'mimic']).shots.map(shot => shot.breakdown.resolvedPrimary.firepower)).toEqual([0, 0, 1, 1]);
  });
});

describe('확정 탄창의 배열·구성', () => {
  it('첫·마지막·중앙은 장전 칸 기준이며 한 발은 첫 칸이자 마지막 칸이다', () => {
    expect(primary(['opening'], 0).firepower).toBe(6);
    expect(primary(['finisher'], 0).firepower).toBe(7);
    expect(primary(['core'], 0).firepower).toBe(4);
    expect(primary(['ball', 'opening'], 1).firepower).toBe(3);
    expect(primary(['finisher', 'ball'], 0).firepower).toBe(3);
    expect(volley(['core', 'core', 'core']).shots.map(shot => shot.breakdown.resolvedPrimary.firepower)).toEqual([4, 6, 4]);
  });
  it('교차배열탄은 원래 양옆이 모두 있고 서로 다른 계열일 때만 활성이다', () => {
    expect(primary(['wounding', 'crosslink', 'explosive'], 1).firepower).toBe(7);
    expect(primary(['wounding', 'crosslink', 'serrated'], 1).firepower).toBe(3);
    expect(primary(['crosslink', 'explosive'], 0).firepower).toBe(3);
    expect(primary(['wounding', 'crosslink'], 1).firepower).toBe(3);
  });
  it('계열 중복은 세지 않으며 혼합탄 자신의 체력 계열도 포함한다', () => {
    const rounds: AmmoType[] = ['wounding', 'incendiary', 'explosive', 'flatNose', 'mosaic'];
    expect(commitMagazine(rounds, 6)).toMatchObject({ familyCount: 5, emptySlots: 1 });
    expect(primary(rounds, 4, 6).firepower).toBe(7);
    expect(primary(['mosaic', 'ball', 'mosaic', 'wounding'], 2).firepower).toBe(4);
    expect(primary(['mosaic'], 0).firepower).toBe(3);
  });
  it('집중탄은 부분 장전·한 발에서도 단일 계열이면 활성이다', () => {
    expect(primary(['focus', 'ball', 'finisher'], 0).firepower).toBe(6);
    expect(primary(['focus'], 0).firepower).toBe(6);
    expect(primary(['focus', 'wounding'], 0).firepower).toBe(2);
    expect(commitMagazine([], 4).familyCount).toBe(0);
  });
  it.each(WEAPON_ORDER)('%s 기본·최대 용량에서 경량장전은 빈 칸 수를 사용한다', id => {
    const weapon = WEAPON_DEFINITIONS[id];
    for (const capacity of [weapon.baseMagazineCapacity, weapon.maximumMagazineCapacity]) {
      expect(primary(['lightLoad'], 0, capacity).firepower).toBe(4 + (capacity - 1) * 2);
      expect(primary(['lightLoad', 'ball'], 0, capacity).firepower).toBe(4 + (capacity - 2) * 2);
      expect(primary(Array<AmmoType>(capacity).fill('lightLoad'), 0, capacity).firepower).toBe(4);
    }
  });
  it('경량장전은 봉쇄 후 실제 사용 가능한 용량으로 계산한다', () => {
    expect(resolver.resolveSequence(['lightLoad'], enemy(), { loadout: { magazine: 'highCapacityMagazine' } }).shots[0]!.breakdown.resolvedPrimary.firepower).toBe(14);
    expect(resolver.resolveSequence(['lightLoad'], enemy(), { loadout: { magazine: 'highCapacityMagazine' }, playerState: { heavyKickPenaltyBonus: 0, heavyKickPenaltyTurns: 0, rangePenaltySteps: 0, rangePenaltyTurns: 0, disabledSlots: { magazine: 1 } } }).shots[0]!.breakdown.resolvedPrimary.firepower).toBe(10);
  });
  it.each([1, 2, 3, 4, 5, 6])('%i발 대칭 칸은 장전 길이에 반전하며 두 번 반전하면 원래 칸이다', count => {
    for (let index = 0; index < count; index++) {
      expect(symmetricSlot(index, count)).toBe(count - 1 - index);
      expect(symmetricSlot(symmetricSlot(index, count), count)).toBe(index);
    }
  });
  it('대칭탄은 부분 배열 반대편을 보고 홀수 중앙의 자기 자신을 제외한다', () => {
    expect(primary(['mirror', 'ball'], 0, 6).firepower).toBe(6);
    expect(primary(['ball', 'mirror'], 1, 6).firepower).toBe(6);
    expect(primary(['mirror', 'wounding'], 0).firepower).toBe(3);
    expect(primary(['mirror'], 0).firepower).toBe(3);
    expect(primary(['ball', 'mirror', 'ball'], 1).firepower).toBe(3);
  });
  it('발사 제거·원본 수정으로 확정 배열이 바뀌지 않는다', () => {
    const player = new Player();
    for (const ammo of ['opening', 'crosslink', 'finisher'] as const) player.supplyAmmo(ammo);
    for (const ammo of ['opening', 'crosslink', 'wounding', 'finisher'] as const) { if (ammo === 'wounding') player.supplyAmmo(ammo); player.addAmmo(ammo); }
    const snapshot = player.magazine.commit();
    const result = resolver.resolveSequence(snapshot.rounds, enemy(), { committedMagazine: snapshot });
    for (const shot of result.shots) player.fireRound(shot);
    expect(player.magazine.size).toBe(0);
    expect(snapshot.rounds).toEqual(['opening', 'crosslink', 'wounding', 'finisher']);
    expect(result.shots[1]!.breakdown.resolvedPrimary.firepower).toBe(7);
    expect(result.shots[3]!.breakdown.resolvedPrimary.firepower).toBe(7);
    expect(Object.isFrozen(snapshot.rounds)).toBe(true);
    expect(() => resolver.resolveSequence(['ball'], enemy(), { committedMagazine: snapshot })).toThrow('일치');
  });
  it('처치 뒤 미발사도 배열 활성 표시는 보존하되 탄약을 소모하지 않는다', () => {
    const result = volley(['opening', 'core', 'finisher'], 4, { hp: 1 });
    expect(result.unfiredRounds).toEqual(['core', 'finisher']);
    expect(result.roundPreviews.map(round => round.layerActivations?.[0]?.active)).toEqual([true, true, true]);
  });
  it('모든 슬롯이 차면 후보 추가 미리보기는 빈 결과이고 탄창 전체 미리보기는 유지한다', () => {
    expect(resolver.previewAppendedAmmo(['opening', 'core', 'focus', 'finisher'], AMMO_ORDER, enemy(), { magazineCapacity: 4 })).toEqual({});
    expect(volley(['opening', 'core', 'focus', 'finisher']).roundPreviews).toHaveLength(4);
  });
});

describe('획득부터 발사와 초기화', () => {
  it.each(AMMO_ORDER.filter(ammo => ammo !== 'ball'))('%s는 보상 후보·일반 보급·장전·사격·구간 재보급에 연결된다', ammo => {
    const player = new Player();
    expect(player.applyAmmoReward(ammo)).toBe(true);
    player.startStage();
    expect(player.addAmmo(ammo)).toBe(true);
    const magazine = player.magazine.commit();
    const result = resolver.resolveSequence(magazine.rounds, enemy(), { committedMagazine: magazine });
    player.fireRound(result.shots[0]!);
    expect(player.getStock()[ammo]).toBe(0);
    player.startStage();
    expect(player.getStock()[ammo]).toBe(1);
    player.reset();
    expect(player.getStock()[ammo]).toBe(0);
  });
  it('무작위 보상 풀에 새 탄이 있고 초안·구 제거 탄은 없다', () => {
    let seed = 12;
    const seen = new Set(generateAmmoRewards(() => .5));
    for (let i = 0; i < 1000; i++) for (const id of generateAmmoRewards(() => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; })) seen.add(id);
    expect(seen.size).toBe(45);
    expect([...seen]).not.toContain('knockback');
  });
  it('재장전·새 턴·새 표적·재시작은 복사 값과 다음 강화와 반동을 넘기지 않는다', () => {
    const first = volley(['relay', 'mimic', 'afterimage', 'impactRelay']);
    const nextEnemy = resolver.resolveEnemyAction(first.finalState).after;
    const next = resolver.resolveSequence(['mimic', 'afterimage', 'ball'], nextEnemy);
    expect(next.shots[0]!.breakdown).toMatchObject({ resolvedPrimary: emptyPayload(), recoilBefore: 0, followUpBonus: 0, shockFollowUpBonus: 0 });
    expect(next.shots[1]!.breakdown.resolvedPrimary.firepower).toBe(1);
    expect(volley(['mimic']).shots[0]!.breakdown.resolvedPrimary).toEqual(emptyPayload());
  });
});
