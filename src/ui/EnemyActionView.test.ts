import { describe, expect, it } from 'vitest';
import { CombatResolver, previewEnemyAction } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';
import { enemyActionPreviewText, enemyActionResultText } from './EnemyActionView';

const resolver = new CombatResolver(() => 0);
describe('예고와 행동 결과 문구', () => {
  it('후퇴 지연 예고와 실제 접근, 다음 능력 재시도를 구분한다', () => {
    const volley = resolver.resolveSequence(['retreat'], { ...createEnemyState('contaminator'), distance: 8 });
    expect(enemyActionPreviewText(previewEnemyAction(volley.finalState))).toBe('오염 투척 지연 → 접근 2.8 m');
    const result = resolver.resolveEnemyAction(volley.finalState);
    expect(enemyActionResultText(result)).toBe('오염 투척 지연 → 접근 2.8 m');
    expect(enemyActionPreviewText(previewEnemyAction(result.after))).toBe('오염 투척');
  });
  it('충격 중단과 0m 회복 접근을 구분한다', () => {
    const result = resolver.resolveEnemyAction({ ...createEnemyState('normal'), distance: 0, actionShock: 8 });
    expect(enemyActionResultText(result)).toBe('치명 공격 · 충격 중단');
    expect(enemyActionPreviewText(previewEnemyAction(result.after))).toBe('회복 접근 0.0 m');
    expect(enemyActionResultText(resolver.resolveEnemyAction(result.after))).toBe('회복 접근 0.0 m');
  });
  it('멀리 있는 보류 능력은 접근으로 예고한다', () => {
    const result = resolver.resolveEnemyAction({ ...createEnemyState('groundshaker'), distance: 8, delayedAction: 'groundShock' });
    expect(enemyActionPreviewText(previewEnemyAction(result.after))).toBe('지반 충격 지연 → 접근 2.8 m');
  });
});
