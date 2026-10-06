import { AMMO_DEFINITIONS, AMMO_ORDER, COMBAT_BALANCE, DRAFT_AMMO, type AmmoDefinition } from './ammoDefinitions';
import { conditionText, PAYLOAD_NAMES, ruleText } from '../combat/AmmoRules';
import { ammoEffectText, burnEffectText, woundEffectText } from '../ui/AmmoView';
import type { AmmoType, PrimaryPayload } from '../combat/types';

const families = { HEALTH: '체력 피해', EXPLOSION: '폭발', BURN: '화상 / 점화', WOUND: '상처', IMPACT: '충격' };
const categories = { direct: '직접 효과', sequence: '탄약 연계', layout: '탄창 배열' };
const layers = { enemy: '적', ammo: '탄약', magazine: '탄창' };
const balanceNotes: Partial<Record<AmmoType, string>> = {
  focus: '단일 계열 연사 초기 피해가 고압 연사를 넘어 기본 화력 3에서 2로 낮춤. 혼합하면 기본 화력만 적용.',
  mosaic: '자신의 체력 계열 포함. 다섯 계열을 갖춰야 최대 보상이며 집중탄과 반대 전략.',
  lightLoad: '6칸에 4발은 근거리 32 피해. 두 빈 칸과 특수탄 4발 비용을 지불하며 상태 효과를 준비하지 못함.',
  opening: '선제 피해를 확보하는 대신 다른 칸에서는 표준탄보다 약함.',
  finisher: '첫 발보다 늦은 처치와 누적 반동 위험을 지불. 조기 처치로 미발사되면 소모 안 함.',
  core: '중앙 보상은 첫·마지막보다 작음. 한두 발 부분 장전에서는 비활성.',
  crosslink: '양 이웃이 필요하고 서로 다른 계열이어야 하므로 중앙탄보다 큰 보상.',
  mirror: '장전 길이 기준 대칭. 중앙 자기 자신은 조건을 충족하지 않음.',
  bridge: '즉시 화력과 슬롯을 지불해 다음 주효과 절반 추가. 양 이웃 없는 첫·끝 칸에서 비활성.',
  alternator: '체력 계열 고정. 직전 상처·충격 등과 교차해야 화력 6.',
  afterimage: '기본 화력 1과 절반 재발동. 연속 잔향은 값이 수렴하고 규칙 재실행 없음.',
  mimic: '자체 화력 없음. 직전 탄의 주효과만 같은 값으로 전달. 연속 복사로 값 자체가 증가하지 않음.',
};
export const SPEC_HEADERS = [
  '탄약 ID', '한국어 이름', '영어 이름', '상태', '적 효과 계열', '기계적 분류', '계층', '기본 화력 / 체력 피해', '현재 체력 비례율', '반동',
  '폭발 축적', '화상 축적', '상처 축적', '충격 축적', '취약 상호작용', '점화 상호작용', '이동 효과', '직전 탄 조건', '다음 탄 조건',
  '탄창 위치 조건', '탄창 구성 조건', '주효과 종류', '주효과 기본값', '부가효과', '부가효과 값', '발동 조건', '효과 상세', '짧은 툴팁', '밸런스 근거', '구현 참고',
  '즉시 화상 피해', '반동 회복', '조건 화력 증가', '체력 비례 증가 상한', '처형 체력 조건 (%)', '취약 추가 증폭 (%)',
  '취약 발동 추가 피해', '취약 추가 턴', '취약 추가 상처', '발동 후 상처 보존', '현재 화상 비례 (%)', '점화 화력 증가',
  '현재 충격 배수 기준', '현재 충격 증가 상한', '연계/배열 증가 값', '연계/배열 증가 방식', '사격 전 이동 (m)', '사격 후 이동 (m)', '희귀도', '반동 전환 증가 상한', '연계/배열 대상',
] as const;
export type SpecValue = string | number | null;

const movement = (item: AmmoDefinition) => [item.moveBefore ? `사격 전 ${Math.abs(item.moveBefore)}m 전진` : '', item.moveAfter ? `사격 후 ${item.moveAfter}m 후퇴` : ''].filter(Boolean).join(' · ');
function secondary(item: AmmoDefinition): [string, string] {
  const values: [string, number][] = [
    ['즉시 화상 피해', item.burnDamage], ['반동 회복', item.recoilRecovery ?? 0], ['취약 대상 화력', item.vulnerableBonus ?? 0],
    ['행동 중단 대상 화력', item.suppressedBonus ?? 0], ['처형 화력', item.execution?.bonus ?? 0], ['취약 추가 증폭 (%)', item.vulnerableDamagePercentBonus ?? 0],
    ['취약 발동 추가 피해', item.vulnerableTriggerDamage ?? 0], ['취약 추가 턴', item.vulnerableExtraTurns ?? 0], ['취약 추가 상처', item.vulnerableWoundBonus ?? 0], ['상처 보존', item.woundRetention ?? 0],
    ['현재 화상 비례 (%)', item.burnScalePercent ?? 0], ['점화 화력', item.ignitedBonus ?? 0],
  ];
  for (const key of ['firepower', 'wound', 'explosive', 'burn', 'actionShock'] as PrimaryPayload[])
    if (!item.primaryEffects.includes(key) && item[key]) values.push([PAYLOAD_NAMES[key], item[key]]);
  const present = values.filter(([, value]) => value !== 0);
  const mechanical = ruleText(item);
  return [[...present.map(([name]) => name), mechanical].filter(Boolean).join('\n'),
    [...present.map(([name, value]) => `${name}: ${value}`), ...item.rules.map(rule => `${rule.action.type === 'next' ? '다음 탄' : '현재 탄'}: ${'amount' in rule.action ? rule.action.amount : rule.action.percent}${'mode' in rule.action && rule.action.mode === 'add' ? '' : '%'}`)].join('\n')];
}
export function ammoSpecRows(): SpecValue[][] {
  const rows = AMMO_ORDER.map(id => {
    const item = AMMO_DEFINITIONS[id];
    const condition = item.rules[0]?.condition;
    const action = item.rules[0]?.action;
    const text = ruleText(item);
    const [secondaryNames, secondaryValues] = secondary(item);
    const vulnerable = [item.firepower || item.rules.some(rule => rule.action.type === 'copyPrevious' || rule.action.type === 'replayPrevious') ? `사격 시작 시 취약하면 체력 화력 +${COMBAT_BALANCE.vulnerableDamagePercent + (item.vulnerableDamagePercentBonus ?? 0)}%` : '', woundEffectText(id)].filter(Boolean).join(' · ');
    const trigger = [text, item.vulnerableBonus ? '사격 시작 시 취약' : '', item.suppressedBonus ? '현재 충격이 다음 행동 임계치 이상' : '',
      item.execution ? `현재 체력 ${item.execution.percent}% 이하` : '', item.ignitedBonus ? '사격 시작 시 점화' : '',
      item.healthScale ? `현재 체력 ${item.healthScale.divisor}당 +1, 최대 +${item.healthScale.cap}` : '',
      item.recoilScale ? `기존 반동만큼 화력 증가, 최대 +${item.recoilScale.cap}; 반동 전부 소비` : '',
      item.shockScale ? `현재 충격 ${item.shockScale.divisor}당 +1, 최대 +${item.shockScale.cap}` : '',
      woundEffectText(id), burnEffectText(id)].filter(Boolean).join(' · ');
    const notes = [item.primaryEffects.length > 1 ? '체력과 충격을 의도적으로 함께 복사한다. 기존 무기 특성의 강화 대상은 충격으로 유지.' : '',
      item.rules.length ? '배열은 최종 확정 탄창. 연계는 직전 발사와 다음 발. 복사 수치는 취약·거리·반동·외부 충격 부착물 보정 전.' : '',
      id === 'ball' ? '기본 반동 값은 1. P220의 표준탄 특성 적용 시 실제 반동 0.' : '',
      item.burnDamage ? '즉시 화상 피해는 주효과에 포함되지 않으며 복사·주효과 증폭 제외.' : '',
      item.healthScale ? '비례율은 1/체력 배수. 실제 추가 피해는 버림 및 상한 적용.' : '',
      item.rules.some(rule => rule.action.type === 'copyPrevious' || rule.action.type === 'replayPrevious') ? '원래 탄의 이동·반동·전달·배열·상태 발동 부가효과를 실행하지 않는다. 복사탄의 계열은 체력으로 유지.' : '',
    ].filter(Boolean).join(' · ');
    const row: SpecValue[] = [id, item.name, item.englishName, '확정', families[item.family], categories[item.category], item.layers.map(layer => layers[layer]).join(' + '),
      item.firepower, item.healthScale ? 1 / item.healthScale.divisor : 0, item.recoil, item.explosive, item.burn, item.wound, item.actionShock,
      vulnerable, burnEffectText(id), movement(item), condition?.type === 'previousFamily' || condition?.type === 'previousExists' || condition?.type === 'bridgeDifferent' ? conditionText(condition) : '',
      condition?.type === 'nextFamily' || condition?.type === 'bridgeDifferent' || action?.type === 'next' ? condition ? `${conditionText(condition)}${action?.type === 'next' ? ' · 바로 다음 한 발만' : ''}`.trim() : '' : '',
      condition && ['first', 'last', 'interior', 'adjacentDifferent', 'symmetricSame'].includes(condition.type) ? conditionText(condition) : '',
      condition && ['familyDiversity', 'monoFamily', 'emptySlots'].includes(condition.type) ? conditionText(condition) : '',
      item.rules.some(rule => rule.action.type === 'copyPrevious') ? '직전 탄의 계산된 주효과' : item.primaryEffects.map(key => PAYLOAD_NAMES[key]).join(' + '),
      item.primaryEffects.map(key => `${PAYLOAD_NAMES[key]}: ${item[key]}`).join('\n'), secondaryNames, secondaryValues, trigger,
      [item.role, text, movement(item)].filter(Boolean).join(' · '), ammoEffectText(id) || item.role,
      balanceNotes[id] ?? '기존 확정 수치 유지. 반동·거리·부착물·기존 상태에서 기존 전투 규칙을 재사용.', notes,
      item.burnDamage, item.recoilRecovery ?? 0, item.vulnerableBonus ?? item.suppressedBonus ?? item.execution?.bonus ?? 0,
      item.healthScale?.cap ?? 0, item.execution?.percent ?? 0, item.vulnerableDamagePercentBonus ?? 0,
      item.vulnerableTriggerDamage ?? 0, item.vulnerableExtraTurns ?? 0, item.vulnerableWoundBonus ?? 0, item.woundRetention ?? 0,
      item.burnScalePercent ?? 0, item.ignitedBonus ?? 0, item.shockScale?.divisor ?? 0, item.shockScale?.cap ?? 0,
      action ? ('amount' in action ? action.amount : action.percent) : 0,
      action ? ('mode' in action ? action.mode === 'add' ? '정수 추가' : '비율 증가 (%)' : '직전 주효과 비율 (%)') : '',
      item.moveBefore ?? 0, item.moveAfter ?? 0, item.rarity === 'common' ? '일반' : '고급', item.recoilScale?.cap ?? 0,
      action && 'target' in action ? action.target === 'primary' ? action.type === 'self' ? item.primaryEffects.map(key => PAYLOAD_NAMES[key]).join(' + ') : '다음 탄의 명시적 주효과' : PAYLOAD_NAMES[action.target] : action ? '직전 탄의 계산된 주효과' : ''];
    return row;
  });
  for (const draft of DRAFT_AMMO) {
    const row: SpecValue[] = Array(SPEC_HEADERS.length).fill(null);
    row.splice(0, 7, draft.id, draft.name, draft.englishName, '초안 / 미정', '미정', '직접 효과', '적');
    row[16] = draft.role; row[26] = draft.role; row[28] = '설계 문서의 (?) 표기. 수치 미확정.'; row[29] = '활성 정의·보급·보상·장전 풀 제외. 영어 이름은 작업용 번역.';
    rows.push(row);
  }
  return rows;
}

export const SPEC_DEFINITIONS = [
  ['적 효과 계열', '체력 피해 / 폭발 / 화상·점화 / 상처 / 충격의 다섯 계열. 탄약·탄창은 계열이 아닌 기계적 계층.'],
  ['적 계층', '체력 피해 및 적에게 축적하는 효과. 기존 적 상태와 전투 해결 규칙 사용.'],
  ['탄약 계층', '직전 실제 발사 탄과 다음 발의 관계. 전달 효과는 바로 다음 한 발에서 소비.'],
  ['탄창 계층', '발사 확정 시 최종 장전 순서·용량·계열을 고정. 앞 탄 제거 후에도 조건 유지.'],
  ['주효과', '명시된 화력·폭발·화상·상처·충격 축적 값. 중량탄은 화력+충격 복합. 발화탄의 주효과는 화력.'],
  ['복사·잔향', '무기 및 탄약 조건·연계·배열을 반영한 주효과 값을 복제. 현재 탄의 반동·거리·취약으로 해결. 이동·규칙·즉시 화상·취약 발동 부가효과는 복제하지 않음.'],
  ['상처·취약', `상처 ${COMBAT_BALANCE.woundThreshold}마다 소비하고 초과분 유지. 취약 기본 ${COMBAT_BALANCE.vulnerableTurns}턴. 현재 사격 시작 시 활성 취약은 후속 체력 화력 +${COMBAT_BALANCE.vulnerableDamagePercent}%. 상처 자체는 화력 배율이 아님.`],
  ['충격', '다음 행동 임계치에 도달하면 그 행동을 중단하고 임계치만 소비. 사격 중 축적 한도 없음.'],
  ['폭발', `충격 1 이상인 이번 명중으로 전량 기폭. 누적량 ×${COMBAT_BALANCE.explosionDamagePerStack} 피해. 거리·반동·취약 무관.`],
  ['화상·점화', `화상 기본 임계치 ${COMBAT_BALANCE.burnThreshold}. 적마다 다름. 한 발에서 임계치 한 번 소비. 자동 지속 피해 없음. 점화는 다음 특수 행동을 접근으로 변경. 행동 중단 시 유지.`],
  ['대칭 위치', '장전 수 −1 − 현재 0기준 칸. 사용하지 않은 빈 칸 제외. 홀수 중앙의 자기 자신은 비활성.'],
  ['혼합·단일 계열', '탄약에 선언된 주계열로 판정. 복사탄이 상처를 복사해도 체력 계열. 중량탄은 충격 계열. 자기 탄의 계열 포함. 한 발도 단일 계열.'],
  ['숫자 규약', '확정 탄의 해당 없음은 숫자 0. 초안의 미정 숫자는 빈칸. 현재 체력 비례율은 Excel 백분율. 나머지 (%) 열은 50처럼 퍼센트 단위의 정수.'],
  ['명세 기준', '기본 탄약 수치. 실제 무기·부착물 보정은 별도. P220 표준탄은 무기 특성으로 반동 0.'],
  ['갱신', '수치는 src/data/ammoDefinitions.ts를 수정한 뒤 npm run export:ammo로 재생성. Excel 편집값을 게임에 자동 반영하지 않음.'],
  ['원본 설계', 'docs/탄약_설계.md (사용자 제공 탄약 정리.md 사본). 기존 문서의 화상 전용 요약보다 우선.'],
];
export const SPEC_BALANCE_NOTES = [
  ['수치 규모', '기존 34종 유지. 새 조건은 정수 증가, 매개·잔향은 50% 후 버림. 취약 반올림은 기존 규칙.'],
  ['대표 탄창', 'P220 근거리: 표준 4발 20, 집중 4발 24, 단일 배열 25, 다섯 계열 5발 21, 초탄·연계·중심·종결 25, 부분 경량·종결 15, 고압·복사·잔향·복사 25.'],
  ['경량장전', '기본 4칸 한 발 화력 10, 최대 6칸 한 발 14. 6칸에 경량 4발은 32 피해. 특수탄 비용·상태 부재·빈 칸을 지불하는 고출력 전문 전략.'],
  ['용량', '무기 기본 4칸, P220 최대 6, M1911·데저트 이글 최대 5, M500 고정 4. 부착물 봉쇄에 따른 실제 용량 포함.'],
  ['복사 안정성', '이전 수치만 저장. 복사·재발동 규칙을 호출하지 않음. 연속 복사는 같은 값, 연속 잔향은 감소·수렴. 새 탄창에 이전 수치 이월 없음.'],
  ['무기 특성', '기존 무기 특성은 선언된 단일 강화 대상 유지. 중량탄은 복사·매개에서는 복합 주효과이나 기존 무기 강화는 충격만.'],
  ['미확정', '넉백탄(?)은 초안 / 미정. 일반 보급·보상 풀에서 제외. 피해·반동·표적 이동량 미정.'],
  ['후속 관찰', '경량장전 반복 보유 및 복사탄과 고출력 준비 탄의 조합은 장기 보급 환경에서 추가 관찰 필요. 대표 조합은 전역 최적화 증명이 아님.'],
];
