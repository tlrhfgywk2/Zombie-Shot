import type { Round } from '../rules';
import type { SimulationConfig } from './simulator';

interface ExpectedShot {
  hits: number;
  damages?: number[];
  impacts?: number[];
  woundApplied?: number;
  bonus?: number;
}

interface Fixture {
  id: string;
  sequence: Round[];
  setup?: SimulationConfig;
  shots: ExpectedShot[];
  echoes?: { slot: number; damage: number }[];
  turnWounds?: number[];
}

// 아래 수치는 기준 시나리오의 계약이다. 실제 피해 계산은 전부 resolveVolley에서 일어난다.
export const fixtures: readonly Fixture[] = [
  {
    id: '상처와 연속 타격',
    sequence: ['serrated_round', 'split_round', 'pulse_round', 'convergence_round'],
    shots: [
      { hits: 1, damages: [3], woundApplied: 6 }, { hits: 3, damages: [9, 9, 9] },
      { hits: 2, damages: [11, 12], impacts: [1, 2] }, { hits: 1, damages: [26], bonus: 12 },
    ],
    turnWounds: [3],
  },
  {
    id: '고유 전이율과 일반탄',
    sequence: ['reinforced', 'conduit_round', 'standard', 'standard'],
    shots: [{ hits: 1 }, { hits: 1, impacts: [8] }, { hits: 1, impacts: [4] }, { hits: 1, impacts: [0] }],
  },
  {
    id: '쐐기 순서와 추격 계열',
    sequence: ['wedge_round', 'pursuit_round', 'wounding_round', 'pursuit_round'],
    shots: [{ hits: 2, damages: [2, 8] }, { hits: 1 }, { hits: 1 }, { hits: 2 }],
  },
  {
    id: '반향의 현재 상처와 충격 이력',
    sequence: ['echo_round', 'echo_round', 'serrated_round', 'conduit_round'],
    shots: [{ hits: 1 }, { hits: 1 }, { hits: 1 }, { hits: 1 }],
    echoes: [{ slot: 0, damage: 15 }, { slot: 1, damage: 11 }], turnWounds: [3],
  },
  {
    id: '독립 타격 도중 처치',
    sequence: ['echo_round', 'split_round', 'echo_round', 'conduit_round'], setup: { hp: 10 },
    shots: [{ hits: 1 }, { hits: 2 }], echoes: [],
  },
  {
    id: '반향 처치 후 대기열 폐기',
    sequence: ['echo_round', 'copy', 'echo_round', 'copy'], setup: { hp: 25 },
    shots: [{ hits: 1 }, { hits: 1 }, { hits: 1 }, { hits: 1 }], echoes: [{ slot: 0, damage: 5 }],
  },
  {
    id: '처형과 종결 단일 타격',
    sequence: ['execution', 'standard', 'standard', 'finisher'], setup: { hp: 300 },
    shots: [{ hits: 1, bonus: 15 }, { hits: 1 }, { hits: 1 }, { hits: 1, bonus: 8 }],
  },
  {
    id: '무피해 탄창과 턴 경계',
    sequence: ['vulnerability', 'copy', 'copy', 'copy'], setup: { wound: 7, turns: 3, inventory: 'unlimited' },
    shots: [{ hits: 0 }, { hits: 0 }, { hits: 0 }, { hits: 0 }], turnWounds: [3, 1, 0],
  },
  {
    id: '기본 무한 표적의 피해와 상태',
    sequence: ['echo_round', 'conduit_round', 'split_round', 'execution'], setup: { maxHp: 'infinite' },
    shots: [{ hits: 1 }, { hits: 1 }, { hits: 3 }, { hits: 1, bonus: 0 }], turnWounds: [0],
  },
  {
    id: '조우 접촉 패배',
    sequence: ['pulse_round', 'finisher', 'echo_round', 'conduit_round'],
    setup: { distance: 1, turns: 3, inventory: 'unlimited' },
    shots: [{ hits: 2 }, { hits: 1 }, { hits: 1 }, { hits: 1 }], turnWounds: [0],
  },
];
