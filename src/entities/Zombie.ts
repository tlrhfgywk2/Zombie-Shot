import { COMBAT_BALANCE } from '../data/ammoDefinitions';

export class Zombie {
  hp: number;
  readonly maxHp: number;
  distance: number;
  burnTicks = 0;

  constructor(public readonly level = 1) {
    this.maxHp = COMBAT_BALANCE.zombieInitialHp + (level - 1) * COMBAT_BALANCE.zombieHpGrowth;
    this.hp = this.maxHp;
    this.distance = COMBAT_BALANCE.zombieInitialDistance;
  }

  get isDead(): boolean {
    return this.hp <= 0;
  }

  takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - Math.max(0, amount));
  }

  applyBurn(ticks: number): void {
    this.burnTicks += ticks;
  }

  resolveBurn(): number {
    if (this.burnTicks <= 0) return 0;
    const damage = COMBAT_BALANCE.burnDamagePerStack * this.burnTicks;
    this.takeDamage(damage);
    this.burnTicks = Math.max(0, this.burnTicks - 1);
    return damage;
  }

  advance(): void {
    this.distance = Math.max(0, this.distance - COMBAT_BALANCE.zombieAdvancePerCycle);
  }
}
