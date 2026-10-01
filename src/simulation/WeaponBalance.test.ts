import { describe, expect, it } from 'vitest';
import { simulateWeaponBalance, simulateWeaponEncounter, WEAPON_BALANCE_PLANS } from './WeaponBalance';
import { WEAPON_ORDER } from '../data/weaponDefinitions';

describe('권총 네 종류 결정론적 밸런스', () => {
  it('10개 탄창·세 거리에서 피해와 계열 효과·반동을 비교한다', () => {
    const rows = simulateWeaponBalance();
    expect(rows).toHaveLength(120);
    expect(rows.every(row => row.effectiveDamage >= row.directDamage && row.capacity <= 6)).toBe(true);
    const row = (weaponId: string, plan: string, distance = 3) => rows.find(row => row.weaponId === weaponId && row.plan === plan && row.distance === distance)!;
    expect(row('p220', '표준탄').recoilLoss).toBe(0);
    expect(row('m1911', '폭발 기폭').detonated).toBeGreaterThan(row('p220', '폭발 기폭').detonated);
    expect(row('m1911', '고반동 상처').wound).toBeGreaterThan(row('p220', '고반동 상처').wound);
    for (const id of WEAPON_ORDER) {
      expect(row(id, '고압 연사').recoilLoss).toBeGreaterThan(0);
      expect(row(id, '반동 전환').effectiveDamage).toBeGreaterThan(row(id, '표준탄').effectiveDamage);
    }
    // 30개 거리·탄창 조합 중 80% 이상에서 체력 피해 최고를 독점하면 재조정한다.
    for (const id of WEAPON_ORDER) {
      const wins = rows.filter(row => row.weaponId === id).filter(candidate =>
        rows.filter(other => other.plan === candidate.plan && other.distance === candidate.distance)
          .every(other => candidate.effectiveDamage >= other.effectiveDamage));
      expect(wins.length).toBeLessThan(28);
    }
  });
  it('회전의 모든 시작 후보와 감소·허용치·거리 부착물 조합을 비교한다', () => {
    for (const loadout of [{}, { magazine: 'extendedMagazine' as const }, { grip: 'texturedGrip' as const }, { muzzle: 'muzzleBrake' as const },
      { muzzle: 'compensator' as const }, { muzzle: 'compensator' as const, grip: 'texturedGrip' as const },
      { barrel: 'extendedBarrel' as const, optic: 'pistolScope' as const }]) {
      const rows = simulateWeaponBalance(loadout, true);
      expect(rows.every(row => Number.isFinite(row.effectiveDamage) && row.bestDamage >= row.worstDamage)).toBe(true);
    }
  });
  it('확장 탄창의 P220 표준탄 바닥 성능과 M500의 고정 용량을 구분한다', () => {
    const rows = simulateWeaponBalance({ magazine: 'extendedMagazine' });
    const at = (id: string) => rows.find(row => row.weaponId === id && row.plan === '표준탄' && row.distance === 11)!;
    expect(at('p220')).toMatchObject({ capacity: 6, effectiveDamage: 24 });
    expect(at('m500')).toMatchObject({ capacity: 4, effectiveDamage: 15 });
    const recoilBuild = ['plusP', 'plusP', 'ball', 'ball', 'ball', 'ball'] as const;
    const p220 = simulateWeaponEncounter('p220', recoilBuild, 'brute', 11);
    expect(p220.killed).toBe(true);
  });
  it('일반·거대·고속 표적을 세 거리에서 반복 탄창으로 비교한다', () => {
    const rows = WEAPON_ORDER.flatMap(id => Object.entries(WEAPON_BALANCE_PLANS).flatMap(([plan, rounds]) =>
      (['normal', 'brute', 'fast'] as const).flatMap(type => [3, 7, 11].map(distance =>
        ({ plan, ...simulateWeaponEncounter(id, rounds, type, distance) })))));
    expect(rows).toHaveLength(360);
    expect(rows.every(row => row.killed || row.breached || row.actions === 12)).toBe(true);
  });
});
