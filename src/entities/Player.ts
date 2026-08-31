import { Magazine } from '../combat/Magazine';

export class Player {
  readonly magazine = new Magazine();
  isAlive = true;

  reset(): void {
    this.magazine.clear();
    this.isAlive = true;
  }
}
