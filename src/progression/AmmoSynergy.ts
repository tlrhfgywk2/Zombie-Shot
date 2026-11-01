import { AMMO_DEFINITIONS as definitions, AMMO_ORDER, COMBAT_BALANCE, type AmmoBuild, type SpecialAmmoType } from '../data/ammoDefinitions';
import type { PrimaryPayload } from '../combat/types';

export interface SynergyContext { inventory: Readonly<Partial<AmmoBuild>>; magazineCapacity: number }
export interface SynergyPath { id: string; progress: number; members: SpecialAmmoType[] }

/** 수치·규칙으로 연결한다. 같은 계열만으로 연결하지 않으며 한 탄창의 보수적인 준비 가능성만 평가한다. */
export function analyzeAmmoSynergies({ inventory, magazineCapacity }: SynergyContext): SynergyPath[] {
  const slots = Number.isFinite(magazineCapacity) ? Math.max(0, Math.min(6, Math.floor(magazineCapacity))) : 0;
  const rounds = AMMO_ORDER.filter((id): id is SpecialAmmoType => id !== 'ball').flatMap(id =>
    Array.from({ length: Math.min(slots, Math.max(0, Math.floor(inventory[id] ?? 0))) }, () => id));
  const paths: SynergyPath[] = [];
  const add = (id: string, progress: number, members: SpecialAmmoType[]) => {
    if (progress > 0) paths.push({ id, progress: Math.min(1, progress), members: [...new Set(members)] });
  };
  const accumulated = (ids: SpecialAmmoType[], field: PrimaryPayload, limit: number) => ids.filter(id => definitions[id][field] > 0)
    .sort((a, b) => definitions[b][field] - definitions[a][field]).slice(0, Math.max(0, limit));
  const sum = (ids: SpecialAmmoType[], field: PrimaryPayload) => ids.reduce((n, id) => n + definitions[id][field], 0);
  const wounds = accumulated(rounds, 'wound', slots - 1);
  if (slots >= 2) add('wound', sum(wounds, 'wound') / COMBAT_BALANCE.woundThreshold, wounds);
  const heat = accumulated(rounds, 'burn', slots);
  add('ignition', sum(heat, 'burn') / COMBAT_BALANCE.burnThreshold, heat);
  for (let i = 0; i < rounds.length; i++) {
    const consumer = rounds[i]!, def = definitions[consumer];
    const others = rounds.filter((_, index) => index !== i);
    if (slots < 2) continue;
    const link = (id: string, predicate: (id: SpecialAmmoType) => boolean) => {
      const producer = others.find(predicate);
      if (producer) add(id, 1, [producer, consumer]);
    };
    if (def.actionShock > 0) link('detonation', id => definitions[id].explosive > 0);
    if (def.recoilScale || def.recoilRecovery) link('recoil', id => definitions[id].recoil >= 3);
    if (def.shockScale) link('shock', id => definitions[id].actionShock >= def.shockScale!.divisor);
    if (def.burnScalePercent) link('heat-payoff', id => definitions[id].burn >= 4);
    if (def.vulnerableBonus || def.vulnerableDamagePercentBonus || def.vulnerableWoundBonus) {
      const suppliers = accumulated(others, 'wound', slots - 1), amount = sum(suppliers, 'wound');
      add('vulnerable-payoff', amount >= COMBAT_BALANCE.woundThreshold ? 1 : amount / COMBAT_BALANCE.woundThreshold * .75, [...suppliers, consumer]);
    }
    for (const rule of def.rules) {
      const action = rule.action;
      if (action.type === 'next' && rule.condition.type === 'always') link('follow-up', id => {
        const next = definitions[id], target = action.target === 'primary' ? next.primaryPayload : action.target;
        return action.mode === 'percent' ? next[target] >= 3 : target === 'firepower' ? next.firepower >= 6 : next[target] > 0;
      });
      if (action.type === 'copyPrevious' || action.type === 'replayPrevious') link('copy', id => definitions[id][definitions[id].primaryPayload] >= 3);
    }
  }
  return [...new Set(paths.map(path => path.id))].map(id => paths.filter(path => path.id === id).sort((a, b) => b.progress - a.progress)[0]!);
}

export function ammoSynergyScores(context: SynergyContext, candidates: readonly SpecialAmmoType[]): Map<SpecialAmmoType, number> {
  const before = new Map(analyzeAmmoSynergies(context).map(path => [path.id, path.progress]));
  return new Map(candidates.map(ammo => {
    const after = analyzeAmmoSynergies({ ...context, inventory: { ...context.inventory, [ammo]: (context.inventory[ammo] ?? 0) + 1 } });
    const score = Math.max(0, ...after.map(path => {
      const previous = before.get(path.id) ?? 0;
      if (!previous && path.progress < 1) return 0;
      return Math.max(0, path.progress - previous) * (path.progress === 1 ? 1 : .5);
    }));
    return [ammo, score / (1 + (context.inventory[ammo] ?? 0) * .5)];
  }));
}
