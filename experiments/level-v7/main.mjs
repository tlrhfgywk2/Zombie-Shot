/* global document, window, URLSearchParams */
import './style.css';
import * as p from './bridge.ts';
import { GamePresentation } from '../../src/presentation/GamePresentation.ts';
import { BUILD_LABEL } from '../../src/buildInfo.ts';
import { createModel, capacity, total, UPGRADE_PRIORITY } from './model-portable.mjs';
import config from './v7-config.json';
import settings from './candidate-6.json';
import { LevelSession, observe } from './engine.mjs';
import { BUILD_NAMES, PACKS } from './design.mjs';

const parameters = new URLSearchParams(window.location.search);
const seed = Number(parameters.get('seed') ?? 21001);
const target = parameters.get('build') ?? 'wound';
const session = new LevelSession(p, createModel(p, config), config, seed, BUILD_NAMES[target] ? target : 'wound', 'nine-linked', settings);
let rounds = [], busy = false, lastTrace;
const name = id => id === 'cauterize' ? '소작탄' : id === 'resonance' ? '공명기폭탄' : p.AMMO_DEFINITIONS[id].name;
const visual = id => id === 'cauterize' ? 'kindling' : id;
const color = id => id === 'cauterize' ? '#ffae71' : p.AMMO_DEFINITIONS[id].cssColor;
document.querySelector('#app').innerHTML = `
  <header><b>좀비 샷 <small>레벨 v7 · 검토 후보</small></b><span id="progress"></span><small>${BUILD_LABEL}</small></header>
  <main><section class="stage"><div id="scene"></div><div id="enemy"></div><div id="status"></div></section>
  <section class="controls"><h1 id="title"></h1><div id="choices"></div><div id="combat" hidden>
    <div class="load-summary"><span>탄창 <b id="capacity"></b></span><span>예상 피해 <b id="damage"></b></span></div>
    <div id="magazine"></div><div class="actions"><button id="clear">비우기</button><button id="fire">장전 · 사격</button></div>
    <div id="stock"></div><details id="ammo-guide"><summary>탄약 효과</summary><div id="effects"></div></details></div></section></main>`;
const presentation = new GamePresentation(document.querySelector('#scene'));
presentation.setAudioPreferences({ muted: true, volume: .5 });
presentation.setPlaybackSpeed(parameters.get('validation') === '1' ? 2 : 1);
presentation.setQuickFiring(true);
const button = (label, attributes = '', detail = '') => `<button ${attributes}><strong>${label}</strong>${detail ? `<small>${detail}</small>` : ''}</button>`;
const slug = id => id.replace(/[^a-zA-Z0-9]/g, '');
function effect(id) {
  const g = session.run.ranks[id] ?? 0;
  return ({ ball: '표준탄 반동 0', opening: `첫 칸 화력 +${3 + 2 * g}`, plusP: '직접 화력 · 반동 3',
    lowRecoil: `사격 전 반동 ${2 + g} 회복`, relay: `다음 한 발 화력 +${4 + 4 * g}`,
    kickback: `반동 전부 소비 · 화력 +반동×${2 + g}`, retreat: '사격 후 2m 후퇴', advance: '2m 전진 후 사격',
    mimic: '직전 주효과 100% 복사', afterimage: '직전 주효과 50% 추가',
    wounding: `상처 +${3 + g} · 6 도달 후 취약`, laceration: `상처 +2 · 취약 시 화력 ×${2 + .5 * g}`,
    incendiary: `열 +${8 + 6 * g}`, accelerant: `열 +${2 + 6 * g} · 다음 한 발 열 ×${2 + .5 * g}`,
    ignition: `열 전부 소비 · 피해 열×${2 + g}`, cauterize: `상처 3 이상 또는 취약 · 열 소비 피해 ×${(2 + g) * 1.5}`,
    explosive: `폭약 +${2 + 4 * g}`, stickyCharge: `폭약 +${4 + 4 * g}`, flatNose: `충격 +${4 + 2 * g} · 폭약×4 기폭`,
    resonance: `폭약에 충격×${1 + g} 투자 후 기폭 · 충격 +${2 + 2 * g}` })[id];
}
function render() {
  document.body.dataset.phase = busy ? 'busy' : session.phase;
  document.querySelector('#progress').textContent = `${session.depth}/9`;
  document.querySelector('#title').textContent = session.node?.title ?? '동굴 입구';
  document.querySelector('#choices').innerHTML = '';
  document.querySelector('#combat').hidden = session.phase !== 'combat';
  const choices = document.querySelector('#choices');
  presentation.setExploring(session.phase !== 'combat');
  if (['ready', 'advance'].includes(session.phase)) choices.innerHTML = button('계속 탐험', 'data-action="advance"');
  else if (session.phase === 'discovery') choices.innerHTML = Object.entries(PACKS).map(([id, pack]) => button(BUILD_NAMES[id], `data-build="${id}"`, `${pack.slice(0, 2).map(name).join(' · ')} / 다음 전투 승리: ${name(pack[2])}`)).join('');
  else if (session.phase === 'reward') choices.innerHTML = session.node.offers.map(id => button(name(id), `data-reward="${id}"`, '배분 +1')).join('');
  else if (session.phase === 'workshop') {
    const eligible = [...new Set(Object.values(UPGRADE_PRIORITY).flat())].filter(id => session.run.stock[id] > 0 && (session.run.ranks[id] ?? 0) < 3);
    choices.innerHTML = `<h2>제작 강화</h2><div class="choice-grid">${eligible.map(id => button(name(id), `data-upgrade="${id}" ${session.workshopUsed === session.depth ? 'disabled' : ''}`, `등급 ${session.run.ranks[id] ?? 0} → ${(session.run.ranks[id] ?? 0) + 1}`)).join('')}</div>
      <h2>부착물 교환</h2><label>지불 탄약 <select id="payment">${Object.entries(session.run.stock).filter(([, n]) => n > 0).map(([id, n]) => `<option value="${id}">${name(id)} ×${n}</option>`).join('')}</select></label>
      <div class="choice-grid">${session.node.attachments.map(id => button(p.ATTACHMENT_DEFINITIONS[id].name, `data-attachment="${id}" ${session.tradeUsed === session.depth ? 'disabled' : ''}`, p.ATTACHMENT_DEFINITIONS[id].summary + ' · 특수탄 1발 영구 지불')).join('')}</div>${button('계속 탐험', 'data-action="leave"')}`;
    if (session.depth === 7) choices.insertAdjacentHTML('afterbegin', `<h2>추가 배분 · 한 종류 +1</h2><div class="choice-grid">${Object.keys(session.run.stock).filter(id => session.run.stock[id] > 0).map(id => button(name(id), `data-reinforce="${id}" ${session.reinforced || total(session.run.stock) >= 14 ? 'disabled' : ''}`, '휴대 한도 내 1회')).join('')}</div>`);
  } else if (session.phase === 'combat') {
    const enemy = session.enemy, preview = session.model.resolve(rounds, enemy, session.run, { player: session.player, trace: true });
    const next = p.previewEnemyAction(enemy);
    document.querySelector('#enemy').innerHTML = `<span>${p.ENEMY_DEFINITIONS[enemy.type].name} <small>${session.wave + 1}/${session.node.waves.length}</small></span><b>${enemy.hp}<small>/${enemy.maxHp}</small></b><progress value="${enemy.hp}" max="${enemy.maxHp}"></progress>`;
    const actionName = { approach: '접근', attack: '치명 공격', contaminate: '오염', groundShock: '지반 충격', sonicPulse: '초음파' }[next.selectedAction];
    document.querySelector('#status').innerHTML = `<span>거리 <b>${Number(enemy.distance.toFixed(1))}m</b></span><span>${actionName} 중단 <b>${enemy.actionShock}/${next.threshold}</b></span><span>상처 <b>${enemy.wound}/6</b></span><span>열 <b>${enemy.burn}</b></span><span>폭약 <b>${enemy.explosive}</b></span>`;
    document.querySelector('#capacity').textContent = `${rounds.length}/${capacity(session.run, p, session.player)}`;
    document.querySelector('#damage').textContent = `${preview.damage}`;
    document.querySelector('#magazine').innerHTML = Array.from({ length: capacity(session.run, p, session.player) }, (_, index) => {
      const id = rounds[index], trace = preview.trace[index];
      return `<button class="slot ${id && !trace ? 'unused' : ''}" data-slot="${index}" ${!id ? 'disabled' : ''} style="--ammo-color:${id ? color(id) : '#667066'}"><span class="round">${index + 1}</span>${id ? `<i class="bullet"></i><strong>${name(id)}</strong><b>${trace ? trace.power : '—'}</b>` : '<strong>빈 칸</strong>'}</button>`;
    }).join('');
    document.querySelector('#effects').innerHTML = ['ball', ...Object.keys(session.run.stock).filter(id => session.run.stock[id] > 0)]
      .map(id => `<p><strong>${name(id)}</strong> · ${effect(id)}</p>`).join('');
    document.querySelector('#stock').innerHTML = ['ball', ...Object.keys(session.run.stock).filter(id => session.run.stock[id] > 0)].map(id => {
      const remaining = id === 'ball' ? '∞' : (session.available[id] ?? 0) - rounds.filter(x => x === id).length;
      return `<button data-ammo="${id}" ${rounds.length >= capacity(session.run, p, session.player) || remaining === 0 ? 'disabled' : ''} style="--ammo-color:${color(id)}"><i class="bullet"></i><strong>${name(id)}</strong><span>${remaining}</span><small>등급 ${session.run.ranks[id] ?? 0}</small></button>`;
    }).join('');
    presentation.setAttachments(session.run.loadout, session.player);
    presentation.setZombie(enemy.distance, enemy.hp / enemy.maxHp, session.depth, enemy.type, enemy.ignitedActions > 0);
  } else if (['victory', 'defeat', 'timeout'].includes(session.phase)) {
    document.querySelector('#title').textContent = session.phase === 'victory' ? '동굴 탈출' : '탐험 실패';
    choices.innerHTML = button('다시 시작', 'data-action="restart"');
  }
  if (session.phase !== 'combat') {
    document.querySelector('#enemy').innerHTML = '';
    document.querySelector('#status').innerHTML = '';
  }
  document.querySelector('#fire').disabled = busy;
  document.querySelector('#clear').disabled = busy;
  for (const element of document.querySelectorAll('button,select')) if (busy) element.disabled = true;
}
async function fire() {
  if (busy || session.phase !== 'combat') return;
  busy = true;
  const before = { ...session.enemy }, planned = [...rounds];
  const shot = session.model.resolve(planned, session.enemy, session.run, { player: session.player, trace: true });
  render();
  await presentation.animateLoading(planned.map(visual), true);
  for (const trace of shot.trace) {
    if (trace.id === 'advance') await presentation.animateDistanceChange(trace.after.distance);
    await presentation.animateShot(visual(trace.id), trace.chargeConsumed);
    presentation.setZombie(trace.after.distance, trace.after.hp / trace.after.maxHp, session.depth, before.type, trace.after.ignitedActions > 0);
    if (trace.id === 'retreat') await presentation.animateDistanceChange(trace.after.distance);
  }
  await presentation.animateMagazineDiscard();
  if (shot.killed) await presentation.animateDeath();
  const previousWave = session.wave;
  lastTrace = session.fire(planned);
  if (lastTrace.action?.movement > 0) await presentation.animateAdvance(lastTrace.action.after.distance);
  if (session.phase === 'combat' && session.wave !== previousWave) {
    presentation.resetZombie(session.enemy.distance);
    await presentation.animateSpawn(session.enemy.distance);
  }
  rounds = []; busy = false; render();
}
document.addEventListener('click', async event => {
  const element = event.target.closest('button');
  if (!element || element.disabled || busy) return;
  if (element.dataset.ammo) { rounds.push(element.dataset.ammo); render(); }
  else if (element.dataset.slot) { rounds.splice(Number(element.dataset.slot), 1); render(); }
  else if (element.id === 'clear') { rounds = []; render(); }
  else if (element.id === 'fire') await fire();
  else if (element.dataset.build) { session.run.archetype = element.dataset.build; session.chooseDiscovery(element.dataset.build); render(); }
  else if (element.dataset.reward) { session.chooseReward(element.dataset.reward); render(); }
  else if (element.dataset.upgrade) { session.upgrade(element.dataset.upgrade); render(); }
  else if (element.dataset.reinforce) { session.reinforce(element.dataset.reinforce); render(); }
  else if (element.dataset.attachment) { session.tradeAttachment(element.dataset.attachment, document.querySelector('#payment').value); render(); }
  else if (element.dataset.action === 'advance') {
    session.advance(); rounds = [];
    if (session.phase === 'combat') {
      busy = true; render(); presentation.resetZombie(session.enemy.distance);
      await presentation.animateSpawn(session.enemy.distance); busy = false;
    }
    render();
  } else if (element.dataset.action === 'leave') { session.leave(); render(); }
  else if (element.dataset.action === 'restart') window.location.reload();
});
if (parameters.get('validation') === '1') window.levelValidation = {
  snapshot: () => ({ phase: session.phase, busy, depth: session.depth, wave: session.wave, observation: session.phase === 'combat' ? observe(session) : null,
    run: JSON.parse(JSON.stringify(session.run)), node: session.node, lastTrace, rounds: [...rounds] }),
  // 경계 시나리오 전용. 실제 진행 검사는 이 메서드를 호출하지 않는다.
  fixture: setup => {
    if (busy) throw new Error('진행 중에는 fixture 금지');
    Object.assign(session, setup); rounds = [];
    if (session.enemy) presentation.resetZombie(session.enemy.distance);
    render();
  },
  slug,
};
render();
