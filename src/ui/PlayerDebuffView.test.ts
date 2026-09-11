import { describe, expect, it } from 'vitest';
import { createPlayerCombatState } from '../combat/AttachmentLoadout';
import { playerDebuffEntries } from './PlayerDebuffView';

describe('플레이어 약화 효과 표시', () => {
  it('효과가 없으면 아무 항목도 표시하지 않는다', () => {
    expect(playerDebuffEntries(createPlayerCombatState())).toEqual([]);
  });

  it('특수 행동으로 받은 반동·거리·장착물 봉쇄 효과와 남은 턴을 표시한다', () => {
    const state = createPlayerCombatState();
    state.heavyKickPenaltyBonus = 1;
    state.heavyKickPenaltyTurns = 2;
    state.rangePenaltySteps = 1;
    state.rangePenaltyTurns = 1;
    state.disabledSlots.muzzle = 2;

    expect(playerDebuffEntries(state)).toEqual([
      { kind: 'recoil', label: '반동 교란', value: '강한 반동 후속 화력 -3', turns: 2 },
      { kind: 'range', label: '거리 교란', value: '유효 거리 1단계 악화', turns: 1 },
      { kind: 'attachment', label: '총구 봉쇄', value: '장착물 비활성화', turns: 2 },
    ]);
  });
});
