import { describe, expect, it } from 'vitest';
import { ENCOUNTER_STAGES, explorationEncounter } from './encounterDefinitions';
import { Encounter } from '../combat/Encounter';

describe('단독·무리·위험 조우 구성', () => {
  it('프리는 단독으로 시작하고 두 일반 적·질주와 거체·증원 위험 조우를 선택할 수 있다', () => {
    expect(ENCOUNTER_STAGES[0]!.normal.roster).toEqual(['normal']);
    expect(ENCOUNTER_STAGES[1]!.normal.roster).toEqual(['normal', 'normal']);
    expect(ENCOUNTER_STAGES[1]!.special!.roster).toEqual(['fast', 'tough']);
    expect(ENCOUNTER_STAGES[2]!.special).toMatchObject({ roster: ['contaminator', 'screecher'], reinforcements: ['normal'] });
    for (const stage of ENCOUNTER_STAGES) for (const route of [stage.normal, stage.special].filter(route => route !== undefined)) {
      const encounter = new Encounter(route.roster, route.reinforcements);
      expect(encounter.living.length).toBeLessThanOrEqual(2);
      if (route.reinforcements?.length) expect(route.subtitle).toContain('증원');
    }
  });
  it('탐험의 일반 적은 단독이며 빠른 적·거체와 교란체만 다수전으로 확장한다', () => {
    expect(explorationEncounter('normal').roster).toEqual(['normal']);
    expect(explorationEncounter('fast').roster).toEqual(['fast', 'brute']);
    expect(explorationEncounter('tough').roster).toEqual(['normal', 'tough']);
    expect(explorationEncounter('screecher')).toEqual({ roster: ['screecher', 'normal'], reinforcements: ['normal'] });
  });
});
