import { ammo, defaultScenario, isRound, lockMagazine, P220, resolveVolley, startEncounter, validScenario } from '../rules';
import type { DamageInstance, Encounter, Frame, Round } from '../rules';
import { WEAPON_HEAT_BALANCE } from '../combatBalance';

export const registeredRounds = Object.freeze(Object.keys(ammo).filter(isRound));
type Inventory = Partial<Record<Round, number>>;
type HitPoints = number | 'infinite';

export interface SimulationConfig {
  mode?: 'analysis' | 'encounter';
  sequence?: readonly Round[];
  weapon?: string;
  capacity?: number;
  inventory?: Inventory | 'unlimited';
  maxHp?: HitPoints;
  hp?: HitPoints;
  distance?: number;
  approach?: number;
  wound?: number;
  vulnerable?: Encounter['vulnerable'];
  heat?: number;
  turns?: number;
  seed?: number;
}

export interface SimulationOptions {
  detail?: boolean;
  onFrame?: (frame: Frame, before: Encounter, turn: number) => void;
  resolve?: typeof resolveVolley;
}

function countRounds(sequence: readonly Round[]): Inventory {
  const counts: Inventory = {};
  for (const round of sequence) counts[round] = (counts[round] ?? 0) + 1;
  return counts;
}

function isObject(value: unknown): boolean {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

const fields = new Set<keyof SimulationConfig>(['mode', 'sequence', 'weapon', 'capacity', 'inventory', 'maxHp', 'hp',
  'distance', 'approach', 'wound', 'vulnerable', 'heat', 'turns', 'seed']);

export function normalizeScenario(config: SimulationConfig = {}) {
  if (!isObject(config)) throw new TypeError('시나리오는 객체여야 합니다.');
  for (const key of Object.keys(config)) {
    if (!fields.has(key as keyof SimulationConfig)) throw new RangeError(`지원하지 않는 시나리오 항목: ${key}`);
    if (config[key as keyof SimulationConfig] === null && key !== 'vulnerable') throw new TypeError(`빈 시나리오 값: ${key}`);
  }
  const { mode = 'analysis', weapon = P220.name, capacity = P220.capacity, seed = 1, turns = 1,
    wound = 0, vulnerable = null, heat = WEAPON_HEAT_BALANCE.initial,
    distance = defaultScenario.distance, approach = defaultScenario.approach } = config;
  if (mode !== 'analysis' && mode !== 'encounter') throw new RangeError('실행 모드는 analysis 또는 encounter여야 합니다.');
  if (weapon !== P220.name || capacity !== P220.capacity) throw new RangeError(`현재 무기는 ${P220.name}이며 탄창은 ${P220.capacity}칸입니다.`);
  const rounds = config.sequence ?? Array<Round>(capacity).fill('standard');
  const sequence = Array.isArray(rounds) && lockMagazine(rounds, capacity);
  if (!sequence) throw new RangeError(`등록된 탄약으로 ${capacity}칸의 탄창을 완성하세요.`);
  const maxHpValue = config.maxHp ?? (mode === 'analysis' ? 100_000 : defaultScenario.maxHp);
  const maxHp = maxHpValue === 'infinite' ? Infinity : maxHpValue;
  const hp = config.hp === 'infinite' ? Infinity : config.hp ?? maxHp;
  if (!validScenario({ maxHp, distance, approach })) throw new RangeError('최대 체력, 거리 또는 접근 속도가 유효하지 않습니다.');
  if (!(hp === Infinity || Number.isSafeInteger(hp)) || hp <= 0 || hp > maxHp || (maxHp === Infinity && hp !== Infinity))
    throw new RangeError('시작 체력은 최대 체력 이하의 양의 정수이며, 무한 표적은 무한 체력으로 시작합니다.');
  if (!Number.isSafeInteger(wound) || wound < 0 || !Number.isFinite(heat) || heat < 0 || heat > Number.MAX_SAFE_INTEGER)
    throw new RangeError('상처는 0 이상의 정수, 열은 0 이상의 유한 수여야 합니다.');
  if (vulnerable !== null && (!isObject(vulnerable) || vulnerable.percent !== ammo.vulnerability.percent
    || !Number.isInteger(vulnerable.remaining) || vulnerable.remaining < 1 || vulnerable.remaining > ammo.vulnerability.turns))
    throw new RangeError('취약의 배율과 지속 시간은 취약탄 정의를 따라야 합니다.');
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError('시드는 부호 없는 32비트 정수여야 합니다.');
  if (!Number.isSafeInteger(turns) || turns < 1 || turns > 10_000) throw new RangeError('턴 수는 1~10000 정수여야 합니다.');
  const stock = config.inventory ?? countRounds(sequence);
  if (stock !== 'unlimited' && (!isObject(stock) || Object.entries(stock).some(([round, count]) =>
    !isRound(round) || !Number.isSafeInteger(count) || count < 0))) throw new RangeError('재고에는 등록된 탄과 0 이상의 정수만 쓸 수 있습니다.');
  const inventory: Inventory | 'unlimited' = stock === 'unlimited' ? stock : { ...stock };
  return { mode, weapon, capacity, sequence, inventory, maxHp, hp, distance, approach, wound,
    vulnerable: vulnerable ? { ...vulnerable } : null, heat, turns, seed };
}

function createMetrics(heat: number) {
  return {
    shots: 0, hits: 0, totalDamage: 0, effectiveDamage: 0, directDamage: 0, delayedDamage: 0,
    rawBaseDamage: 0, conditionalBaseDamage: 0, modifiedDamage: 0, modifierDelta: 0, woundDamage: 0, impactDamage: 0,
    woundApplied: 0, heatGenerated: 0, peakHeat: heat, damagePerRound: 0, damagePerHit: 0, damagePerTurn: 0,
    consumed: {} as Inventory, damageBySource: {} as Partial<Record<DamageInstance['source'], number>>,
  };
}

type Metrics = ReturnType<typeof createMetrics>;
function countHit(metrics: Metrics, hit: DamageInstance) {
  metrics.hits++;
  metrics.totalDamage += hit.damage;
  metrics.modifiedDamage += hit.modifiedDamage;
  metrics.woundDamage += hit.woundDamage;
  metrics.impactDamage += hit.impactBonus;
  metrics.effectiveDamage += hit.removed;
  metrics.damageBySource[hit.source] = (metrics.damageBySource[hit.source] ?? 0) + hit.damage;
}

export type Outcome = 'victory' | 'defeat' | 'turn-limit' | 'inventory-exhausted';
interface TurnResult {
  turn: number;
  start: Encounter;
  end: Encounter;
  damage: number;
  cumulativeDamage: number;
  shots: number;
  hits: number;
  peakHeat: number;
}

export function simulate(config: SimulationConfig = {}, options: SimulationOptions = {}) {
  const scenario = normalizeScenario(config);
  const { sequence, maxHp, distance, approach, hp, wound, vulnerable } = scenario;
  let state: Encounter = { ...startEncounter({ maxHp, distance, approach }), hp, wound, vulnerable, weaponHeat: scenario.heat };
  const inventory = scenario.inventory === 'unlimited' ? scenario.inventory : { ...scenario.inventory };
  const required = Object.entries(countRounds(sequence)) as [Round, number][];
  const metrics = createMetrics(state.weaponHeat);
  const turns: TurnResult[] = [];
  const frames = options.detail ? [] as Frame[] : undefined;
  let outcome: Outcome = 'turn-limit';
  for (let turn = 1; turn <= scenario.turns; turn++) {
    if (inventory !== 'unlimited' && required.some(([round, count]) => (inventory[round] ?? 0) < count)) {
      outcome = 'inventory-exhausted';
      break;
    }
    const start = state;
    const { totalDamage, shots, hits } = metrics;
    let peakHeat = start.weaponHeat;
    const delayedBaseBySlot: number[] = [];
    for (const frame of (options.resolve ?? resolveVolley)(state, sequence)) {
      const before = state;
      state = frame.state;
      if (frame.kind === 'shot') {
        const shot = frame.shot;
        metrics.shots++;
        metrics.consumed[shot.round] = (metrics.consumed[shot.round] ?? 0) + 1;
        if (inventory !== 'unlimited') inventory[shot.round] = inventory[shot.round]! - 1;
        metrics.heatGenerated += shot.heatAfter - shot.heatBefore;
        peakHeat = Math.max(peakHeat, shot.heatAfter);
        metrics.woundApplied += shot.woundApplied;
        metrics.rawBaseDamage += shot.baseDamage;
        metrics.conditionalBaseDamage += shot.bonus;
        metrics.directDamage += shot.damage;
        for (const hit of shot.hits) countHit(metrics, hit);
        const source = shot.source && ammo[shot.source];
        if (source && 'echoDamage' in source) delayedBaseBySlot[shot.index] = source.echoDamage;
      } else if (frame.kind === 'echo') {
        metrics.delayedDamage += frame.echo.hit.damage;
        metrics.rawBaseDamage += delayedBaseBySlot[frame.echo.shotIndex]!;
        countHit(metrics, frame.echo.hit);
      }
      frames?.push(frame);
      options.onFrame?.(frame, before, turn);
    }
    metrics.peakHeat = Math.max(metrics.peakHeat, peakHeat);
    turns.push({ turn, start, end: state, peakHeat, damage: metrics.totalDamage - totalDamage,
      cumulativeDamage: metrics.totalDamage, shots: metrics.shots - shots, hits: metrics.hits - hits });
    if (state.phase === 'victory' || state.phase === 'defeat') {
      outcome = state.phase;
      break;
    }
  }
  metrics.modifierDelta = metrics.modifiedDamage - metrics.rawBaseDamage - metrics.conditionalBaseDamage;
  metrics.damagePerRound = metrics.shots ? metrics.totalDamage / metrics.shots : 0;
  metrics.damagePerHit = metrics.hits ? metrics.totalDamage / metrics.hits : 0;
  metrics.damagePerTurn = turns.length ? metrics.totalDamage / turns.length : 0;
  return { scenario, metrics, state, inventory, outcome, turns, frames };
}
