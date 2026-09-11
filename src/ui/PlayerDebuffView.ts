import type { PlayerCombatState } from '../combat/types';
import { ATTACHMENT_SLOT_NAMES, ATTACHMENT_SLOT_ORDER } from '../data/attachmentDefinitions';
import { COMBAT_BALANCE } from '../data/ammoDefinitions';

export type PlayerDebuffKind = 'recoil' | 'range' | 'attachment';

export interface PlayerDebuffView {
  kind: PlayerDebuffKind;
  label: string;
  value: string;
  turns: number;
}

/** 전투 계산 상태를 그대로 설명하는 플레이어 약화 효과 표시 모델. */
export function playerDebuffEntries(state: PlayerCombatState): PlayerDebuffView[] {
  const entries: PlayerDebuffView[] = [];
  if (state.heavyKickPenaltyTurns > 0 && state.heavyKickPenaltyBonus > 0) {
    entries.push({
      kind: 'recoil',
      label: '반동 교란',
      value: `강한 반동 후속 화력 -${COMBAT_BALANCE.heavyKickPenalty + state.heavyKickPenaltyBonus}`,
      turns: state.heavyKickPenaltyTurns,
    });
  }
  if (state.rangePenaltyTurns > 0 && state.rangePenaltySteps > 0) {
    entries.push({
      kind: 'range',
      label: '거리 교란',
      value: `유효 거리 ${state.rangePenaltySteps}단계 악화`,
      turns: state.rangePenaltyTurns,
    });
  }
  for (const slot of ATTACHMENT_SLOT_ORDER) {
    const turns = state.disabledSlots[slot] ?? 0;
    if (turns > 0) entries.push({
      kind: 'attachment',
      label: `${ATTACHMENT_SLOT_NAMES[slot]} 봉쇄`,
      value: '장착물 비활성화',
      turns,
    });
  }
  return entries;
}
