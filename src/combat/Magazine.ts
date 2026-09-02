import { COMBAT_BALANCE } from '../data/ammoDefinitions';
import type { AmmoType } from './types';

export class Magazine {
  private rounds: AmmoType[] = [];
  private currentCapacity: number = COMBAT_BALANCE.baseMagazineCapacity;
  get capacity(): number { return this.currentCapacity; }
  get size(): number { return this.rounds.length; }
  getRounds(): readonly AmmoType[] { return [...this.rounds]; }

  setCapacity(capacity: number): AmmoType[] {
    this.currentCapacity = Math.max(COMBAT_BALANCE.minimumMagazineCapacity, Math.min(COMBAT_BALANCE.maximumMagazineCapacity, Math.floor(capacity)));
    return this.rounds.splice(this.currentCapacity);
  }

  add(ammo: AmmoType): boolean { if (this.rounds.length >= this.capacity) return false; this.rounds.push(ammo); return true; }
  set(index: number, ammo: AmmoType): boolean { if (index < 0 || index >= this.capacity || index > this.rounds.length) return false; if (index === this.rounds.length) return this.add(ammo); this.rounds[index] = ammo; return true; }
  remove(index: number): AmmoType | undefined { if (index < 0 || index >= this.rounds.length) return undefined; return this.rounds.splice(index, 1)[0]; }
  swap(first: number, second: number): boolean { if (first < 0 || second < 0 || first >= this.rounds.length || second >= this.rounds.length) return false; const a = this.rounds[first]; const b = this.rounds[second]; if (!a || !b) return false; this.rounds[first] = b; this.rounds[second] = a; return true; }
  move(from: number, to: number): boolean { if (from < 0 || from >= this.rounds.length || to < 0 || to > this.rounds.length) return false; if (from === to || (from === this.rounds.length - 1 && to === this.rounds.length)) return true; const [round] = this.rounds.splice(from, 1); if (!round) return false; this.rounds.splice(Math.min(to, this.rounds.length), 0, round); return true; }
  clear(): void { this.rounds = []; }
}
