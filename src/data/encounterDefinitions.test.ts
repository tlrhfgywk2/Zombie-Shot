import { describe, expect, it } from 'vitest';
import { ENCOUNTER_STAGES } from './encounterDefinitions';
import { ENEMY_DEFINITIONS } from './enemyDefinitions';

describe('조우 경로 정의', () => {
  it('도입부 이후 매 단계에서 다수의 일반 적과 단일 특수 적 중 선택한다', () => {
    expect(ENCOUNTER_STAGES[0]?.special).toBeUndefined();
    for (const stage of ENCOUNTER_STAGES.slice(1)) {
      expect(stage.normal.roster.length).toBeGreaterThan(1);
      expect(stage.special?.roster).toHaveLength(1);
      expect(stage.special?.kind).toBe('special');
    }
  });

  it('세 가지 특수 방해 의도를 모두 경로에 노출한다', () => {
    const specialTypes = ENCOUNTER_STAGES.flatMap((stage) => stage.special?.roster ?? []);
    const intents = new Set(specialTypes.map((type) => ENEMY_DEFINITIONS[type].intent?.type));
    expect(intents).toEqual(new Set(['contaminate', 'groundShock', 'sonicPulse']));
  });

  it('초반은 무장갑 중심이며 후반에도 화력 경로와 혼합 경로를 유지한다', () => {
    expect(ENCOUNTER_STAGES[0]!.normal.roster.every(type => ENEMY_DEFINITIONS[type].armor === 0)).toBe(true);
    expect(ENCOUNTER_STAGES[1]!.special!.roster.some(type => ENEMY_DEFINITIONS[type].armor > 0)).toBe(true);
    for (const stage of ENCOUNTER_STAGES.slice(2)) {
      expect(stage.normal.roster.some(type => ENEMY_DEFINITIONS[type].armor === 0)).toBe(true);
      expect(stage.normal.roster.some(type => ENEMY_DEFINITIONS[type].armor > 0)).toBe(true);
    }
    expect(ENEMY_DEFINITIONS.tough.armor).toBe(0);
    expect(ENEMY_DEFINITIONS.screecher.armor).toBe(0);
  });
});
