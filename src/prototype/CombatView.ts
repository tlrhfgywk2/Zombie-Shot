import { BUILD_LABEL } from '../buildInfo';
import { GamePresentation } from '../presentation/GamePresentation';
import { heatDamageMultiplier } from './combatBalance';
import { CombatController } from './CombatController';
import { ammo, defaultScenario, isRound, P220 } from './rules';
import type { DamageInstance, EchoHit, Frame, Round, Shot } from './rules';
import './combat.css';

const notes: Record<Round, string> = {
  standard: '기본 피해',
  reinforced: '실험용 고화력탄',
  follow_up: `직전 탄의 보정된 기본 피해 중 ${ammo.follow_up.previousRatio * 100}% 추가`,
  finisher: `마지막 칸에서 +${ammo.finisher.base * ammo.finisher.lastBonus}`,
  execution: `체력 ${ammo.execution.threshold}% 이하에서 +${ammo.execution.base * ammo.execution.bonus}`,
  vulnerability: `취약 ${ammo.vulnerability.percent}% · ${ammo.vulnerability.turns}턴 부여·갱신`,
  pain: `이 탄의 취약 보너스 ${ammo.pain.bonusFactor}배`,
  resonance: `최다 한 종류의 탄 수 × ${ammo.resonance.perRound} 추가`,
  mixed: `장전한 탄 종류 수 × ${ammo.mixed.perType} 추가`,
  copy: '직전 탄의 피해·효과 복제',
  wounding_round: `상처 ${ammo.wounding_round.wound} 부여`,
  serrated_round: `상처 ${ammo.serrated_round.wound} 부여`,
  split_round: `${ammo.split_round.hits}회 타격`,
  pursuit_round: `다른 계열 뒤 추가 타격 ${ammo.pursuit_round.pursuitDamage}`,
  echo_round: `턴 종료 시 추가 타격 ${ammo.echo_round.echoDamage}`,
};
const woundDescription = '피해를 받을 때마다 상처 수치만큼 추가 피해를 받습니다. 턴이 끝나면 상처가 절반으로 줄고 소수점은 버립니다.';
const phases = { planning: '사격 준비', firing: '발사 중', approach: '접근 중', victory: '승리', defeat: '접촉 · 패배' };
const heatFormat = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 });
const multiplierFormat = new Intl.NumberFormat('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const damageFormat = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 3 });

function shotNote(shot: Shot) {
  if (!shot.source) return '복제 대상 없음';
  const labels: Partial<Record<Round, string>> = { follow_up: '후속', finisher: '종결', execution: '처형', resonance: '동조', mixed: '혼합' };
  const parts = [];
  if (shot.round === 'copy') parts.push(`${ammo[shot.source].name} 복제`);
  if (shot.bonus) parts.push(`${labels[shot.source]} +${shot.bonus}`);
  if (shot.applied) parts.push(`취약 ${ammo.vulnerability.percent}% · ${ammo.vulnerability.turns}턴`);
  else if (shot.percent) parts.push(`취약 +${shot.percent}%`);
  if (shot.woundApplied) parts.push(`상처 +${shot.woundApplied}`);
  return parts.join(' · ');
}

function damageIndicator(hit: DamageInstance, label: string): string {
  const wound = hit.woundDamage ? ` <small>상처 +${hit.woundDamage}</small>` : '';
  return `<span class="lab-hit"><span>${label}</span> <b data-hit-damage>${hit.damage}</b>${wound}</span>`;
}

function shotRecord(shot: Shot): string {
  const health = Number.isFinite(shot.before)
    ? `체력 ${shot.before} → ${shot.after}${shot.damage !== shot.removed ? ` · 실제 감소 ${shot.removed}` : ''}`
    : '';
  const detail = [shotNote(shot), health].filter(Boolean).join(' · ');
  const hits = shot.hits.length > 1 || shot.hits.some(hit => hit.woundDamage)
    ? `<div class="lab-hits">${shot.hits.map((hit, index) => damageIndicator(hit, `${index + 1}타`)).join('')}</div>` : '';
  return `<li><strong class="lab-shot-name">${shot.index + 1} · ${ammo[shot.round].name}</strong>
    <div class="lab-shot-damage">
      <div><span>기본 피해</span><b data-base-damage>${damageFormat.format(shot.baseDamage)}</b></div>
      <div><span>특성·취약 적용</span><b data-pre-heat-damage>${damageFormat.format(shot.preHeatDamage)}</b></div>
      <div><span>최종 피해 <em>×${multiplierFormat.format(heatDamageMultiplier(shot.heatBefore))}</em></span><b data-final-damage>${damageFormat.format(shot.damage)}</b></div>
    </div>
    ${detail ? `<small>${detail}</small>` : ''}${hits}</li>`;
}

function echoRecord({ shotIndex, hit }: EchoHit): string {
  return `<li data-echo><strong class="lab-shot-name">${shotIndex + 1} · 반향</strong>
    <div class="lab-hits">${damageIndicator(hit, '턴 종료 타격')}</div>
    ${Number.isFinite(hit.before) ? `<small>체력 ${hit.before} → ${hit.after}</small>` : ''}</li>`;
}

export function mountCombat(root: HTMLElement) {
  const choices = Object.keys(ammo).filter(isRound);
  root.innerHTML = `<main class="combat-lab">
    <header class="lab-head"><h1><i class="round-mark"></i>좀비 샷 <small>전투 시험장</small></h1><small class="build-id">${BUILD_LABEL}</small></header>
    <div class="lab-columns"><section class="lab-field" aria-label="전투 상황">
      <div class="field-head"><h2>감염체</h2><strong data-phase-label role="status"></strong></div>
      <div class="lab-scene"></div>
      <div class="lab-meters"><div><span>체력</span><b data-hp></b></div><div><span>접촉까지</span><b data-distance></b></div>
        <div><span>취약</span><b data-status></b></div><div><span>완료 턴</span><b data-turns></b></div><div><span>적 행동</span><b data-actions></b></div>
        <div class="lab-wound" hidden title="${woundDescription}" role="group" aria-label="${woundDescription}"><span>상처</span><b data-wound></b></div></div>
      <div class="lab-heat"><div>무기 열 <b data-weapon-heat></b></div><div>피해 배율 <b data-heat-multiplier></b></div></div>
    </section>
    <section class="lab-planner" aria-label="탄창 편집">
      <div class="planner-head"><h2>${P220.name} <small>탄창</small></h2><button type="button" data-reset>다시 시작</button></div>
      <div class="lab-slots" aria-label="발사 순서"></div>
      <div class="lab-edit"><span data-selected></span><button data-shift="-1" aria-label="앞 칸으로 이동">←</button><button data-shift="1" aria-label="뒤 칸으로 이동">→</button><button data-clear>칸 비우기</button></div>
      <h3>탄약 선택</h3><div class="lab-choices">${choices.map(id => `<button data-round="${id}" title="${ammo[id].family === 'WOUND' ? '상처' : '체력'} 계열">
        <i class="round-mark"></i><b class="lab-ammo-name">${ammo[id].name}</b><small>${notes[id]}</small>
        <strong aria-label="${id === 'copy' ? '직전 탄 피해' : id === 'split_round' ? '타격당 기본 피해 ' + ammo[id].base : '기본 피해 ' + ammo[id].base}">${id === 'copy' ? '↶' : ammo[id].base}</strong>
        <span class="lab-ammo-heat">열 <b>+${ammo[id].heat}</b></span>
      </button>`).join('')}</div>
      <button class="lab-fire" data-fire aria-keyshortcuts="R">발사</button>
    </section></div>
    <section class="lab-record"><h2>사격 기록</h2><div data-log></div></section>
    <details class="lab-settings"><summary>전투 설정</summary><form>
      <label>최대 체력<input name="maxHp" type="number" min="1" step="1" placeholder="무한"></label>
      <label>시작 거리<input name="distance" type="number" min="1" step="1" required value="${defaultScenario.distance}"></label>
      <label>턴당 접근 거리<input name="approach" type="number" min="1" step="1" required value="${defaultScenario.approach}"></label>
      <button>적용 후 다시 시작</button></form></details>
  </main>`;
  const element = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const scene = new GamePresentation(element('.lab-scene'));
  let selected = 0;
  const game = new CombatController(render);
  const slots = game.slots.map((_, index) => {
    const button = document.createElement('button');
    button.dataset.slot = String(index);
    button.setAttribute('aria-keyshortcuts', String(index + 1));
    element('.lab-slots').append(button);
    return button;
  });
  const form = element<HTMLFormElement>('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const maxHp = form.elements.namedItem('maxHp') as HTMLInputElement;
    for (const input of form.querySelectorAll('input')) {
      if (input === maxHp && input.value === '') continue;
      if (!Number.isSafeInteger(input.valueAsNumber)) {
        input.setCustomValidity('표현 가능한 양의 정수를 입력하세요.');
        input.reportValidity();
        return;
      }
    }
    const value = (key: string) => (form.elements.namedItem(key) as HTMLInputElement).valueAsNumber;
    game.reset({ maxHp: maxHp.value === '' ? defaultScenario.maxHp : maxHp.valueAsNumber, distance: value('distance'), approach: value('approach') });
  });
  form.addEventListener('input', e => (e.target as HTMLInputElement).setCustomValidity(''));
  root.addEventListener('click', e => {
    const button = (e.target as HTMLElement).closest('button');
    if (!button || button.disabled) return;
    const { slot, round, shift } = button.dataset;
    if (button.hasAttribute('data-reset')) { game.reset(); return; }
    if (button.hasAttribute('data-fire')) { game.fire(); return; }
    if (game.state.phase !== 'planning') return;
    if (slot !== undefined) {
      selected = Number(slot);
      if (game.slots[selected] !== null) {
        game.edit(selected, null);
        return;
      }
    } else if (isRound(round)) {
      game.edit(selected, round);
      selected = (selected + 1) % slots.length;
    } else if (shift) {
      const destination = selected + Number(shift);
      if (destination < 0 || destination >= slots.length) return;
      const current = game.slots[selected]!;
      game.edit(selected, game.slots[destination]!);
      game.edit(destination, current);
      selected = destination;
    } else if (button.hasAttribute('data-clear')) game.edit(selected, null);
    render();
  });

  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]')) return;
    const slot = /^[1-9]$/.test(event.key) ? slots[Number(event.key) - 1] : undefined;
    if (!slot && event.code !== 'Space' && event.code !== 'KeyR') return;
    event.preventDefault();
    if (event.repeat || game.state.phase !== 'planning') return;
    if (slot) {
      slot.click();
      slot.focus();
      return;
    }
    if (event.code === 'KeyR') {
      game.fire();
      return;
    }
    selected = 0;
    game.clearMagazine();
    slots[0]?.focus();
  });

  function render(kind?: Frame['kind'] | 'reset') {
    const { state, shots, echoes } = game;
    const planning = state.phase === 'planning';
    if (kind === 'reset') scene.resetTestScene(state.distance);
    if (kind === 'shot') scene.showTestShot(ammo[shots.at(-1)!.round].name);
    if (kind === 'approach' || kind === 'cleanup' || kind === 'defeat') scene.setTestDistance(state.distance, kind !== 'approach');
    if (kind === 'victory') scene.showTestVictory();
    scene.setWeaponHeat(state.weaponHeat, kind === 'reset' || kind === 'victory' || kind === 'defeat');
    element('[data-phase-label]').textContent = phases[state.phase];
    element('.combat-lab').dataset.phase = state.phase;
    element('[data-hp]').textContent = state.maxHp === Infinity ? '∞' : `${state.hp} / ${state.maxHp}`;
    element('[data-distance]').textContent = String(state.distance);
    element('[data-status]').textContent = state.vulnerable ? `${state.vulnerable.percent}% · ${state.vulnerable.remaining}턴` : '없음';
    element('[data-wound]').textContent = String(state.wound);
    element('.lab-wound').hidden = state.wound === 0;
    element('[data-turns]').textContent = String(state.turns);
    element('[data-actions]').textContent = String(state.actions);
    element('[data-weapon-heat]').textContent = heatFormat.format(state.weaponHeat);
    element('[data-heat-multiplier]').textContent = `×${multiplierFormat.format(heatDamageMultiplier(state.weaponHeat))}`;
    slots.forEach((button, i) => {
      const round = game.slots[i];
      const unfired = state.phase === 'victory' && i >= shots.length;
      button.dataset.roundId = round ?? '';
      button.innerHTML = `<small>${i + 1} ${unfired ? '· 미발사' : ''}</small><b>${round ? ammo[round].name : '빈 칸'}</b>`;
      button.setAttribute('aria-pressed', String(selected === i));
      button.title = planning && round ? '탄 빼기' : '';
      button.disabled = !planning;
    });
    element('[data-selected]').textContent = `${selected + 1}번 칸 편집`;
    root.querySelectorAll<HTMLButtonElement>('[data-round],[data-shift],[data-clear]').forEach(button => {
      const dest = selected + Number(button.dataset.shift ?? 0);
      button.disabled = !planning || dest < 0 || dest >= slots.length;
    });
    element<HTMLButtonElement>('[data-fire]').disabled = !planning || game.slots.includes(null);
    element('[data-log]').innerHTML = shots.length ? `<ol>${shots.map(shotRecord).join('')}${echoes.map(echoRecord).join('')}</ol>` : '<p>아직 발사한 탄이 없습니다.</p>';
  }
  game.reset();
}
