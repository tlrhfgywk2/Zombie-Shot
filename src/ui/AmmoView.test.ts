import { expect, it } from 'vitest';
import { CombatResolver } from '../combat/CombatResolver';
import { createAmmoBuild } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import { ammoRewardOwnedCount, ammoStatsMarkup, firingOrderStatEntries } from './AmmoView';

it('탄약 보급의 보유량은 직전 스테이지 잔탄이 아닌 편성 수량을 따른다', () => {
  const build = createAmmoBuild({ hollowPoint: 3, armorPiercing: 3 });
  expect(ammoRewardOwnedCount('hollowPoint', build)).toBe(3);
  expect(ammoRewardOwnedCount('armorPiercing', build)).toBe(3);
});

it('교체할 탄약을 고르는 동안에는 이미 선택한 교체 수량을 제외한다', () => {
  const build = createAmmoBuild({ hollowPoint: 3 });
  expect(ammoRewardOwnedCount('hollowPoint', build, ['hollowPoint', 'hollowPoint'])).toBe(1);
});

it('탄약 카드에서 폐기된 명중 보정을 빼고 4개 핵심 수치를 직접 노출한다', () => {
  const card = ammoStatsMarkup('bonded');
  for (const text of ['화력<b>5', '방어 파괴<b>5', '충격<b>0']) expect(card).toContain(text);
  expect(card).not.toContain('정확도');
  expect(card).not.toContain('관통');
});

it('매치탄은 발사 순서 전체의 고정 완화 퍼센트포인트를 노출한다', () => {
  expect(ammoStatsMarkup('match')).toContain('거리 화력 감소<b>-3%p');
});

it('발사 순서 수치는 0을 숨기고 탄별 최종 유효 화력만 제공한다', () => {
  const resolver = new CombatResolver();
  const enemy = { ...createEnemyState('tough'), hp: 100, maxHp: 100, armor: 1, distance: 3 };
  const round = resolver.resolveSequence(['hollowPoint'], enemy).roundPreviews[0]!;
  expect(firingOrderStatEntries(round)).toEqual([
    { kind: 'firepower', label: '화력', value: 4, modified: false },
  ]);
});

it('앞 탄의 화력 감소는 별도 -2 항목 없이 유효 화력 1의 수정 색상 정보로 합쳐진다', () => {
  const resolver = new CombatResolver();
  const enemy = { ...createEnemyState('tough'), hp: 100, maxHp: 100, armor: 8, distance: 3 };
  const round = resolver.resolveSequence(['overpressure', 'armorPiercing'], enemy).roundPreviews[1]!;
  const firepower = firingOrderStatEntries(round).find((entry) => entry.kind === 'firepower');
  expect(firepower).toEqual({ kind: 'firepower', label: '화력', value: 1, modified: true });
  expect(firingOrderStatEntries(round).some((entry) => entry.value === -2)).toBe(false);
});

it('예상 처치 뒤 미발사 탄도 화력·방어 파괴·충격 정보를 유지한다', () => {
  const resolver = new CombatResolver();
  const enemy = { ...createEnemyState('normal'), hp: 1, armor: 0, distance: 3 };
  const sequence = resolver.resolveSequence(['hollowPoint', 'flatPoint', 'armorPiercing'], enemy);

  expect(sequence.shots).toHaveLength(1);
  expect(sequence.roundPreviews).toHaveLength(3);
  expect(firingOrderStatEntries(sequence.roundPreviews[1]!)).toEqual([
    { kind: 'firepower', label: '화력', value: 4, modified: false },
    { kind: 'shock', label: '충격', value: 5, modified: false },
  ]);
  expect(firingOrderStatEntries(sequence.roundPreviews[2]!)).toEqual([
    { kind: 'firepower', label: '화력', value: 3, modified: false },
    { kind: 'armor', label: '방어 파괴', value: 4, modified: false },
  ]);
});
