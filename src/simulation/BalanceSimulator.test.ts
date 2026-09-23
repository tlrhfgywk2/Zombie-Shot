import { describe, expect, it } from 'vitest';
import { CombatResolver } from '../combat/CombatResolver';
import { AMMO_ORDER } from '../data/ammoDefinitions';
import { createEnemyState } from '../data/enemyDefinitions';
import type { AmmoType, EnemyState } from '../combat/types';

const resolver = new CombatResolver();
const durable = (distance: number): EnemyState => ({ ...createEnemyState('normal'), hp: 100, maxHp: 100, distance });
const shot = (ammo: AmmoType, distance = 3) => resolver.resolveShot(ammo, 0, durable(distance));
const volley = (rounds: readonly AmmoType[], distance = 3) => resolver.resolveSequence(rounds, durable(distance));

describe('초기 밸런스 감사', () => {
  it('모든 탄약을 기본 권총의 세 거리에서 비교한다', () => {
    const rows = AMMO_ORDER.map(ammo => ({ ammo,
      near: shot(ammo, 3).hpDamage, mid: shot(ammo, 7).hpDamage, far: shot(ammo, 11).hpDamage,
      wound: shot(ammo, 3).woundApplied, impact: shot(ammo, 3).actionShockApplied,
      recoil: shot(ammo, 3).breakdown.recoilGenerated }));
    console.table(rows);
    expect(rows.every(row => row.near >= row.mid && row.mid >= row.far)).toBe(true);
    expect(shot('lowRecoil').hpDamage).toBeLessThan(shot('ball').hpDamage);
    expect(shot('plusP').hpDamage).toBeGreaterThan(shot('ball').hpDamage);
    expect(shot('frangible').hpDamage).toBeLessThan(shot('ball').hpDamage);
    expect(shot('suppression').hpDamage).toBeLessThan(shot('ball').hpDamage);
    expect(shot('execution').hpDamage).toBeLessThan(shot('ball').hpDamage);
    expect(shot('heavy').hpDamage).toBeLessThan(shot('ball').hpDamage);
    expect(shot('heavy').actionShockApplied).toBeLessThan(shot('flatNose').actionShockApplied);
    expect(shot('retreat').hpDamage).toBeLessThan(shot('ball').hpDamage);
  });
  it('일반 적의 시작 거리와 체력에서 대표 탄창의 처치 시점을 비교한다', () => {
    const enemy = createEnemyState('normal');
    const plans = [
      { name: '기본', rounds: ['ball', 'ball', 'ball', 'ball'] },
      { name: '상처 연계', rounds: ['wounding', 'laceration', 'wounding', 'laceration'] },
      { name: '반동 전환', rounds: ['plusP', 'plusP', 'kickback', 'ball'] },
      { name: '충격 제압', rounds: ['flatNose', 'suppression', 'ball', 'ball'] },
      { name: '이동 연계', rounds: ['advance', 'ball', 'retreat', 'ball'] },
    ] as const;
    const rows = plans.map(plan => {
      const result = resolver.resolveSequence(plan.rounds, enemy);
      return { name: plan.name, hpDamage: result.totalHpDamage, wound: result.totalWoundApplied,
        impact: result.totalActionShockApplied, shots: result.shots.length, killed: result.killed,
        distance: result.finalState.distance };
    });
    console.table(rows);
    expect(rows.find(row => row.name === '기본')?.hpDamage).toBe(20);
    expect(rows.find(row => row.name === '상처 연계')?.wound).toBe(6);
    // 임계치가 세 번째 탄에서 상처 6을 소비하므로 마지막 열상탄은 남은 상처 0을 읽는다.
    expect(rows.find(row => row.name === '상처 연계')?.hpDamage).toBe(12);
    expect(rows.find(row => row.name === '반동 전환')?.killed).toBe(true);
    expect(rows.find(row => row.name === '기본')?.killed).toBe(false);
    expect(rows.find(row => row.name === '충격 제압')?.impact).toBeGreaterThan(0);
    expect(rows.find(row => row.name === '이동 연계')?.distance).toBe(8);
  });
  it('저반동탄은 고압탄 뒤에 놓을 때 다음 탄의 피해를 회복한다', () => {
    const controlled = volley(['plusP', 'plusP', 'lowRecoil', 'ball']);
    const uncontrolled = volley(['plusP', 'plusP', 'ball', 'ball']);
    expect(controlled.totalHpDamage).toBeGreaterThan(uncontrolled.totalHpDamage);
    expect(controlled.shots[3]!.hpDamage).toBeGreaterThan(uncontrolled.shots[3]!.hpDamage);
  });
  it('상처는 긴 표적전에서 후속 열상탄과 파쇄탄의 선택 가치를 만든다', () => {
    const enemy = { ...durable(3), wound: 5, vulnerableTurns: 1 };
    expect(resolver.resolveShot('laceration', 0, enemy).hpDamage).toBeGreaterThan(shot('ball').hpDamage);
    expect(resolver.resolveShot('frangible', 0, enemy).hpDamage).toBeGreaterThan(shot('ball').hpDamage);
    expect(volley(['serrated', 'laceration', 'laceration', 'laceration']).totalHpDamage).toBeGreaterThanOrEqual(volley(['ball', 'ball', 'ball', 'ball']).totalHpDamage);
  });
});
