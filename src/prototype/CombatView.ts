import { BUILD_LABEL } from '../buildInfo';
import { GamePresentation } from '../presentation/GamePresentation';
import { CombatController } from './CombatController';
import { ammo, defaultScenario, isRound, P220 } from './rules';
import type { Frame, Round, Shot } from './rules';
import './combat.css';

const notes: Record<Round, string> = {
  standard: '기본 피해',
  reinforced: '실험용 고화력탄',
  follow_up: `직전 피해의 ${ammo.follow_up.previousRatio * 100}% 추가`,
  finisher: `마지막 칸에서 +${ammo.finisher.base * ammo.finisher.lastBonus}`,
  execution: `체력 ${ammo.execution.threshold}% 이하에서 +${ammo.execution.base * ammo.execution.bonus}`,
  vulnerability: `취약 ${ammo.vulnerability.percent}% · ${ammo.vulnerability.turns}턴 부여·갱신`,
  pain: `이 탄의 취약 보너스 ${ammo.pain.bonusFactor}배`,
};
const phases = { planning: '사격 준비', firing: '발사 중', approach: '접근 중', victory: '승리', defeat: '접촉 · 패배' };

function shotNote(shot: Shot) {
  if (shot.applied) return `취약 ${ammo.vulnerability.percent}% · ${ammo.vulnerability.turns}턴`;
  const effect = { follow_up: '후속', finisher: '종결', execution: '처형' } as const;
  const parts = [];
  if (shot.round in effect && shot.bonus) parts.push(`${effect[shot.round as keyof typeof effect]} +${shot.bonus}`);
  if (shot.percent) parts.push(`취약 +${shot.percent}%`);
  return parts.join(' · ');
}

export function mountCombat(root: HTMLElement) {
  const choices = Object.keys(ammo).filter(isRound);
  root.innerHTML = `<main class="combat-lab">
    <header class="lab-head"><h1><i class="round-mark"></i>좀비 샷 <small>전투 시험장</small></h1><small class="build-id">${BUILD_LABEL}</small></header>
    <div class="lab-columns"><section class="lab-field" aria-label="전투 상황">
      <div class="field-head"><h2>감염체</h2><strong data-phase-label role="status"></strong></div>
      <div class="lab-scene"></div>
      <div class="lab-meters"><div><span>체력</span><b data-hp></b></div><div><span>접촉까지</span><b data-distance></b></div>
        <div><span>취약</span><b data-status></b></div><div><span>완료 턴</span><b data-turns></b></div><div><span>적 행동</span><b data-actions></b></div></div>
    </section>
    <section class="lab-planner" aria-label="탄창 편집">
      <div class="planner-head"><h2>${P220.name} <small>탄창</small></h2><button type="button" data-reset>다시 시작</button></div>
      <div class="lab-slots" aria-label="발사 순서"></div>
      <div class="lab-edit"><span data-selected></span><button data-shift="-1" aria-label="앞 칸으로 이동">←</button><button data-shift="1" aria-label="뒤 칸으로 이동">→</button><button data-clear>칸 비우기</button></div>
      <h3>탄약 선택</h3><div class="lab-choices">${choices.map(id => `<button data-round="${id}"><i class="round-mark"></i><span><b>${ammo[id].name}</b><small>${notes[id]}</small></span><strong aria-label="기본 피해 ${ammo[id].base}">${ammo[id].base}</strong></button>`).join('')}</div>
      <button class="lab-fire" data-fire>발사</button>
    </section></div>
    <section class="lab-record"><h2>사격 기록</h2><div data-log></div></section>
    <details class="lab-settings"><summary>전투 설정</summary><form>
      <label>최대 체력<input name="maxHp" type="number" min="1" step="1" required value="${defaultScenario.maxHp}"></label>
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
    element('.lab-slots').append(button);
    return button;
  });
  const form = element<HTMLFormElement>('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const input of form.querySelectorAll('input')) {
      if (!Number.isSafeInteger(input.valueAsNumber)) {
        input.setCustomValidity('표현 가능한 양의 정수를 입력하세요.');
        input.reportValidity();
        return;
      }
    }
    const value = (key: string) => (form.elements.namedItem(key) as HTMLInputElement).valueAsNumber;
    game.reset({ maxHp: value('maxHp'), distance: value('distance'), approach: value('approach') });
  });
  form.addEventListener('input', e => (e.target as HTMLInputElement).setCustomValidity(''));
  root.addEventListener('click', e => {
    const button = (e.target as HTMLElement).closest('button');
    if (!button || button.disabled) return;
    const { slot, round, shift } = button.dataset;
    if (button.hasAttribute('data-reset')) { game.reset(); return; }
    if (button.hasAttribute('data-fire')) { game.fire(); return; }
    if (game.state.phase !== 'planning') return;
    if (slot !== undefined) selected = Number(slot);
    else if (isRound(round)) {
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

  function render(kind?: Frame['kind'] | 'reset') {
    const { state, shots } = game;
    const planning = state.phase === 'planning';
    if (kind === 'reset') scene.resetTestScene(state.distance);
    if (kind === 'shot') scene.showTestShot(ammo[shots.at(-1)!.round].name);
    if (kind === 'approach' || kind === 'cleanup' || kind === 'defeat') scene.setTestDistance(state.distance, kind !== 'approach');
    if (kind === 'victory') scene.showTestVictory();
    element('[data-phase-label]').textContent = phases[state.phase];
    element('.combat-lab').dataset.phase = state.phase;
    element('[data-hp]').textContent = `${state.hp} / ${state.maxHp}`;
    element('[data-distance]').textContent = String(state.distance);
    element('[data-status]').textContent = state.vulnerable ? `${state.vulnerable.percent}% · ${state.vulnerable.remaining}턴` : '없음';
    element('[data-turns]').textContent = String(state.turns);
    element('[data-actions]').textContent = String(state.actions);
    slots.forEach((button, i) => {
      const round = game.slots[i];
      const unfired = state.phase === 'victory' && i >= shots.length;
      button.dataset.roundId = round ?? '';
      button.innerHTML = `<small>${i + 1} ${unfired ? '· 미발사' : ''}</small><b>${round ? ammo[round].name : '빈 칸'}</b>`;
      button.setAttribute('aria-pressed', String(selected === i));
      button.disabled = !planning;
    });
    element('[data-selected]').textContent = `${selected + 1}번 칸 편집`;
    root.querySelectorAll<HTMLButtonElement>('[data-round],[data-shift],[data-clear]').forEach(button => {
      const dest = selected + Number(button.dataset.shift ?? 0);
      button.disabled = !planning || dest < 0 || dest >= slots.length;
    });
    element<HTMLButtonElement>('[data-fire]').disabled = !planning || game.slots.includes(null);
    element('[data-log]').innerHTML = shots.length ? `<ol>${shots.map(s => `<li><span>${s.index + 1} · ${ammo[s.round].name}</span><b>피해 ${s.damage}</b><span>체력 ${s.before} → ${s.after}</span><small>${[shotNote(s), s.damage !== s.removed ? '실제 감소 ' + s.removed : ''].filter(Boolean).join(' · ')}</small></li>`).join('')}</ol>` : '<p>아직 발사한 탄이 없습니다.</p>';
  }
  game.reset();
}
