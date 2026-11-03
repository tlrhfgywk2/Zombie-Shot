import { ENEMY_DEFINITIONS } from '../data/enemyDefinitions';
import { ENEMY_BEHAVIORS } from '../data/enemyBehaviorDefinitions';
import { ENEMY_RANGED_ACTIONS } from '../data/enemyActionDefinitions';
import { ACTION_NAMES, ACTION_SHOCK_THRESHOLDS } from '../combat/CombatResolver';
import { COMBAT_BALANCE } from '../data/ammoDefinitions';

/** 조회 전용. 현재 생성 함수는 스테이지/깊이를 받지 않아 모든 유형의 상승치는 0이다. */
export function enemyGuideRows() {
  return Object.values(ENEMY_DEFINITIONS).map(enemy => {
    const behavior = enemy.behavior ? ENEMY_BEHAVIORS[enemy.behavior] : undefined;
    const patterns = behavior ? Object.values(behavior.phases).map(phase =>
      `${phase.name} → ${ACTION_NAMES[phase.action]}${phase.movement ? ` ${phase.movement} m` : ''} · 직접 화력 ${phase.directDamagePercent}% · ${phase.opportunities}회 · 중단 ${ACTION_SHOCK_THRESHOLDS[phase.action] + enemy.shockResistance}`)
      : enemy.intent ? [`${enemy.intent.name} · 첫 행동 ${enemy.intent.initialCountdown}회째 / 재사용 ${enemy.intent.cooldown}회 · 사거리 ${ENEMY_RANGED_ACTIONS[enemy.intent.type].maxRange} m · 중단 ${ACTION_SHOCK_THRESHOLDS[enemy.intent.type] + enemy.shockResistance}`, enemy.intent.description]
      : ['접근 → 근접 치명 공격'];
    if (behavior?.guardBreak) patterns.push(`방어 붕괴: 압력 ${behavior.guardBreak.pressure} 또는 피해 명중 ${behavior.guardBreak.hits}회`);
    if (enemy.behavior === 'disruptor') patterns.push('활성 장착물 하나 1턴 봉쇄 · 탄창 제외 · 대상 없으면 거리 교란 1턴');
    return { ...enemy, growth: 0, wound: enemy.woundThreshold ?? COMBAT_BALANCE.woundThreshold,
      burn: enemy.burnThreshold ?? COMBAT_BALANCE.burnThreshold,
      approachShock: ACTION_SHOCK_THRESHOLDS.approach + enemy.shockResistance,
      attackShock: ACTION_SHOCK_THRESHOLDS.attack + enemy.shockResistance, patterns };
  });
}

export function mountEnemyGuide(root: HTMLElement): void {
  const dialog = document.createElement('dialog');
  dialog.className = 'enemy-guide';
  dialog.setAttribute('aria-labelledby', 'enemy-guide-title');
  dialog.innerHTML = `<header><div><h2 id="enemy-guide-title">감염체 도감</h2><p>현재 전투 기준 · 프리 / 탐험 공통</p></div><button type="button" data-close-enemy-guide aria-label="감염체 도감 닫기" autofocus>닫기</button></header>
    <p class="enemy-guide-note">체력은 모든 스테이지에서 고정입니다. 근접 1 m 미만의 치명 공격은 즉사합니다. 단계의 횟수는 해당 적의 행동 기회 기준입니다.</p>
    <div class="enemy-guide-scroll" tabindex="0" role="region" aria-label="감염체 능력 표 · 가로와 세로 스크롤"><table><colgroup><col class="guide-name"><col class="guide-hp"><col class="guide-growth"><col class="guide-distance"><col class="guide-move"><col class="guide-shock"><col class="guide-threshold"><col class="guide-pattern"></colgroup><caption class="sr-only">감염체별 체력·이동·상태 임계치·행동 주기</caption><thead><tr><th scope="col">감염체</th><th scope="col">체력</th><th scope="col">스테이지당<br>체력 증가</th><th scope="col">시작 거리</th><th scope="col">일반 접근</th><th scope="col">중단 충격<br>접근 / 치명</th><th scope="col">상처 / 점화<br>임계치</th><th scope="col">행동 패턴</th></tr></thead><tbody>${enemyGuideRows().map(enemy => `<tr><th scope="row">${enemy.name}</th><td>${enemy.hp}</td><td>+${enemy.growth}</td><td>${enemy.distance} m</td><td>${enemy.advancePerTurn} m</td><td>${enemy.approachShock} / ${enemy.attackShock}</td><td>${enemy.wound} / ${enemy.burn}</td><td class="enemy-guide-pattern">${enemy.patterns.map(pattern => `<span>${pattern}</span>`).join('')}</td></tr>`).join('')}</tbody></table></div>
    <footer>좌우로 밀어 전체 표 확인 · 시작 거리는 다수 조우 배치와 탐험 상황에 따라 달라집니다. 회복 이후 주기 반복 · 근접 치명 공격은 예고 후 실행합니다.</footer>`;
  root.append(dialog);
  // 네이티브 모달의 포인터 차단과 함께 문서 수준 전투 단축키도 격리한다.
  dialog.addEventListener('keydown', event => event.stopPropagation());
  let opener: HTMLElement | undefined;
  root.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLElement>('[data-open-enemy-guide]');
    if (!button) return;
    opener = button;
    if (!dialog.open) {
      dialog.showModal();
      const scroll = dialog.querySelector('.enemy-guide-scroll')!;
      scroll.scrollLeft = 0; scroll.scrollTop = 0;
    }
  });
  dialog.querySelector('[data-close-enemy-guide]')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
}
