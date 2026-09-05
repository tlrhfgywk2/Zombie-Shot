import { expect, it } from 'vitest';
import { ammoStatsMarkup } from './AmmoView';

it('탄약 카드에 5개 정확한 수치와 0을 직접 노출한다', () => {
  const card = ammoStatsMarkup('bonded');
  for (const text of ['화력<b>24', '명중 보정<b>+1%', '반동<b>8', '방어 파괴<b>18', '충격<b>0']) expect(card).toContain(text);
  expect(card).not.toContain('관통');
});
