import { ammo, P220 } from '../rules';
import type { Round } from '../rules';
import { normalizeScenario, registeredRounds, simulate } from './simulator';
import type { SimulationConfig } from './simulator';

// 완성된 실탄창에서 선택한 한 발과 그 발이 예약한 반향만 귀속한다.
function measureRound(config: SimulationConfig, sequence: readonly Round[], slot: number) {
  let shots = 0, hits = 0, directDamage = 0, delayedDamage = 0, effectiveDamage = 0;
  let heatGenerated = 0, woundApplied = 0, woundDamage = 0, impactDamage = 0, conditionalBaseDamage = 0;
  let vulnerableApplied = false;
  let modifiedDamage = 0;
  const result = simulate({ ...config, sequence, turns: 1 }, { onFrame(frame) {
    if (frame.kind === 'shot' && frame.shot.index === slot) {
      const shot = frame.shot;
      shots++;
      directDamage += shot.damage;
      heatGenerated += shot.heatAfter - shot.heatBefore;
      vulnerableApplied = shot.applied;
      woundApplied += shot.woundApplied;
      conditionalBaseDamage += shot.bonus;
    }
    const instances = frame.kind === 'shot' && frame.shot.index === slot ? frame.shot.hits :
      frame.kind === 'echo' && frame.echo.shotIndex === slot ? [frame.echo.hit] : [];
    for (const hit of instances) {
      hits++;
      if (frame.kind === 'echo') delayedDamage += hit.damage;
      effectiveDamage += hit.removed;
      modifiedDamage += hit.modifiedDamage;
      woundDamage += hit.woundDamage;
      impactDamage += hit.impactBonus;
    }
  } });
  return { sequence, slot: slot + 1, shots, hits, directDamage, delayedDamage, totalDamage: directDamage + delayedDamage,
    effectiveDamage, modifiedDamage, conditionalBaseDamage, woundDamage, impactDamage, woundApplied,
    vulnerableApplied, heatGenerated, outcome: result.outcome };
}

export function benchmark(config: SimulationConfig = {}) {
  const scenario = normalizeScenario({ ...config, turns: 1 });
  // 체력이 충분한 기본 표적에서 처형 조건을 함께 관찰한다. 사용자가 지정한 재고 등은 그대로 유지한다.
  const hp = typeof scenario.maxHp === 'number' && Number.isFinite(scenario.maxHp)
    ? Math.max(1, Math.min(scenario.hp, Math.floor(scenario.maxHp * ammo.execution.threshold / 100))) : scenario.hp;
  const preparedConfig = { ...config, hp };
  const rows = registeredRounds.map(round => ({
    round, name: ammo[round].name, family: ammo[round].family,
    cold: measureRound(config, [round, 'standard', 'standard', 'standard'], 0),
    prepared: measureRound(preparedConfig, ['serrated_round', 'vulnerability', 'conduit_round', round], 3),
  }));
  return { config, coldConditions: scenario, preparedConditions: normalizeScenario({ ...preparedConfig, turns: 1 }),
    evaluated: rows.length * 2, rows };
}

export function compare(config: SimulationConfig, against: readonly Round[] = Array<Round>(P220.capacity).fill('standard')) {
  const selected = simulate(config);
  const reference = simulate({ ...config, sequence: against });
  const orderOnly = [...selected.scenario.sequence].sort().join(',') === [...against].sort().join(',');
  const changedSlots = against.flatMap((round, i) => round === selected.scenario.sequence[i] ? [] : [i]);
  const substitutions = changedSlots.map(index => {
    const sequence = [...against];
    sequence[index] = selected.scenario.sequence[index]!;
    const single = simulate({ ...config, sequence });
    return { slot: index + 1, sequence, damage: single.metrics.totalDamage,
      delta: single.metrics.totalDamage - reference.metrics.totalDamage, outcome: single.outcome, shots: single.metrics.shots };
  });
  const delta = selected.metrics.totalDamage - reference.metrics.totalDamage;
  return {
    selected: { scenario: selected.scenario, metrics: selected.metrics, outcome: selected.outcome },
    reference: { scenario: reference.scenario, metrics: reference.metrics, outcome: reference.outcome },
    orderOnly, delta, substitutions, evaluated: substitutions.length + 2,
    // 기준 탄창의 같은 위치에 하나씩 교체한 효과를 빼고 남은 조합 상호작용.
    interactionDelta: delta - substitutions.reduce((sum, row) => sum + row.delta, 0),
  };
}
