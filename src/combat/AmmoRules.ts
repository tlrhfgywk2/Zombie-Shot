import { AMMO_DEFINITIONS, type AmmoDefinition } from '../data/ammoDefinitions';
import type { AmmoCondition, AmmoFamily, AmmoType, CommittedMagazine, LayerActivation, PayloadModifier, PrimaryEffectValues, PrimaryPayload } from './types';

export const PAYLOAD_NAMES: Record<PrimaryPayload, string> = { firepower: '화력', explosive: '폭발', burn: '화상 축적', wound: '상처', actionShock: '충격' };
export const emptyPayload = (): PrimaryEffectValues => ({ firepower: 0, explosive: 0, burn: 0, wound: 0, actionShock: 0 });
export const PRIMARY_KEYS = Object.keys(emptyPayload()) as PrimaryPayload[];

/** 탄 제거로 배열 조건이 바뀌지 않는다. 용량과 장전 순서를 발사 확정 시 함께 복제한다. */
export function commitMagazine(rounds: readonly AmmoType[], capacity: number): CommittedMagazine {
  if (!Number.isInteger(capacity) || capacity < rounds.length || capacity < 1) throw new Error('잘못된 탄창 용량입니다.');
  const families = rounds.map(ammo => AMMO_DEFINITIONS[ammo].family);
  return Object.freeze({ rounds: Object.freeze([...rounds]), families: Object.freeze(families), capacity,
    familyCount: new Set(families).size, emptySlots: capacity - rounds.length });
}
export function symmetricSlot(index: number, loadedCount: number): number { return loadedCount - 1 - index; }
export interface RuleContext { magazine: CommittedMagazine; index: number; previousFamily?: AmmoFamily; previousPrimary?: PrimaryEffectValues }

export function conditionMatches(condition: AmmoCondition, context: RuleContext): boolean {
  const { magazine, index, previousFamily, previousPrimary } = context;
  const family = magazine.families[index];
  const left = magazine.families[index - 1];
  const right = magazine.families[index + 1];
  const different = (a?: AmmoFamily, b?: AmmoFamily) => a !== undefined && b !== undefined && a !== b;
  switch (condition.type) {
    case 'always': return true;
    case 'previousExists': return previousPrimary !== undefined;
    // 탄약 연계는 실제 직전 발사 탄을, 탄창 배열은 원래 장전 칸의 이웃을 사용한다.
    case 'previousFamily': return previousFamily !== undefined && (condition.relation === 'same' ? previousFamily === family : previousFamily !== family);
    case 'nextFamily': return right !== undefined && (condition.relation === 'same' ? right === family : right !== family);
    case 'bridgeDifferent': return different(previousFamily, right);
    case 'first': return index === 0;
    case 'last': return index === magazine.rounds.length - 1;
    case 'interior': return index > 0 && index < magazine.rounds.length - 1;
    case 'adjacentDifferent': return different(left, right);
    case 'familyDiversity': return magazine.familyCount > 1;
    case 'monoFamily': return magazine.familyCount === 1;
    case 'emptySlots': return magazine.emptySlots > 0;
    case 'symmetricSame': {
      const opposite = symmetricSlot(index, magazine.rounds.length);
      return opposite !== index && family !== undefined && magazine.families[opposite] === family;
    }
  }
}

export function layerActivations(definition: AmmoDefinition, context: RuleContext): LayerActivation[] {
  return definition.rules.map(rule => ({ layer: rule.layer, active: conditionMatches(rule.condition, context)
    && (rule.action.type !== 'next' || context.index + 1 < context.magazine.rounds.length) }));
}
function applyModifier(payload: PrimaryEffectValues, keys: readonly PrimaryPayload[], modifier: PayloadModifier): void {
  for (const key of modifier.target === 'primary' ? keys : [modifier.target]) {
    payload[key] += modifier.mode === 'add' ? modifier.amount : Math.floor(payload[key] * modifier.amount / 100);
  }
}

/** 값만 복사한다. 규칙·이동·반동·취약 발동 부가효과를 실행하거나 참조하지 않으므로 재귀가 없다. */
export function resolveAmmoRules(definition: AmmoDefinition, initial: PrimaryEffectValues, context: RuleContext,
  incoming: readonly PayloadModifier[] = [], followUpAttachmentBonus = 0) {
  let payload = { ...initial };
  let keys = [...definition.primaryEffects];
  const activations = layerActivations(definition, context);
  const outgoing: PayloadModifier[] = [];
  for (const [index, rule] of definition.rules.entries()) {
    if (!activations[index]?.active) continue;
    const action = rule.action;
    if (action.type === 'copyPrevious' || action.type === 'replayPrevious') {
      const copied = context.previousPrimary!;
      if (action.type === 'copyPrevious') { payload = emptyPayload(); keys = []; }
      for (const key of PRIMARY_KEYS) {
        const value = Math.floor(copied[key] * action.percent / 100);
        payload[key] += value;
        if (copied[key] > 0 && !keys.includes(key)) keys.push(key);
      }
    } else {
      const factor = rule.scaleBy === 'extraFamilies' ? context.magazine.familyCount - 1
        : rule.scaleBy === 'emptySlots' ? context.magazine.emptySlots : 1;
      const modifier = { target: action.target, mode: action.mode, amount: action.amount * factor };
      if (action.type === 'self') applyModifier(payload, keys, modifier);
      else outgoing.push({ ...modifier, amount: modifier.amount + (modifier.mode === 'add' ? followUpAttachmentBonus : 0) });
    }
  }
  // 다음 한 발에만 적용. 새 탄의 전달 규칙을 증폭하지 않으며 두 번째 후속 탄으로 이월하지 않는다.
  for (const modifier of incoming) applyModifier(payload, keys, modifier);
  const primary = emptyPayload();
  for (const key of keys) primary[key] = payload[key];
  return { payload, primary, outgoing, activations };
}

export function conditionText(condition: AmmoCondition): string {
  switch (condition.type) {
    case 'always': return '';
    case 'previousExists': return '직전 탄이 있으면';
    case 'previousFamily': return `직전 탄과 ${condition.relation === 'same' ? '같은' : '다른'} 계열이면`;
    case 'nextFamily': return `다음 탄과 ${condition.relation === 'same' ? '같은' : '다른'} 계열이면`;
    case 'bridgeDifferent': return '직전·다음 탄의 계열이 다르면';
    case 'first': return '첫 장전 칸이면';
    case 'last': return '마지막 장전 칸이면';
    case 'interior': return '첫·마지막 장전 칸이 아니면';
    case 'adjacentDifferent': return '양옆 장전 탄의 계열이 다르면';
    case 'familyDiversity': return '장전 계열 수 −1마다';
    case 'monoFamily': return '모든 장전 탄이 같은 계열이면';
    case 'emptySlots': return '빈 칸마다';
    case 'symmetricSame': return '반대편 장전 탄이 같은 계열이면 (자기 자신 제외)';
  }
}
export function ruleText(definition: AmmoDefinition): string {
  return definition.rules.map(rule => {
    const action = rule.action;
    if (action.type === 'copyPrevious' || action.type === 'replayPrevious')
      return `직전 탄 주효과 ${action.percent}% ${action.type === 'copyPrevious' ? '복사' : '재발동'}${action.percent < 100 ? ' · 소수점 버림' : ''} · 첫 발은 ${action.type === 'copyPrevious' ? '효과 없음' : '기본 화력만'}`;
    const target = action.target === 'primary' ? action.type === 'self' ? definition.primaryEffects.map(key => PAYLOAD_NAMES[key]).join('·') : '주효과' : PAYLOAD_NAMES[action.target];
    return `${conditionText(rule.condition)} ${action.type === 'next' ? '바로 다음 탄 ' : ''}${target} +${action.amount}${action.mode === 'percent' ? '% · 소수점 버림' : ''}`.trim();
  }).join(' · ');
}
