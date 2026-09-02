import { describe, expect, it } from 'vitest';
import { SPECIAL_AMMO_SUPPLY, NORMAL_AMMO_SUPPLY } from './ammoDefinitions';
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

  it('특수 경로 보급은 신화 탄약을 주지만 일반 경로 보급은 주지 않는다', () => {
    expect(NORMAL_AMMO_SUPPLY.sanctified + NORMAL_AMMO_SUPPLY.bloodHex).toBe(0);
    expect(SPECIAL_AMMO_SUPPLY.sanctified + SPECIAL_AMMO_SUPPLY.bloodHex).toBeGreaterThan(0);
  });
});
