import { AMMO_DEFINITIONS, type AmmoBuild, type SpecialAmmoType } from '../data/ammoDefinitions';
import type { AmmoType, RoundPreview } from '../combat/types';

export function ammoRewardOwnedCount(ammo: SpecialAmmoType, build: AmmoBuild, replacements: readonly SpecialAmmoType[] = []): number {
  return Math.max(0, build[ammo] - replacements.filter(value => value === ammo).length);
}
export function ammoStatsMarkup(ammo: AmmoType): string {
  const item = AMMO_DEFINITIONS[ammo];
  const values: [string, number][] = [['화력', item.firepower], ['상처', item.wound], ['폭발', item.explosive], ['화상', item.burn], ['즉시 화상 피해', item.burnDamage], ['충격', item.actionShock], ['반동', item.recoil]];
  const effect = item.shockFollowUp ? `다음 탄 충격 +${item.shockFollowUp}`
    : item.shockScale ? `현재 충격 ${item.shockScale.divisor}당 +1 · 추가 최대 +${item.shockScale.cap}` : woundEffectText(ammo) || burnEffectText(ammo);
  return `<span class="ammo-stats">${values.filter(([name, value]) => value > 0 || (name === '반동' && (ammo === 'reducedImpact' || item.family === 'BURN')) || (name === '충격' && item.family === 'BURN')).map(([name, value]) => `<span>${name}<b>${value}</b></span>`).join('')}${effect ? `<span class="ammo-special-effect">${effect}</span>` : ''}</span>`;
}
export function woundEffectText(ammo: AmmoType): string {
  const item = AMMO_DEFINITIONS[ammo];
  return [item.vulnerableTriggerDamage ? `취약 발동 피해 +${item.vulnerableTriggerDamage}` : '',
    item.vulnerableExtraTurns ? `취약 발동 지속 +${item.vulnerableExtraTurns}턴` : '',
    item.vulnerableWoundBonus ? `취약 대상 상처 +${item.vulnerableWoundBonus}` : '',
    item.woundRetention ? `취약 발동 상처 최대 ${item.woundRetention} 보존` : ''].filter(Boolean).join(' · ');
}
export function burnEffectText(ammo: AmmoType): string {
  const item = AMMO_DEFINITIONS[ammo];
  return [item.burnFollowUpPercent ? `바로 다음 탄 화상 ×${1 + item.burnFollowUpPercent / 100} · 소수점 버림 · 화상 0인 탄도 소비` : '',
    item.burnScalePercent ? `화상 ${item.burn} + 현재 화상 ×${item.burnScalePercent / 100} · 소수점 버림` : '',
    item.ignitedBonus ? `점화 대상 직접 화력 +${item.ignitedBonus}` : '',
    item.family === 'BURN' && item.recoilRecovery ? `사격 전 누적 반동 ${item.recoilRecovery} 회복` : ''].filter(Boolean).join(' · ');
}
export interface FiringOrderStatEntry {
  kind: 'wound' | 'explosive' | 'burn' | 'shock' | 'recoil'; label: string; value: number; modified: boolean;
}
export function firingOrderStatEntries(round: RoundPreview): FiringOrderStatEntry[] {
  const entries: FiringOrderStatEntry[] = [
    { kind: 'wound', label: '상처', value: round.wound, modified: round.wound !== AMMO_DEFINITIONS[round.ammoType].wound },
    { kind: 'explosive', label: '폭발', value: round.explosive, modified: round.explosive !== AMMO_DEFINITIONS[round.ammoType].explosive },
    { kind: 'burn', label: '화상 축적', value: round.burn, modified: round.burn !== AMMO_DEFINITIONS[round.ammoType].burn },
    { kind: 'shock', label: '충격', value: round.effectiveActionShock, modified: round.shockBonus > 0 },
    { kind: 'recoil', label: '누적 반동', value: round.recoil, modified: false },
  ];
  return entries.filter(row => row.value > 0);
}

export interface AmmoTooltipFirepower {
  value: number;
  change: 'neutral' | 'weakened' | 'strengthened';
}
export function ammoTooltipFirepower(ammo: AmmoType, round?: RoundPreview): AmmoTooltipFirepower {
  const base = AMMO_DEFINITIONS[ammo].firepower;
  if (!round) return { value: base, change: 'neutral' };
  const weakened = round.recoilFirepowerReduction > 0 || round.playerDebuffFirepowerReduction > 0;
  return {
    value: round.effectiveFirepower,
    change: weakened ? 'weakened' : round.effectiveFirepower > base ? 'strengthened' : 'neutral',
  };
}
