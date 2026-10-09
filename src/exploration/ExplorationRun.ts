import type { EnemyType } from '../combat/types';
import type { SpecialAmmoType } from '../data/ammoDefinitions';
import type { AttachmentId } from '../data/attachmentDefinitions';

export type ExplorationTool = 'echo' | 'uv' | 'map';
export const EXPLORATION_TOOLS: Record<ExplorationTool, { name: string; detail: string }> = {
  echo: { name: '진동 청음기', detail: '갈림길의 생체 반응과 강한 교란을 감지' },
  uv: { name: '자외선 등', detail: '갈림길의 거래 흔적·시설·출구를 식별' },
  map: { name: '찢어진 측량도', detail: '선택한 길의 목적지를 2회 확인' },
};
export type CaveEvent = 'cache' | 'survey' | 'shrine' | 'nest';
export interface CaveEncounter {
  id: string;
  kind: 'combat' | 'event' | 'merchant' | 'exit';
  enemy?: EnemyType;
  event?: CaveEvent;
  rewards: readonly SpecialAmmoType[];
  attachment?: AttachmentId;
}
export interface MerchantOffer {
  id: string; name: string; detail: string; price: number;
  ammo?: SpecialAmmoType; amount?: number; attachment?: AttachmentId; tool?: ExplorationTool; capacity?: number;
}
export const merchantOffers = (encounter: CaveEncounter): MerchantOffer[] => [
  { id: 'map', name: '찢어진 측량도', detail: '길 하나의 목적지 확인 · 2회', price: 1, tool: 'map' },
  { id: 'echo', name: '진동 청음기', detail: EXPLORATION_TOOLS.echo.detail, price: 1, tool: 'echo' },
  { id: 'uv', name: '자외선 등', detail: EXPLORATION_TOOLS.uv.detail, price: 1, tool: 'uv' },
  { id: 'ammo', name: '밀봉 탄약 묶음', detail: '특수탄 3발', price: 1, ammo: encounter.rewards[0]!, amount: 3 },
  { id: 'attachment', name: '회수한 부착물', detail: '획득 후 전투 준비에서 장착', price: 2, attachment: encounter.attachment },
  { id: 'capacity', name: '탄약 주머니', detail: '휴대 한도 +4', price: 1, capacity: 4 },
];

/** 문자열 시드만 사용하며 결과는 런 생성 시 모두 확정한다. */
export function seededRandom(seed: string): () => number {
  let value = 2166136261;
  for (const char of seed) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return () => {
    value += 0x6d2b79f5;
    let mixed = Math.imul(value ^ value >>> 15, value | 1);
    mixed ^= mixed + Math.imul(mixed ^ mixed >>> 7, mixed | 61);
    return ((mixed ^ mixed >>> 14) >>> 0) / 4294967296;
  };
}
const rewardPool: readonly SpecialAmmoType[] = ['hollowPoint', 'plusP', 'lowRecoil', 'wounding', 'laceration', 'hammer', 'retreat', 'advance', 'relay', 'opening', 'finisher'];
const eventPool: readonly CaveEvent[] = ['cache', 'survey', 'shrine', 'nest'];
const pick = <T>(pool: readonly T[], random: () => number): T => pool[Math.floor(random() * pool.length)]!;
export const RUN_LENGTH = 8;

export class ExplorationRun {
  readonly layers: readonly (readonly CaveEncounter[])[];
  readonly tools = new Set<ExplorationTool>();
  depth = 0;
  awareness = 0;
  mapCharges = 0;
  victories = 0;
  avoided = 0;
  nextDistancePenalty = 0;
  active?: CaveEncounter;
  readonly revealed = new Set<string>();
  readonly purchased = new Set<string>();
  private settled = false;

  constructor(readonly seed: string) {
    const random = seededRandom(seed);
    this.layers = Array.from({ length: RUN_LENGTH }, (_, index) => {
      const depth = index + 1;
      const eventIndex = Math.floor(random() * eventPool.length);
      return Array.from({ length: depth === RUN_LENGTH ? 1 : 2 }, (_, branch): CaveEncounter => {
        const firstReward = pick(rewardPool, random);
        const rewards = [firstReward, pick(rewardPool.filter(ammo => ammo !== firstReward), random)];
        const id = `${depth}-${branch}`;
        if (depth === RUN_LENGTH) return { id, kind: 'exit', rewards: [] };
        if (depth === 2 || depth === 6) return { id, kind: 'event', event: eventPool[(eventIndex + branch) % eventPool.length], rewards };
        if (depth === 4) return { id, kind: 'merchant', rewards, attachment: pick(['texturedGrip', 'compensator', 'laserSight'] as const, random) };
        const enemy = depth === 1 ? 'normal' : depth === 7 ? pick(['screecher', 'groundshaker'] as const, random)
          : pick(depth === 3 ? ['normal', 'brute'] as const : ['brute', 'fast', 'tough'] as const, random);
        return { id, kind: 'combat', enemy, rewards, attachment: depth === 7 ? 'texturedGrip' : undefined };
      });
    });
  }
  get routes(): readonly CaveEncounter[] { return this.layers[this.depth] ?? []; }
  acquire(tool: ExplorationTool): boolean {
    if (this.tools.has(tool)) return false;
    this.tools.add(tool);
    if (tool === 'map') this.mapCharges = 2;
    else this.awareness = Math.min(3, this.awareness + 1);
    return true;
  }
  inspect(index: number): boolean {
    const route = this.routes[index];
    if (!route || this.mapCharges <= 0 || this.revealed.has(route.id) || this.active) return false;
    this.mapCharges -= 1;
    this.revealed.add(route.id);
    return true;
  }
  routeClues(route: CaveEncounter): string[] {
    if (this.revealed.has(route.id)) return [encounterName(route)];
    const clues: string[] = [];
    if (this.tools.has('echo')) clues.push(route.kind === 'combat'
      ? this.isDisruptor(route) ? '강한 공명 · 인지 교란' : '생체 반응' : route.kind === 'merchant' ? '고른 호흡' : '움직임 없음');
    if (this.tools.has('uv')) clues.push(route.kind === 'merchant' ? '거래 표식' : route.kind === 'event' ? '오래된 시설'
      : route.kind === 'exit' ? '바깥의 빛' : '자연 동굴');
    return clues.length ? clues : ['목적지 미확인'];
  }
  enter(index: number): CaveEncounter | undefined {
    if (this.active) return undefined;
    const route = this.routes[index];
    if (!route) return undefined;
    this.active = route;
    this.depth += 1;
    this.settled = false;
    return route;
  }
  isDisruptor(encounter = this.active): boolean { return encounter?.enemy === 'screecher' || encounter?.enemy === 'groundshaker'; }
  canAvoid(): boolean {
    return this.active?.kind === 'combat' && !this.settled && !this.isDisruptor()
      && this.awareness >= (this.active.enemy === 'fast' ? 3 : 2);
  }
  settleCombat(avoid = false): boolean {
    if (this.active?.kind !== 'combat' || this.settled || (avoid && !this.canAvoid())) return false;
    this.settled = true;
    if (avoid) { this.avoided += 1; this.awareness -= 1; }
    else { this.victories += 1; this.awareness = Math.min(3, this.awareness + 1); }
    return true;
  }
  leave(): void { this.active = undefined; }
}

export const EVENT_NAMES: Record<CaveEvent, string> = {
  cache: '물이 스미는 보급함', survey: '끊어진 관측선', shrine: '탄피가 쌓인 제단', nest: '숨 쉬는 균사 둥지',
};
export const encounterName = (encounter: CaveEncounter): string => encounter.kind === 'event' ? EVENT_NAMES[encounter.event!]
  : encounter.kind === 'merchant' ? '말하는 감염체' : encounter.kind === 'exit' ? '동굴 출구'
  : encounter.enemy === 'screecher' ? '공명 비명체' : encounter.enemy === 'groundshaker' ? '지반 파쇄체'
  : encounter.enemy === 'brute' ? '강인한 감염체' : encounter.enemy === 'fast' ? '질주 감염체'
  : encounter.enemy === 'tough' ? '거대 감염체' : '일반 감염체';
