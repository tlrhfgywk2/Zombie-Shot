import { Zombie } from '../entities/Zombie';
import { AMMO_DEFINITIONS, COMBAT_BALANCE } from '../data/ammoDefinitions';
import { scheduledEnemyAction } from './CombatResolver';
import { encounterStartingDistances } from '../data/encounterDefinitions';
import type { EnemyState, EnemyType, ShotResult } from './types';

export interface EncounterEnemy { id: string; lane: number; zombie: Zombie }
export const ENCOUNTER_BALANCE = { activeLimit: 2 } as const;

/** 탄창 하나마다 예고한 적 하나만 행동한다. 처치로 다른 적의 행동을 앞당기지 않는다. */
export class Encounter {
  private static serial = 0;
  private readonly serial = ++Encounter.serial;
  readonly enemies: EncounterEnemy[] = [];
  private readonly queue: string[] = [];
  private pending: EnemyType[];
  private selectedId = '';
  private nextId = 1;
  readonly total: number;
  readonly special: boolean;

  constructor(roster: readonly EnemyType[], reinforcements: readonly EnemyType[] = []) {
    if (roster.length < 1 || roster.length > ENCOUNTER_BALANCE.activeLimit) throw new Error('활성 감염체는 1~2마리여야 합니다.');
    this.pending = [...reinforcements];
    this.total = roster.length + reinforcements.length;
    this.special = [...roster, ...reinforcements].some(type => ['contaminator', 'groundshaker', 'screecher'].includes(type));
    const distances = encounterStartingDistances(roster);
    roster.forEach((type, lane) => this.spawn(type, lane, distances[lane]));
    this.selectedId = this.living[0]!.id;
  }

  get living(): EncounterEnemy[] { return this.enemies.filter(enemy => !enemy.zombie.isDead); }
  get selected(): EncounterEnemy { return this.enemies.find(enemy => enemy.id === this.selectedId)!; }
  get defeated(): number { return this.enemies.filter(enemy => enemy.zombie.isDead).length; }
  get reinforcements(): readonly EnemyType[] { return [...this.pending]; }
  get complete(): boolean { return this.living.length === 0 && this.pending.length === 0; }
  get nextActorId(): string | undefined { return this.queue.find(id => this.living.some(enemy => enemy.id === id)); }
  actionOrder(id: string): number { return this.queue.filter(key => this.living.some(enemy => enemy.id === key)).indexOf(id) + 1; }

  select(id: string): boolean {
    if (!this.living.some(enemy => enemy.id === id)) return false;
    this.selectedId = id;
    return true;
  }

  announceActions(): void {
    for (const { zombie } of this.living) {
      const state = zombie.snapshot();
      zombie.applyState({ ...state, telegraphedAction: state.telegraphedAction ?? scheduledEnemyAction(state) });
    }
  }

  finishOpportunity(id: string | undefined): void {
    if (!id) return;
    const index = this.queue.indexOf(id);
    if (index >= 0) this.queue.splice(index, 1);
    if (this.living.some(enemy => enemy.id === id)) this.queue.push(id);
  }

  /** 이동탄은 플레이어 이동이다. 표적 외 감염체에도 각자의 거리 경계를 적용한다. */
  applyShot(targetId: string, shot: ShotResult): void {
    const target = this.enemies.find(enemy => enemy.id === targetId);
    if (!target || target.zombie.isDead) throw new Error('살아 있는 표적이 필요합니다.');
    target.zombie.applyState(shot.after);
    const ammo = AMMO_DEFINITIONS[shot.ammoType];
    for (const other of this.living) {
      if (other.id === targetId) continue;
      const state: EnemyState = other.zombie.snapshot();
      for (const movement of [ammo.moveBefore ?? 0, ammo.moveAfter ?? 0]) {
        state.distance = Math.max(0, Math.min(COMBAT_BALANCE.maxDistance, state.distance + movement));
      }
      other.zombie.applyState(state);
    }
  }

  /** 사망 연출 뒤 빈 차선만 채운다. 신규 적은 이번 탄창의 예고된 행동자를 대체하지 않는다. */
  settleDeaths(): EncounterEnemy[] {
    const arrived: EncounterEnemy[] = [];
    for (let lane = 0; lane < ENCOUNTER_BALANCE.activeLimit && this.pending.length; lane += 1) {
      if (this.living.some(enemy => enemy.lane === lane)) continue;
      arrived.push(this.spawn(this.pending.shift()!, lane));
    }
    if (this.selected.zombie.isDead && this.living.length) this.selectedId = this.living[0]!.id;
    return arrived;
  }

  private spawn(type: EnemyType, lane: number, distance?: number): EncounterEnemy {
    const enemy = { id: `encounter-${this.serial}-enemy-${this.nextId++}`, lane, zombie: new Zombie(type) };
    if (distance !== undefined) enemy.zombie.applyState({ ...enemy.zombie.snapshot(), distance });
    this.enemies.push(enemy);
    this.queue.push(enemy.id);
    return enemy;
  }
}
