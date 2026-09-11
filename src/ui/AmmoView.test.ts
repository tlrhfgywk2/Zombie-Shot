import { expect, it } from 'vitest';
import { createAmmoBuild } from '../data/ammoDefinitions';
import { ammoRewardOwnedCount, ammoStatsMarkup } from './AmmoView';

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

it('거리 특화 탄약은 완화 퍼센트포인트를 직접 노출한다', () => {
  expect(ammoStatsMarkup('match')).toContain('거리 손실<b>-15%p');
});
