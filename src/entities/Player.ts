import { Magazine } from '../combat/Magazine';
import type { AmmoType } from '../combat/types';
import { AMMO_ORDER, STARTING_AMMO_STOCK, type AmmoStock } from '../data/ammoDefinitions';

export class Player {
  readonly magazine = new Magazine();
  isAlive = true;
  private stock: AmmoStock = { ...STARTING_AMMO_STOCK };

  getStock(): AmmoStock { return { ...this.stock }; }

  addAmmo(ammo: AmmoType): boolean {
    if (this.stock[ammo] <= 0 || !this.magazine.add(ammo)) return false;
    this.stock[ammo] -= 1;
    return true;
  }

  removeAmmo(index: number): boolean {
    const removed = this.magazine.remove(index);
    if (!removed) return false;
    this.stock[removed] += 1;
    return true;
  }

  replaceAmmo(index: number, ammo: AmmoType): boolean {
    const current = this.magazine.getRounds()[index];
    if (!current) return this.addAmmo(ammo);
    if (current === ammo) return true;
    if (this.stock[ammo] <= 0 || !this.magazine.set(index, ammo)) return false;
    this.stock[ammo] -= 1;
    this.stock[current] += 1;
    return true;
  }

  resupply(supply: AmmoStock): void {
    for (const ammo of AMMO_ORDER) this.stock[ammo] += supply[ammo];
  }

  reset(): void {
    this.magazine.clear();
    this.stock = { ...STARTING_AMMO_STOCK };
    this.isAlive = true;
  }
}
