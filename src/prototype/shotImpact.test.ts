import { describe, expect, it } from 'vitest';
import { ammo, defaultScenario, lockMagazine, resolveDamage, resolveVolley, startEncounter } from './rules';
import type { Encounter, Round } from './rules';
import { resolveShotImpact } from './shotImpact';

const enemy = (explosionStack = 0, wound = 0, hp = 100): Encounter => ({
  ...startEncounter({ ...defaultScenario, maxHp: hp }), explosionStack, wound,
});
const stacks = (formation: Encounter[]) => formation.map(e => e.explosionStack);
const health = (formation: Encounter[]) => formation.map(e => e.hp);
const fire = (start: Encounter, ...rounds: Round[]) => {
  const frames = [...resolveVolley(start, rounds)];
  return { shots: frames.flatMap(f => f.kind === 'shot' ? [f.shot] : []), end: frames.at(-1)!.state, frames };
};

describe('폭발 탄약의 장전과 발사', () => {
  it.each([
    ['explosive', 5, 4, 1], ['highExplosive', 6, 6, 3], ['stickyCharge', 1, 8, 1],
    ['dispersal', 3, 2, 1], ['residual', 8, 0, 1],
  ] as const)('%s 한 칸이 한 발의 피해, 반동, 열만 만든다', (round, damage, stack, recoil) => {
    expect(lockMagazine([round], 1)).toEqual([round]);
    const result = fire(enemy(), round);
    expect(result.shots).toHaveLength(1);
    expect(result.shots[0]).toMatchObject({ damage, explosion: null, recoilGenerated: recoil, heatAfter: 5 });
    expect(result.end.explosionStack).toBe(stack);
    expect(startEncounter(defaultScenario).explosionStack).toBe(0);
  });

  it('10을 먼저 폭발시키고 남은 5에 고폭탄의 6을 더한다', () => {
    const result = fire(enemy(10), 'highExplosive');
    expect(result.shots[0]).toMatchObject({ damage: 16, explosion: { power: 10 } });
    expect(result.end.explosionStack).toBe(11);
  });

  it('단일 표적과 잔류탄의 한 발 한정 소모율', () => {
    expect(fire(enemy(8), 'standard').shots[0]).toMatchObject({ damage: 18, explosion: { power: 8 } });
    const result = fire(enemy(12), 'residual', 'standard');
    expect(result.shots.map(s => s.explosion?.power)).toEqual([12, 9]);
    expect(result.frames.slice(0, 2).map(f => f.state.explosionStack)).toEqual([9, 4]);
    expect(result.shots[0]?.hits[0]?.damage).toBe(8);
    expect(fire(enemy(1), 'residual').end.explosionStack).toBe(0);
  });

  it('홀수 내림과 턴 보존, 빈 복제와 상태탄 명중을 구분한다', () => {
    const result = fire(enemy(5), 'standard', 'standard', 'standard', 'standard');
    expect(result.shots.map(s => s.explosion?.power ?? 0)).toEqual([5, 2, 1, 0]);
    expect(result.frames.slice(0, 4).map(f => f.state.explosionStack)).toEqual([2, 1, 0, 0]);
    expect(fire(enemy(8)).end.explosionStack).toBe(8);
    expect(fire(enemy(8), 'copy').shots[0]?.explosion).toBeNull();
    expect(fire(enemy(8), 'vulnerability').shots[0]).toMatchObject({ hits: [], damage: 8, applied: true });
    expect(fire(enemy(8, 0, 4), 'vulnerability').shots[0]).toMatchObject({ after: 0, applied: false });
  });

  it('열·취약·전이·반향·후속탄은 폭발을 증폭하거나 다시 발동하지 않는다', () => {
    const result = fire({ ...enemy(8, 2, 500), weaponHeat: 100, vulnerable: { percent: 50, remaining: 1 } },
      'conduit_round', 'echo_round', 'follow_up');
    const [first, echo, follow] = result.shots;
    expect(first).toMatchObject({ hits: [{ damage: 14, modifiedDamage: 12 }], explosion: { hits: [{ hit: { modifiedDamage: 8, woundDamage: 2, impactBonus: 0 } }] } });
    expect(result.frames[0]?.state.previousQualifyingHit).toEqual({ finalDamage: 14, ownTransferBps: 4000 });
    expect(echo?.hits[0]?.impactBonus).toBe(5);
    expect(follow?.bonus).toBe(echo!.hits[0]!.modifiedDamage / 2);
    expect(result.frames.filter(f => f.kind === 'echo')).toHaveLength(1);
    expect(result.end.explosionStack).toBe(1);
    expect(result.frames[2]?.state.qualifyingHitCount).toBe(3);
    expect(resolveDamage(enemy(7), 'environment', 2)?.state.explosionStack).toBe(7);
  });

  it('분열탄은 세 타격과 폭발 한 번으로 상처를 네 번 적용한다', () => {
    const result = fire(enemy(5, 4), 'split_round');
    expect(result.shots).toHaveLength(1);
    expect(result.shots[0]).toMatchObject({ hits: Array(3).fill({ modifiedDamage: 3, woundDamage: 4 }),
      explosion: { power: 5, hits: [{ hit: { woundDamage: 4, source: 'explosion' } }] }, damage: 30,
      heatAfter: ammo.split_round.heat, recoilGenerated: 0 });
    expect(result.frames[0]?.state).toMatchObject({ hp: 70, wound: 4, explosionStack: 2, qualifyingHitCount: 3 });
    expect(result.end.wound).toBe(2);
  });

  it('고반동 벌점은 직접 화력에만 적용하고 탄창 경계에서 초기화한다', () => {
    const result = fire(enemy(), 'highExplosive', 'highExplosive');
    expect(result.shots[1]).toMatchObject({ recoilGenerated: 3, recoilPenalty: 1,
      hits: [{ modifiedDamage: 5 }], explosion: { power: 6 } });
    expect(fire(result.end, 'highExplosive').shots[0]?.recoilPenalty).toBe(0);
  });

  it('복제한 폭발 탄약은 원본 효과를 쓰고 실제 발사한 탄의 열과 반동을 낸다', () => {
    const result = fire(enemy(12), 'residual', 'copy', 'explosive', 'copy');
    expect(result.frames.slice(0, 4).map(f => f.state.explosionStack)).toEqual([9, 6, 7, 7]);
    expect(result.shots.map(s => s.recoilGenerated)).toEqual([1, 0, 1, 0]);
    expect(result.shots.map(s => s.heatAfter)).toEqual([5, 5, 10, 10]);
  });

  it('처치로 사격을 한 번 종료하고 미발사 탄약의 효과는 생기지 않는다', () => {
    const result = fire(enemy(8, 0, 3), 'highExplosive', 'stickyCharge');
    expect(result.shots).toHaveLength(1);
    expect(result.shots[0]).toMatchObject({ explosion: { power: 8, hits: [] } });
    expect(result.frames.filter(f => f.kind === 'victory')).toHaveLength(1);
    expect(result.end).toMatchObject({ hp: 0, explosionStack: 0 });
  });
});

describe('고정 차선과 사격 시작 시점의 폭발 범위', () => {
  it('중앙 직접 피해 10 및 세 표적 폭발 6으로 총 28, 인접 폭발치 보존', () => {
    const result = resolveShotImpact([enemy(8), enemy(6), enemy(4)], 1, 'standard', [10]);
    expect(health(result.formation)).toEqual([94, 84, 94]);
    expect(stacks(result.formation)).toEqual([8, 3, 4]);
    expect(result.explosion?.hits.map(e => [e.lane, e.hit.damage])).toEqual([[0, 6], [1, 6], [2, 6]]);
  });
  it('각 차선의 상처로 총 40, 이웃의 전이 기록은 보존한다', () => {
    const previousQualifyingHit = { finalDamage: 99, ownTransferBps: 4000 };
    const left = { ...enemy(0, 8), previousQualifyingHit, qualifyingHitCount: 3 };
    const result = resolveShotImpact([left, enemy(6), enemy(0, 4)], 1, 'standard', [10]);
    expect(health(result.formation)).toEqual([86, 84, 90]);
    expect(result.formation[0]).toMatchObject({ previousQualifyingHit, qualifyingHitCount: 3, wound: 8 });
  });
  it('5 누적 → 표준탄 → 3×3 사격으로 총 45의 피해를 준다', () => {
    const a = resolveShotImpact([enemy(), enemy(), enemy()], 1, 'explosive', [5], 0, { stack: 5 });
    const b = resolveShotImpact(a.formation, 1, 'standard', [10]);
    const c = resolveShotImpact(b.formation, 1, 'split_round', [3, 3, 3]);
    expect([a, b, c].map(r => r.formation[1]!.explosionStack)).toEqual([5, 2, 1]);
    expect([a, b, c].map(r => r.explosion?.power ?? 0)).toEqual([0, 5, 2]);
    expect(health(a.formation)).toEqual([100, 95, 100]);
    expect(health(b.formation)).toEqual([95, 80, 95]);
    expect(health(c.formation)).toEqual([93, 69, 93]);
    expect(c.hits).toHaveLength(3);
    expect(c.explosion?.hits).toHaveLength(3);
  });
  it.each([0, 6])('기존 폭발치 %i에서 확산탄 뒤 왼쪽 가장자리를 사격한다', stack => {
    const a = resolveShotImpact([enemy(), enemy(stack), enemy()], 1, 'dispersal', [3], 0, ammo.dispersal);
    expect(stacks(a.formation)).toEqual([2, 2 + Math.floor(stack / 2), 2]);
    expect(health(a.formation)).toEqual([100 - stack, 97 - stack, 100 - stack]);
    const b = resolveShotImpact(a.formation, 0, 'standard', [10]);
    expect(b.explosion?.hits.map(e => e.lane)).toEqual([0, 1]);
    expect(stacks(b.formation)).toEqual([1, 2 + Math.floor(stack / 2), 2]);
    const right = resolveShotImpact(a.formation, 2, 'standard', [10]);
    expect(right.explosion?.hits.map(e => e.lane)).toEqual([1, 2]);
  });
  it('중심이 먼저 죽어도 양옆을 맞히며 이웃 사망으로 범위가 넓어지지 않는다', () => {
    const start = [enemy(), enemy(4, 0, 5), enemy(8, 0, 1), enemy(), enemy()];
    const result = resolveShotImpact(start, 2, 'dispersal', [3], 0, ammo.dispersal);
    expect(result.explosion?.hits.map(e => e.lane)).toEqual([1, 3]);
    expect(health(result.formation)).toEqual([100, 0, 0, 92, 100]);
    expect(stacks(result.formation)).toEqual([0, 0, 0, 2, 0]);
    expect(health(start)).toEqual([100, 5, 1, 100, 100]);
    expect(resolveShotImpact(result.formation, 2, 'standard', [10]).explosion).toBeNull();
  });
});
