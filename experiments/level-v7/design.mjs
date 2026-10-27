import { rng, pick, shuffle } from './random.mjs';
import { AMMO } from './model-portable.mjs';

export const BUILD_NAMES = { wound: '상처·취약', heat: '열 저장·소비', blast: '설치·기폭', recoil: '고압·반동 회수', cauterize: '상처·열 소작', concussion: '충격·폭약 공명' };
export const PACKS = {
  wound: ['wounding', 'wounding', 'laceration'], heat: ['incendiary', 'ignition', 'accelerant'],
  blast: ['stickyCharge', 'explosive', 'flatNose'], recoil: ['plusP', 'plusP', 'kickback'],
  cauterize: ['wounding', 'incendiary', 'cauterize'], concussion: ['flatNose', 'stickyCharge', 'resonance'],
};
export const DEFAULT_SETTINGS = { id: 'candidate-1', bossDistance: 3.5, guard: 'normal', dangerDistance: 3.2, workshopRanks: 2, waves: 2 };
export const encounter = (enemy, distance, role) => ({ enemy, distance, role });
export function makePlan(seed, variant, p, settings = DEFAULT_SETTINGS) {
  const random = rng(seed), owned = [];
  const offers = () => shuffle(Object.keys(AMMO).filter(x => x !== 'ball'), random).slice(0, 3);
  const attachment = () => {
    const choices = [];
    for (let i = 0; i < 2; i++) {
      const id = p.generateAttachmentReward([...owned, ...choices], 'p220', random);
      if (id) choices.push(id);
    }
    owned.push(...choices); return choices;
  };
  const combat = (waves, title) => ({ kind: 'combat', title, waves, offers: offers() });
  const first = combat([encounter('normal', 8, 'regular')], '진입 통로');
  const discovery = { kind: 'discovery', title: '밀봉된 탄약 상자', offers: Object.keys(PACKS) };
  const training = combat([encounter(pick(['brute', 'fast'], random), pick([5, 6], random), 'dangerous')], '추격 흔적');
  const workshop = () => ({ kind: 'workshop', title: '회수 작업대', attachments: attachment(), offers: offers() });
  const tactical = combat([encounter(pick(['tough', 'contaminator'], random), pick([6, 8], random), 'elite')], '굴곡진 통로');
  const danger = combat([encounter(pick(['fast', 'groundshaker', 'screecher'], random), settings.dangerDistance, 'dangerous')], '무너진 연결로');
  const boss = combat([
    encounter(settings.guard, 6, 'regular'),
    encounter(pick(['groundshaker', 'screecher', 'contaminator'], random), rng(seed ^ 0x4c617465)() < (settings.ambushFraction ?? 0) ? .5 : settings.bossDistance, 'boss'),
    ...(settings.waves > 2 ? [encounter(settings.finalEnemy ?? 'tough', rng(seed ^ 0x656e6421)() < (settings.finalAmbushFraction ?? 0) ? .5 : 3.5, 'elite')] : []),
  ], '출구 경비');
  const exit = { kind: 'exit', title: '동굴 출구' };
  let plan = [first, discovery, training, workshop(), tactical, danger, workshop(), boss, exit];
  if (variant === 'twelve-linked') plan = [first, discovery, training, workshop(), combat([encounter('normal', 6, 'regular')], '잔류 감염체'), tactical,
    { kind: 'supply', title: '남겨진 탄약', offers: offers() }, danger, workshop(), combat([encounter('tough', 5, 'elite')], '지하 수로'), boss, exit];
  if (variant === 'nine-original-pacing') {
    const original = new p.ExplorationRun(`level-${seed}`);
    plan = original.layers.map((layer, i) => {
      const route = layer[0];
      if (route.kind === 'combat') return { kind: 'combat', title: '현행 배치', waves: [encounter(route.enemy, p.ENEMY_DEFINITIONS[route.enemy].distance, i >= 5 ? 'boss' : 'regular')], offers: route.rewards.filter(id => AMMO[id]) };
      if (route.kind === 'event') return { kind: 'rest', title: '현행 사건 경유 · 대조군' };
      return { kind: route.kind === 'exit' ? 'exit' : 'rest', title: '현행 경유지' };
    });
  }
  return plan.map((node, index) => ({ ...node, depth: index + 1 }));
}
