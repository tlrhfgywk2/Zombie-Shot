import { describe, expect, it } from 'vitest';
import { Player } from '../entities/Player';
import { formatBalanceReport, runBalanceSimulation, simulateEncounter } from './BalanceSimulator';
import { auditFiniteShockLock } from './ShockLockAudit';
import { ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import type { EnemyType } from '../combat/types';
import { CombatResolver } from '../combat/CombatResolver';
import { createEnemyState } from '../data/enemyDefinitions';

describe('현실 탄약 밸런스 표본', () => {
  const report = runBalanceSimulation();
  it('6개 전략과 4개 장착 구성, 7종 적, 16개 경로를 비교한다', () => {
    expect(report.encounters).toHaveLength(6 * 4 * 7);
    expect(report.routes).toHaveLength(6 * 4 * 16);
    expect(report.encounters.some(row => row.armorBroken > 0)).toBe(true);
    expect(report.encounters.some(row => row.interruptions > 0)).toBe(true);
    expect(report.encounters.some(row => row.normalMovement > 0)).toBe(true);
  });
  it('표준탄만으로 장갑 적을 처치할 수 있다', () => {
    expect(simulateEncounter(['standard'], 'armored', new Player()).won).toBe(true);
  });
  it('모든 경로 조합에 실제 완주 가능한 구성이 있다', () => {
    for (let mask = 0; mask < 16; mask += 1) expect(report.routes.some(row => row.mask === mask && row.completed)).toBe(true);
  });
  it('현재 규칙의 재현 가능한 보고서를 출력한다', () => {
    expect(formatBalanceReport(report)).toContain('전략별 완주율');
    console.info(formatBalanceReport(report));
  });
  it('충격탄 14발을 전부 투자해도 재보급 없이 영구 봉쇄되지 않는다', () => {
    const rows = (Object.keys(ENEMY_DEFINITIONS) as EnemyType[]).flatMap(type =>
      (['flatPoint', 'wadcutter'] as const).flatMap(ammo =>
        (['single', 'consecutive', 'spaced'] as const).map(spacing => auditFiniteShockLock(type, ammo, spacing))));
    expect(rows).toHaveLength(42);
    expect(rows.every(row => row.escapedLock)).toBe(true);
    expect(rows.every(row => row.consumed <= 14)).toBe(true);
    console.info('충격 봉쇄 감사', { samples: rows.length, maxInterruptions: Math.max(...rows.map(row => row.interruptions)),
      maxTurns: Math.max(...rows.map(row => row.turns)) });
  });
  it('요청 수치에서 나타나는 탄종 우열의 한계를 기록한다', () => {
    const resolver = new CombatResolver();
    const rows = [3, 7, 11].flatMap(distance => [0, 1, 4, 5, 8].map(armor => {
      const enemy = { ...createEnemyState('normal'), hp: 1000, maxHp: 1000, distance, armor };
      const shot = (ammo: 'standard' | 'match' | 'bonded' | 'armorPiercing') => resolver.resolveShot(ammo, 0, enemy);
      return { distance, armor, standard: shot('standard').hpDamage, match: shot('match').hpDamage,
        bonded: shot('bonded'), armorPiercing: shot('armorPiercing') };
    }));
    expect(rows.every(row => row.standard >= row.match)).toBe(true);
    expect(rows.every(row => row.bonded.hpDamage >= row.armorPiercing.hpDamage
      && row.bonded.after.armor <= row.armorPiercing.after.armor)).toBe(true);
    console.info('탄종 한계 감사', {
      samples: rows.length,
      matchBeatsStandard: rows.filter(row => row.match > row.standard).length,
      bondedLosesToArmorPiercing: rows.filter(row => row.bonded.hpDamage < row.armorPiercing.hpDamage).length,
    });
  });
});
