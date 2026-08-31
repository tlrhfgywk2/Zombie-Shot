import { COMBAT_BALANCE } from '../data/ammoDefinitions';
import type { AmmoType } from './types';

export class Magazine {
  private rounds: AmmoType[] = [];

  get capacity(): number {
    return COMBAT_BALANCE.magazineCapacity;
  }

  get size(): number {
    return this.rounds.length;
  }

  getRounds(): readonly AmmoType[] {
    return [...this.rounds];
  }

  add(ammo: AmmoType): boolean {
    if (this.rounds.length >= this.capacity) return false;
    this.rounds.push(ammo);
    return true;
  }

  set(index: number, ammo: AmmoType): boolean {
    if (index < 0 || index >= this.capacity) return false;
    if (index > this.rounds.length) return false;
    if (index === this.rounds.length) return this.add(ammo);
    this.rounds[index] = ammo;
    return true;
  }

  remove(index: number): AmmoType | undefined {
    if (index < 0 || index >= this.rounds.length) return undefined;
    return this.rounds.splice(index, 1)[0];
  }

  swap(first: number, second: number): boolean {
    if (first < 0 || second < 0 || first >= this.rounds.length || second >= this.rounds.length) return false;
    const a = this.rounds[first];
    const b = this.rounds[second];
    if (!a || !b) return false;
    this.rounds[first] = b;
    this.rounds[second] = a;
    return true;
  }

  clear(): void {
    this.rounds = [];
  }
}
